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
			this.load_data(e.key);
		},
		methods:{
			load_data(key){
				this.$post("resource/find",{"name":key},res=>{
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
