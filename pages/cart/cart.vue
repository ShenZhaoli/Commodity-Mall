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
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					>
						<view class="image-wrapper" style="display: block; opacity: 1;">
							<image style="width: 6.5rem;height: 6.5rem;" :src="item.goods.image" 
								:class="[item.loaded]"
								mode="aspectFill" 
								lazy-load 
								@load="onImageLoad('cartList', index)" 
								@error="onImageError('cartList', index)"
							></image>
							<view 
								class="iconfont iconyouhuiquan-xuanzhong checkbox"
								:class="{checked: item.checked}"
								@click="check('item', index)" :style="item.checked?'color: #ff557f;':''"
							></view>
						</view>
						<view class="item-right">
							<view class=" title">{{$endwithdot(item.goods.name,20)}}</view>
							<text class="attr" > <text v-if="','!=item.sku.sku">{{item.sku.sku}}</text>  </text>
							<text class="price">¥{{item.price}}</text>
							
							  <uni-number-box 
								class="step"
								:min="1" 
								:max="999"
								:value="item.number"
								:isMax="item.number>999"
								:isMin="item.number===1"
								:index="index"
								@eventChange="numberChange"
								:disabled="false"
							></uni-number-box>
						</view>
						<text class="del-btn iconfont iconicon_delete_fill" style="color: #aaaaff;" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section flex c-center m-center">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/img/cart/selected.png':'/static/img/cart/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{goodsAmount}}</text>
					<!-- <text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text> -->
				</view>
				<button type="primary" style="background-color: #ff557f;" class="no-border confirm-btn" @click="createOrder">去结算</button>
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
			cartList: {
			　　　　handler(newValue, oldValue) {
						let empty = this.cartList.length === 0 ? true: false;
						if(this.empty !== empty){
							this.empty = empty;
						}
				
				         this.count();
			　　　　},
			　　　　deep: true
			　　}
		},
		/* computed:{
			...mapState(['hasLogin'])
		}, */
		methods: {
			
			
			loadUserInfo(){
				this.userInfo=this.getUser();
			},
			getCartList(){
				let o={};
				o.stat=1;
				o.userId=this.userInfo.id||"-1";
				let _this=this;
				this.$post("cart/query",o,function(res){
					var li=res.rows;
				 	for(let i in li){
						let item= li[i];
						item.number=1;
						item.checked=false;
						item.goods=JSON.parse(item.goodsDetail);
						item.sku=JSON.parse(item.skuDetail);
					}
					_this.cartList=li; 
					_this.count();
					
				})
			},
			
			count(){
				var li=this.cartList;

				
				var sum=0;
				for(let i in li){
					var ite=li[i];
					var price=ite.sku.price;
					var sub_sum=parseFloat(price)*parseFloat(ite.number);
					if(ite.checked===true){
						sum=sum+sub_sum
					}		
				}
				console.log(sum);
				this.goodsAmount=this.$round2pos(sum);
				
			},

			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				
				this.$navigateTo("pages/login/login")
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.count();
			},
			//数量
			numberChange(data){
				console.log(data);
				this.cartList[data.index].number = data.number;
				this.count();
			},
			//删除
			deleteCartItem(index){
				let list = this.cartList;
				let row = list[index];
				let id = row.id;
				let o={};
				o.id=id;
				o.stat=2;
				this.$post("cart/update",o,function(res){
					
				})

				this.cartList.splice(index, 1);
				this.count();
				uni.hideLoading();
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							var li=[];
							for(let i in this.cartList){
								var ite=this.cartList[i];
								li.push(ite.id)
							}
							this.$post("cart/rm_cart_by_cancal",{"ids":JSON.stringify(li)},function(res){
								
							})
							this.cartList = [];
							this.count();
						}
					}
				})
			},

			//创建订单
			createOrder(){
				let list = this.cartList;
				
				var goods_list=[];
				for(let i in list){
					var ite=list[i];
					if(ite.checked===true){
						var param={};
						param.goods=ite.goods;
						param.sku=ite.sku;
						param.number=ite.number;
						
						goods_list.push(param);
					}		
				}

				if(goods_list.length===0){
					uni.showToast({
						"title":'没有选中商品进行结算'
					})
					return;
				}
				
				this.$dataLocal("buy_list",goods_list);
				this.$dataLocal("buy_type","cart");
				this.$navigateTo(`/pages/order/create`);			
			}
		}
	}
</script>

<style lang='scss'>
	
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
			width: 230upx;
			height: 230upx;
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
				height: 80upx;
				line-height: 40upx;
			}
			.attr{
				font-size: 0.72rem;
				color: 909399;
				height: 40upx;
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