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
					that.statusBox = res.data
					;
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















	
</style>