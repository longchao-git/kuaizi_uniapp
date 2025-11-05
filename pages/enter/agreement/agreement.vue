<template>
	<!--pages/enter/agreement/agreement.wxml-->
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	// pages/enter/agreement/agreement.js
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
				this.setData({
					outsideURL: app.globalData.URL + 'page/protocolstaff.html'
				});
			}

			if (options.enterType == "shops") {
				this.setData({
					outsideURL: app.globalData.URL + 'page/protocolbiz.html'
				});
			}
		},


	};
</script>
<style>
	/* pages/enter/agreement/agreement.wxss */
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwMnA2M0lkJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlDQUF5QyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy9lbnRlci9hZ3JlZW1lbnQvYWdyZWVtZW50Lnd4c3MgKi8iXX0= */
</style>