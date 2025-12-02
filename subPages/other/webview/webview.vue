<template>
	<!--pages/webview/webview.wxml-->
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	// pages/webview/webview.js
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: ''
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.url) {
				let _url = decodeURIComponent(options.url);

				this.outsideURL = _url
				;
			}

			;
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