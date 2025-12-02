<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view class="canUse">
			<!-- 需要使用 button 来授权登录 -->
			<!-- #ifdef MP-WEIXIN || MP-BAIDU-->

			<button v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
			<view v-else>请升级微信版本</view>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<button v-if="canIUse" open-type="getAuthorize" @getAuthorize="bindGetUserInfo"
				scope='userInfo'>立即登录</button>
			<view v-else>请升级支付宝版本</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<button @tap="bindgetuserinfo">登录</button>
			<!-- #endif -->

		</view>
	</view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
				canIUse: uni.canIUse('button.open-type.getUserInfo'),
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onShareAppMessage: function() {},
		methods: {
			//获取授权
			bindGetUserInfo: function(e) {
				console.log("获取授权", e.detail.userInfo);
				// #ifdef MP-ALIPAY||H5
				let url = "../bindingauto/bindingauto";
				__APP.topage(url, "redirect");
				return
				// #endif 

				if (e.detail.userInfo == null) {
					app.globalData.topage(1, 'back');
				} else {
					var res = e.detail;
					uni.setStorage({
						key: 'userinfo',
						data: res.userInfo
					});
					uni.setStorage({
						key: 'userinfo2',
						data: res.userInfo
					});
					app.globalData._CFG.userInfo = res.userInfo;
					app.globalData._CFG.userInfo2 = res.userInfo;
					app.globalData.endata({
						"endata": res.encryptedData,
						"iv": res.iv,
						"code": app.globalData._CFG.wx_code
					}, function(ret) {
						if (ret.error != "0") {
							uni.showToast({
								title: ret.message
							});
						} else {
							uni.setStorage({
								key: 'unionid',
								data: ret.data.unionId
							});
							uni.setStorage({
								key: 'wx_openid',
								data: ret.data.openId
							});
							app.globalData._CFG.wx_info = ret.data;
							app.globalData._CFG.wx_openid = ret.data.openId;
							app.globalData._CFG.wx_unionid = ret.data
							.unionId; //   app.InitLogin(app.onLogin_callback);

							app.globalData.topage(1, 'back');
						}
					});
				}

				;
			}
		}
	};
</script>
<style>
	/* pages/getAuthorize/getAuthorize.wxss */
	.canUse {
		text-align: center;
		padding: 20px;
	}

	
</style>