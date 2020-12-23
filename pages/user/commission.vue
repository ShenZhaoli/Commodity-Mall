<template>
    <view class='my-unit'>
		<view class="unit-body">
			<view v-if="data_list.length==0"><text style="margin-left: 100%; display:block;">暂时没有分佣记录</text></view>
			<view v-if="data_list.length>0">
			     <!-- <view class="tj-column" >
			        <view class="tj-item">
						<text>总额:</text>
			        	<text class="num">{{ userInfo.momey|| '0'}}</text>
			        	
			        </view>
			        <view class="tj-item">
						<text>可提现:</text>
			        	<text class="num">{{ userInfo.readyMomey||'0'}}</text>
			        	
			        </view>
			        <view class="tj-item">
						<text>已提现:</text>
			        	<text class="num">{{userInfo.sucMomey||'0'}}</text>
			        	
			        </view>		
				  </view> -->
				<view style="margin-top: -3rem;" v-for="(item,index) in data_list" :key="index" class="order-item">
				<view class="i-top b-b">
					
				</view>
				<block v-if="item.type===4">
					<view class="goods-box-single">
						
						<view class="right">
							<!-- <text class="title clamp">{{item.name}}</text> -->
							<text class="attr-box"></text>
							<text class="price">提成金额{{item.amount}} <text style="color: red;">({{item.commission_type}})</text> </text>
						</view>
					</view>
					 <text class="time" style="margin-left: 10rem;"><text v-if="item.stat===3" style='color: blue;'>此单可以提现</text></text>
					<text class="time">{{item.createAt}}</text>
				</block>
				<block v-if="item.type!=4">
					<view class="goods-box-single">
						<image class="goods-img" :src="item.orderUserImage" mode="aspectFill" ></image>
						<view class="right">
							<!-- <text class="title clamp">{{item.name}}</text> -->
							<text class="attr-box">{{item.orderUserName}}({{item.commission_type}})</text>
							<text class="price">订单金额{{item.billAmount}}，提成金额{{item.amount}}</text>
						</view>
					</view>
					  <text class="time" style="margin-left: 9rem;"><text v-if="item.stat===2" style='color: red;'>此单失效(已经退货)</text></text>
					  <text class="time" style="margin-left: 7rem;"><text v-if="item.stat===3" style='color: blue;'>此单可以提现(已经确认到货)</text></text>
					  <text class="time" style="margin-left: 10rem;"><text v-if="item.stat===1" style='color: green;'>等待确认到货</text></text>
					  <text class="time">{{item.createAt}}</text>
				 </block> 
				  
			</view>
			</view>
			

			
			
			
			
			
			
			<!-- <view class="commission" v-for="(item,index) in data_list" :key="index">
			<text  >订单号：{{item.billNo}}</text> <br>
			  <text> 下级用户id：{{item.orderUserId}} </text> <br>
			
			<text  > 订单金额：￥{{item.billAmount}}</text>  <text>{{nps}} ,分成金额：￥{{item.amount}} </text><br>
			
			<text  > 创建日期：{{item.createAt}}</text>  
			
			</view> -->
		
		</view>
		
    </view>
</template>
	
<script>

	
    export default{
        data() {
            return {
				unitModel1:[
					{prop:"",label:"运费",class:"color-999",isMoney:true},
				],
				
				
				cond:{
					pagesize:10,
					pagefrom:1,
					stat:"",
					
					types:"",
					type:''
				},
				data_list:[],
				nps:" ",
				userInfo:{}
            }
        },
		onReachBottom() {
			this.load_list();
		},
        methods:{
			reloadProductList(){
				this.cond.pagefrom=1;
				this.data_list=[],
				this.load_list();
			},
			load_list(){
				var o={};
				var user_info=this.$dataLocal("user_info");
				this.userInfo=user_info;
				o.pagefrom=this.cond.pagefrom;
				o.pagesize=this.cond.pagesize;
				o.userId=user_info.id||-1;
				o.stat=this.cond.stat;
				
				o.types=this.cond.types;
				o.type=this.cond.type;
				
				var _this=this;
				this.$post("commission/query",o,function(res){
					var o_li=_this.data_list;
					var li=res.rows;
					for(let i in li){
						var item=li[i];
						var commission_type="推荐提成";
						if(2==item.type){
							commission_type="代理商提成";
						}else if(3===item.type){
							commission_type="区域代理提成";
						}else if(4===item.type){
							commission_type=""
						}
						item.commission_type=commission_type;
					}
					var n_li=o_li.concat(li);
					_this.data_list=n_li;
					
					if(li.length>0){
						_this.cond.pagefrom=_this.cond.pagefrom+1;
					}				
				})
			},
        },
		computed:{
			
		},
		onLoad(option) {
			console.log(option)
			if(option.type==="zt"){
				this.cond.type=1;
				this.cond.types="";
			}else if(option.type==="jt"){
				this.cond.types="2,3,21,22";
				this.cond.type="";
			}
			this.cond.stat=option.stat||"";
			this.reloadProductList();
		},
		created() {
			
			
		},
    }
</script>
<style lang='scss'>
 
	.tj-column{
		/* position: absolute; */
		height: 0.1rem;
		/* width: 30%; */
		flex-direction: row;	
		 display: flex;
	}
	.tj-item{
		margin-left:0.5rem ;
		width: 33%;
		flex-direction: row;	 
		font-size: 0.76rem;
		color: #75787d;
	}
	
		.order-item{
			width: 100%;
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
			font-size: 0.9rem;
			color: #222222;
			position: relative;
			.time{
				margin-right: 0;
				flex: 1;
			}
			.state{
				color: #666666;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: 0.7rem;
				color: #aaaaaa;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid #333333;
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
				border-radius: 50%;
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
					font-size: 0.92rem;
					color: #222222;
					line-height: 1;
				}
				.attr-box{
					font-size: 0.8rem;
					color: #aaaaaa;
					padding: 10upx 12upx;
				}
				.price{
					font-size: 0.92rem;
					color: #222222;
					&:before{
						content: '￥';
						font-size: 0.76rem;
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
			font-size:0.8rem;
			color: #aaaaaa;
			.num{
				margin: 0 8upx;
				color: #222222;
			}
			.price{
				font-size: 0.7rem;
				color: #222222;
				&:before{
					content: '￥';
					font-size: 0.76rem;
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
			font-size: 0.8rem;
			color: #222222;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: #666666;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	.commission{
		margin-top: 20px
	}
	
    .my-unit{
		margin: 20upx 0;
		background-color: #ffffff;
		font-size: 28upx;
		transform: all 1s;
		
		.unit-head{
			padding: 20upx;
			height: 80upx;
			box-sizing: border-box;
			border-bottom: 2upx solid #f5f5f5;
		}
		.unit-body{
			padding: 20upx;
			display: flex;
			flex-wrap: wrap;
			
			text{
				width: 100%;
				font-size: 28upx;
				line-height: 55upx;
			}
		}
		.unit-foot{
			height: 88upx;
			padding: 0 20upx;
			border-top: 2upx solid #f5f5f5;
			border-bottom: none;
			line-height: 88upx;
			
			.btn{
				height: 60upx;
				font-size: 28upx;
				line-height: 60upx;
				margin: 14upx 0;
			}
		}
	}
</style>