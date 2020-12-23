<template>
	<view class="content">
		<swiper class="swiper" 
		:autoplay="autoplay" 
		:duration="duration">
			<swiper-item v-for="(ite,idx) in imglist" :key="idx">
				<view class="swiper-item">
					<view class="swiper-item-img2 flex m-center c-center">
						<image :src="ite.pic" ></image>
					</view>
				</view>
				<view class="jump-over" @tap="launchFlag()">{{jumpover}}</view>
				
				<view class="experience" v-if="idx==imglist.length-1" @tap="launchFlag()">{{experience}}</view>
			</swiper-item>

		</swiper>
		 
		<view class="uniapp-img"><image :src="fix_img[0].pic" mode="aspectFit"></image></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				autoplay: false,
				duration: 500,
				jumpover: '跳过',
				experience: '立即体验',
				
				
				imglist:[{"pic":"http://tshumall.oss-cn-beijing.aliyuncs.com/a/a/2aa54e08899f9b4a81cc65e543a3e427fe1.png"},
				         {"pic":"http://tshumall.oss-cn-beijing.aliyuncs.com/8/e/28e0827650e38a8e62c04851686e8a07294.png"},
						],
				fix_img:[{"pic":"http://tshumall.oss-cn-beijing.aliyuncs.com/1/a/21a2f73e31a6d93cdcbd060e20ffb664e57.png"}],
			}
		},
		created() {
			this.initstat();

		},
		methods: {
			load_swiper(){
				this.$post("resource/find",{"name":"cfg_guide_swiper"},res=>{
					let li=[]
					let val=res.data.value;
					if(!!val){
						li=JSON.parse(val);
						this.imglist=li;
					}

					
				})
				
			},
			load_fixed(){
				this.$post("resource/find",{"name":"cfg_guide_img"},res=>{
					
					let li=[]
					let val=res.data.value;
					if(!!val){
						li=JSON.parse(val);this.fix_img=li;
					}
					
					
				})
				
			},	
			launchFlag: function(){

				this.$dataLocal('launchFlag',1);
				
				this.$reLaunch("/pages/index/index");
				
			},
			initstat(){
				let b=this.$dataLocal('launchFlag');							
				if(1==b){
					this.$redirectTo("/pages/index/index");
				}else{
					this.load_swiper();
					this.load_fixed();
				}			
			}
		}
	}
</script>
<style>
	page,
	.content{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
	}
	.swiper{
		width: 100%;
		height: 80%;
		background: #FFFFFF;
	}
	.swiper-item {
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		display: flex;
		/* justify-content: center; */
		align-items:flex-end;
		flex-direction:column-reverse
	}
	
	.swiper-item-img2{
		
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}
	.swiper-item-img{
		width: 100%;
		height: auto;
		margin: 0 auto;
	}
	.swiper-item-img image{
		width: 80%;
	}
	.uniapp-img{
		height: 20%;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items:center;
		overflow: hidden;
	}
	.uniapp-img image{
		width: 40%;
	}
	
	.jump-over,.experience{
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		border: 1px solid #454343;
		z-index: 999;
	}
	.jump-over{
		right: 45upx;
		top: 125upx;
	}
	.experience{
		right: 50%;
		margin-right: -105upx;
		bottom: 0;
	}
</style>
