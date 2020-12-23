<template>
	<!-- 这个模板用来渲染原生video -->
  <!--增加video标签支持，并循环添加-->
  <view :class="node.classStr" :style="node.styleStr">
	<video :class="node.classStr" :style="node.styleStr" class="video-video" :src="node.attr.src"></video>
  </view>
</template>

<script>
export default {
  name: 'wxParseVideo',
  props: {
    node: {},
  }
};
</script>
<style>
	.video-video{z-index: 1;}
</style>
