<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<!--提示框引入-开始-->

				<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
					<block v-if="showToast.isShow? showToast.isShow: false">
						<!-- <view class="toast-bg" wx:if="{{showToast.mask==false? false : true}}"></view>   -->
						<view class="toast-center">
							<view class="toast">
								<image class="toast-icon" :src="showToast.icon" mode="scaleToFill"
									v-if="showToast.icon"></image>
								<text class="toast-text">{{showToast.title}}</text>
							</view>
						</view>
					</block>
				</block>
				<!--提示框引入-结束-->

				<view v-if="isindexshow" :style="'height: 100%; background-color: #F5F7FA '+ ';'">
					<!--内容-开始-->
					<image class="indexBg" mode="widthFix" :src="indexBgColor.background"></image>
					<view class="WMhome" :catchtouchmove="screenTabShow ? catchtouchmove : ''">
						<block v-for="(module, module_idx) in indexCont" :key="module_idx">
							<!--模块1-->
							<view class="topBg_box" v-if="module.module == 'module1'"
								:style="'background-color:#' + module.background_color">
								<image class="topBg_pic" mode="aspectFit" :src="module.background"></image>
								<view class="topBg_nr">
									<!--头部定位-开始-->
									<block v-if="module.type == 2">
										<view id="searchBox_h"></view>
										<view class="topState" style="height:88rpx;">
											<view class="right_search fr" @tap.stop="tosearch">
												<view class="inp">
													<image class="ico_search" src="/static/image/quan_sou.png"
														mode="aspectFit"></image>
													<input placeholder="请输入" disabled="true">
												</view>
											</view>
											<view class="location" @tap.stop="tosearchaddr">
												<image class="addr_ico" :src="module.icon_location" mode="aspectFit">
												</image><text :style="'color:#' + module.color">{{currentaddr}}</text>
												<image class="down_ico" :src="module.icon_down" mode="aspectFit">
												</image>
											</view>
										</view>
									</block>
									<block v-else-if="module.type == 3">
										<view style="height:168rpx;">
											<view class="topState" id="searchBox_h">
												<view class="weather">
													<view class="fl">
														<image class="ico_weather" :src="module.weather.icon"
															mode="aspectFit"></image>{{module.weather.temperature}}
													</view>
													<view class="fl ml10">
														<view class="small">{{module.weather.indicator}}</view>
														<view class="small">{{module.weather.title}}</view>
													</view>
												</view>
												<view class="location" @tap.stop="tosearchaddr">
													<image class="addr_ico" :src="module.icon_location"
														mode="aspectFit"></image><text
														:style="'color:#' + module.color">{{currentaddr}}</text>
													<image class="down_ico" :src="module.icon_down" mode="aspectFit">
													</image>
												</view>
											</view>
											<view class="searchBox" @tap.stop="tosearch">
												<image class="ico_search" src="/static/image/quan_sou.png"
													mode="aspectFit"></image>

												<view
													style="height: 64rpx;font-size: 28rpx;color: #999;line-height: 64rpx;">
													请输入商家名称或商品名称</view>
											</view>
										</view>
									</block>
									<block v-else>
										<view style="height:168rpx;">
											<view class="topState" id="searchBox_h">
												<view class="location" style="max-width:100% !important;"
													@tap.stop="tosearchaddr">
													<image class="addr_ico" :src="module.icon_location"
														mode="aspectFit"></image><text
														:style="'color:#' + module.color">{{currentaddr}}</text>
													<image class="down_ico" :src="module.icon_down" mode="aspectFit">
													</image>
												</view>
											</view>
											<view class="searchBox" @tap.stop="tosearch">
												<image class="ico_search" src="/static/image/quan_sou.png"
													mode="aspectFit"></image>

												<view
													style="height: 64rpx;font-size: 28rpx;color: #999;line-height: 64rpx;">
													请输入商家名称或商品名称</view>
											</view>
										</view>
									</block>
									<!--头部定位-结束-->
									<!--头部热词-开始-->
									<view class="searchWord" v-if="module.searchBox.open == 1">
										<ul>
											<li v-for="(item, index) in module.searchBox.keywords" :key="index"
												class="list" @tap.stop="tosearchshoplist" :data-tit="item"
												:style="'color:#' + module.color">{{item}}</li>
										</ul>
									</view>
									<!--头部热词-结束-->
								</view>
							</view>

							<!--模块2-->
							<view class="bannerBg_box" v-if="module.module == 'module2'"
								:style="'background-color:#' + module.background_color">
								<!--轮播图-开始-->
								<block v-if="module.type == 1">
									<view class="idxBanner">
										<swiper autoplay="true" duration="1000" circular="true" indicator-dots="true"
											indicator-color="#D7D7D7" indicator-active-color="#FF797C"
											previous-margin="31px" next-margin="31px">
											<block v-for="(item, index) in module.content" :key="index">
												<swiper-item>
													<!-- @tap="toWxLink" -->
													<image :src="item.photo" mode="widthFix" :data-url="item.wxlink">
													</image>
												</swiper-item>
											</block>
										</swiper>
									</view>
								</block>
								<block v-if="module.type == 2">
									<image class="bannerBg_pic" :src="module.background"></image>
									<!-- @tap="toWxLink" -->
									<view class="idxBanner" :data-url="module.wxlink">
										<swiper indicator-dots="">
											<swiper-item></swiper-item>
										</swiper>
									</view>
								</block>
								<!--轮播图-结束-->
							</view>

							<!--模块3-->
							<!--分类导航-开始-->
							<view :class="'cateNav ' + (module.type == 1 ? 'col5' : '')"
								v-if="module.module == 'module3'"
								:style="'background-color:#' + module.background_color">
								<image class="cateNavBg_pic" mode="aspectFit" :src="module.background"></image>
								<!-- {{Math.ceil(module.content.length/10)}} -->
								<swiper circular="true">
									<block
										v-for="(li, key) in module.type == 1 ? (module.content.length%10 != 0 ? module.content.length/10 : module.content.length/10) : (module.content.length%8 != 0 ? module.content.length/8 : module.content.length/8)"
										:key="key">
										<swiper-item>
											<ul>
												<li v-for="(item, index) in module.content" :key="index"
													v-if="module.type == 1 ? (index < (key+1)*10 && index >= key*10) : (index < (key+1)*8 && index >= key*8)"
													@tap="toCateLink" :data-obj="JSON.stringify(item)"
													:data-idx="index">
													<image :src="item.photo"></image>
													<view class="txt" :style="'color:#' + module.color">{{item.title}}
													</view>
												</li>
											</ul>
										</swiper-item>
									</block>
								</swiper>
							</view>
							<!--分类导航-结束-->

							<!--模块5-6-->
							<!--优惠专区-开始-->
							<block v-if="module.module == 'module5' || module.module == 'module6'">
								<view class="idxTitle" @tap.stop="toYouhuiMore" :data-url="module.wxlink"
									@tap="toWxLink">
									<image :src="module.photo" mode="aspectFit"></image>
								</view>
								<!--左右滑动-->
								<view class="preferentialAarea preferentialAarea1 mb10"
									v-if="module.type == 1 || !(module.type)">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--两张-->
								<view class="preferentialAarea preferentialAarea2 mb10" v-else-if="module.type == 2">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--单张-->
								<view class="preferentialAarea preferentialAarea3 mb10" v-else-if="module.type == 3">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--三张-->
								<view class="preferentialAarea preferentialAarea4 mb10" v-else-if="module.type == 4">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--四张-->
								<view class="preferentialAarea preferentialAarea5 mb10" v-else-if="module.type == 5">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--四张混-->
								<view class="preferentialAarea preferentialAarea6 mb10" v-else-if="module.type == 6">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--六张-->
								<view class="preferentialAarea preferentialAarea7 mb10" v-else-if="module.type == 7">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--左右滑动-->
								<view class="preferentialAarea preferentialAarea1 mb10" v-else>
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
							</block>
							<!--优惠专区-结束-->

							<!--模块7-->
							<!--大牌甄选-开始-->
							<block v-if="module.module == 'module7'">
								<view class="idxTitle" @tap.stop="toWxLink" :data-url="module.wxlink">
									<image :src="module.photo" mode="aspectFit"></image>
								</view>
								<view class="largeSelection1" v-if="module.type == 1 || !(module.type)">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap="toWxLink"
											:data-url="item.wxlink">
											<image class="pic" :src="item.photo"></image>
											<!-- <view class="overflow_clear tit">{{item.title}}</view> -->
										</li>
									</ul>
								</view>
								<view class="largeSelection2" v-if="module.type == 2">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap="toWxLink"
											:data-url="item.wxlink">
											<image class="pic" :src="item.photo" mode="widthFix"></image>

										</li>
									</ul>
								</view>
							</block>
							<!--大牌甄选-结束-->
							<!--模块8-->
							<!--单条活动广告-开始-->
							<block v-if="module.module == 'module8'">
								<view class="preferentialAarea preferentialAarea3 mb10">
									<ul>
										<li @tap.stop="toWxLink" :data-url="module.wxlink">
											<image :src="module.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
							</block>
							<!--单条活动广告-结束-->
						</block>
					</view>
					<!--商家列表-开始-->

					<view class="shopLists_h">
						<block data-type="template" data-is="shoplists" data-attr="lists:shopLists,hdShow:hdShow">
							<view class="shoplistsNewBox">
								<view v-for="(item, index) in shopLists" :key="index" class="shopnewlists"
									@tap="gotoDetail" :id="item.qiang_id">
									<view class="logo">
										<image :src="item.photo" class="pic" mode="aspectFill"></image>
										<view class="num">
											-{{ parseInt((((item.price-item.discount_price)/item.price)*100).toFixed(0)) }}%
										</view>
										<view class="txt_box">
											<view class="flex-wrp "
												style="justify-content: space-between;line-height: 40rpx;">
												<view class="tit beyond"
													style="color: #222222;font-size: 28rpx;width: 200rpx;">
													{{item.title}}
												</view>
												<span class='text_freight'
													style="text-decoration: line-through;color: #A3A3A4;">
													<block>€{{item.price}}</block>
												</span>
											</view>

											<view class="flex-wrp "
												style="justify-content: space-between;line-height: 40rpx;">
												<view class="beyond" style="width: 200rpx;">
													{{item.shop_title}}
												</view>
												<view style="color: #FF797C;font-size: 32rpx;">
													€{{item.discount_price}}
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="pub-nodata" v-if="shopLists.length == 0">
								<image src="/static/image/noorder.png"></image>
								<view class="black6">暂无数据</view>
							</view>
						</block>
						<view style="height:1px"></view>
					</view>
					<!--商家列表-结束-->
					<!--内容-结束-->
				</view>



				<block v-if="!isindexshow">
					<view class="nologin">
						<image src="/static/image/noorder.png"></image>
						<view class="tip black6">授权定位获取信息</view>
						<button type="primary" size="default" class="mt20" @tap="getplace">获取位置</button>
					</view>
				</block>

				<!--白布-开始-->
				<view class="bai-cont" :hidden="whitebg"></view>
				<!--白布-结束-->

				<!--用户点击手势调用授权设置-开始-->
				<block>
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
				<!--用户点击手势调用授权设置-结束-->
			</view>

			<view class="viewewView" @click="bingTaociksa">
				<image src="/static/image/icon_messD3x.png" mode="aspectFill" style="width: 56rpx;height: 56rpx;">
				</image>
				<view>订单</view>
			</view>
		</skeleton>
	</view>
</template>

<script>
	//获取应用实例
	let common = require("../../../js/ecart.js");
	let app = getApp(),
		ecart = null,
		double = true,
		qqmapsdk;
	let QQMapWX = require("../../../js/qqmap-wx-jssdk.js");
	let config = require("../../../libs/config.js");
	let searchBox_h, _h; //创建节点选择器
	//创建节点选择器
	let query; //商家筛选参数
	//商家筛选参数
	let params = {
		page: 1,

	};

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 20,
					showTitle: true,
				},
				indexCont: [],

				OpenSettingShow: false,
				//浮动搜索框是否出现
				screenTabShow: false,
				//下拉筛选浮动是否出现
				shopLists: [],
				page: 1,
				hdShow: null,

				currentaddr: '',
				isindexshow: app.globalData._CFG.isindexshow,
				whitebg: false,
				loadimg: true,
				headerTitle: '',
				indexBgColor: {
					background: ""
				},
				showToast: {
					isShow: false
				},
				null: "",
				key: ''
			};
		},

		onLoad: function() {

		},

		onShow() {
			//请求数据
			var that = this;
			uni.getStorage({
				key: 'currentAddr',
				success: function(res) {
					console.log(res)
					if (!res.data) {
						return
					}

					if (that.currentaddr != res.data.addr) {
						app.globalData._CFG.lng = res.data.lng;
						app.globalData._CFG.lat = res.data.lat;
						app.globalData._CFG.isindexshow = true;
						that.currentaddr = res.data.addr;
						that.setData({
							currentaddr: res.data.addr,
							isindexshow: app.globalData._CFG.isindexshow
						});
						that.https();
					}
				}
			}); //商家购物车商品变化
			this.refreshPage3389();
			if (that.shopLists.length > 0) {
				var shopLists = that.shopLists; //构造商家购物车数量
				for (var i = 0; i < shopLists.length; i++) {
					ecart = new common.ECart(shopLists[i].shop_id);
					shopLists[i].totalnum = ecart.total_count();
				};
				that.setData({
					shopLists: shopLists
				});
			};
		},

		//上来加载
		onReachBottom(e) {
			console.log('loading page:', page);
			let page = this.page;
			this.setData({
				page: page + 1
			});
			this.initData();
		},

		onPullDownRefresh: function() {
			this.initData(1, function() {
				uni.stopPullDownRefresh();
			});
		},

		/*** 用户点击右上角分享*/
		onShareAppMessage: function(res) {
			return {
				title: this.headerTitle,
				path: '/pages/index/index'
			};
		},
		methods: {
			bingTaociksa() {
				uni.navigateTo({
					url: '/pages/qiangOrder/qiangOrder'
				})
			},
			//骨架屏
			https: function(nothasloading) {
				var that = this;
				that.loading = true
				app.globalData.qiangTheme({
					"lng": app.globalData._CFG.lng,
					"lat": app.globalData._CFG.lat
				}, function(res) {
					that.loading = false
					if (res.error == '0') {

						that.loadimg = true;
						for (let i in res.data.theme) {
							if (res.data.theme[i].module == 'module2') {
								for (let h in res.data.theme[i].content) {
									if (res.data.theme[i].content[h].photo ==
										'https://image.aioeuropa.com/photo/202110/20211001_235AF9D6370A3B7EC840B14D3DD2C837.png'
									) {
										res.data.theme[i].content.splice(h, 1)
									}
									if (res.data.theme[i].content[h].photo ==
										'https://image.aioeuropa.com/photo/202111/20211102_AFB1755A541623C956F80246655FF536.png'
									) {
										res.data.theme[i].content.splice(h, 1)
									}
								}
							}
						}
						that.setData({
							indexCont: res.data.theme,
							whitebg: true
						});
						for (var i = 0; i < res.data.theme.length; i++) {
							if (res.data.theme[i].module == "module0") {
								that.setData({
									indexBgColor: res.data.theme[i]
								});
							}
						};
					} else {
						app.globalData.msgbox(res.message);
						that.loadimg = true;
						that.setData({
							whitebg: true
						});
					}
				}, nothasloading);
				app.globalData.homeInfo({}, function(ret) {
					that.loading = false
					if (ret.error == '0') {
						that.headerTitle = ret.data.title;
						uni.setNavigationBarTitle({
							title: ret.data.title
						});
					};
				});
				that.initData(1);
			},

			initData(setpage, completeCallback) {
				completeCallback = typeof completeCallback == 'function' ? completeCallback : function(res) {};
				var that = this;
				if (setpage == 0) {
					that.loading = true;
				}

				var page = setpage ? setpage : that.page;
				params.page = page;

				app.globalData.qiangIndex(params, function(res) {
					completeCallback();
					if (setpage == 0) {
						that.loading = false;
					}

					if (res.error == "0") {
						//构造商家购物车数量
						for (var i = 0; i < res.data.items.length; i++) {
							ecart = new common.ECart(res.data.items[i].shop_id);
							res.data.items[i].totalnum = ecart.total_count();
						}; //判断是否为刷新加载数据
						if (res.data.items.length > 0) {
							//console.log(setpage)
							if (res.data.items.length < 10) {
								if (!setpage) {
									uni.showToast({
										title: "暂无更多数据~"
									});
								};
							};

							if (page > 1) {
								that.setData({
									shopLists: that.shopLists.concat(res.data.items)
								});
							} else {
								that.setData({
									shopLists: res.data.items
								});
							};
						} else {
							if (!setpage) {
								that.setData({
									shopLists: that.shopLists.concat(res.data.items)
								});
								uni.showToast({
									title: "暂无更多数据~"
								});
							} else {
								that.setData({
									shopLists: res.data.items
								});
							};
						};
					};
				});
			},

			//地址
			addr: function() {
				var that = this;
				qqmapsdk = new QQMapWX({
					key: config.data.key
				});
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: app.globalData._CFG.currentlat,
						longitude: app.globalData._CFG.currentlng
					},
					success: function(res) {
						//console.log("经纬度", app._CFG.currentlat, app._CFG.currentlng, "地址", res);
						that.setData({
							currentaddr: res.result.address_component.street + res.result
								.address_component.street_number
						});
					},
					fail: function(res) {
						that.setData({
							currentaddr: '手动定位'
						});
					}
				});
			},
			getplace: function() {
				var that = this;
				uni.getLocation({
					//type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
					type: 'gcj02',
					//手机定位问题
					success(res) {
						app.globalData._CFG.lng = res.longitude;
						app.globalData._CFG.lat = res.latitude;
						app.globalData._CFG.currentlng = res.longitude;
						app.globalData._CFG.currentlat = res.latitude;
						app.globalData._CFG.isindexshow = true;
						that.setData({
							isindexshow: app.globalData._CFG.isindexshow
						});
						that.refreshPage3389({});
					},
					fail(err) {
						that.setData({
							whitebg: true
						});
						uni.showModal({
							title: '提示',
							content: '检测到您没有打开外卖的定位权限，是否去设置打开？',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting({
										success: res => {
											if (res.authSetting[
													"scope.userLocation"]) {
												app.globalData._CFG.isindexshow =
													true;
												that.setData({
													isindexshow: app
														.globalData._CFG
														.isindexshow
												});
												that.refreshPage3389({});
											} else {
												app.globalData._CFG.isindexshow =
													false;
												that.setData({
													isindexshow: app
														.globalData._CFG
														.isindexshow
												});
												that.refreshPage3389({});
											}
										}
									});
								} else if (res.cancel) {
									app.globalData._CFG.isindexshow = false;
									that.setData({
										isindexshow: app.globalData._CFG.isindexshow
									});
									that.refreshPage3389({});
								}
							}
						});
					}
				});
			},
			tosearchaddr: function() {
				// app.globalData.topage('/pages/qianglist/qianglist?type=1');
				app.globalData.topage('/pages/position/searchaddr/search');
			},
			//跳转商家搜索
			tosearch: function() {
				app.globalData.topage('/pages/qianglist/qianglist?type=1');
			},
			tosearchshoplist: function(e) {
				app.globalData._CFG.title = e.currentTarget.dataset.tit;
				app.globalData.topage('/pages/qianglist/qianglist?type=1&title=' + e.currentTarget.dataset.tit);
			},

			//遮罩层阻止冒泡事件
			catchtouchmove: function() {},

			//去商家详情
			gotoDetail(e) {
				var id = e.currentTarget.id;
				var url = '/pages/qiang/qiangdetail?id=' + id
				app.globalData.topage(url);
			},


			//导航菜单链接
			toCateLink(e) {
				var obj = JSON.parse(e.currentTarget.dataset.obj);
				var title = obj.title;
				var cate_id = obj.cate_id;
				var url = obj.wxlink;
				var idx = e.currentTarget.dataset.idx;

				app.globalData._CFG.cateid = obj.cate_id;
				app.globalData._CFG.title = '';
				console.log(e)

				if (obj.wxlink == '') {
					console.log(123123)
					uni.showToast({
						title: "请设置小程序的" + title + "链接"
					});
				} else {
					app.globalData.gopage(obj.wxlink);
					// app.globalData.topage('/pages/qianglist/qianglist?type=1&title=' + title);
					return
					var ss = url.indexOf('?');
					if (ss == -1) {
						var src = url + '?idx=' + idx + '&title=' + title;
					} else {
						var src = url + '&idx=' + idx + '&title=' + title;
					};

					if (url.indexOf('/qiang') != -1) {
						app.globalData.topage('/pages/outsideLink/qianggou/qianggou');
					} else if (url.indexOf('/paotui') != -1) {
						app.globalData.topage('/pages/outsideLink/paotui/paotui');
					} else if (url.indexOf('/jifen') != -1) {
						app.globalData.topage('/pages/outsideLink/integralMall/integralMall');
					} else {
						app.globalData.gopage(src);
					}
				};
			},

			//首页模块跳转链接
			toWxLink(e) {
				var url = e.currentTarget.dataset.url;
				let type = e.currentTarget.dataset.type;

				if (url) {
					app.globalData.gopage(url);
				} else {
					if (type == 1) {
						uni.navigateToMiniProgram({
							appId: 'wx887a6fc1e95cd883',
							// 「境外游礼包」小程序AppId（必填）
							path: 'pages/onlineactpage/onlineactpage',
							// 「境外游礼包」小程序活动页面指定路径（必填）
							extraData: {
								backPath: '***' // 用于指定「境外游礼包」小程序返回商户小程序的页面路径（注意是商户小程序的页面路径）（非必填）
								// 如有需要还可以补充其他字段

							}
						});
					} else {
						uni.navigateToMiniProgram({
							appId: 'wx887a6fc1e95cd883',
							// 「境外游礼包」小程序AppId（必填）
							path: 'pages/Lunarpage/Lunarpage?areaCode=999',
							// 「境外游礼包」小程序活动页面指定路径（必填）
							extraData: {
								backPath: '***' // 用于指定「境外游礼包」小程序返回商户小程序的页面路径（注意是商户小程序的页面路径）（非必填）
								// 如有需要还可以补充其他字段

							}
						});
					}
				}
			},

			//授权
			closeSetting() {
				uni.pubOpenSetting(false);
			},
			refreshPage3389: function() {
				app.globalData.getcitylist({}, res => {
					if (res.error === '0') app.globalData.allcitylist = res.data.items;
				});
				var that = this;
				that.loading = true;
				uni.getStorage({
					key: 'currentAddr',
					success: function(res) {
						console.log(res.data)
						if (res.data) {
							app.globalData._CFG.lng = res.data.lng;
							app.globalData._CFG.lat = res.data.lat;
							app.globalData._CFG.isindexshow = true;
							that.currentaddr = res.data.addr, that.setData({
								currentaddr: res.data.addr,
								isindexshow: app.globalData._CFG.isindexshow
							});
							that.https();
						} else {
							app.globalData.getLocation(function() {
								app.globalData._CFG.currentlng = app.globalData._CFG.lng;
								app.globalData._CFG.currentlat = app.globalData._CFG.lat;
								app.globalData._CFG.isindexshow = true;
								that.setData({
									isindexshow: app.globalData._CFG.isindexshow
								}); //定位接口

								app.globalData.addrdecode({
									"lng": app.globalData._CFG.lng,
									"lat": app.globalData._CFG.lat
								}, function(ret) {
									if (ret.error == 0) {
										that.setData({
											currentaddr: ret.data.addr.addr
										});
										uni.setStorage({
											key: "fzCity",
											data: ret.data.addr.city
										});
									} else {
										that.setData({
											currentaddr: "手动定位"
										});
									}
								});
								that.https();
							});
						}
					},
					fail: function(err) {
						app.globalData.getLocation(function() {
							app.globalData._CFG.currentlng = app.globalData._CFG.lng;
							app.globalData._CFG.currentlat = app.globalData._CFG.lat;
							app.globalData._CFG.isindexshow = true;
							that.setData({
								isindexshow: app.globalData._CFG.isindexshow
							}); //定位接口
							app.globalData.addrdecode({
								"lng": app.globalData._CFG.lng,
								"lat": app.globalData._CFG.lat
							}, function(ret) {
								if (ret.error == 0) {
									that.setData({
										currentaddr: ret.data.addr.addr
									});
									uni.setStorage({
										key: "fzCity",
										data: ret.data.addr.city
									});
								} else {
									that.setData({
										currentaddr: "手动定位"
									});
								}
							});
							that.https();
						});
					}
				});
			},
			toYouhuiMore() {
				console.log("占位：函数 toYouhuiMore 未声明");
			},
			isShowToast(showToast) {
				return showToast.isShow ? showToast.isShow : false
			}
		},

	};
</script>
<style>
	.shoplistsNewBox {
		padding: 0 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.shopnewlists {
		width: 340rpx;
		height: 440rpx;
		margin-bottom: 32rpx;
		border-radius: 12rpx;
		overflow: hidden;

	}

	.shopnewlists .logo {
		width: 340rpx;
		height: 440rpx;
		position: relative;

	}

	.shopnewlists .logo .pic {
		width: 340rpx;
		height: 440rpx;
	}

	.shopnewlists .logo .num {
		position: absolute;
		right: 16rpx;
		top: 16rpx;
		line-height: 28rpx;
		text-align: center;
		background: #FF4D5B;
		color: #fff;
		font-size: 20rpx;
		border-radius: 60rpx;
		padding: 6rpx 12rpx;
	}

	.shopnewlists .txt_box {
		position: absolute;
		left: 0;
		height: 100rpx;
		width: 308rpx;
		bottom: 32rpx;
		padding: 0 16rpx;
		background: rgba(255, 255, 255, .8);

	}

	.viewewView {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		right: 48rpx;
		bottom: 200rpx;
		border-radius: 100rpx;
		background: #ffbd0c;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 24rpx;
		z-index: 10;
	}

	/* #ifdef MP-ALIPAY  */
	.setINput {
		height: 54rpx !important;
	}

	/* #endif */
	.bannerBg_box {
		position: relative;
		background: #ffffff;
	}

	.bannerBg_box .bannerBg_pic {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		left: 0;
		top: 0;
	}

	.topBg_box {
		position: relative;
		padding-bottom: 1rpx;
	}

	.topBg_box .topBg_pic {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		left: 0;
		top: 0;
	}

	.topBg_box .topBg_nr {
		position: relative;
		z-index: 1;
		background: #ffffff;
	}


	.indexBg {
		position: absolute;
		z-index: 0;
		left: 0;
		top: -40rpx;
		width: 100%;
	}

	.WMhome {
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.WMhome .location {
		font-size: 36rpx;
		padding: 4rpx 20rpx 18rpx;
		max-width: 46%;
	}

	.WMhome .location .addr_ico {
		display: inline-block;
		width: 28rpx;
		height: 36rpx;
		vertical-align: middle;
		margin-right: 12rpx;
	}

	.WMhome .location .down_ico {
		display: inline-block;
		width: 20rpx;
		height: 16rpx;
		vertical-align: middle;
		margin-left: 12rpx;
	}

	.WMhome .location text {
		display: inline-block;
		max-width: calc(100% - 72rpx);
		height: 40rpx;
		line-height: 40rpx;
		vertical-align: middle;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 34rpx;
		font-weight: 500;
	}

	.WMhome .topState {
		overflow: hidden;
		padding-top: 16rpx;
		box-sizing: border-box;
	}

	.WMhome .weather {
		overflow: hidden;
		font-size: 40rpx;
		line-height: 48rpx;
		color: #666;
		float: right;
		height: 48rpx;
		background: rgba(255, 255, 255, 0.8);
		margin-right: 20rpx;
		border-radius: 34rpx;
		padding: 10rpx 30rpx;
	}

	.WMhome .weather .ico_weather {
		display: inline-block;
		width: 48rpx;
		height: 48rpx;
		vertical-align: bottom;
		margin-right: 12rpx;
	}

	.WMhome .weather .small {
		font-size: 18rpx;
		line-height: 24rpx;
	}

	.WMhome .right_search {
		text-align: center;
		width: 180rpx;
		height: 60rpx;
		border-radius: 60rpx;
		background: rgba(255, 255, 255, 0.8);
		margin-right: 20rpx;
	}

	.WMhome .right_search .ico_search {
		width: 22rpx;
		height: 22rpx;
		position: absolute;
		left: 24rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.WMhome .right_search .inp {
		box-sizing: border-box;
		width: 100%;
		height: 60rpx;
		border-radius: 60rpx;
		padding-left: 66rpx;
		position: relative;
	}

	.WMhome .right_search input {
		box-sizing: border-box;
		width: 100%;
		height: 60rpx;
		font-size: 28rpx;
		color: #999;
	}

	.WMhome .topBg_box .searchBox {
		margin: 12rpx 20rpx 0;
	}

	.searchBox {
		margin: 20rpx;
		box-sizing: border-box;
		height: 66rpx;
		border-radius: 8rpx;
		background: #EFF1F4;
		padding-left: 84rpx;
		position: relative;
	}

	.searchBox .ico_search {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		left: 24rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.searchBox input {
		width: 100%;
		height: 64rpx;
		font-size: 28rpx;
		color: #999;
	}

	.searchBox_fixed {
		position: fixed;
		z-index: 20;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		background: #fff;
	}

	.WMhome .searchWord {
		padding: 10rpx 0;
		margin: 0 20rpx;
		overflow-x: auto;
		overflow-y: hidden;
		height: 62rpx;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch
	}

	.WMhome .searchWord ul {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.WMhome .searchWord ul li {
		display: inline-block;
		font-size: 30rpx;
		color: #666;
		line-height: 40rpx;
		padding: 0 10rpx;
	}

	.WMhome .idxBanner {
		position: relative;
		z-index: 1;
		background: #FFFFFF;
	}

	.WMhome .idxBanner swiper {
		width: 750rpx;
		height: 288rpx !important;
		display: block;
	}

	.WMhome .idxBanner swiper image {
		width: 600rpx;
		height: 300rpx;
		display: block;
		border-radius: 4rpx;
		margin: 0 12rpx;
		border-radius: 20rpx;
		box-shadow: 0px 8rpx 16rpx 0px rgba(155, 176, 187, 0.35);
	}

	.WMhome .cateNav {
		position: relative;
		margin-bottom: 20rpx;
	}

	.WMhome .cateNav .cateNavBg_pic {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		left: 0;
		top: 0;
	}

	.WMhome .cateNav swiper {
		width: 100%;
		height: 300rpx !important;
		background: #FFFFFF;
		display: block;
		padding: 20rpx 0 0;
		position: relative;
		z-index: 1;
		border-radius: 0px 0px 16rpx 16rpx;
	}

	.WMhome .cateNav ul {
		display: block;
		overflow: hidden;
	}

	.WMhome .cateNav.col5 ul li {
		text-align: center;
		margin-top: 20rpx;
		float: left;
		width: 20%;
	}

	.WMhome .cateNav ul li {
		text-align: center;
		margin-top: 20rpx;
		float: left;
		width: 25%;
		display: block;
	}

	.WMhome .cateNav ul li image {
		width: 66rpx;
		height: 66rpx;
	}

	.WMhome .cateNav ul li .txt {
		font-size: 24rpx;
		line-height: 40rpx;
		color: #333;
		margin-top: 8rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.idxTitle {
		overflow: hidden;
	}

	.idxTitle image {
		width: 750rpx;
		height: 80rpx;
	}

	.idxTitle .tit {
		font-size: 28rpx;
		float: left;
		padding: 24rpx 0 24rpx 30rpx;
		font-weight: bold;
		color: #3E4248;
		background: #ffffff;
		border-radius: 16rpx 16rpx 0px 0px;
		width: 750rpx;
	}

	.idxTitle .more {
		float: right;
		font-size: 28rpx;
		color: #666;
	}

	.idxTitle .right_ico {
		display: inline-block;
		width: 12rpx;
		height: 20rpx;
		margin-left: 8rpx;
	}

	.preferentialAarea ul li {
		position: relative;
		overflow: hidden;
		display: block;
	}

	.preferentialAarea image {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.preferentialAarea1 {
		overflow-y: hidden;
		overflow-x: auto;
		padding: 0 30rpx;
		-webkit-overflow-scrolling: touch
	}

	.preferentialAarea1 ul {
		display: block;
		white-space: nowrap;
	}

	.preferentialAarea1 ul li {
		display: inline-block;
		width: 228rpx;
		height: 304rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.preferentialAarea2 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea2 ul {
		overflow: hidden;
	}

	.preferentialAarea2 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 0 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea3 {
		overflow: hidden;
		padding: 0 26rpx;
	}

	.preferentialAarea3 ul li {
		width: 100%;
		height: 132rpx;
		overflow: hidden;
	}

	.preferentialAarea4 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea4 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 0 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea4 ul li:last-child {
		margin-top: 8rpx;
	}

	.preferentialAarea4 ul li:first-child {
		padding: calc(32% + 4rpx) 0;
	}

	.preferentialAarea5 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea5 ul {
		overflow: hidden;
	}

	.preferentialAarea5 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 4rpx 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea6 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea6 ul {
		overflow: hidden;
	}

	.preferentialAarea6 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 4rpx 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea6 ul li:first-child {
		width: calc(100% - 8rpx);
	}

	.preferentialAarea6 ul li:nth-child(3),
	.preferentialAarea6 ul li:nth-child(4) {
		width: calc(25% - 8rpx);
	}

	.preferentialAarea7 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea7 ul {
		overflow: hidden;
	}

	.preferentialAarea7 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 4rpx 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea7 ul li:nth-child(3),
	.preferentialAarea7 ul li:nth-child(4),
	.preferentialAarea7 ul li:nth-child(5),
	.preferentialAarea7 ul li:nth-child(6) {
		width: calc(25% - 8rpx);
	}

	.largeSelection1 {
		overflow: hidden;
	}

	.largeSelection1 ul li {
		float: left;
		width: 33.33%;
		text-align: center;
		padding: 0 0 20rpx;
		display: block;
	}

	.largeSelection1 ul li .pic {
		width: 136rpx;
		height: 136rpx;
		border-radius: 100%;
		overflow: hidden;
		margin: 8rpx auto;
	}

	.largeSelection1 ul li .h3 {
		font-size: 30rpx;
		color: #333;
		line-height: 40rpx;
	}

	.largeSelection2 {
		overflow: hidden;
		padding: 0 20rpx;
	}

	.largeSelection2 ul {
		margin-top: -10rpx;
		display: block;
	}

	.largeSelection2 ul li {
		float: left;
		width: calc(50% - 20rpx);
		margin: 10rpx 10rpx;
		display: block;
	}

	.largeSelection2 ul li .pic {
		width: 100%;
		height: 251rpx;
		overflow: hidden;
	}

	.largeSelection2 ul li .logo_box {
		overflow: hidden;
		margin-top: -44rpx;
		padding: 0 20rpx;
	}

	.largeSelection2 ul li .logo {
		width: 88rpx;
		height: 88rpx;
		border-radius: 4rpx;
		background-color: #eee;
		overflow: hidden;
		float: left;
	}

	.largeSelection2 ul li .tit {
		font-size: 30rpx;
		color: #333;
		line-height: 40rpx;
		padding-top: 44rpx;
		margin-left: 100rpx;
	}

	.screenTab {
		background: #fff;
		padding: 8rpx 30rpx 20rpx;
		width: 690rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.screenTab .list {
		text-align: center;
		font-size: 26rpx;
		color: #A3A3A4;
	}

	.screenTab .list.on {
		color: #037E98;
	}

	.screenTab .list .dwon_ico {
		display: inline-block;
		width: 24rpx;
		height: 24rpx;
		margin-left: 4rpx;
	}

	.screenTab .list .screen_ico {
		display: inline-block;
		width: 24rpx;
		height: 24rpx;
		margin-left: 4rpx;
	}

	.shopLists_h {
		min-height: calc(100% - 0rpx);
	}

	.screenTab_fixed {
		position: fixed;
		z-index: 19;
		left: 0;
		top: 0rpx;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		border-bottom: 2rpx solid #eee;
	}

	.screenTab_fixed ul {
		display: block;
	}

	.screenTab_fixed .screenTab {
		position: relative;
		z-index: 19;
	}

	.screenTab_fixed .change_list {
		position: absolute;
		z-index: 18;
		left: 0;
		right: 0;
		transform: translate(0, -100%);
		transition: all 0.2s ease-in-out;
	}

	.screenTab_fixed .change_list.on {
		transform: translate(0, 0);
	}




	.screenTab_fixed .screen {
		background: #fff;
		position: relative;
	}

	.screenTab_fixed .screen .cont {
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		max-height: 760rpx;
		-webkit-overflow-scrolling: touch;
	}

	.screenTab_fixed .screen .tit {
		padding: 20rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
	}

	.screenTab_fixed .screen ul {
		overflow: hidden;
		padding: 0 12rpx;
		display: block
	}

	.screenTab_fixed .screen ul li {
		float: left;
		width: calc(33.33% - 16rpx);
		margin: 8rpx 8rpx;
		background: #f8f8f8;
		border-radius: 8rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #666;
		display: block;
	}

	.screenTab_fixed .screen ul li.on {
		background: #E8F6E8;
		color: #ff797c;
	}

	.screenTab_fixed .screen .btn_box {
		position: relative;
		z-index: 1;
		height: 96rpx;
		background: #fff;
		text-align: center;
		overflow: hidden;
	}

	.screenTab_fixed .screen .btn_box .btn {
		line-height: 96rpx;
		font-size: 32rpx;
		color: 333;
		width: 50%;
		float: left;
		border-top: 2rpx solid #eee;
	}

	.screenTab_fixed .screen .btn_box .btn2 {
		border-top: 2rpx solid #ff797c;
		background: #ff797c;
		color: #fff;
	}

	/*白布&登录&无数据&加载*/
	.nologin {
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-weblit-transform: translate(-50%, -50%)
	}

	.nologin view {
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.nologin button {
		height: 60rpx;
		line-height: 60rpx;
		width: 200rpx;
		font-size: 24rpx;
	}

	.nologin image {
		width: 200rpx;
		height: 200rpx;
	}



	.bai-cont {
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
		z-index: 999;
	}

	.bai-cont .main-img {
		position: absolute;
		z-index: 1000;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		line-height: 0;
		width: 190rpx;
		height: 190rpx;
		text-align: center;
		background: rgba(0, 0, 0, .8);
		vertical-align: middle;
		opacity: .6;
		border-radius: 10rpx;
	}

	.bai-cont .main-img image {
		width: 100rpx;
		height: 100rpx;
		margin-top: 45rpx;
	}

	.none-cont {
		color: #666;
		text-align: center;
		padding-top: 80rpx;
		box-sizing: border-box;
	}

	.none-cont .main image {
		width: 200rpx;
		height: 200rpx
	}

	@import "../../template/shopLists/shopLists.css";
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwVGVtN3VGJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYyxpQkFBaUIsRUFBRSxrQkFBa0IsQ0FBQztBQUNwRCw0QkFBNEIsV0FBVyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUN2RyxXQUFXLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDO0FBQ3BELHNCQUFzQixXQUFXLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQ2pHLHFCQUFxQixrQkFBa0IsRUFBRSxVQUFVLENBQUM7QUFDcEQsUUFBUSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxDQUFDO0FBQ3ZELFNBQVMsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDO0FBQzFFLFFBQVEsV0FBVyxFQUFFLGtCQUFrQixFQUFFLFVBQVUsQ0FBQztBQUNwRCxrQkFBa0IsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsY0FBYyxDQUFDO0FBQzFFLDRCQUE0QixxQkFBcUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixDQUFDO0FBQzVILDRCQUE0QixxQkFBcUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLHNCQUFzQixFQUFFLGtCQUFrQixDQUFDO0FBQzNILHVCQUF1QixxQkFBcUIsRUFBRSw2QkFBNkIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCLEVBQUUsZUFBZSxDQUFDLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDO0FBQ2xNLGtCQUFrQixnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxzQkFBc0IsQ0FBQztBQUMvRSxpQkFBaUIsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsZ0NBQWdDLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsbUJBQW1CLENBQUM7QUFDOU0sOEJBQThCLHFCQUFxQixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLENBQUM7QUFDOUgsd0JBQXdCLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDO0FBQzdELHNCQUFzQixrQkFBa0IsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLGlDQUFpQyxFQUFFLG1CQUFtQixDQUFDO0FBQ3JKLGtDQUFrQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLENBQUM7QUFDdkksMkJBQTJCLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLENBQUM7QUFDN0ksNEJBQTRCLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO0FBQzdHLDhCQUE4QixxQkFBcUIsQ0FBQztBQUNwRCxXQUFXLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLENBQUM7QUFDakosdUJBQXVCLFlBQVksRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsQ0FBQztBQUM1SCxpQkFBaUIsV0FBVyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7QUFDM0UsaUJBQWlCLGNBQWMsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUN4QjdELGtCQUFBLENBQUEsaURBQUEsQ0FBQSw0Q0FBQSxDQUFBLGNBQUEsQ0R3QitELE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQztBQUN6RixvQkFBb0Isa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxzQkFBc0IsQ0FBQyxpQ0FBaUM7QUFDdEssdUJBQXVCLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsRUFBRSw4QkFBOEIsQ0FBQztBQUM3RywwQkFBMEIscUJBQXFCLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUNwSCxtQkFBbUIsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixDQUFDO0FBQ3hFLDBCQUEwQixVQUFVLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQztBQUNyRSxnQ0FBZ0MsVUFBVSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUM7QUFDOUYsaUJBQWlCLGtCQUFrQixFQUFFLGNBQWMsQ0FBQztBQUNwRCxnQ0FBZ0MsV0FBVyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUMzRyx3QkFBd0IsVUFBVSxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxDQUFDO0FBQ3RILG9CQUFvQixjQUFjLENBQUMsZ0JBQWdCLENBQUM7QUFDcEQsNEJBQTRCLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUM7QUFDNUYsdUJBQXVCLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDO0FBQ3ZHLDZCQUE2QixZQUFZLENBQUMsY0FBYyxDQUFDO0FBQ3pELDRCQUE0QixnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDO0FBQ3pKLFVBQVUsZ0JBQWdCLENBQUM7QUFDM0IsZ0JBQWdCLGFBQWEsRUFBRSxhQUFhLENBQUM7QUFDN0MsZUFBZSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsNEJBQTRCLEVBQUUsaUJBQWlCLENBQUM7QUFDN0YsZ0JBQWdCLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7QUFDNUQscUJBQXFCLHFCQUFxQixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUM7QUFDM0YseUJBQXlCLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQztBQUM5RSx5QkFBeUIsV0FBVyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQ3hGLHFCQUFxQixrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxpQ0FBaUM7QUFDN0csdUJBQXVCLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQztBQUMxRCwwQkFBMEIscUJBQXFCLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQztBQUMzSSxvQkFBb0IsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDdEQsdUJBQXVCLGdCQUFnQixDQUFDO0FBQ3hDLDBCQUEwQixXQUFXLEVBQUUsc0JBQXNCLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLENBQUM7QUFDM0gsb0JBQW9CLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO0FBQ3RELDBCQUEwQixVQUFVLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0FBQ3BGLG9CQUFvQixnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN0RCwwQkFBMEIsV0FBVyxFQUFFLHNCQUFzQixFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixDQUFDO0FBQzNILHFDQUFxQyxnQkFBZ0IsQ0FBQztBQUN0RCxzQ0FBc0MsMkJBQTJCLENBQUM7QUFDbEUsb0JBQW9CLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO0FBQ3RELHVCQUF1QixnQkFBZ0IsQ0FBQztBQUN4QywwQkFBMEIsV0FBVyxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLENBQUM7QUFDOUgsb0JBQW9CLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO0FBQ3RELHVCQUF1QixnQkFBZ0IsQ0FBQztBQUN4QywwQkFBMEIsV0FBVyxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLENBQUM7QUFDOUgsc0NBQXNDLHVCQUF1QixDQUFDO0FBQzlELDhFQUE4RSxzQkFBc0IsQ0FBQztBQUNyRyxvQkFBb0IsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDdEQsdUJBQXVCLGdCQUFnQixDQUFDO0FBQ3hDLDBCQUEwQixXQUFXLEVBQUUsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQztBQUM5SCw0SkFBNEosc0JBQXNCLENBQUM7QUFDbkwsaUJBQWlCLGdCQUFnQixDQUFDO0FBQ2xDLHVCQUF1QixXQUFXLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGNBQWMsQ0FBQztBQUMxRyw0QkFBNEIsYUFBYSxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUNuSCwyQkFBMkIsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixDQUFDO0FBQzdFLGlCQUFpQixnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUNwRCxvQkFBb0Isa0JBQWtCLEVBQUUsY0FBYyxDQUFDO0FBQ3ZELHVCQUF1QixXQUFXLEVBQUUsdUJBQXVCLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxDQUFDO0FBQ2pHLDRCQUE0QixXQUFXLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixDQUFDO0FBQzFFLGlDQUFpQyxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUN4Riw2QkFBNkIsWUFBWSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLENBQUM7QUFDcEksNEJBQTRCLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQztBQUN2SCxXQUFXLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixDQUFDO0FBQzVGLGlCQUFpQixhQUFhLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQztBQUN6RixvQkFBb0IsV0FBVyxDQUFDO0FBQ2hDLDJCQUEyQixxQkFBcUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDO0FBQ2pHLDZCQUE2QixxQkFBcUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDO0FBQ2xHLGFBQWEsNkJBQTZCLENBQUM7QUFDM0MsZUFBZSxXQUFXLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLGlDQUFpQyxDQUFDOztBQUVsSCxpQkFBaUIsY0FBYyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQ3pGaEUsa0JBQUEsQ0FBQSxpREFBQSxDQUFBLDRDQUFBLENBQUEsY0FBQSxDRHlGa0UsT0FBTyxFQUFFLDZCQUE2QixDQUFDO0FBQ3pHLG9CQUFvQixjQUFjLENBQUM7QUFDbkMsNEJBQTRCLGlCQUFpQixFQUFFLFdBQVcsQ0FBQztBQUMzRCw4QkFBOEIsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLCtCQUErQixDQUFDO0FBQzFKLGlDQUFpQyx3QkFBd0IsQ0FBQztBQUMxRCwyQkFBMkIsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixDQUFDO0FBQ3ZILGlDQUFpQyxtQkFBbUIsRUFBRSxVQUFVLEdBQUcsY0FBYyxDQUFDLGlDQUFpQyxFQUFFLE9BQU8sRUFBRSxrQ0FBa0MsQ0FBQztBQUNqSyxtQ0FBbUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxpQ0FBaUMsRUFBRSxPQUFPLEVBQUUsa0NBQWtDLENBQUM7QUFDOUksaUNBQWlDLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQztBQUNySiw0Q0FBNEMsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQztBQUNoSyxvQ0FBb0MsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDO0FBQ3hGLHNEQUFzRCxjQUFjLENBQUM7QUFDckUsdUJBQXVCLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxpQ0FBaUMsRUFBRSxrQkFBa0IsRUFBRSxrQ0FBa0MsQ0FBQztBQUNuSiw2QkFBNkIsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDO0FBQ2pKLHdDQUF3QyxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDO0FBQzVKLGdDQUFnQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUM7QUFDcEYsMkNBQTJDLGNBQWMsQ0FBQztBQUMxRCx1QkFBdUIsZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLGlDQUFpQyxFQUFFLGtCQUFrQixDQUFDO0FBQy9HLHlCQUF5QixnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztBQUM3RCxnQ0FBZ0MsY0FBYyxDQUFDLGlDQUFpQyxFQUFFLGtCQUFrQixFQUFFLGtDQUFrQyxDQUFDO0FBQ3pJLDhCQUE4QixjQUFjLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO0FBQ2hHLDRCQUE0QixnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjO0FBQzlFLCtCQUErQixXQUFXLEVBQUUsMkJBQTJCLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxjQUFjLENBQUM7QUFDMU8sa0NBQWtDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztBQUNyRSxrQ0FBa0MsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUN2SSx1Q0FBdUMsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsMkJBQTJCLENBQUM7QUFDOUksd0NBQXdDLDhCQUE4QixFQUFFLG1CQUFtQixFQUFFLFdBQVcsQ0FBQzs7QUFFekcsZUFBZTtBQUNmLFNBQVMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxzQ0FBc0M7QUFDdkksY0FBYyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQztBQUNqRCxnQkFBZ0IsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNoRixlQUFlLGFBQWEsQ0FBQyxhQUFhLENBQUM7O0FBRTNDLFVBQVUsa0JBQWtCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsK0JBQStCLENBQUMsdUNBQXVDLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMseUJBQXlCLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDO0FBQzNQLGdCQUFnQixZQUFZLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDOztBQUU5RCxVQUFVLFdBQVcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0M5SHpFLGtCQUFBLGlEQUFBLDRDQUFBLGNBQUEsQUQ4SDBFLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztBQUNsSCxvQkFBb0Isa0JBQWtCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsK0JBQStCLENBQUMsdUNBQXVDLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMseUJBQXlCLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO0FBQzFSLDBCQUEwQixZQUFZLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDOztBQUV4RSxXQUFXLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQztBQUNqRix1QkFBdUIsWUFBWSxDQUFDLGFBQWE7QUFDakQ7MENBQzBDOztBQUUxQyxpQkFBaUIsZUFBZSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVDdklqRCxrQkFBQSxDQUFBLGlEQUFBLENBQUEsNENBQUEsQ0FBQSxjQUFBLENEdUltRCxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSwyQkFBMkIsQ0FBQztBQUN4SCxpQkFBaUIsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsK0JBQStCLENBQUM7QUFDdEcsdUJBQXVCLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLGdCQUFnQixDQUFDO0FBQ3BGLHNCQUFzQixnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsd0JBQXdCLEVBQUUsb0JBQW9CLEVBQUUsOEJBQThCLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQztBQUMvTyxvQkFBb0IsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLGlDQUFpQyxFQUFFLGNBQWMsRUFBRSx5QkFBeUIsQ0FBQztBQUNwSSx1QkFBdUIsY0FBYyxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixDQUFDLGVBQWUsQ0FBQztBQUNoRywyQkFBMkIsV0FBVyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsQ0FBQztBQUN6RSw0QkFBNEIsV0FBVyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQzNGLCtCQUErQixhQUFhLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7QUFDdkssOEJBQThCLGdCQUFnQixDQUFDO0FBQy9DLGdDQUFnQyxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQztBQUM5RixvQ0FBb0MsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQztBQUN6RyxrQ0FBa0MsY0FBYyxDQUFDO0FBQ2pELGlDQUFpQyxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQUM7QUFDbkYsd0JBQXdCLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsNEJBQTRCLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQzs7QUFFcEksZ0RBQWdEIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5iYW5uZXJCZ19ib3h7cGFkZGluZzogMC4xcnB4IDA7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5iYW5uZXJCZ19ib3ggLmJhbm5lckJnX3BpY3t3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDA7IGxlZnQ6IDA7IHRvcDogMDt9XHJcbi50b3BCZ19ib3h7cG9zaXRpb246IHJlbGF0aXZlOyBwYWRkaW5nLWJvdHRvbTogMXJweDt9XHJcbi50b3BCZ19ib3ggLnRvcEJnX3BpY3t3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBwb3NpdGlvbjogYWJzb2x1dGU7IHotaW5kZXg6IDA7IGxlZnQ6IDA7IHRvcDogMDt9XHJcbi50b3BCZ19ib3ggLnRvcEJnX25ye3Bvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTt9XHJcbi5ncmV5X2h7aGVpZ2h0OiAyMHJweDsgYmFja2dyb3VuZDojZjdmN2Y3OyB3aWR0aDogMTAwJTt9XHJcbi5pbmRleEJne3Bvc2l0aW9uOiBhYnNvbHV0ZTsgei1pbmRleDogMDsgbGVmdDogMDsgdG9wOi00MHJweDsgd2lkdGg6IDEwMCU7fVxyXG4uV01ob21le3dpZHRoOiAxMDAlOyBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDE7fVxyXG4uV01ob21lIC5sb2NhdGlvbntmb250LXNpemU6IDM2cnB4OyBwYWRkaW5nOiA0cnB4IDIwcnB4IDA7IG1heC13aWR0aDogNDYlO31cclxuLldNaG9tZSAubG9jYXRpb24gLmFkZHJfaWNve2Rpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDI4cnB4OyBoZWlnaHQ6IDM2cnB4OyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBtYXJnaW4tcmlnaHQ6IDEycnB4O31cclxuLldNaG9tZSAubG9jYXRpb24gLmRvd25faWNve2Rpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDIwcnB4OyBoZWlnaHQ6IDE2cnB4OyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBtYXJnaW4tbGVmdDogMTJycHg7fVxyXG4uV01ob21lIC5sb2NhdGlvbiB0ZXh0e2Rpc3BsYXk6IGlubGluZS1ibG9jazsgbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSA3MnJweCk7IGhlaWdodDogNDBycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgdmVydGljYWwtYWxpZ246IG1pZGRsZTsgb3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO31cclxuLldNaG9tZSAudG9wU3RhdGV7b3ZlcmZsb3c6IGhpZGRlbjsgcGFkZGluZy10b3A6IDE2cnB4OyBib3gtc2l6aW5nOiBib3JkZXItYm94O31cclxuLldNaG9tZSAud2VhdGhlcntvdmVyZmxvdzogaGlkZGVuOyBmb250LXNpemU6IDQwcnB4OyBsaW5lLWhlaWdodDogNDhycHg7IGNvbG9yOiAjNjY2OyBmbG9hdDogcmlnaHQ7IGhlaWdodDo0OHJweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsMC44KTttYXJnaW4tcmlnaHQ6MjBycHg7Ym9yZGVyLXJhZGl1czogMzRycHg7cGFkZGluZzoxMHJweCAzMHJweDt9XHJcbi5XTWhvbWUgLndlYXRoZXIgLmljb193ZWF0aGVye2Rpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDQ4cnB4OyBoZWlnaHQ6IDQ4cnB4OyB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tOyBtYXJnaW4tcmlnaHQ6IDEycnB4O31cclxuLldNaG9tZSAud2VhdGhlciAuc21hbGx7Zm9udC1zaXplOiAxOHJweDsgbGluZS1oZWlnaHQ6IDI0cnB4O31cclxuLldNaG9tZSAucmlnaHRfc2VhcmNoe3RleHQtYWxpZ246IGNlbnRlcjsgd2lkdGg6IDE4MHJweDsgaGVpZ2h0OiA2MHJweDsgYm9yZGVyLXJhZGl1czogNjBycHg7IGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC44KTsgbWFyZ2luLXJpZ2h0OiAyMHJweDt9XHJcbi5XTWhvbWUgLnJpZ2h0X3NlYXJjaCAuaWNvX3NlYXJjaHt3aWR0aDogMjJycHg7IGhlaWdodDogMjJycHg7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMjRycHg7IHRvcDogNTAlOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLC01MCUpO31cclxuLldNaG9tZSAucmlnaHRfc2VhcmNoIC5pbnB7Ym94LXNpemluZzogYm9yZGVyLWJveDsgd2lkdGg6IDEwMCU7IGhlaWdodDogNjBycHg7IGJvcmRlci1yYWRpdXM6IDYwcnB4OyBwYWRkaW5nLWxlZnQ6IDY2cnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uV01ob21lIC5yaWdodF9zZWFyY2ggaW5wdXR7Ym94LXNpemluZzogYm9yZGVyLWJveDsgd2lkdGg6IDEwMCU7IGhlaWdodDogNjBycHg7Zm9udC1zaXplOiAyOHJweDsgY29sb3I6ICM5OTk7fVxyXG4uV01ob21lIC50b3BCZ19ib3ggLnNlYXJjaEJveHttYXJnaW46IDEycnB4IDIwcnB4IDA7fVxyXG4uc2VhcmNoQm94e21hcmdpbjogMjBycHg7Ym94LXNpemluZzogYm9yZGVyLWJveDsgaGVpZ2h0OiA2NHJweDsgYm9yZGVyLXJhZGl1czogOHJweDtiYWNrZ3JvdW5kOiAjRURFREVEOyBwYWRkaW5nLWxlZnQ6IDY2cnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uc2VhcmNoQm94IC5pY29fc2VhcmNoe3dpZHRoOiAyMnJweDsgaGVpZ2h0OiAyMnJweDsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAyNHJweDsgdG9wOiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTUwJSk7fVxyXG4uc2VhcmNoQm94IGlucHV0e3dpZHRoOiAxMDAlOyBoZWlnaHQ6IDY0cnB4OyBmb250LXNpemU6IDI4cnB4OyBjb2xvcjogIzk5OTt9XHJcbi5zZWFyY2hCb3hfZml4ZWR7cG9zaXRpb246Zml4ZWQ7IHotaW5kZXg6IDIwOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OjA7IGJhY2tncm91bmQ6ICNmZmY7fVxyXG4uV01ob21lIC5zZWFyY2hXb3Jke3BhZGRpbmc6IDAgMCAxMHJweDsgbWFyZ2luOiAwIDIwcnB4OyBvdmVyZmxvdy14OiBhdXRvOyBvdmVyZmxvdy15OiBoaWRkZW47IGhlaWdodDogNjJycHg7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNofVxyXG4uV01ob21lIC5zZWFyY2hXb3JkIHVse2Rpc3BsYXk6IGZsZXg7ZmxleC1kaXJlY3Rpb246IHJvdzthbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47fVxyXG4uV01ob21lIC5zZWFyY2hXb3JkIHVsIGxpe2Rpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOjMwcnB4OyBjb2xvcjogIzY2NjsgbGluZS1oZWlnaHQ6IDQwcnB4OyBwYWRkaW5nOiAwIDEwcnB4O31cclxuLldNaG9tZSAuaWR4QmFubmVye3Bvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTsgcGFkZGluZzogMHJweCAgMjRycHg7fVxyXG4uV01ob21lIC5pZHhCYW5uZXIgc3dpcGVye3dpZHRoOjEwMCU7IGhlaWdodDogMjcycnB4OyBkaXNwbGF5OiBibG9jazt9XHJcbi5XTWhvbWUgLmlkeEJhbm5lciBzd2lwZXIgaW1hZ2V7d2lkdGg6MTAwJTsgaGVpZ2h0OiAxMDAlOyBkaXNwbGF5OiBibG9jazsgYm9yZGVyLXJhZGl1czogNHJweDt9XHJcbi5XTWhvbWUgLmNhdGVOYXZ7cG9zaXRpb246IHJlbGF0aXZlOyBoZWlnaHQ6IDQxMHJweDt9XHJcbi5XTWhvbWUgLmNhdGVOYXYgLmNhdGVOYXZCZ19waWN7d2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgcG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiAwOyBsZWZ0OiAwOyB0b3A6IDA7fVxyXG4uV01ob21lIC5jYXRlTmF2IHN3aXBlcnt3aWR0aDoxMDAlOyBoZWlnaHQ6IDM4MHJweDsgZGlzcGxheTogYmxvY2s7cGFkZGluZzogMjBycHggMCAwOyBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDE7fVxyXG4uV01ob21lIC5jYXRlTmF2IHVse2Rpc3BsYXk6IGJsb2NrO292ZXJmbG93OiBoaWRkZW47fVxyXG4uV01ob21lIC5jYXRlTmF2LmNvbDUgdWwgbGl7dGV4dC1hbGlnbjogY2VudGVyO21hcmdpbi1ib3R0b206IDIwcnB4OyBmbG9hdDogbGVmdDsgd2lkdGg6MjAlO31cclxuLldNaG9tZSAuY2F0ZU5hdiB1bCBsaXt0ZXh0LWFsaWduOiBjZW50ZXI7bWFyZ2luLWJvdHRvbTogMjBycHg7IGZsb2F0OiBsZWZ0OyB3aWR0aDoyNSU7IGRpc3BsYXk6IGJsb2NrO31cclxuLldNaG9tZSAuY2F0ZU5hdiB1bCBsaSBpbWFnZXt3aWR0aDoxMDBycHg7aGVpZ2h0OiAxMDBycHg7fVxyXG4uV01ob21lIC5jYXRlTmF2IHVsIGxpIC50eHR7Zm9udC1zaXplOiAyNHJweDtsaW5lLWhlaWdodDogNDBycHg7Y29sb3I6ICMzMzM7bWFyZ2luLXRvcDogMTJycHg7IG92ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO3doaXRlLXNwYWNlOm5vd3JhcDt9XHJcbi5pZHhUaXRsZXtvdmVyZmxvdzogaGlkZGVuO31cclxuLmlkeFRpdGxlIGltYWdle3dpZHRoOiA3NTBycHg7IGhlaWdodDogODBycHg7fVxyXG4uaWR4VGl0bGUgLnRpdHtmb250LXNpemU6IDM2cnB4OyBmbG9hdDpsZWZ0OyBwYWRkaW5nOiAyMHJweCAwIDIwcnB4IDIwcnB4OyBmb250LXdlaWdodDogYm9sZDt9XHJcbi5pZHhUaXRsZSAubW9yZXtmbG9hdDogcmlnaHQ7IGZvbnQtc2l6ZTogMjhycHg7IGNvbG9yOiAjNjY2O31cclxuLmlkeFRpdGxlIC5yaWdodF9pY297ZGlzcGxheTogaW5saW5lLWJsb2NrOyB3aWR0aDogMTJycHg7IGhlaWdodDogMjBycHg7IG1hcmdpbi1sZWZ0OiA4cnB4O31cclxuLnByZWZlcmVudGlhbEFhcmVhIHVsIGxpe3Bvc2l0aW9uOiByZWxhdGl2ZTsgb3ZlcmZsb3c6IGhpZGRlbjsgZGlzcGxheTogYmxvY2s7fVxyXG4ucHJlZmVyZW50aWFsQWFyZWEgaW1hZ2V7d2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7fVxyXG4ucHJlZmVyZW50aWFsQWFyZWExeyBvdmVyZmxvdy15OiBoaWRkZW47IG92ZXJmbG93LXg6IGF1dG87IHBhZGRpbmc6IDAgMjBycHg7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNofVxyXG4ucHJlZmVyZW50aWFsQWFyZWExIHVse2Rpc3BsYXk6IGJsb2NrOyB3aGl0ZS1zcGFjZTpub3dyYXA7fVxyXG4ucHJlZmVyZW50aWFsQWFyZWExIHVsIGxpe2Rpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDI0MHJweDsgaGVpZ2h0OiAzMjBycHg7IGJvcmRlci1yYWRpdXM6IDhycHg7IG92ZXJmbG93OiBoaWRkZW47IG1hcmdpbi1yaWdodDogMjBycHg7fVxyXG4ucHJlZmVyZW50aWFsQWFyZWEye292ZXJmbG93OiBoaWRkZW47cGFkZGluZzogMCAxNnJweDt9XHJcbi5wcmVmZXJlbnRpYWxBYXJlYTIgdWx7b3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5wcmVmZXJlbnRpYWxBYXJlYTIgdWwgbGl7ZmxvYXQ6IGxlZnQ7IHdpZHRoOmNhbGMoNTAlIC0gOHJweCk7IG1hcmdpbjogMCA0cnB4OyBoZWlnaHQ6IDA7IHBhZGRpbmc6IDE2JSAwOyBvdmVyZmxvdzogaGlkZGVuO31cclxuLnByZWZlcmVudGlhbEFhcmVhM3tvdmVyZmxvdzogaGlkZGVuO3BhZGRpbmc6IDAgMjBycHg7fVxyXG4ucHJlZmVyZW50aWFsQWFyZWEzIHVsIGxpe3dpZHRoOjEwMCU7IGhlaWdodDogMDsgcGFkZGluZzogMTIuNSUgMDsgb3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5wcmVmZXJlbnRpYWxBYXJlYTR7b3ZlcmZsb3c6IGhpZGRlbjtwYWRkaW5nOiAwIDE2cnB4O31cclxuLnByZWZlcmVudGlhbEFhcmVhNCB1bCBsaXtmbG9hdDogbGVmdDsgd2lkdGg6Y2FsYyg1MCUgLSA4cnB4KTsgbWFyZ2luOiAwIDRycHg7IGhlaWdodDogMDsgcGFkZGluZzogMTYlIDA7IG92ZXJmbG93OiBoaWRkZW47fVxyXG4ucHJlZmVyZW50aWFsQWFyZWE0IHVsIGxpOmxhc3QtY2hpbGR7bWFyZ2luLXRvcDogOHJweDt9XHJcbi5wcmVmZXJlbnRpYWxBYXJlYTQgdWwgbGk6Zmlyc3QtY2hpbGR7cGFkZGluZzogY2FsYygzMiUgKyA0cnB4KSAwO31cclxuLnByZWZlcmVudGlhbEFhcmVhNXtvdmVyZmxvdzogaGlkZGVuO3BhZGRpbmc6IDAgMTZycHg7fVxyXG4ucHJlZmVyZW50aWFsQWFyZWE1IHVse292ZXJmbG93OiBoaWRkZW47fVxyXG4ucHJlZmVyZW50aWFsQWFyZWE1IHVsIGxpe2Zsb2F0OiBsZWZ0OyB3aWR0aDpjYWxjKDUwJSAtIDhycHgpOyBtYXJnaW46IDRycHggNHJweDsgaGVpZ2h0OiAwOyBwYWRkaW5nOiAxNiUgMDsgb3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5wcmVmZXJlbnRpYWxBYXJlYTZ7b3ZlcmZsb3c6IGhpZGRlbjtwYWRkaW5nOiAwIDE2cnB4O31cclxuLnByZWZlcmVudGlhbEFhcmVhNiB1bHtvdmVyZmxvdzogaGlkZGVuO31cclxuLnByZWZlcmVudGlhbEFhcmVhNiB1bCBsaXtmbG9hdDogbGVmdDsgd2lkdGg6Y2FsYyg1MCUgLSA4cnB4KTsgbWFyZ2luOiA0cnB4IDRycHg7IGhlaWdodDogMDsgcGFkZGluZzogMTYlIDA7IG92ZXJmbG93OiBoaWRkZW47fVxyXG4ucHJlZmVyZW50aWFsQWFyZWE2IHVsIGxpOmZpcnN0LWNoaWxke3dpZHRoOmNhbGMoMTAwJSAtIDhycHgpO31cclxuLnByZWZlcmVudGlhbEFhcmVhNiB1bCBsaTpudGgtY2hpbGQoMyksLnByZWZlcmVudGlhbEFhcmVhNiB1bCBsaTpudGgtY2hpbGQoNCl7d2lkdGg6Y2FsYygyNSUgLSA4cnB4KTt9XHJcbi5wcmVmZXJlbnRpYWxBYXJlYTd7b3ZlcmZsb3c6IGhpZGRlbjtwYWRkaW5nOiAwIDE2cnB4O31cclxuLnByZWZlcmVudGlhbEFhcmVhNyB1bHtvdmVyZmxvdzogaGlkZGVuO31cclxuLnByZWZlcmVudGlhbEFhcmVhNyB1bCBsaXtmbG9hdDogbGVmdDsgd2lkdGg6Y2FsYyg1MCUgLSA4cnB4KTsgbWFyZ2luOiA0cnB4IDRycHg7IGhlaWdodDogMDsgcGFkZGluZzogMTYlIDA7IG92ZXJmbG93OiBoaWRkZW47fVxyXG4ucHJlZmVyZW50aWFsQWFyZWE3IHVsIGxpOm50aC1jaGlsZCgzKSwucHJlZmVyZW50aWFsQWFyZWE3IHVsIGxpOm50aC1jaGlsZCg0KSwucHJlZmVyZW50aWFsQWFyZWE3IHVsIGxpOm50aC1jaGlsZCg1KSwucHJlZmVyZW50aWFsQWFyZWE3IHVsIGxpOm50aC1jaGlsZCg2KXt3aWR0aDpjYWxjKDI1JSAtIDhycHgpO31cclxuLmxhcmdlU2VsZWN0aW9uMXtvdmVyZmxvdzogaGlkZGVuO31cclxuLmxhcmdlU2VsZWN0aW9uMSB1bCBsaXtmbG9hdDogbGVmdDsgd2lkdGg6IDMzLjMzJTsgdGV4dC1hbGlnbjogY2VudGVyOyBwYWRkaW5nOiAwIDAgMjBycHg7IGRpc3BsYXk6IGJsb2NrO31cclxuLmxhcmdlU2VsZWN0aW9uMSB1bCBsaSAucGlje3dpZHRoOiAxMzZycHg7IGhlaWdodDogMTM2cnB4OyBib3JkZXItcmFkaXVzOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBtYXJnaW46OHJweCBhdXRvO31cclxuLmxhcmdlU2VsZWN0aW9uMSB1bCBsaSAuaDN7Zm9udC1zaXplOiAzMHJweDsgY29sb3I6ICMzMzM7IGxpbmUtaGVpZ2h0OiA0MHJweDt9XHJcbi5sYXJnZVNlbGVjdGlvbjJ7b3ZlcmZsb3c6IGhpZGRlbjsgcGFkZGluZzogMCAxMHJweDt9XHJcbi5sYXJnZVNlbGVjdGlvbjIgdWx7bWFyZ2luLXRvcDogLTEwcnB4OyBkaXNwbGF5OiBibG9jazt9XHJcbi5sYXJnZVNlbGVjdGlvbjIgdWwgbGl7ZmxvYXQ6IGxlZnQ7IHdpZHRoOmNhbGMoNTAlIC0gMjBycHgpOyBtYXJnaW46IDEwcnB4IDEwcnB4OyBkaXNwbGF5OiBibG9jazt9XHJcbi5sYXJnZVNlbGVjdGlvbjIgdWwgbGkgLnBpY3t3aWR0aDogMTAwJTsgaGVpZ2h0OiAyMjBycHg7IG92ZXJmbG93OiBoaWRkZW47fVxyXG4ubGFyZ2VTZWxlY3Rpb24yIHVsIGxpIC5sb2dvX2JveHtvdmVyZmxvdzogaGlkZGVuOyBtYXJnaW4tdG9wOiAtNDRycHg7IHBhZGRpbmc6IDAgMjBycHg7fVxyXG4ubGFyZ2VTZWxlY3Rpb24yIHVsIGxpIC5sb2dve3dpZHRoOiA4OHJweDsgaGVpZ2h0OiA4OHJweDsgYm9yZGVyLXJhZGl1czogNHJweDsgYmFja2dyb3VuZC1jb2xvcjogI2VlZTsgb3ZlcmZsb3c6IGhpZGRlbjsgZmxvYXQ6bGVmdDt9XHJcbi5sYXJnZVNlbGVjdGlvbjIgdWwgbGkgLnRpdHtmb250LXNpemU6IDMwcnB4OyBjb2xvcjogIzMzMzsgbGluZS1oZWlnaHQ6IDQwcnB4OyBwYWRkaW5nLXRvcDogNDRycHg7IG1hcmdpbi1sZWZ0OiAxMDBycHg7fVxyXG4uc2NyZWVuVGFie2JhY2tncm91bmQ6ICNmZmY7IGhlaWdodDogODhycHg7IHdpZHRoOiAxMDAlOyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyO31cclxuLnNjcmVlblRhYiAubGlzdHt3aWR0aDogMzMuMzMlOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMzBycHg7Y29sb3I6ICMzMzM7IGZsZXg6MTt9XHJcbi5zY3JlZW5UYWIgLmxpc3Qub257Y29sb3I6ICMwMDA7fVxyXG4uc2NyZWVuVGFiIC5saXN0IC5kd29uX2ljb3tkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHdpZHRoOiAyNHJweDsgaGVpZ2h0OiAyNHJweDsgbWFyZ2luLWxlZnQ6IDRycHg7fVxyXG4uc2NyZWVuVGFiIC5saXN0IC5zY3JlZW5faWNve2Rpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDI0cnB4OyBoZWlnaHQ6IDI0cnB4OyBtYXJnaW4tbGVmdDo0cnB4O31cclxuLnNob3BMaXN0c19oe21pbi1oZWlnaHQ6IGNhbGMoMTAwJSAtIDBycHgpO31cclxuLldNaG9tZV9zY3JvbGx7d2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgb3ZlcmZsb3cteTogYXV0bzsgb3ZlcmZsb3cteDogaGlkZGVuOyAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7fVxyXG5cclxuLnNjcmVlblRhYl9maXhlZHtwb3NpdGlvbjpmaXhlZDsgei1pbmRleDogMTk7IGxlZnQ6IDA7IHRvcDogMHJweDsgcmlnaHQ6MDsgYm9yZGVyLWJvdHRvbToycnB4IHNvbGlkICNlZWU7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIHVse2Rpc3BsYXk6IGJsb2NrO31cclxuLnNjcmVlblRhYl9maXhlZCAuc2NyZWVuVGFie3Bvc2l0aW9uOnJlbGF0aXZlOyB6LWluZGV4OiAxOTt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLmNoYW5nZV9saXN0e3Bvc2l0aW9uOmFic29sdXRlOyB6LWluZGV4OiAxODsgbGVmdDogMDsgdG9wOiA4OHJweDsgcmlnaHQ6MDsgdHJhbnNmb3JtOnRyYW5zbGF0ZSgwLC0xMDAlKTsgdHJhbnNpdGlvbjphbGwgMC4ycyBlYXNlLWluLW91dDt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLmNoYW5nZV9saXN0Lm9ue3RyYW5zZm9ybTp0cmFuc2xhdGUoMCwwKTt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLmFsbENhdGVze2JhY2tncm91bmQ6ICNmZmY7IG92ZXJmbG93OiBoaWRkZW47IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBzdHJldGNoOyBtYXgtaGVpZ2h0OiA3NjBycHg7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIC5hbGxDYXRlcyAubGVmdHtiYWNrZ3JvdW5kOiAjZjhmOGY4OyB3aWR0aDogNTAlOyAgb3ZlcmZsb3c6IGF1dG87LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoOyBmbGV4OiAxOyAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZyA6IHRvdWNoO31cclxuLnNjcmVlblRhYl9maXhlZCAuYWxsQ2F0ZXMgLnJpZ2h0eyB3aWR0aDogNTAlOyAgb3ZlcmZsb3c6IGF1dG87LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoOyBmbGV4OiAxOyAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZyA6IHRvdWNoO31cclxuLnNjcmVlblRhYl9maXhlZCAuYWxsQ2F0ZXMgdWwgbGl7Zm9udC1zaXplOiAxNHB4OyBsaW5lLWhlaWdodDogOTZycHg7IGhlaWdodDogOTZycHg7IHBhZGRpbmc6IDAgMjhycHg7IGNvbG9yOiAjMzMzOyBvdmVyZmxvdzogaGlkZGVuOyBkaXNwbGF5OiBibG9jazt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLmFsbENhdGVzIHVsIGxpIC5pY29fY2hlY2t7cG9zaXRpb246IGFic29sdXRlOyByaWdodDoyOHJweDsgdG9wOiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTUwJSk7IHdpZHRoOiAyNHJweDsgaGVpZ2h0OiAyNHJweDsgZGlzcGxheTogbm9uZTt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLmFsbENhdGVzIHVsIGxpLm9ue2NvbG9yOiAjMjBBRDIwOyBiYWNrZ3JvdW5kOiAjZmZmOyBwb3NpdGlvbjpyZWxhdGl2ZTt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLmFsbENhdGVzIC5yaWdodCB1bCBsaS5vbiAuaWNvX2NoZWNre2Rpc3BsYXk6IGJsb2NrO31cclxuLnNjcmVlblRhYl9maXhlZCAucGFpc3tiYWNrZ3JvdW5kOiAjZmZmOyAgb3ZlcmZsb3c6IGF1dG87LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoOyBtYXgtaGVpZ2h0OiA3NjBycHg7IC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nIDogdG91Y2g7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIC5wYWlzIHVsIGxpe2ZvbnQtc2l6ZTogMTRweDsgbGluZS1oZWlnaHQ6IDk2cnB4OyBoZWlnaHQ6IDk2cnB4OyBwYWRkaW5nOiAwIDI4cnB4OyBjb2xvcjogIzMzMzsgb3ZlcmZsb3c6IGhpZGRlbjsgZGlzcGxheTogYmxvY2s7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIC5wYWlzIHVsIGxpIC5pY29fY2hlY2t7cG9zaXRpb246IGFic29sdXRlOyByaWdodDoyOHJweDsgdG9wOiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTUwJSk7IHdpZHRoOiAyNHJweDsgaGVpZ2h0OiAyNHJweDsgZGlzcGxheTogbm9uZTt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLnBhaXMgdWwgbGkub257Y29sb3I6ICMyMEFEMjA7IGJhY2tncm91bmQ6ICNmZmY7IHBvc2l0aW9uOnJlbGF0aXZlO31cclxuLnNjcmVlblRhYl9maXhlZCAucGFpcyB1bCBsaS5vbiAuaWNvX2NoZWNre2Rpc3BsYXk6IGJsb2NrO31cclxuLnNjcmVlblRhYl9maXhlZCAucGFpc3tiYWNrZ3JvdW5kOiAjZmZmOyAgb3ZlcmZsb3c6IGF1dG87LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoOyBtYXgtaGVpZ2h0OiA3NjBycHg7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIC5zY3JlZW57YmFja2dyb3VuZDogI2ZmZjtwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIC5zY3JlZW4gLmNvbnR7IG92ZXJmbG93OiBhdXRvOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDsgbWF4LWhlaWdodDogNzYwcnB4OyAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZyA6IHRvdWNoO31cclxuLnNjcmVlblRhYl9maXhlZCAuc2NyZWVuIC50aXR7cGFkZGluZzogMjBycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgZm9udC1zaXplOiAyOHJweDsgY29sb3I6ICM5OTk7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIC5zY3JlZW4gdWx7b3ZlcmZsb3c6IGhpZGRlbjsgcGFkZGluZzogMCAxMnJweDsgZGlzcGxheTogYmxvY2t9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLnNjcmVlbiB1bCBsaXtmbG9hdDogbGVmdDsgd2lkdGg6IGNhbGMoMzMuMzMlIC0gMTZycHgpOyBtYXJnaW46IDhycHggOHJweDsgYmFja2dyb3VuZDojZjhmOGY4OyBib3JkZXItcmFkaXVzOiA4cnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGhlaWdodDogODBycHg7IGxpbmUtaGVpZ2h0OiA4MHJweDsgZm9udC1zaXplOiAyOHJweDsgY29sb3I6ICM2NjY7IGRpc3BsYXk6IGJsb2NrO31cclxuLnNjcmVlblRhYl9maXhlZCAuc2NyZWVuIHVsIGxpLm9ue2JhY2tncm91bmQ6ICNFOEY2RTg7Y29sb3I6ICMyMEFEMjA7fVxyXG4uc2NyZWVuVGFiX2ZpeGVkIC5zY3JlZW4gLmJ0bl9ib3h7cG9zaXRpb246cmVsYXRpdmU7IHotaW5kZXg6IDE7IGhlaWdodDogOTZycHg7IGJhY2tncm91bmQ6ICNmZmY7IHRleHQtYWxpZ246IGNlbnRlcjsgb3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLnNjcmVlbiAuYnRuX2JveCAuYnRue2xpbmUtaGVpZ2h0OiA5NnJweDsgZm9udC1zaXplOiAzMnJweDsgY29sb3I6IDMzMzsgd2lkdGg6IDUwJTsgZmxvYXQ6IGxlZnQ7IGJvcmRlci10b3A6IDJycHggc29saWQgI2VlZTt9XHJcbi5zY3JlZW5UYWJfZml4ZWQgLnNjcmVlbiAuYnRuX2JveCAuYnRuMntib3JkZXItdG9wOiAycnB4IHNvbGlkICMyMEFEMjA7IGJhY2tncm91bmQ6ICMyMEFEMjA7IGNvbG9yOiAjZmZmO31cclxuXHJcbi8q55m95biDJueZu+W9lSbml6DmlbDmja4m5Yqg6L29Ki9cclxuLm5vbG9naW57dGV4dC1hbGlnbjogY2VudGVyO3Bvc2l0aW9uOiBhYnNvbHV0ZTt0b3A6IDUwJTtsZWZ0OiA1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpOy13ZWJsaXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpfVxyXG4ubm9sb2dpbiB2aWV3e2ZvbnQtc2l6ZTogMjhycHg7bWFyZ2luLXRvcDogMjBycHg7fVxyXG4ubm9sb2dpbiBidXR0b257aGVpZ2h0OiA2MHJweDtsaW5lLWhlaWdodDogNjBycHg7d2lkdGg6IDIwMHJweDtmb250LXNpemU6IDI0cnB4O31cclxuLm5vbG9naW4gaW1hZ2V7d2lkdGg6IDIwMHJweDtoZWlnaHQ6MjAwcnB4O31cclxuXHJcbi5sb2FkLWltZ3twb3NpdGlvbjogYWJzb2x1dGU7ei1pbmRleDogMTAwMDt0b3A6NTAlO2xlZnQ6NTAlO3RyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7LXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpO2xpbmUtaGVpZ2h0OiAwO3dpZHRoOjE5MHJweDtoZWlnaHQ6MTkwcnB4O3RleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuOCk7dmVydGljYWwtYWxpZ246bWlkZGxlO29wYWNpdHk6LjU7fVxyXG4ubG9hZC1pbWcgaW1hZ2V7d2lkdGg6MTAwcnB4O2hlaWdodDogMTAwcnB4O21hcmdpbi10b3A6IDQ1cnB4O31cclxuXHJcbi5iYWktY29udHt3aWR0aDogMTAwJTtoZWlnaHQ6MTAwJTtiYWNrZ3JvdW5kOiAjZmZmO3Bvc2l0aW9uOiBmaXhlZDt0b3A6IDA7Ym90dG9tOiAwO2xlZnQ6IDA7cmlnaHQ6IDA7ei1pbmRleDogOTk5O31cclxuLmJhaS1jb250IC5tYWluLWltZ3twb3NpdGlvbjogYWJzb2x1dGU7ei1pbmRleDogMTAwMDt0b3A6NTAlO2xlZnQ6NTAlO3RyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7LXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpO2xpbmUtaGVpZ2h0OiAwO3dpZHRoOjE5MHJweDtoZWlnaHQ6MTkwcnB4O3RleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuOCk7dmVydGljYWwtYWxpZ246bWlkZGxlO29wYWNpdHk6LjY7Ym9yZGVyLXJhZGl1czogMTBycHg7fVxyXG4uYmFpLWNvbnQgLm1haW4taW1nIGltYWdle3dpZHRoOjEwMHJweDtoZWlnaHQ6IDEwMHJweDttYXJnaW4tdG9wOiA0NXJweDt9XHJcblxyXG4ubm9uZS1jb250e2NvbG9yOiM2NjY7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZy10b3A6ODBycHg7Ym94LXNpemluZzogYm9yZGVyLWJveDt9XHJcbi5ub25lLWNvbnQgLm1haW4gaW1hZ2V7d2lkdGg6MjAwcnB4O2hlaWdodDoyMDBycHh9XHJcbi8qIC5zaG9wQ2Fye3Bvc2l0aW9uOiBmaXhlZDtyaWdodDoxMHJweDtib3R0b206MjAlO3otaW5kZXg6IDk5OTt3aWR0aDo5NnJweDtoZWlnaHQ6OTZycHggO31cclxuLnNob3BDYXIgaW1hZ2V7d2lkdGg6MTAwJTtoZWlnaHQ6IDEwMCU7fSAqL1xyXG5cclxuLmlkeEhvbmdiYW9fbWFza3twb3NpdGlvbjogZml4ZWQ7IGxlZnQ6IDA7IHRvcDogMDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgei1pbmRleDogMTAwOyBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuNik7fVxyXG4uaWR4SG9uZ2Jhb19jb250e3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogNTAlOyB0b3A6IDUwJTsgd2lkdGg6IDg1JTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwtNTAlKTt9XHJcbi5pZHhIb25nYmFvX2NvbnQgLmNvbnR7cGFkZGluZzogMCAwcnB4IDJycHg7IGJvcmRlci1yYWRpdXM6IDQwcnB4OyBvdmVyZmxvdzogaGlkZGVuO31cclxuLmlkeEhvbmdiYW9fY29udCAuYnRue2ZvbnQtc2l6ZTogMzJycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgbGluZS1oZWlnaHQ6IDg4cnB4OyBjb2xvcjogI2YwMDIxZDsgYmFja2dyb3VuZC1jb2xvcjojZmFlYjMxOyBib3JkZXItcmFkaXVzOiA4MHJweDsgYm94LXNoYWRvdzogMCA2cnB4IDAgMCAjZTRiMTAzOyBtYXJnaW46MCBhdXRvOyB3aWR0aDogNzQlOyBmb250LXdlaWdodDpib2xkOyBtYXJnaW4tdG9wOiAzNnJweDt9XHJcbi5pZHhIb25nYmFvX2NvbnQgdWx7bWF4LWhlaWdodDo0MDBycHg7ICBvdmVyZmxvdzogYXV0bzstd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7IGRpc3BsYXk6IGJsb2NrOyBwYWRkaW5nOiAxNnJweCAyMHJweCAycnB4O31cclxuLmlkeEhvbmdiYW9fY29udCB1bCBsaXtkaXNwbGF5OiBibG9jazsgYm9yZGVyLXJhZGl1czogMTJycHg7IHBvc2l0aW9uOiByZWxhdGl2ZTttYXJnaW46IDE2cnB4IDA7fVxyXG4uaWR4SG9uZ2Jhb19jb250IHVsIGxpIC5iZ3t3aWR0aDogMTAwJTsgaGVpZ2h0OiBhdXRvOyBtaW4taGVpZ2h0OiAxNDRycHg7fVxyXG4uaWR4SG9uZ2Jhb19jb250IHVsIGxpIC5ib3h7d2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7fVxyXG4uaWR4SG9uZ2Jhb19jb250IHVsIGxpIC5wcmljZXsgd2lkdGg6IDE4MHJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBwb3NpdGlvbjogYWJzb2x1dGU7bGVmdDogMDsgdG9wOiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTUwJSk7IGZvbnQtc2l6ZTogNzJycHg7IGNvbG9yOiAjZTEzMzM3O31cclxuLmlkeEhvbmdiYW9fY29udCAucHJpY2Ugc21hbGx7Zm9udC1zaXplOiAyOHJweDt9XHJcbi5pZHhIb25nYmFvX2NvbnQgdWwgbGkgLnR4dF9ib3h7bWFyZ2luLWxlZnQ6IDE4MHJweDsgcG9zaXRpb246IHJlbGF0aXZlOyBwYWRkaW5nOiAxNnJweCAyMHJweDt9XHJcbi5pZHhIb25nYmFvX2NvbnQgdWwgbGkgLnR4dF9ib3ggLmgze2ZvbnQtc2l6ZTogMjhycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgY29sb3I6ICNFMTMzMzc7IGRpc3BsYXk6IGJsb2NrO31cclxuLmlkeEhvbmdiYW9fY29udCB1bCBsaSAudHh0X2JveCBwe2Rpc3BsYXk6IGJsb2NrO31cclxuLmlkeEhvbmdiYW9fY29udCAgLnR4dF9ib3ggc21hbGx7Zm9udC1zaXplOiAyMHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBjb2xvcjogIzY2Njt9XHJcbi5pZHhIb25nYmFvX2NvbnQgLmNsb3Nle3Bvc2l0aW9uOiBhYnNvbHV0ZTsgcmlnaHQ6IC0yMHJweDsgdG9wOiAtMTAwcnB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLDApOyB3aWR0aDogNTRycHg7IGhlaWdodDogMTMycnB4O31cclxuXHJcbkBpbXBvcnQgXCIuLi8uLi90ZW1wbGF0ZS9zaG9wTGlzdHMvc2hvcExpc3RzLmNzc1wiOyIsbnVsbF19 */
</style>








<!-- <template>
	<web-view :src="outsideURL"></web-view>
</template>

<script>
	// pages/outsideLink/qianggou/qianggou.js
	var app = getApp();

	export default {
		data() {
			return {
				outsideURL: app.globalData.URL + '/qiang/index?city_id=' + (app.globalData.city_id || '') + '&lng=' + app
					.globalData._CFG.lng + '&lat=' + app.globalData._CFG.lat
			};
		},

		components: {},
		props: {},


		onShow: function() {
			this.setData({
				outsideURL: app.globalData.URL + '/qiang/index?city_id=' + (app.globalData.city_id || '') +
					'&lng=' + app.globalData._CFG.lng + '&lat=' + app.globalData._CFG.lat
			});
		},


		onShareAppMessage: function(res) {
			return {
				path: "/pages/webview/webview?url=" + encodeURIComponent(res.webViewUrl)
			};
		},
		methods: {}
	};
</script> -->