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

				this.setData({
					outsideURL: _url
				});
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
	/* pages/webview/webview.wxss */
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwbXVrbmlCJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQiIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy93ZWJ2aWV3L3dlYnZpZXcud3hzcyAqLyJdfQ== */
</style>