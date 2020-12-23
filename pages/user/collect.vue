<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="cartList.length===0" class="empty">
			<!-- <image src="/static/emptyCart.jpg" mode="aspectFit"></image> -->
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					 <view
						class="cart-item b-b flex" 
						
					> 
						<view class="image-wrapper w25p flex c-center m-center" style="display: block; opacity: 1;">
							<image style="width: 4.5rem;height: 4.5rem;" :src="item.image" 
								
								mode="aspectFill" 
								lazy-load 
								
							></image>
							
						</view>
						<view class="item-right w75p">
							<text class="clamp title">{{item.name}}</text>
							<text class="attr" > <text v-if="1==1">.</text>  </text>
							<text class="price">¥{{item.price}}</text>
							

						</view>
						<text class="del-btn iconfont iconicon_delete_fill" style="color: #aaaaff;" @click="deleteCartItem(item)"></text>
					 </view> 
				</block>
			</view>

		</view>
		</view>
</template>

<script>

	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
	export default {
		components: {uniNumberBox},
		data() {
			return {
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				 userInfo:{
					"id":-1
				},
				goodsAmount:0,
				hasLogin:1,
			}
		},
		
		
		onLoad(){
			//this.loadData();
			
			this.loadUserInfo();
		},
		onShow() {
			this.getCartList();
			//this.tips1();
		},
		watch:{

		},

		methods: {
			
			getCartList(){
				let li=this.$dataLocal("collect_list");
				
				this.cartList=li;
								
			},
			loadUserInfo(){
				this.userInfo=this.getUser();
			},


			navToLogin(){
				
				this.$navigateTo("pages/login/login")
			},

			//删除
			deleteCartItem(e){
				console.log(e);
				this.cartList=this.$delArrItemByKv(this.cartList,"id",e.id);
				this.$dataLocal("collect_list",this.cartList);

			},

		}
	}
</script>

<style lang='scss'>

	/* @import  url("../../static/css/font.css"); */ 
	
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: 0.8rem;
				color: #C0C4CC;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		opacity: 1;
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			opacity: 1;
			//width: 230upx;
			//height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
				
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: #C0C4CC;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:0.76rem;
				color: #303133;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: 0.72rem;
				color: 909399;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: 909399;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		//left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 22upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: 0.8rem;
			color: #fff;
			background: #C0C4CC;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: 0.86rem;
				color: #303133; 
			}
			.coupon{
				font-size: 0.7rem;;
				color: 909399;
				text{
					color: #303133;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: 0.76rem;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
	.image-wrapper uni-image {
    width: 100%;
    height: 100%;
    -webkit-transition: .6s;
    -o-transition: .6s;
    transition: .6s;
    opacity: 1;
	}
	
	
	
	
	
	
		
		
		
	
	
	
	
</style>