<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<!-- 提示框引入-开始 -->

				<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
					<block v-if="showToast.isShow? showToast.isShow: false">
						<view class="toast-center">
							<view class="toast">
								<image class="toast-icon" :src="showToast.icon" mode="scaleToFill"
									v-if="showToast.icon"></image>
								<text class="toast-text">{{showToast.title}}</text>
							</view>
						</view>
					</block>
				</block>
				<!-- 提示框引入-结束 -->
				<!-- 用户点击手势调用授权设置-开始 -->

				<block data-type="template" data-is="pubset" data-attr="OpenSettingShow,OpenSettingType">
					<view class="pubOpenSetting" v-if="OpenSettingShow">
						<view class="cont">
							<view class="txt black6">获取用户授权</view>
							<view class="btn_box">
								<view class="btn cancel" @tap="closeSetting">取消</view>
								<view class="btn confirm" @tap="closeSetting">确定<button
										:open-type="OpenSettingType"></button></view>
							</view>
						</view>
					</view>
				</block>
				<!-- 用户点击手势调用授权设置-结束 -->
				<view class="page">
					<view class="mine_info mb10">
						<view class="nr_box">
							<block v-if="user_info.nickname==''">
								<view class="no_login in_login">
									<!-- <view class="text">Hi,等你好久了!</view> -->
									<image src="/static/image/mine/waimai_myHead3x.png" class="img"></image>
									<view class="login_btn">
										立即登录
										<!-- #ifdef MP-WEIXIN || MP-BAIDU-->
										<button open-type="getUserInfo" @getuserinfo="bindgetuserinfo">登录</button>
										<!-- #endif -->
										<!-- #ifdef MP-ALIPAY -->
										<!-- <button   open-type="getAuthorize"  @getAuthorize="alGetUserInfo" scope='userInfo' >立即登录</button> -->
										<button @click="alGetUserInfo" scope='userInfo'>立即登录</button>
										<!-- #endif -->
										<!-- #ifdef H5 -->
										<button @tap="bindgetuserinfo">登录</button>
										<!-- #endif -->
										<!-- <button open-type="getUserInfo" @getuserinfo="bindgetuserinfo"></button> -->
										<view>登陆后享受更多特权</view>
									</view>
								</view>
							</block>
							<block v-else>
								<view class="in_login pub_list">
									<image class="img" :src="user_info.face"></image>
									<view class="pub_list_bd">
										<view class="name">{{user_info.nickname}}</view>
										<view>{{user_info.tel}}</view>
									</view>
									<!--  -->
									<view class="sign" @tap="toSign" v-if="haveSignin.have_signin == '1'">
										<image class="ico" src="/static/image/btn_qiandao3x.png"></image>
										签到
									</view>
								</view>
								<view class="headerList">
									<view class="headerLi" @tap="to3">
										<view class="liTop">{{userInfo.money}}</view>
										<view class="liBottom">余额</view>
									</view>
									<view class="headerLi" @tap="to2">
										<view class="liTop">{{userInfo.hongbao_count}}</view>
										<view class="liBottom">红包</view>
									</view>
									<view class="headerLi" @tap="toMyCoupon">
										<view class="liTop">{{userInfo.coupon_count}}</view>
										<view class="liBottom">优惠券</view>
									</view>
									<view class="headerLi" @tap="toJifen">
										<view class="liTop">{{userInfo.jifen}}</view>
										<view class="liBottom">积分</view>
									</view>
								</view>
							</block>
						</view>
					</view>

					<view class="flex-wrp" style="padding: 0 30rpx;height: 170rpx;margin-top: 30rpx;">
						<image @click="wsswOder()" src="../../static/image/cion_minb.png"
							style="width: 220rpx; height: 160rpx;flex-shrink: 0;" mode="aspectFill"></image>
						<view class="functionX ">
							<block v-for="(item, index) in linkLists[0]" :key="index">
								<view class="list" @tap="toLink" :data-type="item.type" v-if="item.type!=='order'">
									<image class="ico" :src="item.photo" mode="aspectFit"></image>
									<view class="txt">{{item.title}}</view>
								</view>
							</block>

						</view>
					</view>
					<view class="calssf_fvi">更多服务</view>


					<view class="functionY mb10">
						<block v-for="(item, index) in linkLists[1]" :key="index">
							<view class="pub_list" v-if="item.type=='kefu'&&item.type!=='stripecard'">
								<image class="ico" :src="item.photo" mode="aspectFit"></image>
								<view class="txt">{{item.title}}</view>

								<button open-type="contact" class="kefuBtn"></button>
							</view>
							<view class="pub_list" @tap="toLink" :data-type="item.type"
								v-if="item.type!='kefu'&&item.type!=='stripecard'">
								<image class="ico" :src="item.photo" mode="aspectFit"></image>
								<view class="txt">{{item.title}}</view>

							</view>
						</block>
						<block v-for="(item, index) in linkLists[2]" :key="index">
							<view class="pub_list" v-if="item.type=='kefu'" @click="kefu">
								<image class="ico" :src="item.photo" mode="aspectFit"></image>
								<view class="txt">{{item.title}}</view>

								<button open-type="contact" class="kefuBtn"></button>
							</view>
							<view class="pub_list" @tap="toLink" :data-type="item.type" v-else>
								<image class="ico" :src="item.photo" mode="aspectFit"></image>
								<view class="txt">{{item.title}}</view>

							</view>
						</block>
					</view>

					<view :hidden="islogin">
						<button @tap="signout" class="signoutbtn">退出登录</button>
					</view>
				</view>

				<!-- 升级 -->
			</view>
		</skeleton>
	</view>
</template>

<script>
	var app = getApp();
	var double = true,
		checklogin = '',
		addrNum = '0',
		collectNum = '0',
		redbagNum = '0',
		balanceNum = '0.00';

	export default {
		data() {
			return {

				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},

				dayflag: true,
				user_info: {
					nickname: "",
					face: "",
					tel: ""
				},
				topmask: true,
				linkLists: [],
				haveSignin: {
					have_signin: '',
					signin_link: ''
				},
				userInfo: {
					money: "",
					hongbao_count: "",
					coupon_count: "",
					jifen: ""
				},
				islogin: "",
				showToast: {
					isShow: false
				},
				OpenSettingShow: false
			};
		},

		components: {},
		props: {},
		onShow: function() {
			this.homeInfo()
		},
		// created() {
		// 	   //骨架屏
		//    this.reloadData()
		//  },
		onShareAppMessage: function(res) {
			return {
				title: '微信小程序外卖',
				path: '/pages/index/index'
			};
		},
		methods: {
			wsswOder() {
				uni.switchTab({
					url: '/pages/order/order'
				})
			},
			//骨架屏
			// reloadData() {
			//      this.loading = true
			//      setTimeout(() => {
			//        this.loading = false
			//      }, 3000)
			//    },

			https(nothasloading) {
				var gol = app.globalData._CFG;
				checklogin = app.globalData.CheckLogin();
				if (!app.globalData.CheckLogin()) {
					var format = {
						'nickname': '',
						'face': "/static/image/mine/waimai_myHead3x.png"
					};
					this.setData({
						user_info: format,
						islogin: true
					});
				} else {
					var that = this;
					app.globalData.mineInfo({}, function(res) {
						// console.log(res)
						if (res.error == '0') {
							var format = {
								'nickname': gol.userInfo.nickname,
								'tel': gol.userInfo.mobile,
								'face': gol.userInfo.avatarUrl || '/static/image/mine/waimai_myHead3x.png'
							};
							console.log(gol.userInfo);
							that.setData({
								user_info: format,
								islogin: false,
								userInfo: res.data
							});
						} else {
							uni.showToast({
								title: res.message
							});
						}
					}, nothasloading);
				}
			},

			//客服
			kefu() {
				// 联系客服
				uni.showToast({
					title: '加班加点开发中',
					icon: 'none',
				});
			},

			//跳转
			toLink(e) {
				var that = this,
					type = e.currentTarget.dataset.type;
				if (type == "addr") {
					//收货地址
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/addr/addr');
					});
				} else if (type == "collect") {
					//我的收藏
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/collect/collect');
					});
				} else if (type == "order") {
					//我的订单
					app.globalData.afterCheckLogin(function() {
						uni.switchTab({
							url: "/pages/order/order"
						});
					});
				} else if (type == "invite") {
					// 邀请好友
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/invite/index/index');
					});
				} else if (type == "msg") {
					// 我的消息
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/myMessage/enter/enter');
					});
				} else if (type == "jifen") {
					// 积分商城
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/outsideLink/integralMall/integralMall');
					});
				} else if (type == "qiang") {
					// 抢购
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/outsideLink/qianggou/qianggou');
					});
				} else if (type == "paotui") {
					// 跑腿
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/outsideLink/paotui/paotui');
					});
				} else if (type == "peicard") {
					// 配送会员卡
					app.globalData.afterCheckLogin(function() {
						if (that.userInfo.have_peicard > 0) {
							app.globalData.topage('/pages/membersCard/membersCard');
						} else {
							app.globalData.topage('../buyNewCard/buyNewCard');
						};
					});
				} else if (type == "hongbaopackage") {
					// 红包套餐
					app.globalData.afterCheckLogin(function() {
						app.globalData.gopage(app.globalData.URL + 'waimai/ucenter/hongbaopackage/index.html');
					});
				} else if (type == "lottery") {
					// 积分活动
					app.globalData.afterCheckLogin(function() {
						app.globalData.gopage(app.globalData.URL + "waimai/ucenter/integral/lottery.html");
					});
				} else if (type == "shop_signup") {
					// 商家入驻
					uni.showToast({
						title: '快速⼊驻请直接联系客服',
						icon: 'none',

					});
				} else if (type == "staff_signup") {
					// 骑手入驻
					uni.showToast({
						title: '快速⼊驻请直接联系客服',
						icon: 'none',

					});
				} else if (type == "about") {
					// 关于我们
					uni.showToast({
						title: '加班加点开发中',
						icon: 'none',

					});
					// uni.navigateTo({
					// 	url: "/pages/webview/webview?url=" + app.globalData.URL + '/page/about.html'
					// })

				} else if (type == "promotion") {
					// 优惠兑换码
					app.globalData.afterCheckLogin(function() {
						app.globalData.topage('/pages/couponcoderedemption/couponcoderedemption');
					});
				};
			},

			//签到
			toSign() {
				var that = this;
				app.globalData.afterCheckLogin(function() {
					app.globalData.gopage(that.haveSignin.signin_link);
				});
			},

			// 红包
			to2: function() {
				app.globalData.afterCheckLogin(function() {
					app.globalData.topage('/pages/packet/packet');
				});
			},
			// 余额
			to3: function() {
				uni.showToast({
					title: '加班加点开发中',
					icon: 'none',
				});
				// app.globalData.afterCheckLogin(function () {
				//   app.globalData.topage('/pages/ucenter/money/money');
				// });
			},
			// 跳转到优惠券
			toMyCoupon: function() {
				app.globalData.afterCheckLogin(function() {
					app.globalData.topage('/pages/myCoupon/myCoupon');
				});
			},

			//跳转到积分
			toJifen() {
				uni.showToast({
					title: '加班加点开发中',
					icon: 'none',
				});
			},

			// 判断是否白天,黑夜,早七晚七
			timebgFn: function() {
				var that = this;
				var myDate = new Date(); //获取系统当前时间

				var hours = myDate.getHours();

				if (7 <= hours && hours < 19) {
					that.setData({
						dayflag: true
					});
				} else {
					that.setData({
						dayflag: false
					});
				}
			},
			signout: function() {
				uni.showLoading({
					title: '退出登录'
				});
				app.globalData.cookies = {};
				app.globalData._CFG.TOKEN = '';
				app.globalData._CFG.userInfo = {};
				app.globalData._CFG.userInfo2 = {};
				app.globalData._CFG.wx_unionid = '';
				app.globalData._CFG.wx_openid = '';
				app.globalData.remove('userinfo', 'userinfo2', 'token', 'unionid', 'wx_openid');
				this.https();
				setTimeout(function() {
					uni.hideLoading();
				}, 500);
			},

			//授权
			closeSetting() {
				console.log(11212)
				uni.pubOpenSetting(false);
			},

			homeInfo() {
				this.loading = true
				var that = this;
				app.globalData.homeInfo({}, function(res) {
					that.loading = false
					if (res.error == "0") {
						that.setData({
							linkLists: res.data.customModule,
							haveSignin: {
								have_signin: res.data.have_signin,
								signin_link: res.data.signin_link
							}
						});
					};
				});
				that.https();
			},
			login: function() {
				let that = this;

				app.globalData.afterCheckLogin(function() {
					that.homeInfo();
				});
			},
			alGetUserInfo(e) {

				this.login()

			},
			bindgetuserinfo(e) {
				this.login();
			}
		}
	};
</script>
<style>
	page {
		background: #fff;
	}

	.calssf_fvi {
		color: #3E4248;
		margin: 37rpx 0 0 54rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 40rpx;
	}

	.topNav {
		text-align: right;
		height: 60rpx;
	}

	.topNav .ico {
		width: 80rpx;
	}

	.mine_info {
		width: 100%;
		overflow: hidden;

	}

	.no_login {
		color: #333;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;

		height: 192rpx;
		padding-top: 36rpx;
	}

	.no_login .text {
		font-size: 32rpx;
	}

	.no_login .login_btn {
		background: tr;
		border-radius: 56rpx;
		display: inline-block;
		position: relative;
		background: transparent !important;
		color: #ffffff !important;
		;
		font-size: 32rpx !important;
		;
		text-align: left;
		font-weight: 600;
	}

	.no_login .login_btn view {
		margin-top: 20rpx;
		font-size: 24rpx;
		font-weight: 400;
	}

	.in_login {
		width: 670rpx;
		height: 370rpx;
		background: linear-gradient(315deg, #FF5978 0%, #FF797C 100%);
		padding: 0 40rpx;
		position: relative;
	}

	.in_login .img {
		width: 100rpx;
		height: 100rpx;
		margin-right: 24rpx;
		border-radius: 100%;
	}

	.mine_info .pub_list_bd {
		color: #ffffff;
		font-size: 24rpx;
	}

	.mine_info .pub_list_bd .name {
		font-weight: 600;
		margin-bottom: 8rpx;
		font-size: 32rpx
	}

	.mine_info .sign {
		position: absolute;
		right: 0;
		top: 130rpx;
		font-size: 24rpx;
		color: #FFA200;
		line-height: 64rpx;
		padding: 0 24rpx;
		border-radius: 100rpx 0 0 100rpx;
		background: #F6F7FB;
	}

	.mine_info .sign .ico {
		width: 24rpx;
		height: 22rpx;
		margin-right: 12rpx;
	}

	.headerList {
		width: 690rpx;
		overflow: hidden;
		display: flex;
		padding: 16rpx 0 24rpx;
		margin-top: -60rpx;
		position: relative;
		margin-left: 30rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 16rpx 0px rgba(214, 218, 234, 0.5);
		border-radius: 16rpx;
	}

	.headerList .headerLi {
		flex: 1;
		text-align: center;
		color: #B8BED0;
		font-size: 24rpx;
	}

	.liTop {
		margin-bottom: 10rpx;
		font-size: 32rpx;
		color: #3E4248;
	}

	.functionX {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.functionX .list {
		flex-shrink: 0;
		font-size: 24rpx;
		color: #666;
		width: 180rpx;
		padding: 0 8rpx 0 32rpx;
		height: 75rpx;
		background: #ffffff;
		box-shadow: 0px 4rpx 16rpx 0px rgba(214, 218, 234, 0.5);
		border-radius: 16rpx;
		display: flex;
		flex-direction: row;
		margin: 5rpx 0 5rpx 15rpx;
		align-items: center;
	}

	.functionX .list .ico {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.functionY .pub_list {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 33%;
		background: #fff;
		padding: 22rpx 0;
	}

	.functionY {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 10rpx 30rpx 0;
		flex-wrap: wrap;
		padding: 18rpx 0 26rpx 0;
	}

	.functionY .ico {
		width: 44rpx;
		height: 44rpx;
		margin-bottom: 16rpx;
	}

	.functionY .txt {
		font-size: 24rpx;
		color: #3E4248;
	}

	.functionY .kefuBtn {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
	}

	.signoutbtn {
		margin: 40rpx 20rpx 100rpx;
		background: #fff;
		color: #555;
		font-size: 32rpx;
		height: 80rpx;
		line-height: 80rpx;
		border: none;
		box-shadow: 0px 0px 16rpx 0px rgba(214, 218, 234, 0.5);
		border-radius: 16rpx;
	}

	.no_login .login_btn>button {

		height: 56rpx;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwWDFMcXg4JTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRCQUE0QjtBQUM1QjtJQUNJLGlCQUFpQjtJQUNqQixhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksWUFBWTtBQUNoQjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGtCQUFrQjtJQUNsQixzQkFBc0I7SUFDdEIsY0FBYztJQUNkLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixhQUFhO0lBQ2Isa0JBQWtCO0lBQ2xCLDhCQUE4QjtJQUM5QixvQkFBb0I7SUFDcEIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixXQUFXO0lBQ1gsa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksY0FBYztJQUNkLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixjQUFjO0lBQ2QsbUJBQW1CO0lBQ25CLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsUUFBUTtJQUNSLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsZ0NBQWdDO0lBQ2hDLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFlBQVk7SUFDWixhQUFhO0lBQ2IsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksT0FBTztJQUNQLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxPQUFPO0lBQ1AsZ0JBQWdCO0lBQ2hCLFdBQVc7QUFDZjs7QUFFQTtJQUNJLFlBQVk7SUFDWixhQUFhO0lBQ2IsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsb0JBQW9CO0FBQ3hCOztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLGFBQWE7SUFDYixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLE9BQU87SUFDUCxNQUFNO0lBQ04sVUFBVTtBQUNkOztBQUVBO0lBQ0ksbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixXQUFXO0lBQ1gsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsYUFBYTtJQUNiLFVBQVU7SUFDVixrQkFBa0I7SUFDbEIsTUFBTTtJQUNOLE9BQU87SUFDUCxRQUFRO0lBQ1IsU0FBUztBQUNiIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHBhZ2V7YmFja2dyb3VuZDogI2ZmZjt9ICovXHJcbi50b3BOYXYge1xyXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgICBoZWlnaHQ6IDYwcnB4O1xyXG59XHJcblxyXG4udG9wTmF2IC5pY28ge1xyXG4gICAgd2lkdGg6IDgwcnB4O1xyXG59XHJcblxyXG4ubWluZV9pbmZvIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbn1cclxuXHJcbi5ub19sb2dpbiB7XHJcbiAgICBjb2xvcjogIzMzMztcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICBoZWlnaHQ6IDE5MnJweDtcclxuICAgIHBhZGRpbmctdG9wOiAzNnJweDtcclxufVxyXG5cclxuLm5vX2xvZ2luIC50ZXh0IHtcclxuICAgIGZvbnQtc2l6ZTogMzJycHg7XHJcbn1cclxuXHJcbi5ub19sb2dpbiAubG9naW5fYnRuIHtcclxuICAgIHdpZHRoOiAyMDBycHg7XHJcbiAgICBoZWlnaHQ6IDU2cnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDU2cnB4O1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTZycHg7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAzMHJweDtcclxuICAgIGNvbG9yOiAjNjY2O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uaW5fbG9naW4ge1xyXG4gICAgcGFkZGluZzogMzJycHg7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuXHJcbi5pbl9sb2dpbiAuaW1nIHtcclxuICAgIHdpZHRoOiAxMjhycHg7XHJcbiAgICBoZWlnaHQ6IDEyOHJweDtcclxuICAgIG1hcmdpbi1yaWdodDogMzBycHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMDAlO1xyXG59XHJcblxyXG4ubWluZV9pbmZvIC5wdWJfbGlzdF9iZCB7XHJcbiAgICBjb2xvcjogIzMzMztcclxuICAgIGZvbnQtc2l6ZTogMjhycHg7XHJcbn1cclxuXHJcbi5taW5lX2luZm8gLnB1Yl9saXN0X2JkIC5uYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogMzZycHg7XHJcbn1cclxuXHJcbi5taW5lX2luZm8gLnNpZ24ge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICB0b3A6IDYwcnB4O1xyXG4gICAgZm9udC1zaXplOiAyNHJweDtcclxuICAgIGNvbG9yOiAjRkZBMjAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDY0cnB4O1xyXG4gICAgcGFkZGluZzogMCAyNHJweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwMHJweCAwIDAgMTAwcnB4O1xyXG4gICAgYmFja2dyb3VuZDogI0Y2RjdGQjtcclxufVxyXG5cclxuLm1pbmVfaW5mbyAuc2lnbiAuaWNvIHtcclxuICAgIHdpZHRoOiAyNHJweDtcclxuICAgIGhlaWdodDogMjJycHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDEycnB4O1xyXG59XHJcblxyXG4uaGVhZGVyTGlzdCB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgcGFkZGluZzogMjRycHggMDtcclxufVxyXG5cclxuLmhlYWRlckxpc3QgLmhlYWRlckxpIHtcclxuICAgIGZsZXg6IDE7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBjb2xvcjogIzk5OTtcclxuICAgIGZvbnQtc2l6ZTogMjRycHg7XHJcbn1cclxuXHJcbi5saVRvcCB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA1cnB4O1xyXG4gICAgZm9udC1zaXplOiAzNnJweDtcclxuICAgIGNvbG9yOiAjMzMzO1xyXG59XHJcblxyXG4uZnVuY3Rpb25YIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgcGFkZGluZzogMjRycHggMDtcclxufVxyXG5cclxuLmZ1bmN0aW9uWCAubGlzdCB7XHJcbiAgICBmbGV4OiAxO1xyXG4gICAgZm9udC1zaXplOiAyNHJweDtcclxuICAgIGNvbG9yOiAjNjY2O1xyXG59XHJcblxyXG4uZnVuY3Rpb25YIC5saXN0IC5pY28ge1xyXG4gICAgd2lkdGg6IDU2cnB4O1xyXG4gICAgaGVpZ2h0OiA1NnJweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDRycHg7XHJcbn1cclxuXHJcbi5mdW5jdGlvblkgLnB1Yl9saXN0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgcGFkZGluZzogMjBycHggMjRycHg7XHJcbn1cclxuXHJcbi5mdW5jdGlvblkge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uZnVuY3Rpb25ZIC5pY28ge1xyXG4gICAgd2lkdGg6IDQ4cnB4O1xyXG4gICAgaGVpZ2h0OiA0OHJweDtcclxuICAgIG1hcmdpbi1yaWdodDogMTJycHg7XHJcbn1cclxuXHJcbi5mdW5jdGlvblkgLnR4dCB7XHJcbiAgICBmb250LXNpemU6IDI2cnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDQwcnB4O1xyXG59XHJcblxyXG4uZnVuY3Rpb25ZIC5wdWJfbGlzdF9iZCB7XHJcbiAgICBmb250LXNpemU6IDI0cnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDQwcnB4O1xyXG4gICAgY29sb3I6ICNjY2M7XHJcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG5cclxuLmZ1bmN0aW9uWSAubGlua2ljbyB7XHJcbiAgICB3aWR0aDogMTJycHg7XHJcbiAgICBoZWlnaHQ6IDIycnB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDhycHg7XHJcbiAgICBvcGFjaXR5OiAwLjg7XHJcbn1cclxuXHJcbi5mdW5jdGlvblkgLmtlZnVCdG4ge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgb3BhY2l0eTogMDtcclxufVxyXG5cclxuLnNpZ25vdXRidG4ge1xyXG4gICAgbWFyZ2luOiA0MHJweCAyMHJweDtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBjb2xvcjogIzU1NTtcclxuICAgIGZvbnQtc2l6ZTogMzJycHg7XHJcbiAgICBoZWlnaHQ6IDgwcnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDgwcnB4O1xyXG59XHJcblxyXG4ubm9fbG9naW4gLmxvZ2luX2J0bj5idXR0b24ge1xyXG4gICAgd2lkdGg6IDIwMHJweDtcclxuICAgIGhlaWdodDogNTZycHg7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgYm90dG9tOiAwO1xyXG59Il19 */
</style>