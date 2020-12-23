<template>
	<view class="container " style="width: 100%;">
		  <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		  @onConfirm="onConfirm"></mpvue-city-picker>
		
		<view class="list-cell b-b m-t flex c-center" style="align-items: center;" @click="choseimg()" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit w50p flex c-center">头像</text>
			<view class="w50p flex m-end">
				<image style="width: 2.6rem;height: 2.6rem; border-radius: 50%;" class="input" :src="user.headImg||user.wxHeadImg||conf.defaultImg" ></image>
			</view>
			
		</view>
		
		<view class="list-cell b-b m-t row flex m-end"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">手机号码</text>
			<input class="input" type="number" style="text-align: right;"  v-model="user.mobile" disabled="true"  placeholder="真实手机号码" placeholder-class="placeholder" />
		</view>
		
		<view class="list-cell b-b m-t row flex m-end"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<input class="input" type="text" style="text-align: right;" v-model="user.nickName"  placeholder="" placeholder-class="placeholder" />
		</view>
		
		

		
		<!-- <view class="list-cell b-b m-t row"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">我的邀请码</text>
			
			 <input class="input" type="number" v-model="user.id" disabled="true" placeholder-class="placeholder" /> 
			
		</view>
			
		
		<view class="list-cell b-b m-t row"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">我的上级</text>
			
			<input class="input" type="number" v-model="user.guiderId" disabled="true"  placeholder="输入邀请码" placeholder-class="placeholder" />
		</view> -->
		
		<!-- <view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view> -->
		<view class="list-cell m-t b-b" @click="$toast('已经清空缓存')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view>

		
	     <view class="list-cell b-b" @tap="updatePwd()" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改密码</text>
			<!-- <text class="cell-more yticon icon-you"></text> -->
		</view> 
		<view class="list-cell" @tap="toLogout()"  style="margin-top: 0.4rem;">
			<text class="cell-tit">退出登录</text>
			<!-- <text class="cell-more yticon icon-you"></text> -->
		</view>
		
		<view class="list-cell log-out-btn center90 " style="background-color: #F0AD4E; color: #ffffff;" @click="refreshwx()">
			<text class="cell-tit ">刷新微信信息</text>
		</view>
		
		<view class="list-cell log-out-btn center90" style="background-color: #F0AD4E; color: #ffffff;" @click="confirm()">
			<text class="cell-tit ">保存</text>
		</view>
		
		<!-- <view class="list-cell log-out-btn" @click="refresh_wx_info()">
			<text class="cell-tit">刷新微信帐号</text>
		</view> -->
		
		<!-- <view class="list-cell log-out-btn" @click="confirm">
			<text class="cell-tit">确认</text>
		</view> -->
	</view>
</template>

<script>

	 import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'

	

	
	export default {
		components: {
		    
		    mpvueCityPicker
		},
		data() {
			let _conf=this.getConst();
			
			return {
				conf:_conf,
				user:{
					"id":"",
					"guiderId":"",
					"sex":"",
					"mobile":"",
					"province":'',
					"city":'',
					"district":'',
					"menEndAt":'',
					"headImg":""
				},
				edit_city_picker:true,
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
				pickerText: '',
				
				edit_guider:false,
				
			};
		},
		onLoad(options) {			
			this.loadData();
		},
		onShow() {
			this.$toast(this.getConst().version_code);
			
		},
		
		methods:{
			refreshwx(){
				if("H5"==this.getPlat()){
					this.$updatewxuser();
				}else{
					this.$updatewxappuser();
				}
				
				
			},
			
			choseimg(){
				this.$chooseImageUpload(1,res=>{
					console.log(res);
					this.user.headImg=res[0];
				})
				
			},
			
			refresh_wx_info(){
				let _userInfo=this.$dataLocal("user_info");
				this.$refreshUser(_userInfo.id,(e)=>{
					_userInfo=this.$dataLocal("user_info");
					let wxuser=this.$dataLocal("wxuser");
					if(!wxuser){
						this.$toast("当前登录信息失效,请重新登录");
						setTimeout((res)=>{
							this.$redirectTo("/pages/login/login");
						},1000)
						return;
					}				
					_userInfo.nickName=wxuser.nickName;
					_userInfo.headImg=wxuser.headImg;
					_userInfo.wxOpenId=wxuser.wxOpenId;		
					_userInfo.wxUnionId=wxuser.wxUnionId;
						
				
					this.$post("user/update",_userInfo,(ress)=>{})										
				})
				
			},
			updatePwd(){
				console.log("hello")
				uni.navigateTo({
					"url":"/pages/login/forget"
				})
				
			},

			
			showMulLinkageThreePicker() {
				if(this.edit_city_picker===false){return}
				
			    this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				console.log(e);
				 this.pickerText=e.label;
				 var li=this.pickerText.split('-');
				 var prov=li[0];
				 var city=li[1];
				 var dist=li[2];
				 this.user.province=prov;
				 this.user.city=city;
				 this.user.district=dist;
				 this.user.agtId=-1;
	
				
				/* var cho_area=0;
				for(var i in cityData3){
		        var ite=cityData3[i];
		        if(prov===ite.text){
		        	console.log(ite)
		           for(var j in ite.children){
		              var itee=ite.children[j];
		               if(city===itee.text){
		            	   console.log(itee)
		                  for(var k in itee.children){
		                      var item=itee.children[k];
		                      if(dist===item.text){
			                      cho_area=item.value;
		                        };                      
		                      }
		                   }	              
		               }	    
		          }
		        }
				 var _this=this;
				 this.$post("city/find",{id:cho_area},function(res){
					 _this.user.agtId=res.data.holder||100000;
				 },function(res){
					_this.user.agtId=100000;
				 })	 */			 
			},
			
			
			
			loadData(){
				var o={};
				var user_local=this.$dataLocal("user_info")||{};
				//console.log("user_local",user_local);
				o.id=user_local.id;
				var _this=this;
				this.$post("user/find",o,function(res){
					_this.user=res.data;
					if(!!res.data.province&&!!res.data.city&&!!res.data.district){
						_this.pickerText=res.data.province+"-"+res.data.city+"-"+res.data.district
					}
					if(res.data.agtId>99999){   //当agtid 为真实值得时候，不可编辑注册区域 100000为区域没有代理的时候的默认代理id 也算是真实值
						_this.edit_city_picker=false;
					}
					if(res.data.guiderId>99999){ //当guider 为真实值得时候，不可编辑注册区域
						_this.edit_guider=true;
					}
					
					if(!!_this.user.menEndAt){
						_this.user.menEndAt=this.$getDateStr(_this.user.menEndAt,"yyyy-MM-dd")
					}
					console.log(_this.user);
				})
				
			},
			
			submit(guider_msg){
				
				var o={};
				o.id=this.user.id;
				o.mobile=this.user.mobile;
				o.province=this.user.province;
				o.city=this.user.city;
				o.district=this.user.district;
			//	o.agtId=this.user.agtId;
				if(!!guider_msg.guiderId&&typeof guider_msg.guiderId!="undefined"){
					o.guiderId=guider_msg.guiderId;
				}
				if(!!guider_msg.agtId&&typeof guider_msg.agtId!="undefined"){
					o.agtId=guider_msg.agtId;
				}
				
				var _this=this;

				this.$post("user/update",o,function(res){
					setTimeout(()=>{
						uni.navigateBack()
					}, 800)
				})
			},
			confirm(){
				var o=this.user;
				
				
				this.$post("user/update",o,function(res){
					setTimeout(()=>{
						uni.navigateBack()
					}, 800)
				})
					

				
			},
			/* ...mapMutations(['logout']), */

			navTo(url){
				//this.$dataLocal("user_info",null);
				this.$toast(`成功${url}`);
				
				this.$dataLocal("user_info",null);
				this.$dataLocal("buy_type",null)
				this.$dataLocal("param",null)
				this.$dataLocal("wxuser",null)	
				this.$dataLocal("userid",null);
				this.$dataLocal("token",null);
			//	localStorage.removeItem("user_info");
			//	localStorage.removeItem("buy_type")
			//	localStorage.removeItem("param")
			},
			//退出登录
			toLogout(){
				uni.showModal({
					title: '确定要退出登录么？',
					success: (e)=>{
						if(e.confirm){
							this.$rmLoginMsg();
							uni.reLaunch({
								"url":"/pages/login/login"
							})

						}
					}
				})
			},
			//switch
			switchChange(e){
				console.log(e.detail)
				let statusTip = e.detai ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'> 
	
	page{
		overflow-x: hidden;
		background: #ffffff;
	}
	
		.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: #303133;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: #303133;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: #909399;
		}
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx 0.9rem;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:0.8rem;
			color:#909399;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: 0.72rem;
			color: #303133;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: 0.9rem;
			color: #909399;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
