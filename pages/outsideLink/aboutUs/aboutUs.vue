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
<style>
	/* pages/outsideLink/aboutUs/aboutUs.wxss */
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwN1Bqc01KJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJDQUEyQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy9vdXRzaWRlTGluay9hYm91dFVzL2Fib3V0VXMud3hzcyAqLyJdfQ== */
</style>