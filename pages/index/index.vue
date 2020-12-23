<template>
	<view class="page">
	 <!-- <box-search :placeholder="'输入关键词搜索'" @search="tosearch"></box-search> -->

	  
	  <view class="ps-re w100p" :style="'height: '+bannerHeight+';'">
	  	<swiper class="w100p h100p" circular="true" autoplay="true">
	  		<swiper-item class="w100p h100p" v-for="(ite,idx) in carouselList"  :key="idx" @click="navToBannerPage(ite)">
	  			<image  class="w100p h100p" :src="ite.pic"></image>
	  		</swiper-item>
	  
	  	</swiper>
	  	
				
	  </view>
	  

	  
	  <view style="margin-top: 1rem;" class="center98 flex wrap">
		  <view class="w20p flex-col m-center c-center" style="height: 5rem;" @click="tocatelist(item)" v-for="(item,index) in categoryList" :key="index">		 
			<image class="w66p h50p " style="border-radius: 50%;" :src="item.image"  />
			<text class="w80p h30p fs6dr flex m-center c555" style="margin-top: 0.4rem;">{{item.name}}</text>		  
		  </view>		  
	  </view>
	  
	  <view class="center92 flex" style="margin-top: 0.6rem;height: 9.6rem;">
		  <view class="h100p w44p flex m-center c-center" @click="toaclist(activity1)">
			  <view class="w97p h97p brrr2dr" >
				  <image :src="activity1.image" class="w100p h100p" />
			  </view>
			  
		  </view>
		  
		  <view class="h100p w56p">
			  <view class="w100p h50p flex m-center c-center" @click="toaclist(activity2)">
				   <view class="w97p h97p brrr2dr" >
					   <image :src="activity2.image" class="w100p h100p" />
					   
				   </view>
			  </view>
			  
			  <view class="w100p h50p flex m-center c-center" @click="toaclist(activity3)">
				   <view class="w97p h97p brrr2dr" >
					   <image :src="activity3.image" class="w100p h100p" />
					   
				   </view>
			  </view>
			  
		  </view>
		  
	  </view>
	  
	  
	 <!-- <view class="center92 flex brrr3dr" style="height: 5rem; margin-top: 0.6rem; " @click="toaclist(activity4)">
		  <image class="w100p h100p brrr3dr" :src="activity4.image" />
	  </view> -->
	  <view class="center92 flex brrr3dr" style="height: 7rem; margin-top: 0.6rem; " @click="navToBannerPage(adList[0])">
	  		  <image class="w100p h100p brrr3dr" :src="adList[0].pic" />
	  </view>
	  
	  
	  
	  <view class="center92 flex c-center" style="margin-top: 0.8rem; height: 2rem">
		  <image src="../../static/img/index/index/goods.png" style="width:  1.6rem ; height: 1.6rem;" />
		  
		  <view class="h100p flex-col" style="margin-left: 0.4rem;">
			  <view class="h70p fs1r">新品上市</view>
			  <view class="h30p fs7dr caaa" style="margin-top: -0.2rem;">new goods saling</view>
		  </view>
		  
	  </view>
	
        <!-- <view class="center94 flex m-sb wrap" style="align-content: flex-start; ">
			<view class="w48p " style="height:13rem; margin-top: 0.5rem;" v-for="(item,index) in goodsList" :key="index" @click="todetail(item)">
				<view class="w100p h80p">
					<image :src="item.image" class="w100p h100p" style="border-top-left-radius: 0.2rem;" />
				</view>
				
				<view class="w100p h10p fs9dr"><view class="name ">{{item.name}}</view></view>
				<view class="w100p h10p" style="margin-top: 0.4rem;">
				<span class="decoration">￥{{item.prePrice}},</span>
				<span class="price_count" >会员价:￥{{item.price}}</span>
				
	            </view>
				
			</view>		
		</view> -->
		
		<view class="center94 flex m-sb wrap" style="align-content: flex-start; margin-top: 0.2rem;">
			<view class="w48p " style="height:auto; margin-top: 1.5rem;" v-for="(item,index) in goodsList" :key="index" @click="todetail(item)">
				<view class="w100p ">
					<image :src="item.image" class="w100p" :style="'height:'+goodsImgHeight " />
				</view>
				
				<view class="w100p  fs1r" style="height: 2.5rem;">
					<view class="name h100p" style="font-size: 12px; overflow:hidden;">{{$endwith(item.name,28)}}</view>
				</view>
				<view class="center96  flex m-sb" style="margin-top: 0;">
					<span class="price">￥{{item.prePrice==0?item.price:item.prePrice}}</span>
					<span class="sale-num" >销量{{item.saleNum||'0'}}件</span>
				
		        </view>
				
			</view>		
		</view>
		
		
		<view style="height: 2rem;">
			
		</view>

		
	</view> 
</template>

<script> 
  
  	export default {  
          components:{   
  			 
  		},
  		data() {
  			let _conf=this.getConst();
  			let sysinfo=this.getSysInfo();
			
			let _screenWidth=sysinfo.screenWidth;		
			
			let _bannerHeight="13rem";
			_bannerHeight=_screenWidth*46/75+"px";		
			let _goodsImgHeight=(_screenWidth*0.48*0.94)+"px";
			
  			return {
				bannerHeight:_bannerHeight,
				goodsImgHeight:_goodsImgHeight,
  				conf:_conf,
  				
  				carouselList:[{"pic":""}],
  				categoryList:[],
  				
  				adList:[{"pic":""}],
  				//adList2:[{"pic":""}],
  				
  				
  				activity1:{},
  				activity2:{},
  				activity3:{},
  				
  				
  				cond:{
  					pagefrom:"",
  					pagesize:10,
  				},
  				goodsList:[],
  
  			};
  		},
  		
  		onNavigationBarSearchInputClicked: async function(e) {
  			//this.$api.msg('点击了搜索框');
  			
  			this.$navigateTo(`/pages/goods/HM-search`);
  		},
  		//点击导航栏 buttons 时触发
  		onNavigationBarButtonTap(e) {
  			console.log(e);
  			const index = e.index;
  			if (index === 0) {
  		
  				this.$navigateTo('/pages/index/notice');
  			} else if (index === 1) {
  				
  			}
  		},
		onReachBottom() {
			uni.showLoading({"title":"加载中"});
			setTimeout(this.getProudctList,500);
		},
  		onShow() {
  			this.$isFocus();
			
			if(!!this.getUser()&&!!this.getUser().id)this.$refreshUser(this.getUser().id);
  		},
  		onLoad() {
			
			//this.initConfig();
  			this.wxLogin();
  			
  			
  			this.getBannerList();
  			this.loadCateList();
  			
  			
  			this.load_ac1();
  			this.load_ac2();
  			this.load_ac3();
  			this.load_ad_cont();

  			this.reloadProductList();		
  
  		},
  		methods: {
  			
  			navToBannerPage(item){
  				if(item.type==="type3"){				
  					let o={};
  					o.image=item.url;
  					o.describe="";
  					//o.style="width:10rem;height:10rem"
  					
  					this.$dataLocal("show_img_param",o);
  					this.$navigateTo("/pages/common/show-img")
  					
  				}else if(item.type==="type2"){
  					this.$navigateTo(item.url)
  			
  				}else{// if(item.type==="type1")
				
				this.$jumpExter(item.url);
				}  				
  			},
  			
  			toaclist(e){
  				if(this.$notNull(e.goodsNum)&&e.goodsNum>1){								
  					let uri="/pages/goods/goods-list?acid="+e.id+"&name="+e.name;
  					this.$navigateTo(uri);
  					
  				}else{
  					this.$post("goods/query",{"activityId":e.id},res=>{
						let li=res.rows;
						if(!!li&&li.length>0){
							this.todetail(li[0]);
						}else{
							this.$toast("还没有商品参与该活动")
						}
  						
  					})
  					
  					
  				}
  				
  			},
  			
  			load_ac1(){
  				this.$post("activity/find",{"id":1},res=>{
  					console.log(res);
  					let data=res.data;
  					let img_list=[];
  					if(!!data.imageList)img_list=JSON.parse(data.imageList);
  					
  					data.image=img_list[0];
  					
  					this.activity1=data;
  				})
  				
  			},
  			load_ac2(){
  				this.$post("activity/find",{"id":2},res=>{
  					console.log(res);
  					let data=res.data;
  					let img_list=[];
  					if(!!data.imageList)img_list=JSON.parse(data.imageList);
  					
  					data.image=img_list[0];
  					
  					this.activity2=data;
  				})
  				
  			},
  			
  			load_ac3(){
  				this.$post("activity/find",{"id":3},res=>{
  					console.log(res);
  					let data=res.data;
  					let img_list=[];
  					if(!!data.imageList)img_list=JSON.parse(data.imageList);
  					
  					data.image=img_list[0];
  					
  					this.activity3=data;
  				})
  				
  			},
  			
  			todetail(e){
  				let id = e.id;
  				let url=`/pages/goods/detail?id=${id}`
  				this.$navigateTo(url);
  			},
  			
  			tocatelist(e){
  				
  				let cur_cate=e;
  				let uri='/pages/goods/goods-list?cid=' + cur_cate.id + '&name=' + cur_cate.name;
  				//console.log(uri);
  				this.$navigateTo(uri);
  			
  				
  			},
  			
  			load_ad_cont(){
  			
  				
  				let that=this;
  				this.$post("resource/find",{"name":"cfg_mall_fixed"},function(res){
  					var li=[];
  					var li_str=res.data.value;
  			
  					if(!!li_str){
  						li=JSON.parse(li_str);
  					}
  					for(var i in li){
  						li[i].id=parseInt(i)+1;
  					}
  					
  					
  					that.adList=li;					
  				})
  			},
  			
  /* 			load_ad_cont2(){
  			
  				
  				let that=this;
  				this.$post("resource/find",{"name":"cfg_mall_fixed2"},function(res){
  					var li=[];
  					var li_str=res.data.value;
  			
  					if(!!li_str){
  						li=JSON.parse(li_str);
  					}
  					for(var i in li){
  						li[i].id=parseInt(i)+1;
  					}
  					
  					
  					that.adList2=li;					
  				})
  			}, */
  			
  			getBannerList(){
  				var that=this;
  				this.$post("resource/find",{"name":"cfg_mall_banner"},function(res){
  					var li=[];
  					var li_str=res.data.value;
  					if(!!li_str){
  						li=JSON.parse(li_str);
  					}
  					for(var i in li){
  						li[i].id=parseInt(i)+1;
  					}
  					
  					
  					that.carouselList=li;			
  					that.swiperLength = li.length;
  					
  				})
  				
  			},
  			
  			reloadProductList(){
  				this.cond.pagefrom=1;
  				this.goodsList=[],
  				this.getProudctList();
  			},
  			getProudctList(){
  				var o={}
  				o.pagefrom=this.cond.pagefrom;
  				o.pagesize=this.cond.pagesize;
  				//o.types="1,11";
  				o.desc="sortLevel";
  				o.isUp=1;
  				var that=this;
  				this.$post("goods/query",o,function(res){
  					var li=res.rows;
  					for(var i in li){
  						var item=li[i];					
  						 item.image=that.getLi(item.imageList)[0]||that.getConst("").default_img;
  					}
  			
  					that.goodsList=that.goodsList.concat(li);
					uni.hideLoading();
  					if(li.length>0){
  						that.cond.pagefrom=that.cond.pagefrom+1;
  					}
  				})			
  			},
  			
  			loadCateList(){
  				var o={};
  				o.level=1; o.grade=1;
  				o.stat=1;
  				o.desc="sortLevel";
  				var _this=this;
  				this.$post("goodscate/query",o,function(res){
  					var li=res.rows;
  					_this.categoryList=li;
  				})
  				
  			},
  			
  			tosearch(e){
  				console.log(e);
  			}
  
  		}
  	}
</script>

<style lang="scss" scoped>

	
	.name{
			font-size: 26upx;
			color: #555;
		}
		
	.sale-num{
			 color:#bbbbbb;
			 font-size:14px;
			 
		}
		
		.price{
			 color:#fa436a;
			 font-size:14px
		}
	
</style>
