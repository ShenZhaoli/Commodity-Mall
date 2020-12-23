<template>
    <view class="page">
        <view class='feedback-title'>
            <text>问题和意见</text>
            <text class="feedback-quick" @tap="chooseMsg">快速键入</text>
        </view>
        <view class="feedback-body">
            <textarea placeholder="请详细描述你的问题和意见..." v-model="sendDate.content" class="feedback-textare" />
            </view>
        <view class='feedback-title'>
            <text>图片(选填,提供问题截图,总大小10M以下)</text>
        </view>
        <view class="feedback-body feedback-uploader">
            <view class="uni-uploader">
                <view class="uni-uploader-head">
                    <view class="uni-uploader-title">点击预览图片</view>
                    <view class="uni-uploader-info">{{imageList.length}}/9</view>
                </view>
                <view class="uni-uploader-body">
                    <view class="uni-uploader__files" >
                        <block v-for="(image,index) in imageList" :key="index">
                            <view class="uni-uploader__file" style="position: relative;">
                                <image class="uni-uploader__img" :src="image" @tap="previewImage"></image>
                                <view class="close-view" @click="close(index)">x</view>
                            </view>
                        </block>
                        <view class="uni-uploader__input-box" v-show="imageList.length < 8">
                        	<view class="uni-uploader__input" @tap="upload_imgs()"></view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
       <!-- <view class='feedback-title'>
            <text>QQ/邮箱</text>
        </view>
        <view class="feedback-body">
            <input class="feedback-input" v-model="sendDate.contact" placeholder="(选填,方便我们联系你 )" />
        </view> -->
        <view class='feedback-title feedback-star-view'>
            <text>评分</text>
            <view class="feedback-star-view">
                <text class="feedback-star" v-for="(value,key) in stars" :key="key" :class="key < sendDate.score ? 'active' : ''" @tap="chooseStar(value)"></text>
            </view>
        </view>
        <button type="primary" class="feedback-submit" @tap="send">提交</button>
        <view class='feedback-title'>
            <text>用户评论之后可以前往对应的商品查看</text>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                msgContents: ["货品与描述不符和", "物流太慢", "宝贝非常nice,超出我的预期，好评！", "物流很快"],
                stars: [1, 2, 3, 4, 5],
                imageList: [],
				
				//upload_img_list:[],
				order_id:"",
				
                sendDate: {
                    score: 0,
                    content: "",
                    contact: ""
                }
            }
        },
        onLoad(e) {
			this.order_id=e.id;
			
			
			return;
            let deviceInfo = {
                appid: plus.runtime.appid,
                imei: plus.device.imei, //设备标识
                p: plus.os.name === "Android" ? "a" : "i", //平台类型，i表示iOS平台，a表示Android平台。
                md: plus.device.model, //设备型号
                app_version: plus.runtime.version,
                plus_version: plus.runtime.innerVersion, //基座版本号
                os: plus.os.version,
                net: "" + plus.networkinfo.getCurrentType()
            }
            this.sendDate = Object.assign(deviceInfo, this.sendDate);
        },
        methods: {
            close(e){
                this.imageList.splice(e,1);
            },
            chooseMsg() { //快速输入
                uni.showActionSheet({
                    itemList: this.msgContents,
                    success: (res) => {
                        this.sendDate.content = this.msgContents[res.tapIndex];
                    }
                })
            },
            /* chooseImg() { //选择图片
				uni.chooseImage({
					 sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					 sourceType: ['album'], //从相册选择
					 count: 9- this.imageList.length,
						success: (res) => {
							this.imageList = this.imageList.concat(res.tempFilePaths);
						}
				})
			
            }, */
			upload_imgs(img_list){
				this.$chooseImageUpload(9,res=>{
					//this.upload_img_list=res;
					this.imageList=res;
				})
				
				
				/* let LIST=img_list;
				let  images = [];
				for(var i = 0,len = LIST.length; i < len; i++){
					var image_obj = {name:'image-'+i,uri:LIST[i]};
					images.push(image_obj);
				}
				console.log(images);
				for(let i in images){
					let file=images[i].uri;
					uni.uploadFile({
						url: restgo.uploadUrl, //仅为示例，非真实的接口地址
						filePath: file,
						name: 'file',
						formData: {
							'user': 'test'
						},
						success: (uploadFileRes) => {
							var obj=JSON.parse(uploadFileRes.data);
							var img=obj.data[0].url
							this.upload_img_list.push(img)
							
						},
						fail: (e) => {
							console.log("e: " + JSON.stringify(e));
							
							uni.showToast({
								icon:'none',
								title:"发布失败,请检查网络"
							})
						}
					 });
				} */
				
			},
			
            chooseStar(e) { //点击评星
                this.sendDate.score = e;
            },
            previewImage() { //预览图片
                uni.previewImage({
                    urls: this.imageList
                });
            },
            send() { //发送反馈
                console.log(JSON.stringify(this.sendDate));
				if (!this.sendDate.content) {
					uni.showModal({ content: '评论内容不能为空', showCancel: false, });
					return;
				}
              /*  let imgs = this.imageList.map((value, index) => {
                    return {
                        name: "image" + index,
                        uri: value
                    }
                })				
				console.log(imgs); */
				//this.upload_imgs(this.imageList);
				//console.log(this.upload_img_list);

				
				this.$toast("评论成功");
				setTimeout(()=>{
					var o={};
					o.context=this.sendDate.content;
					o.score=this.sendDate.score;
					o.img_list=this.imageList;
					var order={};
					order.id=this.order_id;
					order.commentDetail=JSON.stringify(o);
					var _this=this;
					//order.stat=6;
					this.$post("order/update",order,function(){
						
						uni.redirectTo({
							"url":'/pages/order/order?stat=4'
						})
						
					})
					
					uni.hideLoading();
				},2000)
				

            }
        }
    }
</script>

<style>
    @font-face {
    	font-family: uniicons;
    	font-weight: normal;
    	font-style: normal;
    	src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
    }
    page {
        background-color: #EFEFF4;
    }
    view{
        font-size: 28upx;
    }
    .input-view {
        font-size: 28upx;
    }
    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
    /* 上传 */
    .uni-uploader {
    	flex: 1;
    	flex-direction: column;
    }
    .uni-uploader-head {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    }
    .uni-uploader-info {
    	color: #B2B2B2;
    }
    .uni-uploader-body {
    	margin-top: 16upx;
    }
    .uni-uploader__files {
    	display: flex;
    	flex-direction: row;
    	flex-wrap: wrap;
    }
    .uni-uploader__file {
    	margin: 10upx;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__img {
    	display: block;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__input-box {
    	position: relative;
    	margin:10upx;
    	width: 208upx;
    	height: 208upx;
    	border: 2upx solid #D9D9D9;
    }
    .uni-uploader__input-box:before,
    .uni-uploader__input-box:after {
    	content: " ";
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	-webkit-transform: translate(-50%, -50%);
    	transform: translate(-50%, -50%);
    	background-color: #D9D9D9;
    }
    .uni-uploader__input-box:before {
    	width: 4upx;
    	height: 79upx;
    }
    .uni-uploader__input-box:after {
    	width: 79upx;
    	height: 4upx;
    }
    .uni-uploader__input-box:active {
    	border-color: #999999;
    }
    .uni-uploader__input-box:active:before,
    .uni-uploader__input-box:active:after {
    	background-color: #999999;
    }
    .uni-uploader__input {
    	position: absolute;
    	z-index: 1;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	opacity: 0;
    }
    
    /*问题反馈*/
    .feedback-title {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    	align-items: center;
    	padding: 20upx;
    	color: #8f8f94;
    	font-size: 28upx;
    }
    .feedback-star-view.feedback-title {
    	justify-content: flex-start;
    	margin: 0;
    }
    .feedback-quick {
    	position: relative;
    	padding-right: 40upx;
    }
    .feedback-quick:after {
    	font-family: uniicons;
    	font-size: 40upx;
    	content: '\e581';
    	position: absolute;
    	right: 0;
    	top: 50%;
    	color: #bbb;
    	-webkit-transform: translateY(-50%);
    	transform: translateY(-50%);
    }
    .feedback-body {
    	background: #fff;
    }
    .feedback-textare {
    	height: 200upx;
    	font-size: 34upx;
    	line-height: 50upx;
    	width: 100%;
    	box-sizing: border-box;
    	padding: 20upx 30upx 0;
    }
    .feedback-input {
    	font-size: 34upx;
    	height: 50upx;
    	min-height: 50upx;
    	padding: 15upx 20upx;
    	line-height: 50upx;
    }
    .feedback-uploader {
    	padding: 22upx 20upx;
    }
    .feedback-star {
    	font-family: uniicons;
    	font-size: 40upx;
    	margin-left: 6upx;
    }
    .feedback-star-view {
    	margin-left: 20upx;
    }
    .feedback-star:after {
    	content: '\e408';
    }
    .feedback-star.active {
    	color: #FFB400;
    }
    .feedback-star.active:after {
    	content: '\e438';
    }
    .feedback-submit {
    	background: #007AFF;
    	color: #FFFFFF;
    	margin: 20upx;
    }
</style>
