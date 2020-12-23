<template>
	<view>
		
	<view class="header-space"></view>	

	
		<view class="category-list cont-mt">
			<!-- 左侧分类导航 -->
			
			 <scroll-view  scroll-y="true" class="left" >
                <view class="row" v-for="(category,index) in categoryList" :key="category.id" :class="[index==showCategoryIndex?'on':'']" @tap="showCategory(index)">
					<view class="text">
						<view class="block"></view>
						{{category.name}}
					</view>
				</view>
				
            </scroll-view> 
			<!-- 右侧子导航 -->
			 <scroll-view  scroll-y="true" class="right" >
				
			    <view class="category" v-for="(category,index) in categoryList" :key="category.id" v-show="index==showCategoryIndex" >
					<view class="banner">
						<image :src="adList[0].pic" @click="navToBannerPage(adList[0])"></image>
					</view>
					<view class="list">
						<view class="box" v-for="(box,i) in category.list" :key="i" @tap="toCategory(box)">
							<image :src="box.image"></image>
							<view class="text">{{box.name}}</view>
						</view>
					</view>
				</view>
				
			</scroll-view>  
		</view>
	</view>
</template>
<script>


	export default {
		components:{},
		
		data() {
			return {
				showCategoryIndex:0,				
				
				//分类列表
				categoryList:[],
				banner:'',
				
				adList:[{"pic":""}],
				user_info:{}
			}
		},
        onNavigationBarSearchInputClicked: async function(e) {

  			this.$navigateTo(`/pages/goods/HM-search`);
  		},
		onLoad() {
			
			this.initCateList();
			//this.getBannerList();
			this.load_ad_cont();
			
		},
		methods: {
			
			
			
			navToBannerPage(item) {
				
			},
			load_ad_cont(){
				var that=this;
				this.$post("resource/find",{"name":"cfg_cate_banner"},function(res){
					var li=[];
					var li_str=res.data.value;
					if(!!li_str){
						li=JSON.parse(li_str);
					}
					for(var i in li){
						li[i].id=parseInt(i)+1;
					}
					console.log(li);
					that.adList=li;			
					//that.swiperLength = li.length;
					
				})
			},

			initCateList(){
				var _this=this;
				var o={};
				o.desc="sortLevel";
				o.stat=1;
				o.pagesize=100;
				o.pagefrom=1;
				this.$post("goodscate/query",o,function(res){
					var sub_list=[];
					var list=[];		
					for(var i in res.rows){
						var item=res.rows[i];
						if(item.level==1||item.grade==1){
							list.push(item);
						}else if(item.level==2||item.grade==2){
							sub_list.push(item);
						}
					}
					
					for(var j in list){
						var item=list[j];
						item.list=[];
						for(var k in sub_list){
							var ite=sub_list[k];
							if(item.id==ite.pId){
								item.list.push(ite);
							}							
						}
					}
					_this.categoryList=list;		
					
				})
				
			},

			//分类切换显示
			showCategory(index){
				this.showCategoryIndex = index;
				var list=this.categoryList;
				var cur_cate={};
				for(var i in list){
					var ite=list[i];
					if(i==index){
						cur_cate=ite;
					}
				}
				
				if(cur_cate.list.length==0){
					uni.navigateTo({
						url: '/pages/shop/goods-list?cid=' + cur_cate.id + '&name=' + cur_cate.name
					});
				}
				
				
				
			},
			toCategory(e){
				//uni.showToast({title: e.name,icon:"none"});
				uni.navigateTo({
					url: '/pages/goods/goods-list?cid=' + e.id + '&sub=1'
				});
			},
			//搜索跳转
			tosearch(e){
				uni.navigateTo({
					url: `/pages/goods/HM-search`
				})
			}
		}
	}
</script>
<style lang="scss">


	.category-list{
		//margin-top: 2.8rem;
		width: 100%;
		background-color: #fff;
		display: flex;
		.left,.right{
			//position: absolute;		
			//top: 100upx;
			//bottom: 0upx;
		}
		.left{
			width: 24%;
			left: 0upx;
			background-color: #f2f2f2;
			.row{
				width: 100%;
				height: 90upx;
				display: flex;
				align-items: center;
				.text{
					width: 100%;
					position: relative;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					color: #3c3c3c;
					.block{
						position: absolute;
						width: 0upx;
						left: 0;
					}
				}
				&.on{
					height: 100upx;
					background-color: #fff;
					.text{
						font-size: 30upx;
						font-weight: 600;
						color: #2d2d2d;
						.block{
							width: 10upx;
							height: 80%;
							top: 10%;
							background-color: #f06c7a;
						}
					}
				}
			}
		}
		.right{
		   width: 76%;
			left: 24%;
			.category{
				width: 94%;
				padding: 20upx 3%;
				.banner{
					width: 100%;
					height: 5.5rem;
					border-radius: 10upx;
					overflow: hidden;
					box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.3);
					image{
						width: 100%;
						height: 5.5rem;
					}
				}
				.list{
					margin-top: 40upx;
					width: 120%;
					display: flex;
					flex-wrap: wrap;
					.box{
						width: calc(71.44vw / 3);
						margin-bottom: 30upx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						image{
							width: 60%;
							height: calc(71.44vw / 3 * 0.6);
						}
						.text{
							margin-top: 5upx;
							width: 100%;
							display: flex;
							justify-content: center;
							font-size: 26upx;
						}
					}
				}
			}
		}
	}

</style>
