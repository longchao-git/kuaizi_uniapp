<template>
	<!--pages/outsideLink/paotui/paotui.wxml-->
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	// pages/outsideLink/paotui/paotui.js
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: app.globalData.URL + 'paotui/#/?city_id=' + (app.globalData.city_id || '')
			};
		},

		components: {},
		props: {},

		onShow: function() {
			this.setData({
				outsideURL: app.globalData.URL + 'paotui/index?city_id=' + (app.globalData.city_id || '')
			}); //   console.log("城市id", app.URL + 'paotui/index?city_id=' + (app.city_id || ''));
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
	/* pages/outsideLink/paotui/paotui.wxss */
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwdVBZdlNIJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlDQUF5QyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy9vdXRzaWRlTGluay9wYW90dWkvcGFvdHVpLnd4c3MgKi8iXX0= */
</style>