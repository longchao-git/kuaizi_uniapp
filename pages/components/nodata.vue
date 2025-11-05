<template name="nodata">
	<view class="pub-nodata" v-if="nodata ? nodata : false">
		<image src="/static/image/noorder.png"></image>
		<view class="black6">暂无数据</view>
	</view>
</template>
<script>
	export default {
		props: []
	}
</script>