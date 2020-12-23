<template>
	<view style="display: flex; flex-direction: column; align-items: center;margin-top: 0rem;">
		
			<view style="width: 100%; height: 13rem;" class="flex m-center"><img :style="style" :src="bg_img"></img></view>
			<view><text >{{describe}}</text></view>
	</view>
</template>
 
<script>
	export default {	
		data() {
			return {
				bg_img:"",
				describe:"1",
				style:"width: 100%;height: 100%;"
			};
		},
		onLoad(option) {
			var _this=this;
			this.load_bg_img(option.pic);
		},
		methods: {
			load_bg_img(pic){
				let o=this.$dataLocal("show_img_param");		
				this.bg_img=o.image;
				this.describe=o.describe;
				
				if(this.$notNull(o.style))this.style=o.style;
				
				if(this.$notNull(o.title)){
					uni.setNavigationBarTitle({
					　　title:o.title
					})
				}
			},
		}
	};
</script>
 
<style lang="scss">

	
</style>
