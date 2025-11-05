<template>
	<view class="orderStatus">
		<view v-for="(item, idx) in statusBox" :key="idx" class="status_box on" :data-idx="idx">
			<view class="fl left"></view>
			<view class="border_b right">
				<view class="mb5">{{item.log}}</view>
				<view>{{item.show_time}}</view>
			</view>
			<view class="clear"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentNavtab: "0",
				statusBox: []
			};
		},

		components: {},
		props: {},
		onShow: function() {
			var that = this;
			uni.getStorage({
				key: 'order_logs',
				success: function(res) {
					that.setData({
						statusBox: res.data
					});
				}
			});
		},
		methods: {}
	};
</script>
<style>
	.orderStatus {
		height: 100%;
		background-color: #ffffff;
	}

	.orderStatus .status_box {
		position: relative;
	}

	.orderStatus .left {
		width: 20rpx;
		height: 20rpx;
		border-radius: 100%;
		background: #cccccc;
		position: absolute;
		left: 30rpx;
		top: 30rpx;
	}

	.orderStatus .left:after {
		content: "";
		position: absolute;
		top: 20rpx;
		left: 50%;
		margin-left: -2rpx;
		width: 4rpx;
		height: 128rpx;
		background: #E6EAED;
	}

	.orderStatus .right {
		margin-left: 80rpx;
		margin-right: 20rpx;
		padding-top: 30rpx;
		height: 96rpx;
		color: #999;
	}

	.orderStatus .status_box.on .left {
		background: #ff797c;
		border: 4rpx solid #97E097;
		left: 26rpx;
		top: 26rpx;
	}

	.orderStatus .status_box.on .left:after {
		top: 24rpx;
	}

	.orderStatus .status_box.on .right {
		color: #ff797c;
	}















	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwTG5zLTZ6JTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGNBQWMsWUFBWSxFQUFFLHlCQUF5QixDQUFDO0FBQ3RELDBCQUEwQixrQkFBa0IsQ0FBQztBQUM3QyxvQkFBb0IsWUFBWSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDO0FBQ3RJLDBCQUEwQixXQUFXLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLG1CQUFtQixDQUFDO0FBQ3RKLHFCQUFxQixrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDO0FBQzdHLG1DQUFtQyxtQkFBbUIsRUFBRSwwQkFBMEIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDO0FBQzVHLHlDQUF5QyxVQUFVLENBQUM7QUFDcEQsb0NBQW9DLGNBQWMsQ0FBQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIub3JkZXJTdGF0dXN7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjt9XHJcbi5vcmRlclN0YXR1cyAuc3RhdHVzX2JveHsgcG9zaXRpb246IHJlbGF0aXZlO31cclxuLm9yZGVyU3RhdHVzIC5sZWZ0eyB3aWR0aDogMjBycHg7IGhlaWdodDogMjBycHg7IGJvcmRlci1yYWRpdXM6IDEwMCU7IGJhY2tncm91bmQ6ICNjY2NjY2M7IHBvc2l0aW9uOmFic29sdXRlOyBsZWZ0OiAzMHJweDsgdG9wOiAzMHJweDt9XHJcbi5vcmRlclN0YXR1cyAubGVmdDphZnRlcnsgY29udGVudDogXCJcIjsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDIwcnB4OyBsZWZ0OjUwJTsgbWFyZ2luLWxlZnQ6IC0ycnB4OyB3aWR0aDogNHJweDsgaGVpZ2h0OiAxMjhycHg7IGJhY2tncm91bmQ6ICNFNkVBRUQ7fVxyXG4ub3JkZXJTdGF0dXMgLnJpZ2h0eyBtYXJnaW4tbGVmdDogODBycHg7IG1hcmdpbi1yaWdodDogMjBycHg7IHBhZGRpbmctdG9wOiAzMHJweDsgaGVpZ2h0OiA5NnJweDsgY29sb3I6ICM5OTk7fVxyXG4ub3JkZXJTdGF0dXMgLnN0YXR1c19ib3gub24gLmxlZnR7IGJhY2tncm91bmQ6ICMyMEFEMjA7IGJvcmRlcjogNHJweCBzb2xpZCAjOTdFMDk3OyBsZWZ0OiAyNnJweDsgdG9wOiAyNnJweDt9XHJcbi5vcmRlclN0YXR1cyAuc3RhdHVzX2JveC5vbiAubGVmdDphZnRlcnsgdG9wOiAyNHJweDt9XHJcbi5vcmRlclN0YXR1cyAuc3RhdHVzX2JveC5vbiAucmlnaHR7IGNvbG9yOiAjMjBBRDIwO31cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4iXX0= */
</style>