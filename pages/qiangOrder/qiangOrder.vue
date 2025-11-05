<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<!--提示框引入-开始-->
				<!--<import src="../components/showToast.wxml"></import>-->
				<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
					<block v-if="showToast.isShow? showToast.isShow: false">
						<!-- <view class="toast-bg" wx:if="{{showToast.mask==false? false : true}}"></view>   -->
						<view class="toast-center">
							<view class="toast">
								<image class="toast-icon" :src="showToast.icon" mode="scaleToFill"
									v-if="showToast.icon"></image>
								<text class="toast-text">{{showToast.title}}</text>
							</view>
						</view>
					</block>
				</block>
				<!--提示框引入-结束-->
				<!--用户点击手势调用授权设置-开始-->
				<!--<import src="../../template/pubset/pubset.wxml"></import>-->
				<block data-type="template" data-is="pubset" data-attr="OpenSettingShow,OpenSettingType">
					<view class="pubOpenSetting" v-if="OpenSettingShow">
						<view class="cont">
							<view class="txt black6">获取用户授权</view>
							<view class="btn_box">
								<view class="btn cancel" @tap="closeSetting">取消</view>
								<view class="btn confirm" @tap="closeSetting">确定<button
										:open-type="OpenSettingType"></button></view>
							</view>
						</view>
					</view>
				</block>


				<view class="iflogin" :hidden="noorder">
					<view class="nologin">
						<image src="/static/image/noorder.png"></image>
						<view class="tip black6">暂无订单</view>
					</view>
				</view>
				<view class="page" :hidden="login">
					<!--<scroll-view class="order_list_box" scroll-into-view="{{toview}}" scroll-y="true" bindscrolltolower="loadmore" bindscrolltoupper="refresh">-->
					<view class="order_list_box">
						<view v-for="(item, idx) in order_list" :key="idx" :data-idx="idx">
							<view class="order_list mb10" :id="idx==0?'first':''">
								<view class="info_box">
									<!-- <image class="fl img" :src="pageimg + '' + item.shop_logo"></image> -->
									<block v-if="item.msg=='已取消'">
										<view class="state fr black9 beyond">{{item.msg}}</view>
									</block>
									<block v-else>
										<view class="state fr colorword beyond">{{item.msg}}</view>
									</block>
									<view class="wz">
										<view>订单号:{{item.order_id}}</view>
									</view>
								</view>

								<view class="list" @tap.stop="toorderdetail" :data-orderid="item.order_id">
									<view class="flex-wrp">
										<image :src="item.photo" mode="aspectFill"
											style="width: 120rpx;height: 160rpx;"></image>
										<view style="margin-left: 16rpx;">
											<view class="name">{{item.qiang_title}}</view>
											<view class="name">{{item.shop_title}}</view>
											<view class="name">数量：{{item.qiang_number}}</view>
										</view>

									</view>
									<text>{{item.product_title}}</text>
									<view class="picre">总计</view>
									<view class="fr" style="margin-bottom: 16rpx;">€{{item.amount}}</view>
								</view>
								<!--</navigator>-->
								<view class="btn_box">
									<view class="time">{{item.dateline}}</view>

									<view class="flex-wrp">
										<block v-if="item.show_btn.pay=='1'">
											<button type="default" :size="defaultSize" @tap="paybtn"
												:data-shopid="item.shop_id" hover-class="other-button-hover"
												class="pay_btn"
												:data-orderid="item.order_id">去支付{{item.mytime?item.mytime:''}}</button>
										</block>
										<block v-if="item.show_btn.comment=='1'">
											<button type="default" :size="defaultSize" @tap="evltTap"
												:data-orderid="item.order_id" hover-class="other-button-hover"
												class="comment_btn">去评价</button>
										</block>
										<block v-if="item.show_btn.payback=='1'">
											<button type="default" :size="defaultSize" @tap="tuipop"
												:data-orderid="item.order_id" hover-class="other-button-hover"
												class="comment_btn">申请退款</button>
										</block>
										<block v-if="item.show_btn.canel=='1'">
											<button type="default" :size="defaultSize" @tap="cancelpop"
												hover-class="other-button-hover" class="cancel_btn"
												:data-shopid="item.shop_id" :data-orderid="item.order_id">取消订单</button>
										</block>
									</view>
								</view>
							</view>
						</view>
						<view class="weui-loadmore" :hidden="loadhide">
							<image src="/static/image/loading.gif"></image>
							<text class="weui-loadmore__tips">正在加载</text>
						</view>
						<!--</scroll-view>-->
					</view>
				</view>
			</view>
		</skeleton>
	</view>
</template>

<script>
	var app = getApp();
	var common = require("../../js/ecart.js");
	var ecart = null;
	var reason;
	var double = true;
	var that = null;

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},
				defaultSize: 'mini',
				pageimg: app.globalData._CFG.IMG_URL || '',
				plain: false,
				//loading: false,
				order_list: [],
				page: 1,
				cancelHidden: true,
				orderid: '',
				toview: '',
				loadhide: true,
				login: true,
				noorder: true,
				showToast: {
					isShow: false
				},
				OpenSettingShow: false
			}
		},

		onShow() {
			console.log(123123123)
			this.bindonshow()
			// this.reloadData()
		},
		onReachBottom: function() {
			var page = this.page;
			page++;
			var that = this;
			app.globalData.qiangClientOrder({
				"page": page,
			}, function(res) {
				if (res.error == '0') {
					if (res.data.order_list.length == 0) {
						that.setData({
							loadhide: true
						});
					} else {
						that.setData({
							loadhide: false,
							order_list: that.order_list.concat(res.data.order_list),
							page: page
						});
					}
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},

		onPullDownRefresh: function() {
			this.bindonshow();
			uni.stopPullDownRefresh();
		},

		methods: {
			tuipop(e) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要申请退款吗？',
					success: function(res) {
						if (res.confirm) {
							that.qiangPayback(e.currentTarget.dataset.orderid)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			qiangPayback(orderid) {
				var that = this;
				app.globalData.qiangPayback({
					"order_id": orderid
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "申请退款成功"
						});
						that.bindonshow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});

			},
			bindonshow() {
				that = this;
				this.loading = true
				if (app.globalData.CheckLogin()) {
					app.globalData.qiangClientOrder({
						"page": 1,
					}, function(res) {
						that.loading = false
						uni.showLoading({
							title: '加载中...'
						});
						if (res.error == '0') {
							if (res.data.order_list.length == 0) {
								setTimeout(function() {
									uni.hideLoading();
								}, 500);
								that.setData({
									noorder: false,
									login: true
								});
							} else {
								for (var i = 0; i < res.data.order_list.length; i++) {
									res.data.order_list[i].dateline = new Date(parseInt(res.data.order_list[i]
											.dateline) *
										1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
								}
								that.setData({
									order_list: res.data.order_list,
									login: false,
									page: 1,
									noorder: true
								});
								setTimeout(function() {
									uni.hideLoading();
								}, 500);
							}
						} else {
							//wx.hideLoading()
							setTimeout(function() {
								uni.hideLoading();
							}, 500);
							uni.showToast({
								title: res.message
							});
						}
					});
				} else {
					this.loading = false
					that.setData({
						login: true,

					});
				} //先定义一个变量存储自己
			},

			cancelpop: function(e) {
				console.log(e)
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要取消订单吗？',
					success: function(res) {
						if (res.confirm) {
							that.setData({
								orderid: e.currentTarget.dataset.orderid
							});

							that.cancel()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			cancel: function() {
				var that = this;
				app.globalData.orderTicket({
					"order_id": that.orderid
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "取消订单成功"
						});
						that.bindonshow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});

			},
			evltTap: function(e) {

				var orderid = e.currentTarget.dataset.orderid
				app.globalData.topage('/pages/ordevlt/ordevlt?orderid=' + orderid + '&type=1');
			},
			paybtn: function(e) {
				if (double) {
					app.globalData._CFG.payorderid = e.currentTarget.dataset.orderid;
					uni.navigateTo({
						url: '../payment/payment?orderid=' + e.currentTarget.dataset.orderid + '&type=1'
					});
					double = false;
					setTimeout(function() {
						double = true;
					}, 500);
				}
			},



			toorderdetail: function(e) {
				var orderid = e.currentTarget.dataset.orderid;
				app.globalData.topage('../qiangOrder/detail?orderid=' + orderid);
			},


			//授权
			closeSetting() {
				uni.pubOpenSetting(false);
			},

		},

	};
</script>
<style>
	.order_list {
		background: #fff;
		position: relative;
		margin: 20rpx 30rpx 0;
		box-shadow: 0px 0px 16rpx 0px rgba(219, 219, 219, 0.5);
		border-radius: 16rpx;
	}

	.page {
		height: 100%;
	}

	.order_list_box {
		height: 100%;
		position: relative;
		z-index: 1;
	}

	.order_list .info_box {
		overflow: hidden;
		padding: 18rpx 0;
		position: relative;
		margin: 0 30rpx;
		border-bottom: 1rpx #E6E6E6 solid;
		line-height: 33rpx;
		font-size: 24rpx;
		color: #3E4248;
	}

	.order_list .info_box image.img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
		overflow: hidden;
		background: #eee;
	}

	.order_list .info_box .wz {
		margin-right: 200rpx;
	}

	.order_list .info_box .wz .tit {
		font-size: 28rpx;
		line-height: 30rpx;
	}

	.order_list .info_box .wz .tit .linkico {
		width: 28rpx;
		height: 28rpx;
		vertical-align: text-bottom;
		margin-left: 14rpx;
	}

	.order_list .info_box .wz .time {
		font-size: 22rpx;
		line-height: 40rpx;
		color: #999;
	}

	.order_list .info_box .state {
		font-size: 24rpx;
		line-height: 33rpx;
		width: 200rpx;
		text-align: right;
	}

	.order_list .info_box .colorword {
		color: #ff797c;
		margin-top: 20rpx;
	}

	.order_list .info_box .tag {
		border-radius: 16rpx 0 0 0;
		position: absolute;
		left: 0;
		top: 0;
		background: #FFB74C;
		border-radius: 0 0px 20px 0;
		color: #fff;
		font-size: 22rpx;
		padding: 6rpx 10rpx 10rpx 6rpx;
	}

	.order_list .list {
		overflow: hidden;
		padding: 30rpx 20rpx;
		font-size: 24rpx;
		line-height: 40rpx;
	}

	.order_list .list text {
		max-width: 80%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: block;
	}

	.order_list .list .picre {
		float: left;
		margin-top: 16rpx;
	}

	.order_list .list .name {
		color: #3E4248;
		font-size: 26rpx;
		margin-bottom: 16rpx;
	}

	.order_list .btn_box {
		overflow: hidden;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 0;
		margin: 0 30rpx;
		border-top: 1rpx #E6E6E6 solid;
	}

	.order_list .btn_box .time {
		color: #9292AF;
		font-size: 22rpx;
	}

	.order_list .payback_btn {
		color: #ff797c;
	}

	.order_list .payback_btn:after {
		border: 2rpx solid #ff797c;
	}

	.order_list .btn_box button {
		line-height: 60rpx;
		padding: 0 24rpx;
		background: #fff;
		margin-left: 16rpx;
		height: 60rpx;
		color: #3E4248;
	}

	.order_list .btn_box button.btn_time {
		color: #ff797c;
	}

	.order_list .btn_box button.btn_time::after {
		border: 1px solid #ff797c;
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


	.cancel_popup .bt {
		padding: 30rpx;
		margin-bottom: 10rpx;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
	}

	.cancel_popup .radio_box {
		padding: 10rpx 20rpx 0 40rpx;
	}

	.cancel_popup .radio_box .box {
		width: 33.3333%;
		float: left;
	}

	.cancel_popup .radio_box .list {
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}

	.cancel_popup .radio_box .bq {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 2rpx solid #E6EAED;
		border-radius: 30rpx;
		box-sizing: border-box;
		color: #333333;
	}

	.cancel_popup .radio_box .bq.on {
		background: #ff797c;
		color: #ffffff;
		border-color: #ff797c;
	}

	.cancel_popup .section {
		padding: 0 40rpx 30rpx;
	}

	.cancel_popup .section textarea {
		width: 100%;
		height: 160rpx;
		border: 2rpx solid #E6EAED;
		border-radius: 8rpx;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.cancel_popup .btn_box {
		border-top: 2rpx solid #E6EAED;
	}

	.cancel_popup .btn_box wx-button {
		display: inline-block;
		width: 50%;
		height: 86rpx;
		line-height: 86rpx;
		background-color: #fff;
		vertical-align: top;
	}

	.cancel_popup .btn_box button:after {
		display: none;
	}

	.cancel_popup .btn_box .btn {
		border-left: 2rpx solid #E6EAED;
		box-sizing: border-box;
		color: #FF0000;
	}

	.iflogin {
		position: relative;
		z-index: 0;
	}

	.nologin {
		text-align: center;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-weblit-transform: translate(-50%, -50%)
	}

	.nologin view {
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.nologin button {
		height: 60rpx;
		line-height: 60rpx;
		width: 200rpx;
		font-size: 24rpx;
	}

	.nologin image {
		width: 200rpx;
		height: 200rpx;
	}

	.image-bg {
		position: fixed;
		z-index: -1;
		left: 0;
		right: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}





	.fixed_box {
		position: fixed;
		right: 20rpx;
		bottom: 60rpx;
	}

	.fixed_box image {
		width: 100rpx;
		height: 100rpx;
	}

	.weui-mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
	}

	.phonePopup .cont,
	.cancel_popup .cont {
		position: fixed;
		left: 50%;
		top: 50%;
		bottom: auto;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		width: 90%;
		box-sizing: border-box;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		background: transparent;
		-webkit-transition: -webkit-transform .3s;
		transition: -webkit-transform .3s;
		transition: transform .3s;
		transition: transform .3s, -webkit-transform .3s;
		z-index: 5000;
		border-radius: 8rpx;
		background-color: #FFFFFF;
	}

	.phonePopup .list {
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		color: #333333;
		position: relative;
	}

	.phonePopup .list:before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #D9D9D9;
		color: #D9D9D9;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.phonePopup .list:first-child:before {
		display: none;
	}

	.order_list .btn_box .pay_btn {
		background: #FF797C;
		color: #ffffff;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwSEZzaFJJJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQztBQUNsRCxNQUFNLFlBQVksQ0FBQztBQUNuQixnQkFBZ0IsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsQ0FBQztBQUM3RCx1QkFBdUIsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixDQUFDO0FBQzVFLGdDQUFnQyxZQUFZLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0FBQ3JILDBCQUEwQixrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQztBQUNuRSwrQkFBK0IsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7QUFDcEUseUNBQXlDLFlBQVksRUFBRSxhQUFhLEVBQUUsMEJBQTBCLEVBQUUsa0JBQWtCLENBQUM7QUFDckgsZ0NBQWdDLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQztBQUNsRiw2QkFBNkIsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7QUFDbEUsaUNBQWlDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztBQUNsRSwyQkFBMkIsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSwyQkFBMkIsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsNkJBQTZCLENBQUM7QUFDL0ssbUJBQW1CLGdCQUFnQixFQUFFLDJCQUEyQixFQUFFLG9CQUFvQixFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDO0FBQzdILHVCQUF1QixjQUFjLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQztBQUM5SCxzQkFBc0IsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsMkJBQTJCLEVBQUUsb0JBQW9CLENBQUM7QUFDN0cseUJBQXlCLGNBQWMsQ0FBQztBQUN4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dG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm9yZGVyX2xpc3R7IGJhY2tncm91bmQ6ICNmZmY7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5wYWdle2hlaWdodDogMTAwJTt9XHJcbi5vcmRlcl9saXN0X2JveHtoZWlnaHQ6IDEwMCU7IHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTt9XHJcbi5vcmRlcl9saXN0IC5pbmZvX2JveHsgb3ZlcmZsb3c6IGhpZGRlbjsgcGFkZGluZzogMjBycHg7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5vcmRlcl9saXN0IC5pbmZvX2JveCBpbWFnZS5pbWd7d2lkdGg6IDYwcnB4OyBoZWlnaHQ6IDYwcnB4OyBib3JkZXItcmFkaXVzOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBiYWNrZ3JvdW5kOiAjZWVlO31cclxuLm9yZGVyX2xpc3QgLmluZm9fYm94IC53enttYXJnaW4tbGVmdDogODBycHg7IG1hcmdpbi1yaWdodDogMjAwcnB4O31cclxuLm9yZGVyX2xpc3QgLmluZm9fYm94IC53eiAudGl0e2ZvbnQtc2l6ZTogMjhycHg7IGxpbmUtaGVpZ2h0OiAzMHJweDt9XHJcbi5vcmRlcl9saXN0IC5pbmZvX2JveCAud3ogLnRpdCAubGlua2ljb3sgd2lkdGg6IDI4cnB4OyBoZWlnaHQ6IDI4cnB4OyB2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbTsgbWFyZ2luLWxlZnQ6IDE0cnB4O31cclxuLm9yZGVyX2xpc3QgLmluZm9fYm94IC53eiAudGltZXtmb250LXNpemU6IDIycnB4OyBsaW5lLWhlaWdodDogNDBycHg7IGNvbG9yOiAjOTk5O31cclxuLm9yZGVyX2xpc3QgLmluZm9fYm94IC5zdGF0ZXtmb250LXNpemU6IDI4cnB4OyBsaW5lLWhlaWdodDogNDBycHg7fVxyXG4ub3JkZXJfbGlzdCAuaW5mb19ib3ggLmNvbG9yd29yZHtjb2xvcjogI2ZmNjYwMDttYXJnaW4tdG9wOiAyMHJweDt9XHJcbi5vcmRlcl9saXN0IC5pbmZvX2JveCAudGFne3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyBiYWNrZ3JvdW5kOiAjRkZCNzRDOyBib3JkZXItcmFkaXVzOiAwIDBweCAyMHB4IDA7IGNvbG9yOiAjZmZmOyBmb250LXNpemU6IDIycnB4OyBwYWRkaW5nOjZycHggMTBycHggMTBycHggNnJweDt9XHJcbi5vcmRlcl9saXN0IC5saXN0eyBvdmVyZmxvdzogaGlkZGVuOyBib3JkZXItdG9wOiAycnB4IHNvbGlkICNlZWU7IHBhZGRpbmc6IDI0cnB4IDIwcnB4OyBmb250LXNpemU6IDI0cnB4OyBsaW5lLWhlaWdodDogNDBycHg7fVxyXG4ub3JkZXJfbGlzdCAubGlzdCB0ZXh0e21heC13aWR0aDogODAlO292ZXJmbG93OiBoaWRkZW47d2hpdGUtc3BhY2U6IG5vd3JhcDt0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztkaXNwbGF5OiBibG9jaztmbG9hdDogbGVmdDt9XHJcbi5vcmRlcl9saXN0IC5idG5fYm94eyBvdmVyZmxvdzogaGlkZGVuOyB0ZXh0LWFsaWduOiByaWdodDsgYm9yZGVyLXRvcDogMnJweCBzb2xpZCAjZWVlOyBwYWRkaW5nOiAxMHJweCAyMHJweDt9XHJcbi5vcmRlcl9saXN0IC5wYXliYWNrX2J0bntjb2xvcjogI2ZmNjYwMDt9XHJcbi5vcmRlcl9saXN0IC5wYXliYWNrX2J0bjphZnRlcntib3JkZXI6MnJweCBzb2xpZCAjZmY2NjAwO31cclxuLm9yZGVyX2xpc3QgLmJ0bl9ib3ggYnV0dG9ueyBsaW5lLWhlaWdodDogNjBycHg7IHBhZGRpbmc6IDAgMjRycHg7IGJhY2tncm91bmQ6ICNmZmY7IG1hcmdpbi1sZWZ0OiAxNnJweDt9XHJcbi5vcmRlcl9saXN0IC5idG5fYm94IGJ1dHRvbi5idG5fdGltZXtjb2xvcjogI2ZmNjYwMDt9XHJcbi5vcmRlcl9saXN0IC5idG5fYm94IGJ1dHRvbi5idG5fdGltZTo6YWZ0ZXJ7Ym9yZGVyOjFweCBzb2xpZCAjZmY2NjAwO31cclxuXHJcbi53ZXVpLWxvYWRtb3Jle2hlaWdodDogODBycHg7bGluZS1oZWlnaHQ6IDgwcnB4O2JhY2tncm91bmQ6ICNmOGY4Zjg7dGV4dC1hbGlnbjogY2VudGVyfVxyXG4ud2V1aS1sb2FkbW9yZSBpbWFnZXt3aWR0aDogNDBycHg7aGVpZ2h0OiA0MHJweDttYXJnaW4tcmlnaHQ6IDEwcnB4O2Rpc3BsYXk6IGlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO31cclxuXHJcblxyXG4uY2FuY2VsX3BvcHVwIC5idHsgcGFkZGluZzogMzBycHg7IG1hcmdpbi1ib3R0b206IDEwcnB4OyBmb250LXNpemU6IDI4cnB4OyBjb2xvcjogIzMzMzMzMzsgdGV4dC1hbGlnbjogY2VudGVyO31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94eyBwYWRkaW5nOiAxMHJweCAyMHJweCAwIDQwcnB4O31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94IC5ib3h7IHdpZHRoOiAzMy4zMzMzJTsgZmxvYXQ6IGxlZnQ7fVxyXG4uY2FuY2VsX3BvcHVwIC5yYWRpb19ib3ggLmxpc3R7IG1hcmdpbi1yaWdodDogMjBycHg7IG1hcmdpbi1ib3R0b206IDIwcnB4O31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94IC5icXsgd2lkdGg6IDEwMCU7IGhlaWdodDogNjBycHg7IGxpbmUtaGVpZ2h0OiA2MHJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBib3JkZXI6IDJycHggc29saWQgI0U2RUFFRDsgYm9yZGVyLXJhZGl1czogMzBycHg7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGNvbG9yOiAjMzMzMzMzO31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94IC5icS5vbnsgYmFja2dyb3VuZDogIzIwQUQyMDsgY29sb3I6ICNmZmZmZmY7IGJvcmRlci1jb2xvcjogIzIwQUQyMDt9XHJcblxyXG4uY2FuY2VsX3BvcHVwIC5zZWN0aW9ueyBwYWRkaW5nOiAwIDQwcnB4IDMwcnB4O31cclxuLmNhbmNlbF9wb3B1cCAuc2VjdGlvbiB0ZXh0YXJlYXsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTYwcnB4OyBib3JkZXI6IDJycHggc29saWQgI0U2RUFFRDsgYm9yZGVyLXJhZGl1czogOHJweDsgYm94LXNpemluZzogYm9yZGVyLWJveDsgcGFkZGluZzogMjBycHg7fVxyXG5cclxuLmNhbmNlbF9wb3B1cCAuYnRuX2JveHsgYm9yZGVyLXRvcDogMnJweCBzb2xpZCAjRTZFQUVEO31cclxuLmNhbmNlbF9wb3B1cCAuYnRuX2JveCB3eC1idXR0b257IGRpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDUwJTsgaGVpZ2h0OiA4NnJweDsgbGluZS1oZWlnaHQ6IDg2cnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOyB2ZXJ0aWNhbC1hbGlnbjogdG9wO31cclxuLmNhbmNlbF9wb3B1cCAuYnRuX2JveCBidXR0b246YWZ0ZXJ7IGRpc3BsYXk6IG5vbmU7fVxyXG4uY2FuY2VsX3BvcHVwIC5idG5fYm94IC5idG57IGJvcmRlci1sZWZ0OiAycnB4IHNvbGlkICNFNkVBRUQ7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGNvbG9yOiAjRkYwMDAwO31cclxuXHJcbi5pZmxvZ2lue3dpZHRoOiAxMDAlO2hlaWdodDogMTAwJTt9XHJcbi5ub2xvZ2lue3RleHQtYWxpZ246IGNlbnRlcjtwb3NpdGlvbjogYWJzb2x1dGU7dG9wOiA1MCU7bGVmdDogNTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTstd2VibGl0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKX1cclxuLm5vbG9naW4gdmlld3tmb250LXNpemU6IDI4cnB4O21hcmdpbi10b3A6IDIwcnB4O31cclxuLm5vbG9naW4gYnV0dG9ue2hlaWdodDogNjBycHg7bGluZS1oZWlnaHQ6IDYwcnB4O3dpZHRoOiAyMDBycHg7Zm9udC1zaXplOiAyNHJweDt9XHJcbi5ub2xvZ2luIGltYWdle3dpZHRoOiAyMDBycHg7aGVpZ2h0OjIwMHJweDt9XHJcblxyXG5cclxuXHJcblxyXG5cclxuLmZpeGVkX2JveHsgcG9zaXRpb246IGZpeGVkOyByaWdodDogMjBycHg7IGJvdHRvbTogNjBycHg7fVxyXG4uZml4ZWRfYm94IGltYWdleyB3aWR0aDogMTAwcnB4OyBoZWlnaHQ6IDEwMHJweDt9XHJcbi53ZXVpLW1hc2sgeyBwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDEwMDA7IHRvcDogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7IGJvdHRvbTogMDsgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjQpO31cclxuLnBob25lUG9wdXAgLmNvbnQsLmNhbmNlbF9wb3B1cCAuY29udHsgcG9zaXRpb246IGZpeGVkOyBsZWZ0OiA1MCU7IHRvcDogNTAlOyBib3R0b206IGF1dG87IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7IHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpOyB3aWR0aDogOTAlOyBib3gtc2l6aW5nOiBib3JkZXItYm94OyAtd2Via2l0LWJhY2tmYWNlLXZpc2liaWxpdHk6IGhpZGRlbjsgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuM3M7IHRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4zczsgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC4zczsgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC4zcywgLXdlYmtpdC10cmFuc2Zvcm0gLjNzOyB6LWluZGV4OiA1MDAwOyBib3JkZXItcmFkaXVzOiA4cnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO31cclxuLnBob25lUG9wdXAgLmxpc3R7IGZvbnQtc2l6ZTogMzJycHg7IGhlaWdodDogMTAwcnB4OyBsaW5lLWhlaWdodDogMTAwcnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiAjMzMzMzMzOyBwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4ucGhvbmVQb3B1cCAubGlzdDpiZWZvcmUgeyBjb250ZW50OiBcIiBcIjsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBoZWlnaHQ6IDFweDsgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNEOUQ5RDk7IGNvbG9yOiAjRDlEOUQ5OyAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDAgMDsgdHJhbnNmb3JtLW9yaWdpbjogMCAwOyAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGVZKDAuNSk7IHRyYW5zZm9ybTogc2NhbGVZKDAuNSk7fVxyXG4ucGhvbmVQb3B1cCAubGlzdDpmaXJzdC1jaGlsZDpiZWZvcmUgeyBkaXNwbGF5OiBub25lO31cclxuXHJcbi5vcmRlcl9saXN0IC5idG5fYm94IHd4LWJ1dHRvbi5wYXlfYnRuIHtiYWNrZ3JvdW5kOiAjRkY2NjAwOyBjb2xvcjogI2ZmZmZmZjt9XHJcbiIsbnVsbF19 */
</style>