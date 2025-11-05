<template>
	<view class="contentView">
		<!--提示框引入-开始-->

		<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
			<block v-if="showToast.isShow? showToast.isShow: false">

				<view class="toast-center">
					<view class="toast">
						<image class="toast-icon" :src="showToast.icon" mode="scaleToFill" v-if="showToast.icon">
						</image>
						<text class="toast-text">{{showToast.title}}</text>
					</view>
				</view>
			</block>
		</block>

		<!--提示框引入-结束-->
		<view class="bindingForm_box">
			<view class="bindingForm">
				<template v-if="!hasInter&&!hasSignup">
					<view class="name_top">用户快捷登录</view>
					<view class="iphone_name">手机账号</view>
					<view class="int_box"
						style="padding-right: 100px;display: flex;align-items: center; border-bottom: 2rpx solid #DDDDDD;">
						<view style="line-height: 80rpx; padding:0 20rpx ;border-radius: 10rpx;font-size: 28rpx;"
							@click="showActionSheet">{{textPhone}}</view>
						<view class="xian"></view>
						<input name="phone" type="text" placeholder="手机号" :value='mobile' @input="mobileFun">
					</view>
					<view class="int_box" style=" border-bottom: 2rpx solid #DDDDDD;">
						<input name="code" type="text" placeholder="密码" :value='smscode' @input="setsmscode">
					</view>
					<view class="btn-area" style="display: flex;align-items: center;">
						<button @tap="sethasSignup" class="long_btn1">注册</button>
						<button @tap="bindClientPassport" class="long_btn2">登录</button>
					</view>
					<button class="long_btn3" style="margin-left: 30rpx;" @click="setcascas">快捷登录</button>
				</template>

				<template v-if="hasInter||hasSignup">
					<view class="name_top">{{Hasiphone?'输入6位验证码':'输入手机账号'}}</view>
					<view class="name_botom" v-if="Hasiphone">已发送至+{{textPhone}} {{mobile}}</view>
					<view class="iphone_name">{{Hasiphone?'6位验证码':'手机账号'}}</view>

					<view class="int_box" v-if="!Hasiphone">
						<view class="int_box" style="display: flex;align-items: center;">
							<view style="line-height: 80rpx; padding:0 20rpx ;color:#3E4248;font-size: 28rpx;"
								@click="showActionSheet">{{textPhone}}</view>
							<view class="xian"></view>
							<input name="phone" type="text" placeholder="手机号" :value='mobile' @input="mobileFun">
						</view>
						<!-- 	<button type="default" :class="'send ' + sendclass" @tap="sendCode">
							<block v-if="sendclass=='on'">重新获取({{time}}s)</block>
							<block v-else>{{sendbtn}}</block>
						</button> -->
					</view>
					<block v-if="Hasiphone">
						<view class='content'>
							<input type="number" class='ipt' :maxlength="Length" :enableNative="true" :focus='codeFocus'
								@blur='codeFocus=false' :adjust-position="false" :auto-blur="true" v-model="code" />
							<view class="contentipt" style="flex: 1;" @click="codeFocus=true">
								<block v-for="(item,index) in Length">
									<!-- 		<input class='iptbox' :value="" disabled
										:password='ispassword'></input> -->
									<!-- code[index] -->
									<view class='iptbox'>{{code.length>=index+1?'*':''}}</view>
								</block>
							</view>

						</view>
						<view class="cascca" v-if="sendclass=='on'&&Hasiphone">{{time}}秒后 重新获取</view>
						<view class="cascca" v-if="!sendclass&&Hasiphone" @tap="HasetGA">重新获取</view>
					</block>
					<!-- 	<view class="int_box">
						<input name="code" type="text" placeholder="验证码" :value='code' @input="setcode">
					</view> -->

					<view class="int_box" v-if="!hasZevalue&&Hasiphone"
						style=" border-bottom: 2rpx solid #DDDDDD;margin-top: 20rpx;line-height: 80rpx;">
						<input name="code" type="text" placeholder="密码" :value='valuecode' @input="setvaluecode">
					</view>
					<view class="potionetion" @tap="sendCode" v-if="!Hasiphone">下一步</view>
					<view class="potionetion" @tap="submit" v-if="Hasiphone">立即绑定</view>

					<!-- <view class="section__title"><text class="black6">温馨提示：</text>未注册账号的手机号，登陆时将自动注册</view> -->
					<!-- 	<view class="btn-area">
						<button @tap="submit" class="long_btn">{{buttonName}}</button>
					</view> -->

				</template>


				<view class="mask_bg2" :hidden="numberPop" @tap="cancel"></view>
				<view :class="'piccode ' + (numberPop?'':'active')">
					<view class="title border_b">输入验证码发送</view>
					<view class="content">
						<input type="text" :value="codevalue" @input="getnumber"> <!-- @blur="getnumber" -->
						<image :src="img" @tap="changeimg"></image>
					</view>
					<view class="btns border_t">
						<view class="cancel border_r" @tap="cancel">取消</view>
						<view class="confirm maincl" @tap="sendpic">确定</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mask_bg2" v-if="hasList"></view>
		<view class="country" v-if="hasList">
			<view class="Code">Country Code</view>
			<view v-for="(item,index) in list" class="iconbg flex-wrp" @tap="settextPhone" :data-index="index">
				<image src="/static//image/iconbg1.png" class="icon"></image>
				<view class="flex-wrp">
					<image :src="'/static/image/iconGj'+(index+1)+'.png'" class="iconGj"></image>
					<text style="margin-left:24rpx">{{item.name}}</text>
				</view>
				<text>+{{item.value}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var maxTime = 60,
		interval = null,
		hintMsg = null,
		currentTime = maxTime;
	var params = {
			mobile: ''
		},
		img_code = '';

	export default {
		data() {
			return {
				valuecode: '',
				smscode: '',
				mobile: '',
				sendclass: '',
				time: currentTime,
				sendbtn: '发送验证码',
				// img: app._CFG.BASE_API + '?API=magic/verify&PHPSESSID=' + app._CFG.PHPSESSID,
				numberPop: true,
				codevalue: '',
				img: "",
				code: "",
				showToast: {
					isShow: false
				},
				Length: 6, //输入框个数
				isFocus: false, //聚焦
				Value: "", //输入的内容
				ispassword: true, //是否密文显示 true为密文， false为明文。
				hasList: false,
				list: [{
					name: 'USA',
					value: 1
				}, {
					name: 'Great Britain',
					value: 44
				}, {
					name: 'France',
					value: 33
				}, {
					name: 'Australia',
					value: 61
				}, {
					name: 'Canada',
					value: 1
				}, {
					name: 'Mexico',
					value: 34
				}, {
					name: 'China',
					value: 86
				}, {
					name: 'Japan',
					value: 81
				}, {
					name: 'Italia',
					value: 39
				}],
				Hasiphone: false,
				codeFocus: false,
				textPhone: 34,
				hasInter: true, //true是微信。fasle是H5，支付宝
				hasSignup: false, //切换注册，或者快捷登录
				hasZevalue: true, //注册还是快捷登录
				buttonName: '立即绑定',
				submitResponseCallback: function(res) {
					if (res.error == '0') {
						uni.setStorage({
							key: 'token',
							data: res.data.token
						});
						uni.setStorage({
							key: 'userinfo',
							data: res.data
						});
						uni.getUserInfo({
							success: function(rs) {
								uni.setStorage({
									key: 'userinfo2',
									data: rs.userInfo
								});
								app.globalData._CFG.userInfo2 = rs.userInfo;
							}
						});
						app.globalData._CFG.TOKEN = res.data.token;
						app.globalData._CFG.userInfo = res.data;
						uni.navigateBack({
							delta: 2
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				},
			};
		},
		onLoad() {

			// #ifdef  H5 
			this.setData({
				hasInter: false
			});
			// #endif 
			// #ifdef MP-ALIPAY || MP-WEIXIN
			this.setData({
				hasInter: true
			});
			// #endif 
		},
		components: {},
		props: {},
		methods: {
			setTap() {
				setTimeout(() => {
					this.isFocus = true
				}, 100);
			},
			settextPhone(e) {
				let idx = e.currentTarget.dataset.index;
				console.log(e)
				let list = this.list
				this.setData({
					textPhone: list[idx].value,
					hasList: false
				})
			},
			showActionSheet: function() {
				this.setData({
					hasList: true
				})
			},
			setcascas: function() {
				this.setData({
					hasSignup: true,
					hasZevalue: true,
					buttonName: '快速登录'
				});
			},
			sethasSignup: function() {
				this.setData({
					hasSignup: true,
					hasZevalue: false,
					buttonName: '立即注册'
				});
			},
			formSubmit: function(e) {},
			mobileFun: function(e) {
				this.setData({
					mobile: e.detail.value
				});
			},

			sendCode: function(e) {
				if (!this.mobile) {
					uni.showToast({
						title: '请输入手机号'
					})
					return
				}
				params.img_code = '';
				this.getcode();
			},
			setsmscode: function(e) {
				this.setData({
					smscode: e.detail.value
				});
			},
			setvaluecode: function(e) {
				this.setData({
					valuecode: e.detail.value
				});
			},
			sendpic() {
				params.img_code = img_code;
				this.setData({
					img: '',
					codevalue: ''
				});
				this.getcode();
			},

			getnumber(e) {
				img_code = e.detail.value;
			},

			changeimg() {
				this.setData({
					img: ''
				});
				this.getVerifyCode();
			},
			bindClientPassport() {
				let params = {
					mobile: this.textPhone + '-' + this.mobile,
					'passwd': this.smscode,
				}
				app.globalData.getClientLogin(params, function(res) {
					console.log(res.error)
					if (res.error != 0) {
						uni.showToast({
							title: res.message
						});
					} else if (res.error == 0) {
						uni.setStorage({
							key: 'token',
							data: res.data.token
						});
						uni.setStorage({
							key: 'userinfo',
							data: res.data
						});
						uni.setStorage({
							key: 'userinfo2',
							data: res.data
						});
						app.globalData._CFG.TOKEN = res.data.token;
						app.globalData._CFG.userInfo = res.data;
						app.globalData._CFG.userInfo2 = res.data;
						uni.navigateBack({
							delta: 2
						});
					}
				})
			},
			getVerifyCode() {
				var that = this;
				// #ifdef MP-ALIPAY 
				app.globalData.getVerifyImage({}, function(res) {
					console.log(res)
					that.setData({
						numberPop: false,
						img: res,
						codevalue: ''
					});
				});
				return
				// #endif 

				app.globalData.getVerifyCode({}, function(res) {

					that.setData({
						numberPop: false,
						img: 'data:image/png;base64,' + res,
						codevalue: ''
					});
				});

			},
			HasetGA() {
				this.setData({
					Hasiphone: false,
				})
			},
			getcode() {
				var that = this;
				var mobile = this.textPhone + '-' + that.mobile;
				params.mobile = mobile;

				if (that.sendclass != 'on') {
					app.globalData.sendSms(params, function(res) {
						if (params.img_code && res.error != '0') {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							that.getVerifyCode();
						} else if (res.error == '0') {
							if (res.data.sms_code == '0') {
								that.setData({
									sendclass: 'on',
									numberPop: true,
									img: '',
									Hasiphone: true
								});

								if (currentTime > 0) {
									currentTime = maxTime;
									interval = setInterval(function() {
										currentTime--;
										that.setData({
											time: currentTime
										});

										if (currentTime <= 0) {
											clearInterval(interval);
											currentTime = 60;
											that.setData({
												sendclass: '',
												time: currentTime,
												sendbtn: '重新发送',

											});
										}
									}, 1000);
								} else {
									uni.showToast({
										title: '短信已发到您的手机，请稍后重试!',
										icon: 'loading',
									});
								}
							} else {
								that.getVerifyCode(); // that.setData({
								//     numberPop: false,
								//     img: app._CFG.BASE_API + '?API=magic/verify&PHPSESSID=' + app._CFG.PHPSESSID
								// })
							}
						} else {
							uni.showToast({
								title: res.message
							});
							// app.globalData.topage(1, 'back');
						}
					});
				}
			},

			cancel() {
				this.setData({
					numberPop: true,
					codevalue: '',
					img: ''
				});
			},

			submit: function(e) {
				var that = this;
				var mobile = this.textPhone + '-' + that.mobile;
				var code = that.code;

				if (that.hasInter) {
					var userInfo = app.globalData._CFG.userInfo;
					var nickname = userInfo && userInfo.nickName ? userInfo.nickName : '';
					var headimgurl = userInfo && userInfo.avatarUrl ? userInfo.avatarUrl : '';
					var wx_openid = app.globalData._CFG.wx_openid;
					var wx_unionid = app.globalData._CFG.wx_unionid;
					var ali_openid = app.globalData._CFG.ali_openid;
				}


				if (!that.hasInter) {
					if (that.hasZevalue) {
						app.globalData.getClientLogin({
							mobile: mobile,
							'sms_code': code,
						}, function(res) {
							if (res.error != 0) {
								uni.showToast({
									title: res.message
								});
							} else if (res.error == 0) {
								uni.setStorage({
									key: 'token',
									data: res.data.token
								});
								uni.setStorage({
									key: 'userinfo',
									data: res.data
								});
								uni.setStorage({
									key: 'userinfo2',
									data: res.data
								});
								app.globalData._CFG.TOKEN = res.data.token;
								app.globalData._CFG.userInfo = res.data;
								uni.navigateBack({
									delta: 2
								});
							}
						});
					} else {
						console.log(2222)
						app.globalData.getClientSignup({
							mobile: mobile,
							'sms_code': code,
							passwd: that.valuecode
						}, function(res) {
							if (res.error != 0) {
								uni.showToast({
									title: res.message
								});
							} else if (res.error == 0) {
								uni.setStorage({
									key: 'token',
									data: res.data.token
								});
								uni.setStorage({
									key: 'userinfo',
									data: res.data
								});
								uni.setStorage({
									key: 'userinfo2',
									data: res.data
								});
								app.globalData._CFG.TOKEN = res.data.token;
								app.globalData._CFG.userInfo = res.data;
								uni.navigateBack({
									delta: 2
								});
							}
						});
					}
				} else {
					console.log(3333)
					// #ifdef MP-WEIXIN
					app.globalData.wxbind({
						'mobile': mobile,
						'sms_code': code,
						'wx_openid': wx_openid,
						'wx_unionid': wx_unionid,
						// 'wx_nickname': wx_nickname,
						// 'wx_headimgurl': wx_headimgurl,
						'check_sms': 1
					}, that.submitResponseCallback, true);
					// #endif
					// #ifdef MP-ALIPAY
					app.globalData.alipayBind({
						'mobile': mobile,
						'sms_code': code,
						'ali_openid': ali_openid,
						'check_sms': 1
					}, that.submitResponseCallback, true);
					// #endif
				}
			},
		}
	};
</script>
<style scoped>
	.potionetion {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 90rpx;
		background: #FFFFFF;
		box-shadow: 0px -2rpx 10rpx 0px rgba(174, 182, 196, 0.2);
		font-size: 28rpx;
		text-align: center;
		color: #3B96B1;
		line-height: 90rpx;
	}

	.contentView {
		min-height: 100vh;
		background: white;
	}

	.name_top {
		font-size: 48rpx;
		font-weight: 600;
		color: #3E4248;
		line-height: 67rpx;
		margin-top: 70rpx;
	}

	.iphone_name {
		margin-top: 164rpx;
		font-weight: 600;
		color: #3E4248;
		line-height: 40rpx;
		font-size: 28rpx;
	}

	.bindingForm_box {
		padding-top: 20rpx;
		width: 100%;
		overflow: hidden
	}

	.name_botom {
		font-size: 28rpx;

		color: #3E4248;
		line-height: 40rpx;
	}

	.bindingForm {
		padding: 0 60rpx;
		overflow: hidden
	}

	.bindingForm .int_box {
		position: relative;
		background: #fff;
	}

	.bindingForm .int_box:first-child {
		border-bottom: 2rpx solid #DDDDDD;
	}

	.bindingForm .int_box input {
		width: 100%;
		height: 80rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.xian {
		width: 1rpx;
		height: 24rpx;
		background: #E6E6E6;
	}

	.bindingForm .int_box .send {
		position: absolute;
		z-index: 10;
		right: 16rpx;
		height: 54rpx;
		line-height: 54rpx;
		top: 14rpx;
		font-size: 24rpx;
		padding: 0 16rpx;
		color: #fff;
		background: #ff9900;
	}

	.bindingForm .int_box .send.on {
		background: #ccc;
	}

	.section__title {
		padding: 20rpx;
		font-size: 24rpx;
		color: #999;
	}

	.long_btn {
		margin: 20rpx 30rpx;
		height: 76rpx;
		line-height: 76rpx;
		background: #ff797c;
		font-size: 30rpx;
		color: #fff;
	}

	.long_btn1 {
		margin: 20rpx 30rpx;
		height: 76rpx;
		line-height: 76rpx;
		width: 300rpx;
		border: 1rpx #ff797c solid;
		font-size: 30rpx;
		color: #ff797c;
	}

	.long_btn2 {
		margin: 20rpx 30rpx;
		height: 76rpx;
		line-height: 76rpx;
		width: 300rpx;
		background: #ff797c;
		font-size: 30rpx;
		color: #fff;
	}

	.long_btn3 {
		margin: 20rpx 30rpx;
		height: 76rpx;
		line-height: 76rpx;

		background: #ff797c;
		font-size: 30rpx;
		color: #fff;
	}

	.numberPop {
		width: 100%;
		height: 100%;
	}

	.mask_bg2 {
		position: fixed;
		z-index: 99;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		left: 0;
		width: 100%;
		height: 100%;
		background: #000;
		opacity: 0.4;
	}

	.piccode {
		width: 90%;
		position: fixed;
		top: 50%;
		left: 5%;
		height: 360rpx;
		background: #fff;
		z-index: 100;
		margin-top: -180rpx;
		border-radius: 8rpx;
		transform: scale(0, 0)
	}

	.piccode image {
		width: 204rpx;
		height: 76rpx;
		border: 2rpx solid #dedede;
	}

	.piccode .title {
		font-size: 32rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		box-sizing: border-box;
	}

	.piccode .content {
		display: flex;
		padding: 40rpx;
		justify-content: space-between;
	}

	.piccode.active {
		transform: scale(1, 1);
		transition: all .3s;
	}

	.piccode .content input {
		width: 360rpx;
		height: 76rpx;
		border: 2rpx solid #Dedede;
		font-size: 32rpx;
	}

	.piccode .btns {
		height: 100rpx;
		font-size: 28rpx;
		text-align: center;
		line-height: 100rpx;
		display: flex;
		box-sizing: border-box;
	}

	.piccode .btns view {
		flex: 1;
	}

	.ipt {
		right: 9999px;
		position: fixed;
		top: 9999px;
		height: 82rpx;
		opacity: 0;
		z-index: 99;
		outline: none;
		width: 630rpx;
	}

	.btn-area {


		color: white;
	}

	.cascca {
		font-size: 26rpx;
		color: #00656B;
		line-height: 37rpx;
		margin-top: 30rpx;
	}

	.country {
		width: 630rpx;
		background: white;
		background: #FFFFFF;
		border-radius: 30rpx 30rpx 0px 0px;
		position: fixed;
		bottom: 0;
		padding: 30rpx 60rpx;
		z-index: 100;
	}

	.country .Code {
		font-size: 32rpx;
		margin-bottom: 30rpx;
		font-weight: bold;
		color: #3E4248;
		line-height: 37rpx;
	}

	.iconbg {
		width: 582rpx;
		height: 32rpx;
		position: relative;
		margin-top: 20rpx;
		padding: 24rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #3E4248;
		justify-content: space-between;
	}

	.iconbg .icon {
		width: 630rpx;
		height: 80rpx;
		position: absolute;
		top: 0;
		left: 0;
	}

	.iconGj {
		width: 52rpx;
		height: 32rpx;
	}

	.content {
		position: relative;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 80rpx;
	}

	.contentipt {
		height: 80rpx;
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 100;
	}

	.iptbox {
		width: 80rpx;
		height: 80rpx;
		border-bottom: 1rpx solid #DDDDDD;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwTmdkZVVKJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUJBQWlCLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxnQkFBZ0I7QUFDaEUsYUFBYSxVQUFVLENBQUMsZ0JBQWdCO0FBQ3hDLHNCQUFzQixrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUMzRCxtQ0FBbUMsOEJBQThCLENBQUM7QUFDbEUsNEJBQTRCLFdBQVcsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO0FBQzNHLDRCQUE0QixrQkFBa0IsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixDQUFDO0FBQy9MLCtCQUErQixnQkFBZ0IsQ0FBQztBQUNoRCxnQkFBZ0IsY0FBYyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQztBQUM5RCxXQUFXLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7QUFDdEgsV0FBVyxXQUFXLENBQUMsWUFBWSxDQUFDO0FBQ3BDLFlBQVksY0FBYyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVDVjdDLG9CQUFBLENBQUEsaURBQUEsQ0FBQSw0Q0FBQSxDQUFBLGdCQUFBLENEVStDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUM7QUFDN0csU0FBUyxVQUFVLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0I7QUFDL0osZUFBZSxhQUFhLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDO0FBQ3JFLGdCQUFnQixnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLENBQUM7QUFDOUcsa0JBQWtCLGFBQWEsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUM7QUFDOUUsZ0JBQWdCLG9CQUFvQixDQUFDLG1CQUFtQixDQUFDO0FBQ3pELHdCQUF3QixhQUFhLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLGdCQUFnQixDQUFDO0FBQy9GLGVBQWUsY0FBYyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztBQUMzSCxvQkFBb0IsT0FBTyxDQUFDIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5iaW5kaW5nRm9ybV9ib3h7cGFkZGluZy10b3A6IDIwcnB4OyB3aWR0aDoxMDAlO292ZXJmbG93OiBoaWRkZW59XHJcbi5iaW5kaW5nRm9ybXt3aWR0aDoxMDAlO292ZXJmbG93OiBoaWRkZW59XHJcbi5iaW5kaW5nRm9ybSAuaW50X2JveHtwb3NpdGlvbjogcmVsYXRpdmU7IGJhY2tncm91bmQ6ICNmZmY7fVxyXG4uYmluZGluZ0Zvcm0gLmludF9ib3g6Zmlyc3QtY2hpbGR7IGJvcmRlci1ib3R0b206IDJycHggc29saWQgI2VlZTt9XHJcbi5iaW5kaW5nRm9ybSAuaW50X2JveCBpbnB1dHt3aWR0aDogMTAwJTsgaGVpZ2h0OiA4MHJweDsgcGFkZGluZy1sZWZ0OiAyMHJweDsgZm9udC1zaXplOiAyOHJweDsgY29sb3I6ICMzMzM7fVxyXG4uYmluZGluZ0Zvcm0gLmludF9ib3ggLnNlbmR7cG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiAxMDsgcmlnaHQ6IDE2cnB4OyBoZWlnaHQ6IDU0cnB4OyBsaW5lLWhlaWdodDogNTRycHg7IHRvcDogMTRycHg7IGZvbnQtc2l6ZTogMjRycHg7IHBhZGRpbmc6IDAgMTZycHg7IGNvbG9yOiAjZmZmOyBiYWNrZ3JvdW5kOiAjZmY5OTAwO31cclxuLmJpbmRpbmdGb3JtIC5pbnRfYm94IC5zZW5kLm9ue2JhY2tncm91bmQ6ICNjY2M7fVxyXG4uc2VjdGlvbl9fdGl0bGV7cGFkZGluZzogMjBycHg7IGZvbnQtc2l6ZTogMjRycHg7IGNvbG9yOiAjOTk5O31cclxuLmxvbmdfYnRueyBtYXJnaW46IDIwcnB4IDMwcnB4OyBoZWlnaHQ6IDc2cnB4OyBsaW5lLWhlaWdodDogNzZycHg7IGJhY2tncm91bmQ6ICMyMEFEMjA7IGZvbnQtc2l6ZTogMzBycHg7IGNvbG9yOiAjZmZmO31cclxuLm51bWJlclBvcHt3aWR0aDogMTAwJTtoZWlnaHQ6IDEwMCU7fVxyXG4ubWFza19iZzJ7ICBwb3NpdGlvbjpmaXhlZDsgei1pbmRleDo5OTsgdG9wOjA7IGxlZnQ6MDsgd2lkdGg6MTAwJTsgaGVpZ2h0OjEwMCU7IGJhY2tncm91bmQ6IzAwMDsgb3BhY2l0eTowLjQ7fVxyXG4ucGljY29kZXt3aWR0aDogOTAlO3Bvc2l0aW9uOiBmaXhlZDt0b3A6IDUwJTtsZWZ0OiA1JTtoZWlnaHQ6IDM2MHJweDtiYWNrZ3JvdW5kOiAjZmZmO3otaW5kZXg6IDEwMDttYXJnaW4tdG9wOiAtMTgwcnB4O2JvcmRlci1yYWRpdXM6IDhycHg7dHJhbnNmb3JtOnNjYWxlKDAsMCl9XHJcbi5waWNjb2RlIGltYWdle3dpZHRoOiAyMDRycHg7aGVpZ2h0OiA3NnJweDtib3JkZXI6MnJweCBzb2xpZCAjZGVkZWRlO31cclxuLnBpY2NvZGUgLnRpdGxle2ZvbnQtc2l6ZTogMzJycHg7aGVpZ2h0OiAxMDBycHg7dGV4dC1hbGlnbjogY2VudGVyO2xpbmUtaGVpZ2h0OiAxMDBycHg7Ym94LXNpemluZzogYm9yZGVyLWJveDt9XHJcbi5waWNjb2RlIC5jb250ZW50e2Rpc3BsYXk6IGZsZXg7cGFkZGluZzogNDBycHg7anVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO31cclxuLnBpY2NvZGUuYWN0aXZle3RyYW5zZm9ybTpzY2FsZSgxLDEpO3RyYW5zaXRpb246IGFsbCAuM3M7fVxyXG4ucGljY29kZSAuY29udGVudCBpbnB1dHt3aWR0aDogMzYwcnB4O2hlaWdodDogNzZycHg7Ym9yZGVyOjJycHggc29saWQgI0RlZGVkZTtmb250LXNpemU6IDMycnB4O31cclxuLnBpY2NvZGUgLmJ0bnN7aGVpZ2h0OiAxMDBycHg7Zm9udC1zaXplOiAyOHJweDt0ZXh0LWFsaWduOiBjZW50ZXI7bGluZS1oZWlnaHQ6IDEwMHJweDtkaXNwbGF5OiBmbGV4O2JveC1zaXppbmc6IGJvcmRlci1ib3g7fVxyXG4ucGljY29kZSAuYnRucyB2aWV3e2ZsZXg6IDE7fVxyXG5cclxuXHJcblxyXG5cclxuIixudWxsXX0= */
</style>