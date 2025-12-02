<template>
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: ""
			};
		},

		components: {},
		props: {},

		/** 
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			console.log(options);

			if (options.enterType == "rider") {
				this.outsideURL = app.globalData.URL + 'page/protocolstaff.html'
				;
			}

			if (options.enterType == "shops") {
				this.outsideURL = app.globalData.URL + 'page/protocolbiz.html'
				;
			}
		},


	};
</script>
