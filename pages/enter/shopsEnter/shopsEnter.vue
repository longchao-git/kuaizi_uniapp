<template>
	<view>
		<!--pages/enter/shopsEnter/shopsEnter.wxml-->
		<!--<import src="../../../components/showToast.wxml" />
<template is="showToast" data="{{showToast: showToast}}" />-->


		<view class="lists">
			<view class="listsL">手机</view>
			<input type="number" placeholder="请输入手机号" value @input="bindTel">
		</view>
		<view class="lists">
			<view class="listsL">验证码</view>
			<input placeholder="请输入验证码" type="number" :value="inputCode" @input="bindCode">
			<button class="getCode" @tap="getCode" :disabled="getCodeDisabled">{{time}}</button>
		</view>
		<view class="lists">
			<view class="listsL">密码</view>
			<input placeholder="请输入密码" type="password" v-if="eyeShow" :value="inputPwd" @input="bindInput">
			<input placeholder="请输入密码" type="text" @input="bindInput" :value="inputPwd" v-else>
			<view class="eye-on-off" @tap="eyeOnOff">
				<image src="/static/image/icon_eyes_hidded2x.png" v-if="eyeShow"></image>
				<image src="/static/image/icon_eyes_show.png" v-else></image>
			</view>
		</view>



		<view class="agreement">
			<image src="/static/image/btn_radio_checked2x.png"></image>
			<checkbox checked="checked" hidden="hidden"></checkbox>
			我已阅读并同意<text @tap="toAgreement">《商家入驻协议》</text>
		</view>

		<button class="enterBtn active" @tap="enterSubmit" :disabled="isBtnActive"
			:style="'background-color:' + (isBtnActive ? '#C9C9C9' : '') + ';color:' + (isBtnActive ? '#fff' : '')">立即入驻</button>
	</view>
</template>

<script>
	// pages/enter/shopsEnter/shopsEnter.js
	const app = getApp();
	var params = {
		mobile: ''
	};

	export default {
		data() {
			return {
				eyeShow: true,
				inputPwd: '',
				tel: '',
				inputCode: '',
				isBtnActive: true,
				currentTime: 60,
				time: '获取验证码',
				getCodeDisabled: false
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

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
		onShareAppMessage: function() {},
		methods: {
			// 输入密码是否可见
			eyeOnOff: function() {
				var eyeShow = this.eyeShow;
				this.setData({
					eyeShow: !eyeShow
				});
			},
			// 监听手机号输入
			bindTel: function(event) {
				var inputTel = event.detail.value;
				this.setData({
					tel: inputTel
				});
				this.isEnter();
			},
			// 监听输入密码框
			bindInput: function(event) {
				// console.log(event.detail.value)
				this.setData({
					inputPwd: event.detail.value
				});
				this.isEnter();
			},
			// 监听验证码
			bindCode: function(event) {
				// console.log(event.detail.value)
				this.setData({
					inputCode: event.detail.value
				});
				this.isEnter();
			},
			// 立即入驻按钮
			enterSubmit: function() {
				var that = this;
				app.globalData.enterShop({
					"mobile": that.tel,
					"passwd": that.inputPwd,
					"code": that.inputCode
				}, function(res) {
					if (res.error == '0') {
						app.globalData.msgbox(res.message);
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							});
						}, 1500);
					} else {
						app.globalData.msgbox(res.message);
					}
				});
			},
			// 判断立即入驻按钮的状态
			isEnter: function() {
				if (this.inputPwd != '' && this.tel != '' && this.inputCode != '') {
					this.setData({
						isBtnActive: false
					});
				} else {
					this.setData({
						isBtnActive: true
					});
				}
			},
			getCode: function() {
				var that = this;
				var mobile = that.tel;
				params.mobile = mobile;
				app.globalData.sendSms(params, function(res) {
					if (res.error == '0') {
						var currentTime = that.currentTime;
						var interval = setInterval(function() {
							currentTime--;

							if (currentTime < 10) {
								currentTime = '0' + currentTime;
							}

							that.setData({
								time: currentTime + "s后重试",
								getCodeDisabled: true
							});

							if (currentTime <= 0) {
								clearInterval(interval);
								that.setData({
									time: "重新发送",
									currentTime: 60,
									getCodeDisabled: false
								});
							}
						}, 1000);
					} else {
						app.globalData.msgbox(res.message);
					}
				});
			},
			// 跳转到协议页面
			toAgreement: function() {
				app.globalData.topage("../agreement/agreement?enterType=shops");
			}
		}
	};
</script>
<style>
	/* pages/enter/shopsEnter/shopsEnter.wxss */
	.lists {
		width: 710rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: #fff;
		border-bottom: 1rpx solid #eee;
	}

	.listsL {
		float: left;
		width: 140rpx;
		font-size: 30rpx;
		color: #333;
	}

	.lists input {
		display: block;
		float: left;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		color: #333;
		width: 370rpx;
	}

	.lists input:-moz-placeholder {
		color: #666;
	}

	.getCode {
		display: block;
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 10rpx;
		width: 200rpx;
		float: right;
		outline: none;
		border: none;
		background: none;
		padding: 0;
		text-align: center;
		font-size: 30rpx;
		color: #f60;
	}

	.getCode::after {
		border: 0;
		border-left: 1px solid #ccc;
	}

	.eye-on-off {
		width: 60rpx;
		float: right;
		height: 60rpx;
		margin-top: 20rpx;
	}

	.eye-on-off image {
		width: 60rpx;
		height: 60rpx;
	}


	.agreement {
		width: 690px;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #999;
		height: 30rpx;
		line-height: 30rpx;
		margin-top: 40rpx;
	}

	.agreement image {
		display: block;
		float: left;
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}

	.agreement text {
		color: #1B82D2;
	}

	.enterBtn {
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		color: #fff;
		margin: 0 auto;
		margin-top: 66rpx;
		display: block;
		background: #FF725C;
		border-radius: 10rpx;
	}

	.enterBtn::after {
		border: none;
	}





	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIweXVqT2NRJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJDQUEyQztBQUMzQyxPQUFPLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsNkJBQTZCLENBQUM7QUFDN0ksUUFBUSxXQUFXLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQztBQUM3RCxhQUFhLGNBQWMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7QUFDcEgsOEJBQThCLFVBQVUsQ0FBQztBQUN6QyxTQUFTLGNBQWMsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDOztBQUV0TSxnQkFBZ0IsUUFBUSxDQUFDLDJCQUEyQixDQUFDO0FBQ3JELFlBQVksV0FBVyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUM7QUFDckUsa0JBQWtCLFdBQVcsQ0FBQyxhQUFhLENBQUM7OztBQUc1QyxXQUFXLFdBQVcsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQztBQUN0SCxpQkFBaUIsY0FBYyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0FBQ3pGLGdCQUFnQixhQUFhLENBQUM7O0FBRTlCO0lBQ0ksVUFBVTtJQUNWLGFBQWE7SUFDYixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLFdBQVc7SUFDWCxjQUFjO0lBQ2QsaUJBQWlCO0lBQ2pCLGNBQWM7R0FDZixrQkFBa0I7SUFDakIsb0JBQW9CO0FBQ3hCOztBQUVBLGlCQUFpQixXQUFXLENBQUMiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogcGFnZXMvZW50ZXIvc2hvcHNFbnRlci9zaG9wc0VudGVyLnd4c3MgKi9cclxuLmxpc3Rze3dpZHRoOjcxMHJweDtwYWRkaW5nLWxlZnQ6MjBycHg7cGFkZGluZy1yaWdodDoyMHJweDtoZWlnaHQ6IDEwMHJweDtsaW5lLWhlaWdodDogMTAwcnB4O2JhY2tncm91bmQ6ICNmZmY7Ym9yZGVyLWJvdHRvbToxcnB4IHNvbGlkICNlZWU7fVxyXG4ubGlzdHNMe2Zsb2F0OiBsZWZ0O3dpZHRoOjE0MHJweDtmb250LXNpemU6IDMwcnB4O2NvbG9yOiMzMzM7fVxyXG4ubGlzdHMgaW5wdXR7ZGlzcGxheTogYmxvY2s7ZmxvYXQ6IGxlZnQ7aGVpZ2h0OiAxMDBycHg7bGluZS1oZWlnaHQ6IDEwMHJweDtmb250LXNpemU6IDMwcnB4O2NvbG9yOiMzMzM7d2lkdGg6MzcwcnB4O31cclxuLmxpc3RzIGlucHV0Oi1tb3otcGxhY2Vob2xkZXJ7Y29sb3I6IzY2Njt9XHJcbi5nZXRDb2Rle2Rpc3BsYXk6IGJsb2NrO2hlaWdodDogODBycHg7bGluZS1oZWlnaHQ6IDgwcnB4O21hcmdpbi10b3A6MTBycHg7d2lkdGg6MjAwcnB4O2Zsb2F0OiByaWdodDtvdXRsaW5lOiBub25lO2JvcmRlcjpub25lO2JhY2tncm91bmQ6bm9uZTtwYWRkaW5nOjA7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOiAzMHJweDtjb2xvcjojZjYwO31cclxuXHJcbi5nZXRDb2RlOjphZnRlcntib3JkZXI6MDtib3JkZXItbGVmdDogMXB4IHNvbGlkICNjY2M7fVxyXG4uZXllLW9uLW9mZnt3aWR0aDo2MHJweDtmbG9hdDogcmlnaHQ7aGVpZ2h0OiA2MHJweDttYXJnaW4tdG9wOiAyMHJweDt9XHJcbi5leWUtb24tb2ZmIGltYWdle3dpZHRoOjYwcnB4O2hlaWdodDogNjBycHg7fVxyXG5cclxuXHJcbi5hZ3JlZW1lbnR7d2lkdGg6NjkwcHg7cGFkZGluZzowIDMwcnB4O2ZvbnQtc2l6ZTogMjhycHg7Y29sb3I6Izk5OTtoZWlnaHQ6IDMwcnB4O2xpbmUtaGVpZ2h0OiAzMHJweDttYXJnaW4tdG9wOiA0MHJweDt9XHJcbi5hZ3JlZW1lbnQgaW1hZ2V7ZGlzcGxheTogYmxvY2s7ZmxvYXQ6IGxlZnQ7d2lkdGg6MzBycHg7aGVpZ2h0OiAzMHJweDttYXJnaW4tcmlnaHQ6MTBycHg7fVxyXG4uYWdyZWVtZW50IHRleHR7Y29sb3I6IzFCODJEMjt9XHJcblxyXG4uZW50ZXJCdG57ICAgIFxyXG4gICAgd2lkdGg6IDkyJTtcclxuICAgIGhlaWdodDogODhycHg7XHJcbiAgICBsaW5lLWhlaWdodDogODhycHg7XHJcbiAgICBmb250LXNpemU6IDMycnB4O1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxuICAgIG1hcmdpbi10b3A6IDY2cnB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgIGJhY2tncm91bmQ6I0ZGNzI1QztcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcnB4O1xyXG59XHJcblxyXG4uZW50ZXJCdG46OmFmdGVye2JvcmRlcjpub25lO31cclxuXHJcblxyXG5cclxuXHJcbiJdfQ== */
</style>