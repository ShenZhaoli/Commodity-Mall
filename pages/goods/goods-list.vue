<template>
	<view>
		<view class="header" style="position:absolute;top:0%">
			<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index" :class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view> 

		<!-- 商品列表 -->
		<view class="goods-list" >
			<view class="product-list" style="padding-top: 1.6rem;">
				<view class="product flex-col c-center" style="margin-top: 1.6rem;" v-for="(goods) in goodsList" :key="goods.id" @tap="toGoods(goods)">
					<image v-if="!!goods.image&&goods.image.indexOf('.mp4')==-1" style="width: 8.8rem;height: 8.8rem;"  :src="goods.image"></image>
					<video v-if="!!goods.image&&goods.image.indexOf('.mp4')>-1" style="width: 8.8rem;height: 8.8rem;" autoplay="true" loop="true" muted="true"  :src="goods.image"></video>
					<view class="name">{{goods.name}}</view>
					<view class="info">
						<span class="decoration" style="font-size: 13px;">￥<span v-text="goods.prePrice==0?goods.price:goods.prePrice"></span> </span>
						<span class="price_count" >会员价:￥{{goods.price}}</span>
						
						
						
						<view class="slogan">{{goods.slogan}}</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
		
		<view v-if="goodsList.length==0" class="flex m-center c555 fs7dr " style="margin-top: 1rem;">空空如也~~~</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				goodsList:[],
				loadingText:"正在加载...",
				
				
				orderbyList:[
					{text:"销量",selected:true,orderbyicon:false,orderby:0},
					{text:"价格",selected:false,orderbyicon:['sheng','jiang'],orderby:0},
					{text:"好评",selected:false,orderbyicon:false,orderby:0}
				],
				orderby:"sheng",
				cond:{
					pagesize:10,
					pagefrom:1,
					isUp:1,
					desc:"sortLevel",
					asc:"",
					
					cateId:"",
					subCateId:"",
				},
				
				userInfo:{},
				
				
				title:"商品列表",
				
				option:{},
			};
		},
		onPageScroll(e){
			
			
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom(){
			uni.showToast({title: '加载中···'});
			var cateid=this.cond.cateId;
			this.getProductByCid(cateid);
			
		},
		onLoad: function (e) { //option为object类型，会序列化上个页面传递的参数
			
		
		    this.option=e;
			
			//console.log(e); //打印出上个页面传递的参数。
		
			this.setTitleAndCateId(e);
			
			if(this.$notNull(e.acid)){
				this.reloadacgoodsList(e.acid);
			}
			
			else{
				this.reloadProductList(e.cid);
			}
			
			
			
		},
		methods:{
			reloadacgoodsList(acid){
				this.goodsList=[];
				this.cond.pagefrom=1;
				this.getacgoodsByCid(acid);
			},
			getacgoodsByCid(acid){
				this.cond.activityId=acid;
				this.load_data(this.cond);
				
			},

			

			reloadProductList(cid){
				this.goodsList=[];
				this.cond.pagefrom=1;
				this.getProductByCid(cid);
			},
			getProductByCid(cid){
				 					
				let e=this.option;
				if(e.sub==1){
					this.cond.subCateId=e.cid;
					this.cond.cateId=""
				}else{
					this.cond.cateId=e.cid;
					this.cond.subCateId="";
				}				
				this.load_data(this.cond);													
			},
			load_data(cond){
				var that=this;
				this.$post("goods/query",cond,function(res){
					var li=res.rows;
					var userInfo=that.$dataLocal("user_info")||{};
					that.userInfo=userInfo;										
					for(var i in li){
						var item=li[i];																			
					     item.image=that.getLi(item.imageList)[0]||that.getConst("").default_img;
					}
									
					var old_li=that.goodsList;
					var new_li=old_li.concat(li);
										
					that.goodsList=new_li;
					if(li.length>0){
						that.cond.pagefrom=that.cond.pagefrom+1;
					}
				})
				
			},
			
			setTitleAndCateId(o){
				
						
				if(!!o.name){
					this.title=o.name;
				}
				uni.setNavigationBarTitle({
					title: this.title
				});	 
			},
	
			//商品跳转
			toGoods(e){
				let id = e.id;
				uni.navigateTo({
					url: `/pages/goods/detail?id=${id}`
				})
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
				if(tmpTis=="价格排序 升序"){
					this.cond.asc="price"
					this.cond.desc="";
				}else if(tmpTis=="价格排序 降序"){
					this.cond.desc="price"
					this.cond.asc="";
				}else if(tmpTis.indexOf("销量排序")>-1){
					this.cond.desc="saleNum";
					this.cond.asc="";
				}else if(tmpTis.indexOf("好评排序")>-1){
					this.cond.desc="commentNum";
					this.cond.asc="";
				}
				
				var cid=this.cond.cateId
				this.reloadProductList(cid);
				uni.showToast({title:tmpTis,icon:"none"});
			}
		},

		
		
	}
</script>

<style lang="scss">
	//@import  url("../../static/css/common.css");
	//@import  url("../../static/css/font.css");
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
		 font-size:14px;
		 
	}
	
	.decoration{
		text-decoration:line-through;
		 color:#999;
		 font-size:14px
	}
	/* .uni-video {
		width: 163px;
		height: 177px;
		display: inline-block;
		line-height: 0;
		overflow: hidden;
		position: relative;
} */
	
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
		height: 100upx;

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
			//padding: 0 4% 3vw 4%; 
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.product{
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 0 0;
				box-shadow: 0upx 5upx 25upx rgba(0,0,0,0.1);
				image{
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
				.name{
					width: 92%;
					padding: 8upx 4%;
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
					padding: 10upx 4% 10upx 4%;
					
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
