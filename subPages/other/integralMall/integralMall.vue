<template>
	<!--pages/outsideLink/integralMall/integralMall.wxml-->
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	// pages/outsideLink/integralMall/integralMall.js
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: app.globalData.URL + '/jifen/'
			};
		},


		onShareAppMessage: function(res) {
			return {
				path: "/pages/webview/webview?url=" + encodeURIComponent(res.webViewUrl)
			};
		},
		methods: {}
	};
</script>
<style>
	
</style>