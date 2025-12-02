<template>
	<view>
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
		<view class="mineMoney_top">
			<view class="box">
				<view class="txt">当前余额</view>
				<view class="price">€{{info.money}}</view>
			</view>
			<view class="box">
				<view class="btn" @tap.stop="toRecharge">充值</view>
				<!-- <view class='btn btn2' catchtap='tapCashShow'>申请提现</view> -->
			</view>
		</view>

		<view class="mineMoney_tit">我的余额记录</view>
		<view v-for="(item, index) in logLists" :key="index" class="mineMoney_list">
			<view class="tit">{{item.intro}}</view>
			<view>{{item.time}}</view>
			<view class="price"><text :class="item.number >= 0 ? '' : 'fontcl1'">{{item.number}}</text></view>
		</view>

		<!--提现-->
		<view class="mineMoney_cash" v-if="cashShow">
			<view class="box">
				<view class="tit">申请提现</view>
				<view class="cont">
					<textarea placeholder="请输入银行卡号或支付宝微信账号" @blur="tapIntro"></textarea>
					<input placeholder="请输入申请退款金额" @input="tapPrice">
				</view>
				<view class="btn_box">
					<view @tap.stop="tapCashShow">取消</view>
					<view class="btn2" @tap.stop="tapCashConfirm">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();

	function formatTime(strtime) {
		var publishTime = strtime,
			d_seconds,
			d_minutes,
			d_hours,
			d_days,
			timeNow = parseInt(new Date().getTime() / 1000),
			d,
			date = new Date(publishTime * 1000),
			Y = date.getFullYear(),
			M = date.getMonth() + 1,
			D = date.getDate(),
			H = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds(); //小于10的在前面补0

		if (M < 10) {
			M = '0' + M;
		}

		if (D < 10) {
			D = '0' + D;
		}

		if (H < 10) {
			H = '0' + H;
		}

		if (m < 10) {
			m = '0' + m;
		}

		if (s < 10) {
			s = '0' + s;
		}

		d = timeNow - publishTime;
		d_days = parseInt(d / 86400);
		d_hours = parseInt(d / 3600);
		d_minutes = parseInt(d / 60);
		d_seconds = parseInt(d);

		if (d_days > 5) {
			return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
		} else if (d_days > 0) {
			return d_days + '天前';
		} else if (d_days <= 0 && d_hours > 0) {
			return d_hours + '小时前';
		} else if (d_hours <= 0 && d_minutes > 0) {
			return d_minutes + '分钟前';
		} else if (d_seconds < 60) {
			if (d_seconds <= 0) {
				return '刚刚';
			} else {
				return d_seconds + '秒前';
			}
		}
	}
	var params = {
		intro: '',
		money: ''
	};

	export default {
		data() {
			return {
				page: 1,
				info: {
					money: ""
				},
				logLists: [],
				cashShow: false,
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onShow: function() {
			var that = this;
			app.globalData.moneyLog({
				"page": 1
			}, function(res) {
				if (res.error == "0") {
					var arr = res.data.items;
					arr.forEach((currentValue, index, arr) => {
						res.data.items[index].number = Number(res.data.items[index].number);
						res.data.items[index].time = formatTime(Number(res.data.items[index]
							.dateline));
					}); //   console.log(res.data.items);

					that.info = res.data
					that.logLists = res.data.items;
				}

				;
			});
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (app.globalData._CFG.double) {
				uni.showLoading({
					title: '加载中...'
				});
				app.globalData._CFG.double = false;
				var page = this.page;
				page++;
				var that = this; //数据筛选

				app.globalData.moneyLog({
					"page": page
				}, function(res) {
					if (res.error == '0') {
						if (res.data.items) {
							if (res.data.items.length == 0) {} else {
								var arr = res.data.items;
								arr.forEach((currentValue, index, arr) => {
									res.data.items[index].number = Number(res.data.items[index]
										.number);
									res.data.items[index].time = formatTime(Number(res.data.items[
										index].dateline));
								});
								that.logLists = that.logLists.concat(res.data.items)
								that.page = page
							}
						}

						setTimeout(function() {
							app.globalData._CFG.double = true;
						}, 1000);
						uni.hideLoading();
					} else {
						app.globalData.msgbox(res.message);
					}
				}); // that.getFilter();
			}
		},
		methods: {
			//提现
			tapCashShow() {
				if (this.cashShow) {
					this.cashShow = false;
				} else {
					this.cashShow = true;
				}

				;
			},

			tapIntro(e) {
				params.intro = e.detail.value;
			},

			tapPrice(e) {
				params.money = e.detail.value;
			},

			tapCashConfirm(e) {
				var that = this;
				app.globalData.moneyCash(params, function(res) {
					uni.showToast({
						title: res.message
					});
					setTimeout(function() {
						that.cashShow = false;
					}, 1200);
				});
			},

			//去充值页面
			toRecharge() {
				app.globalData.topage("/pages/ucenter/recharge/recharge");
			}

		}
	};
</script>