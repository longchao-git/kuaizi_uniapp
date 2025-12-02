<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
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
					that.orderAmount = Number(res.data.order.amount)
					that.money = Number(res.data.money);
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
						this.code = 'alipay_mini';
						this.payAmount = payAmount;
						this.zhifuitems = [{
							ico: "/static/image/icon_alipay.png",
							name: '支付宝支付',
							code: 'alipay_mini',
							checked: 'true'
						}];
						// #endif 
						// #ifdef  H5
						this.code = 'yaband';
						this.payAmount = payAmount;
						this.zhifuitems = [{
							ico: "/static/image/payWay013x.png",
							name: 'H5支付',
							code: 'yaband',
							checked: 'true'
						}];
						// #endif 
						// #ifdef MP-WEIXIN
						this.code = 'yaband';
						this.payAmount = payAmount;
						this.zhifuitems = [{
							ico: "/static/image/icon_wechatPay3x.png",
							name: '微信支付',
							code: 'yaband',
							checked: 'true'
						}];
						// #endif 

					} else {
						this.code = 'money';
						this.use_money = 1;
						this.payAmount = 0;

						// #ifdef  MP-ALIPAY
						this.zhifuitems = [{
							ico: "/static/image/icon_moneyPay3x.png",
							name: '余额支付',
							code: 'money',
							checked: 'false'
						}, {
							ico: "/static/image/icon_alipay.png",
							name: '支付宝支付',
							code: 'alipay_mini',
							checked: 'false'
						}];
						// #endif
						// #ifdef  H5
						this.zhifuitems = [{
							ico: "/static/image/icon_moneyPay3x.png",
							name: '余额支付',
							code: 'money',
							checked: 'false'
						}, {
							ico: "/static/image/icon_wechatPay3x.png",
							name: 'H5支付',
							code: 'yaband',
							checked: 'false'
						}];
						// #endif
						// #ifdef MP-WEIXIN 
						this.zhifuitems = [{
							ico: "/static/image/icon_moneyPay3x.png",
							name: '余额支付',
							code: 'money',
							checked: 'false'
						}, {
							ico: "/static/image/icon_wechatPay3x.png",
							name: '微信支付',
							code: 'yaband',
							checked: 'false'
						}];
						// #endif 
					};
					if (this.isType != 1) {
						app.globalData.ordersDetail({
							"order_id": order_id
						}, function(res) {
							if (res.error == '0') that.setLastPayTime(Number(res.data.detail.pay_ltime) * 60);
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
				this.yuePay = e.detail.value;
				this.calculate();
			},
			radioChange: function(e) {
				console.log(e.detail.value);
				var zhifuitems = this.zhifuitems;
				this.code = e.detail.value;

				for (var i in zhifuitems) {
					zhifuitems[i].checked = "false";

					if (zhifuitems[i].code == e.detail.value) {
						zhifuitems[i].checked = "true";
					};
				}

				this.zhifuitems = zhifuitems;
				this.calculate();
			},

			//计算余额全抵扣还是部分抵扣；
			calculate() {
				var code = this.code,
					yuePay = this.yuePay,
					payAmount = this.payAmount;

				if (yuePay) {
					this.use_money = 1
					this.code = 'yaband'
				} else {
					if (code == 'money') {
						this.use_money = 1;
					}
					// #ifdef MP-WEIXIN
					else if (code == 'yaband') {
						this.use_money = 0;
					}
					// #endif
					// #ifdef MP-ALIPAY
					else if (code == 'alipay_mini') {
						this.use_money = 0;
					}
					// #endif

				}
			},


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
						that.LastPayTime = that.formatTime(time);
					} else {
						that.LastPayTime = "支付剩余00分00秒";
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
</style>