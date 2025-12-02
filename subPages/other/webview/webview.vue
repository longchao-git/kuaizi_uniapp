<template>
	<web-view :src="outsideURL"></web-view>
</template>

<script>
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
				path: "/subPages/other/webview/webview?url=" + encodeURIComponent(res.webViewUrl)
			};
		},
		methods: {}
	};
</script>
<style>
	
</style>