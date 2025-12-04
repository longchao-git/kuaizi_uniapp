<template>
	<view class="couponcoderedemption">

		<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
			<block v-if="showToast.isShow? showToast.isShow: false">

				<view class="toast-center">
					<view class="toast">
						<image class="toast-icon" :src="showToast.icon" mode="scaleToFill" v-if="showToast.icon">
						</image>
						<text class="toast-text">{{showToast.title}}</text>
					</view>
				</view>
			</block>
		</block>
		<input class="couponcoderedemption_input" v-model="code" placeholder="好友邀请码，优惠码兑换">
		<view class="couponcoderedemption_btn" @click="getcodes">立即兑换</view>
	</view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
				code: '',
				showToast: {
					isShow: false
				},
			};
		},

		components: {},
		props: {},

		methods: {
			getcodes() {

				uni.showToast({
					title: '请输入手机号'
				});
				if (!this.code) {
					uni.showToast({
						title: '请输入手机号'
					})
					return
				}
				if (!this.code) {
					console.log(111)
					uni.showToast({
						title: '不显示',
						icon: 'none'
					});

					return
				}

				app.globalData.redeempromocode({
					code: this.code
				}, res => {
					console.log(res);
					if (res.error !== '0') {
						console.log(res.message);
						uni.showToast({
							title: res.message,
							icon: 'none',
						});
						return
					}
					uni.showToast({
						title: '兑换成功',
						icon: 'success',

					});
					this.code = ''
					;
				});
			}

		}
	};
</script>
<style>
page {
	background-color: #fff;
	min-height: 100vh;
}
	/* pages/couponcoderedemption.wxss */
	.couponcoderedemption_input {
		width: 650rpx;
		height: 100rpx;
		margin: 50rpx 30rpx;
		border-radius: 20rpx;
		background-color: #f2f2f2;
		border: 1rpx solid #ccc;
		font-size: 28rpx;
		color: #333;
		padding: 0 20rpx;
		text-align: center;

	}

	.couponcoderedemption_btn {
		width: 690rpx;
		height: 88rpx;
		border-radius: 20rpx;
		background: #ff9496;
		font-size: 28rpx;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 100rpx auto;
	}

	
</style>