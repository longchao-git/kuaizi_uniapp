<template>
	<view>
		<scroll-view class="inviteIndex" :scroll-y="tofaceShow || ruleShow ? false : true">
			<view class="bannerBox">
				<image class="banner" :src="info.background" mode="widthFix"></image>
				<view class="banner_nr">
					<view class="txt">邀请好友送实惠，您得<text>{{info.cfg.inviter_money}}</text>€红包</view>
					<view class="txt">TA得<text>{{info.cfg.invitee_money}}</text>€红包</view>
				</view>
				<view class="rule" @tap="tapRule">规则<image class="ico" src="/static/image/icon-arrowR-white2x.png">
					</image>
				</view>
			</view>
			<view class="btn_box">
				<image class="btn" mode="widthFix" :src="info.share_btn1" @tap="toface"></image>
				<button open-type="share" class="soNItpmsa">
					<image class="btn" mode="widthFix" :src="info.share_btn2"></image>
				</button>
			</view>
			<view class="inviteFriends_chengjiu">
				<view class="tit">我的成就<view class="fr txt">查看明细<image class="ico"
							src="/static/image/icon-arrowR-gray2x.png">
						</image>
					</view>
				</view>
				<ul>
					<li>
						<view><text>{{info.invite_data.invite_money}}</text>€</view>
						<view class="small">已获红包</view>
					</li>
					<li>
						<view><text>{{info.invite_data.invite_ing}}</text>份</view>
						<view class="small">红包在路上</view>
					</li>
					<li>
						<view><text>{{info.invite_data.invite_count}}</text>人</view>
						<view class="small">已成功邀请</view>
					</li>
				</ul>
				<view class="clear"></view>
			</view>

		</scroll-view>

		<!--规则-开始-->
		<view class="ruleMask" :hidden="!ruleShow" @tap="tapRule">
			<view class="cont">
				<view class="nr" @tap.stop="maopao">
					<view class="tit">活动规则</view>
					<view class="txt">{{info.cfg.intro_format}}</view>
				</view>
				<image src="/static/image/btn_close3x.png" class="close" @tap.stop="tapRule"></image>
			</view>
		</view>
		<!--规则-结束-->
		<!--面对面邀请码-开始-->
		<view class="faceTofaceMask" :hidden="!tofaceShow" @tap="toface">
			<view class="cont" @tap.stop="maopao">
				<canvas style="width: 600rpx; height:600rpx;" canvas-id="qrcCanvas"></canvas>
				<view class="txt">扫一扫，下载体验</view>
			</view>
		</view>
		<!--面对面邀请码-结束-->
	</view>
</template>

<script>
	var app = getApp();
	var QR = require("../../../utils/qrcode.js");

	export default {
		data() {
			return {
				info: {
					background: "",
					cfg: "",
					share_btn1: "",
					share_btn2: "",
					invite_data: ""
				},
				tofaceShow: false,
				ruleShow: false,
				pid: ''
			};
		},

		components: {},
		props: {},
		onShow: function() {
			var that = this;
			app.globalData.invite({}, function(res) {
				if (res.error == "0") {
					that.pid = res.data.pid;
					that.info = res.data;
					let _qrcode = that.info.share_url;

					let _canvasSize = that.setCanvasSize();

					that.createQrcode(_qrcode, "qrcCanvas", _canvasSize.w, _canvasSize.h);
				}
			});
		},



		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(res) {
			return {
				title: '邀请好友',
				path: "/subPages/invite/share/share?pid=" + this.pid
			};
		},
		methods: {
			// 适配不同屏幕大小的canvas
			setCanvasSize: function() {
				var size = {};

				try {
					var res = uni.getSystemInfoSync();
					var scale = 500 / 400; //不同屏幕下canvas的适配比例；设计稿是750宽

					var width = res.windowWidth / scale;
					var height = width; //canvas画布为正方形

					size.w = width;
					size.h = height;
				} catch (e) {
					// Do something when catch error
					console.log("获取设备信息失败" + e);
				}

				return size;
			},

			// 生成二维码
			createQrcode(str, canvasId, w, h) {
				//调用插件中的draw方法，绘制二维码图片  
				QR.api.draw(str, canvasId, w, h);
			},

			toface() {
				this.tofaceShow = !this.tofaceShow;
			},

			//规则说明
			tapRule() {
				this.ruleShow = !this.ruleShow;
			},

			maopao() {}

		}
	};
</script>
<style>
	.inviteIndex {
		height: 100%;
		background: #ffc156;
		padding-bottom: 20rpx;
		box-sizing: border-box;
	}

	.inviteIndex .bannerBox {
		position: relative;
	}

	.inviteIndex .banner {
		position: relative;
		z-index: 0;
		width: 100%;
	}

	.inviteIndex .banner_nr {
		position: absolute;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		color: #fff;
	}

	.inviteIndex .banner_nr .txt {
		font-size: 40rpx;
		line-height: 60rpx;
		font-family: SimHei;
		text-align: center;
		margin-top: 16rpx;
	}

	.inviteIndex .banner_nr .txt big {
		font-size: 90rpx;
		color: #fff000;
	}

	.inviteIndex .rule {
		position: absolute;
		z-index: 1;
		right: 0;
		top: 20%;
		width: 96rpx;
		height: 44rpx;
		line-height: 44rpx;
		background: rgba(0, 0, 0, .1);
		color: #fefefe;
		text-align: center;
		border-radius: 40rpx 0 0 40rpx;
	}

	.inviteIndex .rule .ico {
		width: 10rpx;
		height: 18rpx;
		margin-left: 6rpx;
	}

	.inviteIndex .btn_box {
		text-align: center;
		padding: 20rpx 0 10rpx;
		display: flex;
	}
	.soNItpmsa{
		flex: 1;
		margin: 0 16rpx;
		position: relative;
		margin: 0 !important;
		padding: 0 !important;
		background: transparent !important;
	}
	.soNItpmsa .btn {
		width: 100%;
		margin: 0 !important;
		position: relative;
	}
	.inviteIndex .btn_box .btn {
		flex: 1;
		margin: 0 16rpx;
		position: relative;
	}

	.inviteIndex .btn_box .btn button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.inviteFriends_chengjiu,
	.inviteFriends_rankingList {
		margin: 36rpx 30rpx;
		background: #fff;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.inviteFriends_chengjiu .tit {
		line-height: 72rpx;
		background: #f9fafa;
		font-size: 30rpx;
		padding: 0 12rpx;
	}

	.inviteFriends_chengjiu .tit .txt {
		font-size: 24rpx;
		color: #999;
	}

	.inviteFriends_chengjiu .tit .ico {
		width: 12rpx;
		height: 20rpx;
		margin-left: 10rpx;
	}

	.inviteFriends_chengjiu li {
		float: left;
		width: 33.3333%;
		text-align: center;
		padding: 20rpx 0;
		position: relative;
		display: block;
	}

	.inviteFriends_chengjiu li:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		margin-top: -38rpx;
		width: 2rpx;
		height: 76rpx;
		background: #f3f3f3;
	}

	.inviteFriends_chengjiu li:first-child:before {
		display: none;
	}

	.inviteFriends_chengjiu li>view {
		color: #ff3000;
		height: 60rpx;
		line-height: 60rpx;
	}

	.inviteFriends_chengjiu li>view big {
		font-size: 48rpx;
	}

	.inviteFriends_chengjiu li .small {
		color: #999;
		line-height: 36rpx;
	}

	.inviteFriends_rankingList .tit {
		line-height: 72rpx;
		font-size: 30rpx;
		padding: 0 12rpx;
	}

	.inviteFriends_rankingList table tr {
		display: flex;
		align-items: center;
		border-bottom: 2rpx dashed #e6e6e6;
	}

	.inviteFriends_rankingList table tr.bg1 {
		background: #ffe9e9;
	}

	.inviteFriends_rankingList table tr.bg2 {
		background: #ffefef;
	}

	.inviteFriends_rankingList table tr.bg3 {
		background: #fff7f7;
	}

	.inviteFriends_rankingList table tr th {
		background: #f2f2f2;
		line-height: 64rpx;
		font-size: 26rpx;
		font-weight: normal;
		flex: 1;
		text-align: center;
	}

	.inviteFriends_rankingList table tr td {
		line-height: 70rpx;
		text-align: center;
		color: #666;
		flex: 1;
	}

	.inviteFriends_rankingList table tr.bg td {
		color: #ff0000;
	}

	.inviteFriends_rankingList table tr:first-child {
		border-bottom: 0;
	}

	.inviteFriends_rankingList table tr:last-child {
		border-bottom: 0;
	}

	.inviteFriends_rankingList table td .ico {
		vertical-align: middle;
		position: relative;
	}

	.inviteFriends_rankingList table tr td .ico1 {
		width: 42rpx;
		height: 42rpx;
	}

	.inviteFriends_rankingList table tr td .ico1 text {
		position: absolute;
		left: 11rpx;
		top: 6rpx;
		font-size: 22rpx;
		line-height: 40rpx;
	}

	.inviteFriends_rankingList table tr td .ico2 {
		width: 38rpx;
		height: 38rpx;
		line-height: 38rpx;
		margin-left: -6rpx;
	}

	.inviteFriends_rankingList table tr td .ico2 text {
		position: absolute;
		left: 0;
		top: 0;
		font-size: 22rpx;
		color: #fff;
		width: 100%;
		text-align: center;
	}

	.faceTofaceMask {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	.faceTofaceMask .cont {
		position: absolute;
		left: 50%;
		top: 50%;
		background: #fff;
		transform: translate(-50%, -50%);
		border-radius: 6rpx;
		overflow: hidden;
	}

	.faceTofaceMask .cont .txt {
		font-size: 28rpx;
		margin-top: 30rpx;
		border-top: 2rpx solid #7ec6ec;
		height: 80rpx;
		line-height: 80rpx;
		color: #1296db;
		text-align: center;
	}

	.ruleMask {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	.ruleMask .cont {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 75%;
	}

	.ruleMask .cont .tit {
		line-height: 44rpx;
		font-size: 28rpx;
		text-align: center;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.ruleMask .cont .txt {
		line-height: 40rpx;
		font-size: 26rpx;
	}

	.ruleMask .cont .nr {
		background: #fff;
		border-radius: 6rpx;
		padding: 30rpx 40rpx 40rpx;
		word-wrap: break-word;
		word-break: normal;
	}

	.ruleMask .cont .close {
		width: 60rpx;
		height: 60rpx;
		display: block;
		margin: 40rpx auto 0;
	}
</style>