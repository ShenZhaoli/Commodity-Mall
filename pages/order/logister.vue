<template>

	<view class="content">
		<view style="background-color: #E4E7ED; text-align: left;height: 2.4rem; width: 100%; margin-top: 0.2rem;box-shadow: 0px 0px 12px #DD524D;  border-radius: 7px; font-size: 15px;">
			<view><text style="margin-left: 1rem;">快递公司:{{logisterMap[logi_corp]}}</text></view>
			<view><text style="margin-left: 1rem;">运单号:{{logi_no}}</text></view>
		</view>
		
		<ali :state="alidata2.state" :datas="alidata2.data" :ways="alidata2.information"></ali>
	</view>
</template>

<script>
import ali from '@/components/wuliu/WuLiu-step.vue'; 

 
export default {
	components: {
		ali
	},
	data() {
		let _conf=this.getConst();
		
		return {
			alidata2: {
				state: 3,
				uptime: '2019-05-24 10:58:24',
				data: [
					{
						time: '2019-05-20 16:27:31',
						remark: '杭州市【杭州西湖区十八部】，公司门口！详情致电17609715305 已签收'
					}],
				information: {
					no: '70939995911523',
					sName: 'HTKY',
					expName: '百世快递(原汇通)',
					url: 'http:www.htky365.com',
					tel: '021-62963636',
					img: 'https:oss-cn2.apistore.cnexpHTKY.png'
				}
				
		
			},
			logi_corp:"",
			logi_no:"",
			logistics:[],
			logisterMap:_conf.logisterMap,
		};
	},
	onLoad(e) {
		this.view_logi(e);
	},
	methods: {
		view_logi(item){
				
		var post_detail=item;		        
		var url="https://www.kuaidi100.com/query";
		url="https://m.kuaidi100.com/query";
		var pdata={};
		pdata.url=url;
		pdata.type=post_detail.type;
		pdata.postid=post_detail.order;
		this.logi_no=pdata.postid;
		this.logi_corp=pdata.type;
		var logisterMap=this.logisterMap;
		var logister_title="运单号码："+pdata.postid+",物流公司："+logisterMap[pdata.type];

		var _this =this;
		this.$post("order/getlogimsg", pdata,function(r) {
			if (r.status == 200) {
				var obj=r.data;
				var list=obj.traces;
				list.reverse();
				
				for(let i  in list){
					let item=list[i];
					item.remark=item.status;
				}
				let df_obj={"remark":"__"};list.push(df_obj)
				_this.alidata2.data=list;
				console.log(list)
		       // _this.logistics=list;
			}
			
		})
				
			},
	}
};
</script>

<style>
.content {
}
</style>
