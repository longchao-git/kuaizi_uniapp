<template>
	<view>
		<!--提示框引入-开始-->
		<!--<import src="../../components/showToast.wxml"></import>-->
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
		<view v-if="mymessage != ''">
			<view v-for="(item, index) in mymessage" :key="index" class="messageList">
				<view class="title">{{item.title}}</view>
				<view class="time">{{item.dateline}}</view>
				<view style="clear:both;"></view>
				<view class="info">{{item.content}}</view>
				<view class="red"></view>
			</view>
			<view class="weui-loadmore" :hidden="loadhide">
				<image src="/static/image/loading.gif"></image>
				<text class="weui-loadmore__tips">正在加载</text>
			</view>
			<view class="noMore" :hidden="moreShow">没有更多啦~</view>
		</view>
		<view class="noData" v-else>您好，没有您的消息~</view>
	</view>
</template>

<script>
	// pages/myMessage/myMessage.js
	var app = getApp();
	var params = {
		type: '',
		is_read: '1',
		page: 1
	};

	export default {
		data() {
			return {
				mymessage: [],
				page: 1,
				loadhide: true,
				moreShow: true,
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
			if (options.type) {
				params.type = options.type;
			} else {
				params.type = '';
			}

			;
			this.https();
		},
		onPullDownRefresh: function() {
			this.setData({
				page: 1
			});
			this.https();
			uni.stopPullDownRefresh();
		},
		onReachBottom: function() {
			var that = this;
			var page = that.page;
			page++;
			params.page = page;
			app.globalData.mineMessage(params, function(res) {
				for (var i = 0; i < res.data.items.length; i++) {
					res.data.items[i].dateline = that.toDate(res.data.items[i].dateline);
				} // console.log(that.data.isRead2)


				if (res.error == '0') {
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
							mymessage: that.mymessage.concat(res.data.items),
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
		methods: {
			https: function() {
				var that = this;
				params.page = that.page;
				app.globalData.mineMessage(params, function(res) {
					for (var i = 0; i < res.data.items.length; i++) {
						res.data.items[i].dateline = that.toDate(res.data.items[i].dateline);
					}

					console.log(that.isRead);

					if (res.error == '0') {
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						that.setData({
							mymessage: res.data.items
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			toDate: function(number) {
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '/';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
				var Mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
				var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + "  " + H + Mi + S;
			}
		}
	};
</script>
<style>
	/* pages/myMessage/myMessage.wxss */
	page {
		background: #eef2f5;
	}

	.messageList {
		width: 660rpx;
		margin: 0 auto;
		padding: 20rpx 20rpx;
		margin-top: 25rpx;
		background: #fff;
		border-radius: 10rpx;
		position: relative;
	}

	.title {
		width: 60%;
		float: left;
		font-size: 28rpx;
		color: #333;
	}

	.time {
		float: right;
		color: #ccc;
		font-size: 24rpx;
	}

	.info {
		width: 100%;
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #999;
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

	.noMore {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}

	.noData {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		margin-top: 200rpx;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwTXlDX2EwJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1DQUFtQztBQUNuQyxLQUFLLG1CQUFtQixDQUFDO0FBQ3pCLGFBQWEsWUFBWSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQztBQUN0SSxPQUFPLFNBQVMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO0FBQ3pELE1BQU0sWUFBWSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMvQyxNQUFNLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7QUFDL0QsZUFBZSxhQUFhLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCO0FBQ3RGLHFCQUFxQixZQUFZLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDO0FBQ2pILFFBQVEsVUFBVSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7QUFDcEcsUUFBUSxVQUFVLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwYWdlcy9teU1lc3NhZ2UvbXlNZXNzYWdlLnd4c3MgKi9cclxucGFnZXtiYWNrZ3JvdW5kOiAjZWVmMmY1O31cclxuLm1lc3NhZ2VMaXN0e3dpZHRoOjY2MHJweDttYXJnaW46MCBhdXRvO3BhZGRpbmc6MjBycHggMjBycHg7bWFyZ2luLXRvcDoyNXJweDtiYWNrZ3JvdW5kOiAjZmZmO2JvcmRlci1yYWRpdXM6IDEwcnB4O3Bvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi50aXRsZXt3aWR0aDo2MCU7ZmxvYXQ6IGxlZnQ7Zm9udC1zaXplOiAyOHJweDtjb2xvcjojMzMzO31cclxuLnRpbWV7ZmxvYXQ6IHJpZ2h0O2NvbG9yOiNjY2M7Zm9udC1zaXplOiAyNHJweDt9XHJcbi5pbmZve3dpZHRoOjEwMCU7bWFyZ2luLXRvcDogMjBycHg7Zm9udC1zaXplOiAyNHJweDtjb2xvcjojOTk5O31cclxuLndldWktbG9hZG1vcmV7aGVpZ2h0OiA4MHJweDtsaW5lLWhlaWdodDogODBycHg7YmFja2dyb3VuZDogI2Y4ZjhmODt0ZXh0LWFsaWduOiBjZW50ZXJ9XHJcbi53ZXVpLWxvYWRtb3JlIGltYWdle3dpZHRoOiA0MHJweDtoZWlnaHQ6IDQwcnB4O21hcmdpbi1yaWdodDogMTBycHg7ZGlzcGxheTogaW5saW5lLWJsb2NrO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7fVxyXG4ubm9Nb3Jle3dpZHRoOjEwMCU7aGVpZ2h0OiAxMDBycHg7bGluZS1oZWlnaHQ6MTAwcnB4O3RleHQtYWxpZ246IGNlbnRlcjtmb250LXNpemU6IDI4cnB4O2NvbG9yOiM2NjY7fVxyXG4ubm9EYXRhe3dpZHRoOjEwMCU7aGVpZ2h0OiAxMDBycHg7bGluZS1oZWlnaHQ6MTAwcnB4O3RleHQtYWxpZ246IGNlbnRlcjtmb250LXNpemU6IDI4cnB4O2NvbG9yOiM2NjY7bWFyZ2luLXRvcDogMjAwcnB4O31cclxuIl19 */
</style>