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
			this.outsideURL = app.globalData.URL + 'paotui/index?city_id=' + (app.globalData.city_id || '')
			; //   console.log("城市id", app.URL + 'paotui/index?city_id=' + (app.city_id || ''));
		},


		onShareAppMessage: function(res) {
			return {
				path: "/pages/webview/webview?url=" + encodeURIComponent(res.webViewUrl)
			};
		},
		methods: {}
	};
</script>
