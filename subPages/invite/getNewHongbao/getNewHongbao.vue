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

	
</style>