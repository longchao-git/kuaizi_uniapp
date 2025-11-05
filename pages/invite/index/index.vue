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
				<image class="btn" mode="widthFix" :src="info.share_btn2">
					<button open-type="share"></button>
				</image>
			</view>
			<view class="inviteFriends_chengjiu">
				<view class="tit">我的成就<view class="fr txt">查看明细<image class="ico" src="/static/image/btn_arrow_r3x.png">
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
			<!-- <view class="inviteFriends_rankingList">
        <view class="tit">邀请排行榜（Top {{info.ranks.length}}）</view>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <th>排名</th>
                    <th>用户</th>
                    <th>邀请人数(人)</th>
                    <th>已获红包(€)</th>
                </tr>
                <block wx:for="{{info.ranks}}" wx:key="index">
                    <tr class="bg bg1" wx:if="{{index == 0}}">
                        <td><image class="ico ico1" src='../../../image/inviteFriends_ico2.png'><text>{{index+1}}</text></image></td>
                        <td>{{item.member.nickname}}</td>
                        <td>{{item.invite_count}}</td>
                        <td>{{item.invite_money}}</td>
                    </tr>
                    <tr class="bg bg2" wx:elif="{{index == 1}}">
                        <td><image class="ico ico1" src='../../../image/inviteFriends_ico2.png'><text>{{index+1}}</text></image></td>
                        <td>{{item.member.nickname}}</td>
                        <td>{{item.invite_count}}</td>
                        <td>{{item.invite_money}}</td>
                    </tr>
                    <tr class="bg bg3" wx:elif="{{index == 2}}">
                        <td><image class="ico ico1" src='../../../image/inviteFriends_ico2.png'><text>{{index+1}}</text></image></td>
                        <td>{{item.member.nickname}}</td>
                        <td>{{item.invite_count}}</td>
                        <td>{{item.invite_money}}</td>
                    </tr>
                    <tr wx:else>
                        <td><image class="ico ico2" src='../../../image/inviteFriends_ico1.png'><text>{{index+1}}</text></image></td>
                        <td>{{item.member.nickname}}</td>
                        <td>{{item.invite_count}}</td>
                        <td>{{item.invite_money}}</td>
                    </tr>
                </block>
            </tbody>
        </table>
    </view> -->
		</scroll-view>

		<!--规则-开始-->
		<view class="ruleMask" :hidden="!ruleShow" @tap="tapRule">
			<view class="cont">
				<view class="nr" @tap.stop="maopao">
					<view class="tit">活动规则</view>
					<view class="txt">{{info.cfg.intro_format}}</view>
				</view>
				<image src="/static/image/index_btn_closeBig3x.png" class="close" @tap.stop="tapRule"></image>
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
					that.setData({
						info: res.data
					});
					let _qrcode = that.info.share_url;

					let _canvasSize = that.setCanvasSize();

					that.createQrcode(_qrcode, "qrcCanvas", _canvasSize.w, _canvasSize.h);
				}

				;
			});
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(res) {
			// if (res.from === 'button') {
			//     // 来自页面内转发按钮
			//     console.log(res.target)
			// }
			return {
				title: '邀请好友',
				path: "/pages/invite/share/share?pid=" + this.pid
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
				this.setData({
					tofaceShow: !this.tofaceShow
				});
			},

			//规则说明
			tapRule() {
				this.setData({
					ruleShow: !this.ruleShow
				});
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


	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwT0p2c0tPJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSxZQUFZLEVBQUUsbUJBQW1CLEVBQUUscUJBQXFCLEVBQUUsc0JBQXNCLENBQUM7QUFDOUYsd0JBQXdCLGtCQUFrQixDQUFDO0FBQzNDLHFCQUFxQixrQkFBa0IsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDO0FBQ2pFLHdCQUF3QixrQkFBa0IsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQztBQUNoSCw2QkFBNkIsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUM7QUFDN0gsaUNBQWlDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQztBQUNsRSxtQkFBbUIsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQywwQkFBMEIsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsOEJBQThCLENBQUM7QUFDak4sd0JBQXdCLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUM7QUFDdkUsc0JBQXNCLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLGFBQWEsQ0FBQztBQUNoRiwyQkFBMkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQztBQUN4RSxrQ0FBa0Msa0JBQWtCLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQztBQUM3RyxvREFBb0QsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsZ0JBQWdCLEVBQUU7QUFDbkksOEJBQThCLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO0FBQzNHLG1DQUFtQyxnQkFBZ0IsRUFB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by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaW52aXRlSW5kZXh7aGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kOiAjZmZjMTU2OyBwYWRkaW5nLWJvdHRvbTogMjBycHg7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7fVxyXG4uaW52aXRlSW5kZXggLmJhbm5lckJveHtwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uaW52aXRlSW5kZXggLmJhbm5lcntwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDA7IHdpZHRoOiAxMDAlO31cclxuLmludml0ZUluZGV4IC5iYW5uZXJfbnJ7cG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiAxOyBsZWZ0OiAwOyB0b3A6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGNvbG9yOiAjZmZmO31cclxuLmludml0ZUluZGV4IC5iYW5uZXJfbnIgLnR4dHtmb250LXNpemU6IDQwcnB4OyBsaW5lLWhlaWdodDogNjBycHg7IGZvbnQtZmFtaWx5OiBTaW1IZWk7IHRleHQtYWxpZ246Y2VudGVyOyBtYXJnaW4tdG9wOiAxNnJweDt9XHJcbi5pbnZpdGVJbmRleCAuYmFubmVyX25yIC50eHQgYmlne2ZvbnQtc2l6ZTogOTBycHg7IGNvbG9yOiAjZmZmMDAwO31cclxuLmludml0ZUluZGV4IC5ydWxle3Bvc2l0aW9uOiBhYnNvbHV0ZTsgei1pbmRleDogMTsgcmlnaHQ6IDA7IHRvcDogMjAlOyB3aWR0aDogOTZycHg7aGVpZ2h0OiA0NHJweDtsaW5lLWhlaWdodDogNDRycHg7YmFja2dyb3VuZDogcmdiYSgwLDAsMCwuMSk7Y29sb3I6ICNmZWZlZmU7dGV4dC1hbGlnbjogY2VudGVyO2JvcmRlci1yYWRpdXM6IDQwcnB4IDAgMCA0MHJweDt9XHJcbi5pbnZpdGVJbmRleCAucnVsZSAuaWNve3dpZHRoOiAxMHJweDsgaGVpZ2h0OiAxOHJweDsgbWFyZ2luLWxlZnQ6IDZycHg7fVxyXG4uaW52aXRlSW5kZXggLmJ0bl9ib3h7dGV4dC1hbGlnbjogY2VudGVyOyBwYWRkaW5nOiAyMHJweCAwIDEwcnB4OyBkaXNwbGF5OiBmbGV4O31cclxuLmludml0ZUluZGV4IC5idG5fYm94IC5idG57ZmxleDogMTsgbWFyZ2luOiAwIDE2cnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uaW52aXRlSW5kZXggLmJ0bl9ib3ggLmJ0biBidXR0b257cG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IG9wYWNpdHk6IDA7fVxyXG4uaW52aXRlRnJpZW5kc19jaGVuZ2ppdSwuaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdHsgbWFyZ2luOiAzNnJweCAzMHJweDsgYmFja2dyb3VuZDogI2ZmZjsgYm9yZGVyLXJhZGl1czogMTBycHg7IG92ZXJmbG93OiBoaWRkZW47IH1cclxuLmludml0ZUZyaWVuZHNfY2hlbmdqaXUgLnRpdHsgbGluZS1oZWlnaHQ6IDcycnB4OyBiYWNrZ3JvdW5kOiAjZjlmYWZhOyBmb250LXNpemU6IDMwcnB4OyBwYWRkaW5nOiAwIDEycnB4OyB9XHJcbi5pbnZpdGVGcmllbmRzX2NoZW5naml1IC50aXQgLnR4dHsgZm9udC1zaXplOiAyNHJweDsgY29sb3I6ICM5OTk7IH1cclxuLmludml0ZUZyaWVuZHNfY2hlbmdqaXUgLnRpdCAuaWNve3dpZHRoOiAxMnJweDsgaGVpZ2h0OiAyMHJweDsgbWFyZ2luLWxlZnQ6IDEwcnB4O31cclxuLmludml0ZUZyaWVuZHNfY2hlbmdqaXUgbGl7IGZsb2F0OiBsZWZ0OyB3aWR0aDogMzMuMzMzMyU7IHRleHQtYWxpZ246IGNlbnRlcjsgcGFkZGluZzogMjBycHggMDsgcG9zaXRpb246IHJlbGF0aXZlO2Rpc3BsYXk6IGJsb2NrO31cclxuLmludml0ZUZyaWVuZHNfY2hlbmdqaXUgbGk6YmVmb3JleyBjb250ZW50OiAnJzsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDUwJTsgbGVmdDogMDsgbWFyZ2luLXRvcDogLTM4cnB4OyB3aWR0aDogMnJweDsgaGVpZ2h0OiA3NnJweDsgYmFja2dyb3VuZDogI2YzZjNmMzsgfVxyXG4uaW52aXRlRnJpZW5kc19jaGVuZ2ppdSBsaTpmaXJzdC1jaGlsZDpiZWZvcmV7IGRpc3BsYXk6IG5vbmU7IH1cclxuLmludml0ZUZyaWVuZHNfY2hlbmdqaXUgbGk+dmlld3sgY29sb3I6ICNmZjMwMDA7IGhlaWdodDogNjBycHg7IGxpbmUtaGVpZ2h0OiA2MHJweDsgfVxyXG4uaW52aXRlRnJpZW5kc19jaGVuZ2ppdSBsaT52aWV3IGJpZ3sgZm9udC1zaXplOiA0OHJweDsgfVxyXG4uaW52aXRlRnJpZW5kc19jaGVuZ2ppdSBsaSAuc21hbGx7IGNvbG9yOiAjOTk5OyBsaW5lLWhlaWdodDogMzZycHg7IH1cclxuXHJcbi5pbnZpdGVGcmllbmRzX3JhbmtpbmdMaXN0IC50aXR7IGxpbmUtaGVpZ2h0OiA3MnJweDsgZm9udC1zaXplOiAzMHJweDsgcGFkZGluZzogMCAxMnJweDsgfVxyXG4uaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdCB0YWJsZSB0cntkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBib3JkZXItYm90dG9tOjJycHggZGFzaGVkICNlNmU2ZTY7fVxyXG4uaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdCB0YWJsZSB0ci5iZzF7IGJhY2tncm91bmQ6ICNmZmU5ZTk7IH1cclxuLmludml0ZUZyaWVuZHNfcmFua2luZ0xpc3QgdGFibGUgdHIuYmcyeyBiYWNrZ3JvdW5kOiAjZmZlZmVmOyB9XHJcbi5pbnZpdGVGcmllbmRzX3JhbmtpbmdMaXN0IHRhYmxlIHRyLmJnM3sgYmFja2dyb3VuZDogI2ZmZjdmNzsgfVxyXG4uaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdCB0YWJsZSB0ciB0aHsgYmFja2dyb3VuZDogI2YyZjJmMjsgbGluZS1oZWlnaHQ6IDY0cnB4OyBmb250LXNpemU6IDI2cnB4OyBmb250LXdlaWdodDogbm9ybWFsOyBmbGV4OiAxOyB0ZXh0LWFsaWduOiBjZW50ZXI7fVxyXG4uaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdCB0YWJsZSB0ciB0ZHsgbGluZS1oZWlnaHQ6IDcwcnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiAjNjY2O2ZsZXg6IDE7fVxyXG4uaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdCB0YWJsZSB0ci5iZyB0ZHsgY29sb3I6ICNmZjAwMDA7IH1cclxuLmludml0ZUZyaWVuZHNfcmFua2luZ0xpc3QgdGFibGUgdHI6Zmlyc3QtY2hpbGR7IGJvcmRlci1ib3R0b206IDA7IH1cclxuLmludml0ZUZyaWVuZHNfcmFua2luZ0xpc3QgdGFibGUgdHI6bGFzdC1jaGlsZHsgYm9yZGVyLWJvdHRvbTogMDsgfVxyXG4uaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdCB0YWJsZSB0ZCAuaWNve3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5pbnZpdGVGcmllbmRzX3JhbmtpbmdMaXN0IHRhYmxlIHRyIHRkIC5pY28xe3dpZHRoOiA0MnJweDsgaGVpZ2h0OiA0MnJweDt9XHJcbi5pbnZpdGVGcmllbmRzX3JhbmtpbmdMaXN0IHRhYmxlIHRyIHRkIC5pY28xIHRleHR7cG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAxMXJweDsgdG9wOjZycHg7IGZvbnQtc2l6ZTogMjJycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDt9XHJcbi5pbnZpdGVGcmllbmRzX3JhbmtpbmdMaXN0IHRhYmxlIHRyIHRkIC5pY28ye3dpZHRoOiAzOHJweDsgaGVpZ2h0OiAzOHJweDsgbGluZS1oZWlnaHQ6IDM4cnB4OyBtYXJnaW4tbGVmdDogLTZycHg7fVxyXG4uaW52aXRlRnJpZW5kc19yYW5raW5nTGlzdCB0YWJsZSB0ciB0ZCAuaWNvMiB0ZXh0e3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyBmb250LXNpemU6IDIycnB4OyBjb2xvcjogI2ZmZjsgd2lkdGg6IDEwMCU7IHRleHQtYWxpZ246IGNlbnRlcjt9XHJcblxyXG4uZmFjZVRvZmFjZU1hc2t7cG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxOyBsZWZ0OiAwOyB0b3A6MDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwwLjUpO31cclxuLmZhY2VUb2ZhY2VNYXNrIC5jb250e3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogNTAlOyB0b3A6NTAlOyBiYWNrZ3JvdW5kOiAjZmZmOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpOyBib3JkZXItcmFkaXVzOiA2cnB4OyBvdmVyZmxvdzogaGlkZGVuO31cclxuLmZhY2VUb2ZhY2VNYXNrIC5jb250IC50eHR7Zm9udC1zaXplOiAyOHJweDttYXJnaW4tdG9wOiAzMHJweDtib3JkZXItdG9wOiAycnB4IHNvbGlkICM3ZWM2ZWM7aGVpZ2h0OiA4MHJweDtsaW5lLWhlaWdodDogODBycHg7Y29sb3I6ICMxMjk2ZGI7IHRleHQtYWxpZ246IGNlbnRlcjt9XHJcblxyXG4ucnVsZU1hc2t7cG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxOyBsZWZ0OiAwOyB0b3A6MDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwwLjUpO31cclxuLnJ1bGVNYXNrIC5jb250e3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogNTAlOyB0b3A6NTAlOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpOyB3aWR0aDogNzUlO31cclxuLnJ1bGVNYXNrIC5jb250IC50aXR7bGluZS1oZWlnaHQ6IDQ0cnB4O2ZvbnQtc2l6ZTogMjhycHg7dGV4dC1hbGlnbjogY2VudGVyO2ZvbnQtd2VpZ2h0OiA2MDA7bWFyZ2luLWJvdHRvbTogMTBycHg7fVxyXG4ucnVsZU1hc2sgLmNvbnQgLnR4dHtsaW5lLWhlaWdodDogNDBycHg7Zm9udC1zaXplOiAyNnJweDt9XHJcbi5ydWxlTWFzayAuY29udCAubnJ7YmFja2dyb3VuZDogI2ZmZjsgYm9yZGVyLXJhZGl1czogNnJweDsgcGFkZGluZzogMzBycHggNDBycHggNDBycHg7IHdvcmQtd3JhcDogYnJlYWstd29yZDsgd29yZC1icmVhazogbm9ybWFsO31cclxuLnJ1bGVNYXNrIC5jb250IC5jbG9zZXt3aWR0aDogNjBycHg7IGhlaWdodDogNjBycHg7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW46IDQwcnB4IGF1dG8gMDt9XHJcblxyXG4iLG51bGxdfQ== */
</style>