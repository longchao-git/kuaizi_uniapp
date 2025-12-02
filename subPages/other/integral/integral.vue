<template>
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: app.globalData.URL + 'waimai/ucenter/jifen.html'
			};
		},


		onShareAppMessage: function(res) {
			return {
				path: "/subPages/other/webview/webview?url=" + encodeURIComponent(res.webViewUrl)
			};
		},
		methods: {}
	};
</script>
