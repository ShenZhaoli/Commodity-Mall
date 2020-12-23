<template>
    <view class='my-unit'>
		<view class="unit-body">
			<view v-if="data_list.length==0"><text style="margin-left: 100%; display:block;">暂时没有分成记录</text></view>
			
			<view v-for="(item,index) in data_list" :key="index" class="order-item" v-if="item.stat!=3">
				<view class="i-top b-b">
					
				</view>
				
				<view class="goods-box-single">
					<view class="right">
						<text style="margin-left: 13rem;" v-if="item.stat===1">状态:审核中</text>
						<text style="margin-left: 13rem;" v-if="item.stat===2">状态:审核通过待打款</text>
						<text class="price">提现金额:{{item.amount}}</text>
						<text class="attr-box">账户:{{item.address_msg.account}}({{item.address_msg.username}})</text>
						
					</view>
				</view>
                  <text class="time" style="margin-left: 1rem;">{{item.create_at}}</text>
			</view>		
		</view>
		
    </view>
</template>
	
<script>

	
	Date.prototype.format = function(format){ 
	if(!format){
		format = 'yyyy-MM-dd';// 默认1997-01-01这样的格式
	}
	var o = { 
		"M+" : this.getMonth()+1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth()+3)/3), // quarter
		"S" : this.getMilliseconds() // millisecond
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 
	
	
    export default{
        data() {
            return {
				unitModel1:[
					{prop:"",label:"运费",class:"color-999",isMoney:true},
				],
				
				
				cond:{
					pagesize:200,
					pagefrom:1,
				},
				data_list:[],
				nps:" "
            }
        },
        methods:{
			doDel(){
				this.$store.commit("switch_loading")
			},
			reloadProductList(){
				this.cond.pagefrom=1;
				this.data_list=[],
				this.load_list();
			},
			load_list(){
				var o={};
				var user_info=this.$dataLocal("user_info");
				
				o.pagefrom=this.cond.pagefrom;
				o.pagesize=this.cond.pagesize;
				o.userId=user_info.id||-1;
				
				var _this=this;
				this.$post("withdrew/query",o,function(res){
					var o_li=_this.data_list;
					var li=res.rows;				
					for(var i in li){
						var item=li[i];
						var detail=JSON.parse(item.address);
						item.address_msg=detail;
						item.create_at=new Date(item.createAt).format("yyyy-MM-dd hh:mm:ss")
					}				
					console.log(li)
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
		created() {
			this.reloadProductList();
			
		},
    }
</script>
<style lang='scss'>
	
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
			font-size: 0.7rem;
			color: #222222;
			position: relative;
			.time{
				margin-right: 0;
				flex: 1;
			}
			.state{
				color: #777777;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: 0.8rem;
				color: #aaaaaa;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid #222222;
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
					font-size: 0.72rem;
					color: #222222;
					line-height: 1;
				}
				.attr-box{
					font-size: 0.92rem;
					color: #aaaaaa;
					padding: 10upx 12upx;
				}
				.price{
					font-size: 0.72rem;
					color: #222222;
					&:before{
						content: '￥';
						font-size: 0.9rem;
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
			font-size: 0.92rem;
			color: #aaaaaa;
			.num{
				margin: 0 8upx;
				color: #222222;
			}
			.price{
				font-size: 0.8rem;
				color: #222222;
				&:before{
					content: '￥';
					font-size: 0.9rem;
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
			font-size: 0.92rem;
			color: #222222;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: #777777;
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