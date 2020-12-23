<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{money}}</text>
		</view>

		<view class="pay-type-list">

			<view class="type-item b-b" @click="changePayType(1)">
				<text class="iconfont iconweixinzhifu3" style="color: green; font-size: 2rem;"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<!-- <view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit" >支付宝支付</text>
					<text>推荐使用支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view> -->
			
		</view>

		<text class="mix-btn" @click="confirm()">立即支付</text>
			
	</view>
</template>

<script>

	export default {
		data() {
			return {
				payType: 1,
				order_id: -1,
				money: 0,
				 providerList: []
			};
		},
		computed: {

		},
		onLoad(options) {
			this.loadData(options)
			//this.initapppay()
		},

		methods: {
		  initapppay(){
			uni.getProvider({
			    service: "payment",
			    success: (e) => {
			        //this.$toast("payment success:" + JSON.stringify(e));
			        let providerList = [];
			        e.provider.map((value) => {
			            switch (value) {
			                case 'alipay':
			                    providerList.push({
			                        name: '支付宝',
			                        id: value,
			                        loading: false
			                    });
			                    break;
			                case 'wxpay':
			                    providerList.push({
			                        name: '微信',
			                        id: value,
			                        loading: false
			                    });
			                    break;
			                default:
			                    break;
			            }
			        })
			        this.providerList = providerList;
			    },
			    fail: (e) => {
			        console.log("获取支付通道失败：", e);
			    }
			});
			},
			loadData(o) {
				this.money = o.money;
				this.order_id = o.order_id
			},
			
			changePayType(type) {
				this.payType = type;
			},
			
			onwxpayresult(res){
				let that = this
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						  	uni.getStorage({
						  		key: 'buy_type',
						  		success: function(res) {
						  			o=res.data;
						  			if(o==="cart"){
						  				uni.getStorage({
						  					key: 'cart_list',
						  					success: function(res) {
						  						var list=res.data;
						  						var li=[];
						  						for(let i in list){
						  							var ite=list[i];
						  							if(ite.checked===true){
						  								li.push(ite.id)
						  							}
						  							
						  						}
						  						this.$post("cart/rm_cart_by_bought",{"ids":JSON.stringify(li)},function(res){
						  							
						  						})
						  						
						  					}
						  				});
						  				
						  			}							
						  		}
						  	});
							
						  	uni.redirectTo({
						  		url: '../order/order?state=2'
						  	})
						  } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						  	that.$msg("用户取消支付!");
						  } else {
						  	alert("支付失败!");
						  }
													 
			},
			onalipayresult(res){
				let that = this
				console.log("alipay",res)
				return 
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						  	uni.getStorage({
						  		key: 'buy_type',
						  		success: function(res) {
						  			o=res.data;
						  			if(o==="cart"){
						  				uni.getStorage({
						  					key: 'cart_list',
						  					success: function(res) {
						  						var list=res.data;
						  						var li=[];
						  						for(let i in list){
						  							var ite=list[i];
						  							if(ite.checked===true){
						  								li.push(ite.id)
						  							}
						  							
						  						}
						  						this.$post("cart/rm_cart_by_bought",{"ids":JSON.stringify(li)},function(res){
						  							
						  						})
						  						
						  					}
						  				});
						  				
						  			}							
						  		}
						  	});
							
						  	uni.redirectTo({
						  		url: '../order/order?state=2'
						  	})
						  } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						  	that.$msg("用户取消支付!");
						  } else {
						  	alert("支付失败!");
						  }
													 
			},
			confirm(){
				if(this.payType==1){
					this.confirmweixin()
				}else{
					this.confirmalipay()
				}
			},
			confirmalipay(){
				this.$post("aliapi/unifiedorder_app", {
					id: this.order_id
				}, (res) =>{
					if(res.status!=200){
						this.$msg(res.msg)
						return 
					}
					var orderInfo={
						"appid":res.data.appid,
						"noncestr":res.data.noncestr,
						"package":res.data.package,
						"partnerid":res.data.partnerid,
						"prepayid":res.data.prepayid,
						"timestamp":res.data.timestamp,
						"sign":res.data.sign
					}
					var reqdata={}
					reqdata.provider="alipay";
					reqdata.orderInfo = res.data;
					reqdata.success =  (res) =>{
							
							this.$msg("支付成功")
							uni.redirectTo({
								url: '/pages/order/order?state=2'
							})
						}
					reqdata.fail	=(err) =>{
						console.log(err)
							this.$msg("支付失败"+err.errMsg)
						}
					uni.requestPayment(reqdata);
					
				},res=>{
					console.log(reqdata)
					this.$msg(res.msg)
				})
			},
			//确认支付
			confirmweixin() {
				let that = this
				if(this.isApp()){
					this.$post("wxapi/unifiedorder_app", {
						id: this.order_id
					}, (res) =>{
						if(res.status!=200){
							this.$toast(res.msg)
							return 
						}
						var orderInfo={
							"appid":res.data.appid,
							"noncestr":res.data.noncestr,
							"package":res.data.package,
							"partnerid":res.data.partnerid,
							"prepayid":res.data.prepayid,
							"timestamp":res.data.timestamp,
							"sign":res.data.sign
						}
						var reqdata={}
						reqdata.provider="wxpay";
						reqdata.orderInfo = orderInfo;
					
						reqdata.success =  (res) =>{
								this.$toast("支付成功")
								
								this.$redirectTo('/pages/order/order?stat=2');
							}
						reqdata.fail	=(err) =>{
							console.log(err)
								that.$toast("支付失败"+err.errMsg)
							}
						
						
						uni.requestPayment(reqdata);
						
					},res=>{
						console.log(reqdata)
						this.$msg(res.msg)
					})
				}else{
					this.$post("wxapi/unifiedorder_mp", {
						id: this.order_id
					}, (res) =>{
						console.log("wxunifiedorder_app",res)
						if(res.status!=200){
							this.$toast(res.msg)
							return 
						}						
						var orderInfo={
							"appid":res.data.appId,
							"noncestr":res.data.nonceStr,
							"package":res.data.package,
							"partnerid":res.data.partnerid,
							"prepayid":res.data.prepayid,
							"timestamp":res.data.timeStamp,
							"sign":res.data.paySign
						}
						var reqdata={}
						reqdata.provider="wxpay";
						reqdata.orderInfo = orderInfo;
						
						reqdata.timeStamp = res.data.timeStamp;
						reqdata.nonceStr = res.data.nonceStr;
						reqdata.package =res.data.package;
						
						reqdata.signType ="MD5";
						reqdata.paySign =res.data.paySign;
					
						reqdata.success =  (res) =>{
								this.$toast("支付成功")
								
								this.$redirectTo('/pages/order/order?stat=2');
							}
						reqdata.fail	=(err) =>{
							console.log(err)
								that.$toast("支付失败"+err.errMsg)
							}
						
						
						uni.requestPayment(reqdata);
						
					},res=>{
						console.log(reqdata)
						this.$msg(res.msg)
					})
						
				}
				
				
					
			
			
			}
			
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: 32upx;
			color: #303133;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24upx;
			color: #f8f6fc;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: 32upx;
		color: #fff;
		background-color: #fa436a;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
