<template>
	<view>
		<!--提示框引入-开始-->
		<!--<import src="../components/showToast.wxml"></import>-->
		<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
			<block v-if="showToast.isShow? showToast.isShow: false">
				<!-- <view class="toast-bg" wx:if="{{showToast.mask==false? false : true}}"></view>   -->
				<view class="toast-center">
					<view class="toast">
						<image class="toast-icon" :src="showToast.icon" mode="scaleToFill" v-if="showToast.icon">
						</image>
						<text class="toast-text">{{showToast.title}}</text>
					</view>
				</view>
			</block>
		</block>
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwclNOSWRrJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUM5QixTQUFTLDJCQUEyQixFQUFFLFlBQVksRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUM3RixtQkFBbUIsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixDQUFDO0FBQzdGLFVBQVUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLENBQUMiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogcGFnZS9iaW5kaW5nL2JpbmRpbmcud3hzcyAqL1xyXG4uYmluZGluZ3twYWRkaW5nOiAxMDBycHggNDBycHggMjBycHg7IGhlaWdodDogMTAwJTsgYm94LXNpemluZzogYm9yZGVyLWJveDsgYmFja2dyb3VuZDogI2ZmZjt9XHJcbi5iaW5kaW5nIC5sb25nX2J0bnttYXJnaW4tdG9wOiA0MHJweDsgYm9yZGVyLXJhZGl1czogOHJweDsgaGVpZ2h0OiA4OHJweDsgbGluZS1oZWlnaHQ6IDg4cnB4O31cclxuLmxvbmdfYnRue2JhY2tncm91bmQ6ICM2NUJDMDU7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMHJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDM2cnB4OyBsaW5lLWhlaWdodDogMTAwcnB4OyBjb2xvcjogI2ZmZjt9Il19 */
</style>