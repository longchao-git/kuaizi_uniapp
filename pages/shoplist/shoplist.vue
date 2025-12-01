<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<!--提示框引入-开始-->
				<!--<import src="../components/showToast.wxml"></import>-->
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
				<view class="shoplistNav">
					<view class="nav  border_b">
						<view v-for="(item, idx) in navtab" :key="idx"
							:class="'lei ' + (currentTab==idx ? 'lei_active' : '')" :data-id="idx" @tap="switchNav">
							<text>{{item}}</text>
						</view>
					</view>
					<view :class="'pin ' + (currentTab==0 ? 'pin_active' : '') + ' border_b'">
						<scroll-view scroll-y="true" class="left">
							<view v-for="(item, leftIdx) in leftList" :key="leftIdx"
								:class="'leftList black6 ' + (leftTap==item.cate_id ? 'left_active' : '')"
								:data-id="leftIdx" :data-title="item.title" :data-parentid="item.cate_id" @tap="lefttap"
								:data-cate_id="item.cate_id">
								{{item.title}}
								<block v-if="item.childrens.length > 0">
									<image src="/static/image/icon-arrowR-gray2x.png"></image>
								</block>
							</view>
						</scroll-view>
						<scroll-view v-for="(item, bigRIdx) in leftList" :key="bigRIdx" scroll-y="true" class="right"
							:data-id="bigRIdx" v-if="leftTap==item.cate_id ? 'true':''  ">
							<view v-for="(item, index) in item.childrens" :key="index"
								:class="'rightList black6 ' + (rightTap==item.cate_id ? 'right_active' : '')"
								:data-id="item.cate_id" :data-parentid="item.cate_id" @tap="righttap">{{item.title}}
								<image class="check" src="/static/image/icon_selected3x.png"></image>
							</view>
						</scroll-view>
					</view>
					<view :class="'pai ' + (currentTab==1 ? 'pai_active' : '') + ' border_b'">
						<view v-for="(item, paixuIdx) in paixu" :key="paixuIdx" :data-id="paixuIdx"
							:data-order="item.order" @tap="paitap">
							<text :class="paixuOn==paixuIdx ? 'pai_active' : ''">{{item.name}}</text>
							<image src="/static/image/icon_choosed.png" class="fr" v-if="paixuOn==paixuIdx"></image>
						</view>
					</view>
					<view :class="'xuan ' + (currentTab==2 ? 'xuan_active' : '') + ' border_b'">
						<view>
							<view class="title black9">{{xuan1.title}}</view>
							<view class="list">
								<view v-for="(item, xuanIdx1) in list1" :key="xuanIdx1"
									:class="'tip ' + (xuanTap1==xuanIdx1 ? 'tip_active' :'')" :data-id="xuanIdx1"
									@tap="peisong" :data-peisong="item.filter">
									{{item.name}}
								</view>
							</view>
							<view class="clear"></view>
						</view>
						<view>
							<view class="title black9">{{xuan2.title}}</view>
							<view class="list">
								<view v-for="(item, xuanIdx2) in list2" :key="xuanIdx2"
									:class="'tip ' + (xuanTap2==xuanIdx2 ? 'tip_active' :'')" :data-id="xuanIdx2"
									@tap="youhui" :data-youhui="item.filter">
									{{item.name}}
								</view>
							</view>
							<view class="clear"></view>
						</view>
						<view>
							<view class="title black9">{{xuan3.title}}</view>
							<view class="list">
								<view v-for="(item, xuanIdx3) in list3" :key="xuanIdx3"
									:class="'tip ' + (xuanTap3==xuanIdx3 ? 'tip_active' :'')" :data-id="xuanIdx3"
									@tap="character" :data-character="item.filter">
									{{item.name}}
								</view>
							</view>
							<view class="clear"></view>
						</view>
						<view class="btns">
							<view class="btn" @tap="empty">清空</view>
							<view class="btn btn2" @tap="confirm">确定</view>
						</view>
					</view>
					<view class="mask-bg mask-bg1" :hidden="hidden1" @tap="masktap"></view>
				</view>
				<scroll-view class="shoplistwrap" :style="'height: '+(phoneHeight - 43)+'px'" style="padding-top:86rpx;"
					:scroll-top="scrolltop" scroll-y="true" @scrolltolower="more">
					<!--商家列表-开始-->
					<!--<import src="../../template/shopLists/shopLists.wxml"></import>-->
					<block data-type="template" data-is="shoplists" data-attr="lists:lists,hdShow:hdShow,hdType:hdType">
						<view class="shoplists_box">
							<view v-for="(item, index) in lists" :key="index"
								:class="'shoplists ' + (item.yyst == 1 ? '' : 'close')" @tap="gotoDetail"
								:id="item.shop_id">
								<view class="logo">
									<image :src="item.logo" class="pic" mode="aspectFill"></image>
									<image src="/static/image/label_new.png" class="tag" v-if="item.is_new == 1">
									</image>
									<view class="state" v-if="item.yyst != 1">打烊了</view>
									<view class="num" v-if="item.totalnum > 0">{{item.totalnum}}</view>
								</view>
								<view class="txt_box">
									<view class="overflow_clear tit">{{item.title}}</view>
									<view class="open_state" v-if="item.tips_label != ''">
										<text>{{item.tips_label}}</text></view>
									<block v-if="hdType == '1'">
										<view class="box">
											<!-- <view class="starBg">
                            <image src='../../image/evlt_star_bg.png' class='starBgimg'></image>
                            <view class="star" style="width:{{item.avg_score*20}}%;">
                                <image src='../../image/evlt_star_bar.png'></image>
                            </view>
                        </view> -->
											<view class="starS" v-if="item.comment_score_switch==1">
												<image src="/static/image/Star-pre3x.png"></image>{{item.avg_score}}
											</view>
											<!-- 已售{{item.orders}}单 -->
											<block v-if="item.comment_switch==1">评价{{item.comments}}</block>
											<view class="fr"><span class="green">{{item.pei_time}}分钟</span>
												{{item.juli_label}}</view>
										</view>
										<view class="box">
											<view class="fl flex-wrp">
												<view class="text_amount">
													起送€{{item.min_amount}}
												</view>
												<span class='text_freight'>
													<block v-if="item.freight == 0">免配送费</block>
													<!-- <span class='del'>€{{item.freight}}</span> -->
													<block v-else-if="item.is_reduce_pei == 1">
														配送费{{item.reduceEd_freight}}起</block>
													<block v-else>配送€{{item.freight}}起</block>
												</span>
											</view>
											<!-- <view class="song song2" style='border-color:#{{item.peiType.line_color}}; color:#{{item.peiType.color}};'>{{item.peiType.label}}</view> -->
										</view>
										<!-- <view class="line"></view> -->
										<view class="support">
											<span v-if="item.is_refund == 1">极速退款</span>
											<span v-if="item.is_ziti == 1">支持自提</span>
										</view>
										<view class="hd" v-if="item.huodong.length > 0">
											<view class="right" @tap.stop="tapHd" :data-index="index"
												v-if="item.huodong.length > 3">{{item.huodong.length}}个活动<image
													class="ico" mode="aspectFit"
													:src="'/static/image/' + (hdShow == index ? 'btn_arrow_up_small3x.png' : 'topBottom.png')">
												</image>
											</view>
											<ul :class="hdShow == index ? 'on' : ''">
												<li v-for="(li, idx) in item.huodong" :key="idx">
													<i class="ico" :style="'background:#' + li.color">{{li.word}}</i>
													{{li.title}}
												</li>
											</ul>
										</view>
									</block>
									<block v-if="hdType == '2'">
										<view class="box black6">
											<view class="starS">
												<image src="/static/image/Star-pre3x.png"></image>{{item.avg_score}}
											</view>
											评价{{item.comments}}
											<!-- 已售{{item.orders}}单 -->
											<view class="fr"><span>{{item.pei_time}}分钟</span> {{item.juli_label}}</view>
										</view>
										<view class="box black6">
											<view class="fl flex-wrp">
												<view class="text_amount">
													起送€{{item.min_amount}}
												</view>
												<span class='text_freight'>
													<block v-if="item.freight == 0">免配送费</block>
													<block v-else-if="item.is_reduce_pei == 1">配送费{{item.freight}}起
														<span class='del'>€{{item.reduceEd_freight}}</span></block>
													<block v-else>配送€{{item.freight}}</block>
												</span>
											</view>
											<!-- 商家专送 -->
											<!-- <view class="song song2" style='border-color:#{{item.peiType.line_color}}; color:#{{item.peiType.color}};'>{{item.peiType.label}}</view> -->
										</view>
										<!-- <view class="line"></view> -->
										<view class="pullBox">
											<view class="right" @tap.stop="tapHd" :data-index="index">
												<image class="ico" mode="aspectFit"
													:src="'/static/image/' + (hdShow == index ? 'btn_arrow_up_small3x.png' : 'topBottom.png')">
												</image>
											</view>
											<view :class="'left ' + (hdShow == index ? 'on' : '')">
												<view v-for="(li, idx) in item.huodong" :key="idx" class="list">
													{{li.title}}</view>
												<span v-if="item.is_refund == 1">极速退款</span>
												<span v-if="item.is_ziti == 1">支持自提</span>
											</view>
										</view>
									</block>
								</view>
								<view class="clear"></view>
								<view class="products" hidden="true">
									<ul>
										<!-- <li>
						<view class="pic" style="'background-image:url(+ {{pli.pic}} +);'"></view>
						<view class="overflow_clear bt">{{pli.title}}</view>
						<view class="price"><span>€</span>{{pli.price}}</view>
					</li> -->
										<!-- <li>
						<view class="pic" :style="''background-image:url(+ ' + pli.pic + ' +)''"></view>
						<view class="overflow_clear bt">12</view>
						<view class="price"><span>€</span>555</view>
					</li> -->
									</ul>
								</view>
							</view>
						</view>
						<view class="pub-nodata" v-if="lists.length == 0">
							<image src="/static/image/noorder.png"></image>
							<view class="black6">暂无数据</view>
						</view>
					</block>
					<view style="height:1px"></view>
					<!--商家列表-结束-->
					<view class="weui-loadmore" :hidden="loadhide">
						<image src="/static/image/loading.gif"></image>
						<text class="weui-loadmore__tips">正在加载</text>
					</view>
					<view :hidden="morehidden" class="morelist" @tap="tosearch">没有更多啦,试试<text>搜索</text>吧</view>
					<view v-if="lists.length==0" class="none-cont">
						<!-- <view class="main">
        <image src="../../image/noorder.png"></image>
        <view class="black6">没有找到对应的商家，您可以修改筛选条件或切换地址</view>
    </view> -->
					</view>
				</scroll-view>



				<view class="bai-cont" :hidden="whitebg"></view>
				<!--白布-->
			</view>
		</skeleton>

	</view>
</template>

<script>
	var common = require("../../js/ecart.js");
	var app = getApp();
	var ecart = null;
	var double = true;
	var params = {
		page: '',
		order: '',
		cate_id: '',
		pei_filter: '',
		youhui_filter: '',
		feature_filter: '',
		"lng": '',
		"lat": ''
	};

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},

				page: 1,
				navtab: ["全部分类", "排序", "筛选"],
				leftList: [],
				//全部分类；
				leftTap: '0',
				//商品分类排序左；
				rightTap: 'q',
				//商品分类排序右；
				hidden1: true,
				//下拉分类蒙层；
				paixu: [{
					name: "智能排序",
					order: ""
				}, {
					name: "距离最近",
					order: "juli"
				}, {
					name: "评分最高",
					order: "score"
				}, {
					name: "销售最高",
					order: "sales"
				}, {
					name: "起送价最低",
					order: "price"
				}, {
					name: "最早送达",
					order: "ptime"
				}],
				paixuOn: 0,
				list1: [{
					name: "不限",
					filter: ''
				}, {
					name: "平台送",
					filter: 'roof_pei'
				}, {
					name: "商家送",
					filter: 'shop_pei'
				}],
				list2: [{
					name: "首单优惠",
					filter: 'youhui_first'
				}, {
					name: "满减优惠",
					filter: 'manjian'
				}, {
					name: "满返优惠",
					filter: 'manfan'
				}, {
					name: "进店领券",
					filter: 'coupon'
				}],
				list3: [{
					name: "免配送费",
					filter: 'free_pei'
				}, {
					name: "新店开业",
					filter: 'is_new'
				}, {
					name: "0€起送",
					filter: 'zero_amount'
				}, {
					name: "在线支付",
					filter: 'online_pay'
				}],
				xuan1: {
					src: "/static/image/icon_wai_pei.png",
					title: '配送方式'
				},
				xuan2: {
					src: "/static/image/icon_wai_hui.png",
					title: '优惠信息'
				},
				xuan3: {
					src: "/static/image/icon-shop2x.png",
					title: '商家特色'
				},
				topmask: true,
				lists: [],
				morehidden: true,
				nonehidden: true,
				hidden2: "fasle",
				hidden3: "fasle",
				pageimg: app.globalData._CFG.IMG_URL || '',
				xuanTap1: '-1',
				xuanTap2: '-1',
				xuanTap3: '-1',
				hdShow: null,
				hdType: 1,
				currentTab: undefined,
				leftIdx: "",
				bigRIdx: "",
				paixuIdx: "",
				xuanIdx1: "",
				xuanIdx2: "",
				xuanIdx3: "",
				loadhide: "",
				scrolltop: "",
				whitebg: "",
				showToast: {
					isShow: false
				},
				phoneHeight: ''
			};
		},

		components: {},
		props: {},
		created() {
			//骨架屏
			this.reloadData()
		},
		onLoad: function(options) {

			this.setData({
				whitebg: false
			});
			var cateid, title;
			var lefttap = this.lefttap;
			var navtab = this.navtab;
			cateid = options.cateid || 0;
			console.log('cate_id', cateid);
			lefttap = options.cateid;
			title = options.title;
			navtab[0] = title || '全部分类';
			this.setData({
				leftTap: lefttap,
				navtab: navtab
			});
			params = {
				page: '',
				order: '',
				cate_id: '',
				pei_filter: '',
				youhui_filter: '',
				feature_filter: '',
				"lng": '',
				"lat": ''
			}; //先定义一个变量存储自己

			params.page = this.page;
			params.cate_id = cateid;
			params.lat = app.globalData._CFG.lat;
			params.lng = app.globalData._CFG.lng;
			var that = this;
			var navtab = that.navtab; //数据筛选
			uni.getSystemInfo({
				success(res) {
					console.log(res.windowHeight)
					that.phoneHeight = res.windowHeight;

				}
			});
			uni.showLoading({
				title: '加载中...'
			});
			// #ifdef MP-ALIPAY || H5
			my.showLoading({
				title: "加载中..."
			})
			// #endif
			app.globalData.shopLists(params, function(res) {
				// console.log("商家列表",res);
				if (res.error == '0') {
					if (res.data.items) {
						for (var i = 0; i < res.data.items.length; i++) {
							ecart = new common.ECart(res.data.items[i].shop_id);
							res.data.items[i].totalnum = ecart.total_count();
						}

						;
						that.setData({
							lists: res.data.items,
							whitebg: true
						});

						if (res.data.items.length < 10 && res.data.items.length !== 0) {
							that.setData({
								loadhide: true,
								morehidden: true
							});
						} else if (res.data.items.length == 0) {
							that.nonehidden = false;
							that.setData({
								loadhide: true,
								morehidden: true
							});
						}

						;
					}

					;
					uni.hideLoading();

					// #ifdef MP-ALIPAY || H5
					my.hideLoading()
					// #endif

				} else {
					uni.showToast({
						title: res.message
					});
					this.setData({
						whitebg: true
					});
				}

				;
			});
			that.getFilter();
		},

		onShow() {
			for (var i = 0; i < this.lists.length; i++) {
				ecart = new common.ECart(this.lists[i].shop_id);
				this.lists[i].totalnum = ecart.total_count();
			}

			;
			this.setData({
				lists: this.lists
			}); //请求模块化

			var that = this;
			app.globalData.home({}, function(res) {
				// console.log(res);
				if (res.error == '0') {
					for (var i = 0; i < res.data.theme.length; i++) {
						if (res.data.theme[i].module == "module9") {
							that.setData({
								hdType: res.data.theme[i].type
							});
						}

						;
					}

					;
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},

		//分享；
		onShareAppMessage: function(e) {
			return {
				title: '微信小程序外卖',
				path: '/pages/shoplist/shoplist',
				success: function(res) {},
				fail: function(res) {}
			};
		},
		methods: {
			//骨架屏
			reloadData() {
				this.loading = true
				setTimeout(() => {
					this.loading = false
				}, 3000)
			},
			//请求接口；
			//下拉切换；
			switchNav: function(e) {
				var id = e.currentTarget.dataset.id;
				var currentTab = this.currentTab;
				var hidden1 = this.hidden1;

				if (id == currentTab) {
					id = 'q';
					hidden1 = true;
				} else {
					currentTab = id;
					hidden1 = "";
				}

				this.setData({
					currentTab: id,
					hidden1: hidden1
				});
			},
			//请求商品分类数据；
			getFilter: function() {
				var that = this;
				app.globalData.shopListsCates({}, function(res) {
					console.log("商家分类", res);

					if (res.error == '0') {
						var shop_cate = res.data.items;
						that.setData({
							leftList: shop_cate
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}

					;
				});
			},
			//筛选分类商品左侧；
			lefttap: function(e) {
				var that = this;
				var id = e.currentTarget.dataset.id;
				var title = e.currentTarget.dataset.title;
				var cate_id = e.currentTarget.dataset.cate_id;
				var navtab = that.navtab;
				navtab[0] = title;

				if (that.leftList[id].childrens.length == 0) {
					that.setData({
						page: 1
					});
					params.page = 1;
					params.cate_id = cate_id;
					app.globalData.shopLists(params, function(res) {
						if (res.error == '0') {
							that.setData({
								hidden1: true,
								currentTab: 'q',
								rightTap: 'q',
								scrolltop: 0
							});

							if (res.data.items) {
								that.setData({
									lists: res.data.items
								});

								if (res.data.items.length == 10) {
									that.setData({
										loadhide: false,
										morehidden: true,
										nonehidden: true
									});
								} else if (res.data.items.length == 0) {
									that.setData({
										nonehidden: false,
										loadhide: true,
										morehidden: true
									});
								} else {
									that.setData({
										loadhide: true,
										morehidden: true,
										nonehidden: true
									});
								}
							}
						} else {
							uni.showToast({
								title: res.message
							});
						}

						;
					});
				}

				;
				that.setData({
					leftTap: cate_id,
					navtab: navtab
				});
			},
			//筛选分类商品右侧；
			righttap: function(e) {
				uni.showLoading({
					title: '加载中...'
				}); //先定义一个变量存储自己

				var that = this;
				var parentid = e.currentTarget.dataset.parentid;
				that.setData({
					page: 1
				});
				params.cate_id = parentid;
				params.page = 1; //数据筛选

				app.globalData.shopLists(params, function(res) {
					if (res.error == '0') {
						that.setData({
							scrolltop: 0,
							rightTap: e.currentTarget.dataset.id,
							hidden1: true,
							currentTab: 'q',
							nonehidden: true
						});
						uni.hideLoading();

						if (res.data.items) {
							that.setData({
								lists: res.data.items
							});

							if (res.data.items.length == 0 || res.data.items.length < 10) {
								that.setData({
									loadhide: true,
									morehidden: true,
									nonehidden: false
								});
							}

							;
						}

						;
					} else {
						uni.showToast({
							title: res.message
						});
					}

					;
				});
			},
			//筛选分类商品排序；
			paitap: function(e) {
				var that = this;
				var order = e.currentTarget.dataset.order;
				params.order = order;
				params.page = 1;
				var navtab = that.navtab;
				var id = e.currentTarget.dataset.id;
				navtab[1] = that.paixu[id].name; //数据筛选

				app.globalData.shopLists(params, function(res) {
					if (res.error == '0') {
						if (res.data.items) {
							if (res.data.items.length < 10 && res.data.items.length > 0) {
								that.setData({
									loadhide: true
								});
							}

							that.setData({
								lists: res.data.items
							});
						}

						that.setData({
							paixuOn: e.currentTarget.dataset.id,
							hidden1: true,
							currentTab: 'q'
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				that.setData({
					navtab: navtab,
					page: 1,
					scrolltop: 0
				});
			},
			//筛选分类商品筛选；
			peisong: function(e) {
				var that = this;
				var peisong = e.currentTarget.dataset.peisong;
				var index = e.currentTarget.dataset.id;
				var xuanTap1 = that.xuanTap1;

				if (xuanTap1 != index) {
					params.pei_filter = peisong;
					that.setData({
						xuanTap1: index
					});
				} else {
					params.pei_filter = '';
					that.setData({
						xuanTap1: '-1'
					});
				}
			},
			youhui: function(e) {
				var that = this;
				var youhui = e.currentTarget.dataset.youhui;
				var index = e.currentTarget.dataset.id;
				var xuanTap2 = that.xuanTap2;

				if (xuanTap2 != index) {
					params.youhui_filter = youhui;
					that.setData({
						xuanTap2: index
					});
				} else {
					params.youhui_filter = '';
					that.setData({
						xuanTap2: '-1'
					});
				}
			},
			character: function(e) {
				var that = this;
				var character = e.currentTarget.dataset.character;
				var index = e.currentTarget.dataset.id;
				var xuanTap3 = that.xuanTap3;

				if (xuanTap3 != index) {
					params.feature_filter = character;
					that.setData({
						xuanTap3: index
					});
				} else {
					params.feature_filter = '';
					that.setData({
						xuanTap3: '-1'
					});
				}
			},
			confirm: function(e) {
				var that = this;
				that.setData({
					page: 1
				});
				params.page = 1; //重新赋值，解决下拉加载时的全局page值导致的筛选没数据的问题
				//数据筛选      
				// console.log(params); 

				app.globalData.shopLists(params, function(res) {
					if (res.error == '0') {
						if (res.data.items) {
							if (res.data.items.length < 10) {
								that.setData({
									loadhide: true
								});
							}

							that.setData({
								lists: res.data.items
							});
						}

						that.setData({
							scrolltop: 0,
							hidden1: true,
							currentTab: 'q'
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			empty: function(e) {
				var that = this;
				that.setData({
					page: 1
				});
				params.pei_filter = '';
				params.youhui_filter = '';
				params.feature_filter = '';
				params.page = 1; //重新赋值，解决下拉加载时的全局page值导致的筛选没数据的问题
				//数据筛选       

				app.globalData.shopLists(params, function(res) {
					if (res.error == '0') {
						that.setData({
							hidden1: true,
							currentTab: 'q',
							xuanTap1: 'q',
							xuanTap2: 'q',
							xuanTap3: 'q'
						});

						if (res.data.items) {
							that.setData({
								lists: res.data.items
							});
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			masktap: function(e) {
				this.setData({
					currentTab: 'q',
					hidden1: true
				});
			},
			//去商家详情页；
			gotoDetail: function(e) {
				var id = e.currentTarget.id;
				app.globalData._CFG.shoptail = id;
				var url = '../shoptail/shoptail?id=' + app.globalData._CFG.shoptail;
				app.globalData.topage(url);
			},
			//下拉加载；
			more: function() {

				if (double) {
					uni.showLoading({
						title: '加载中...'
					});
					double = false;
					var page = this.page;
					page++;
					params.page = page;
					var that = this; //数据筛选

					app.globalData.shopLists(params, function(res) {
						if (res.error == '0') {
							if (res.data.items) {
								for (var i = 0; i < res.data.items.length; i++) {
									ecart = new common.ECart(res.data.items[i].shop_id);
									res.data.items[i].totalnum = ecart.total_count();
								}

								if (res.data.items.length == 0) {
									that.setData({
										morehidden: false,
										loadhide: true
									});
								} else {
									that.setData({
										lists: that.lists.concat(res.data.items),
										page: page,
										loadhide: false,
										morehidden: true
									});
								}
							}

							setTimeout(function() {
								double = true;
							}, 1000);
							uni.hideLoading();
						} else {
							uni.showToast({
								title: res.message
							});
						}
					}); // that.getFilter();
				}
			},

			//查看更多活动
			tapHd(e) {
				var hdShow = e.currentTarget.dataset.index;

				if (this.hdShow == hdShow) {
					this.setData({
						hdShow: null
					});
				} else {
					this.setData({
						hdShow: hdShow
					});
				}

				;
			},

			tosearch: function() {
				app.globalData.topage('../indexSearch/search');
			}
		}
	};
</script>
<style>
	.shoplistwrap {
		/* height: calc(100% - 43px) */

	}

	.mask-bg {
		background: rgba(0, 0, 0, .3);
		position: fixed;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		width: 100%;
		height: 100%;
	}

	.morelist {
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		background: #f8f8f8;
		margin-bottom: 20rpx;
	}

	.morelist text {
		color: #0f8fd0;
	}

	.shopList .left_pic .totalnum {
		width: 40rpx;
		height: 20rpx;
		color: #fff;
		font-size: 24rpx;
		line-height: 20rpx;
		border-radius: 20rpx;
		background: #ff3300;
		position: absolute;
		right: -10rpx;
		top: -10rpx;
		text-align: center;
	}

	.shoplistNav {
		position: fixed;
		z-index: 10;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
	}

	.shoplistNav .nav {
		display: flex;
		background: #fff;
		font-size: 32rpx;
		padding: 24rpx 0;
		z-index: 999;
		position: relative;
	}

	/* #ifdef H5 */
	.shoplistNav .nav {
		margin-top: 80rpx;
	}

	/* #endif */



	.shoplistNav .lei {
		flex: 1;
		text-align: center;
		border-right: 2rpx solid #e6e6e6;
	}

	.shoplistNav .lei_active {
		color: #ff797c;
	}

	.shoplistNav .lei:last-child {
		border-right: 0;
	}

	.shoplistNav .lei:after {
		content: '';
		width: 0;
		height: 0;
		display: inline-block;
		border: 4px solid transparent;
		border-top-color: #999;
		margin-left: 5px;
		position: absolute;
		top: 20px;
	}

	.weui-loadmore {
		height: 80rpx;
		line-height: 80rpx;
		background: #f8f8f8;
		text-align: center
	}

	.weui-loadmore image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.shoplistNav .lei_active:after {
		border: 4px solid transparent;
		border-bottom-color: #ff797c;
		top: 15px;
	}

	.shoplistNav .pin,
	.shoplistNav .pai,
	.shoplistNav .xuan {
		position: absolute;
		width: 100%;
		box-sizing: border-box;
		transform: translate(0, -100%);
		transition: all .3s;
	}

	.shoplistNav .pin_active,
	.shoplistNav .pai_active,
	.shoplistNav .xuan_active {
		transform: translate(0, 0);
		z-index: 998;
		/*transition: all .3s;*/
	}

	.shoplistNav .pin .left {
		width: 48%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		max-height: 100%;
		-webkit-overflow-scrolling: touch
	}

	.shoplistNav .pin .left .left_active {
		border-color: #ff797c;
		background: #fff;
		color: #ff797c;
	}

	.shoplistNav .pin .leftList {
		background: #f4f4f4;
		height: 100rpx;
		border-left: 4rpx solid transparent;
		padding-left: 44rpx;
		line-height: 100rpx;
	}

	.shoplistNav .pin .leftList image {
		width: 8rpx;
		height: 16rpx;
		float: right;
		margin-right: 24rpx;
		margin-top: 42rpx;
	}

	.shoplistNav .pin {
		display: flex;
		max-height: 800rpx;
		background: #fff;
		overflow: hidden;
	}

	.shoplistNav .pin .right {
		width: 52%;
		background: #fff;
		padding-left: 24rpx;
		box-sizing: border-box;
	}

	.shoplistNav .pin text {
		color: #999;
	}

	.shoplistNav .pin .right .right_active,
	.shoplistNav .pin .right .right_active text,
	.shoplistNav .pin .left_active text {
		color: #ff797c;
	}

	.shoplistNav .pin .rightList {
		height: 100rpx;
		line-height: 100rpx;
		box-sizing: border-box;
		position: relative;
	}

	.shoplistNav .pin .rightList .check {
		width: 36rpx;
		height: 26rpx;
		position: absolute;
		right: 20rpx;
		top: 50%;
		margin-top: -13rpx;
		display: none;
	}

	.shoplistNav .pin .rightList.right_active .check {
		width: 36rpx;
		height: 26rpx;
		position: absolute;
		right: 20rpx;
		top: 50%;
		margin-top: -13rpx;
		display: block;
	}

	.shoplistNav .pin .rightList:last-child {
		border: 0;
	}

	.shoplistNav .pin .rightList .fr {
		margin-right: 24rpx;
	}

	.shoplistNav .pai {
		background: #fff;
		padding: 0 24rpx;
		position: absolute
	}

	.shoplistNav .pai image {
		width: 36rpx;
		height: 24rpx;
		margin-top: 24rpx;
	}

	.shoplistNav .pai text {
		line-height: 100rpx;
	}

	.shoplistNav .pai .pai_active {
		color: #ff797c;
	}

	.shoplistNav .pai view {
		height: 100rpx;
	}

	.shoplistNav .xuan {
		background: #fff;
		padding: 30rpx 30rpx 50rpx;
	}

	.shoplistNav .xuan image {
		width: 24rpx;
		height: 20rpx;
	}

	.title {
		padding-top: 10rpx;
		padding-bottom: 30rpx;
	}

	.shoplistNav .xuan .list {
		padding: 0 44rpx;
	}

	.shoplistNav .xuan .tip {
		padding-bottom: 30rpx;
		width: 33%;
		float: left;
	}

	.shoplistNav .xuan .tip_active {
		color: #ff797c;
	}

	.shoplistNav .xuan .btns {
		text-align: center;
	}

	.shoplistNav .xuan .btns .ml10 {
		width: 200rpx;
	}

	.shopList {
		padding: 32rpx 24rpx 0 24rpx;
		background: #fff;
		font-size: 24rpx;
	}

	.shopList .top {
		display: flex;
	}

	.shopList .left_pic {
		width: 124rpx;
		height: 124rpx;
		border-radius: 8rpx;
		float: left;
		position: relative;
		background: #f8f8f8;
		overflow: hidden;
	}

	.shopList .left_pic image {
		max-width: 100%;
		max-height: 100%;
	}

	.shopList .left_pic .blacktip {
		width: 100%;
		height: 40rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
		background: #bbb;
		color: #fff;
	}

	.shopList .left_pic .doing {
		width: 100%;
		height: 40rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
		background: rgba(32, 173, 32, .6);
		color: #fff;
	}


	.shopList .left {
		width: 80%;
		flex: 1;
	}

	.shopList .list-text {
		margin-left: 144rpx;
	}

	.shopList .list-text .title {
		font-size: 28rpx;
		font-weight: bold;
		padding-bottom: 20rpx;
	}

	.shopList .list-text .pingfen {
		margin-left: 20rpx;
		color: #ff797c;
		margin-right: 20rpx;
	}

	.shopList .list-text .peisong {
		padding-top: 6px;
	}

	.shopList .right {
		text-align: right;
		flex-shrink: 0;
		margin-left: 10rpx;
	}

	.shopList .right .bg {
		padding: 6rpx 10rpx;
		background: #F74663;
		color: #fff;
		border-top-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
	}

	.shopList .right .time {
		color: #ff797c;
		padding-top: 12rpx;
	}

	.shopList .right .black9 {
		padding-top: 8rpx;
	}

	.shopList .activity {
		padding-top: 12rpx;
		padding-bottom: 20rpx;
		margin-top: 10rpx;
	}

	.shopList .activity .youhui {
		max-height: 80rpx;
		overflow: hidden;
		transition: all .3 linear;
		margin-left: 148rpx;
	}

	.shopList .activity .youhui_show {
		height: 100%;
	}

	.shopList .activity .youhui view {
		height: 40rpx;
		line-height: 40rpx;
	}

	.activity .youhui view {
		height: 40rpx;
		line-height: 40rpx;
	}

	.activity view {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.activity .ico image {
		width: 28rpx;
		height: 28rpx;
		margin-top: 6rpx;
		margin-right: 10rpx;
	}

	.page_cont_box {
		height: calc(100% - 86rpx);
	}

	.evlt_star_bg {
		width: 170rpx;
		height: 24rpx;
		position: relative;
		overflow: hidden;
		line-height: 0;
		display: inline-block;
	}

	.evlt_star_bg image.bg {
		width: 170rpx;
		height: 24rpx;
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
		width: 170rpx;
		height: 24rpx;
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



	.shopList.shoplistgray {
		opacity: .6
	}

	/*.shopList.shoplistgray{-webkit-filter: blur(1rpx);filter: blur(1rpx);background:#f8f8f8}
.shopList.shoplistgray image{-webkit-filter: grayscale(90%);-moz-filter: grayscale(90%);-ms-filter: grayscale(90%);-o-filter: grayscale(100%);filter: grayscale(90%);filter: #ccc;}
.shoplistgray .list-text{color:#ccc}
.shoplistgray .list-text .pingfen{color:#ccc}
.shoplistgray .right .time{color:#ccc}
.shoplistgray .right .bg,.shoplistgray .right .bg2{background:#ccc}*/


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

	/*样式修改*/
	.shoplistNav .xuan {
		padding: 0;
	}

	.shoplistNav .xuan .title {
		padding: 20rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
	}

	.shoplistNav .xuan .tip {
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
		padding: 0;
	}

	.shoplistNav .xuan .list {
		padding: 0 12rpx;
		overflow: hidden;
	}

	.shoplistNav .xuan .tip_active {
		background: #E8F6E8;
		color: #ff797c;
	}

	.shoplistNav .xuan .btns {
		position: relative;
		z-index: 1;
		height: 96rpx;
		background: #fff;
		text-align: center;
		overflow: hidden;
	}

	.shoplistNav .xuan .btns .btn {
		line-height: 96rpx;
		font-size: 32rpx;
		color: 333;
		width: 50%;
		float: left;
		border-top: 2rpx solid #eee;
	}

	.shoplistNav .xuan .btns .btn2 {
		border-top: 2rpx solid #ff797c;
		background: #ff797c;
		color: #fff;
	}

	@import "../../template/shopLists/shopLists.css";
	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwV01BMGNQJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0VBQ0U7QUFDRjtBQUNBO0lBQ0ksMEJBQTBCO0lBQzFCLGVBQWU7SUFDZixNQUFNO0lDUFYsa0JBQUE7SUFBQSxpREFBQTtJQUFBLDRDQUFBO0lBQUEsY0FBQTtJRFFJLFFBQVE7SUFDUixXQUFXO0lBQ1gsWUFBWTtBQUNoQjtBQUNBLFVBQVUsaUJBQWlCO0FBQzNCLFlBQVk7QUFDWixpQkFBaUI7QUFDakIsa0JBQWtCO0FBQ2xCLG1CQUFtQjtBQUNuQjtBQUNBLGVBQWUsY0FBYyxDQUFDO0FBQzlCLDhCQUE4QixZQUFZLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDOztBQUVsTixhQUFhLGVBQWUsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUNyQjFELGtCQUFBLENBQUEsaURBQUEsQ0FBQSw0Q0FBQSxDQUFBLGNBQUEsQ0RxQjRELFFBQVEsQ0FBQztBQUNyRTtJQUNJLGFBQWE7SUFDYixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxPQUFPO0lBQ1Asa0JBQWtCO0lBQ2xCLGdDQUFnQztBQUNwQztBQUNBO0lBQ0ksYUFBYTtBQUNqQjtBQUNBO0lBQ0ksZUFBZTtBQUNuQjtBQUNBO0lBQ0ksV0FBVztJQUNYLFFBQVE7SUFDUixTQUFTO0lBQ1QscUJBQXFCO0lBQ3JCLDZCQUE2QjtJQUM3QixzQkFBc0I7SUFDdEIsZ0JBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQixTQUFTO0FBQ2I7QUFDQSxlQUFlLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0I7QUFD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QUMsc0JBQXNCLENBQUM7QUFDbEYsdUJBQXVCLFlBQVksQ0FBQyxhQUFhOzs7O0FBSWpELHVCQUF1QixVQUFVO0FBQ2pDOzs7OztvRUFLb0U7OztBQUdwRSxVQUFVLFdBQVcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0M5T3pFLGtCQUFBLGlEQUFBLDRDQUFBLGNBQUEsQUQ4TzBFLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQzs7QUFFbEgsT0FBTztBQUNQLG1CQUFtQixVQUFVLENBQUM7QUFDOUIsMEJBQTBCLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7QUFDNUYsd0JBQXdCLFdBQVcsRUFBRSwyQkFBMkIsRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUM7QUFDL08seUJBQXlCLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0FBQzVELCtCQUErQixtQkFBbUIsQ0FBQyxjQUFjLENBQUM7QUFDbEUseUJBQXlCLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLENBQUM7QUFDOUgsOEJBQThCLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLDJCQUEyQixDQUFDO0FBQ3JJLCtCQUErQiw4QkFBOEIsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLENBQUM7O0FBRWhHLGdEQUFnRCIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLnNob3BsaXN0d3JhcHtcclxuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDQzcHgpXHJcbn1cclxuLm1hc2stYmd7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLC4zKTtcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuLm1vcmVsaXN0e3RleHQtYWxpZ246Y2VudGVyO1xyXG5oZWlnaHQ6ODBycHg7XHJcbmxpbmUtaGVpZ2h0OjgwcnB4O1xyXG5iYWNrZ3JvdW5kOiNmOGY4Zjg7XHJcbm1hcmdpbi1ib3R0b206MjBycHg7XHJcbn1cclxuLm1vcmVsaXN0IHRleHR7Y29sb3I6ICMwZjhmZDA7fVxyXG4uc2hvcExpc3QgLmxlZnRfcGljIC50b3RhbG51bXt3aWR0aDogNDBycHg7aGVpZ2h0OiAyMHJweDtjb2xvcjogI2ZmZjtmb250LXNpemU6IDI0cnB4O2xpbmUtaGVpZ2h0OiAyMHJweDtib3JkZXItcmFkaXVzOiAyMHJweDtiYWNrZ3JvdW5kOiAjZmYzMzAwO3Bvc2l0aW9uOiBhYnNvbHV0ZTtyaWdodDogLTEwcnB4O3RvcDogLTEwcnB4O3RleHQtYWxpZ246IGNlbnRlcjt9XHJcblxyXG4uc2hvcGxpc3ROYXZ7cG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxMDsgbGVmdDogMDsgdG9wOiAwOyByaWdodDogMDt9XHJcbi5zaG9wbGlzdE5hdiAubmF2e1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBmb250LXNpemU6IDMycnB4O1xyXG4gICAgcGFkZGluZzogMjRycHggMDtcclxuICAgIHotaW5kZXg6IDk5OTtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG4uc2hvcGxpc3ROYXYgLmxlaXtcclxuICAgIGZsZXg6IDE7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBib3JkZXItcmlnaHQ6IDJycHggc29saWQgI2U2ZTZlNjtcclxufVxyXG4uc2hvcGxpc3ROYXYgLmxlaV9hY3RpdmV7XHJcbiAgICBjb2xvcjojMjBBRDIwOyBcclxufVxyXG4uc2hvcGxpc3ROYXYgLmxlaTpsYXN0LWNoaWxke1xyXG4gICAgYm9yZGVyLXJpZ2h0OiAwO1xyXG59XHJcbi5zaG9wbGlzdE5hdiAubGVpOmFmdGVye1xyXG4gICAgY29udGVudDogJyc7XHJcbiAgICB3aWR0aDogMDtcclxuICAgIGhlaWdodDogMDtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIGJvcmRlcjogNHB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gICAgYm9yZGVyLXRvcC1jb2xvcjogIzk5OTtcclxuICAgIG1hcmdpbi1sZWZ0OiA1cHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDIwcHg7XHJcbn1cclxuLndldWktbG9hZG1vcmV7aGVpZ2h0OiA4MHJweDtsaW5lLWhlaWdodDogODBycHg7YmFja2dyb3VuZDogI2Y4ZjhmODt0ZXh0LWFsaWduOiBjZW50ZXJ9XHJcbi53ZXVpLWxvYWRtb3JlIGltYWdle3dpZHRoOiA0MHJweDtoZWlnaHQ6IDQwcnB4O21hcmdpbi1yaWdodDogMTBycHg7ZGlzcGxheTogaW5saW5lLWJsb2NrO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7fVxyXG4uc2hvcGxpc3ROYXYgLmxlaV9hY3RpdmU6YWZ0ZXJ7XHJcbiAgICBib3JkZXI6IDRweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICMyMEFEMjA7XHJcbiAgICB0b3A6IDE1cHg7XHJcbn1cclxuLnNob3BsaXN0TmF2IC5waW4sLnNob3BsaXN0TmF2IC5wYWksLnNob3BsaXN0TmF2IC54dWFue1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwtMTAwJSk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjNzO1xyXG59XHJcbi5zaG9wbGlzdE5hdiAucGluX2FjdGl2ZSwuc2hvcGxpc3ROYXYgLnBhaV9hY3RpdmUsLnNob3BsaXN0TmF2IC54dWFuX2FjdGl2ZXtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsMCk7XHJcbiAgICB6LWluZGV4OiA5OTg7XHJcbiAgICAvKnRyYW5zaXRpb246IGFsbCAuM3M7Ki9cclxufVxyXG4uc2hvcGxpc3ROYXYgLnBpbiAubGVmdHtcclxuICAgIHdpZHRoOiA0OCU7XHJcbiAgICAgb3ZlcmZsb3c6IGF1dG87LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xyXG4gICAgbWF4LWhlaWdodDogMTAwJTtcclxuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaFxyXG59XHJcbi5zaG9wbGlzdE5hdiAucGluIC5sZWZ0IC5sZWZ0X2FjdGl2ZXtcclxuICAgIGJvcmRlci1jb2xvcjojMjBBRDIwO1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjsgXHJcbiAgICBjb2xvcjogIzIwQUQyMDtcclxufVxyXG4uc2hvcGxpc3ROYXYgLnBpbiAubGVmdExpc3R7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZjRmNGY0O1xyXG4gICAgaGVpZ2h0OiAxMDBycHg7XHJcbiAgICBib3JkZXItbGVmdDogNHJweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICAgIHBhZGRpbmctbGVmdDogNDRycHg7XHJcbiAgICBsaW5lLWhlaWdodDogMTAwcnB4O1xyXG59XHJcbi5zaG9wbGlzdE5hdiAucGluIC5sZWZ0TGlzdCBpbWFnZXtcclxuICAgIHdpZHRoOiA4cnB4O1xyXG4gICAgaGVpZ2h0OiAxNnJweDtcclxuICAgIGZsb2F0OiByaWdodDtcclxuICAgIG1hcmdpbi1yaWdodDogMjRycHg7XHJcbiAgICBtYXJnaW4tdG9wOiA0MnJweDtcclxufVxyXG4uc2hvcGxpc3ROYXYgLnBpbntcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBtYXgtaGVpZ2h0OiA4MDBycHg7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxufVxyXG4uc2hvcGxpc3ROYXYgLnBpbiAucmlnaHR7XHJcbiAgICB3aWR0aDogNTIlO1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcclxuICAgIHBhZGRpbmctbGVmdDoyNHJweDtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IFxyXG59XHJcbi5zaG9wbGlzdE5hdiAucGluIHRleHR7XHJcbiAgICBjb2xvcjogIzk5OTtcclxufVxyXG5cclxuLnNob3BsaXN0TmF2IC5waW4gLnJpZ2h0IC5yaWdodF9hY3RpdmUsLnNob3BsaXN0TmF2IC5waW4gLnJpZ2h0IC5yaWdodF9hY3RpdmUgdGV4dCwuc2hvcGxpc3ROYXYgLnBpbiAgLmxlZnRfYWN0aXZlIHRleHR7XHJcbiAgICBjb2xvcjogIzIwQUQyMDtcclxufVxyXG4uc2hvcGxpc3ROYXYgLnBpbiAucmlnaHRMaXN0e1xyXG4gICAgaGVpZ2h0OiAxMDBycHg7XHJcbiAgICBsaW5lLWhlaWdodDogMTAwcnB4O1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG4uc2hvcGxpc3ROYXYgLnBpbiAucmlnaHRMaXN0IC5jaGVja3tcclxuICAgIHdpZHRoOiAzNnJweDtcclxuICAgIGhlaWdodDogMjZycHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogMjBycHg7XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIG1hcmdpbi10b3A6IC0xM3JweDtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuLnNob3BsaXN0TmF2IC5waW4gLnJpZ2h0TGlzdC5yaWdodF9hY3RpdmUgLmNoZWNre1xyXG4gICAgd2lkdGg6IDM2cnB4O1xyXG4gICAgaGVpZ2h0OiAyNnJweDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAyMHJweDtcclxuICAgIHRvcDogNTAlO1xyXG4gICAgbWFyZ2luLXRvcDogLTEzcnB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuLnNob3BsaXN0TmF2IC5waW4gLnJpZ2h0TGlzdDpsYXN0LWNoaWxke1xyXG4gICAgYm9yZGVyOjA7XHJcbn1cclxuLnNob3BsaXN0TmF2IC5waW4gLnJpZ2h0TGlzdCAuZnJ7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDI0cnB4O1xyXG59XHJcbi5zaG9wbGlzdE5hdiAucGFpIHtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY7XHJcbiAgICBwYWRkaW5nOiAwIDI0cnB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlXHJcbn1cclxuLnNob3BsaXN0TmF2IC5wYWkgaW1hZ2V7XHJcbiAgICB3aWR0aDogMzZycHg7XHJcbiAgICBoZWlnaHQ6IDI0cnB4O1xyXG4gICAgbWFyZ2luLXRvcDogMjRycHg7XHJcbn1cclxuLnNob3BsaXN0TmF2IC5wYWkgdGV4dHtcclxuICAgIGxpbmUtaGVpZ2h0OiAxMDBycHg7XHJcbn1cclxuLnNob3BsaXN0TmF2IC5wYWkgLnBhaV9hY3RpdmV7XHJcbiAgICBjb2xvcjojMjBBRDIwOyBcclxufVxyXG4uc2hvcGxpc3ROYXYgLnBhaSB2aWV3e1xyXG4gICAgaGVpZ2h0OiAxMDBycHg7XHJcbn1cclxuLnNob3BsaXN0TmF2IC54dWFue1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcclxuICAgIHBhZGRpbmc6IDMwcnB4IDMwcnB4IDUwcnB4O1xyXG59XHJcbi5zaG9wbGlzdE5hdiAueHVhbiBpbWFnZXtcclxuICAgIHdpZHRoOiAyNHJweDtcclxuICAgIGhlaWdodDogMjBycHg7XHJcbn1cclxuIC50aXRsZXtcclxuICAgIHBhZGRpbmctdG9wOiAxMHJweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiAzMHJweDtcclxufVxyXG4uc2hvcGxpc3ROYXYgLnh1YW4gLmxpc3R7XHJcbiAgICBwYWRkaW5nOiAwIDQ0cnB4O1xyXG59XHJcbi5zaG9wbGlzdE5hdiAueHVhbiAudGlwe1xyXG4gICAgcGFkZGluZy1ib3R0b206IDMwcnB4O1xyXG4gICAgd2lkdGg6MzMlO1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbn1cclxuLnNob3BsaXN0TmF2IC54dWFuIC50aXBfYWN0aXZle1xyXG4gICAgY29sb3I6IzIwQUQyMDsgXHJcbn1cclxuLnNob3BsaXN0TmF2IC54dWFuIC5idG5ze1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcbi5zaG9wbGlzdE5hdiAueHVhbiAuYnRucyAubWwxMHtcclxuICAgIHdpZHRoOiAyMDBycHg7XHJcbn1cclxuLnNob3BMaXN0e3BhZGRpbmc6IDMycnB4IDI0cnB4IDAgMjRycHg7YmFja2dyb3VuZDogI2ZmZjtmb250LXNpemU6IDI0cnB4O31cclxuLnNob3BMaXN0IC50b3B7ZGlzcGxheTogZmxleDt9XHJcbi5zaG9wTGlzdCAubGVmdF9waWN7d2lkdGg6IDEyNHJweDtoZWlnaHQ6IDEyNHJweDtib3JkZXItcmFkaXVzOjhycHg7ZmxvYXQ6IGxlZnQ7IHBvc2l0aW9uOiByZWxhdGl2ZTtiYWNrZ3JvdW5kOiAjZjhmOGY4OyBvdmVyZmxvdzogaGlkZGVuO31cclxuLnNob3BMaXN0IC5sZWZ0X3BpYyBpbWFnZXttYXgtd2lkdGg6IDEwMCU7bWF4LWhlaWdodDogMTAwJTt9XHJcbi5zaG9wTGlzdCAubGVmdF9waWMgLmJsYWNrdGlwe3dpZHRoOiAxMDAlO2hlaWdodDogNDBycHg7cG9zaXRpb246IGFic29sdXRlO2JvdHRvbTogMDtsZWZ0OjA7dGV4dC1hbGlnbjogY2VudGVyO2xpbmUtaGVpZ2h0OiA0MHJweDtmb250LXNpemU6IDI0cnB4O2JhY2tncm91bmQ6ICNiYmI7IGNvbG9yOiAjZmZmO31cclxuLnNob3BMaXN0IC5sZWZ0X3BpYyAuZG9pbmd7d2lkdGg6IDEwMCU7aGVpZ2h0OiA0MHJweDtwb3NpdGlvbjogYWJzb2x1dGU7Ym90dG9tOiAwO2xlZnQ6MDt0ZXh0LWFsaWduOiBjZW50ZXI7bGluZS1oZWlnaHQ6IDQwcnB4O2ZvbnQtc2l6ZTogMjRycHg7YmFja2dyb3VuZDpyZ2JhKDMyLDE3MywzMiwuNik7IGNvbG9yOiAjZmZmO31cclxuXHJcblxyXG4uc2hvcExpc3QgLmxlZnR7d2lkdGg6IDgwJTtmbGV4OiAxO31cclxuLnNob3BMaXN0IC5saXN0LXRleHR7bWFyZ2luLWxlZnQ6IDE0NHJweDt9XHJcbi5zaG9wTGlzdCAubGlzdC10ZXh0IC50aXRsZXtmb250LXNpemU6IDI4cnB4O2ZvbnQtd2VpZ2h0OiBib2xkO3BhZGRpbmctYm90dG9tOiAyMHJweDt9XHJcbi5zaG9wTGlzdCAubGlzdC10ZXh0IC5waW5nZmVue21hcmdpbi1sZWZ0OiAyMHJweDtjb2xvcjogI2ZmNjYwMDttYXJnaW4tcmlnaHQ6IDIwcnB4O31cclxuLnNob3BMaXN0IC5saXN0LXRleHQgLnBlaXNvbmd7cGFkZGluZy10b3A6IDZweDt9XHJcbi5zaG9wTGlzdCAucmlnaHR7dGV4dC1hbGlnbjogcmlnaHQ7ZmxleC1zaHJpbms6IDA7bWFyZ2luLWxlZnQ6IDEwcnB4O31cclxuLnNob3BMaXN0IC5yaWdodCAuYmd7cGFkZGluZzogNnJweCAxMHJweDtiYWNrZ3JvdW5kOiAjRjc0NjYzO2NvbG9yOiAjZmZmO2JvcmRlci10b3AtbGVmdC1yYWRpdXM6IDE2cnB4O2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxNnJweDt9XHJcbi5zaG9wTGlzdCAucmlnaHQgLnRpbWV7Y29sb3I6ICNmZjY2MDA7cGFkZGluZy10b3A6IDEycnB4O31cclxuLnNob3BMaXN0IC5yaWdodCAuYmxhY2s5e3BhZGRpbmctdG9wOiA4cnB4O31cclxuLnNob3BMaXN0IC5hY3Rpdml0eXtwYWRkaW5nLXRvcDogMTJycHg7cGFkZGluZy1ib3R0b206IDIwcnB4O21hcmdpbi10b3A6IDEwcnB4O31cclxuLnNob3BMaXN0IC5hY3Rpdml0eSAueW91aHVpe21heC1oZWlnaHQ6IDgwcnB4O292ZXJmbG93OiBoaWRkZW47dHJhbnNpdGlvbjogYWxsIC4zIGxpbmVhcjttYXJnaW4tbGVmdDogMTQ4cnB4O31cclxuLnNob3BMaXN0IC5hY3Rpdml0eSAueW91aHVpX3Nob3d7aGVpZ2h0OiAxMDAlO31cclxuLnNob3BMaXN0IC5hY3Rpdml0eSAueW91aHVpIHZpZXd7aGVpZ2h0OiA0MHJweDtsaW5lLWhlaWdodDogNDBycHg7fVxyXG4uYWN0aXZpdHkgLnlvdWh1aSB2aWV3IHtoZWlnaHQ6IDQwcnB4O2xpbmUtaGVpZ2h0OiA0MHJweDt9XHJcbi5hY3Rpdml0eSB2aWV3e3doaXRlLXNwYWNlOiBub3dyYXA7b3ZlcmZsb3c6IGhpZGRlbjt0ZXh0LW92ZXJmbG93OiBlbGxpcHNpczt9XHJcbi5hY3Rpdml0eSAuaWNvIGltYWdle3dpZHRoOiAyOHJweDtoZWlnaHQ6IDI4cnB4O21hcmdpbi10b3A6IDZycHg7IG1hcmdpbi1yaWdodDogMTBycHg7fVxyXG4ucGFnZV9jb250X2JveHsgaGVpZ2h0OiBjYWxjKDEwMCUgLSA4NnJweCk7fVxyXG5cclxuLmV2bHRfc3Rhcl9iZ3t3aWR0aDogMTcwcnB4OyBoZWlnaHQ6IDI0cnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7IG92ZXJmbG93OiBoaWRkZW47IGxpbmUtaGVpZ2h0OiAwOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxyXG4uZXZsdF9zdGFyX2JnIGltYWdlLmJne3dpZHRoOiAxNzBycHg7IGhlaWdodDogMjRycHg7fVxyXG4uZXZsdF9zdGFyX2Jhcntwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgaGVpZ2h0OiAxMDAlOyBsaW5lLWhlaWdodDogMDsgb3ZlcmZsb3c6IGhpZGRlbjsgZGlzcGxheTogaW5saW5lLWJsb2NrO31cclxuLmV2bHRfc3Rhcl9iZyBpbWFnZXt3aWR0aDogMTcwcnB4OyBoZWlnaHQ6IDI0cnB4O31cclxuXHJcbi5ub25lLWNvbnR7Y29sb3I6IzY2Njt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nLXRvcDoxODZycHg7Ym94LXNpemluZzogYm9yZGVyLWJveDt9XHJcbi5ub25lLWNvbnQgLm1haW4gaW1hZ2V7d2lkdGg6MjAwcnB4O2hlaWdodDoyMDBycHh9XHJcblxyXG5cclxuXHJcbi5zaG9wTGlzdC5zaG9wbGlzdGdyYXl7b3BhY2l0eTouNn1cclxuLyouc2hvcExpc3Quc2hvcGxpc3RncmF5ey13ZWJraXQtZmlsdGVyOiBibHVyKDFycHgpO2ZpbHRlcjogYmx1cigxcnB4KTtiYWNrZ3JvdW5kOiNmOGY4Zjh9XHJcbi5zaG9wTGlzdC5zaG9wbGlzdGdyYXkgaW1hZ2V7LXdlYmtpdC1maWx0ZXI6IGdyYXlzY2FsZSg5MCUpOy1tb3otZmlsdGVyOiBncmF5c2NhbGUoOTAlKTstbXMtZmlsdGVyOiBncmF5c2NhbGUoOTAlKTstby1maWx0ZXI6IGdyYXlzY2FsZSgxMDAlKTtmaWx0ZXI6IGdyYXlzY2FsZSg5MCUpO2ZpbHRlcjogI2NjYzt9XHJcbi5zaG9wbGlzdGdyYXkgLmxpc3QtdGV4dHtjb2xvcjojY2NjfVxyXG4uc2hvcGxpc3RncmF5IC5saXN0LXRleHQgLnBpbmdmZW57Y29sb3I6I2NjY31cclxuLnNob3BsaXN0Z3JheSAucmlnaHQgLnRpbWV7Y29sb3I6I2NjY31cclxuLnNob3BsaXN0Z3JheSAucmlnaHQgLmJnLC5zaG9wbGlzdGdyYXkgLnJpZ2h0IC5iZzJ7YmFja2dyb3VuZDojY2NjfSovXHJcblxyXG5cclxuLmJhaS1jb250e3dpZHRoOiAxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQ6ICNmZmY7cG9zaXRpb246IGZpeGVkO3RvcDogMDtib3R0b206IDA7bGVmdDogMDtyaWdodDogMDt6LWluZGV4OiA5OTk7fVxyXG5cclxuLyrmoLflvI/kv67mlLkqL1xyXG4uc2hvcGxpc3ROYXYgLnh1YW57cGFkZGluZzogMDt9XHJcbi5zaG9wbGlzdE5hdiAueHVhbiAudGl0bGV7cGFkZGluZzogMjBycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgZm9udC1zaXplOiAyOHJweDsgY29sb3I6ICM5OTk7fVxyXG4uc2hvcGxpc3ROYXYgLnh1YW4gLnRpcHtmbG9hdDogbGVmdDsgd2lkdGg6IGNhbGMoMzMuMzMlIC0gMTZycHgpOyBtYXJnaW46IDhycHggOHJweDsgYmFja2dyb3VuZDojZjhmOGY4OyBib3JkZXItcmFkaXVzOiA4cnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGhlaWdodDogODBycHg7IGxpbmUtaGVpZ2h0OiA4MHJweDsgZm9udC1zaXplOiAyOHJweDsgY29sb3I6ICM2NjY7IGRpc3BsYXk6IGJsb2NrOyBwYWRkaW5nOiAwO31cclxuLnNob3BsaXN0TmF2IC54dWFuIC5saXN0e3BhZGRpbmc6IDAgMTJycHg7IG92ZXJmbG93OiBoaWRkZW47fVxyXG4uc2hvcGxpc3ROYXYgLnh1YW4gLnRpcF9hY3RpdmV7YmFja2dyb3VuZDogI0U4RjZFODtjb2xvcjogIzIwQUQyMDt9XHJcbi5zaG9wbGlzdE5hdiAueHVhbiAuYnRuc3twb3NpdGlvbjpyZWxhdGl2ZTsgei1pbmRleDogMTsgaGVpZ2h0OiA5NnJweDsgYmFja2dyb3VuZDogI2ZmZjsgdGV4dC1hbGlnbjogY2VudGVyOyBvdmVyZmxvdzogaGlkZGVuO31cclxuLnNob3BsaXN0TmF2IC54dWFuIC5idG5zIC5idG57bGluZS1oZWlnaHQ6IDk2cnB4OyBmb250LXNpemU6IDMycnB4OyBjb2xvcjogMzMzOyB3aWR0aDogNTAlOyBmbG9hdDogbGVmdDsgYm9yZGVyLXRvcDogMnJweCBzb2xpZCAjZWVlO31cclxuLnNob3BsaXN0TmF2IC54dWFuIC5idG5zIC5idG4ye2JvcmRlci10b3A6IDJycHggc29saWQgIzIwQUQyMDsgYmFja2dyb3VuZDogIzIwQUQyMDsgY29sb3I6ICNmZmY7fVxyXG5cclxuQGltcG9ydCBcIi4uLy4uL3RlbXBsYXRlL3Nob3BMaXN0cy9zaG9wTGlzdHMuY3NzXCI7IixudWxsXX0= */
</style>