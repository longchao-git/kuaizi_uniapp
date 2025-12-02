<template>
	<!--pages/outsideLink/integral/integral.wxml-->
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	// pages/outsideLink/integral/integral.js
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: app.globalData.URL + 'waimai/ucenter/jifen.html'
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
