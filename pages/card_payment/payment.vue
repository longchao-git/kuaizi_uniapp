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
		<view class="container">
			<view class="pubPaypage">
				<view class="mb10">
					<view class="info_list"><span class="fl bt">配送会员卡：</span><span class="fr">{{title}}</span></view>
					<view class="info_list"><span class="fl bt">支付金额：</span><text
							class="fr price"><span>€</span>{{amount}}</text></view>
				</view>
				<view class="pay_way mb10">
					<!-- v-if="money > 0" -->
					<view class="list">
						<label style="border-bottom:2rpx solid #e6e6e6;">
							<image src="/static/image/payWay033x.png"></image>
							<view class="txt">
								<view class="big">余额支付</view>
								<view class="min black9">
									<view class="fl">余额：<text class="fontcl3">€{{money}}</text></view>
									<view class="fl ml20" v-if="payAmount != 0">还需支付：<text
											class="fontcl3">€{{payAmount}}</text></view>
								</view>
							</view>
							<!-- <switch @change="switchYue"></switch> -->
						</label>
					</view>
					<!-- 	<radio-group class="radio-group" @change="radioChange">
						<view class="list">
							<label v-for="(item, index) in zhifuitems" :key="index">
								<image :src="item.ico"></image>
								<view class="txt">{{item.name}}</view>
								<radio v-if="disable != false" name="code" :value="item.code" :checked="item.checked">
								</radio>
								<view class="disable" :hidden="disable"></view>
							</label>
							<view class="mask" :hidden="disable"></view>
						</view>
					</radio-group> -->
				</view>
				<view class="btn_box">
					<button class="long_btn" @tap="payMoney">确认支付</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/payment/payment.js
	var app = getApp();

	export default {
		data() {
			return {
				title: '',
				amount: '',
				card_id: '',
				// order: { amount: 7.1,},
				zhifuitems: [{
					ico: "/static/image/payWay023x.png",
					name: '微信支付',
					code: 'yaband',
					checked: 'true'
				}],
				code: 'money',
				payAmount: 0,
				//余额抵扣后还需另付款；
				money: 12.98,
				//账户余额；
				yuePay: false,
				//是否用余额支付 true为是，false为否；
				use_money: 0,
				disable: true,
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},

		onLoad(e) {
			this.setData({
				title: e.title,
				amount: e.amount,
				card_id: e.card_id
			}); // order_id = e.orderid
			let payAmount = 0

		},

		onShow: function() {
			var that = this;
			app.globalData.mineInfo({}, function(res) {
				//  console.log(res);
				if (res.error == '0') {
					that.setData({
						money: res.data.money
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
			return {
				title: '微信小程序外卖',
				path: '/pages/index/index',
				success: function(res) { // 分享成功
				},
				fail: function(res) { // 分享失败
				}
			};
		},
		methods: {
			//选择余额支付；
			switchYue: function(e) {
				console.log(e);
				this.setData({
					yuePay: e.detail.value
				});
				this.calculate();
			},
			// radioChange:function(e){
			//   console.log(e)
			//   this.setData({
			//     code:e.detail.value
			//   });
			//   this.calculate();
			// },
			//计算余额全抵扣还是部分抵扣；
			calculate: function() {
				var that = this;
				var yuePay = that.yuePay; //是否用余额支付 true为是，false为否；

				var amount = that.amount; //消费总金额；

				var yue_money = that.money; //账户余额；

				var otherPay = (amount - yue_money).toFixed(2); //   console.log(otherPay);

				if (yuePay == true) {
					if (otherPay > 0) {
						// 余额抵扣部分，微信支付
						that.setData({
							payAmount: otherPay,
							code: 'yaband',
							disable: true
						});
					} else {
						//余额抵扣；
						that.setData({
							payAmount: 0,
							code: 'money',
							disable: false
						});
					}

					;
				} else {
					that.setData({
						code: 'yaband',
						payAmount: 0,
						disable: true
					});
				}

				;
			},
			payMoney: function() {
				var that = this;
				var card_id = that.card_id;
				var code = that.code; // console.log(use_money, code);

				app.globalData.payPeicard({
					"code": code,
					"card_id": card_id
				}, function(res) {
					if (res.error == '0') {
						if (code == 'yaband') {
							var aa = res.data.jsApiParameters;
							uni.requestPayment({
								'timeStamp': aa.timeStamp,
								'nonceStr': aa.nonceStr,
								'package': aa.package,
								'signType': aa.signType,
								'paySign': aa.paySign,
								'success': function(res) {
									uni.showToast({
										title: '支付成功'
									});
									setTimeout(function() {
										uni.navigateBack({
											delta: 2
										});
									}, 2000);
								},
								'fail': function(res) {
									uni.showToast({
										title: '支付失败,请重新支付'
									});
								}
							});
						} else {
							uni.showToast({
								title: res.message
							});
							setTimeout(function() {
								uni.navigateBack({
									delta: 2
								});
							}, 2000);
						};
					} else {
						uni.showToast({
							title: res.message
						});
					};
				});
			},

			radioChange() {
				console.log("占位：函数 radioChange 未声明");
			}

		}
	};
</script>
<style>
	/* pages/payment/payment.wxss */
	/*支付页面开始*/
	.pubPaypage .info_list {
		overflow: hidden;
		background: #fff;
		position: relative;
		padding: 24rpx 30rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		border-bottom: 2rpx solid #e6e6e6;
		display: flex;
	}

	.pubPaypage .info_list:last-child {
		border-bottom: 0rpx;
	}

	.pubPaypage .info_list .bt {
		color: #666;
	}

	.pubPaypage .info_list .fr {
		flex: 1;
	}

	.pubPaypage .info_list .price {
		font-weight: bold;
		font-size: 36rpx;
		color: #ff797c;
	}

	.pubPaypage .pay_way .list {
		background: #fff;
		padding: 0 24rpx;
		position: relative;
	}

	.pubPaypage .pay_way .list label {
		display: block;
		overflow: hidden;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #e6e6e6;
	}

	.pubPaypage .pay_way .list label:last-child {
		border-bottom: 0;
	}

	.pubPaypage .pay_way .list image {
		width: 60rpx;
		height: 60rpx;
		float: left;
		margin-right: 20rpx;
	}

	.pubPaypage .pay_way .list .txt {
		float: left;
		font-size: 28rpx;
		line-height: 60rpx;
	}

	.pubPaypage .pay_way .list radio {
		display: block;
		float: right;
		margin-top: 7rpx;
	}

	.pubPaypage .pay_way .list switch {
		float: right;
		margin-top: 7rpx;
	}

	.pubPaypage .pay_way .list .big {
		line-height: 30rpx;
	}

	.pubPaypage .pay_way .list .min {
		font-size: 24rpx;
	}

	.pubPaypage .pay_way .list .disable {
		float: right;
		margin-top: 7rpx;
		width: 44rpx;
		height: 44rpx;
		border-radius: 100%;
		background: #fafafa;
		border: 2rpx solid #e6e6e6;
		margin-right: 10rpx;
	}

	.pubPaypage .pay_way .list .mask {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #666;
		opacity: 0;
		z-index: 10;
	}



	.pubPaypage .btn_box {
		margin: 60rpx 30rpx;
	}

	.pubPaypage .btn_box .long_btn {
		display: block;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #ff797c;
		border-radius: 8rpx;
		font-size: 32rpx;
		color: #fff;
		border: 0;
	}

	/*支付页面结束*/
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwUGZlMkFiJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixTQUFTO0FBQ1Qsd0JBQXdCLGVBQWUsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixFQUFFLGdDQUFnQyxDQUFDLGFBQWEsQ0FBQztBQUNyTCxtQ0FBbUMsa0JBQWtCLENBQUM7QUFDdEQsNEJBQTRCLFVBQVUsQ0FBQztBQUN2QywyQkFBMkIsTUFBTSxDQUFDO0FBQ2xDLCtCQUErQixnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsYUFBYSxDQUFDO0FBQ2hGLDRCQUE0QixlQUFlLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDO0FBQ2pGLGtDQUFrQyxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxnQ0FBZ0MsQ0FBQztBQUNwSCw2Q0FBNkMsZUFBZSxDQUFDO0FBQzdELGtDQUFrQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQztBQUM1RixpQ0FBaUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQztBQUNoRixxQ0FBcUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDL0UsbUNBQW1DLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDL0QsZ0NBQWdDLGtCQUFrQixDQUFDO0FBQ25ELGlDQUFpQyxnQkFBZ0IsQ0FBQztBQUNsRCxvQ0FBb0MsV0FBVyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLDBCQUEwQixFQUFFLG1CQUFtQixDQUFDO0NBQ3BMLGtDQUFrQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQzs7OztBQUkzSSxzQkFBc0Isa0JBQWtCLENBQUM7QUFDekMsZ0NBQWdDLGFBQWEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDOztBQUU3TCxTQUFTIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHBhZ2VzL3BheW1lbnQvcGF5bWVudC53eHNzICovXHJcbi8q5pSv5LuY6aG16Z2i5byA5aeLKi9cclxuLnB1YlBheXBhZ2UgLmluZm9fbGlzdHsgb3ZlcmZsb3c6aGlkZGVuOyBiYWNrZ3JvdW5kOiNmZmY7IHBvc2l0aW9uOnJlbGF0aXZlOyBwYWRkaW5nOjI0cnB4IDMwcnB4OyBmb250LXNpemU6MjhycHg7IGxpbmUtaGVpZ2h0OjQwcnB4OyBib3JkZXItYm90dG9tOjJycHggc29saWQgI2U2ZTZlNjtkaXNwbGF5OiBmbGV4O31cclxuLnB1YlBheXBhZ2UgLmluZm9fbGlzdDpsYXN0LWNoaWxkeyBib3JkZXItYm90dG9tOjBycHg7fVxyXG4ucHViUGF5cGFnZSAuaW5mb19saXN0IC5idHsgY29sb3I6IzY2Njt9XHJcbi5wdWJQYXlwYWdlIC5pbmZvX2xpc3QgLmZye2ZsZXg6MTt9XHJcbi5wdWJQYXlwYWdlIC5pbmZvX2xpc3QgLnByaWNleyBmb250LXdlaWdodDpib2xkOyBmb250LXNpemU6MzZycHg7IGNvbG9yOiNmZjY2MDA7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdHsgYmFja2dyb3VuZDojZmZmOyBwYWRkaW5nOjAgMjRycHg7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IGxhYmVseyBkaXNwbGF5OmJsb2NrOyBvdmVyZmxvdzpoaWRkZW47IHBhZGRpbmc6MzBycHggMDsgYm9yZGVyLWJvdHRvbToycnB4IHNvbGlkICNlNmU2ZTY7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCBsYWJlbDpsYXN0LWNoaWxkeyBib3JkZXItYm90dG9tOjA7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCBpbWFnZXsgd2lkdGg6NjBycHg7IGhlaWdodDo2MHJweDsgZmxvYXQ6bGVmdDsgbWFyZ2luLXJpZ2h0OjIwcnB4O31cclxuLnB1YlBheXBhZ2UgLnBheV93YXkgLmxpc3QgLnR4dHsgZmxvYXQ6bGVmdDsgZm9udC1zaXplOjI4cnB4OyBsaW5lLWhlaWdodDo2MHJweDt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IHd4LXJhZGlveyBkaXNwbGF5OmJsb2NrO2Zsb2F0OnJpZ2h0O21hcmdpbi10b3A6N3JweDt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IHN3aXRjaCB7ZmxvYXQ6cmlnaHQ7bWFyZ2luLXRvcDo3cnB4O31cclxuLnB1YlBheXBhZ2UgLnBheV93YXkgLmxpc3QgLmJpZ3tsaW5lLWhlaWdodDogMzBycHg7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCAubWluIHtmb250LXNpemU6IDI0cnB4O31cclxuLnB1YlBheXBhZ2UgLnBheV93YXkgLmxpc3QgLmRpc2FibGV7ZmxvYXQ6cmlnaHQ7bWFyZ2luLXRvcDo3cnB4OyB3aWR0aDogNDRycHg7IGhlaWdodDo0NHJweDtib3JkZXItcmFkaXVzOiAxMDAlOyBiYWNrZ3JvdW5kOiAjZmFmYWZhO2JvcmRlcjogMnJweCBzb2xpZCAjZTZlNmU2OyBtYXJnaW4tcmlnaHQ6IDEwcnB4O31cclxuIC5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IC5tYXNrIHtwb3NpdGlvbjogYWJzb2x1dGU7bGVmdDogMDsgdG9wOiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO2JhY2tncm91bmQ6ICM2NjY7IG9wYWNpdHk6IDA7IHotaW5kZXg6IDEwO30gXHJcblxyXG5cclxuXHJcbi5wdWJQYXlwYWdlIC5idG5fYm94eyBtYXJnaW46NjBycHggMzBycHg7fVxyXG4ucHViUGF5cGFnZSAuYnRuX2JveCAubG9uZ19idG57IGRpc3BsYXk6YmxvY2s7IHdpZHRoOjEwMCU7IGhlaWdodDo4MHJweDsgbGluZS1oZWlnaHQ6ODBycHg7IHRleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6ICMyMEFEMjA7Ym9yZGVyLXJhZGl1czogOHJweDsgZm9udC1zaXplOjMycnB4OyBjb2xvcjojZmZmOyBib3JkZXI6MDt9XHJcblxyXG4vKuaUr+S7mOmhtemdoue7k+adnyovIl19 */
</style>