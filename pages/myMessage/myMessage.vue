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
		<view v-if="mymessage != ''" style="padding-bottom:100rpx;">
			<view v-for="(item, index) in mymessage" :key="index" class="messageList"
				:class="(isRead2[index] == '0' ? isRead2[index] : 'hide')" @tap="readMsg" :data-id="item.message_id"
				:data-index="index">
				<view class="time">{{item.dateline}}</view>
				<view class="box">
					<view class="title">{{item.title}}
						<view class="red"></view>
					</view>
					<view class="info">{{item.content}}</view>
				</view>
			</view>
			<view class="weui-loadmore" :hidden="loadhide">
				<image src="/static/image/loading.gif"></image>
				<text class="weui-loadmore__tips">正在加载</text>
			</view>
			<view class="noMore" :hidden="moreShow">没有更多啦~</view>
		</view>
		<view class="noData" v-else>您好，没有您的消息~</view>

		<view class="message_foot">
			<text @tap="toHistory">历史消息</text>|
			<text @tap="readAll">一键读取</text>
		</view>
	</view>
</template>

<script>
	// pages/myMessage/myMessage.js
	var app = getApp();
	var params = {
		type: '',
		is_read: '',
		page: 1
	};

	export default {
		data() {
			return {
				mymessage: [],
				page: 1,
				loadhide: true,
				moreShow: true,
				isRead: [],
				isRead2: [],
				is_all: 0, //是否一键已读
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
					that.isRead2.push(res.data.items[i].is_read);
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
							page: page,
							isRead2: that.isRead2
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
						that.isRead.push(res.data.items[i].is_read);
					}

					console.log(that.isRead);

					if (res.error == '0') {
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						that.setData({
							mymessage: res.data.items,
							isRead2: that.isRead
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
			},
			//读取信息
			readMsg: function(e) {
				console.log(e);
				var message_id = e ? e.currentTarget.dataset.id : '';
				var index = e ? e.currentTarget.dataset.index : null;
				var that = this;
				var is_all = that.is_all;
				app.globalData.readMessage({
					"message_id": message_id,
					"is_all": is_all
				}, function(res) {
					if (res.error == '0') {
						if (is_all == 1) {
							that.is_all = 0;
							that.https();
						};
						that.$set(that.isRead2, index, that.isRead2[index] + 2)
						//       that.isRead2[index] = that.isRead2[index] + 2;
						// console.log(that.isRead2[index])

					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},

			toHistory() {
				app.globalData.gopage("/pages/myMessage/history/history");
			},

			readAll() {
				var that = this;
				that.is_all = 1;
				setTimeout(function() {
					that.readMsg();
				}, 200);
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
		margin-top: 25rpx;
	}

	.messageList.hide {
		height: 0;
		opacity: 0;
		overflow: hidden;
		margin-top: 0;
	}

	.messageList .box {
		padding: 20rpx 20rpx;
		background: #fff;
		border-radius: 10rpx;
		position: relative;
	}

	.messageList .title {
		font-size: 32rpx;
		color: #333;
	}

	.messageList .red {
		display: inline-block;
		width: 15rpx;
		height: 15rpx;
		border-radius: 100%;
		background: #ff0000;
		border: 2rpx solid #fff;
		margin-left: 8rpx;
	}

	.messageList .time {
		text-align: center;
		color: #999;
		font-size: 24rpx;
		margin: 16rpx 0;
	}

	.messageList .info {
		width: 100%;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #666;
		line-height: 36rpx;
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

	.message_foot {
		text-align: center;
		padding: 30rpx 0;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #999;
		background: #eef2f5;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
	}

	.message_foot text {
		display: inline-block;
		margin: 0 24rpx;
		color: #999;
	}

	/* .active{display: block;} */

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwS0NuMGNoJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1DQUFtQztBQUNuQyxLQUFLLG1CQUFtQixDQUFDO0FBQ3pCLGFBQWEsWUFBWSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN6RCxrQkFBa0IsU0FBUyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUM7QUFDekUsa0JBQWtCLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDO0FBQ2hHLG9CQUFvQixnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7QUFDaEQsa0JBQWtCLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLEVBQUUsaUJBQWlCLENBQUM7QUFDcEosbUJBQW1CLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUM7QUFDcEYsbUJBQW1CLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUM7QUFDaEcsZUFBZSxhQUFhLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCO0FBQ3RGLHFCQUFxQixZQUFZLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDO0FBQ2pILFFBQVEsVUFBVSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7QUFDcEcsUUFBUSxVQUFVLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQzs7QUFFdkgsY0FBYyxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDO0FBQzVLLG1CQUFtQixxQkFBcUIsRUFBRSxlQUFlLEVBQUUsV0FBVyxDQUFDOztBQUV2RSw2QkFBNkIiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogcGFnZXMvbXlNZXNzYWdlL215TWVzc2FnZS53eHNzICovXHJcbnBhZ2V7YmFja2dyb3VuZDogI2VlZjJmNTt9XHJcbi5tZXNzYWdlTGlzdHt3aWR0aDo2NjBycHg7bWFyZ2luOjAgYXV0bzttYXJnaW4tdG9wOjI1cnB4O31cclxuLm1lc3NhZ2VMaXN0LmhpZGV7aGVpZ2h0OiAwOyBvcGFjaXR5OiAwOyBvdmVyZmxvdzogaGlkZGVuOyBtYXJnaW4tdG9wOiAwO31cclxuLm1lc3NhZ2VMaXN0IC5ib3h7cGFkZGluZzoyMHJweCAyMHJweDsgYmFja2dyb3VuZDogI2ZmZjtib3JkZXItcmFkaXVzOiAxMHJweDtwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4ubWVzc2FnZUxpc3QgLnRpdGxle2ZvbnQtc2l6ZTogMzJycHg7Y29sb3I6IzMzMzt9XHJcbi5tZXNzYWdlTGlzdCAucmVke2Rpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6MTVycHg7aGVpZ2h0OjE1cnB4O2JvcmRlci1yYWRpdXM6IDEwMCU7YmFja2dyb3VuZDogI2ZmMDAwMDtib3JkZXI6MnJweCBzb2xpZCAjZmZmOyBtYXJnaW4tbGVmdDogOHJweDt9XHJcbi5tZXNzYWdlTGlzdCAudGltZXt0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiM5OTk7Zm9udC1zaXplOiAyNHJweDsgbWFyZ2luOiAxNnJweCAwO31cclxuLm1lc3NhZ2VMaXN0IC5pbmZve3dpZHRoOjEwMCU7bWFyZ2luLXRvcDogMjBycHg7Zm9udC1zaXplOiAyOHJweDtjb2xvcjojNjY2OyBsaW5lLWhlaWdodDogMzZycHg7fVxyXG4ud2V1aS1sb2FkbW9yZXtoZWlnaHQ6IDgwcnB4O2xpbmUtaGVpZ2h0OiA4MHJweDtiYWNrZ3JvdW5kOiAjZjhmOGY4O3RleHQtYWxpZ246IGNlbnRlcn1cclxuLndldWktbG9hZG1vcmUgaW1hZ2V7d2lkdGg6IDQwcnB4O2hlaWdodDogNDBycHg7bWFyZ2luLXJpZ2h0OiAxMHJweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246IG1pZGRsZTt9XHJcbi5ub01vcmV7d2lkdGg6MTAwJTtoZWlnaHQ6IDEwMHJweDtsaW5lLWhlaWdodDoxMDBycHg7dGV4dC1hbGlnbjogY2VudGVyO2ZvbnQtc2l6ZTogMjhycHg7Y29sb3I6IzY2Njt9XHJcbi5ub0RhdGF7d2lkdGg6MTAwJTtoZWlnaHQ6IDEwMHJweDtsaW5lLWhlaWdodDoxMDBycHg7dGV4dC1hbGlnbjogY2VudGVyO2ZvbnQtc2l6ZTogMjhycHg7Y29sb3I6IzY2NjttYXJnaW4tdG9wOiAyMDBycHg7fVxyXG5cclxuLm1lc3NhZ2VfZm9vdHt0ZXh0LWFsaWduOiBjZW50ZXI7IHBhZGRpbmc6IDMwcnB4IDA7IGZvbnQtc2l6ZTogMjRycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgY29sb3I6ICM5OTk7IGJhY2tncm91bmQ6ICNlZWYyZjU7IHBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgYm90dG9tOjA7IHdpZHRoOiAxMDAlO31cclxuLm1lc3NhZ2VfZm9vdCB0ZXh0e2Rpc3BsYXk6IGlubGluZS1ibG9jazsgbWFyZ2luOiAwIDI0cnB4OyBjb2xvcjogIzk5OTt9XHJcblxyXG4vKiAuYWN0aXZle2Rpc3BsYXk6IGJsb2NrO30gKi9cclxuIl19 */
</style>