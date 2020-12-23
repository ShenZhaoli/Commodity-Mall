<template>
	<view class="center">
			
		<view class="center_top" style="height: 18%;">
			<!--
			<view class="mask"></view>
			-->
			<img src="../../static/img/fumou-center-template/money.jpg" style="height: 100%;width: 100%;"></img>
		</view>
		<view class="center_box_bg">
			<view class="center_menu">
				<view  class="menu_item" @click="toTotal()">
					<image src="../../static/img/fumou-center-template/5.png" mode="aspectFill"></image>
					<text>累计佣金</text><text style="margin-left: 9.6rem;">{{user.money}}</text>
				</view>
				<view  class="menu_item" @click="readyMoney()">
					<image src="../../static/img/fumou-center-template/6.png" mode="aspectFill"></image>
					<text>可提现佣金</text><text style="margin-left: 8.8rem;">{{user.readyMoney}}</text>
				</view>
				<view  class="menu_item" @click="toChecking()">
					<image src="../../static/img/fumou-center-template/7.png" mode="aspectFill"></image>
					<text>已申请佣金</text><text style="margin-left: 8.8rem;">{{user.applyMoney}}</text>
				</view>
				<view  class="menu_item" @click="toChecking2()">
					<image src="../../static/img/fumou-center-template/8.png" mode="aspectFill"></image>
					<text>待打款佣金</text><text style="margin-left: 8.8rem;">{{user.checkedMoney}}</text>
				</view>
				<view  class="menu_item" @click="toFinished()">
					<image src="../../static/img/fumou-center-template/9.png" mode="aspectFill"></image>
					<text>成功提现佣金</text><text style="margin-left: 8rem;">{{user.sucMoney}}</text>
				</view>
			</view>
		</view>
		
		<!-- <view class="notice2">
			<view style="margin-left: 5%;">提现须知:</view>
			<view><text style="margin-left: 5%;width: 90%;display:block;font-size: 15px;">1、成为会员后即可推荐会员，成功推荐3个会员后系统自动升级会创客。</text></view>
			<view><text style="margin-left: 5%;width: 90%;display:block;font-size: 15px;">2、成为创客后即可提取佣金，每次提取佣金公司将扣除1%的微信支付手续费。</text></view>
			<view><text style="margin-left: 5%;width: 90%;display:block;font-size: 15px;">3、你推荐的会员，购买产品7天后(按照国家消费者保护法相关规定7天内可退货)，佣金才能提取。</text></view>
			<view><text style="margin-left: 5%;width: 90%;display:block;font-size: 15px;">4、创客推荐会员，不受数量、地域等限制，每成功推荐一个会员入会，即可获取相应佣金。</text></view>
		</view> -->
		
		<view class="commit_bt">
			<!-- <button type="primary" style="background-color: #F0AD4E;width: 50%;border-radius: 0;" @click="withdrawGoods()">货物兑换</button> -->
			<button type="primary" style="background-color: #FF3B32;width: 100%;border-radius: 0;" @click="withdraw()">奖金提现</button>
		</view>
	</view>
	
</template>

<script>
	
	
	export default {
		data() {
			return {
				user:{},
			};
		},
		onShow() {
			this.find_user();
		},
		methods: {
			toChecking2(){
				if(!(this.user.checkedMoney>0)){return}
				uni.navigateTo({
					url: '/pages/user/wd-list'    //wd
				})
			},
			toChecking(){
				if(!(this.user.applyMoney>0)){return}
				uni.navigateTo({
					url: '/pages/user/wd-list'   //wd
				})
			},
			readyMoney(){
				uni.navigateTo({
					"url":"/pages/user/commission?stat=3"     //commType==3为可以提现的分佣,comm
				})
			},
			toFinished(){
				uni.navigateTo({
					url: '/pages/user/wd-list-finish'  //wd已经完成的wd订单
				})
			},
			toTotal(){           
				uni.navigateTo({
					"url":"/pages/user/commission"           //累计分佣,commType==``,comm
				})
			},
			find_user(){
				var user=this.$dataLocal("user_info")||{};
				var id=user.id;
				var _this=this;
				this.$post("user/find",{id:id},(res)=>{
					this.user=res.data;
					let b1=this.user.readyMoney>0;
					let b2=!(this.user.agtStat==101);
					let b3=!(this.user.regionAgtStat==11);
					let b4=!(this.user.sysStat==21);
					if(b1&&b2&&b3&&b4){
						let r_money=this.user.readyMoney;
						/* let r_goods_value=this.$round2pos(this.user.readyMoney*1.4);			
						let str="您当前可提现奖金"+r_money+"元,可兑换价值"+r_goods_value+"元的纸尿裤";
						this.$toast(str,2000); */					
					}
				})
			},

			withdraw(){
            	let b1=this.user.readyMoney>0; //可提现金额大于0
				let b2=(this.user.agtStat==101);  //是渠道代理
				let b3=(this.user.regionAgtStat==11);  //是区域代理
				let b4=(this.user.sysStat==21);     //是系统业务员
				let b5=this.user.isFreeze===true  //账户已经被冻结
				if(b5){this.$toast("账户已经被冻结，无法发起提现");return;}
				if(!b1){this.$toast("可提现金额为0");return;}
				if(b2){this.$toast("渠道代理由公司每月结算奖金");return;}
				if(b3){this.$toast("区域代理由公司每月结算奖金");return;}
				if(b4){this.$toast("业务员由公司每月结算提成");return;}
				
				var o={};
				o.userId=this.user.id;
				o.stat=1;
				this.$post("withdrew/query",o,function(res){
					 if(res.rows.length>0){
						 uni.showModal({
							title: '提示',
							content: '已经有一个分佣提现正在申请中，是否前往查看',
							success: function (res) {
								 if (res.confirm) {
										uni.navigateTo({
											url: '/pages/user/wd-list'
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								
								
							}
						 });			 
					 }else{
						 uni.navigateTo({
						 	"url":'../user/withdraw'
						 })
					 }
							 	
				})
				
				
			},

		},
		computed: {

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.notice2{
		
	}
	.notice{
		position:absolute;
			   left: 0%;
				bottom: 10%;
				width: 100%;
		display: inline-block;
	}
	.commit_bt{
		position:fixed;
			   left: 0%;
				bottom: 0%;
				width: 100%;
				display: flex;
				justify-content: space-between;
				
	}
	.profily,
	.profily_header {
		border-radius: 8px;
	}

	.center {
		height: 100%;

		&_top {
			/* height: 18%;
			background: url('../../static/fumou-center-template/money.jpg') no-repeat 0% 50%;
			background-size: cover;

			// background: #E6E6E6;
			.mask {
				//background: rgba(0, 0, 0, .4);
				//background: url('../../static/fumou-center-template/header2.jpg') no-repeat
				height: 100%;
			} */
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
		.profily_header {
			height: 120upx;
			width: 120upx;
			background-image: url('../../static/img/fumou-center-template/header.jpg');
			background-size: 100%;
		}

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
