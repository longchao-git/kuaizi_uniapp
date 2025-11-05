<template>
	<view>
		<!--<import src="../../components/showToast.wxml"></import>-->
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
					that.setData({
						getRed: true
					});
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
							}

							;
							that.setData({
								info2: ret.data,
								banner: ret.data.background,
								inviteCfg: ret.data.invite_cfg,
								hongbaos: ret.data.hongbaos
							});
						}

						;
					});
				},
				fail: function() {
					that.setData({
						getRed: false
					});
					app.globalData.invitePage2({
						"pid": pid
					}, function(res) {
						if (res.error == "0") {
							that.setData({
								info: res.data,
								banner: res.data.background,
								inviteCfg: res.data.inviteCfg
							});
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
						that.setData({
							getRed: true
						});
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

									;
								}

								;
								that.setData({
									info2: ret.data,
									hongbaos: ret.data.hongbaos
								});
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwUDM2OVQ3JTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWEsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7QUFDbkQscUJBQXFCLFdBQVcsQ0FBQztBQUNqQyxzQkFBc0IsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQztBQUNqSCwyQkFBMkIsYUFBYSxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxzQkFBc0IsQ0FBQztBQUN0Ryw0QkFBNEIsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsb0JBQW9CLENBQUM7QUFDdkYsMkJBQTJCLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQztBQUM3RSw0QkFBNEIsV0FBVyxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxlQUFlLENBQUM7QUFDeEosMkJBQTJCLFdBQVcsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxDQUFDO0FBQ25KLHVCQUF1QixtQkFBbUIsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxDQUFDO0FBQy9GLDZCQUE2QixnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQztBQUN4Rix1Q0FBdUMsZ0JBQWdCLENBQUM7QUFDeEQsb0NBQW9DLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUN2RiwwQ0FBMEMsZ0JBQWdCLENBQUM7QUFDM0QsK0NBQStDLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQztBQUN0SCxnREFBZ0QsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixDQUFDO0FBQ2xHLGtDQUFrQyxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLCtCQUErQixFQUFFLGVBQWUsQ0FBQztBQUNwTixtQ0FBbUMsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLCtCQUErQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDO0FBQy9KLDBDQUEwQyxXQUFXLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixDQUFDO0FBQzFLLHlDQUF5QyxXQUFXLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixDQUFDO0FBQzFLLGdDQUFnQyxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQUM7QUFDdEcscUNBQXFDLGNBQWMsQ0FBQztBQUNwRCxxQ0FBcUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUM7QUFDcEwsbUJBQW1CLGNBQWMsQ0FBQztBQUNsQyx3QkFBd0IsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDO0FBQ2pILHVCQUF1QixrQkFBa0IsQ0FBQztBQUMxQywyREFBMkQsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQztBQUNqSyw4QkFBOEIsYUFBYSxDQUFDO0FBQzVDLDZCQUE2QixjQUFjLENBQUM7QUFDNUMsa0JBQWtCLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaW52aXRlU2hhcmV7bWluLWhlaWdodDogMTAwJTsgYmFja2dyb3VuZDogI2ZmOWE0YTt9XHJcbi5pbnZpdGVTaGFyZSAuYmFubmVye3dpZHRoOiAxMDAlO31cclxuLmludml0ZVNoYXJlIC5mb3JtQm94e2JhY2tncm91bmQ6ICNmZmY7IG1hcmdpbjogMCAyNHJweDsgYm9yZGVyLXJhZGl1czogOHJweDsgcGFkZGluZzogMjRycHg7IHRleHQtYWxpZ246IGNlbnRlcjt9XHJcbi5pbnZpdGVTaGFyZSAuZm9ybUJveCAucGlje3dpZHRoOiAxNDBycHg7IGhlaWdodDogMTQwcnB4OyBib3JkZXItcmFkaXVzOiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO31cclxuLmludml0ZVNoYXJlIC5mb3JtQm94IC5uYW1le2ZvbnQtc2l6ZTogMzZycHg7IGxpbmUtaGVpZ2h0OiA0NHJweDsgbWFyZ2luOiA0cnB4IDAgMjBycHg7fVxyXG4uaW52aXRlU2hhcmUgLmZvcm1Cb3ggLnR4dHtmb250LXNpemU6IDMycnB4OyBsaW5lLWhlaWdodDogNDBycHg7IGNvbG9yOiAjNTU1O31cclxuLmludml0ZVNoYXJlIC5mb3JtQm94IGlucHV0e3dpZHRoOiAxMDAlOyBoZWlnaHQ6IDgwcnB4OyBsaW5lLWhlaWdodDogODBycHg7IGJvcmRlci1yYWRpdXM6IDZycHg7IGZvbnQtc2l6ZTogMzBycHg7IGJhY2tncm91bmQ6ICNmNGY0ZjQ7IG1hcmdpbjogNDBycHggMDt9XHJcbi5pbnZpdGVTaGFyZSAuZm9ybUJveCAuYnRue3dpZHRoOiAxMDAlOyBoZWlnaHQ6IDgwcnB4OyBsaW5lLWhlaWdodDogODBycHg7IGJvcmRlci1yYWRpdXM6IDZycHg7IGZvbnQtc2l6ZTogMzBycHg7IGJhY2tncm91bmQ6ICNmZjMwMDA7IGNvbG9yOiAjZmZmO31cclxuLmludml0ZVNoYXJlIC5yZWRMaXN0c3tiYWNrZ3JvdW5kOiAjZmZkOWExOyBwYWRkaW5nOiAyNHJweDsgYm9yZGVyLXJhZGl1czogOHJweDsgbWFyZ2luOiAyNHJweDt9XHJcbi5pbnZpdGVTaGFyZSAucmVkTGlzdHMgLmxpc3R7YmFja2dyb3VuZDogI2ZmZjtib3JkZXItcmFkaXVzOiA2cnB4OyBtYXJnaW4tYm90dG9tOiAzMHJweDt9XHJcbi5pbnZpdGVTaGFyZSAucmVkTGlzdHMgLmxpc3QgLnB1Yl9saXN0e3BhZGRpbmc6IDI0cnB4IDA7fVxyXG4uaW52aXRlU2hhcmUgLnJlZExpc3RzIC5saXN0IC5wcmljZXtjb2xvcjogI2ZmMzAwMDsgZm9udC1zaXplOiA0MHJweDsgcGFkZGluZzogMCAyMHJweDt9XHJcbi5pbnZpdGVTaGFyZSAucmVkTGlzdHMgLmxpc3QgLnByaWNlIHNtYWxse2ZvbnQtc2l6ZTogMjRycHg7fVxyXG4uaW52aXRlU2hhcmUgLnJlZExpc3RzIC5saXN0IC5wdWJfbGlzdF9iZCAudGl0e2ZvbnQtc2l6ZTogMzRycHg7IGNvbG9yOiAjNDQ0OyBsaW5lLWhlaWdodDogNDBycHg7IG1hcmdpbi1ib3R0b206IDhycHg7fVxyXG4uaW52aXRlU2hhcmUgLnJlZExpc3RzIC5saXN0IC5wdWJfbGlzdF9iZCBzbWFsbHtmb250LXNpemU6IDI0cnB4OyBjb2xvcjogIzk5OTsgbGluZS1oZWlnaHQ6IDM2cnB4O31cclxuLmludml0ZVNoYXJlIC5yZWRMaXN0cyAubGlzdCAuYnRue2ZvbnQtc2l6ZTogMjJycHg7IGNvbG9yOiAjZmZmOyBsaW5lLWhlaWdodDogNTBycHg7IGJhY2tncm91bmQ6ICNmZjc3MDA7IGJvcmRlci1yYWRpdXM6IDgwcnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IHdpZHRoOiAxMjBycHg7IGJveC1zaGFkb3c6IDAgMnJweCA4cnB4ICNmZmM5OWE7IG1hcmdpbjogMCAyMHJweDt9XHJcbi5pbnZpdGVTaGFyZSAucmVkTGlzdHMgLmxpc3QgLmZvb3R7Zm9udC1zaXplOiAyNHJweDsgY29sb3I6ICM5OTk7IGxpbmUtaGVpZ2h0OiAzNnJweDsgYm9yZGVyLXRvcDogMnJweCBkYXNoZWQgI2ZmZDlhMTsgcGFkZGluZzogNHJweCAyMHJweDsgcG9zaXRpb246IHJlbGF0aXZlO31cclxuLmludml0ZVNoYXJlIC5yZWRMaXN0cyAubGlzdCAuZm9vdDpiZWZvcmV7Y29udGVudDogJyc7IHdpZHRoOiAxMnJweDsgaGVpZ2h0OiAxMnJweDsgYmFja2dyb3VuZDogI2ZmZDlhMTsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAtNnJweDsgdG9wOiAtNnJweDsgYm9yZGVyLXJhZGl1czogMTAwJTt9XHJcbi5pbnZpdGVTaGFyZSAucmVkTGlzdHMgLmxpc3QgLmZvb3Q6YWZ0ZXJ7Y29udGVudDogJyc7IHdpZHRoOiAxMnJweDsgaGVpZ2h0OiAxMnJweDsgYmFja2dyb3VuZDogI2ZmZDlhMTsgcG9zaXRpb246IGFic29sdXRlOyByaWdodDogLTZycHg7IHRvcDogLTZycHg7IGJvcmRlci1yYWRpdXM6IDEwMCU7fVxyXG4uaW52aXRlU2hhcmUgLnJlZExpc3RzIC5idG5fYm94e3RleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAyOHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBjb2xvcjogI2Y2MDt9XHJcbi5pbnZpdGVTaGFyZSAucmVkTGlzdHMgLmJ0bl9ib3ggdGV4dHtjb2xvcjogI2ZmNDIwMDt9XHJcbi5pbnZpdGVTaGFyZSAucmVkTGlzdHMgLmJ0bl9ib3ggLmJ0bnttYXJnaW46IDAgNjBycHg7IGhlaWdodDogNzJycHg7IGxpbmUtaGVpZ2h0OiA3MnJweDsgZm9udC1zaXplOiAzMnJweDsgY29sb3I6ICNmZmY7IGJhY2tncm91bmQ6ICNmZjc3MDA7IGJvcmRlci1yYWRpdXM6IDZycHg7IG1hcmdpbi10b3A6IDIwcnB4O31cclxuLmludml0ZVNoYXJlIC5ydWxle3BhZGRpbmc6IDI0cnB4O31cclxuLmludml0ZVNoYXJlIC5ydWxlIC50aXR7Y29sb3I6ICNmZmY7IGZvbnQtc2l6ZTogMzJycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBtYXJnaW46IDAgMCAyMHJweDt9XHJcbi5pbnZpdGVTaGFyZSAudGl0IHRleHR7cG9zaXRpb246IHJlbGF0aXZlO31cclxuLmludml0ZVNoYXJlIC50aXQgdGV4dDpiZWZvcmUsLmludml0ZVNoYXJlIC50aXQgdGV4dDphZnRlcntjb250ZW50OiAnJzsgd2lkdGg6IDgwcnB4OyBoZWlnaHQ6IDJycHg7IGJhY2tncm91bmQ6ICNmZmY7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiA1MCU7IG9wYWNpdHk6IDAuNTt9XHJcbi5pbnZpdGVTaGFyZSAudGl0IHRleHQ6YmVmb3Jle2xlZnQ6IC0xMjBycHg7fVxyXG4uaW52aXRlU2hhcmUgLnRpdCB0ZXh0OmFmdGVye3JpZ2h0OiAtMTIwcnB4O31cclxuLmludml0ZVNoYXJlIC50eHR7Zm9udC1zaXplOiAyOHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBjb2xvcjogI2ZmZjt9Il19 */
</style>