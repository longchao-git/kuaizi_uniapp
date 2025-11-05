<template>
	<view class="getNewHongbao">
		<div class="redBaos">
			<image src="/static/image/redbao_ico.png" class="banner" mode="widthFix"></image>
			<view class="list pub_list">
				<view class="price_box">€

				</view>
			</view>
			<view class="long_btn">立即使用</view>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {}
	};
</script>
<style>
	.redBaos_box {
		background: #fcf6df;
		padding: 0 30rpx 40rpx;
	}

	.redBaos_box .banner {
		display: block;
		width: 100%;
	}

	.redBaos {
		background: #F76241;
		border-radius: 0rpx 0rpx 16rpx 16rpx;
		padding-bottom: 30rpx;
	}

	.redBaos .list {
		background: #FFFFFF;
		padding: 36rpx 0;
		position: relative;
		margin: 20rpx 28rpx;
	}

	.redBaos .list .price_box {
		text-align: center;
		color: #FF725C;
		font-size: 48rpx;
		padding: 0 24rpx;
		line-height: 60rpx;
	}

	.redBaos .list .price_box big {
		font-size: 72rpx;
	}

	.redBaos .list .price_box p {
		font-size: 24rpx;
		color: #666;
		line-height: 40rpx;
	}

	.redBaos .list .right {
		font-size: 32rpx;
		color: #333;
		line-height: 40rpx;
		padding-right: 24rpx;
		text-align: center;
	}

	.redBaos .list h3 {
		font-size: 32rpx;
		color: #333;
		line-height: 40rpx;
		font-weight: normal;
		margin-bottom: 10rpx;
	}

	.redBaos .list p {
		font-size: 24rpx;
		color: #666;
		line-height: 36rpx;
	}

	.redBaos .long_btn {
		display: block;
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		color: #F76241;
		background: #FEF6E1;
		border-radius: 8rpx;
		text-align: center;
		margin: 40rpx 28rpx;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwS1dXREdnJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWEsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUM7QUFDekQscUJBQXFCLGNBQWMsRUFBRSxXQUFXLENBQUM7QUFDakQsU0FBUyxtQkFBbUIsQ0FBQyxvQ0FBb0MsRUFBRSxxQkFBcUIsQ0FBQztBQUN6RixlQUFlLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixDQUFDO0FBQzlGLDBCQUEwQixrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7QUFDcEgsOEJBQThCLGdCQUFnQixDQUFDO0FBQy9DLDRCQUE0QixnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUM7QUFDN0Usc0JBQXNCLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQztBQUNqSCxrQkFBa0IsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLG9CQUFvQixDQUFDO0FBQy9HLGlCQUFpQixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLENBQUM7QUFDbkUsbUJBQW1CLGNBQWMsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLG1CQUFtQixDQUFDLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixDQUFDIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5yZWRCYW9zX2JveHtiYWNrZ3JvdW5kOiAjZmNmNmRmOyBwYWRkaW5nOiAwIDMwcnB4IDQwcnB4O31cclxuLnJlZEJhb3NfYm94IC5iYW5uZXJ7ZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMDAlO31cclxuLnJlZEJhb3N7YmFja2dyb3VuZDogI0Y3NjI0MTtib3JkZXItcmFkaXVzOiAwcnB4IDBycHggMTZycHggMTZycHg7IHBhZGRpbmctYm90dG9tOiAzMHJweDt9XHJcbi5yZWRCYW9zIC5saXN0e2JhY2tncm91bmQ6ICNGRkZGRkY7IHBhZGRpbmc6IDM2cnB4IDA7IHBvc2l0aW9uOiByZWxhdGl2ZTsgbWFyZ2luOiAyMHJweCAyOHJweDt9XHJcbi5yZWRCYW9zIC5saXN0IC5wcmljZV9ib3h7dGV4dC1hbGlnbjogY2VudGVyO2NvbG9yOiAjRkY3MjVDOyBmb250LXNpemU6IDQ4cnB4OyBwYWRkaW5nOiAwIDI0cnB4OyBsaW5lLWhlaWdodDogNjBycHg7fVxyXG4ucmVkQmFvcyAubGlzdCAucHJpY2VfYm94IGJpZ3tmb250LXNpemU6IDcycnB4O31cclxuLnJlZEJhb3MgLmxpc3QgLnByaWNlX2JveCBwe2ZvbnQtc2l6ZTogMjRycHg7Y29sb3I6ICM2NjY7IGxpbmUtaGVpZ2h0OiA0MHJweDt9XHJcbi5yZWRCYW9zIC5saXN0IC5yaWdodHtmb250LXNpemU6IDMycnB4O2NvbG9yOiAjMzMzOyBsaW5lLWhlaWdodDogNDBycHg7IHBhZGRpbmctcmlnaHQ6IDI0cnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7fVxyXG4ucmVkQmFvcyAubGlzdCBoM3tmb250LXNpemU6IDMycnB4OyBjb2xvcjogIzMzMzsgbGluZS1oZWlnaHQ6IDQwcnB4OyBmb250LXdlaWdodDogbm9ybWFsOyBtYXJnaW4tYm90dG9tOiAxMHJweDt9XHJcbi5yZWRCYW9zIC5saXN0IHB7Zm9udC1zaXplOiAyNHJweDsgY29sb3I6ICM2NjY7IGxpbmUtaGVpZ2h0OiAzNnJweDt9XHJcbi5yZWRCYW9zIC5sb25nX2J0bntkaXNwbGF5OiBibG9jazsgaGVpZ2h0OiA5NnJweDsgbGluZS1oZWlnaHQ6IDk2cnB4OyBmb250LXNpemU6IDMycnB4O2NvbG9yOiAjRjc2MjQxOyBiYWNrZ3JvdW5kOiAjRkVGNkUxO2JvcmRlci1yYWRpdXM6IDhycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgbWFyZ2luOiA0MHJweCAyOHJweDt9Il19 */
</style>