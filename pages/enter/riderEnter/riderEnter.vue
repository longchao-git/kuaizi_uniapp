<template>
	<view>
		<!--pages/enter/riderEnter/riderEnter.wxml-->
		<!-- 
<import src="../../../components/showToast.wxml" />
<template is="showToast" data="{{showToast: showToast}}" /> -->

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
			<image src="/static/image/btn_arrow_r3x.png" style="width:25rpx;height:40rpx;float:right;margin-top:30rpx;">
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
	// pages/enter/riderEnter/riderEnter.js
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
					that.setData({
						citys: res.data.items
					});
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
				this.setData({
					eyeShow: !eyeShow
				});
			},
			// 监听用户名输入
			bindUserName: function(event) {
				var inputUserName = event.detail.value;
				this.setData({
					userName: inputUserName
				});
				this.isEnter();
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
				app.globalData.topage("../agreement/agreement?enterType=rider");
			},
			// 省市区选择器
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value);
				this.setData({
					index: e.detail.value,
					cityShow: true
				});
				this.isEnter();
			}
		}
	};
</script>
<style>
	/* pages/enter/riderEnter/riderEnter.wxss */

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





	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwcE15bm10JTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJDQUEyQzs7QUFFM0MsT0FBTyxZQUFZLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLDZCQUE2QixDQUFDO0FBQzdJLFFBQVEsV0FBVyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7QUFDN0QsYUFBYSxjQUFjLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDOztBQUVwSCxTQUFTLGNBQWMsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDOztBQUV0TSxnQkFBZ0IsUUFBUSxDQUFDLDJCQUEyQixDQUFDO0FBQ3JELFlBQVksV0FBVyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUM7QUFDckUsa0JBQWtCLFdBQVcsQ0FBQyxhQUFhLENBQUM7QUFDNUMsY0FBYyxZQUFZLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQztBQUMxRSxRQUFRLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDOztBQUU1RCxXQUFXLFdBQVcsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQztBQUN0SCxpQkFBaUIsY0FBYyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0FBQ3pGLGdCQUFnQixhQUFhLENBQUM7O0FBRTlCO0lBQ0ksVUFBVTtJQUNWLGFBQWE7SUFDYixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLFdBQVc7SUFDWCxjQUFjO0lBQ2QsaUJBQWlCO0lBQ2pCLGNBQWM7R0FDZixrQkFBa0I7SUFDakIsb0JBQW9CO0FBQ3hCOztBQUVBLGlCQUFpQixXQUFXLENBQUMiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogcGFnZXMvZW50ZXIvcmlkZXJFbnRlci9yaWRlckVudGVyLnd4c3MgKi9cclxuXHJcbi5saXN0c3t3aWR0aDo3MTBycHg7cGFkZGluZy1sZWZ0OjIwcnB4O3BhZGRpbmctcmlnaHQ6MjBycHg7aGVpZ2h0OiAxMDBycHg7bGluZS1oZWlnaHQ6IDEwMHJweDtiYWNrZ3JvdW5kOiAjZmZmO2JvcmRlci1ib3R0b206MXJweCBzb2xpZCAjZWVlO31cclxuLmxpc3RzTHtmbG9hdDogbGVmdDt3aWR0aDoxNDBycHg7Zm9udC1zaXplOiAzMHJweDtjb2xvcjojMzMzO31cclxuLmxpc3RzIGlucHV0e2Rpc3BsYXk6IGJsb2NrO2Zsb2F0OiBsZWZ0O2hlaWdodDogMTAwcnB4O2xpbmUtaGVpZ2h0OiAxMDBycHg7Zm9udC1zaXplOiAzMHJweDtjb2xvcjojMzMzO3dpZHRoOjM3MHJweDt9XHJcblxyXG4uZ2V0Q29kZXtkaXNwbGF5OiBibG9jaztoZWlnaHQ6IDgwcnB4O2xpbmUtaGVpZ2h0OiA4MHJweDttYXJnaW4tdG9wOjEwcnB4O3dpZHRoOjIwMHJweDtmbG9hdDogcmlnaHQ7b3V0bGluZTogbm9uZTtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOm5vbmU7cGFkZGluZzowO3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZTogMzBycHg7Y29sb3I6I2Y2MDt9XHJcblxyXG4uZ2V0Q29kZTo6YWZ0ZXJ7Ym9yZGVyOjA7Ym9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjY2NjO31cclxuLmV5ZS1vbi1vZmZ7d2lkdGg6NjBycHg7ZmxvYXQ6IHJpZ2h0O2hlaWdodDogNjBycHg7bWFyZ2luLXRvcDogMjBycHg7fVxyXG4uZXllLW9uLW9mZiBpbWFnZXt3aWR0aDo2MHJweDtoZWlnaHQ6IDYwcnB4O31cclxuLmxpc3RzIHBpY2tlcnt3aWR0aDo1MDBycHg7aGVpZ2h0OiAxMDBycHg7bGluZS1oZWlnaHQ6IDEwMHJweDtmbG9hdDogbGVmdDt9XHJcbi5waWNrZXJ7Zm9udC1zaXplOjMwcnB4IDtjb2xvcjojMzMzO3dpZHRoOjEwMCU7aGVpZ2h0OiAxMDAlO31cclxuXHJcbi5hZ3JlZW1lbnR7d2lkdGg6NjkwcHg7cGFkZGluZzowIDMwcnB4O2ZvbnQtc2l6ZTogMjhycHg7Y29sb3I6Izk5OTtoZWlnaHQ6IDMwcnB4O2xpbmUtaGVpZ2h0OiAzMHJweDttYXJnaW4tdG9wOiA0MHJweDt9XHJcbi5hZ3JlZW1lbnQgaW1hZ2V7ZGlzcGxheTogYmxvY2s7ZmxvYXQ6IGxlZnQ7d2lkdGg6MzBycHg7aGVpZ2h0OiAzMHJweDttYXJnaW4tcmlnaHQ6MTBycHg7fVxyXG4uYWdyZWVtZW50IHRleHR7Y29sb3I6IzFCODJEMjt9XHJcblxyXG4uZW50ZXJCdG57ICAgIFxyXG4gICAgd2lkdGg6IDkyJTtcclxuICAgIGhlaWdodDogODhycHg7XHJcbiAgICBsaW5lLWhlaWdodDogODhycHg7XHJcbiAgICBmb250LXNpemU6IDMycnB4O1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxuICAgIG1hcmdpbi10b3A6IDY2cnB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgIGJhY2tncm91bmQ6I0ZGNzI1QztcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcnB4O1xyXG59XHJcblxyXG4uZW50ZXJCdG46OmFmdGVye2JvcmRlcjpub25lO31cclxuXHJcblxyXG5cclxuXHJcbiJdfQ== */
</style>