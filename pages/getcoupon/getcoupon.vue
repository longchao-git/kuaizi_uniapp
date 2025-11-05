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
		<!--无数据状态提示 -->
		<!--<import src="../components/nodata.wxml"></import>-->
		<block data-type="template" data-is="nodata" data-attr="nodata: (couponLists.length > 0 ? false : true)">
			<view class="pub-nodata"
				v-if="(couponLists.length > 0 ? false : true) ? (couponLists.length > 0 ? false : true) : false">
				<image src="/static/image/noorder.png"></image>
				<view class="black6">暂无数据</view>
			</view>
		</block>
		<view class="getCoupon">
			<view class="couponListBox">
				<view v-for="(item, index) in couponLists" :key="index" class="couponList">
					<view class="price">
						<text>€{{item.coupon_amount}}</text>
						<view>满{{item.order_amount}}可用</view>
					</view>
					<view class="wz_box">
						<view class="bt overflow_clear">【{{shopname}}】{{item.coupon_amount}}€特惠优惠券</view>
						<view class="time_box black9">有效期至：{{ltime}}</view>
					</view>
					<view class="clear"></view>
				</view>
			</view>
		</view>
		<!--领取按钮-开始-->
		<view class="long_btn" @tap="getCoupon">领取优惠券</view>
		<!--领取按钮-结束-->
	</view>
</template>

<script>
	var app = getApp();
	var shop_id = '';

	export default {
		data() {
			return {
				couponLists: [] //存储优惠券列表；
					,
				shopname: "",
				ltime: "",
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {
			shop_id = e.shop_id; //   shop_id = 95;
		},
		onShow: function() {
			var that = this;
			app.globalData.shopCoupons({
				'shop_id': shop_id
			}, function(res) {
				console.log(res);

				if (res.error == "0") {
					that.setData({
						couponLists: res.data.coupons[0].config,
						ltime: that.toDate(res.data.coupons[0].ltime),
						shopname: res.data.shop.title
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}

				;
			});
		},
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			//领取优惠券；
			getCoupon() {
				var that = this;
				app.globalData.getCoupons({
					'shop_id': shop_id
				}, function(res) {
					//   console.log(res);
					uni.showToast({
						title: res.message
					});
				});
			},

			//转时间
			toDate: function(number) {
				//时间戳转成日期
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = date.getHours();
				var m = date.getMinutes();
				var s = date.getSeconds();
				return Y + M + D;
			}
		}
	};
</script>
<style>
	.getCoupon {
		padding-bottom: 120rpx;
	}

	.couponListBox {
		padding: 2rpx 0;
	}

	.couponList {
		background: #fff;
		padding: 28rpx 0;
		margin-bottom: 2rpx;
	}

	.couponList .price {
		text-align: center;
		float: left;
		width: 220rpx;
	}

	.couponList .price big {
		font-size: 56rpx;
		color: #FF725C;
	}

	.couponList .price view {
		font-size: 24rpx;
		color: #999;
	}

	.couponList .wz_box {
		margin-left: 240rpx;
		margin-right: 24rpx;
	}

	.couponList .wz_box .bt {
		font-size: 32rpx;
		line-height: 48rpx;
		margin-bottom: 16rpx;
	}

	.long_btn {
		margin: 20rpx;
		background: #ff797c;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 32rpx;
		border-radius: 8rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwekZqTERNJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksc0JBQXNCLENBQUM7QUFDbkMsZUFBZSxlQUFlLENBQUM7QUFDL0IsWUFBWSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQztBQUNwRSxtQkFBbUIsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQztBQUNsRSx1QkFBdUIsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDO0FBQ3hELHdCQUF3QixnQkFBZ0IsRUFBRSxXQUFXLENBQUM7QUFDdEQsb0JBQW9CLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDO0FBQzdELHdCQUF3QixnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQztBQUNuRixVQUFVLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZ2V0Q291cG9ueyBwYWRkaW5nLWJvdHRvbTogMTIwcnB4O31cclxuLmNvdXBvbkxpc3RCb3h7cGFkZGluZzogMnJweCAwO31cclxuLmNvdXBvbkxpc3R7YmFja2dyb3VuZDogI2ZmZjsgcGFkZGluZzogMjhycHggMDsgbWFyZ2luLWJvdHRvbTogMnJweDt9XHJcbi5jb3Vwb25MaXN0IC5wcmljZXt0ZXh0LWFsaWduOiBjZW50ZXI7IGZsb2F0OiBsZWZ0OyB3aWR0aDogMjIwcnB4O31cclxuLmNvdXBvbkxpc3QgLnByaWNlIGJpZ3tmb250LXNpemU6IDU2cnB4OyBjb2xvcjogI0ZGNzI1Qzt9XHJcbi5jb3Vwb25MaXN0IC5wcmljZSB2aWV3e2ZvbnQtc2l6ZTogMjRycHg7IGNvbG9yOiAjOTk5O31cclxuLmNvdXBvbkxpc3QgLnd6X2JveHttYXJnaW4tbGVmdDogMjQwcnB4OyBtYXJnaW4tcmlnaHQ6IDI0cnB4O31cclxuLmNvdXBvbkxpc3QgLnd6X2JveCAuYnR7Zm9udC1zaXplOiAzMnJweDsgbGluZS1oZWlnaHQ6IDQ4cnB4OyBtYXJnaW4tYm90dG9tOiAxNnJweDt9XHJcbi5sb25nX2J0bnttYXJnaW46IDIwcnB4OyBiYWNrZ3JvdW5kOiAjMjBBRDIwOyBjb2xvcjogI2ZmZjsgaGVpZ2h0OiA4MHJweDsgbGluZS1oZWlnaHQ6IDgwcnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMzJycHg7IGJvcmRlci1yYWRpdXM6IDhycHg7IHBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgYm90dG9tOiAwOyByaWdodDogMDt9Il19 */
</style>