<template>
	<view>


		<view class="lists">
			<view class="listsL">用户名</view>
			<input type="text" placeholder="请输入用户名" :value="userName" @input="bindUserName">
		</view>
		<view class="lists">
			<view class="listsL">手机</view>
			<input type="number" placeholder="请输入手机号" :value="tel" @input="bindTel">
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
		<view class="lists">
			<view class="listsL">城市</view>
			<picker @change="bindPickerChange" :value="index" :range="citys" range-key="city_name">
				<view class="picker" v-if="cityShow">
					{{citys[index].city_name}}
				</view>
				<view class="picker" v-else style="color:#808080;">
					请选择所在城市
				</view>
			</picker>
			<image src="/static/image/icon-arrowR-gray2x.png"
				style="width:25rpx;height:40rpx;float:right;margin-top:30rpx;">
			</image>
		</view>



		<view class="agreement">
			<image src="/static/image/btn_radio_checked2x.png"></image>
			<checkbox checked="checked" hidden="hidden"></checkbox>
			我已阅读并同意<text @tap="toAgreement">《骑手入驻协议》</text>
		</view>

		<button class="enterBtn active" @tap="enterSubmit" :disabled="isBtnActive"
			:style="'background-color:' + (isBtnActive ? '#C9C9C9' : '') + ';color:' + (isBtnActive ? '#fff' : '')">立即入驻</button>
	</view>
</template>

<script>
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
				getCodeDisabled: false,
				userName: '',
				citys: [{
					city_name: ""
				}],
				index: 0,
				customItem: '全部',
				cityShow: false
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var that = this;
			app.globalData.citys({}, function(res) {
				console.log(res);

				if (res.error == '0') {
					that.citys = res.data.items;
				} else {
					app.globalData.msgbox(res.message);
				}
			});
		},

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
				this.eyeShow = !eyeShow;
			},
			// 监听用户名输入
			bindUserName: function(event) {
				var inputUserName = event.detail.value;
				this.userName = inputUserName;
				this.isEnter();
			},
			// 监听手机号输入
			bindTel: function(event) {
				var inputTel = event.detail.value;
				this.tel = inputTel;
				this.isEnter();
			},
			// 监听输入密码框
			bindInput: function(event) {
				// console.log(event.detail.value)
				this.inputPwd = event.detail.value;
				this.isEnter();
			},
			// 监听验证码
			bindCode: function(event) {
				// console.log(event.detail.value)
				this.inputCode = event.detail.value;
				this.isEnter();
			},
			// 立即入驻按钮
			enterSubmit: function() {
				var that = this;
				console.log(that.citys[that.index].city_id);
				app.globalData.enterStaff({
					"name": that.userName,
					"mobile": that.tel,
					"passwd": that.inputPwd,
					"code": that.inputCode,
					"city_id": that.citys[that.index].city_id
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
				if (this.inputPwd != '' && this.tel != '' && this.inputCode != '' && this.userName != '' && this
					.cityShow != false) {
					this.isBtnActive = false;
				} else {
					this.isBtnActive = true;
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

							that.time = currentTime + "s后重试"
							that.getCodeDisabled = true;

							if (currentTime <= 0) {
								clearInterval(interval);
								that.time = "重新发送"
								that.currentTime = 60
								that.getCodeDisabled = false;
							}
						}, 1000);
					} else {
						app.globalData.msgbox(res.message);
					}
				});
			},
			// 跳转到协议页面
			toAgreement: function() {
				app.globalData.topage("/subPages/enter/agreement/agreement?enterType=rider");
			},
			// 省市区选择器
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value);
				this.index = e.detail.value
				this.cityShow = true
				this.isEnter();
			}
		}
	};
</script>
<style>

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

	.lists picker {
		width: 500rpx;
		height: 100rpx;
		line-height: 100rpx;
		float: left;
	}

	.picker {
		font-size: 30rpx;
		color: #333;
		width: 100%;
		height: 100%;
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
</style>