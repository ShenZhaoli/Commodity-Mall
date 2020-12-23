<template>
	<view class="center">
		
		<view class="test-pop">
		  <popup-layer ref="popupRef" :direction="'top'">
			<view class="box" >
				<view class="uni-list">
					<radio-group @change="radioChange(item)" v-for="(item, index) in withdrawList" :key="index">
						<label class="uni-list-cell uni-list-cell-pd"  style="height: 14rem;" >
							
							<view style="position: absolute;width: 80%; margin-top: 0px;">
								<view v-if="item.name==='添加新账号'">{{item.name}}</view>
								<view v-if="item.channel===3">{{item.bankname}}({{sub_last_4_str(item.account)}})-{{item.username}}</view>
								<view v-if="item.channel===2" style="font-size: 17px;">支付宝({{item.account}})-{{item.username}}</view>
								<view v-if="item.channel===1">微信({{item.account}})-{{item.username}}</view>
								
							</view>
							<view style="margin-left: 300px;" >
								<radio :value="item.value" :checked="item.picked === 1" />
							</view>
							
						</label>
					</radio-group>
              </view>
			 <!-- <button type="primary" @tap="close">关闭</button> -->
			</view>
		  </popup-layer>
	    </view>
	  
		<view class="center_top">
			<view class="mask"></view>
		</view>
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view v-if="withdrawData.channel===3">
						<text>到账卡号</text>
						<text>{{withdrawData.bankname}}({{sub_last_4_str(withdrawData.account)}})</text>
						<view >
							<text style="margin-left: 130px;">{{withdrawData.username}}</text>
						</view>
					</view>
					<view v-if="withdrawData.channel===2">
						<text>支付宝：</text>
						<text>{{withdrawData.account}}</text>
						<view >
							<text style="margin-left: 130px;">{{withdrawData.username}}</text>
						</view>
					</view>
					
					<image src="../../static/img/fumou-center-template/setting.png"  @tap="show"></image>
				</view>
				<view>
					<text style="font-size: 15px;">提现金额</text>
					<view>
						<view style="position: absolute;width: 120px; margin-top: -10px;">
							<text style="font-size: 34px;">￥</text>
						</view>
						<view style="margin-left: 30px;margin-top: 10px;">
							<input v-model="money" type="text" style="width: 100%;" disabled="true" />
						</view>
					</view>
					
				</view>
				<view class="base">
				</view>
				<view >
					<text style="font-size: 15px;">当前可提现余额:</text>
					<text style="font-size: 15px;">{{ready_money}}元，</text>
					<text style="font-size: 15px; color:blue" @click="withdraw_all()">全部提现</text>
				</view>
				
				
				
				
				<view style="margin-top: 10px;">
				<button type="primary" @click="withdraw()">提现</button>
				</view>
			</view>

		</view>
		
		
		
	</view>
</template>

<script>
	 import popupLayer from '@/components/popup-layer/popup-layer.vue';

	export default {
        components: {popupLayer},
		data() {
			return {
			 withdrawList: [{value: 'add',name: '添加新账号'}],
			 withdrawData:{
				 username: '',
				 account: '',
				 bankname: '',
				 channel: '',
				 openid: ''
			 },
             current: 0,
			 ready_money:0,
			 money:""

				
			};
		},
		onLoad() {
			
		},
		onShow() {
			this.loadAddress();
			this.get_ready_money();
			this.unpick_all();
		},
		methods: {
			unpick_all(){
				var li=this.withdrawList;
				for(var i in li){
					var item=li[i];
					console.log(item);
					item.picked=0;
				}
				
			},
			withdraw(){
				var user=this.$dataLocal("user_info");
				var o={};
				o.userId=user.id;
				o.address=JSON.stringify(this.withdrawData);
				console.log(this.withdrawData);
				if(!this.withdrawData.account){
					uni.showToast({
						"title":"没有输入提现账号"
					})
					return;
				}
				o.channel=this.withdrawData.channel;
				o.amount=this.money;
				o.type=1;

				if(this.money>this.ready_money) this.$toast("可提现余额不足");
				if(this.money<0) this.$toast("提现金额不能为负数0");
				if(this.money==0) this.$toast("提现金额不能为0");
				//alert("before submit")
				this.$post("withdrew/create",o,function(res){
					uni.showToast({
						"title":"操作成功"
					});
					uni.navigateBack()
				},function(res){
					//alert(JSON.stringify(res))
				})
				
				
			},
			withdraw_all(){
				this.money=this.ready_money
			},
			get_ready_money(){
				var user=this.$dataLocal("user_info")||{};
				var id=user.id;
				var _this=this;
				this.$post("user/find",{id:id},function(res){
					_this.ready_money=res.data.readyMoney;
					_this.money=res.data.readyMoney;
				})
			},
			sub_last_4_str(str){
				var ret_str="";
				if(!!str){
					var last_pos=str.length-1;
					ret_str=str.substr(last_pos-3,last_pos);
				}				
				return ret_str;			
			},
			set_init_account(){
				  uni.showModal({
					title: '提示',
					content: '没有设置提现账户，请前往设置',
					success: function (res) {
						uni.navigateTo({
							"url":"/pages/wdaccount/list"
						})
					}
				});
			},
			loadAddress(){
				let li=this.$dataLocal("withdraw")||[];
				this.withdrawList=li;
				if(!(li.length>0)){
					this.set_init_account();
				}else{
					var o={value: 'add', name: '添加新账号',"picked":0};				  
					 var have_add=false;
					  for(let i in li){
						  var ite=li[i];
						  if(ite.name==='添加新账号'){
							  have_add=true;
						  }
					  }
					  if(have_add==false){
						  li.push(o);
					  }
					this.withdrawList=li;
					this.pick_withdraw();
				}
			},
			
			radioChange(item){
				if(item.name==="添加新账号"){
					this.unpick_all();
					item.picked=1;
					this.$refs.popupRef.close();// 或者 boolShow = false
					 uni.navigateTo({
						"url":"/pages/wdaccount/list"
					}) 
					return;
				}else{
					console.log(item.account)
					var li=this.withdrawList;
					for(var k in li){
						var ite=li[k];
						ite.picked=0;
					}
					for(var i in li){
						var ite=li[i];
						if(ite.account==item.account){
							ite.picked=1;
						}
					}
					uni.setStorage({
						key:'withdraw',
						data:li,
						success: () => {
							 this.$refs.popupRef.close();// 或者 boolShow = false
						}
					})		
				}
				this.pick_withdraw();
			},
			pick_withdraw(){
				var li=this.withdrawList;
				console.log(li)
				for(var i in li){
					if(li[i].picked==1){
						this.withdrawData=li[i];
					}
				}
			
			},
			show(){
                this.$refs.popupRef.show(); // 或者 boolShow = rue
            },
            close(){
                this.$refs.popupRef.close();// 或者 boolShow = false
            }

		},
		computed: {

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.profily,
	.profily_header { 
		border-radius: 8px;
	}

	.center {
		height: 100%;

		&_top {
			height: 18%;
			background: url('../../static/img/fumou-center-template/header.jpg') no-repeat 0% 50%;
			background-size: cover;

			// background: #E6E6E6;
			.mask {
				background: rgba(0, 0, 0, .4);
				height: 100%;
			}
		}

		&_box_bg {
			background: #F9F9F9;
			position: relative;

			.profily {
				position: absolute;
				width: 90%;
				// border:1px solid #F7F7F7;
				margin: 0 auto;
				top: -100upx;
				left: 5%;
				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}

	.base {
		display: flex;
		align-items: center;
		border-bottom: 2px solid #F6F6F6;
		padding-bottom: 35upx;
		position: relative;
		

		text {
			margin-left: 20px;
			font-size: 30upx;
		}
		
		image{
			position: absolute;
			height: 40upx;
			width: 40upx;
			right: 0px;
			top:0px;
		}
	}

	.order_status {
		display: flex;
		justify-content: space-between;
		margin-top: 35upx;

		.status {
			width: 140upx;
			font-size: 24upx;
			text-align: center;
			letter-spacing: .5px;
			display: flex;
			flex-direction: column;
			.icon {
				width: 50upx;
				height: 50upx;
				margin: 0 auto;
				margin-bottom: 5px;
				
			}
		}
	}

	.baiban {
		background: #FEFEFE;
		height: 300upx;
	}

	.center_menu {
		width: 100%;
		display: inline-block;

		.menu_item {
			font-size: 28upx;
			letter-spacing: 1px;
			padding: 14px 5%;
			background: #FEFEFE;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			position: relative;
			border-bottom: 1px solid #EFEFEF;

			&:hover {
				background: #F6F6F6 !important;
			}

			&::after {
				content: '';
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 5%;
				background: url('../../static/img/fumou-center-template/right.png') no-repeat;
				background-size: 100%;
			}

			text:nth-of-type(1) {
				margin-left: 10px;
			}

			image {
				width: 40upx;
				height: 40upx;
			}

			&:nth-of-type(4) {
				margin-top: 10px;
			}
		}
	}
</style>
