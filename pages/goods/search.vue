<template>
	<view>
		
		<!-- 占位 -->
		<!-- <view class="place"></view> -->
		<!-- <view class="mp-search-box" style="margin-top: 1rem;">
			<input class="ser-input" type="text" placeholder="输入关键字搜索" v-model="kword"/>
		</view> -->
			<!-- <view class="search-box" style="margin-top: -3rem;" @tap="toSearch()">
				<mSearch class="mSearch-input-box" type="text" placeholder="输入关键字搜索" v-model="kword"></mSearch>
		   </view> -->
		<!-- 商品列表 -->
		<view class="goods-list" style="margin-top: 1rem;">
			<view class="product-list">
				<view class="product" v-for="(goods,idx) in goodsList" :key="idx" @tap="toGoods(goods)">
					<image style="width: 8rem;height: 8rem;" :src="goods.image"></image>
					<view class="name">{{goods.name}}</view>
					<view class="info">
					
						<view class="flex m-sb w100p">
						<span class="decoration">￥{{goods.price}},</span>
						<span class="price_count" >销量:{{goods.saleNum||0}}</span>
						</view>
						
						
						
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	export default {
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch
		},
		data() {
			return {
				goodsList:[],
				loadingText:"未搜索到该商品...",
				headerTop:"0px",
				headerPosition:"fixed",
				orderbyList:[
					{text:"销量",selected:true,orderbyicon:false,orderby:0},
					{text:"价格",selected:false,orderbyicon:['sheng','jiang'],orderby:0},
					{text:"好评",selected:false,orderbyicon:false,orderby:0}
				],
				orderby:"sheng",
				cond:{
					pagesize:10,
					pagefrom:1,
					name:"",

				},
				kword:"",
				
				userInfo:{},
			};
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.cid); //打印出上个页面传递的参数。
		    if(!!option.kword){
				this.cond.name=option.kword;
				this.reloadProductList();
			}
			//this.setTitleAndCateId(option);
			this.setHeight();
			//this.reloadProductList(15);
			
		},
		watch:{
			"kword":function(n,o){
				this.toSearch();
				/* this.cond.name=n;
				this.reloadProductList();
				console.log(o,n) */
			}
		},
		methods:{
			toSearch(){
				uni.redirectTo({
					url: `/pages/product/HM-search`
				})
			},
			setHeight(){
				
				//兼容H5下排序栏位置
				// #ifdef H5
					//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
					let Timer = setInterval(()=>{
						let uniHead = document.getElementsByTagName('uni-page-head');
						if(uniHead.length>0){
							this.headerTop = uniHead[0].offsetHeight+'px';
							clearInterval(Timer);//清除定时器
						}
					},1);
				// #endif
			},

			reloadProductList(cid){
				this.goodsList=[];
				this.cond.pagefrom=1;
				this.getProductByCid(cid);
			},
			getProductByCid(cid){
				var o={};
				o.pagefrom=this.cond.pagefrom;
				o.pagesize=this.cond.pagesize;
				o.name=this.cond.name;

				var that=this;
				o.isUp=1;
				this.$post("goods/query",o,function(res){
					var li=res.rows;
					var userInfo=that.$dataLocal("user_info")||{};
					that.userInfo=userInfo;
					for(var i in li){
						var item=li[i];
						/* if(userInfo.level>100&&item.type==1){
							item.price_nomarl=that.$round2pos(item.price);
							item.price=that.$round2pos(item.price*0.88);
							if(!!item.prePrice){item.price=item.prePrice}
						} */
						item.image=that.getLi(item.imageList)[0];
					}
					var old_li=that.goodsList;
					var new_li=old_li.concat(li);
					that.goodsList=new_li;
					console.log(new_li)
					if(li.length>0){
						that.cond.pagefrom=that.cond.pagefrom+1;
					}
				})
				
				
			},
			
	
			//商品跳转
			toGoods(e){
				//uni.showToast({title: '商品'+e.id,icon:"none"});
				// uni.navigateTo({
				// 	url: '../goods/goods?gid='+e.id 
				// });
				let id = e.id;
				this.$navigateTo(`/pages/goods/detail?id=${id}`)

			},
			//排序类型
			select(index){
				let tmpTis = this.orderbyList[index].text+"排序 "
				if(this.orderbyList[index].orderbyicon){
					let type = this.orderbyList[index].orderby==0?'升序':'降序';
					if(this.orderbyList[index].selected){
						type = this.orderbyList[index].orderby==0?'降序':'升序';
						this.orderbyList[index].orderby = this.orderbyList[index].orderby==0?1:0;
					}
					tmpTis+=type
				}
				this.orderbyList[index].selected = true;
				let len = this.orderbyList.length;
				for(let i=0;i<len;i++){
					if(i!=index){
						this.orderbyList[i].selected = false;
					}
				}
				console.log(tmpTis)
				if(tmpTis=="价格排序 升序"){
					this.cond.asc="price"
					this.cond.desc="";
				}else if(tmpTis=="价格排序 降序"){
					this.cond.desc="price"
					this.cond.asc="";
				}else if(tmpTis=="销量排序"){
					this.cond.desc="saleNum";
					this.cond.asc="";
				}else if(tmpTis=="好评排序"){
					this.cond.desc="commentNum";
					this.cond.asc="";
				}
				
				var cid=this.cond.cateId
				this.reloadProductList(cid);
				uni.showToast({title:tmpTis,icon:"none"});
			}
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom(){
			uni.showToast({title: '触发上拉加载'});
			var cateid=this.cond.cateId;
			this.getProductByCid(cateid);
			
		},
		
		
	}
</script>

<style lang="scss">
		.search-box {width:95%;background-color:rgb(242,242,242);padding:15upx 2.5%;display:flex;justify-content:space-between;}
	.search-box .mSearch-input-box{width: 100%;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:28upx;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:60upx;}
	.search-box .input-box>input {width:100%;height:60upx;font-size:32upx;border:0;border-radius:60upx;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	
	
	
	@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMMAAsAAAAAB3gAAALAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCfgqCXII4ATYCJAMMCwgABCAFhG0HQxuDBsiemjxBRCmUAtQ2VRCBG4ig2u+zZ3c/ortTgBIoQOVPBYSJYkUggWRSPqyjY2yEQyPe5FzmkfXucrOArBAKSdt/TjNmNTZyfrOTKAwgNQXmqbkEBgj2eS6nNz3A+YFyXHs9P2raURxQgHtR7yiyEknMW4bXLsaDeEygbVEkxYXiyhqgV+BVgbgmCQzQ55xKS2doCvWag0W8o9FMz9M24G34/fgvPvQktQxvPL5axIPc38m/U/JI9VSLIKjm80M7RsYWoBAXa4PHVHFxi0rbKaotAfuaFfxOqSp+Jwvlbv/wCImow+1dsAaGdEcqZnRrKhAggQzqaOI24Bmw02JRZmZ88bS/fq2vH6Y1yywb576F7tn3l1/5e7zm6Ze2+cW37DBXjFEftC+6U7vil0/zOvXIl3lf7cx/3DkeysBDV/tDQ5N7tli9AzsiHDgcO55136FS8LLTzBygm4Q9u6bCp1zAy0lh7v/L+PnQ0P71YAZeG0pE3eWwRIIOANX5dz4JQCX8hQLB+5z/hXZb5ofeVMCvjc0fKFEp+rs1bzkU/H5Vz67iarArF1vJlH4oO8g0SGi7EVU4OnY43jzr3U5omqVIGhaQNS2Rhd1CTcc26ppOo21TyfGOCUIlSgsbJhHC0DqSvp/IhnbIwh6gZu4BdcNQoe1iuC7sWAnJWEAQQxEP2V4ocQE/ph5qjDqrkNDpZUhWE4rrEJGlDIyLji1WSpAfkTm2yF1CPKUYYhLwwWL0HPJ6AzBIAm7E0WiR0mB6TAyue1M0F/ABo/MIhEEhPIjVC5JwAvywGE8ZS5+vggg6eTFIC6ejWAchZNL0UJxosT3IEqO/F+dehMi6COJRFAZhRIAPVIz8iJcUA6Bg/Tw3hENFE0fkg9LFSP1wX2P0+mbf952ANvxUjhQ5is4tRurpjHJLjF9IRbKIHAAA') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:26upx;
		font-style:normal;
		&.sheng {
			&:before{content:"\e737";}
		}
		&.jiang {
			&:before{content:"\e736";}
		}
		
	}
	.price_count{	
		 color:#fa436a;
		 font-size:14px
	}
	
	.decoration{
		//text-decoration:line-through;
		 color:#999;
		 font-size:14px
	}
	
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;
		.ser-input{
			flex:1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color:#111111;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
	
	.header{
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;
		.target{
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;
			&.on{
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}
			
			
		}
	}
.place{
		
		background-color: #ffffff;
		height: 200upx;

	}
.goods-list{
		.loading-text{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
		.product-list{
			width: 100%;
			padding: 0 4% 3vw 4%; 
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.product{
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0,0,0,0.1);
				image{
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
				.name{
					width: 92%;
					//padding: 10upx 4%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}
				.info{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
				//	padding: 10upx 4% 10upx 4%;
					
					.price{
						color: #e65339;
						font-size: 30upx;
						font-weight: 600; 
					}
					.slogan{
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
			
		}
	}
</style>
