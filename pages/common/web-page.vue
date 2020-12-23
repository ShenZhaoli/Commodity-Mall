<template>
    <view>
        <web-view :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                },
								src:""
            }
        },
				onLoad(o) {
					let page_url=this.$dataLocal("page_url");
					if(!page_url)return;
					this.$dataLocal("page_url",null);
					this.src=page_url.src;
					if(this.$notNull(page_url.title)){
						uni.setNavigationBarTitle({
						　　title:page_url.title
						})
					}
				}
    }
</script>

<style>

</style>