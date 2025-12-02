<template>
	<!--pages/outsideLink/aboutUs/aboutUs.wxml-->
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	// pages/outsideLink/aboutUs/aboutUs.js
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: app.globalData.URL + 'about/about-1.html'
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
