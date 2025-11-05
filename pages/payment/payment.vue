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
		<view class="pubPage pubPaypage">
			<view class="pubPageCont">
				<!--内容-->
				<view>
					<view class="info_box mb10">
						<view class="price">€{{orderAmount}}</view>
						<view class="time" id="LastPayTime" v-if="isType!=1">（{{LastPayTime}}）</view>
					</view>
					<view v-if="isviewValue">{{isviewValue}}</view>
					<view class="pay_way mb10">
						<view class="title">选择支付方式</view>
						<block v-if="payAmount > 0">
							<view class="list" v-if="money > 0">
								<label style="border-bottom:2rpx solid #e6e6e6;">
									<image src="/static/image/icon_moneyPay3x.png" class="ico"></image>
									<view class="txt">余额支付<text>（抵扣<text class="fontcl1">€{{money}}</text>）</text>
									</view>
									<switch @change="switchYue"></switch>
									<image class="select_ico"
										:src="'/static/image/' + (yuePay ? 'btn_fx_checked3x' : 'btn_fx3x') + '.png'">
									</image>
								</label>
							</view>
							<radio-group class="radio-group" @change="radioChange">
								<view class="list">
									<label v-for="(item, index) in zhifuitems" :key="index">
										<image :src="item.ico" class="ico"></image>
										<!-- 还需支付€{{payAmount}} -->
										<view class="txt">{{item.name}}</view>
										<radio name="code" :value="item.code" :checked="item.checked"></radio>
										<image class="select_ico"
											:src="'/static/image/' + (item.checked == 'true' ? 'btn_dx_checked3x' : 'btn_dx3x') + '.png'">
										</image>
									</label>
								</view>
							</radio-group>
						</block>
						<block v-else>
							<radio-group class="radio-group" @change="radioChange">
								<view class="list">
									<label v-for="(item, index) in zhifuitems" :key="index">
										<image :src="item.ico" class="ico"></image>
										<view class="txt">{{item.name}}<text
												v-if="item.code == 'money'">（€{{money}}）</text></view>
										<radio name="code" :value="item.code"></radio>
										<image class="select_ico"
											:src="'/static/image/' + (item.checked == 'true' || (item.code == 'money' && code == 'money') ? 'btn_dx_checked3x' : 'btn_dx3x') + '.png'">
										</image>
									</label>
								</view>
							</radio-group>
						</block>
					</view>
				</view>
			</view>
			<!--底部-->
			<view :class="[disabled==true?'no_btn_box':'btn_box']">
				<button class="long_btn" @tap="$noMultipleClicks(payMoney)" :disabled="disabled">确认支付</button>
			</view>
		</view>
		<!-- <view class="container">
    <view class="pubPaypage">
        <view class="mb10">
            <view class="info_list"><span class="fl bt">订单编号：</span><span class="fr">{{order.order_id}}</span></view>
            <view class="info_list"><span class="fl bt">支付金额：</span><text class="fr price"><span>€</span>{{order.amount}}</text></view>
        </view>
        <view class="pay_way mb10">
            <view class="list" wx:if="{{money > 0}}">
                <label style="border-bottom:2rpx solid #e6e6e6;">
                    <image src="../../image/payWay033x.png"></image>
                    <view class="txt">
                        <view class="big">余额支付</view>
                        <view class="min black9">
                            <view class="fl">余额：<text class="fontcl3">€{{money}}</text></view>
                            <view class="fl ml20"  wx-if="{{payAmount != 0}}">还需支付：<text class="fontcl3">€{{payAmount}}</text></view>
                        </view>
                    </view>
                    <switch  bindchange="switchYue"/>
                </label>
            </view>
           <radio-group class="radio-group" bindchange="radioChange">
                <view class="list">
                    <label wx:for="{{zhifuitems}}" wx:key="index">
                        <image src="{{item.ico}}"></image>
                        <view class="txt">{{item.name}}</view>
                        <radio wx:if="{{disable != false}}" name="code" value="{{item.code}}" checked="{{item.checked}}"/>
                        <view class="disable" hidden="{{disable}}"></view>
                    </label>
                    <view class="mask" hidden="{{disable}}"></view>
                </view>
           </radio-group>
        </view>
        <view class="btn_box">
            <button class="long_btn" bindtap="payMoney">确认支付</button>
        </view>
    </view>
</view> -->
	</view>
</template>

<script>
	// pages/payment/payment.js
	var app = getApp(),
		order_id;

	export default {
		data() {
			return {
				order: {
					amount: 0
				},
				zhifuitems: [{
					ico: "/static/image/icon_wechatPay3x.png",
					name: '微信支付',
					code: 'yaband',
					checked: 'true'
				}],
				payAmount: 0,
				//余额抵扣后还需另付款；
				money: 0,
				//账户余额；
				orderAmount: 0,
				//订单金额；
				yuePay: false,
				//是否用余额支付 true为是，false为否；
				code: '',
				use_money: 0,
				LastPayTime: "支付剩余00分00秒",
				showToast: {
					isShow: false
				},
				noClick: true,
				disabled: false,
				isType: 0,
				isviewValue: ''
			};
		},

		components: {},
		props: {},

		onLoad(e) {
			if (e.type == 1) {
				this.isType = 1
			}
			order_id = e.orderid;
		},

		onShow: function() {
			var that = this;
			app.globalData.orderInfo({
				"order_id": order_id
			}, function(res) {
				//  console.log(res);
				if (res.error == '0') {
					that.setData({
						orderAmount: Number(res.data.order.amount),
						money: Number(res.data.money)
					});
					uni.removeStorage({
						key: 'payorderid'
					});
					var orderAmount = Number(res.data.order.amount),
						//订单金额
						money = Number(res.data.money),
						//账户余额
						payAmount = (orderAmount - money).toFixed(2); //计算另付金额
					//判断支付方式展示

					if (payAmount > 0) {
						// #ifdef MP-ALIPAY 
						that.setData({
							code: 'alipay_mini',
							payAmount: payAmount,
							zhifuitems: [{
								ico: "/static/image/icon_alipay.png",
								name: '支付宝支付',
								code: 'alipay_mini',
								checked: 'true'
							}]
						});
						// #endif 
						// #ifdef  H5
						that.setData({
							code: 'yaband',
							payAmount: payAmount,
							zhifuitems: [{
								ico: "/static/image/payWay013x.png",
								name: 'H5支付',
								code: 'yaband',
								checked: 'true'
							}]
						});
						// #endif 
						// #ifdef MP-WEIXIN
						that.setData({
							code: 'yaband',
							payAmount: payAmount,
							zhifuitems: [{
								ico: "/static/image/icon_wechatPay3x.png",
								name: '微信支付',
								code: 'yaband',
								checked: 'true'
							}]
						});
						// #endif 

					} else {
						that.setData({
							code: 'money',
							use_money: 1,
							payAmount: 0,

							// #ifdef  MP-ALIPAY
							zhifuitems: [{
								ico: "/static/image/icon_moneyPay3x.png",
								name: '余额支付',
								code: 'money',
								checked: 'false'
							}, {
								ico: "/static/image/icon_alipay.png",
								name: '支付宝支付',
								code: 'alipay_mini',
								checked: 'false'
							}],
							// #endif
							// #ifdef  H5
							zhifuitems: [{
								ico: "/static/image/icon_moneyPay3x.png",
								name: '余额支付',
								code: 'money',
								checked: 'false'
							}, {
								ico: "/static/image/icon_wechatPay3x.png",
								name: 'H5支付',
								code: 'yaband',
								checked: 'false'
							}],
							// #endif
							// #ifdef MP-WEIXIN 
							zhifuitems: [{
								ico: "/static/image/icon_moneyPay3x.png",
								name: '余额支付',
								code: 'money',
								checked: 'false'
							}, {
								ico: "/static/image/icon_wechatPay3x.png",
								name: '微信支付',
								code: 'yaband',
								checked: 'false'
							}],
							// #endif 
						});
					};
					if (that.isType != 1) {
						app.globalData.ordersDetail({
							"order_id": order_id
						}, function(res) {
							if (res.error == '0') that.setLastPayTime(Number(res.data.detail
									.pay_ltime) *
								60);
						});
					}

				} else {
					uni.showToast({
						title: res.message
					});
					uni.removeStorage({
						key: 'payorderid'
					});
				}

				;
			});
		},
		methods: {
			//选择余额支付；
			switchYue: function(e) {
				this.setData({
					yuePay: e.detail.value
				});
				this.calculate();
			},
			radioChange: function(e) {
				console.log(e.detail.value);
				var zhifuitems = this.zhifuitems;
				this.setData({
					code: e.detail.value
				});

				for (var i in zhifuitems) {
					zhifuitems[i].checked = "false";

					if (zhifuitems[i].code == e.detail.value) {
						zhifuitems[i].checked = "true";
					};
				}

				this.setData({
					zhifuitems: zhifuitems
				});
				this.calculate();
			},

			//计算余额全抵扣还是部分抵扣；
			calculate() {
				var code = this.code,
					yuePay = this.yuePay,
					payAmount = this.payAmount;

				if (yuePay) {
					this.setData({
						use_money: 1,
						code: 'yaband'
					});
				} else {
					if (code == 'money') {
						this.setData({
							use_money: 1
						});
					}
					// #ifdef MP-WEIXIN
					else if (code == 'yaband') {
						this.setData({
							use_money: 0
						});
					}
					// #endif
					// #ifdef MP-ALIPAY
					else if (code == 'alipay_mini') {
						this.setData({
							use_money: 0
						});
					}
					// #endif

				}
			},

			// calculate: function() {
			//     var that = this;
			//     var code = that.data.code; //是否用余额支付 true为是，false为否；
			//     var amount = that.data.order.amount; //消费总金额；
			//     var yue_money = that.data.money; //账户余额；
			//     var otherPay = (amount - yue_money).toFixed(2);
			//     console.log(that.data.code);
			//     if (code == 'money') {
			//         //余额抵扣；
			//         that.setData({
			//             use_money: 1,
			//         });
			//     } else {
			//         // 余额抵扣部分，微信支付；
			//         that.setData({
			//             code: 'yaband',
			//         });
			//     };
			// },
			//支付倒计时
			formatTime(time) {
				// var h = Math.floor(time / 60 / 60);
				var min = Math.floor(time / 60 % 60);
				var sec = Math.floor(time % 60);

				if (min == 0 && sec == 0) {
					return 0;
				} else {
					return "支付剩余" + this.formatNumber(min) + "分" + this.formatNumber(sec) + "秒";
				}

				;
			},

			formatNumber(n) {
				n = n.toString();
				return n[1] ? n : "0" + n;
			},

			setLastPayTime(time) {
				var that = this;
				clearInterval(timer);
				var timer = setInterval(function() {
					time--; // console.log(time);

					if (that.formatTime(time) != 0) {
						that.setData({
							LastPayTime: that.formatTime(time)
						});
					} else {
						that.setData({
							LastPayTime: "支付剩余00分00秒"
						});
						clearInterval(timer);
						app.globalData.topage("/pages/orderDetail/detail?orderid=" + order_id, "redirect");
					}
				}, 1000);
			},

			afterPayment: function(message) {
				let that = this
				uni.showToast({
					title: message
				});
				setTimeout(function() {
					if (that.isType == 1) {
						app.globalData.topage("/pages/qiangOrder/detail?orderid=" + order_id, "redirect");
					} else {
						app.globalData.topage("/pages/orderDetail/detail?orderid=" + order_id, "redirect");
					}

				}, 2000);
			},
			payMoney: function() {
				var that = this;
				var code = that.code;
				var use_money = that.use_money; // console.log(use_money, code);

				that.disabled = true;

				app.globalData.orderPay({
					"order_id": order_id,
					'code': code,
					'use_money': use_money
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
								success: function(res) {
									that.afterPayment('支付成功')
								},
								fail: function(res) {
									that.afterPayment('支付失败')
								}
							});
						} else if (code == 'alipay_mini') {
							console.log(res)
							var payParams = res.data.jsApiParameters;
							console.log(payParams.transaction_id)
							// return
							if (payParams.transaction_id) {
								// paymentUrl: payParams.payment_url,
								my.crossPay({
									paymentUrl: payParams.transaction_id,
									success: function(res) {

										that.afterPayment('支付成功')
									},
									fail: function(res) {
										that.isviewValue = JSON.stringify(res)
										that.afterPayment('支付失败')
									},
								});
							} else {
								that.afterPayment('支付失败')
							}

						} else if (code == 'money') {
							that.afterPayment('支付成功')
						} else {
							that.afterPayment('无效的支付方式')
						};
					} else {
						that.afterPayment('支付接口错误')
					};
				});

			}
		}
	};
</script>
<style>
	/* pages/payment/payment.wxss */
	/*支付页面开始*/
	/* .pubPaypage .info_list{ overflow:hidden; background:#fff; position:relative; padding:24rpx 30rpx; font-size:28rpx; line-height:40rpx; border-bottom:2rpx solid #e6e6e6;}
.pubPaypage .info_list:last-child{ border-bottom:0rpx;}
.pubPaypage .info_list .bt{ color:#666;}
.pubPaypage .info_list .price{ font-weight:bold; font-size:36rpx; color:#ff797c;} */
	.pubPaypage .info_box {
		padding: 60rpx 0;
		text-align: center;
		background: #fff;
	}

	.pubPaypage .info_box .price {
		font-size: 72rpx;
		line-height: 84rpx;
	}

	.pubPaypage .info_box .time {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #666;
	}

	.pubPaypage .pay_way .title {
		font-size: 24rpx;
		color: #666;
		line-height: 40rpx;
		font-weight: normal;
		padding: 16rpx 24rpx;
	}

	.pubPaypage .pay_way .list {
		background: #fff;
		padding: 0 48rpx;
		position: relative;
	}

	.pubPaypage .pay_way .list label {
		display: block;
		overflow: hidden;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
		position: relative;
	}

	.pubPaypage .pay_way .list label radio {
		position: absolute;
		right: -12rpx;
		top: 16rpx;
		opacity: 0;
	}

	.pubPaypage .pay_way .list label switch {
		position: absolute;
		right: -12rpx;
		top: 12rpx;
		opacity: 0;
	}

	.pubPaypage .pay_way .list label:last-child {
		border-bottom: 0;
	}

	.pubPaypage .pay_way .list .ico {
		width: 40rpx;
		height: 40rpx;
		float: left;
		margin-right: 20rpx;
	}

	.pubPaypage .pay_way .list .select_ico {
		width: 40rpx;
		height: 40rpx;
		float: right;
	}

	.pubPaypage .pay_way .list .txt {
		float: left;
		font-size: 32rpx;
		line-height: 40rpx;
		color: #666;
	}

	.pubPaypage .pay_way .list .txt text {
		font-size: 24rpx;
		color: #999;
	}

	.pubPaypage .pay_way .list wx-radio {
		display: block;
		float: right;
		margin-top: 7rpx;
		background: #fff;
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
		padding: 30rpx 30rpx;
		background: #fff;
	}

	.pubPaypage .btn_box .long_btn {
		display: block;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #FF725C;
		border-radius: 8rpx;
		font-size: 32rpx;
		color: #fff;
		border: 0;
	}

	.no_btn_box {
		display: block;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #eee;
		border-radius: 8rpx;
		font-size: 32rpx;
		color: #fff;
		border: 0;
	}

	/*支付页面结束*/
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwRkpZajQ3JTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixTQUFTO0FBQ1Q7OzttRkFHbUY7QUFDbkYsc0JBQXNCLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDO0FBQzdFLDZCQUE2QixnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQztBQUNsRSw0QkFBNEIsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxDQUFDO0FBQzlFLDRCQUE0QixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7QUFDekgsNEJBQTRCLGVBQWUsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUM7QUFDakYsa0NBQWtDLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGdDQUFnQyxFQUFFLGtCQUFrQixDQUFDO0FBQ3hJLHVDQUF1QyxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQztBQUNqRyx3Q0FBd0Msa0JBQWtCLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUM7QUFDbEcsNkNBQTZDLGVBQWUsQ0FBQztBQUM3RCxpQ0FBaUMsV0FBVyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUM7QUFDM0Ysd0NBQXdDLFdBQVcsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDO0FBQy9FLGlDQUFpQyxVQUFVLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixFQUFFLFVBQVUsQ0FBQztBQUM1RixxQ0FBcUMsZUFBZSxFQUFFLFVBQVUsQ0FBQztBQUNqRSxxQ0FBcUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUM7QUFDakcsbUNBQW1DLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDL0QsZ0NBQWdDLGtCQUFrQixDQUFDO0FBQ25ELGlDQUFpQyxnQkFBZ0IsQ0FBQztBQUNsRCxvQ0FBb0MsV0FBVyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLDBCQUEwQixFQUFFLG1CQUFtQixDQUFDO0FBQ3JMLGtDQUFrQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQztBQUMxSSxzQkFBc0IsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUM7QUFDNUQsZ0NBQWdDLGFBQWEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDOztBQUU3TCxTQUFTIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHBhZ2VzL3BheW1lbnQvcGF5bWVudC53eHNzICovXHJcbi8q5pSv5LuY6aG16Z2i5byA5aeLKi9cclxuLyogLnB1YlBheXBhZ2UgLmluZm9fbGlzdHsgb3ZlcmZsb3c6aGlkZGVuOyBiYWNrZ3JvdW5kOiNmZmY7IHBvc2l0aW9uOnJlbGF0aXZlOyBwYWRkaW5nOjI0cnB4IDMwcnB4OyBmb250LXNpemU6MjhycHg7IGxpbmUtaGVpZ2h0OjQwcnB4OyBib3JkZXItYm90dG9tOjJycHggc29saWQgI2U2ZTZlNjt9XHJcbi5wdWJQYXlwYWdlIC5pbmZvX2xpc3Q6bGFzdC1jaGlsZHsgYm9yZGVyLWJvdHRvbTowcnB4O31cclxuLnB1YlBheXBhZ2UgLmluZm9fbGlzdCAuYnR7IGNvbG9yOiM2NjY7fVxyXG4ucHViUGF5cGFnZSAuaW5mb19saXN0IC5wcmljZXsgZm9udC13ZWlnaHQ6Ym9sZDsgZm9udC1zaXplOjM2cnB4OyBjb2xvcjojZmY2NjAwO30gKi9cclxuLnB1YlBheXBhZ2UgLmluZm9fYm94e3BhZGRpbmc6IDYwcnB4IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgYmFja2dyb3VuZDogI2ZmZjt9XHJcbi5wdWJQYXlwYWdlIC5pbmZvX2JveCAucHJpY2V7Zm9udC1zaXplOiA3MnJweDsgbGluZS1oZWlnaHQ6IDg0cnB4O31cclxuLnB1YlBheXBhZ2UgLmluZm9fYm94IC50aW1le2ZvbnQtc2l6ZTogMjhycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgY29sb3I6ICM2NjY7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAudGl0bGV7Zm9udC1zaXplOiAyNHJweDsgY29sb3I6ICM2NjY7IGxpbmUtaGVpZ2h0OiA0MHJweDsgZm9udC13ZWlnaHQ6IG5vcm1hbDsgcGFkZGluZzogMTZycHggMjRycHg7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdHsgYmFja2dyb3VuZDojZmZmOyBwYWRkaW5nOjAgNDhycHg7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IGxhYmVseyBkaXNwbGF5OmJsb2NrOyBvdmVyZmxvdzpoaWRkZW47IHBhZGRpbmc6MzBycHggMDsgYm9yZGVyLWJvdHRvbToycnB4IHNvbGlkICNmNWY1ZjU7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IGxhYmVsIHJhZGlve3Bvc2l0aW9uOiBhYnNvbHV0ZTsgcmlnaHQ6IC0xMnJweDsgdG9wOiAxNnJweDsgb3BhY2l0eTogMDt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IGxhYmVsIHN3aXRjaHtwb3NpdGlvbjogYWJzb2x1dGU7IHJpZ2h0OiAtMTJycHg7IHRvcDogMTJycHg7IG9wYWNpdHk6IDA7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCBsYWJlbDpsYXN0LWNoaWxkeyBib3JkZXItYm90dG9tOjA7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCAuaWNveyB3aWR0aDo0MHJweDsgaGVpZ2h0OjQwcnB4OyBmbG9hdDpsZWZ0OyBtYXJnaW4tcmlnaHQ6MjBycHg7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCAuc2VsZWN0X2ljb3sgd2lkdGg6NDBycHg7IGhlaWdodDo0MHJweDsgZmxvYXQ6cmlnaHQ7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCAudHh0eyBmbG9hdDpsZWZ0OyBmb250LXNpemU6MzJycHg7IGxpbmUtaGVpZ2h0OjQwcnB4OyBjb2xvcjojNjY2O31cclxuLnB1YlBheXBhZ2UgLnBheV93YXkgLmxpc3QgLnR4dCB0ZXh0e2ZvbnQtc2l6ZToyNHJweDsgY29sb3I6Izk5OTt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IHd4LXJhZGlveyBkaXNwbGF5OmJsb2NrO2Zsb2F0OnJpZ2h0O21hcmdpbi10b3A6N3JweDsgYmFja2dyb3VuZDogI2ZmZjt9XHJcbi5wdWJQYXlwYWdlIC5wYXlfd2F5IC5saXN0IHN3aXRjaCB7ZmxvYXQ6cmlnaHQ7bWFyZ2luLXRvcDo3cnB4O31cclxuLnB1YlBheXBhZ2UgLnBheV93YXkgLmxpc3QgLmJpZ3tsaW5lLWhlaWdodDogMzBycHg7fVxyXG4ucHViUGF5cGFnZSAucGF5X3dheSAubGlzdCAubWluIHtmb250LXNpemU6IDI0cnB4O31cclxuLnB1YlBheXBhZ2UgLnBheV93YXkgLmxpc3QgLmRpc2FibGV7ZmxvYXQ6cmlnaHQ7bWFyZ2luLXRvcDo3cnB4OyB3aWR0aDogNDRycHg7IGhlaWdodDo0NHJweDtib3JkZXItcmFkaXVzOiAxMDAlOyBiYWNrZ3JvdW5kOiAjZmFmYWZhO2JvcmRlcjogMnJweCBzb2xpZCAjZTZlNmU2OyBtYXJnaW4tcmlnaHQ6IDEwcnB4O31cclxuLnB1YlBheXBhZ2UgLnBheV93YXkgLmxpc3QgLm1hc2sge3Bvc2l0aW9uOiBhYnNvbHV0ZTtsZWZ0OiAwOyB0b3A6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7YmFja2dyb3VuZDogIzY2Njsgb3BhY2l0eTogMDsgei1pbmRleDogMTA7fSBcclxuLnB1YlBheXBhZ2UgLmJ0bl9ib3h7IHBhZGRpbmc6MzBycHggMzBycHg7IGJhY2tncm91bmQ6ICNmZmY7fVxyXG4ucHViUGF5cGFnZSAuYnRuX2JveCAubG9uZ19idG57IGRpc3BsYXk6YmxvY2s7IHdpZHRoOjEwMCU7IGhlaWdodDo4MHJweDsgbGluZS1oZWlnaHQ6ODBycHg7IHRleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6ICNGRjcyNUM7Ym9yZGVyLXJhZGl1czogOHJweDsgZm9udC1zaXplOjMycnB4OyBjb2xvcjojZmZmOyBib3JkZXI6MDt9XHJcblxyXG4vKuaUr+S7mOmhtemdoue7k+adnyovIl19 */
</style>