<template>
	<view class="container">
		<!-- <view style="position: fixed; top: 2%; left: 2%; z-index: 1000;">
			<image src="../../static/img/goods/back.png" style="width: 1.5rem; height: 1.5rem;"></image>
			
		</view> -->
		
		<view class="carousel">
			<swiper indicator-dots circular="true" autoplay="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image v-if="item.src.indexOf('.mp4')==-1" :src="item.src" class="loaded" mode="aspectFill"></image>
						<video v-if="item.src.indexOf('.mp4')>-1" style="width: 18.8rem;height: 18.8rem;" autoplay="true" loop="false" muted="true" mode="widthFix" :src="item.src"></video>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{goodsData.name}}</text>
			<view class="price-box">
				 <view >
				<span class="m-price" >￥<span v-text="goodsData.prePrice==0?goodsData.price:goodsData.prePrice"></span>  ,</span>
				<span class="price" >
					<span>￥</span>
					<span  v-if="cur_sku.price>0" v-text="cur_sku.price"></span>
				    <span  v-else v-text="goodsData.prePrice==0?goodsData.price:goodsData.prePrice"></span> 

					
					</span>
				</view>
				<!-- <text class="price" v-else>￥{{cur_sku.price}}</text> -->
			</view>
			<view class="bot-row">
				<text>销量: {{goodsData.saleNum||0}}</text>
				<text>收藏量: {{goodsData.collectNum||0}}</text>
				<text>浏览量: {{goodsData.lookNum||0}}</text>
			</view>
		</view>
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text">
						{{cur_color}}
					</text>
					<text class="selected-text">
						{{cur_size}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text :class="sIndex==0?'promored':''" v-for="(sItem, sIndex) in goodsData.promotion" :key="sIndex">{{sItem.name}}</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text v-for="(sItem, sIndex) in goodsData.service" :key="sIndex">{{sItem.name}}·</text>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header" @tap="switch_show_comment()">
				<text class="tit">评价</text>
				<text>({{commentDetail.length}})</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view v-show="showCommet" class="eva-box" v-for="(sItem, sIndex) in commentDetail" :key="sIndex">
				<image class="portrait" :src="sItem.userface" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{sItem.username}}</text>
					<text class="con"> {{sItem.content}}</text>
					<view  class="flex ">
						<image style="width: 3.3rem; height: 3.3rem;" v-for="(ssItem,ssIndex) in sItem.imgList" :key="ssIndex" :src="ssItem" ></image>
					</view>
				</view>
			</view>
		</view>
		
		

		

		<div class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<view v-html="descriptionNode"></view>
			<!-- <rich-text class="richtext" type = "node" :nodes="descriptionNode"></rich-text> -->
		</div>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="iconfont iconfenlei1"></text>
				<text>首页</text>
			</navigator>
			<view @click="toFavorite"  :class="{active: favorite}" open-type="switchTab" class="p-b-btn">
				<text class="iconfont iconbiaoxingfill"></text>
				<text>收藏</text>
			</view>
			<view class="p-b-btn" @click="share">
				<text class="iconfont iconkefuerji"></text>
				<text>咨询</text>
			</view>

			<view class="action-btn-group">				
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="cart">购物车</button>
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
			</view>
		</view>
	<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="imgList[0].src"></image>
					<view class="right">
						<text class="price">¥{{cur_sku.price}}</text>
						<text class="stock">库存：{{goodsData.storageNum}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text">
								{{cur_color}}
							</text>
							<text class="selected-text">
								{{cur_size}}
							</text>
						</view>
					</view>
				</view>

				<view >
					<text>颜色</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in color" :key="childIndex" class="tit"
						 :class="{selected: cur_color==childItem}" @click="selectSpec(1, childItem)">
							{{childItem}}
						</text>
					</view>
				</view>
				
				<view >
					<text>规格</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in size" :key="childIndex" class="tit"
						 :class="{selected: cur_size==childItem}" @click="selectSpec(2, childItem)">
							{{childItem}}
						</text>
					</view>
				</view>
				
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		
		<own-share ref="share" :shareSummary="shareobj.shareSummary" :shareImage="shareobj.image"
		    :shareTitle="shareobj.title" :shareHref="shareobj.href"
		    :miniProgram="shareobj.miniProgram" :webUrl="shareobj.webUrl"
		    @shareSuccess="shareSuccess" @shareFail="shareFail"></own-share>

	</view>
</template>

<script>
import ownShare from '@/components/own-share/own-share.vue'

	
	export default {
		components: {
			ownShare
		},
		data() {
			let _conf=this.getConst();
			
			return {
				conf:_conf,				
				specClass: 'none',
				specSelected: [],

				favorite: true,
				shareList: [],
				imgList: [{"src":""}],
				descriptionNode:[],
				goodsData: {
					id: 1,
					name: "",
					price: "",
					number: 1,
				},
				commentDetail: [],
				
				skuList:[],
				color:[],
				size:[],
				
				cur_color:"",
				cur_size:'',
				cur_sku:{},

                userInfo:{
					"id":-1
				},
				submit_lock:0,
				cartList:[],
				collect_list:[],
				
				showCommet:false,
				
				hasTapBuy:false,
				
				
				shareobj:{
					shareSummary:"我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					image:"https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png",
					title:"uni-app分享",
					href:"http://uniapp.dcloud.io/",
					miniProgram:{},
					webUrl:"webUrl",
				}
				
			};
		},
		onShow() {
			this.hasTapBuy=false;
		},
		onLoad(options) {
			
			
			let uri=this.conf.baseurl+'pages/goods/detail?id='+options.id;
			this.wxLogin(uri);
			
			this.loadUserInfo();
			
			let id = options.id;
			this.findGoods(id);
			
			this.getCartList();
			this.loadCollectList();
			
			

		//	this.shareList =await this.$api.json('shareList');
		},
		
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.openshare();
				


			} else if (index === 1) {
				
			}
		},
		methods: {
			tocopy(){
				let uri=this.getConst().host+"wxh5/#/pages/goods/detail?id="+this.goodsData.id+"&guider="+this.userInfo.id;
				uri="http://djk.51gang.top/appmkt/tjk/androidapk.html";
				
				
				let cont="复制下面的链接，发送给你朋友赚取佣金\n";
				cont=cont+this.goodsData.name+"============\n";
				cont=cont+uri
				this.$Copy(cont);
			},
			
			initshareobj(e){
				this.shareobj.title="搭健康";
				this.shareobj.shareSummary="点击链接下载搭健康商城";
				this.shareobj.image=this.getConst().host+"images/icon.png";
				
				
				let uri=this.getConst().host+"wxh5/#/pages/goods/detail?id="+this.goodsData.id+"&guider="+this.userInfo.id;
				uri="http://djk.51gang.top/appmkt/tjk/androidapk.html";

				
				this.shareobj.href=uri;  
				
			},
			
			openshare(e){
				this.tocopy();
				
				 this.initshareobj(e);

				
				 this.$refs.share.open()
			},
			

			switch_show_comment(){
				this.showCommet=!this.showCommet;
			},
			sale_once(id){
				this.$post("goods/addsale",{id:id},function(res){})
			},
			look_once(id){
				this.$post("goods/addlook",{id:id},function(res){})
			},
			getCartList(){
				if(this.$isNull(this.userInfo.id)){				
					//this.$toast("请先登陆");
					return;
				}
				
				let o={};
				o.stat=1;
				o.userId=this.userInfo.id;
				this.$post("cart/query",o,(res)=>{
					var li=res.rows;
					this.cartList=li;
					
				})
			},
			
			loadUserInfo(){
				let user=this.getUser();
				this.userInfo=user;
			},
			


			splitColorAndSize(list) {
				var colorList = [],sizeList = [];
				var skuList = list;
				for (var i in skuList) {
					var item = skuList[i];
					var sku_str = item.sku;
					var li = sku_str.split(',');
					colorList = this.$pushNoRepeat(colorList, li[0]);
					sizeList = this.$pushNoRepeat(sizeList, li[1]);
				}
				var obj = {};
				obj.color = colorList;
				obj.size = sizeList;
				return obj

			},
			specColorAndSize(list) {
				var spec=this.splitColorAndSize(list);
				this.skuList=list;
				this.color=spec.color;
				this.size=spec.size;
				this.cur_color=this.color[0];
				this.cur_size=this.size[0];
				
				
				let goodsid=this.goodsData.id;
				let _cur_size=null;
							
				if(null!=_cur_size){
					this.cur_size=_cur_size;
				}
				
				this.setCurSkuInitPrice();
			
			},
			setCurSkuInitPrice(){
				var c_color=this.cur_color;
				var c_size=this.cur_size;
				var _sku=c_color+","+c_size;
				var list=this.skuList;
				for(var i in list){
					var ite=list[i];
					if(_sku==ite.sku){
						this.cur_sku=ite;
					}
				}
			},
			setCurSku(){
				var c_color=this.cur_color;
				var c_size=this.cur_size;
				var _sku=c_color+","+c_size;
				var list=this.skuList;
				for(var i in list){
					var ite=list[i];
					if(_sku==ite.sku){
						this.cur_sku=ite;
					}
					
				}
			},
			findGoods(gid) {
				var o = {};
				o.id = gid;
				this.$post("goods/find", o, (res)=> {
					var goods = res.data;			
					
					var img_list_res = [];
					var img_list = [];
					if (!!goods.imageList) {
						img_list_res = JSON.parse(goods.imageList);
					}
					for (var i in img_list_res) {
						var o = {};
						o.id = 1;
						o.src = img_list_res[i];
						img_list.push(o)
					}
					this.imgList = img_list; //顶部图片


					this.descriptionNode = this.$prepareHtml(goods.detail);
								   
					goods.image=img_list[0].src
					goods.service = [{
							name: "正品保证",
							description: "此商品官方保证为正品"
						},
						{
							name: "极速发货",
							description: "此商品享受退货极速发货服务"
						},
						{
							name: "7天退换",
							description: "此商品享受7天无理由退换服务"
						}
					];
					
					goods.promotion = [{
							name: "此商品官方保证为正品",
							//description: "此商品官方保证为正品"
						},
						{
							name: "享受退货极速发货服务",
							//description: "此商品享受退货极速发货服务"
						},
						{
							name: "此商品享受7天无理由退换服务",
							//description: "此商品享受7天无理由退换服务"
						}
					];
					if(!!goods.serviceDetail&&goods.serviceDetail!=''&&goods.serviceDetail!='[]'){
						goods.service=JSON.parse(goods.serviceDetail);
					}
					
					if(!!goods.promotionDetail&&goods.promotionDetail!=''&&goods.promotionDetail!='[]'){
						goods.promotion=JSON.parse(goods.promotionDetail);
					}
					
					this.goodsData = goods;
					this.specColorAndSize(JSON.parse(goods.skuDetail));
					this.loadOrderList(goods.id);
					this.IsCollectGoods(goods.id);
					this.look_once(goods.id);
				})
			},
            loadOrderList(id){
				let o={};
				o.goodsId=id;
				let _this=this;
				this.$post("order/query",o,function(res){
					var li=res.rows;
					for(let i in li){
						let item= li[i];
						if(_this.getConst().sucComment!=item.commentStat){
							continue;
						}
						
						var comment={};
						if(!!item.commentDetail){							
							comment=JSON.parse(item.commentDetail);
							var cus=JSON.parse(item.cusDetail);
							var o={};
							console.log(comment);
							o.userface=cus.headimage||'http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg';
							o.username=cus.nickname||'uname';
							o.content=comment.context;
							o.imgList=comment.img_list;
							_this.commentDetail.push(o)
							}
					}

					
				})
				
			},

			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
						if(this.hasTapBuy==true){
							this.buy();
						}
						
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(type, item) {
				if(type==1){this.cur_color=item}
				else if(2==type){this.cur_size=item}
				this.setCurSku();
			},

			share() {
				if(this.$isNull(this.userInfo.id)){
					this.$navigateTo("/pages/login/login")
					this.$toast("请先登陆");
					return;
				}
				
				this.$navigateTo("/pages/chat/chat");
			},
			
			loadCollectList(){
				this.collect_list=this.$dataLocal("collect_list")||[];
			},
			IsCollectGoods(goods_id){
				var li=this.collect_list;
				var bool=false;
				for(let i in li){
					let ite=li[i];
					if(ite.id===goods_id){
						bool=true;
					}
					
				}
				
				this.favorite=bool;
			},
			//收藏
			toFavorite() {
				 var c_li=this.collect_list;
				if(this.favorite===false){
					var o={};
					 o.id=this.goodsData.id;
					 var _this=this;
					this.$post("goods/addcollect",o,function(res){
						c_li.push(_this.goodsData);
						_this.$dataLocal("collect_list",c_li)

					})
					this.favorite = !this.favorite;
				}else{
					c_li=this.$delArrItemByKv(c_li,"id",this.goodsData.id);
					this.$dataLocal("collect_list",c_li)
					this.favorite = !this.favorite;
				}			
			},
			cart(){
				if(this.$isNull(this.userInfo.id)){
					this.$navigateTo("/pages/login/login")
					this.$toast("请先登陆");
					return;
				}
				
				var cart={};
				cart.userId=this.userInfo.id;
							
							
				var goods={};
				goods.id=this.goodsData.id;
				goods.name=this.goodsData.name;
				goods.image=this.goodsData.image;
				goods.type=this.goodsData.type;
				goods.postageConfig=this.goodsData.postageConfig;
				cart.goodsDetail=JSON.stringify(goods);
				cart.goodsId=goods.id;
				
				let sku=this.cur_sku;
				cart.price=sku.price;
				
				cart.skuDetail=JSON.stringify(sku)
				var isRepeat=0;
				for(let i in this.cartList){
					let item=this.cartList[i];
					if(item.goodsId===goods.id){isRepeat=1}
				}
				if(isRepeat===1){
					this.$toast("已经加入购物车啦");
					return
				}
				
				if(1==this.submit_lock){
					this.$toast("已经加入购物车啦");
					return;
				}
				this.submit_lock=1;
				this.$post("cart/create",cart,function(res){
					uni.showToast({
						title:'操作成功'
					})
				})
				
				
				
			},
			buy() {
				if(this.$isNull(this.userInfo.id)){
					this.$toast("请先登陆");
					
					this.$navigateTo("/pages/login/login")
					
					return;
				}

				
				let param={};
				let goods = this.goodsData;
				let sku=this.cur_sku;
				if(!sku.price>0){
					this.$toast("价格异常");
					return;
				}
				param.goods=goods;
				param.sku=sku;
				param.number=1;


							
				var li=[];
				li.push(param);			
				this.$dataLocal("buy_list",li);
			//	this.$dataLocal("buy_type","product");
				this.sale_once(this.goodsData.id);
				this.$navigateTo(`/pages/order/create`);			
			},
			stopPrevent() {}
		},

	}
</script>

<style lang='scss'>
	/* @import  url("../../static/css/font.css");
	@import  url("../../static/css/common.css"); */
	page {
		background: #f8f8f8;
		padding-bottom: 160upx;
	}
	.promored{
		color:red;
	}
	.icon-you {
		font-size: 0.8rem;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position: relative;
	
		swiper {
			height: 100%;
		}
	
		.image-wrapper {
			width: 100%;
			height: 100%;
		}
	
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
	
			image {
				width: 100%;
				height: 100%;
			}
		}
	
	}
	
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;
	
		.title {
			font-size: 32upx;
			color: #303133;
			height: 50upx;
			line-height: 50upx;
		}
	
		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:  #fa436a;
		}
	
		.price {
			font-size:0.8rem;
		}
	
		.m-price {
			margin: 0 12upx;
			color: #909399;
			text-decoration: line-through;
		}
	
		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background:  #fa436a;
			font-size: 0.8rem;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}
	
		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: 0.8rem;
			color: #909399;
	
			text {
				flex: 1;
			}
		}
	}
	.share-section {
		display: flex;
		align-items: center;
		color: #606266; 
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
	
		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid  #fa436a;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color:  #fa436a;
	
			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background:  #fa436a;
			}
		}
	
	
	.icon-xingxing {
		position: relative;
		z-index: 1;
		font-size: 24upx;
		margin-left: 2upx;
		margin-right: 10upx;
		color: #fff;
		line-height: 1;
	}
	.tit {
		font-size: 28upx;
		margin-left: 10upx;
	}
		
	.icon-bangzhu1 {
		padding: 10upx;
		font-size: 30upx;
		line-height: 1;
	}
		
	.share-btn {
		flex: 1;
		text-align: right;
		font-size: 0.8rem;
		color:  #fa436a;
	}
		
	.icon-you {
		font-size: 0.8rem;
		margin-left: 4upx;
		color:  #fa436a;
	}
	
	}
	
	
	
	
	.c-list {
		font-size: 0.7rem;
		color: #606266;
		background: #fff;
	
		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}
	
		.tit {
			width: 140upx;
		}
	
		.con {
			flex: 1;
			color: #303133;
	
			.selected-text {
				margin-right: 10upx;
			}
		}
	
		.bz-list {
			height: 40upx;
			font-size: 0.7rem;
			color: #303133;
	
			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}
	
		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: #303133;
			line-height: 40upx;
		}
	
		.red {
			color:  #fa436a;
		}
	}
	
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
	
		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: 0.9rem;
			color: #909399;
	
			.tit {
				font-size: 0.9rem;
				color: #303133;
				margin-right: 4upx;
			}
	
			.tip {
				flex: 1;
				text-align: right;
			}
	
			.icon-you {
				margin-left: 10upx;
			}
		}
	} 
	
	.eva-box {
		display: flex;
		padding: 20upx 0;
	
		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
	
		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 28upx;
			color: #606266;
			padding-left: 26upx;
	
			.con {
				font-size: 28upx;
				color: #303133;
				padding: 20upx 0;
			}
	
			.bot {
				display: flex;
				justify-content: space-between;
				font-size: 0.8rem;
				color: #909399;
			}
		}
	} 
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
	
		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: 0.9rem;
			color: #303133;
			position: relative;
	
			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
	
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				
			}
		}

		
		
	}
	.attr-content {
		padding: 10upx 30upx;
	
		.a-t {
			display: flex;
	
			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}
	
			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: 0.8rem;
				color: #606266;
				line-height: 42upx;
	
				.price {
					font-size:  32upx;
					color: #fa436a;
					margin-bottom: 10upx;
				}
	
				.selected-text {
					margin-right: 10upx;
				}
			}
		}
	
		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: 0.9rem;
			color: #606266;
			padding-top: 30upx;
			padding-left: 10upx;
		}
	
		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
	
			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: 28upx;
				color: #303133;
			}
	
			.selected {
				background: #fbebee;
				color:  #fa436a;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
	
		&.show {
			display: block;
	
			.mask {
				animation: showPopup 0.2s linear both;
			}
	
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
	
		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}
	
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
	
		&.none {
			display: none;
		}
	
		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
	
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
	
			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background:  #fa436a;
				font-size: 0.9rem;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
	
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
	
			100% {
				opacity: 1;
			}
		}
	
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
	
			100% {
				opacity: 0;
			}
		}
	
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
	
			100% {
				transform: translateY(0%);
			}
		}
	
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
	
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;
	
		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 0.8rem;
			color: #606266;
			width: 96upx;
			height: 80upx;
	
			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: #909399;
			}
	
			&.active,
			&.active .yticon {
				color:  #fa436a;
			}
	
			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}
	
			.icon-shoucang {
				font-size: 46upx;
			}
		}
	
		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;
	
			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%); 
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}
	
			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: 28upx;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
	.node-item{
		width: 100%;
	}
	
</style>
