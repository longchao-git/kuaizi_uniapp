<script>
	var __APP = null;
	let isNumber = 0
	let charts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
		'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
	];
	require("./utils/showToast.js");

	export default {
		globalData: {
			// URL: "https://test.aioeuropa.com",
			URL: "https://www.aioeuropa.com",
			// URL: "https://aiolife.net",
			// URL: "http://aiolocal.com",
			// URL: "https://3f3f2870a504.ngrok.io",
			// URL: "https://67619f188cb6.ngrok.io",
			// URL: "https://6d27c0571a48.ngrok.io",

			// 正式服
			city_id: '',
			cookies: {},

			// 获取用户位置授权状态
			getUserLocationState(callback) {
				callback = callback || function() {};
				//#ifdef H5
				__APP.getLocation(callback);
				return
				//#endif
				uni.getSetting({
					success(res) {
						//#ifdef MP-WEIXIN
						if (res.authSetting['scope.userLocation'] != undefined && !res.authSetting[
								'scope.userLocation']) {
							uni.showModal({
								content: '请打开微信定位',
								success(res1) {
									if (res1.confirm) {
										uni.openSetting({
											success(res2) {
												if (res2.authSetting['scope.userLocation']) {
													__APP.getLocation(callback);
												}
											}

										});
									}
								}

							});
						}
						//#endif
						//#ifdef MP-ALIPAY
						if (res.authSetting.userLocation != undefined && !res.authSetting.userLocation) {
							uni.showModal({
								content: '请打开支付宝定位',
								success(res1) {
									if (res1.confirm) {
										uni.openSetting({
											success(res2) {
												if (res2.authSetting['scope.userLocation']) {
													__APP.getLocation(callback);
												}
											}

										});
									}
								}

							});
						}
						//#endif

					}

				});
			},

			// 获取用户信息授权状态
			getUserInfoState(callback) {
				callback = callback || function() {};
				//#ifdef  MP-ALIPAY || H5
				__APP.onLogin(function() {
					if (__APP.CheckLogin()) {
						callback();
					} else {
						let url = "../bindingauto/bindingauto";
						__APP.topage(url, "redirect");
					};
				}, true);
				return
				//#endif
				uni.getSetting({
					success(res) {

						if (res.authSetting['scope.userInfo'] != undefined) {
							if (!res.authSetting['scope.userInfo']) {
								uni.openSetting({
									success(res2) {
										if (res2.authSetting['scope.userInfo']) {
											__APP.onLogin(function() {
												if (__APP.CheckLogin()) {
													callback();
												} else {
													let url = "../bindingauto/bindingauto";

													__APP.topage(url, "redirect");
												}

												;
											}, true);
										}
									}
								});
							} else {
								__APP.onLogin(function() {
									if (__APP.CheckLogin()) {
										callback();
									} else {
										let url = "../bindingauto/bindingauto";

										__APP.topage(url, "redirect");
									};
								}, true);
							};
						} else {
							var url = "../bindUserInfo/bindUserInfo";
							__APP.topage(url, "redirect");
						};
					}
				});
			},
			//获取地址经纬度；
			getLocation: function(callback) {
				callback = callback || function() {};
				if ((__APP._CFG.lng == undefined || __APP._CFG.lat == undefined) && isNumber == 0) {
					isNumber++

					uni.getLocation({
						type: 'gcj02',
						altitude: true,
						// 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
						success: function(res) {

							__APP._CFG.lng = res.longitude.toString();
							__APP._CFG.lat = res.latitude.toString();
							__APP._CFG.currentlng = __APP._CFG.lng;
							__APP._CFG.currentlat = __APP._CFG.lat;
							callback();
						},
						fail: function(err) {
							console.log(err)

							__APP._CFG.lng = '-3.709870'
							__APP._CFG.lat = '40.422980'
							__APP._CFG.currentlng = __APP._CFG.lng;
							__APP._CFG.currentlat = __APP._CFG.lat;
							callback();
							return
							//#ifdef H5
							//#endif
							isNumber = 0
							__APP.msgbox('定位失败');
							setTimeout(() => {
								uni.pubOpenSetting(true, "openSetting");
							}, 1500);
						}
					});
				} else {
					callback();
				};
			},
			//用户登录；
			onLogin: function(callback) {
				__APP.onLogin_callback = callback || function() {};

				if (!__APP._CFG.TOKEN) {
					if (__APP._CFG.wx_unionid) {

						__APP.InitLogin(__APP.onLogin_callback);
					} else {

						//#ifdef H5
						console.log('H5直接跳转登录页')
						__APP.topage('/pages/binding/binding');
						return
						//#endif
						// uni.showLoading({
						// 	title:"获取授权中"
						// })
						// return
						uni.login({
							scopes: 'auth_user',
							complete: () => {
								uni.hideLoading()
							},
							fail: () => {
								__APP.msgbox('您未授权，无法进行登录', "/static/image/error.png");
							},
							success: function(rs) {

								if (rs.code) { // 可以通过 getSetting 先查询一下用户是否授权了 "userInfo" 这个 scope
									__APP._CFG.auth_code = rs.code;
									// #ifdef MP-ALIPAY

									__APP.alipayAuthToken({
											'code': rs.code
										},
										function(res) {
											if (res.error == 0) {
												console.log('服务端auth认证用户id：' + res.data.ali_openid)
												__APP._CFG.ali_openid = res.data.ali_openid
												uni.setStorage({
													key: 'ali_openid',
													data: res.data.ali_openid
												});
												__APP.InitLogin(__APP.onLogin_callback);
											} else {
												__APP.msgbox(res.msg, "/static/image/error.png");
											}
										});
									return
									// #endif	
									uni.getSetting({
										success(rt) {
											console.log(rt)
											console.log(rt.authSetting['scope.userInfo'])
											if (rt.authSetting['scope.userInfo'] != undefined) {
												if (rt.authSetting['scope.userInfo']) {
													uni.getUserInfo({
														success: function(res) {
															uni.setStorage({
																key: 'userinfo',
																data: res
																	.userInfo
															});
															uni.setStorage({
																key: 'userinfo2',
																data: res
																	.userInfo
															});
															__APP._CFG.userInfo = res
																.userInfo;
															__APP._CFG.userInfo2 = res
																.userInfo;
															// #ifdef MP-WEIXIN
															__APP.http(
																"client/wxapp/endata", {
																	"endata": res
																		.encryptedData,
																	"iv": res.iv,
																	"code": __APP
																		._CFG
																		.auth_code
																},
																(ret) => {
																	if (ret
																		.error !=
																		"0") {
																		__APP
																			.msgbox(
																				retmessage,
																				"/static/image/error.png"
																			);
																	} else {
																		uni.setStorage({
																			key: 'unionid',
																			data: ret
																				.data
																				.unionId
																		});
																		uni.setStorage({
																			key: 'wx_openid',
																			data: ret
																				.data
																				.openId
																		});
																		__APP._CFG
																			.wx_info =
																			ret
																			.data;
																		__APP._CFG
																			.wx_openid =
																			ret
																			.data
																			.openId;
																		__APP._CFG
																			.wx_unionid =
																			ret
																			.data
																			.unionId;
																		__APP
																			.InitLogin(
																				__APP
																				.onLogin_callback
																			);
																	}
																});
															// #endif

														}
													});
												}
											} else {
												//去授权
												console.log('去授权')
												// __APP.topage("../getAuthorize/getAuthorize");
												//启动授权设置
												uni.pubOpenSetting(true, "getUserInfo");
											}
										}
									});
								}
							},

						});
					}
				} else {
					__APP.onLogin_callback();
				};
			},

			InitLogin: function(callback) {
				callback = callback || function() {};
				__APP.http('client/passport/login', {
						//#ifdef MP-ALIPAY
						'ali_openid': __APP._CFG.ali_openid,
						//#endif
						//#ifdef MP-WEIXIN
						'wx_unionid': __APP._CFG.wx_unionid,
						'wx_openid': __APP._CFG.wx_openid,
						'wx_nickname': __APP._CFG.userInfo.nickName,
						'wx_headimgurl': __APP._CFG.userInfo.avatarUrl || '',
						//#endif
					},
					function(ret) {
						if (ret.error == "105") {
							__APP.topage('/pages/binding/binding');
						} else if (ret.error != "0") {
							__APP.msgbox(ret.message, "/static/image/error.png");
							callback();
						} else {
							uni.setStorage({
								key: 'token',
								data: ret.data.token
							});
							uni.setStorage({
								key: 'userinfo',
								data: ret.data
							});
							uni.getUserInfo({
								success: function(res) {
									uni.setStorage({
										key: 'userinfo2',
										data: res.userInfo
									});
									__APP._CFG.userInfo2 = res.userInfo;
								}
							});
							__APP._CFG.TOKEN = ret.data.token;
							__APP._CFG.userInfo = ret.data;
							callback();
						}
					}, true);
			},
			//检查是否登录；
			CheckLogin: function() {
				return __APP._CFG.TOKEN && __APP._CFG.TOKEN.length > 0 ? true : false;
			},
			//判断是否登陆，并执行回调函数；
			afterCheckLogin: function(callback) {
				callback = callback || function() {};

				if (__APP.CheckLogin()) {

					callback();
				} else {
					//#ifdef  MP-ALIPAY || H5

					__APP.onLogin(function() {
						if (__APP.CheckLogin()) {
							callback();
						} else {
							let url = "../bindingauto/bindingauto";
							__APP.topage(url, "redirect");
						};
					}, true);
					return
					//#endif
					uni.getSetting({
						success(rr) {
							console.log(rr)
							if (rr.authSetting['scope.userInfo'] != undefined) {
								if (!rr.authSetting['scope.userInfo']) {
									//启动授权设置
									uni.pubOpenSetting(true, "openSetting");
								} else {

									__APP.onLogin(function() {
										if (__APP.CheckLogin()) {
											callback();
										} else {
											var url = "../bindingauto/bindingauto";
											__APP.topage(url);
										};
									});

								};
							} else {
								__APP.onLogin(function() {
									callback();
								});
							};
						},
						fail(err) {
							console.log(err)
						}

					});
				}

				;
			},
			setrandom: function(n) {
				var res = '';
				for (var i = 0; i < n; i++) {
					var id = Math.ceil(Math.random() * 35);
					res += charts[id];
				}
				return res;
			},
			//api请求
			http: function(api, params, callback, nothasloading) {
				var that = this;
				let crypto = require("crypto")
				let HEADER_SIGN_KEY = "dragoon4adhere_balinese4dwindle";
				let SIGN_KEY = "AzRQBazpvKiy!_F@m-z83";
				let CLIENT_VER = __APP._CFG.version || ''
				params = params || {};
				var paramsString = JSON.stringify(params);
				let salt = (Date.parse(new Date()) / 1000).toString()
				let header_hash = crypto.createHash('md5')
				header_hash.update(HEADER_SIGN_KEY + CLIENT_VER + api + salt + paramsString)
				let header_sign = header_hash.digest('hex')
				let hash = crypto.createHash('md5')
				let token = __APP._CFG.TOKEN || ''
				let nonce = __APP.setrandom(16)
				hash.update(paramsString + token + '' + CLIENT_VER + api + nonce + salt + SIGN_KEY);
				let sign = hash.digest('hex')

				let cookies = __APP.cookies;

				var cookie = ''
				for (var key in cookies) {
					cookie += (key + '=' + cookies[key]['value'] + ';')
				}

				__APP.getLocation(() => {
					if (uni.showLoading && !nothasloading) {
						uni.showLoading({
							title: '加载中...'
						});
					}
					callback = typeof callback == 'function' ? callback : function(res) {};
					// 
					var json = {
						"CLIENT_OS": "UNIAPP",
						"CLIENT_API": "CUSTOM",
						"CLIENT_VER": CLIENT_VER,
						"WX_OPENID": __APP._CFG.wx_openid,
						"ALI_OPENID": __APP._CFG.ali_openid,
						"API": api,
						"TOKEN": __APP._CFG.TOKEN || '',
						"PHPSESSID": __APP._CFG.PHPSESSID || "",
						"LNG": __APP._CFG.lng || '',
						"LAT": __APP._CFG.lat || '',
						"CITY_ID": that.city_id || '',
						"SIGN": sign,
						"SALT": salt,
						"data": paramsString
					};
					// #ifdef MP-ALIPAY
					json.CLIENT_OS = "UNIAPP"
					// #endif
					// #ifdef MP-WEIXIN
					json.CLIENT_OS = "WXAPP"
					// #endif

					var API_BASE = that.URL + '/api/v1/' + api
					// var API_BASE = that.URL + '/api/v1/' + api + '?XDEBUG_SESSION_START=12345';
					var dataType = 'json'
					var responseType = 'text'
					if (api == 'magic/verify') {
						dataType = '其他';
						responseType = 'arraybuffer';
					}
					uni.request({
						url: API_BASE,
						dataType: dataType,
						responseType: responseType,
						data: json,
						method: "POST",
						timeout: 15000,
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Cookie': cookie,
							'x-cookie': cookie,
							'X-SALT': salt,
							'X-SIGN': header_sign,
							'X-NONCE': nonce
						},
						success: function(res) {

							uni.hideLoading();

							if (api == 'magic/verify') {
								const imageData = wx.arrayBufferToBase64(res.data);
								callback(imageData)
								return
							}
							if (api == 'magic/image') {
								// const imageData = wx.arrayBufferToBase64(res.data.data.img);
								callback(res.data.data.img)
								return
							}
							__APP.saveCookies(res);
							if (res.data.PHPSESSID) {
								__APP._CFG.PHPSESSID = res.data.PHPSESSID;
							}

							if (res.data.error == "101") {
								__APP._CFG.TOKEN = '';
								__APP._CFG.userInfo = {};
								__APP._CFG.userInfo2 = {};
								__APP._CFG.wx_unionid = '';
								__APP._CFG.wx_openid = '';

								__APP.remove('userinfo', 'userinfo2', 'token', 'unionid',
									'wx_openid');

								__APP.onLogin();
							} else if (res.data.error == "105") {
								callback(res.data);
							} else {
								callback(res.data);
							}
						},
						fail: function(error) {
							uni.hideLoading()
							__APP.msgbox('网络请求错误');
						},
						// complete: () => {
						// 	uni.hideLoading()
						// }
					});
				});
			},

			redeempromocode(params, callback, nothasloading) {
				return __APP.http('client/member/promotion/validate_code', params, callback, nothasloading); //兑换优惠码邀请码
			},

			//公用接口
			addrdecode(params, callback, nothasloading) {
				return __APP.http('/client/wxapp/addrdecode', params, callback, nothasloading); //根据经纬度获取地址城市
			},

			getcitylist(params, callback, nothasloading) {
				return __APP.http('client/data/all_cities', params, callback, nothasloading);
			},

			allcitylist: [],

			endata(params, callback, nothasloading) {
				return __APP.http('client/wxapp/endata', params, callback, nothasloading); //解码接口
			},

			sendSms(params, callback, nothasloading) {
				return __APP.http('magic/sendsms', params, callback, nothasloading); //获取手机验证码接口
			},

			getVerifyCode(params, callback, nothasloading) {
				return __APP.http('magic/verify', params, callback, nothasloading); //获取图片验证码
			},

			getVerifyImage(params, callback, nothasloading) {
				return __APP.http('magic/image', params, callback, nothasloading); //获取图片验证码
			},

			getClientPassport(params, callback, nothasloading) {
				return __APP.http('client/passport', params, callback, nothasloading);
			},

			getClientLogin(params, callback, nothasloading) {
				return __APP.http('client/passport/login', params, callback, nothasloading);
			},

			getClientSignup(params, callback, nothasloading) {
				return __APP.http('client/passport/signup', params, callback, nothasloading);
			},
			wxbind(params, callback, nothasloading) {
				return __APP.http('client/passport/wxbind', params, callback, nothasloading); //微信绑定手机号接口
			},

			alipayBind(params, callback, nothasloading) {
				return __APP.http('client/passport/alibind', params, callback, nothasloading); //微信绑定手机号接口
			},

			citys(params, callback, nothasloading) {
				return __APP.http('client/data/city', params, callback, nothasloading); //城市列表
			},

			orderInfo(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/orderinfo', params, callback, nothasloading); //订单预支付
			},

			orderPay(params, callback, nothasloading) {
				return __APP.http('client/payment/order', params, callback, nothasloading); //订单支付
			},

			//入驻接口
			enterStaff(params, callback, nothasloading) {
				return __APP.http('client/waimai/signup/staff', params, callback, nothasloading); //入驻骑手
			},

			enterShop(params, callback, nothasloading) {
				return __APP.http('client/waimai/signup/shop', params, callback, nothasloading); //入驻商家
			},

			//接口
			hotSearch(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/hotsearch', params, callback, nothasloading); //搜索热词
			},

			shopSearchs(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/search', params, callback, nothasloading); //获取搜索商家列表结果接口
			},

			home(params, callback, nothasloading) {
				return __APP.http('client/waimai/index/index', params, callback, nothasloading); //首页数据
			},

			homeInfo(params, callback, nothasloading) {
				return __APP.http('client/app/info', params, callback, nothasloading); //首页模块化数据
			},

			homeHongbao(params, callback, nothasloading) {
				return __APP.http('client/member/hongbao/getNewHongbao', params, callback, nothasloading); //首页红包
			},

			getHomeHongbao(params, callback, nothasloading) {
				return __APP.http('client/member/hongbao/getNewHongbao', params, callback, nothasloading); //领取首页红包
			},

			qiangTheme(params, callback, nothasloading) {
				return __APP.http('client/qiang/qiang/theme', params, callback, nothasloading); //抢购首月风格
			},
			qiangIndex(params, callback, nothasloading) {
				return __APP.http('client/qiang/qiang/index', params, callback, nothasloading); //抢购列表
			},

			orderCreate(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/create', params, callback, nothasloading); //创建订单
			},
			qiangComment(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/comment', params, callback, nothasloading); //qiangogu订单pignani
			},
			qiangTicket(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/ticket', params, callback, nothasloading); //qiangogu订单pignani
			},

			qiangOrder(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/order', params, callback, nothasloading); //预订单
			},
			perinfoOrder(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/perinfo', params, callback, nothasloading); //修改订单
			},
			qiangSearch(params, callback, nothasloading) {
				return __APP.http('client/qiang/qiang/search', params, callback, nothasloading); //抢购列表
			},
			productGet(params, callback, nothasloading) {
				return __APP.http('client/qiang/qiang/detail', params, callback, nothasloading); //抢购详情
			},
			shopLists(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/shoplist', params, callback, nothasloading); //商家列表数据
			},

			shopListsCates(params, callback, nothasloading) {
				return __APP.http('client/waimai/cate/index', params, callback, nothasloading); //商家列表全部分类
			},

			shopDetail(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/detail', params, callback, nothasloading); //商家数据
			},

			shopDetailSearch(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/shop_so', params, callback, nothasloading); //商家详情商品搜索
			},

			shopComments(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/comments', params, callback, nothasloading); //商家评论
			},

			shopInfo(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/info', params, callback, nothasloading); //商家详情信息数据
			},

			//个人中心接口
			mineInfo(params, callback, nothasloading) {
				return __APP.http('client/member/info', params, callback, nothasloading); //我的信息
			},

			moneyLog(params, callback, nothasloading) {
				return __APP.http('client/member/money/log', params, callback, nothasloading); //我的余额日志
			},

			moneyCash(params, callback, nothasloading) {
				return __APP.http('client/member/money/apply', params, callback, nothasloading); //我的余额提现
			},

			moneyRecharge(params, callback, nothasloading) {
				return __APP.http('client/payment/package', params, callback, nothasloading); //余额充值
			},

			moneyPay(params, callback, nothasloading) {
				return __APP.http('client/payment/money', params, callback, nothasloading); //余额充值支付
			},

			mineAddr(params, callback, nothasloading) {
				return __APP.http('client/member/addr/index', params, callback, nothasloading); //我的地址
			},

			editCreate(params, callback, nothasloading) {
				return __APP.http('client/member/addr/update', params, callback, nothasloading); //修改地址
			},

			addrCreate(params, callback, nothasloading) {
				return __APP.http('client/member/addr/create', params, callback, nothasloading); //创建地址
			},

			addrDel(params, callback, nothasloading) {
				return __APP.http('client/member/addr/delete', params, callback, nothasloading); //删除地址
			},

			peicard(params, callback, nothasloading) {
				return __APP.http('client/member/peicard/peicard', params, callback, nothasloading); //配送会员卡
			},

			peicardLogs(params, callback, nothasloading) {
				return __APP.http('client/member/peicard/cardlogs', params, callback, nothasloading); //配送会员卡使用记录
			},

			minePeicard(params, callback, nothasloading) {
				return __APP.http('client/member/peicard/mycard', params, callback, nothasloading); //我的配送会员卡
			},

			payPeicard(params, callback, nothasloading) {
				return __APP.http('client/payment/peicard', params, callback, nothasloading); //支付配送会员卡接口
			},

			mineCollect(params, callback, nothasloading) {
				return __APP.http('client/member/collect/shop', params, callback, nothasloading); //我的收藏
			},

			tapCollect(params, callback, nothasloading) {
				return __APP.http('client/member/collect/collect', params, callback, nothasloading); //收藏事件
			},

			shopCoupons(params, callback, nothasloading) {
				return __APP.http('client/waimai/coupon/coupons', params, callback, nothasloading); //商家优惠券
			},

			getCoupons(params, callback, nothasloading) {
				return __APP.http('client/waimai/coupon/getcoupon', params, callback, nothasloading); //领取商家优惠券
			},

			mineCoupons(params, callback, nothasloading) {
				return __APP.http('client/member/coupon/index', params, callback, nothasloading); //我的优惠券
			},

			mineHongbao(params, callback, nothasloading) {
				return __APP.http('client/member/hongbao/index', params, callback, nothasloading); //我的红包列表
			},

			huodong(params, callback, nothasloading) {
				return __APP.http('client/waimai/huodong/index', params, callback, nothasloading); //活动
			},

			invite(params, callback, nothasloading) {
				return __APP.http('client/member/invite/invite', params, callback, nothasloading); //分享邀请数据
			},

			invitePage(params, callback, nothasloading) {
				return __APP.http('client/invite/detail', params, callback, nothasloading); //分享邀请落地页数据(已领取)
			},

			invitePage2(params, callback, nothasloading) {
				return __APP.http('client/invite/index', params, callback, nothasloading); //分享邀请落地页数据(未领取)
			},

			tapInvite(params, callback, nothasloading) {
				return __APP.http('client/invite/invite_handle', params, callback, nothasloading); //分享邀请领取事件
			},

			mineMessageCates(params, callback, nothasloading) {
				return __APP.http('client/member/msg/index', params, callback, nothasloading); //我的消息分类
			},

			mineMessage(params, callback, nothasloading) {
				return __APP.http('client/member/msg/msg', params, callback, nothasloading); //我的消息
			},

			readMessage(params, callback, nothasloading) {
				return __APP.http('client/member/msg/readmsg', params, callback, nothasloading); //读取我的消息接口
			},

			orderForm(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/order', params, callback, nothasloading); //下单页信息
			},

			orderFormInfo(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/preinfo', params, callback, nothasloading); //下单页请求信息
			},

			getStaticQrcode(params, callback, nothasloading) {
				return __APP.http('client/wxapp/getStaticQrcode', params, callback, nothasloading); //下单页请求信息
			},

			orderFormAddr(params, callback, nothasloading) {
				return __APP.http('client/member/addr/orderAddr', params, callback, nothasloading); //下单页地址
			},

			orderFormAddrCreate(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/create', params, callback, nothasloading); //下单页地址创建
			},

			orderFormAddrDel(params, callback, nothasloading) {
				return __APP.http('client/wmclient/addr/del', params, callback, nothasloading); //下单页地址删除
			},

			orders(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/index', params, callback, nothasloading); //我的订单列表
			},
			qiangClientOrder(params, callback, nothasloading) {
				return __APP.http('client/qiang/order', params, callback, nothasloading); //订单列表
			},
			orderTicket(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/chargeback', params, callback, nothasloading); //取消订单那
			},
			ticketDetail(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/ticket_detail', params, callback, nothasloading); //取消订单xiaigqi
			},

			ordersDetail(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/detail', params, callback, nothasloading); //我的订单详情
			},

			ordersTui(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/payback', params, callback, nothasloading); //我的订单退款
			},
			qiangPayback(params, callback, nothasloading) {
				return __APP.http('client/qiang/order/payback', params, callback, nothasloading); //我的订单退款
			},

			ordersCancel(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/chargeback', params, callback, nothasloading); //我的订单取消
			},

			ordersConfirm(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/confirm', params, callback, nothasloading); //我的订单确认
			},

			ordersCui(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/remind', params, callback, nothasloading); //我的订单催单
			},

			ordersKefu(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/kefu', params, callback, nothasloading); //我的订单客服申请
			},

			ordersStatus(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/status', params, callback, nothasloading); //我的订单状态
			},

			ordersCommentSubmt(params, callback, nothasloading) {
				return __APP.http('client/waimai/order/comment', params, callback, nothasloading); //我的订单评价提交
			},

			shareImg(params, callback, nothasloading) {
				return __APP.http('client/waimai/shop/shareImg', params, callback, nothasloading); //
			},

			hbpackagePay(params, callback, nothasloading) {
				return __APP.http('client/payment/hbPackage', params, callback, nothasloading); //红包套餐支付
			},

			alipayAuthToken(params, callback, nothasloading) {
				return __APP.http('client/bind/alipay_auth', params, callback, nothasloading); //支付宝授权认证
			},

			//提示框；
			msgbox(msg, icon) {
				uni.showToast({
					title: msg,
					icon: 'success',
					image: icon,
					duration: 1000
				});
			},

			//字符串转换
			urlencode(str) {
				str = (str + '').toString();
				// return encodeURIComponent(str).replace(/!/g, '!').replace(/'/g, ''').replace(/\(/g, '(').replace(/\)/g, ')').replace(/\*/g, '*').replace(/ /g, '+');
			},

			//时间戳转换
			getLocalTime(nS) {
				return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
			},

			//上传图片
			upload: function upload(api, filePaths, successUp, failUp, i, length, files, callback) {
				filePaths = filePaths || {};
				callback = typeof callback == 'function' ? callback : function(res) {}; //var files;

				var json = {
					"CLIENT_OS": "WXAPP",
					"CLIENT_API": "CUSTOM",
					"API": api,
					"TOKEN": __APP._CFG.TOKEN || '',
					"LNG": __APP._CFG.lng || '',
					"LAT": __APP._CFG.lat || '',
					"WX_OPENID": __APP._CFG.wx_openid,
					"data": {}
				};
				var API_BASE = __APP._CFG.BASE_API;
				uni.uploadFile({
					url: API_BASE,
					filePath: filePaths[i],
					header: {
						'content-type': 'multipart/from-data'
					},
					name: 'file',
					formData: json,
					success: function success(resp) {
						if (resp.data != 0) {
							successUp++;
							files[i] = resp.data;
						} else {
							failUp++;
						}
					},
					fail: function fail(res) {
						failUp++;
					},
					complete: function complete() {
						i++;

						if (i == length) {
							uni.showToast({
								title: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！',
								icon: 'success',
								duration: 2000
							});
							callback(files);
						} else {
							//递归调用upload函数
							upload(api, filePaths, successUp, failUp, i, length, files, callback);
						}
					}
				});
			},

			gopage(url, method) {
				if (url.length < 1) {
					uni.showToast({
						title: "请设置小程序的链接"
					});
				} else if (url.indexOf('https://') == 0) {
					__APP.topage("/pages/webview/webview?url=" + url, method);
				} else if (url.indexOf('http://') == 0) {
					uni.showToast({
						title: "您设置的链接不合法"
					});
				} else if (url.indexOf("/pages/mine/") == 0 || url.indexOf("/pages/order/") == 0 || url.indexOf(
						"../mine/mine") == 0 || url.indexOf("../order/order") == 0) {
					0;

					__APP.topage(url, 'tab');
				} else {
					__APP.topage(url, method);
				}
			},

			//页面跳转
			topage(url, method) {
				if (__APP._CFG.double) {
					__APP._CFG.double = false;

					if (!method) {

						uni.navigateTo({
							url: url,
							fail(res) {
								console.log(res)
							}

						});
					};
					if (method == 'redirect') {
						uni.redirectTo({
							url: url
						});
					};

					if (method == 'tab') {
						uni.switchTab({
							url: url
						});
					};

					if (method == 'back') {
						if (isNaN(url)) {
							uni.navigateBack({
								url: url
							});
						} else {
							uni.navigateBack({
								delta: url
							});
						};
					};
					setTimeout(function() {
						__APP._CFG.double = true;
					}, 1000);
				}

				;
			},

			//移除某个本地储存
			remove: function(...arr) {
				arr.forEach(value => {
					uni.removeStorage({
						key: value,
						success: function(res) {}
					});
				});
			},
			//设置本地储存
			setstorage: function(key, data) {
				uni.setStorage({
					key: key,
					data: data,
					success: function(res) {}
				});
			},
			//获取存储
			getstorage: function(key, successCall, failCall) {
				successCall = typeof successCall == 'function' ? successCall : function(res) {};
				failCall = typeof failCall == 'function' ? failCall : function() {};
				uni.getStorage({
					key: key,
					success: function(res) {
						successCall(res);
					},
					fail: function() {
						failCall();
					}
				});
			},
			//页面分享
			share: function(title, path) {
				return {
					title: title,
					path: path,
					success: function(res) {},
					fail: function(res) {}
				};
			},
			shareimeline: function(title, path, img) {
				return {
					title: title,
					query: path,
					imageUrl: img ? img : '',
					success: function(res) {},
					fail: function(res) {}
				};
			},
			_CFG: {
				// "BASE_API": "http://wmv4.weizx.cn/api.php",
				// "BASE_API": "https://test.aioeuropa.com/api.php", // 测试服
				"BASE_API": "https://www.aioeuropa.com/api.php",
				// 正式服
				//  "BASE_API": "http://47.114.185.218/api.php",
				"auth_code": "",
				"wx_openid": "",
				"wx_unionid": "",
				"wx_info": null,
				"ali_openid": "",
				// "TOKEN": "4-KTF0831C76B1C4B6603B0ED65ADF73F221",
				"TOKEN": "",
				"PHPSESSID": "",
				"UID": 0,
				"userInfo": null,
				"userInfo2": null,
				"shoptail": '',
				"title": '',
				"cateid": '',
				'payorderid': '',
				'isindexshow': true,
				'currentlat': '',
				'currentlng': '',
				'double': true,
				'useraddr': [],
				'is_fz': false, //true为开启分站功能，false为关闭分站功能

			},

			saveCookies: function(res) {
				let cookies = null
				//#ifdef  MP-ALIPAY || H5
				cookies = res.header['set-cookie'];
				if (typeof cookies == 'string') {
					cookies = [cookies]
				}
				//#endif 
				//#ifdef  MP-WEIXIN
				cookies = res.cookies;
				//#endif 
				if (cookies == null) {
					return;
				}
				// console.log(cookies)
				cookies.forEach(cookie => {
					let cookieContents = cookie.split('; ');
					var cookieObj = {};
					cookieContents.forEach((content, index) => {
						if (index == 0) {
							//第一组是cookie的 name 和 value
							cookieObj['name'] = content.split('=')[0];
							cookieObj['value'] = content.split('=')[1];
							return;
						}

						cookieObj[content.split('=')[0]] = content.split('=')[1];
					});

					if (__APP.URL.includes(cookieObj['domain'])) {
						if (cookieObj.value == 'deleted') {
							delete __APP.cookies[cookieObj.name];
						} else {
							__APP.cookies[cookieObj.name] = cookieObj;
						}
					}
				});
			}
		},
		onLaunch: function() {
			//#ifdef  MP-ALIPAY 

			console.log('获取appid')
			const appIdRes = my.getAppIdSync();
			console.log(appIdRes.appId);
			//#endif 
			__APP = this.globalData;
			var logs = uni.getStorageSync('logs') || [];
			this.globalData.city_id = uni.getStorageSync('currentCityId');

			logs.unshift(Date.now());
			uni.setStorageSync('logs', logs); // __APP.getLocation();

			__APP.getUserLocationState();
		},
		onShow: function() {
			__APP.getstorage('token', res => __APP._CFG.TOKEN = res.data, () => __APP._CFG.TOKEN = '');

			__APP.getstorage('unionid', res => __APP._CFG.wx_unionid = res.data, () => __APP._CFG.wx_unionid = '');

			__APP.getstorage('userinfo', res => __APP._CFG.userInfo = res.data, () => __APP._CFG.userInfo = {});

			__APP.getstorage('userinfo2', res => __APP._CFG.userInfo2 = res.data, () => __APP._CFG.userInfo2 = {});

			__APP.getstorage('wx_openid', res => __APP._CFG.wx_openid = res.data, () => __APP._CFG.wx_openid = '');

			__APP.getstorage('ali_openid', res => __APP._CFG.ali_openid = res.data, () => __APP._CFG.ali_openid = '');
		},
		methods: {}
	};
</script>
<style>
	.beyond {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		display: inline-block;
	}

	button::after {
		border: none;
	}

	button {
		margin: 0;
		border: none;
	}

	ul {
		padding: 0;
	}

	.shoplists {
		background: #fff;
		padding: 16rpx 30rpx;
		overflow: hidden;
	}

	.shoplists.close {
		opacity: 0.5;
	}

	.shoplists .logo {
		width: 198rpx;
		height: 198rpx;
		border-radius: 24rpx;

		position: relative;
		float: left;
	}

	.shoplists .logo .pic {
		width: 198rpx;
		height: 198rpx;
		border-radius: 24rpx;
		box-shadow: 0px 0px 40rpx 0px rgba(163, 163, 164, 0.1);
	}

	.shoplists .text_amount {
		min-width: 88rpx;
		padding: 0 12rpx;
		height: 48rpx;
		/* background: #2D2D2D; */
		/* box-shadow: 0px 0px 40rpx 0px rgba(163, 163, 164, 0.1); */
		border-radius: 8rpx;
		font-size: 24rpx;
		text-align: center;
		line-height: 48rpx;
		margin-right: 10rpx;
		color: #3E4248;
	}

	.shoplists .text_freight {
		color: #3E4248;
		font-size: 24rpx
	}

	.shoplists .logo .tag {
		position: absolute;
		left: 0;
		top: 0;
		width: 64rpx;
		height: 64rpx;
	}

	.shoplists .logo .state {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		line-height: 40rpx;
		text-align: center;
		background: #A3A3A4;
		color: #fff;
		display: block;
		font-size: 24rpx;
	}

	.shoplists .logo .num {
		position: absolute;
		right: -8rpx;
		top: -8rpx;
		line-height: 28rpx;
		text-align: center;
		background: #FF4D5B;
		color: #fff;
		font-size: 20rpx;
		border-radius: 60rpx;
		padding: 0 9rpx;
	}

	.shoplists .txt_box {
		margin-left: 214rpx;
	}

	.shoplists .tit {
		font-size: 32rpx;
		line-height: 48rpx;
		color: #262628;
		font-weight: bold;
		margin-top: 12rpx;
	}

	.shoplists .open_state text {
		background: #4DBD4D;
		border-radius: 2rpx;
		font-size: 22rpx;
		color: #fff;
		line-height: 32rpx;
		padding: 0 14rpx;
		display: inline-block;
		margin-top: 12rpx;
	}

	.shoplists .box {
		overflow: hidden;
		font-size: 24rpx;
		margin: 10rpx 0;
		color: #A3A3A4;
	}

	.shoplists .song {
		display: inline-block;
		float: right;
		font-size: 20rpx !important;
		border: 2rpx solid #2797ff;
		color: #2797ff;
		border-radius: 10rpx 0 10rpx 0;
		padding: 0 6rpx;
		line-height: 32rpx;
	}

	.shoplists .song2 {
		border-color: #ff9000;
		color: #ff9000;
	}

	.shoplists .green {
		color: #A3A3A4;
		font-size: 24rpx;
		margin-right: 16rpx;
	}

	.shoplists .grey {
		color: #e6e6e6;
	}

	.shoplists .del {
		color: #999;
		font-size: 24rpx;
		position: relative;
		margin-left: 4rpx;
	}

	.shoplists .del:after {
		content: '';
		width: 100%;
		height: 2rpx;
		background: #999;
		position: absolute;
		left: 0;
		top: 50%;
	}

	.shoplists .starS {
		display: inline-block;
		font-size: 28rpx;
		color: #FF797C;
		margin-right: 24rpx;
		font-weight: bold;

	}

	.shoplists .starS image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 8rpx;
	}

	.shoplists .line {
		width: 100%;
		display: block;
		height: 0;
		border: 0;
		border-bottom: 2rpx solid #f6f6f6;
		margin: 20rpx 0;
		padding: 0;
	}

	.shoplists .support {
		overflow: hidden;
	}

	.shoplists .support span {
		overflow: hidden;
		border: 2rpx solid #037E98;
		color: #037E98;
		display: inline-block;
		margin-right: 8rpx;
		padding: 0 8rpx;
		border-radius: 4rpx;
	}

	.shoplists .hd {
		overflow: hidden;
	}

	.shoplists .hd .right {
		float: right;
		width: 172rpx;
		text-align: right;
		font-size: 24rpx;
		color: #999;
	}

	.shoplists .hd .right .ico {
		width: 20rpx;
		height: 20rpx;
		margin-left: 8rpx;
		display: inline-block;
		font-size: 20rpx;
		color: #fff;
	}

	.shoplists .hd ul {
		display: block;
		margin-right: 180rpx;
		max-height: 144rpx;
	}

	.shoplists .hd ul.on {
		height: auto;
		max-height: unset;
	}

	.shoplists .hd ul li {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24rpx;
		color: #666;
		line-height: 32rpx;
		display: block;
	}

	.shoplists .hd ul li .ico {
		width: 32rpx;
		height: 32rpx;
		display: inline-block;
		border-radius: 8rpx;
		line-height: 32rpx;
		text-align: center;
		color: #fff;
		font-size: 24rpx;
		font-style: normal;
		margin: 8rpx 8rpx 8rpx 0;
	}

	.shoplists .pullBox {
		overflow: hidden;
	}

	.shoplists .pullBox .right {
		float: right;
		width: 80rpx;
		height: 80rpx;
		text-align: right;
	}

	.shoplists .pullBox .right .ico {
		width: 20rpx;
		height: 20rpx;
		display: inline-block;
	}

	.shoplists .pullBox .left {
		display: block;
		margin-right: 90rpx;
		max-height: 76rpx;
		overflow: hidden;
	}

	.shoplists .pullBox .left.on {
		max-height: unset;
	}

	.shoplists .pullBox .left .list {
		display: inline-block;
		border: 2rpx solid #FCE9E9;
		line-height: 28rpx;
		padding: 0 8rpx;
		margin-right: 4rpx;
		margin-bottom: 4rpx;
		font-size: 22rpx;
		color: #FF4D5B;
	}

	.shoplists .pullBox .left span {
		display: inline-block;
		border: 2rpx solid #eee;
		line-height: 28rpx;
		padding: 0 8rpx;
		margin-right: 4rpx;
		margin-bottom: 4rpx;
		font-size: 22rpx;
		color: #666;
	}

	.shoplists .products {
		overflow-x: hidden;
		overflow-y: auto;
		margin-top: 12rpx;
		-webkit-overflow-scrolling: touch
	}

	.shoplists .products ul {
		display: block;
		white-space: nowrap;
		margin: 0 -10rpx;
	}

	.shoplists .products ul li {
		display: inline-block;
		margin: 0 10rpx;
	}

	.shoplists .products ul li .pic {
		width: 240rpx;
		height: 176rpx;
		overflow: hidden;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		position: relative;
		background-color: #eee;
	}

	.shoplists .products ul li .bt {
		font-size: 28rpx;
		color: #666;
		line-height: 40rpx;
		margin: 12rpx 0 8rpx;
	}

	.shoplists .products ul li .price {
		font-size: 36rpx;
		color: #FA4C34;
	}

	.shoplists .products .price small {
		font-size: 28rpx;
	}

	.starBg {
		width: 170rpx;
		height: 24rpx;
		position: relative;
		overflow: hidden;
		line-height: 0;
		display: inline-block;
		text-align: left;
	}

	.starBgimg {
		width: 170rpx;
		height: 24rpx;
	}

	.star {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		line-height: 0;
		overflow: hidden;
		display: inline-block;
	}

	.star image {
		width: 170rpx;
		height: 24rpx;
	}

	/*自定义样式*/
	page {
		height: 100%;
		font-size: 24rpx;
		background-color: #eef2f5;
	}

	.container {
		height: 100%;
		background-color: #eef2f5;
	}

	.overflow_clear {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.clear {
		height: 0;
		line-height: 0;
		font-size: 0;
		clear: both;
	}

	.clear_both:after {
		content: "";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
		font-size: 0;
	}

	.mask_bg {
		position: fixed;
		z-index: 99;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		left: 0;
		width: 100%;
		height: 100%;
		background: #000;
		opacity: 0.4;
	}

	.topmask {
		position: fixed;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 111;
	}

	.maincl {
		color: #ff797c;
	}

	.fontcl1 {
		color: #FF797C;
	}

	.fontcl2 {
		color: #ff797c;
	}

	.fontcl3 {
		color: #ff9900;
	}

	.fontcl4 {
		color: #FF4D5B;
	}

	.black9 {
		color: #A3A3A4;
	}

	.black6 {
		color: #666666;
	}

	.col26 {
		color: #262628;
	}

	.font28 {
		font-size: 28rpx
	}

	.black3 {
		color: #333333;
	}

	.border_t {
		border-top: 2rpx solid #e6e6e6;
	}

	.border_b {
		border-bottom: 2rpx solid #e6e6e6;
	}

	.border_l {
		border-left: 2rpx solid #e6e6e6;
	}

	.border_r {
		border-right: 2rpx solid #e6e6e6;
	}

	.mt5 {
		margin-top: 10rpx;
	}

	.mt10 {
		margin-top: 20rpx;
	}

	.mt20 {
		margin-top: 40rpx;
	}

	.mt30 {
		margin-top: 60rpx;
	}

	.mb5 {
		margin-bottom: 10rpx;
	}

	.mb10 {
		margin-bottom: 20rpx;
	}

	.mb20 {
		margin-bottom: 40rpx;
	}

	.mb30 {
		margin-bottom: 60rpx;
	}

	.ml5 {
		margin-left: 10rpx;
	}

	.ml10 {
		margin-left: 20rpx;
	}

	.ml20 {
		margin-left: 40rpx;
	}

	.ml30 {
		margin-left: 60rpx;
	}

	.mr5 {
		margin-right: 10rpx;
	}

	.mr10 {
		margin-right: 20rpx;
	}

	.mr20 {
		margin-right: 40rpx;
	}

	.mr30 {
		margin-right: 60rpx;
	}

	.pub_list {
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}

	.pub_list .pub_list_bd {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}

	.flex-wrp {
		display: flex;
		align-items: center;
	}

	.text_c {
		text-align: center;
	}

	.text_r {
		text-align: right;
	}

	.text_l {
		text-align: left;
	}

	/*容器*/
	.pubPage {
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.pubPageCont {
		flex: 1;
	}

	/*点评星星样式*/
	.evlt_star_bg {
		width: 400rpx;
		height: 52rpx;
		position: relative;
		overflow: hidden;
		line-height: 0;
		display: inline-block;
	}

	.evlt_star_bg image.bg {
		width: 400rpx;
		height: 52rpx;
	}

	.evlt_star_bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		line-height: 0;
		overflow: hidden;
		display: inline-block;
	}

	.evlt_star_bg image {
		width: 400rpx;
		height: 52rpx;
	}

	.evlt_star_click {
		overflow: hidden;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.evlt_star_click .list {
		float: left;
		width: 20%;
		height: 100%;
	}

	.page_cont_box {
		height: calc(100% - 120rpx);
		width: 100%;
		overflow: hidden;
		background-color: #eef2f5;
	}

	.page_cont_box_topbottom {
		height: calc(100% - 208rpx);
	}

	.page_cont {
		height: 100%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		-webkit-overflow-scrolling: touch;
	}

	.footer_btn_long {
		height: 80rpx;
		padding: 20rpx;
	}

	.footer_btn_long button {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
	}

	.page_cont_pay {
		height: calc(100% - 100rpx);
		width: 100%;
		overflow: hidden;
		background-color: #ffffff;
	}

	.icon44 {
		width: 44rpx;
		height: 44rpx;
	}

	.icon30 {
		width: 30rpx;
		height: 30rpx;
	}

	.footer_pay {
		height: 100rpx;
		line-height: 97rpx;
		background: #fff;
		width: 100%;
		box-sizing: border-box;
	}


	.none-cont {
		color: #666;
		text-align: center;
		padding-top: 186rpx;
		box-sizing: border-box;
	}

	.none-cont .main image {
		width: 200rpx;
		height: 200rpx
	}

	.nosalesku {
		width: 124rpx;
		height: 48rpx;
		line-height: 48rpx;
		background: #ccc;
		border-radius: 48rpx;
		color: #fff;
		text-align: center;
		right: -4rpx;
	}

	.top .right .circle {
		width: 7rpx;
		height: 7rpx;
		background: #fff;
		border-radius: 50%;
		position: absolute;
		right: 5rpx;
		top: 5rpx;
	}

	.shopList .right .bg {
		padding: 6rpx 10rpx;
		background: #F74663;
		color: #fff;
		border-top-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
	}

	.shopList .right .bg2 {
		padding: 6rpx 10rpx;
		background: #0f88d0;
		color: #fff;
		border-top-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
	}

	/*白布样式*/
	.whiteloading {
		width: 100%;
		height: 100%;
		background: #fff;
		position: fixed;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
	}

	/*showToast-开始*/
	.toast-bg {
		position: fixed;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		bottom: 0;
		z-index: 999999;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .2);
	}

	/*水平居中必备样式*/
	.toast-center {
		position: fixed;
		z-index: 9999999;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		width: 100%;
		height: 100%;
		text-align: center;
	}

	.toast {
		display: inline-block;
		padding: 20rpx 40rpx;
		max-width: 600rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #fff;
		background: rgba(0, 0, 0, .7);
		border-radius: 10rpx;
		text-align: center;
	}

	/*垂直居中必备样式*/
	.toast-center::after {
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}

	.toast .toast-icon {
		display: block;
		margin: 0 auto 10rpx auto;
		width: 50rpx;
		height: 50rpx;
	}

	/*showToast-结束*/
	/*无数据-开始*/
	.pub-nodata {
		color: #666;
		text-align: center;
		padding-top: 186rpx;
		box-sizing: border-box;
	}

	.pub-nodata image {
		width: 200rpx;
		height: 200rpx
	}

	/*无数据-结束*/
	/**************以上为重置样式****************************/

	/**个人中心-余额***/
	.mineMoney_top {
		padding: 24rpx 0;
		background: #fff;
		display: flex;
		align-items: center;
		text-align: center;
		position: relative;
		margin-bottom: 20rpx;
	}

	.mineMoney_top:before {
		content: '';
		width: 2rpx;
		position: absolute;
		left: 50%;
		top: 24rpx;
		bottom: 24rpx;
		background: #eee;
	}

	.mineMoney_top .box {
		flex: 1;
	}

	.mineMoney_top .txt {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #999;
	}

	.mineMoney_top .price {
		font-size: 32rpx;
		line-height: 40rpx;
		color: #f30;
		margin-top: 8rpx;
	}

	.mineMoney_top .btn {
		display: inline-block;
		font-size: 28rpx;
		line-height: 60rpx;
		color: #fff;
		background: #fc5151;
		border-radius: 4rpx;
		width: 160rpx;
		margin: 0 4rpx;
	}

	.mineMoney_top .btn2 {
		background: #ff797c;
	}

	.mineMoney_tit {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #999;
		padding: 8rpx 24rpx;
	}

	.mineMoney_list {
		background: #fff;
		margin-bottom: 2rpx;
		padding: 20rpx 120rpx 20rpx 24rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #999;
		position: relative;
	}

	.mineMoney_list .tit {
		font-size: 28rpx;
		color: #333;
	}

	.mineMoney_list .price {
		font-size: 28rpx;
		color: #ff797c;
		position: absolute;
		right: 24rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.mineMoney_cash {
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		width: 100%;
		height: 100%;
	}

	.mineMoney_cash .box {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		border-radius: 6rpx;
		width: 640rpx;
	}

	.mineMoney_cash .tit {
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
	}

	.mineMoney_cash .cont {
		padding: 0 40rpx;
	}

	.mineMoney_cash .cont textarea {
		width: 100%;
		height: 160rpx;
		border-radius: 8rpx;
		border: 2rpx solid #eee;
		font-size: 24rpx;
		line-height: 36rpx;
		margin-bottom: 20rpx;
		padding: 16rpx 20rpx;
		box-sizing: border-box;
	}

	.mineMoney_cash .cont input {
		width: 100%;
		height: 72rpx;
		border-radius: 8rpx;
		border: 2rpx solid #eee;
		font-size: 24rpx;
		line-height: 72rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.mineMoney_cash .btn_box {
		border-top: 2rpx solid #eee;
		margin-top: 30rpx;
		display: flex;
	}

	.mineMoney_cash .btn_box view {
		font-size: 30rpx;
		text-align: center;
		line-height: 80rpx;
		flex: 1;
	}

	.mineMoney_cash .btn_box .btn2 {
		color: #f30;
		border-left: 2rpx solid #eee;
	}

	.mineMoney_recharge {
		min-height: 100%;
		background: #fff;
	}

	.mineMoney_recharge .title {
		padding: 12rpx 24rpx;
		font-size: 28rpx;
	}

	.mineMoney_recharge .list_box {
		padding: 0 14rpx;
	}

	.mineMoney_recharge .price_list {
		width: 184rpx;
		height: 110rpx;
		margin: 10rpx 10rpx;
		border: 2rpx solid #f9f9f9;
		background: #f9f9f9;
		text-align: center;
		float: left;
		padding-top: 16rpx;
	}

	.mineMoney_recharge .price_list.on {
		border-color: #ff0000;
		background: #fff;
	}

	.mineMoney_recharge .price_list .num {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
	}

	.mineMoney_recharge .price_list .txt {
		color: #666;
	}

	.mineMoney_recharge .price_list.custom .txt {
		color: #333;
		margin-top: 30rpx;
	}

	.mineMoney_recharge .price_list.custom .txt {
		color: #333;
		margin-top: 30rpx;
	}

	.mineMoney_recharge .price_list.on .num,
	.mineMoney_recharge .price_list.on .txt {
		color: #ff0000;
	}

	.mineMoney_recharge .inp {
		width: 100%;
		border: 2rpx solid #ddd;
		border-radius: 6rpx;
		line-height: 64rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #333;
		height: 64rpx;
	}

	.mineMoney_recharge .pay_way .list {
		background: #fff;
		display: block;
		overflow: hidden;
		padding: 30rpx 24rpx;
		border-bottom: 2rpx solid #eee;
		border-top: 2rpx solid #eee;
	}

	.mineMoney_recharge .pay_way .list image {
		width: 60rpx;
		height: 60rpx;
		float: left;
		margin-right: 20rpx;
	}

	.mineMoney_recharge .pay_way .list .txt {
		float: left;
		font-size: 28rpx;
		line-height: 60rpx;
	}

	.mineMoney_recharge .pay_way .list wx-radio {
		display: block;
		float: right;
		margin-top: 7rpx;
	}

	.mineMoney_recharge .long_btn {
		display: block;
		margin: 40rpx 24rpx;
		background: #ff725c;
		border: 0;
		color: #fff;
		font-size: 32rpx;
	}

	/**个人中心***/

	/*微信授权*/
	.pubOpenSetting {
		position: fixed;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		width: 100%;
		height: 100%;
		z-index: 999;
		background: rgba(0, 0, 0, 0.4);
	}

	.pubOpenSetting .cont {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 70%;
		background: #fff;
		border-radius: 8rpx;
		padding: 40rpx 0rpx 0;
		font-size: 32rpx;
		color: #333;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	.pubOpenSetting .cont .btn_box {
		border-top: 2rpx solid #eee;
		text-align: center;
		position: relative;
		margin-top: 40rpx;
		display: flex;
	}

	.pubOpenSetting .cont .btn_box .btn {
		border-top: 0;
		margin-top: 0;
		flex: 1;
	}

	.pubOpenSetting .cont .btn_box .btn.cancel {
		color: #333;
		border-right: 2rpx solid #eee;
	}

	.pubOpenSetting .cont .btn {
		border-top: 2rpx solid #eee;
		line-height: 80rpx;
		text-align: center;
		font-size: 36rpx;
		color: #ff797c;
		position: relative;
		margin-top: 40rpx;
	}

	.pubOpenSetting .cont .btn button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwTk5zaXhaJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUTtBQUNSO0lBQ0ksWUFBWTtJQUNaLGdCQUFnQjtJQUNoQix5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxZQUFZO0lBQ1oseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLHVCQUF1QjtJQUN2QixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksU0FBUztJQUNULGNBQWM7SUFDZCxZQUFZO0lBQ1osV0FBVztBQUNmOztBQUVBO0lBQ0ksV0FBVztJQUNYLGNBQWM7SUFDZCxTQUFTO0lBQ1QsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksZUFBZTtJQUNmLFdBQVc7SUFDWCxNQUFNO0lDN0NWLGtCQUFBO0lBQUEsaURBQUE7SUFBQSw0Q0FBQTtJQUFBLGNBQUE7SUQ4Q0ksT0FBTztJQUNQLFdBQVc7SUFDWCxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsTUFBTTtJQ3ZEVixrQkFBQTtJQUFBLGlEQUFBO0lBQUEsNENBQUE7SUFBQSxjQUFBO0lEd0RJLE9BQU87SUFDUCxRQUFRO0lBQ1IsU0FBUztJQUNULFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLDhCQUE4QjtBQUNsQzs7QUFFQTtJQUNJLGlDQUFpQztBQUNyQzs7QUFFQTtJQUNJLCtCQUErQjtB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QTJCO0lBQzNCLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLE9BQU87SUFDUCxNQUFNO0lBQ04sV0FBVztJQUNYLFlBQVk7SUFDWixVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxRQUFRO0lBQ1IsU0FBUztJQUNULGtCQUFrQjtJQUNsQixhQUFhO0FBQ2pCIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8q6Ieq5a6a5LmJ5qC35byPKi9cclxucGFnZSB7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBmb250LXNpemU6IDI0cnB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VlZjJmNTtcclxufVxyXG5cclxuLmNvbnRhaW5lciB7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVmMmY1O1xyXG59XHJcblxyXG4ub3ZlcmZsb3dfY2xlYXIge1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxufVxyXG5cclxuLmZsIHtcclxuICAgIGZsb2F0OiBsZWZ0O1xyXG59XHJcblxyXG4uZnIge1xyXG4gICAgZmxvYXQ6IHJpZ2h0O1xyXG59XHJcblxyXG4uY2xlYXIge1xyXG4gICAgaGVpZ2h0OiAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDA7XHJcbiAgICBmb250LXNpemU6IDA7XHJcbiAgICBjbGVhcjogYm90aDtcclxufVxyXG5cclxuLmNsZWFyX2JvdGg6YWZ0ZXIge1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgaGVpZ2h0OiAwO1xyXG4gICAgY2xlYXI6IGJvdGg7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICBmb250LXNpemU6IDA7XHJcbn1cclxuXHJcbi5tYXNrX2JnIHtcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgIHotaW5kZXg6IDk5O1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogIzAwMDtcclxuICAgIG9wYWNpdHk6IDAuNDtcclxufVxyXG5cclxuLnRvcG1hc2sge1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgei1pbmRleDogMTExO1xyXG59XHJcblxyXG4ubWFpbmNsIHtcclxuICAgIGNvbG9yOiAjMjBBRDIwO1xyXG59XHJcblxyXG4uZm9udGNsMSB7XHJcbiAgICBjb2xvcjogI2ZmMzMwMDtcclxufVxyXG5cclxuLmZvbnRjbDIge1xyXG4gICAgY29sb3I6ICNmZjY2MDA7XHJcbn1cclxuXHJcbi5mb250Y2wzIHtcclxuICAgIGNvbG9yOiAjZmY5OTAwO1xyXG59XHJcblxyXG4uZm9udGNsNCB7XHJcbiAgICBjb2xvcjogI0ZGNEQ1QjtcclxufVxyXG5cclxuLmJsYWNrOSB7XHJcbiAgICBjb2xvcjogIzk5OTk5OTtcclxufVxyXG5cclxuLmJsYWNrNiB7XHJcbiAgICBjb2xvcjogIzY2NjY2NjtcclxufVxyXG5cclxuLmJsYWNrMyB7XHJcbiAgICBjb2xvcjogIzMzMzMzMztcclxufVxyXG5cclxuLmJvcmRlcl90IHtcclxuICAgIGJvcmRlci10b3A6IDJycHggc29saWQgI2U2ZTZlNjtcclxufVxyXG5cclxuLmJvcmRlcl9iIHtcclxuICAgIGJvcmRlci1ib3R0b206IDJycHggc29saWQgI2U2ZTZlNjtcclxufVxyXG5cclxuLmJvcmRlcl9sIHtcclxuICAgIGJvcmRlci1sZWZ0OiAycnB4IHNvbGlkICNlNmU2ZTY7XHJcbn1cclxuXHJcbi5ib3JkZXJfciB7XHJcbiAgICBib3JkZXItcmlnaHQ6IDJycHggc29saWQgI2U2ZTZlNjtcclxufVxyXG5cclxuLm10NSB7XHJcbiAgICBtYXJnaW4tdG9wOiAxMHJweDtcclxufVxyXG5cclxuLm10MTAge1xyXG4gICAgbWFyZ2luLXRvcDogMjBycHg7XHJcbn1cclxuXHJcbi5tdDIwIHtcclxuICAgIG1hcmdpbi10b3A6IDQwcnB4O1xyXG59XHJcblxyXG4ubXQzMCB7XHJcbiAgICBtYXJnaW4tdG9wOiA2MHJweDtcclxufVxyXG5cclxuLm1iNSB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHJweDtcclxufVxyXG5cclxuLm1iMTAge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMjBycHg7XHJcbn1cclxuXHJcbi5tYjIwIHtcclxuICAgIG1hcmdpbi1ib3R0b206IDQwcnB4O1xyXG59XHJcblxyXG4ubWIzMCB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA2MHJweDtcclxufVxyXG5cclxuLm1sNSB7XHJcbiAgICBtYXJnaW4tbGVmdDogMTBycHg7XHJcbn1cclxuXHJcbi5tbDEwIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAyMHJweDtcclxufVxyXG5cclxuLm1sMjAge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDQwcnB4O1xyXG59XHJcblxyXG4ubWwzMCB7XHJcbiAgICBtYXJnaW4tbGVmdDogNjBycHg7XHJcbn1cclxuXHJcbi5tcjUge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHJweDtcclxufVxyXG5cclxuLm1yMTAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAyMHJweDtcclxufVxyXG5cclxuLm1yMjAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA0MHJweDtcclxufVxyXG5cclxuLm1yMzAge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA2MHJweDtcclxufVxyXG5cclxuLnB1Yl9saXN0IHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xyXG4gICAgZGlzcGxheTogLXdlYmtpdC1mbGV4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XHJcbiAgICAtd2Via2l0LWFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4ucHViX2xpc3QgLnB1Yl9saXN0X2JkIHtcclxuICAgIC13ZWJraXQtYm94LWZsZXg6IDE7XHJcbiAgICAtd2Via2l0LWZsZXg6IDE7XHJcbiAgICBmbGV4OiAxO1xyXG59XHJcblxyXG4udGV4dF9jIHtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLnRleHRfciB7XHJcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG5cclxuLnRleHRfbCB7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG59XHJcblxyXG4vKuWuueWZqCovXHJcbi5wdWJQYWdlIHtcclxuICAgIGRpc3BsYXk6IC13ZWJraXQtZmxleDtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5wdWJQYWdlQ29udCB7XHJcbiAgICBmbGV4OiAxO1xyXG59XHJcblxyXG4vKueCueivhOaYn+aYn+agt+W8jyovXHJcbi5ldmx0X3N0YXJfYmcge1xyXG4gICAgd2lkdGg6IDQwMHJweDtcclxuICAgIGhlaWdodDogNTJycHg7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgbGluZS1oZWlnaHQ6IDA7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbn1cclxuXHJcbi5ldmx0X3N0YXJfYmcgaW1hZ2UuYmcge1xyXG4gICAgd2lkdGg6IDQwMHJweDtcclxuICAgIGhlaWdodDogNTJycHg7XHJcbn1cclxuXHJcbi5ldmx0X3N0YXJfYmFyIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBsaW5lLWhlaWdodDogMDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbn1cclxuXHJcbi5ldmx0X3N0YXJfYmcgaW1hZ2Uge1xyXG4gICAgd2lkdGg6IDQwMHJweDtcclxuICAgIGhlaWdodDogNTJycHg7XHJcbn1cclxuXHJcbi5ldmx0X3N0YXJfY2xpY2sge1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLmV2bHRfc3Rhcl9jbGljayAubGlzdCB7XHJcbiAgICBmbG9hdDogbGVmdDtcclxuICAgIHdpZHRoOiAyMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5wYWdlX2NvbnRfYm94IHtcclxuICAgIGhlaWdodDogY2FsYygxMDAlIC0gMTIwcnB4KTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZWYyZjU7XHJcbn1cclxuXHJcbi5wYWdlX2NvbnRfYm94X3RvcGJvdHRvbSB7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDIwOHJweCk7XHJcbn1cclxuXHJcbi5wYWdlX2NvbnQge1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgIG92ZXJmbG93OiBhdXRvOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcclxuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcclxufVxyXG5cclxuLmZvb3Rlcl9idG5fbG9uZyB7XHJcbiAgICBoZWlnaHQ6IDgwcnB4O1xyXG4gICAgcGFkZGluZzogMjBycHg7XHJcbn1cclxuXHJcbi5mb290ZXJfYnRuX2xvbmcgYnV0dG9uIHtcclxuICAgIGhlaWdodDogODBycHg7XHJcbiAgICBsaW5lLWhlaWdodDogODBycHg7XHJcbiAgICBmb250LXNpemU6IDMycnB4O1xyXG59XHJcblxyXG4ucGFnZV9jb250X3BheSB7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDEwMHJweCk7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVmMmY1O1xyXG59XHJcblxyXG4uZm9vdGVyX3BheSB7XHJcbiAgICBoZWlnaHQ6IDEwMHJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA5N3JweDtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcblxyXG4ubm9uZS1jb250IHtcclxuICAgIGNvbG9yOiAjNjY2O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgcGFkZGluZy10b3A6IDE4NnJweDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5ub25lLWNvbnQgLm1haW4gaW1hZ2Uge1xyXG4gICAgd2lkdGg6IDIwMHJweDtcclxuICAgIGhlaWdodDogMjAwcnB4XHJcbn1cclxuXHJcbi5ub3NhbGVza3Uge1xyXG4gICAgd2lkdGg6IDEyNHJweDtcclxuICAgIGhlaWdodDogNDhycHg7XHJcbiAgICBsaW5lLWhlaWdodDogNDhycHg7XHJcbiAgICBiYWNrZ3JvdW5kOiAjY2NjO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNDhycHg7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHJpZ2h0OiAtNHJweDtcclxufVxyXG5cclxuLnRvcCAucmlnaHQgLmNpcmNsZSB7XHJcbiAgICB3aWR0aDogN3JweDtcclxuICAgIGhlaWdodDogN3JweDtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogNXJweDtcclxuICAgIHRvcDogNXJweDtcclxufVxyXG5cclxuLnNob3BMaXN0IC5yaWdodCAuYmcge1xyXG4gICAgcGFkZGluZzogNnJweCAxMHJweDtcclxuICAgIGJhY2tncm91bmQ6ICNGNzQ2NjM7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDE2cnB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDE2cnB4O1xyXG59XHJcblxyXG4uc2hvcExpc3QgLnJpZ2h0IC5iZzIge1xyXG4gICAgcGFkZGluZzogNnJweCAxMHJweDtcclxuICAgIGJhY2tncm91bmQ6ICMwZjg4ZDA7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDE2cnB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDE2cnB4O1xyXG59XHJcblxyXG4vKueZveW4g+agt+W8jyovXHJcbi53aGl0ZWxvYWRpbmcge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgei1pbmRleDogOTk7XHJcbn1cclxuXHJcbi8qc2hvd1RvYXN0LeW8gOWniyovXHJcbi50b2FzdC1iZyB7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICB6LWluZGV4OiA5OTk5OTk7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgLjIpO1xyXG59XHJcblxyXG4vKuawtOW5s+WxheS4reW/heWkh+agt+W8jyovXHJcbi50b2FzdC1jZW50ZXIge1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgei1pbmRleDogOTk5OTk5OTtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLnRvYXN0IHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHBhZGRpbmc6IDIwcnB4IDQwcnB4O1xyXG4gICAgbWF4LXdpZHRoOiA2MDBycHg7XHJcbiAgICBmb250LXNpemU6IDI4cnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDQwcnB4O1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC43KTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcnB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4vKuWeguebtOWxheS4reW/heWkh+agt+W8jyovXHJcbi50b2FzdC1jZW50ZXI6OmFmdGVyIHtcclxuICAgIGNvbnRlbnQ6ICcnO1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgd2lkdGg6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG59XHJcblxyXG4udG9hc3QgLnRvYXN0LWljb24ge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBtYXJnaW46IDAgYXV0byAxMHJweCBhdXRvO1xyXG4gICAgd2lkdGg6IDUwcnB4O1xyXG4gICAgaGVpZ2h0OiA1MHJweDtcclxufVxyXG5cclxuLypzaG93VG9hc3Qt57uT5p2fKi9cclxuLyrml6DmlbDmja4t5byA5aeLKi9cclxuLnB1Yi1ub2RhdGEge1xyXG4gICAgY29sb3I6ICM2NjY7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nLXRvcDogMTg2cnB4O1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuLnB1Yi1ub2RhdGEgaW1hZ2Uge1xyXG4gICAgd2lkdGg6IDIwMHJweDtcclxuICAgIGhlaWdodDogMjAwcnB4XHJcbn1cclxuXHJcbi8q5peg5pWw5o2uLee7k+adnyovXHJcbi8qKioqKioqKioqKioqKuS7peS4iuS4uumHjee9ruagt+W8jyoqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4vKirkuKrkurrkuK3lv4Mt5L2Z6aKdKioqL1xyXG4ubWluZU1vbmV5X3RvcCB7XHJcbiAgICBwYWRkaW5nOiAyNHJweCAwO1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMjBycHg7XHJcbn1cclxuXHJcbi5taW5lTW9uZXlfdG9wOmJlZm9yZSB7XHJcbiAgICBjb250ZW50OiAnJztcclxuICAgIHdpZHRoOiAycnB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgdG9wOiAyNHJweDtcclxuICAgIGJvdHRvbTogMjRycHg7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZWVlO1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3RvcCAuYm94IHtcclxuICAgIGZsZXg6IDE7XHJcbn1cclxuXHJcbi5taW5lTW9uZXlfdG9wIC50eHQge1xyXG4gICAgZm9udC1zaXplOiAyOHJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA0MHJweDtcclxuICAgIGNvbG9yOiAjOTk5O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3RvcCAucHJpY2Uge1xyXG4gICAgZm9udC1zaXplOiAzMnJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA0MHJweDtcclxuICAgIGNvbG9yOiAjZjMwO1xyXG4gICAgbWFyZ2luLXRvcDogOHJweDtcclxufVxyXG5cclxuLm1pbmVNb25leV90b3AgLmJ0biB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBmb250LXNpemU6IDI4cnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDYwcnB4O1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmM1MTUxO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNHJweDtcclxuICAgIHdpZHRoOiAxNjBycHg7XHJcbiAgICBtYXJnaW46IDAgNHJweDtcclxufVxyXG5cclxuLm1pbmVNb25leV90b3AgLmJ0bjIge1xyXG4gICAgYmFja2dyb3VuZDogIzIwQUQyMDtcclxufVxyXG5cclxuLm1pbmVNb25leV90aXQge1xyXG4gICAgZm9udC1zaXplOiAyOHJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA0MHJweDtcclxuICAgIGNvbG9yOiAjOTk5O1xyXG4gICAgcGFkZGluZzogOHJweCAyNHJweDtcclxufVxyXG5cclxuLm1pbmVNb25leV9saXN0IHtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAycnB4O1xyXG4gICAgcGFkZGluZzogMjBycHggMTIwcnB4IDIwcnB4IDI0cnB4O1xyXG4gICAgZm9udC1zaXplOiAyNHJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA0MHJweDtcclxuICAgIGNvbG9yOiAjOTk5O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4ubWluZU1vbmV5X2xpc3QgLnRpdCB7XHJcbiAgICBmb250LXNpemU6IDI4cnB4O1xyXG4gICAgY29sb3I6ICMzMzM7XHJcbn1cclxuXHJcbi5taW5lTW9uZXlfbGlzdCAucHJpY2Uge1xyXG4gICAgZm9udC1zaXplOiAyOHJweDtcclxuICAgIGNvbG9yOiAjMjBBRDIwO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDI0cnB4O1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtNTAlKTtcclxufVxyXG5cclxuLm1pbmVNb25leV9jYXNoIHtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC40KTtcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLm1pbmVNb25leV9jYXNoIC5ib3gge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBib3JkZXItcmFkaXVzOiA2cnB4O1xyXG4gICAgd2lkdGg6IDY0MHJweDtcclxufVxyXG5cclxuLm1pbmVNb25leV9jYXNoIC50aXQge1xyXG4gICAgZm9udC1zaXplOiAzMnJweDtcclxuICAgIGhlaWdodDogMTAwcnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDEwMHJweDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLm1pbmVNb25leV9jYXNoIC5jb250IHtcclxuICAgIHBhZGRpbmc6IDAgNDBycHg7XHJcbn1cclxuXHJcbi5taW5lTW9uZXlfY2FzaCAuY29udCB0ZXh0YXJlYSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTYwcnB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHJweDtcclxuICAgIGJvcmRlcjogMnJweCBzb2xpZCAjZWVlO1xyXG4gICAgZm9udC1zaXplOiAyNHJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAzNnJweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDIwcnB4O1xyXG4gICAgcGFkZGluZzogMTZycHggMjBycHg7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X2Nhc2ggLmNvbnQgaW5wdXQge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDcycnB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHJweDtcclxuICAgIGJvcmRlcjogMnJweCBzb2xpZCAjZWVlO1xyXG4gICAgZm9udC1zaXplOiAyNHJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA3MnJweDtcclxuICAgIHBhZGRpbmctbGVmdDogMjBycHg7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X2Nhc2ggLmJ0bl9ib3gge1xyXG4gICAgYm9yZGVyLXRvcDogMnJweCBzb2xpZCAjZWVlO1xyXG4gICAgbWFyZ2luLXRvcDogMzBycHg7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X2Nhc2ggLmJ0bl9ib3ggdmlldyB7XHJcbiAgICBmb250LXNpemU6IDMwcnB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgbGluZS1oZWlnaHQ6IDgwcnB4O1xyXG4gICAgZmxleDogMTtcclxufVxyXG5cclxuLm1pbmVNb25leV9jYXNoIC5idG5fYm94IC5idG4yIHtcclxuICAgIGNvbG9yOiAjZjMwO1xyXG4gICAgYm9yZGVyLWxlZnQ6IDJycHggc29saWQgI2VlZTtcclxufVxyXG5cclxuLm1pbmVNb25leV9yZWNoYXJnZSB7XHJcbiAgICBtaW4taGVpZ2h0OiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcclxufVxyXG5cclxuLm1pbmVNb25leV9yZWNoYXJnZSAudGl0bGUge1xyXG4gICAgcGFkZGluZzogMTJycHggMjRycHg7XHJcbiAgICBmb250LXNpemU6IDI4cnB4O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5saXN0X2JveCB7XHJcbiAgICBwYWRkaW5nOiAwIDE0cnB4O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5wcmljZV9saXN0IHtcclxuICAgIHdpZHRoOiAxODRycHg7XHJcbiAgICBoZWlnaHQ6IDExMHJweDtcclxuICAgIG1hcmdpbjogMTBycHggMTBycHg7XHJcbiAgICBib3JkZXI6IDJycHggc29saWQgI2Y5ZjlmOTtcclxuICAgIGJhY2tncm91bmQ6ICNmOWY5Zjk7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBmbG9hdDogbGVmdDtcclxuICAgIHBhZGRpbmctdG9wOiAxNnJweDtcclxufVxyXG5cclxuLm1pbmVNb25leV9yZWNoYXJnZSAucHJpY2VfbGlzdC5vbiB7XHJcbiAgICBib3JkZXItY29sb3I6ICNmZjAwMDA7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5wcmljZV9saXN0IC5udW0ge1xyXG4gICAgZm9udC1zaXplOiAzMnJweDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogOHJweDtcclxufVxyXG5cclxuLm1pbmVNb25leV9yZWNoYXJnZSAucHJpY2VfbGlzdCAudHh0IHtcclxuICAgIGNvbG9yOiAjNjY2O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5wcmljZV9saXN0LmN1c3RvbSAudHh0IHtcclxuICAgIGNvbG9yOiAjMzMzO1xyXG4gICAgbWFyZ2luLXRvcDogMzBycHg7XHJcbn1cclxuXHJcbi5taW5lTW9uZXlfcmVjaGFyZ2UgLnByaWNlX2xpc3QuY3VzdG9tIC50eHQge1xyXG4gICAgY29sb3I6ICMzMzM7XHJcbiAgICBtYXJnaW4tdG9wOiAzMHJweDtcclxufVxyXG5cclxuLm1pbmVNb25leV9yZWNoYXJnZSAucHJpY2VfbGlzdC5vbiAubnVtLFxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5wcmljZV9saXN0Lm9uIC50eHQge1xyXG4gICAgY29sb3I6ICNmZjAwMDA7XHJcbn1cclxuXHJcbi5taW5lTW9uZXlfcmVjaGFyZ2UgLmlucCB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJvcmRlcjogMnJweCBzb2xpZCAjZGRkO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNnJweDtcclxuICAgIGxpbmUtaGVpZ2h0OiA2NHJweDtcclxuICAgIHBhZGRpbmctbGVmdDogMjBycHg7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgbWFyZ2luLXRvcDogMjBycHg7XHJcbiAgICBmb250LXNpemU6IDI4cnB4O1xyXG4gICAgY29sb3I6ICMzMzM7XHJcbiAgICBoZWlnaHQ6IDY0cnB4O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5wYXlfd2F5IC5saXN0IHtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBwYWRkaW5nOiAzMHJweCAyNHJweDtcclxuICAgIGJvcmRlci1ib3R0b206IDJycHggc29saWQgI2VlZTtcclxuICAgIGJvcmRlci10b3A6IDJycHggc29saWQgI2VlZTtcclxufVxyXG5cclxuLm1pbmVNb25leV9yZWNoYXJnZSAucGF5X3dheSAubGlzdCBpbWFnZSB7XHJcbiAgICB3aWR0aDogNjBycHg7XHJcbiAgICBoZWlnaHQ6IDYwcnB4O1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDIwcnB4O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5wYXlfd2F5IC5saXN0IC50eHQge1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICBmb250LXNpemU6IDI4cnB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDYwcnB4O1xyXG59XHJcblxyXG4ubWluZU1vbmV5X3JlY2hhcmdlIC5wYXlfd2F5IC5saXN0IHd4LXJhZGlvIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgZmxvYXQ6IHJpZ2h0O1xyXG4gICAgbWFyZ2luLXRvcDogN3JweDtcclxufVxyXG5cclxuLm1pbmVNb25leV9yZWNoYXJnZSAubG9uZ19idG4ge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBtYXJnaW46IDQwcnB4IDI0cnB4O1xyXG4gICAgYmFja2dyb3VuZDogI2ZmNzI1YztcclxuICAgIGJvcmRlcjogMDtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgZm9udC1zaXplOiAzMnJweDtcclxufVxyXG5cclxuLyoq5Liq5Lq65Lit5b+DKioqL1xyXG5cclxuLyrlvq7kv6HmjojmnYMqL1xyXG4ucHViT3BlblNldHRpbmcge1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHRvcDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgei1pbmRleDogOTk5O1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjQpO1xyXG59XHJcblxyXG4ucHViT3BlblNldHRpbmcgLmNvbnQge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB3aWR0aDogNzAlO1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhycHg7XHJcbiAgICBwYWRkaW5nOiA0MHJweCAwcnB4IDA7XHJcbiAgICBmb250LXNpemU6IDMycnB4O1xyXG4gICAgY29sb3I6ICMzMzM7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLnB1Yk9wZW5TZXR0aW5nIC5jb250IC5idG5fYm94IHtcclxuICAgIGJvcmRlci10b3A6IDJycHggc29saWQgI2VlZTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIG1hcmdpbi10b3A6IDQwcnB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxufVxyXG5cclxuLnB1Yk9wZW5TZXR0aW5nIC5jb250IC5idG5fYm94IC5idG4ge1xyXG4gICAgYm9yZGVyLXRvcDogMDtcclxuICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICBmbGV4OiAxO1xyXG59XHJcblxyXG4ucHViT3BlblNldHRpbmcgLmNvbnQgLmJ0bl9ib3ggLmJ0bi5jYW5jZWwge1xyXG4gICAgY29sb3I6ICMzMzM7XHJcbiAgICBib3JkZXItcmlnaHQ6IDJycHggc29saWQgI2VlZTtcclxufVxyXG5cclxuLnB1Yk9wZW5TZXR0aW5nIC5jb250IC5idG4ge1xyXG4gICAgYm9yZGVyLXRvcDogMnJweCBzb2xpZCAjZWVlO1xyXG4gICAgbGluZS1oZWlnaHQ6IDgwcnB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgZm9udC1zaXplOiAzNnJweDtcclxuICAgIGNvbG9yOiAjMjBBRDIwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgbWFyZ2luLXRvcDogNDBycHg7XHJcbn1cclxuXHJcbi5wdWJPcGVuU2V0dGluZyAuY29udCAuYnRuIGJ1dHRvbiB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICAgIHdpZHRoOiAwO1xyXG4gICAgaGVpZ2h0OiAwO1xyXG4gICAgY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufSIsbnVsbF19 */
</style>