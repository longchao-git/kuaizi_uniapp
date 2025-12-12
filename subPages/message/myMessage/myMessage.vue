<template>
	<view>
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
				is_all: 0 //是否一键已读
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
			this.page = 1;
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
						that.loadhide = true
						that.moreShow = false
					} else {
						that.loadhide = false
						that.moreShow = true
						that.mymessage = that.mymessage.concat(res.data.items)
						that.page = page
						that.isRead2 = that.isRead2
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
						that.mymessage = res.data.items
						that.isRead2 = that.isRead
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
				app.globalData.gopage("/subPages/message/history/history");
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
	page {
		background: #f7f7f7;
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
		background: #f7f7f7;
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
</style>