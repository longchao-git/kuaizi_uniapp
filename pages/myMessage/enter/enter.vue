<template>
	<ul class="messageEnter">
		<li @tap="toOrder">
			<view class="pic">
				<span class="ico" v-if="order_msg.read_count != '0'"></span>
				<image src="/static/image/icon_messD3x.png"></image>
			</view>
			<view class="wz_box">
				<view class="tit">订单消息<text class="fr" v-if="order_msg.msg.length > 0">{{order_msg.msg[0].time}}</text>
				</view>
				<view class="overflow_clear">
					<block v-if="order_msg.msg.length > 0">{{order_msg.msg[0].content}}</block>
					<block v-else>暂无消息</block>
				</view>
			</view>
		</li>
		<li @tap="toMessage">
			<view class="pic">
				<span class="ico" v-if="other_msg.read_count != '0'"></span>
				<image src="/static/image/icon_messW3x.png"></image>
			</view>
			<view class="wz_box">
				<view class="tit">温馨提示<text class="fr" v-if="other_msg.msg.length > 0">{{other_msg.msg[0].time}}</text>
				</view>
				<view class="overflow_clear">
					<block v-if="other_msg.msg.length > 0">{{other_msg.msg[0].content}}</block>
					<block v-else>暂无消息</block>
				</view>
			</view>
		</li>
	</ul>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
				order_msg: {
					read_count: "",
					msg: ""
				},
				other_msg: {
					read_count: "",
					msg: ""
				}
			};
		},

		components: {},
		props: {},
		onShow: function() {
			var that = this;
			app.globalData.mineMessageCates({}, function(res) {
				if (res.error == "0") {
					if (res.data.order_msg.msg.length > 0) {
						res.data.order_msg.msg[0].time = that.toDate(res.data.order_msg.msg[0].dateline);
					}

					;

					if (res.data.other_msg.msg.length > 0) {
						res.data.other_msg.msg[0].time = that.toDate(res.data.other_msg.msg[0].dateline);
					}

					;
					that.other_msg = res.data.other_msg
					that.order_msg = res.data.order_msg;
				}

				;
			});
		},
		methods: {
			//转时间戳
			toDate: function(number) {
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
				var Mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + "  " + H + Mi;
			},

			//去订单消息页面
			toOrder() {
				if (this.order_msg && this.order_msg.msg.length > 0) {
					app.globalData.topage("/pages/myMessage/myMessage?type=1");
				}
			},

			//去我的消息页面
			toMessage() {
				if (this.other_msg.msg.length > 0) {
					app.globalData.topage("/pages/myMessage/myMessage?type=2");
				}

				;
			}

		}
	};
</script>
<style>
	.messageEnter li {
		display: block;
		background: #fff;
		padding: 28rpx 24rpx;
		overflow: hidden;
		margin-bottom: 2rpx;
	}

	.messageEnter li .pic {
		float: left;
		position: relative;
	}

	.messageEnter li .pic .ico {
		position: absolute;
		right: -8rpx;
		top: -8rpx;
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border: 2rpx solid #fff;
		border-radius: 100%;
		background: #FF2800;
	}

	.messageEnter li .pic image {
		width: 96rpx;
		height: 96rpx;
	}

	.messageEnter li .wz_box {
		margin-left: 128rpx;
	}

	.messageEnter li .wz_box .tit {
		overflow: hidden;
		font-weight: normal;
		font-size: 32rpx;
		line-height: 40rpx;
		margin-bottom: 12rpx;
		color: #333;
	}

	.messageEnter li .wz_box .tit text {
		font-size: 24rpx;
		color: #999;
	}

	.messageEnter li .wz_box view {
		font-size: 28rpx;
		color: #999;
		line-height: 40rpx;
	}

	.message_no {
		text-align: center;
		padding-top: 60px;
	}

	.message_no img {
		margin-bottom: 25px;
		width: 100px;
	}

	.message_no p {
		font-size: 14px;
		color: #999;
		line-height: 20px;
	}
</style>