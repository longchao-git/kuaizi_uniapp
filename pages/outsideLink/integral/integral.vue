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
<style>
	/* pages/outsideLink/integral/integral.wxss */
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwTWlmT3N2JTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZDQUE2QyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy9vdXRzaWRlTGluay9pbnRlZ3JhbC9pbnRlZ3JhbC53eHNzICovIl19 */
</style>