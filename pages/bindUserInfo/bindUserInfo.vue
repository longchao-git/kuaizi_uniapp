<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view class="binding">
			<button class="long_btn" open-type="getUserInfo" @getuserinfo="getUserInfo">获取用户信息</button>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var PhoneNumber;

	export default {
		data() {
			return {};
		},

		components: {},
		props: {},
		onLoad: function(e) {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			//获取绑定微信的手机号
			getUserInfo: function(e) {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>
<style>
	/* page/binding/binding.wxss */
	.binding {
		padding: 100rpx 40rpx 20rpx;
		height: 100%;
		box-sizing: border-box;
		background: #fff;
	}

	.binding .long_btn {
		margin-top: 40rpx;
		border-radius: 8rpx;
		height: 88rpx;
		line-height: 88rpx;
	}

	.long_btn {
		background: #65BC05;
		width: 100%;
		height: 100rpx;
		text-align: center;
		font-size: 36rpx;
		line-height: 100rpx;
		color: #fff;
	}

	
</style>