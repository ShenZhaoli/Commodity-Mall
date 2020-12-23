<template>
	<view class="w100p h100p">
		
		<view style="margin-top: 1rem;" v-html="htmldata"></view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				htmldata:"",
			}
		},
		onLoad(e) {
			this.load_data(e);
		},
		methods:{
			load_data(e){
				if(this.$notNull(e.title)){
					uni.setNavigationBarTitle({
					　　title:e.title
					})
				}
				this.$post("resource/find",{"name":e.key},res=>{
					console.log(res);
					let val=res.data.value;
					this.htmldata=this.$prepareHtml(val);
					
				})
				
			},
			
		}
		
	}
	
</script>

<style>
</style>
