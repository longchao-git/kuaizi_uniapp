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
	/* pages/outsideLink/integralMall/integralMall.wxss */
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIweERCTERDJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFEQUFxRCIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy9vdXRzaWRlTGluay9pbnRlZ3JhbE1hbGwvaW50ZWdyYWxNYWxsLnd4c3MgKi8iXX0= */
</style>