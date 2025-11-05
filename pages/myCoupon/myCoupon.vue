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
		<!-- 已使用和未使用切换 -->
		<view class="useTab">
			<view :class="'tabIn ' + (isActive == 0 ? 'active' : '')" @tap="useTab" data-index="0"><text>可使用</text>
			</view>
			<view :class="'tabIn ' + (isActive == 1 ? 'active' : '')" @tap="useTab" data-index="1"><text>不可用</text>
			</view>
		</view>
		<scroll-view scroll-y class="tabScroll" v-if="isActive == 0" @scrolltoupper="scrollToupper1"
			@scrolltolower="scrollTolower1">
			<!--无数据状态提示 -->
			<!--<import src="../components/nodata.wxml"></import>-->
			<block data-type="template" data-is="nodata" data-attr="nodata: (couponLists.length > 0 ? false : true)">
				<view class="pub-nodata" v-if="couponLists.length <= 0 ">
					<image src="/static/image/noorder.png"></image>
					<view class="black6">暂无数据</view>
				</view>
			</block>

			<view class="getCoupon">
				<view class="couponListBox">
					<view v-for="(item, index) in couponLists" :key="index"
						:class="'couponList ' + (item.outTime == '1' || item.order_id > 0 ? 'over' : '')">
						<!-- <image src="../../image/index-icon-mainNav01@2x.png" class="img fl"></image> -->
						<!-- <view class="wz_box">
                    <view class="bt">【{{item.shop_title}}】{{item.title}}</view>
                    <view class="price_box"><text class="fontcl2">€</text><text class="big fontcl2">{{item.coupon_amount}}</text><text class="black9 ml10">满{{item.order_amount}}€可用</text></view>
                    <view class="time_box black9">截止：{{item.ltime}}</view>
                </view>
                <view class="clear"></view>
                <view class='status' bindtap='toShopDatil' data-url="{{item.shop_id}}">{{item.msg}}</view> -->
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
			<!--无数据状态提示 -->
			<!--<import src="../components/nodata.wxml"></import>-->
			<block data-type="template" data-is="nodata" data-attr="nodata: (couponLists2.length > 0 ? false : true)">
				<view class="pub-nodata" v-if="couponLists2.length <= 0 ">
					<image src="/static/image/noorder.png"></image>
					<view class="black6">暂无数据</view>
				</view>
			</block>
			<view class="getCoupon">
				<view class="couponListBox">
					<view v-for="(item, index) in couponLists2" :key="index"
						:class="'couponList ' + (item.outTime == '1' || item.order_id > 0 ? 'over' : '')">
						<!-- <image src="../../image/index-icon-mainNav01@2x.png" class="img fl"></image> -->
						<!-- <view class="wz_box">
                    <view class="bt">【{{item.shop_title}}】{{item.title}}</view>
                    <view class="price_box"><text class="fontcl2">€</text><text class="big fontcl2">{{item.coupon_amount}}</text><text class="black9 ml10">满{{item.order_amount}}€可用</text></view>
                    <view class="time_box black9">截止：{{item.ltime}}</view>
                </view>
                <view class="clear"></view>
                <view class='status noUse'>{{item.msg}}</view> -->
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
						that.setData({
							couponLists: res.data.items
						});
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
						that.setData({
							couponLists2: res.data.items
						});
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
				this.setData({
					isActive: index
				});
			},
			toShopDatil: function(e) {
				var url = e.currentTarget.dataset.url;
				app.globalData.topage("../shoptail/shoptail?id=" + url);
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
							that.setData({
								loadhide: true,
								moreShow: false
							});
						} else {
							that.setData({
								loadhide: false,
								moreShow: true,
								couponLists2: that.couponLists2.concat(res.data.items),
								page: page
							});
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
							that.setData({
								loadhide: true,
								moreShow: false
							});
						} else {
							that.setData({
								loadhide: false,
								moreShow: true,
								couponLists: that.couponLists.concat(res.data.items),
								page: page
							});
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwdGhxVzVoJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBQ2pDLGVBQWUsZUFBZSxDQUFDO0FBQy9COzs7Ozt3REFLd0Q7QUFDeEQsVUFBVSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7QUFDdk0sUUFBUSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztBQUN4TSxPQUFPLGdCQUFnQixDQUFDO0FBQ3hCLFdBQVcsaUJBQWlCLENBQUMsMEJBQTBCO0FBQ3ZELFFBQVEsVUFBVSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQ1oxRSxvQkFBQSxpREFBQSw0Q0FBQSxnQkFBQSxBRFkyRSxPQUFPLENBQUMsVUFBVTtBQUM3RixPQUFPLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0FBQzVFLFlBQVksY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGdDQUFnQyxFQUFFO0FBQ3hILGdCQUFnQixhQUFhLENBQUMsZ0JBQWdCLENBQUM7QUFDL0MscUJBQXFCLGdDQUFnQyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztBQUNoSSxRQUFRLFVBQVUsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO0FBQ3BHLGVBQWUsYUFBYSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLGtCQUFrQjtBQUN0RixxQkFBcUIsWUFBWSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FBQzs7QUFFakgsWUFBWSxZQUFZLEVBQUUsY0FBYyxFQUFFLHVCQUF1QixFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDO0FBQzlJLHVCQUF1QixZQUFZO0FBQ25DLGtCQUFrQixvQkFBb0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQztBQUM3RSxtQkFBbUIsYUFBYSxFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQztBQUNsRSx3QkFBd0IsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDO0FBQzVFLDRCQUE0QixnQkFBZ0IsQ0FBQztBQUM3Qyx3QkFBd0IsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO0FBQ3RELHFCQUFxQixtQkFBbUIsQ0FBQztBQUN6QywwQkFBMEIsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUscUJBQXFCLENBQUM7QUFDM0csdUJBQXVCLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxjQUFjLENBQUM7QUFDekYsaUJBQWlCLGtCQUFrQixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy9teUNvdXBvbi9teUNvdXBvbi53eHNzICovXHJcbi5jb3Vwb25MaXN0Qm94e3BhZGRpbmc6IDJycHggMDt9XHJcbi8qIC5jb3Vwb25MaXN0e2JhY2tncm91bmQ6ICNmZmY7IHBhZGRpbmc6IDIwcnB4OyBib3JkZXItcmFkaXVzOiAxMnJweDsgbWFyZ2luOiAyMHJweDtwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uY291cG9uTGlzdCAuaW1ne3dpZHRoOiAxNjBycHg7IGhlaWdodDogMTYwcnB4O31cclxuLmNvdXBvbkxpc3QgLnd6X2JveHttYXJnaW4tbGVmdDogMTgwcnB4O31cclxuLmNvdXBvbkxpc3QgLnd6X2JveCAuYnR7Zm9udC1zaXplOiAyOHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4O31cclxuLmNvdXBvbkxpc3QgLnd6X2JveCAucHJpY2VfYm94e2ZvbnQtc2l6ZTogMjRycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgbWFyZ2luOiAyMHJweCAwO31cclxuLmNvdXBvbkxpc3QgLnd6X2JveCAucHJpY2VfYm94IC5iaWd7Zm9udC1zaXplOiAzNnJweDt9ICovXHJcbi5sb25nX2J0bnttYXJnaW46IDIwcnB4OyBiYWNrZ3JvdW5kOiAjMjBBRDIwOyBjb2xvcjogI2ZmZjsgaGVpZ2h0OiA4MHJweDsgbGluZS1oZWlnaHQ6IDgwcnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMzJycHg7IGJvcmRlci1yYWRpdXM6IDhycHg7IHBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgYm90dG9tOiAwOyByaWdodDogMDt9XHJcbi5zdGF0dXN7dGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDI4cnB4O2NvbG9yOiAjZmZmO3dpZHRoOiAxNDBycHg7aGVpZ2h0OiA2MHJweDtsaW5lLWhlaWdodDogNjBycHg7YmFja2dyb3VuZDogI0ZGNjYwMDtib3JkZXItcmFkaXVzOiA4cnB4O3Bvc2l0aW9uOiBhYnNvbHV0ZTtyaWdodDogMjBycHg7Ym90dG9tOiAyMHJweDtwYWRkaW5nOjA7fVxyXG4ubm9Vc2V7YmFja2dyb3VuZDogI2NjYzt9XHJcbi50YWJTY3JvbGx7bWFyZ2luLXRvcDo4OHJweCA7aGVpZ2h0OiBjYWxjKDEwMCUgLSA4OHJweCl9XHJcbi51c2VUYWJ7d2lkdGg6MTAwJTtoZWlnaHQ6IDg4cnB4O2JhY2tncm91bmQ6ICNmYWZhZmE7cG9zaXRpb246IGZpeGVkO3RvcDowO2xlZnQ6IDA7ei1pbmRleDogMn1cclxuLnRhYklue2ZvbnQtc2l6ZTogMzJycHg7Y29sb3I6Izg4ODt3aWR0aDo1MCU7dGV4dC1hbGlnbjogY2VudGVyO2Zsb2F0OiBsZWZ0O31cclxuLnRhYkluIHRleHR7ZGlzcGxheTogYmxvY2s7d2lkdGg6MjUwcnB4O21hcmdpbjowIGF1dG87aGVpZ2h0Ojg2cnB4O2xpbmUtaGVpZ2h0OiA4NnJweDtib3JkZXItYm90dG9tOjJycHggc29saWQgI2ZhZmFmYTsgfVxyXG4udXNlVGFiIC5hY3RpdmV7Y29sb3I6IzIwQUQyMDtiYWNrZ3JvdW5kOiAjZmZmO31cclxuLnVzZVRhYiAuYWN0aXZlIHRleHR7Ym9yZGVyLWJvdHRvbToycnB4IHNvbGlkICMyMEFEMjA7ZGlzcGxheTogYmxvY2s7d2lkdGg6MjUwcnB4O21hcmdpbjowIGF1dG87aGVpZ2h0Ojg2cnB4O2xpbmUtaGVpZ2h0OiA4NnJweDt9XHJcbi5ub01vcmV7d2lkdGg6MTAwJTtoZWlnaHQ6IDEwMHJweDtsaW5lLWhlaWdodDoxMDBycHg7dGV4dC1hbGlnbjogY2VudGVyO2ZvbnQtc2l6ZTogMjhycHg7Y29sb3I6IzY2Njt9XHJcbi53ZXVpLWxvYWRtb3Jle2hlaWdodDogODBycHg7bGluZS1oZWlnaHQ6IDgwcnB4O2JhY2tncm91bmQ6ICNmOGY4Zjg7dGV4dC1hbGlnbjogY2VudGVyfVxyXG4ud2V1aS1sb2FkbW9yZSBpbWFnZXt3aWR0aDogNDBycHg7aGVpZ2h0OiA0MHJweDttYXJnaW4tcmlnaHQ6IDEwcnB4O2Rpc3BsYXk6IGlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO31cclxuXHJcbi5jb3Vwb25MaXN0e21hcmdpbjoyNHJweDsgZGlzcGxheTogYmxvY2s7IGJvcmRlcjogMnJweCBzb2xpZCAjZWVlOyBiYWNrZ3JvdW5kOiAjZmZmOyBwYWRkaW5nOiAwOyBsaW5lLWhlaWdodDp1bnNldDsgd2lkdGg6IGF1dG87IGhlaWdodDogYXV0bzt9XHJcbi5jb3Vwb25MaXN0Lm92ZXIgLmNvbnR7b3BhY2l0eTogMC41fVxyXG4uY291cG9uTGlzdCAuY29udHtwYWRkaW5nOiAzMHJweCAyNHJweDsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9zaXRpb246IHJlbGF0aXZlO31cclxuLmNvdXBvbkxpc3QgLnByaWNle3dpZHRoOiAyMTZycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgZmxvYXQ6IGxlZnQ7fVxyXG4uY291cG9uTGlzdCAucHJpY2UgLm51bXtmb250LXNpemU6IDQ4cnB4O2NvbG9yOiAjRkY3MjVDOyBsaW5lLWhlaWdodDogODBycHg7fVxyXG4uY291cG9uTGlzdCAucHJpY2UgLm51bSBiaWd7Zm9udC1zaXplOiA3MnJweDt9XHJcbi5jb3Vwb25MaXN0IC5wcmljZSAudHh0e2ZvbnQtc2l6ZTogMjRycHg7IGNvbG9yOiAjOTk5O31cclxuLmNvdXBvbkxpc3QgLnR4dF9ib3h7bWFyZ2luLWxlZnQ6IDIzNnJweDt9XHJcbi5jb3Vwb25MaXN0IC50eHRfYm94IC50aXR7Zm9udC1zaXplOiAzMnJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBtYXJnaW4tYm90dG9tOiA4cnB4OyBwYWRkaW5nOjEycnB4IDAgMTZycHg7fVxyXG4uY291cG9uTGlzdCAudHh0X2JveCBwe2ZvbnQtc2l6ZTogMjRycHg7IGxpbmUtaGVpZ2h0OiAzNnJweDsgY29sb3I6ICM2NjY7IGRpc3BsYXk6IGJsb2NrO31cclxuLmNvdXBvbkxpc3QgLmljb3twb3NpdGlvbjogYWJzb2x1dGU7IHJpZ2h0OiA3MnJweDsgYm90dG9tOiAxMnJweDsgd2lkdGg6IDExNnJweDsgaGVpZ2h0OiAxMTZycHg7fSIsbnVsbF19 */
</style>