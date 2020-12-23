<template>
	<uni-popup ref="showshare" type="bottom" @change="change">
		<view class="uni-share">
			<text class="uni-share-title">分享到</text>
			<view class="uni-share-content">
				<view v-for="(item, index) in bottomData" :key="index"
				@tap="shareItems(item.name)"
				 class="uni-share-content-box">
					<view class="uni-share-content-image">
						<image :src="item.icon" class="content-image" mode="widthFix" />
					</view>
					<text class="uni-share-content-text">{{ item.text }}</text>
				</view>
			</view>
			<text class="uni-share-btn" @click="cancel('share')">取消分享</text>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from '@/components/own-share/uni-popup.vue';
	export default{
		components: {
			uniPopup
		},
		props: {
			shareSummary: {
				type: String,
				default: ''
			},
			shareImage: {
				type: String,
				default: ''
			},
			shareTitle: {
				type: String,
				default: ''
			},
			shareHref: {
				type: String,
				default: ''
			},
			miniProgram: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				bottomData: [{
						text: '微信',
						icon: '../../static/ownshare/wxfriend.png',
						name: 'weixin'
					},
					{
						text: '朋友圈',
						icon: '../../static/ownshare/wxtimeline.png',
						name: 'timeline'
					},
					{
						text: 'QQ',
						icon: '../../static/ownshare/qq.png',
						name: 'qq'
					},
					{
						text: 'qq空间',
						icon: '../../static/ownshare/qqtimeline.png',
						name: 'miniProgram'
					},
					
					{
						text: '新浪',
						icon: '../../static/ownshare/sina.png',
						name: 'sinaweibo'
					},
					
					{
						text: '复制链接',
						icon: '../../static/ownshare/copy.png',
						name: 'copy'
					}
				],
			}
		},
		methods: {
			initapppay(){
				uni.getProvider({
					service: "share",
					success: (e) => {
						//this.$toast("payment success:" + JSON.stringify(e));
						let providerList = [];

						//this.providerList = providerList;
					},
					fail: (e) => {
						console.log("获取支付通道失败：", e);
					}
				});
			},
			
			
			
			open() {
				this.$nextTick(()=>{
					this.$refs['showshare'].open()
				})
			},
			change(e) {
				// console.log('是否打开:' + e.show)
			},
			shareItems(provider){
				let shareOPtions = {
					provider: provider,
					summary: this.shareSummary,
					imageUrl: this.shareImage ? this.shareImage : '',
					href : this.shareHref,
					title : this.shareTitle,
					type : (this.shareImage && this.shareSummary) ? 0 : this.shareImage ? 2 : this.shareSummary ? 1 : '',
					success: (e) => {
						this.$emit('shareSuccess',e)
					},
					fail: (e) => {
						this.$emit('shareFail',e)
					},
				};
				//this.$toast(JSON.stringify(shareOPtions));

				
				if(shareOPtions.type === ''){
					uni.showModal({
						content:'请分享文字或者图片',
						showCancel:false
					})
					return;
				};
				switch (provider){
					case 'weixin':
						shareOPtions.scene = 'WXSceneSession';
						break;
					case 'timeline' :
						shareOPtions.provider = 'weixin';
						shareOPtions.scene = 'WXSenceTimeline';
						break;
					case 'qq' :
						shareOPtions.type = this.shareImage ? 2 : 1;
						break;
					case 'miniProgram' :
						shareOPtions.provider = 'weixin';
						shareOPtions.type = 5;
						shareOPtions.scene = 'WXSceneSession';
						shareOPtions.miniProgram = this.miniProgram;
						break;
					case 'more' :
						plus.share.sendWithSystem({
							type:"web",
							title:shareOPtions.shareTitle,
							thumbs:[shareOPtions.shareImage],
							href:shareOPtions.shareHref,
							content: shareOPtions.summary,
						})
					default:
						break;
				}
				if(shareOPtions.type === 0 && (!shareOPtions.imageUrl || !shareOPtions.href) && shareOPtions.provider == 'weixin'){
					uni.showModal({
						content:'分享图文必须有链接',
						showCancel:false
					})
					return;
				}else if(shareOPtions.type == 5 && (!shareOPtions.imageUrl || !shareOPtions.miniProgram)){
					uni.showModal({
						content:'小程序参数跟图片地址必填',
						showCancel:false
					})
					return;
				}else if((shareOPtions.provider == 'qq' && shareOPtions.type == 1) && !shareOPtions.shareTitle){
					uni.showModal({
						content:'分享文字到 QQ 时，title 必选',
						showCancel:false
					})
					return;
				}
				uni.share(shareOPtions)
			},
			cancel() {
				this.$refs['showshare'].close()
			}
		}
	}
</script>

<style>
	/* 底部分享 */
	.uni-share {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		background-color: #fff;
	}
	
	.uni-share-title {
		line-height: 60rpx;
		font-size: 24rpx;
		padding: 15rpx 0;
		text-align: center;
	}
	
	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 15px;
	}
	
	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		
		//width: 200rpx;
		width:20%;
		margin-top: 0.2rem;
	}
	
	.uni-share-content-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		overflow: hidden;
		border-radius: 10rpx;
	}
	
	.content-image {
		width: 60rpx;
		height: 60rpx;
	}
	
	.uni-share-content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}
	
	.uni-share-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #f5f5f5;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}
</style>
