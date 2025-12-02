<template>
	<view>
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
				moreShow: true
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
						that.page = page;
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
						that.mymessage = res.data.items;
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
</style>