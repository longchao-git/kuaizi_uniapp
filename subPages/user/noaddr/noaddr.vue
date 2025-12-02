<template>
	<view>
		<view class="page_cont_box">
			<view class="page_cont">
				<!--内容开始-->
				<view class="noaddr_box">
					<image src="/static/image/mine/mall_my_icon_location_no.png"></image>
					<view class="text">您还未添加收货地址</view>
				</view>
				<!--内容结束-->
			</view>
		</view>
		<view class="footer_btn_long">
			<button type="primary" size="default">添加收货地址+</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},

		components: {},
		props: {},
		onLoad: function(options) { // 页面初始化 options为页面跳转所带来的参数
		},
		onReady: function() { // 页面渲染完成
		},
		onShow: function() { // 页面显示
		},
		onHide: function() { // 页面隐藏
		},
		onUnload: function() { // 页面关闭
		},
		methods: {}
	};
</script>
<style>
	.noaddr_box {
		text-align: center;
		padding: 100rpx 0 0;
	}

	.noaddr_box image {
		width: 180rpx;
		height: 180rpx;
	}

	.noaddr_box .text {
		font-size: 32rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
	}







	
</style>