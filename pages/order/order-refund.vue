<template>
	<view class="content">
		<swiper  class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">{{item.createAt}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text 
								v-if="9===9" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(item)"
							></text>
						</view>
						
						<scroll-view v-if="item.goods.length > 1"  class="goods-box" scroll-x>
							<view class="goods-item" v-for="(goodsItem, goodsIndex) in item.goods" :key="goodsIndex">
								<image class="goods-img" :src="goodsItem.goods.image" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.goods.length == 1" 
							class="goods-box-single">
							<image class="goods-img" :src="item.goods[0].goods.image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{item.goods[0].goods.name}}</text>
								<text class="attr-box">{{item.goods[0].sku.sku}}</text>
								<text class="price">{{item.goods[0].sku.price}}X{{item.goods[0].goods.buyNum}}</text>
							</view>
						</view>
						
						<view class="price-box">
							共
							<text class="num">{{item.buyNum}}</text>
							件商品 实付款
							<text class="price">{{item.amount-item.benefit+item.postage}}</text>
						</view>
						
						<view class="action-box b-t" >
							<block v-if="item.refundStat==1">
							 <button class="action-btn recom">退款中···</button>
							</block>
							<block v-if="item.refundStat==2">
							 <button class="action-btn recom">退款成功</button>
							</block>
								<block v-if="item.refundpStat==1">
								 <button class="action-btn recom">退货中···</button>
								</block>
								<block v-if="item.refundpStat==2">
								 <button class="action-btn recom">退货成功</button>
								</block>
						</view>

						
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
		
		
		<view class='layer' v-if="layer===true">
  <view class='window column'>
    <image src='/static/cancel.png' class='close' @click="powerDrawer" data-statu="close"></image>
    <view class='header'>
      <!-- <image src='{{chosenOne.goodsMsg[0].imgs[0]}}' mode='aspectFill'></image> -->
      <view class='header-right column'>
        <view class='pname'>物流公司：{{logi_corp}}</view>
        <view>运单号码:{{logi_no}}</view>
      </view>
    </view>
    <view class='log-data column'>
      <view class='log-item' v-for="(item,index) in logistics" :key="index">
        <view class='time'>
          {{item.time}}
        </view>
        <view class='log-info'>
          {{item.context}}
        </view>
      </view>
      <view class='no-data' v-if="!logistics.length">暂无物流信息</view>
    </view>
  </view>
</view>
		
		
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty/empty";

	
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				layer:false,
				logi_corp:"",
				logi_no:"",
				logistics:[],
				logisterMap:{
					"shentong":"申通",
					"zhongtong":"中通",
					"shunfeng":"顺风",
					"yunda":"韵达",
					"ziti":"自提",
	            },
				
				tabCurrentIndex: 1,
				navList: [
					{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
							state: 2,
							text: '待发货',
							loadingType: 'more',
							orderList: []
						},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					},
					/* {
						state: 5,
						text: '售后',
						loadingType: 'more',
						orderList: []
					} */
				],
				userInfo:{
					"id":-1
				},
				cond:{
					pagesize:10,
					pagefrom:1,
					stat:""
				},
				orderList:[],
			};
		},
		
		onLoad(options){
			this.loadUserInfo();
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			this.cond.stat=options.state;
			// #ifndef MP
			//this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
			//	this.loadData()
			}
			// #endif
			
			//this.reloadList();
			
		},
		
		watch:{
			"tabCurrentIndex":function(n,o){
				console.log(n,o);
				var s='';
				if(n!=0){s=n;}
				this.cond.stat=s;
				this.reloadList();
			}
		},
		 
		methods: {
			reject_product(item){
				uni.navigateTo({
					"url":"../order/return"
				})
			},
			reject_money(item){
				uni.showModal({
					title: '提示',
					content: '亲，确定要发起退款嘛',
					success: function (res) {
						    if(res.confirm) {
								var o={};
								o.id=item.id;
								o.refundStat=1;  //申请中
								var _this=this;
								this.$post("order/update",o,function(res){
									item.refundStat=1;
										uni.showToast({ title: '申请成功' });
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						
						
					}
				});
				
			},
			urge(item){
				uni.showToast({
					"title":"已经发送催货信息给卖家，请耐心等待"
				})
			},
			toComment(item){
				uni.navigateTo({
					url: `/pages/order/comment?id=`+item.id
				})
			},
			powerDrawer(){this.layer=false},
			
			view_logi(item){
				
				var post_detail={};
		        if(!!item.postDetail){post_detail=JSON.parse(item.postDetail)}
				console.log(post_detail);
				var url="https://www.kuaidi100.com/query";
				url="https://m.kuaidi100.com/query";
	    var pdata={};
	    pdata.url=url;
	    pdata.type=post_detail.type;
	    pdata.postid=post_detail.order;
	    if(pdata.type=="ziti"){
	    	alert("该订单的商品已经自提");
	    	return;
	    }
	    this.logi_no=pdata.postid;
		this.logi_corp=pdata.type;
		var logisterMap=this.logisterMap;
	    var logister_title="运单号码："+pdata.postid+",物流公司："+logisterMap[pdata.type];
	    console.log(logister_title);
		var _this =this;
		this.$post("order/getlogimsg", pdata,function(r) {
			if (r.status == 200) {
				var obj=JSON.parse(r.msg)
				var list=obj.data;
				console.log(list)
                _this.logistics=list;
				_this.layer=true;
			}
			
		})
				
			},
			loadUserInfo(){
				/* uni.getStorage({
					key: 'user_info',
					success: function(res) {
						_this.userInfo=res.data;
					}
				}); */
				this.userInfo=this.$dataLocal("user_info");
			},
			
			reloadList(){
				this.cond.pagefrom=1;
				this.orderList=[],
				this.loadList();
			},
			loadList(){
				let o={};
				o.pagefrom=this.cond.pagefrom;
				o.pagesize=this.cond.pagesize;
                o.stat=5;
				o.userId=this.userInfo.id;
				let _this=this;
				this.$post("order/query",o,function(res){
					var li=res.rows;
					for(let i in li){
						let item= li[i];
						item.goods=JSON.parse(item.goodsDetail);
					//	item.sku=JSON.parse(item.skuDetail);
					}
					var old_li=_this.orderList;
					var new_li=old_li.concat(li);
					_this.orderList=new_li;
					console.log(new_li)
					if(li.length>0){
						_this.cond.pagefrom=_this.cond.pagefrom+1;
					}
					
				})
				
			},
			
			//获取订单列表
			loadData(source){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex||0;
				let navItem = this.navList[index];
				let state = navItem.state;
				
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				
				setTimeout(()=>{
					let orderList = Json.orderList.filter(item=>{
						//添加不同状态下订单的表现形式
						item = Object.assign(item, this.orderStateExp(item.state));
						//演示数据所以自己进行状态筛选
						if(state === 0){
							//0为全部订单
							return item;
						}
						return item.state === state
					});
					orderList.forEach(item=>{
						navItem.orderList.push(item);
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
					
					//判断是否还有数据， 有改为 more， 没有改为noMore 
					navItem.loadingType = 'more';
				}, 600);	
			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(item,index){
				console.log(item);
				/* let s="";
				if(item.state!=0){s=item.state;}
				this.cond.stat=s;
				this.reloadList(); */
	               //查询的工作 在watch里面监听tabindex的时候做了，此处注释掉查询的代码
				this.tabCurrentIndex = index;
			},
			
			update_stat(id,stat){
				var o={};
				o.id=id;
				o.stat=stat;
				var _this=this;
				this.$post("order/update",o,function(res){
						uni.showToast({ title: '操作成功' });
				})
			},
			
			pay_success(item){
				item.stat=2;
				this.update_stat(item.id,2)
			},
			receive(item){
				item.stat=4;
				this.update_stat(item.id,4)
			},
			pay(item){
				let order_id=item.id;
				let money=item.amount-item.benefit+item.postage;
				uni.redirectTo({
					url: '/pages/money/pay?order_id='+order_id+'&money='+money
				})
				//this.pay_success(item);
			},
			
			//删除订单
			deleteOrder(item){
				return;
				var o={};
				o.id=item.id;
				o.isValid=0;
				var _this=this;
				this.$post("order/update",o,function(res){
					_this.deleteItem(item);
						uni.showToast({ title: '操作成功' });
				})
			},
			cancelOrder(item){
				var o={};
				o.id=item.id;
				o.isValid=0;
				var _this=this;
				this.$post("order/update",o,function(res){
					_this.deleteItem(item);
						uni.showToast({ title: '操作成功' });
				})
			},
			deleteItem(item){
				var li=this.orderList;
				for(let i in li){
					var ite=li[i];
					if(ite.id===item.id){
						li.splice(i,1);
					}
				}
			},
			//取消订单
			

			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(+state){
					case 1:
						stateTip = '待付款'; break;
					case 2:
						stateTip = '待发货'; break;
					case 9:
						stateTip = '订单已关闭'; 
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: #f1f1f1;
		height: 100%;
	}
	
	.layer{
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 4.8rem;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}.window{
    width: 680upx;
    position: relative;
}
	
	.window .header{
    background: #ff9933;
    color: #fff;
    padding: 30upx 20upx;
    border-top-left-radius: 20upx;
    border-top-right-radius: 20upx;
}
.header>image{
    width: 160upx;
    height: 160upx;
    border:1upx solid #fff;
    margin-right: 30upx;
}
.header .header-right{
    line-height: 55upx;
    justify-content: center;
    font-size: 28upx;
}
.log-data{
    padding: 30upx 20upx;
    justify-content: space-between;
    color: #565656;
    font-size: 28upx;
    height: 600upx;
    overflow: scroll;
    width: 100%;
    background: #fff;
    border-bottom-left-radius: 20upx;
    border-bottom-right-radius: 20upx;
    display: block;
}
.log-item{
    margin-bottom: 20upx;
    padding: 10upx 0;
    border-bottom: 1upx solid #f7f7f7;
}
.log-item .time{
    margin-right: 25upx;
}
.log-item .log-info{
    width: 630upx;
}
.header-right .pname{
    width: 400upx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.close{
    position: absolute;
    right: -15upx;
    top: -15upx;
    width: 50upx;
    height: 50upx;
}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: #303133;
			position: relative;
			&.current{
				color: #fa436a;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #fa436a;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: 28upx;
			color: #303133;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: #fa436a;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: 32upx;
				color: #909399;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid #DCDFE6;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: 28upx + 2upx;
					color: #303133;
					line-height: 1;
				}
				.attr-box{
					font-size: 24upx + 2upx;
					color: #909399;
					padding: 10upx 12upx;
				}
				.price{
					font-size: 28upx + 2upx;
					color: #303133;
					&:before{
						content: '￥';
						font-size: 24upx;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: 24upx + 2upx;
			color: #909399;
			.num{
				margin: 0 8upx;
				color: #303133;
			}
			.price{
				font-size: 32upx;
				color: #303133;
				&:before{
					content: '￥';
					font-size: 24upx;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: 24upx + 2upx;
			color: #303133;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: #fa436a;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
