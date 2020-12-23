<template>
	<view>
		
		
	<form>
			<swiper :current="subjectIndex" class="swiper-box" @change="SwiperChange" :style="{'height':swiperHeight}">
				<swiper-item v-for="(subject,index) in subjectList" :key="index">
					
					<view v-if="index-subjectIndex>=-1&&index-subjectIndex<=1">
										
					<view class="cu-bar bg-white solid-bottom">
						<view class="action text-black">
							<text class="cuIcon-title text-red"></text>{{subject.title}}
						</view>
					</view>
					<view>

						<radio-group class="block"  @change="RadioboxChange" v-if="subject.type===1||subject.type===3">
							<view class="cu-form-group flex " style="margin-top: 1rem;"  v-for="(option,index) in subject.optionList" :key="index">
								<radio :value="option.id"></radio>
								<view class="title text-black">{{option.id}}.{{option.content}}</view>
							</view>
						</radio-group>
					</view>
					</view>
				</swiper-item>
			</swiper>
		</form>

       <view class="notice">
			<view>用户须知:</view>
			<view><text style="font-size: 15px;">可以联系售后微信:{{wx}}</text></view>
			<view><text style="font-size: 15px;">可以拨打售后电话:{{tel}}</text></view>
			
		</view>

        <view class="commit_bt">
        	<button type="primary" @click="withdraw()">申请退货</button>
        </view>


	</view>
</template>

<script>


	export default {
		data() {
			return {
				userFavor:false,//是否已收藏
				currentType: 0, //当前题型
				subjectIndex: 0,//跳转索引
				autoShowAnswer: false,//答错是否显答案
				autoRadioNext:true,//判断题、单项题，自动移下一题
				swiperHeight: '800px',//
				title: '退货申请',
				subjectList:[
				    {"title":"请选择一个退货的理由？","type":3,"optionList":[
						{"id":"A","content":"尺寸不合适"},
						{"id":"B","content":"颜色不喜欢"},
						{"id":"C","content":"与商品描述不符合"},
						{"id":"D","content":"拍错了"}]},
					
				   ],			
				reason:"",
				order_id:"",
				wx:"",
				tel:""
			}
		},
		onReady() {

			var tempHeight = 800;
			var _me = this;
			uni.getSystemInfo({
				//获取手机屏幕高度信息，让swiper的高度和手机屏幕一样高                
				success: function(res) {
					// console.log(res.model);                    
					// console.log(res.pixelRatio);                    
					// console.log(res.windowWidth);                    
					// console.log(res.windowHeight);
					// //这里是手机屏幕高度                    
					// console.log(res.language);                    
					// console.log(res.version);                    
					// console.log(res.platform);                    
					tempHeight = res.windowHeight;
					console.log("屏幕可用高度 " + tempHeight);

					uni.createSelectorQuery().select("#top-box").fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						let h=0;
						if(!!data&&!!data.height){h=data.height}
						tempHeight -=h;
						console.log("减掉顶部后的高度 " + tempHeight);

						uni.createSelectorQuery().select("#foot-box").fields({
							size: true,
							scrollOffset: true
						}, (data) => {
							let h=0;
							if(!!data&&!!data.height){h=data.height}
							tempHeight -=h;
							console.log("减掉底部后的高度 " + tempHeight);
							_me.swiperHeight = tempHeight + 'px';
							console.log("滑屏最后高度 " + _me.swiperHeight);
						}).exec();

					}).exec();
				}
			});

		},
		onLoad(option) {
			this.order_id=option.order_id;
			
			this.currentType = this.subjectList[0].type;
			uni.setNavigationBarTitle({
				title: this.title
			});			
			
			//添加用户显示答案字段
			for (var i = 0; i < this.subjectList.length; i++) {		
				this.$set(this.subjectList[i],"showAnswer",false);				
			}
			this.load_sale_after();
			
		},
		methods: {
			load_sale_after(){
				var _this=this;
				this.$post("config/find",{"name":"cfg_after_sale"},function(res){					
					var o=JSON.parse(res.data.value);
					_this.wx=o.wx;
					_this.tel=o.tel;
				})
				
			},
			withdraw(){
				var o={};
				o.id=this.order_id;
				
				var refundp_detail={};
				refundp_detail.reason=this.reason
				o.refundpDetail=JSON.stringify(refundp_detail);
				o.stat=5;
				o.refundpStat=1;
				this.$post("order/update",o,function(res){
					uni.showToast({ title: '申请成功' });
					uni.redirectTo({
						"url":"/pages/order/order-refund?state=5"
					})
				})
			},
			SwiperChange: function(e) { //滑动事件
			
				let index = e.target.current;
				if (index != undefined) {
					this.subjectIndex = index;
					this.currentType = this.subjectList[index].type;
					this.userFavor = this.subjectList[index].userFavor;
				}
								
			},
			
			RadioboxChange : function(e) { //单选选中
				
				var items = this.subjectList[this.subjectIndex].optionList;
				var values = e.detail.value;
				console.log(items)
	            for(let i in items){
					var item=items[i];
					if(item.id===values){
						this.reason=item.content;
					}
				}
				
			},
			
		}
	}
</script>

<style>
	/*
	  Animation 微动画  
	  基于ColorUI组建库的动画模块 by 文晓港 2019年3月26日19:52:28
	 */
	
	/* css 滤镜 控制黑白底色gif的 */
	.gif-black{  
	  mix-blend-mode: screen;  
	}
	.gif-white{  
	  mix-blend-mode: multiply; 
	}
	
	
	/* Animation css */
	[class*=animation-] {
	    animation-duration: .5s;
	    animation-timing-function: ease-out;
	    animation-fill-mode: both
	}
	
	.animation-fade {
	    animation-name: fade;
	    animation-duration: .8s;
	    animation-timing-function: linear
	}
	
	.animation-scale-up {
	    animation-name: scale-up
	}
	
	.animation-scale-down {
	    animation-name: scale-down
	}
	
	.animation-slide-top {
	    animation-name: slide-top
	}
	
	.animation-slide-bottom {
	    animation-name: slide-bottom
	}
	
	.animation-slide-left {
	    animation-name: slide-left
	}
	
	.animation-slide-right {
	    animation-name: slide-right
	}
	
	.animation-shake {
	    animation-name: shake
	}
	
	.animation-reverse {
	    animation-direction: reverse
	}
	
	@keyframes fade {
	    0% {
	        opacity: 0
	    }
	
	    100% {
	        opacity: 1
	    }
	}
	
	@keyframes scale-up {
	    0% {
	        opacity: 0;
	        transform: scale(.2)
	    }
	
	    100% {
	        opacity: 1;
	        transform: scale(1)
	    }
	}
	
	@keyframes scale-down {
	    0% {
	        opacity: 0;
	        transform: scale(1.8)
	    }
	
	    100% {
	        opacity: 1;
	        transform: scale(1)
	    }
	}
	
	@keyframes slide-top {
	    0% {
	        opacity: 0;
	        transform: translateY(-100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateY(0)
	    }
	}
	
	@keyframes slide-bottom {
	    0% {
	        opacity: 0;
	        transform: translateY(100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateY(0)
	    }
	}
	
	@keyframes shake {
	
	    0%,
	    100% {
	        transform: translateX(0)
	    }
	
	    10% {
	        transform: translateX(-9px)
	    }
	
	    20% {
	        transform: translateX(8px)
	    }
	
	    30% {
	        transform: translateX(-7px)
	    }
	
	    40% {
	        transform: translateX(6px)
	    }
	
	    50% {
	        transform: translateX(-5px)
	    }
	
	    60% {
	        transform: translateX(4px)
	    }
	
	    70% {
	        transform: translateX(-3px)
	    }
	
	    80% {
	        transform: translateX(2px)
	    }
	
	    90% {
	        transform: translateX(-1px)
	    }
	}
	
	@keyframes slide-left {
	    0% {
	        opacity: 0;
	        transform: translateX(-100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateX(0)
	    }
	}
	
	@keyframes slide-right {
	    0% {
	        opacity: 0;
	        transform: translateX(100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateX(0)
	    }
	}
	
	
	
	
	
	.notice{
		position:absolute;
			   left: 0%;
				bottom: 10%;
				width: 100%;
		display: inline-block;
	}
	
	.commit_bt{
		position:absolute;
			   left: 0%;
				bottom: 0%;
				width: 100%
	}
	page {
		background-color: #FFFFFF;
	}

	.cu-form-group {
		justify-content: flex-start
	}

	.cu-form-group .title {
		padding-left: 30upx;
		padding-right: 0upx;
	}

	.cu-form-group+.cu-form-group {
		border-top: none;
	}

	.cu-bar-title {
		min-height: 50upx;
	}
	
	.cu-list.menu>.cu-item-error{justify-content: flex-start;}
</style>
