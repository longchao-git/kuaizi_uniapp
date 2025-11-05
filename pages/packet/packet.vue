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
		<view class="redPacket mt10">
			<!-- <view class="wraper mb10"  wx:key="index" wx:for="{{packet}}">
        <image src="../../image/red_box@3x.png"></image>
        <view class="main">
            <view class="price"><text>€</text>{{item.amount}}</view> 
            <view class="text">
                <view class="title">{{item.title}}</view>
                <view class="black9">使用限制:满{{item.min_amount}}€可用</view>
                <view class="black9">有效期至:{{item.time}}</view>
            </view>
        </view>
    </view> -->
			<!--<view class="history black9">查看历史红包</view>-->
		</view>

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

		<view v-if="packet.length==0" class="none-cont">
			<view class="main">
				<image src="/static/image/noorder.png"></image>
				<view class="black6">暂无红包</view>
			</view>
		</view>
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
					that.setData({
						packet: res.data.items
					});
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwRHlZMEZxJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7bUhBWW1IOzs7O0FBSW5ILGFBQWEsWUFBWSxFQUFFLGNBQWMsRUFBRSx1QkFBdUIsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQztBQUMvSSx3QkFBd0IsWUFBWTtBQUNwQyxtQkFBbUIsb0JBQW9CLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7QUFDOUUsb0JBQW9CLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQUM7QUFDbkUseUJBQXlCLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQztBQUM3RSw2QkFBNkIsZ0JBQWdCLENBQUM7QUFDOUMseUJBQXlCLGdCQUFnQixFQUFFLFdBQVcsQ0FBQztBQUN2RCxzQkFBc0IsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7QUFDaEUsMkJBQTJCLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixDQUFDO0FBQ3JGLHdCQUF3QixnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFDO0FBQzFGLGtCQUFrQixrQkFBa0IsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDO0FBQ2hJLGtCQUFrQixrQkFBa0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLnJlZFBhY2tldHtwYWRkaW5nOiAwIDI0cnB4O31cclxuLnJlZFBhY2tldCAud3JhcGVye3Bvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5yZWRQYWNrZXQgLndyYXBlcjpiZWZvcmV7Y29udGVudDogJyc7ZGlzcGxheTogYmxvY2s7cG9zaXRpb246IGFic29sdXRlO2xlZnQ6IC04cnB4O3RvcDogMTM0cnB4O3dpZHRoOiAxNnJweDtoZWlnaHQ6IDE2cnB4O2JhY2tncm91bmQ6ICNGMEY0Rjc7Ym9yZGVyLXJhZGl1czogNTAlO31cclxuLnJlZFBhY2tldCAud3JhcGVyOmFmdGVye2NvbnRlbnQ6ICcnO2Rpc3BsYXk6IGJsb2NrO3Bvc2l0aW9uOiBhYnNvbHV0ZTtyaWdodDogLThycHg7dG9wOiAxMzRycHg7d2lkdGg6IDE2cnB4O2hlaWdodDogMTZycHg7YmFja2dyb3VuZDogI0YwRjRGNztib3JkZXItcmFkaXVzOiA1MCU7fVxyXG4ucmVkUGFja2V0IC53cmFwZXIgLm1haW57YmFja2dyb3VuZDogI2ZmZjtkaXNwbGF5OiBmbGV4O3dpZHRoOiAxMDAlO2hlaWdodDogMjI2cnB4O2JvcmRlci1yYWRpdXM6IDhycHg7cGFkZGluZzogNDBycHggMHJweDtib3gtc2l6aW5nOiBib3JkZXItYm94O31cclxuLnJlZFBhY2tldCAud3JhcGVyIC5wcmljZXt3aWR0aDogMjAwcnB4O3RleHQtYWxpZ246IGNlbnRlcjtsaW5lLWhlaWdodDogMTUwcnB4O2ZvbnQtc2l6ZTogNDhycHg7Y29sb3I6ICNmZjMzMDA7Ym9yZGVyLXJpZ2h0OiAycnB4IGRvdHRlZCAjZGVkZWRlO31cclxuLnJlZFBhY2tldCAud3JhcGVyIC5wcmljZSB0ZXh0e2ZvbnQtc2l6ZTogMjRycHg7fVxyXG4ucmVkUGFja2V0IC53cmFwZXIgLnRleHR7cGFkZGluZy1sZWZ0OiAzMHJweDtmb250LXNpemU6IDI4cnB4O31cclxuLnJlZFBhY2tldCAud3JhcGVyIC50ZXh0IHZpZXd7cGFkZGluZy1ib3R0b206IDIwcnB4O31cclxuLnJlZFBhY2tldCAud3JhcGVyIC50ZXh0IC50aXRsZXtmb250LXNpemU6IDMycnB4O3BhZGRpbmctYm90dG9tOjI0cnB4O31cclxuLnJlZFBhY2tldCAud3JhcGVyIGltYWdle3Bvc2l0aW9uOiBhYnNvbHV0ZTt0b3A6IDA7d2lkdGg6IDEwMCU7aGVpZ2h0OiAxNTBycHg7fVxyXG4ubWFpbnRvcHtwYWRkaW5nOiAzMHJweCAyNHJweDtmb250LXNpemU6IDI4cnB4O31cclxuLmhpc3Rvcnl7Zm9udC1zaXplOiAyOHJweDt0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtwb3NpdGlvbjogZml4ZWQ7Ym90dG9tOjQ4cnB4O2xlZnQ6IDUwJTttYXJnaW4tbGVmdDogLTkwcnB4O30gKi9cclxuXHJcblxyXG5cclxuLmhvbmdiYW9MaXN0e21hcmdpbjoyNHJweDsgZGlzcGxheTogYmxvY2s7IGJvcmRlcjogMnJweCBzb2xpZCAjZWVlOyBiYWNrZ3JvdW5kOiAjZmZmOyBwYWRkaW5nOiAwOyBsaW5lLWhlaWdodDp1bnNldDsgd2lkdGg6IGF1dG87IGhlaWdodDogYXV0bzt9XHJcbi5ob25nYmFvTGlzdC5vdmVyIC5jb250e29wYWNpdHk6IDAuNX1cclxuLmhvbmdiYW9MaXN0IC5jb250e3BhZGRpbmc6IDMwcnB4IDI0cnB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uaG9uZ2Jhb0xpc3QgLnByaWNle3dpZHRoOiAyMTZycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgZmxvYXQ6IGxlZnQ7fVxyXG4uaG9uZ2Jhb0xpc3QgLnByaWNlIC5udW17Zm9udC1zaXplOiA0OHJweDtjb2xvcjogI0ZGNzI1QzsgbGluZS1oZWlnaHQ6IDgwcnB4O31cclxuLmhvbmdiYW9MaXN0IC5wcmljZSAubnVtIGJpZ3tmb250LXNpemU6IDcycnB4O31cclxuLmhvbmdiYW9MaXN0IC5wcmljZSAudHh0e2ZvbnQtc2l6ZTogMjRycHg7IGNvbG9yOiAjOTk5O31cclxuLmhvbmdiYW9MaXN0IC50eHRfYm94e21hcmdpbi1sZWZ0OiAyMzZycHg7IG1hcmdpbi1yaWdodDogMTAwcnB4O31cclxuLmhvbmdiYW9MaXN0IC50eHRfYm94IC50aXR7Zm9udC1zaXplOiAzMnJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBtYXJnaW4tYm90dG9tOiA4cnB4O31cclxuLmhvbmdiYW9MaXN0IC50eHRfYm94IHB7Zm9udC1zaXplOiAyNHJweDsgbGluZS1oZWlnaHQ6IDM2cnB4OyBjb2xvcjogIzY2NjsgZGlzcGxheTogYmxvY2s7fVxyXG4uaG9uZ2Jhb0xpc3QgLmxpbXtwb3NpdGlvbjogYWJzb2x1dGU7IHJpZ2h0OiAyMHJweDsgdG9wOiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTUwJSk7IGZvbnQtc2l6ZTogMzBycHg7IGZvbnQtd2VpZ2h0OiBib2xkO31cclxuLmhvbmdiYW9MaXN0IC5pY297cG9zaXRpb246IGFic29sdXRlOyByaWdodDogNzJycHg7IGJvdHRvbTogMTJycHg7IHdpZHRoOiAxMTZycHg7IGhlaWdodDogMTE2cnB4O30iXX0= */
</style>