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
		<view class="inviteShare">
			<image class="banner" mode="widthFix" :src="banner"></image>
			<view class="formBox" v-if="!getRed">
				<image class="pic" mode="aspectFill" :src="info.member.face"></image>
				<view class="name">{{info.member.nickname}}</view>
				<view class="txt">hi，送给你<text>€{{info.total_money}}</text>的大红包，赶紧去领取吧！</view>
				<input placeholder="请输入手机号" @input="getMobile">
				<view class="btn" @tap="tapReceive">立即领取</view>
			</view>
			<view class="redLists" v-if="getRed">
				<view v-for="(item, index) in hongbaos" :key="index" class="list">
					<view class="pub_list">
						<view class="price"><span>€</span>{{item.amount}}</view>
						<view class="pub_list_bd">
							<view class="tit">{{item.title}}</view>
							<span>有效期至：{{item.time}}</span>
						</view>
						<view class="btn" @tap="toHome">立即使用</view>
					</view>
					<view class="foot">满€{{item.min_amount}}可用</view>
				</view>
				<view class="btn_box">
					<view>红包已放入账号：<text>{{info2.member.mobile}}</text></view>
					<view class="btn" @tap="toHome">去首页</view>
				</view>
			</view>
			<view class="rule">
				<view class="tit"><text>活动规则</text></view>
				<view class="txt">{{inviteCfg.intro}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var pid, mobile;

	export default {
		data() {
			return {
				info: {
					member: "",
					total_money: ""
				},
				info2: {
					member: ""
				},
				banner: "",
				getRed: false,
				hongbaos: [],
				inviteCfg: {
					intro: ""
				},
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
			pid = options.pid; //发起分享用户id；
			// pid = "M00456"; 
		},
		onShow: function() {
			var that = this;
			uni.getStorage({
				key: "inviteUid",
				success: function(rs) {
					that.getRed = true;
					app.globalData.invitePage({
						"uid": rs.data
					}, function(ret) {
						if (ret.error == "0") {
							if (ret.data.hongbaos.length > 0) {
								for (var i in ret.data.hongbaos) {
									ret.data.hongbaos[i].time = that.toDate(ret.data.hongbaos[i]
										.ltime);
								}

								;
							};
							that.info2 = ret.data
							that.banner = ret.data.background
							that.inviteCfg = ret.data.invite_cfg
							that.hongbaos = ret.data.hongbaos
						}

						;
					});
				},
				fail: function() {
					that.getRed = false;
					app.globalData.invitePage2({
						"pid": pid
					}, function(res) {
						if (res.error == "0") {
							that.info = res.data
							that.banner = res.data.background
							that.inviteCfg = res.data.inviteCfg;
						}

						;
					});
				}
			});
		},
		methods: {
			//获取手机号
			getMobile(e) {
				mobile = e.detail.value;
			},

			tapReceive() {
				var that = this;
				app.globalData.tapInvite({
					"pid": pid,
					"mobile": mobile
				}, function(res) {
					uni.showToast({
						title: res.message
					});

					if (res.error == "0") {
						that.getRed = true;
						uni.setStorage({
							key: "inviteUid",
							data: res.uid
						});
						app.globalData.invitePage({
							"uid": res.uid
						}, function(ret) {
							if (ret.error == "0") {
								if (ret.data.hongbaos.length > 0) {
									for (var i in ret.data.hongbaos) {
										ret.data.items[i].time = that.toDate(ret.data.items[i].ltime);
									}
								}
								that.info2 = ret.data,
									that.hongbaos = ret.data.hongbaos;
							}

							;
						});
					}

					;
				});
			},

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
			},

			//去首页
			toHome() {
				uni.removeStorage({
					key: "inviteUid",
					success: function(res) {
						app.globalData.topage("/pages/index/index", "tab");
					}
				});
			}

		}
	};
</script>
<style>
	.inviteShare {
		min-height: 100%;
		background: #ff9a4a;
	}

	.inviteShare .banner {
		width: 100%;
	}

	.inviteShare .formBox {
		background: #fff;
		margin: 0 24rpx;
		border-radius: 8rpx;
		padding: 24rpx;
		text-align: center;
	}

	.inviteShare .formBox .pic {
		width: 140rpx;
		height: 140rpx;
		border-radius: 100%;
		background-color: #eee;
	}

	.inviteShare .formBox .name {
		font-size: 36rpx;
		line-height: 44rpx;
		margin: 4rpx 0 20rpx;
	}

	.inviteShare .formBox .txt {
		font-size: 32rpx;
		line-height: 40rpx;
		color: #555;
	}

	.inviteShare .formBox input {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 6rpx;
		font-size: 30rpx;
		background: #f4f4f4;
		margin: 40rpx 0;
	}

	.inviteShare .formBox .btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 6rpx;
		font-size: 30rpx;
		background: #ff3000;
		color: #fff;
	}

	.inviteShare .redLists {
		background: #ffd9a1;
		padding: 24rpx;
		border-radius: 8rpx;
		margin: 24rpx;
	}

	.inviteShare .redLists .list {
		background: #fff;
		border-radius: 6rpx;
		margin-bottom: 30rpx;
	}

	.inviteShare .redLists .list .pub_list {
		padding: 24rpx 0;
	}

	.inviteShare .redLists .list .price {
		color: #ff3000;
		font-size: 40rpx;
		padding: 0 20rpx;
	}

	.inviteShare .redLists .list .price small {
		font-size: 24rpx;
	}

	.inviteShare .redLists .list .pub_list_bd .tit {
		font-size: 34rpx;
		color: #444;
		line-height: 40rpx;
		margin-bottom: 8rpx;
	}

	.inviteShare .redLists .list .pub_list_bd small {
		font-size: 24rpx;
		color: #999;
		line-height: 36rpx;
	}

	.inviteShare .redLists .list .btn {
		font-size: 22rpx;
		color: #fff;
		line-height: 50rpx;
		background: #ff7700;
		border-radius: 80rpx;
		text-align: center;
		width: 120rpx;
		box-shadow: 0 2rpx 8rpx #ffc99a;
		margin: 0 20rpx;
	}

	.inviteShare .redLists .list .foot {
		font-size: 24rpx;
		color: #999;
		line-height: 36rpx;
		border-top: 2rpx dashed #ffd9a1;
		padding: 4rpx 20rpx;
		position: relative;
	}

	.inviteShare .redLists .list .foot:before {
		content: '';
		width: 12rpx;
		height: 12rpx;
		background: #ffd9a1;
		position: absolute;
		left: -6rpx;
		top: -6rpx;
		border-radius: 100%;
	}

	.inviteShare .redLists .list .foot:after {
		content: '';
		width: 12rpx;
		height: 12rpx;
		background: #ffd9a1;
		position: absolute;
		right: -6rpx;
		top: -6rpx;
		border-radius: 100%;
	}

	.inviteShare .redLists .btn_box {
		text-align: center;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #f60;
	}

	.inviteShare .redLists .btn_box text {
		color: #ff4200;
	}

	.inviteShare .redLists .btn_box .btn {
		margin: 0 60rpx;
		height: 72rpx;
		line-height: 72rpx;
		font-size: 32rpx;
		color: #fff;
		background: #ff7700;
		border-radius: 6rpx;
		margin-top: 20rpx;
	}

	.inviteShare .rule {
		padding: 24rpx;
	}

	.inviteShare .rule .tit {
		color: #fff;
		font-size: 32rpx;
		line-height: 40rpx;
		text-align: center;
		margin: 0 0 20rpx;
	}

	.inviteShare .tit text {
		position: relative;
	}

	.inviteShare .tit text:before,
	.inviteShare .tit text:after {
		content: '';
		width: 80rpx;
		height: 2rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		opacity: 0.5;
	}

	.inviteShare .tit text:before {
		left: -120rpx;
	}

	.inviteShare .tit text:after {
		right: -120rpx;
	}

	.inviteShare .txt {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #fff;
	}
</style>