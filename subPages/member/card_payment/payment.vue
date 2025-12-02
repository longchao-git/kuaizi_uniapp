<template>
	<view>
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
			this.title = e.title
			this.amount = e.amount
			this.card_id = e.card_id
			let payAmount = 0

		},

		onShow: function() {
			var that = this;
			app.globalData.mineInfo({}, function(res) {
				//  console.log(res);
				if (res.error == '0') {
					that.money = res.data.money;
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
				this.yuePay = e.detail.value;
				this.calculate();
			},

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
						that.payAmount = otherPay
						that.code = 'yaband'
						that.disable = true;
					} else {
						//余额抵扣；
						that.payAmount = 0
						that.code = 'money'
						that.disable = false
					}

					;
				} else {
					that.code = 'yaband'
					that.payAmount = 0
					that.disable = true
				}
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
</style>