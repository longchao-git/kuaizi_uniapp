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
					this.setData({
						code: ''
					});
				});
			}

		}
	};
</script>
<style>
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
		background: #f60;
		font-size: 28rpx;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 100rpx auto;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwQUxCRzFvJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQztFQUNFLGFBQWE7RUFDYixjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLG9CQUFvQjtFQUNwQix5QkFBeUI7RUFDekIsdUJBQXVCO0VBQ3ZCLGdCQUFnQjtFQUNoQixXQUFXO0VBQ1gsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGFBQWE7RUFDYixvQkFBb0I7RUFDcEIsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtFQUNoQixZQUFZO0VBQ1osYUFBYTtFQUNiLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHBhZ2VzL2NvdXBvbmNvZGVyZWRlbXB0aW9uLnd4c3MgKi9cclxuLmNvdXBvbmNvZGVyZWRlbXB0aW9uX2lucHV0IHtcclxuICB3aWR0aDogNjUwcnB4O1xyXG4gIGhlaWdodDogMTAwcnB4O1xyXG4gIG1hcmdpbjogNjBycHggYXV0bztcclxuICBib3JkZXItcmFkaXVzOiAyMHJweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjJmMmYyO1xyXG4gIGJvcmRlcjogMXJweCBzb2xpZCAjY2NjO1xyXG4gIGZvbnQtc2l6ZTogMjhycHg7XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgcGFkZGluZzogMCAyMHJweDtcclxufVxyXG5cclxuLmNvdXBvbmNvZGVyZWRlbXB0aW9uX2J0biB7XHJcbiAgd2lkdGg6IDY5MHJweDtcclxuICBoZWlnaHQ6IDg4cnB4O1xyXG4gIGJvcmRlci1yYWRpdXM6IDIwcnB4O1xyXG4gIGJhY2tncm91bmQ6ICNmNjA7XHJcbiAgZm9udC1zaXplOiAyOHJweDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIG1hcmdpbjogMTAwcnB4IGF1dG87XHJcbn0iXX0= */
</style>