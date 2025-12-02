<template>
	<view>
		<!--<import src="../../.wxml"></import>-->
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

		<view class="mineMoney_recharge">
			<view class="title">充值金额</view>
			<view class="list_box mb20">
				<view v-for="(item, index) in lists" :key="index" :class="'price_list ' + (index == liIdx ? 'on' : '')"
					@tap.stop="select" :data-obj="item" :data-idx="index">
					<view class="num">{{item.chong}}</view>
					<view class="txt">送{{item.song}}€红包</view>
				</view>
				<view :class="'price_list custom ' + (customShow ? 'on' : '')" @tap.stop="tapCustom">
					<view class="txt">自定义</view>
				</view>
				<view class="clear"></view>
				<input placeholder="请输入充值金额（不小于1€）" type="number" class="inp" :hidden="!customShow" @input="tapAmount">
			</view>

			<view class="title">充值方式</view>
			<view class="pay_way">
				<radio-group class="radio-group">
					<label v-for="(item, index) in zhifuitems" :key="index" class="list">
						<image :src="item.ico"></image>
						<view class="txt">{{item.name}}</view>
						<radio name="code" :value="item.code" :checked="item.checked"></radio>
					</label>
				</radio-group>
			</view>
			<view class="btn_box">
				<button class="long_btn" @tap="payMoney">立即充值</button>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var amount = ''; //充值金额

	export default {
		data() {
			return {
				zhifuitems: [{
					ico: "/static/image/payWay023x.png",
					name: '微信支付',
					code: 'yaband',
					checked: 'true'
				}],
				lists: [],
				liIdx: 0,
				customShow: false,
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onShow: function() {
			var that = this;
			app.globalData.moneyRecharge({}, function(res) {
				if (res.error == "0") {
					that.lists = res.data.items;

					if (res.data.items && res.data.items.length > 0) {
						amount = res.data.items[0].chong;
					}
				}

				;
			});
		},
		methods: {
			//选择
			select(e) {
				var obj = e.currentTarget.dataset.obj;

				if (obj && obj.chong) {
					amount = obj.chong;
				}

				this.liIdx = e.currentTarget.dataset.idx
				this.customShow = false

			},

			//自定义
			tapCustom() {
				amount = '';
				this.liIdx = null
				this.customShow = true
			},

			tapAmount(e) {
				amount = e.detail.value;
			},

			//充值
			payMoney() {
				var that = this; // console.log(amount);

				app.globalData.moneyPay({
					"code": 'yaband',
					"amount": amount
				}, function(res) {
					if (res.error == "0") {
						var aa = res.data.jsApiParameters;
						uni.requestPayment({
							'timeStamp': aa.timeStamp,
							'nonceStr': aa.nonceStr,
							'package': aa.package,
							'signType': aa.signType,
							'paySign': aa.paySign,
							success: function(res) {
								uni.showToast({
									title: '支付成功'
								});
								setTimeout(function() {
									app.globalData.topage(1, "back");
								}, 1200);
							},
							fail: function(res) {
								uni.showToast({
									title: '支付失败,请重新支付'
								});
							}
						});
					}

					;
				});
			}

		}
	};
</script>