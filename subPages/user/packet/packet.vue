<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view v-for="(item, index) in packet" :key="index"
			:class="'hongbaoList ' + ((item.outTime == '1' || item.order_id > 0) ? 'over' : '')">
			<view class="cont">
				<view class="price">
					<view class="num">€<span class='big'>{{item.amount}}</span></view>
					<view class="txt">满{{item.min_amount}}€可用</view>
				</view>
				<view class="txt_box">
					<view class="tit overflow_clear">{{item.title}}</view>
					<p>有效期至{{item.time}}</p>
					<p>{{item.limit_time_label}}</p>
				</view>
				<span class="lim">{{item.from_label}}</span>
				<image class="ico" src="/static/image/mine/bg_lm_out0f3x.png" v-if="item.outTime == '1'"></image>
				<image class="ico" src="/static/image/mine/bg_lm_used3x.png" v-if="item.order_id > 0"></image>
			</view>
		</view>

		<NoData :show="packet.length === 0" text="暂无红包" />

	</view>
</template>

<script>
	// pages/packet/packet.js
	var app = getApp();

	export default {
		data() {
			return {
				packet: [],
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
			var that = this;
			app.globalData.mineHongbao({
				page: 1,
				type: 1
			}, function(res) {
				//  console.log("红包列表",res);
				if (res.error == '0') {
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000;

					for (var i = 0; i < res.data.items.length; i++) {
						res.data.items[i].time = that.toDate(res.data.items[i].ltime);
						res.data.items[i].order_id = Number(res.data.items[i].order_id);

						if (res.data.items[i].ltime < timestamp) {
							res.data.items[i].outTime = '1';
						} else {
							res.data.items[i].outTime = '0';
						}

						;
					}

					;
					that.packet = res.data.items
					;
				} else {
					uni.showToast({
						title: res.message
					});
				}

				;
			});
		},
		onShareAppMessage: function() {
			app.globalData.share('微信小程序外卖', '/pages/index/index');
		},
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
			}
		}
	};
</script>
<style>
	/* .redPacket{padding: 0 24rpx;}
.redPacket .wraper{position: relative;}
.redPacket .wraper:before{content: '';display: block;position: absolute;left: -8rpx;top: 134rpx;width: 16rpx;height: 16rpx;background: #F0F4F7;border-radius: 50%;}
.redPacket .wraper:after{content: '';display: block;position: absolute;right: -8rpx;top: 134rpx;width: 16rpx;height: 16rpx;background: #F0F4F7;border-radius: 50%;}
.redPacket .wraper .main{background: #fff;display: flex;width: 100%;height: 226rpx;border-radius: 8rpx;padding: 40rpx 0rpx;box-sizing: border-box;}
.redPacket .wraper .price{width: 200rpx;text-align: center;line-height: 150rpx;font-size: 48rpx;color: #ff3300;border-right: 2rpx dotted #dedede;}
.redPacket .wraper .price text{font-size: 24rpx;}
.redPacket .wraper .text{padding-left: 30rpx;font-size: 28rpx;}
.redPacket .wraper .text view{padding-bottom: 20rpx;}
.redPacket .wraper .text .title{font-size: 32rpx;padding-bottom:24rpx;}
.redPacket .wraper image{position: absolute;top: 0;width: 100%;height: 150rpx;}
.maintop{padding: 30rpx 24rpx;font-size: 28rpx;}
.history{font-size: 28rpx;text-decoration: underline;position: fixed;bottom:48rpx;left: 50%;margin-left: -90rpx;} */



	.hongbaoList {
		margin: 24rpx;
		display: block;
		border: 2rpx solid #eee;
		background: #fff;
		padding: 0;
		line-height: unset;
		width: auto;
		height: auto;
	}

	.hongbaoList.over .cont {
		opacity: 0.5
	}

	.hongbaoList .cont {
		padding: 30rpx 24rpx;
		overflow: hidden;
		position: relative;
	}

	.hongbaoList .price {
		width: 216rpx;
		text-align: center;
		float: left;
	}

	.hongbaoList .price .num {
		font-size: 48rpx;
		color: #FF725C;
		line-height: 80rpx;
	}

	.hongbaoList .price .num .big {
		font-size: 72rpx;
	}

	.hongbaoList .price .txt {
		font-size: 24rpx;
		color: #999;
	}

	.hongbaoList .txt_box {
		margin-left: 236rpx;
		margin-right: 100rpx;
	}

	.hongbaoList .txt_box .tit {
		font-size: 32rpx;
		line-height: 40rpx;
		margin-bottom: 8rpx;
	}

	.hongbaoList .txt_box p {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #666;
		display: block;
	}

	.hongbaoList .lim {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translate(0, -50%);
		font-size: 30rpx;
		font-weight: bold;
	}

	.hongbaoList .ico {
		position: absolute;
		right: 72rpx;
		bottom: 12rpx;
		width: 116rpx;
		height: 116rpx;
	}

	
</style>