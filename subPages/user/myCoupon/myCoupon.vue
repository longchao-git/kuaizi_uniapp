<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<!-- 已使用和未使用切换 -->
		<view class="useTab">
			<view :class="'tabIn ' + (isActive == 0 ? 'active' : '')" @tap="useTab" data-index="0"><text>可使用</text>
			</view>
			<view :class="'tabIn ' + (isActive == 1 ? 'active' : '')" @tap="useTab" data-index="1"><text>不可用</text>
			</view>
		</view>
		<scroll-view scroll-y class="tabScroll" v-if="isActive == 0" @scrolltoupper="scrollToupper1"
			@scrolltolower="scrollTolower1">
			<!--无数据状态提示：使用全局 NoData 组件 -->
			<NoData :show="couponLists.length === 0" />
			<view class="getCoupon" v-if="couponLists.length > 0">
				<view class="couponListBox">
					<view v-for="(item, index) in couponLists" :key="index"
						:class="'couponList ' + (item.outTime == '1' || item.order_id > 0 ? 'over' : '')">
						<view class="cont">
							<view class="price">
								<view class="num">€<text>{{item.coupon_amount}}</text></view>
								<view class="txt">满{{item.order_amount}}€可用</view>
							</view>
							<view class="txt_box">
								<view class="tit overflow_clear">{{item.title}}</view>
								<p>有效期至{{item.time}}</p>
							</view>
							<image class="ico" src="/static/image/mine/bg_lm_out0f3x.png" v-if="item.outTime == '1'">
							</image>
							<image class="ico" src="/static/image/mine/bg_lm_used3x.png" v-if="item.order_id > 0">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="weui-loadmore" :hidden="loadhide">
				<image src="/static/image/loading.gif"></image>
				<text class="weui-loadmore__tips">正在加载</text>
			</view>
			<view class="noMore" :hidden="moreShow">没有更多啦~</view>
		</scroll-view>

		<scroll-view scroll-y class="tabScroll" v-if="isActive == 1" @scrolltoupper="scrollToupper2"
			@scrolltolower="scrollTolower2">
			<!--无数据状态提示：使用全局 NoData 组件 -->
			<NoData :show="couponLists2.length === 0" />
			<view class="getCoupon" v-if="couponLists2.length > 0">
				<view class="couponListBox">
					<view v-for="(item, index) in couponLists2" :key="index"
						:class="'couponList ' + (item.outTime == '1' || item.order_id > 0 ? 'over' : '')">
						<view class="cont">
							<view class="price">
								<view class="num">€<text>{{item.coupon_amount}}</text></view>
								<view class="txt">满{{item.order_amount}}€可用</view>
							</view>
							<view class="txt_box">
								<view class="tit overflow_clear">{{item.title}}</view>
								<p>有效期至{{item.time}}</p>
							</view>
							<image class="ico" src="/static/image/mine/bg_lm_out0f3x.png" v-if="item.outTime == '1'">
							</image>
							<image class="ico" src="/static/image/mine/bg_lm_used3x.png" v-if="item.order_id > 0">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="weui-loadmore" :hidden="loadhide">
				<image src="/static/image/loading.gif"></image>
				<text class="weui-loadmore__tips">正在加载</text>
			</view>
			<view class="noMore" :hidden="moreShow">没有更多啦~</view>
		</scroll-view>
	</view>
</template>

<script>
	// pages/myCoupon/myCoupon.js
	var app = getApp();

	export default {
		data() {
			return {
				couponLists: [],
				//存储优惠券列表；
				couponLists2: [],
				isActive: 0,
				page: 1,
				moreShow: true,
				loadhide: true,
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {},
		onShow: function() {
			this.bindonShow()
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
			//转时间
			toDate: function(number) {
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
				var Mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
				var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D;
			},
			bindonShow() {
				var that = this;
				app.globalData.mineCoupons({
					"page": that.page,
					"status": 1
				}, function(res) {
					// console.log(res);
					if (res.error == "0") {
						var timestamp = Date.parse(new Date());
						timestamp = timestamp / 1000;

						for (var i = 0; i < res.data.items.length; i++) {
							res.data.items[i].order_id = Number(res.data.items[i].order_id);
							res.data.items[i].time = that.toDate(res.data.items[i].ltime);

							if (res.data.items[i].ltime < timestamp) {
								res.data.items[i].outTime = '1';
							} else {
								res.data.items[i].outTime = '0';
							}

							;
						}

						;
						console.log();
						that.couponLists = res.data.items;
					} else {
						uni.showToast({
							title: res.message
						});
					}

					;
				});
				app.globalData.mineCoupons({
					"page": that.page,
					"status": 0
				}, function(res) {
					console.log(res);

					if (res.error == "0") {
						var timestamp = Date.parse(new Date());
						timestamp = timestamp / 1000;

						for (var i = 0; i < res.data.items.length; i++) {
							res.data.items[i].order_id = Number(res.data.items[i].order_id);
							res.data.items[i].time = that.toDate(res.data.items[i].ltime);

							if (res.data.items[i].ltime < timestamp) {
								res.data.items[i].outTime = '1';
							} else {
								res.data.items[i].outTime = '0';
							}

							;
						}

						;
						that.couponLists2 = res.data.items;
					} else {
						uni.showToast({
							title: res.message
						});
					}

					;
				});
			},
			// tab切换
			useTab: function(e) {
				var index = e.currentTarget.dataset.index;
				this.isActive = index;
			},
			toShopDatil: function(e) {
				var url = e.currentTarget.dataset.url;
				app.globalData.topage("/subPages/shop/shoptail/shoptail?id=" + url);
			},
			// 上拉加载
			scrollTolower2: function() {
				var that = this;
				var page = that.page;
				page++;
				app.globalData.mineCoupons({
					"page": page,
					"status": 0
				}, function(res) {
					for (var i = 0; i < res.data.items.length; i++) {
						res.data.items[i].ltime = that.toDate(res.data.items[i].ltime);
					}

					if (res.error == "0") {
						var len = res.data.items.length;

						if (len == 0) {
							that.loadhide = true
							that.moreShow = false;
						} else {
							that.loadhide = false
							that.moreShow = true
							that.couponLists2 = that.couponLists2.concat(res.data.items)
							that.page = page
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}

					;
				});
			},
			scrollTolower1: function() {
				var that = this;
				var page = that.page;
				page++;
				app.globalData.mineCoupons({
					"page": page,
					"status": 1
				}, function(res) {
					for (var i = 0; i < res.data.items.length; i++) {
						res.data.items[i].ltime = that.toDate(res.data.items[i].ltime);
					}

					if (res.error == "0") {
						var len = res.data.items.length;

						if (len == 0) {
							that.loadhide = true
							that.moreShow = false
						} else {
							that.loadhide = false
							that.moreShow = true
							that.couponLists = that.couponLists.concat(res.data.items)
							that.page = page
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}

					;
				});
			},
			// 下拉刷新
			scrollToupper2: function() {
				this.bindonShow();
			},
			scrollToupper1: function() {
				this.bindonShow();
			}
		}
	};
</script>
<style>
	/* pages/myCoupon/myCoupon.wxss */
	.couponListBox {
		padding: 2rpx 0;
	}

	/* .couponList{background: #fff; padding: 20rpx; border-radius: 12rpx; margin: 20rpx;position: relative;}
.couponList .img{width: 160rpx; height: 160rpx;}
.couponList .wz_box{margin-left: 180rpx;}
.couponList .wz_box .bt{font-size: 28rpx; line-height: 40rpx;}
.couponList .wz_box .price_box{font-size: 24rpx; line-height: 40rpx; margin: 20rpx 0;}
.couponList .wz_box .price_box .big{font-size: 36rpx;} */
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

	.status {
		text-align: center;
		font-size: 28rpx;
		color: #fff;
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #ff797c;
		border-radius: 8rpx;
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		padding: 0;
	}

	.noUse {
		background: #ccc;
	}

	.tabScroll {
		margin-top: 88rpx;
		height: calc(100% - 88rpx)
	}

	.useTab {
		width: 100%;
		height: 88rpx;
		background: #fafafa;
		position: fixed;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		left: 0;
		z-index: 2
	}

	.tabIn {
		font-size: 32rpx;
		color: #888;
		width: 50%;
		text-align: center;
		float: left;
	}

	.tabIn text {
		display: block;
		width: 250rpx;
		margin: 0 auto;
		height: 86rpx;
		line-height: 86rpx;
		border-bottom: 2rpx solid #fafafa;
	}

	.useTab .active {
		color: #ff797c;
		background: #fff;
	}

	.useTab .active text {
		border-bottom: 2rpx solid #ff797c;
		display: block;
		width: 250rpx;
		margin: 0 auto;
		height: 86rpx;
		line-height: 86rpx;
	}

	.noMore {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}

	.weui-loadmore {
		height: 80rpx;
		line-height: 80rpx;
		background: #f8f8f8;
		text-align: center
	}

	.weui-loadmore image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.couponList {
		margin: 24rpx;
		display: block;
		border: 2rpx solid #eee;
		background: #fff;
		padding: 0;
		line-height: unset;
		width: auto;
		height: auto;
	}

	.couponList.over .cont {
		opacity: 0.5
	}

	.couponList .cont {
		padding: 30rpx 24rpx;
		overflow: hidden;
		position: relative;
	}

	.couponList .price {
		width: 216rpx;
		text-align: center;
		float: left;
	}

	.couponList .price .num {
		font-size: 48rpx;
		color: #FF725C;
		line-height: 80rpx;
	}

	.couponList .price .num big {
		font-size: 72rpx;
	}

	.couponList .price .txt {
		font-size: 24rpx;
		color: #999;
	}

	.couponList .txt_box {
		margin-left: 236rpx;
	}

	.couponList .txt_box .tit {
		font-size: 32rpx;
		line-height: 40rpx;
		margin-bottom: 8rpx;
		padding: 12rpx 0 16rpx;
	}

	.couponList .txt_box p {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #666;
		display: block;
	}

	.couponList .ico {
		position: absolute;
		right: 72rpx;
		bottom: 12rpx;
		width: 116rpx;
		height: 116rpx;
	}
</style>