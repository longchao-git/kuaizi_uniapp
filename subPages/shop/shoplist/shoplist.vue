<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<!--提示框引入-开始：使用全局 Toast 组件-->
				<Toast :showToast="showToast" />
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
										<text>{{item.tips_label}}</text>
									</view>
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
												{{item.juli_label}}
											</view>
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
														<span class='del'>€{{item.reduceEd_freight}}</span>
													</block>
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
													{{li.title}}
												</view>
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
						<NoData :show="lists.length == 0" />
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
	var common = require("../../../js/ecart.js");
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

			this.whitebg = false;
			var cateid, title;
			var lefttap = this.lefttap;
			var navtab = this.navtab;
			cateid = options.cateid || 0;
			console.log('cate_id', cateid);
			lefttap = options.cateid;
			title = options.title;
			navtab[0] = title || '全部分类';
			this.leftTap = lefttap
			this.navtab = navtab;
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
						};
						that.lists = res.data.items
						that.whitebg = true;

						if (res.data.items.length < 10 && res.data.items.length !== 0) {
							that.loadhide = true
							that.morehidden = true;
						} else if (res.data.items.length == 0) {
							that.nonehidden = false;
							that.loadhide = true
							that.morehidden = true;
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
					this.whitebg = true;
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
			this.lists = this.lists; //请求模块化

			var that = this;
			app.globalData.home({}, function(res) {
				// console.log(res);
				if (res.error == '0') {
					for (var i = 0; i < res.data.theme.length; i++) {
						if (res.data.theme[i].module == "module9") {
							that.hdType = res.data.theme[i].type;
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
				path: '/pages/index/index',
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

				this.currentTab = id
				this.hidden1 = hidden1
			},
			//请求商品分类数据；
			getFilter: function() {
				var that = this;
				app.globalData.shopListsCates({}, function(res) {
					console.log("商家分类", res);

					if (res.error == '0') {
						var shop_cate = res.data.items;
						that.leftList = shop_cate;
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
					that.page = 1;
					params.page = 1;
					params.cate_id = cate_id;
					app.globalData.shopLists(params, function(res) {
						if (res.error == '0') {
							that.hidden1 = true
							that.currentTab = 'q'
							that.rightTap = 'q'
							that.scrolltop = 0

							if (res.data.items) {
								that.lists = res.data.items;

								if (res.data.items.length == 10) {
									that.loadhide = false
									that.morehidden = true
									that.nonehidden = true
								} else if (res.data.items.length == 0) {
									that.nonehidden = false
									that.loadhide = true
									that.morehidden = true
								} else {
									that.loadhide = true
									that.morehidden = true
									that.nonehidden = true;
								}
							}
						} else {
							uni.showToast({
								title: res.message
							});
						}

						;
					});
				};
				that.leftTap = cate_id
				that.navtab = navtab
			},
			//筛选分类商品右侧；
			righttap: function(e) {
				uni.showLoading({
					title: '加载中...'
				}); //先定义一个变量存储自己

				var that = this;
				var parentid = e.currentTarget.dataset.parentid;
				that.page = 1;
				params.cate_id = parentid;
				params.page = 1; //数据筛选

				app.globalData.shopLists(params, function(res) {
					if (res.error == '0') {
						that.scrolltop = 0
						that.rightTap = e.currentTarget.dataset.id
						that.hidden1 = true
						that.currentTab = 'q'
						that.nonehidden = true
						uni.hideLoading();

						if (res.data.items) {
							that.lists = res.data.items;

							if (res.data.items.length == 0 || res.data.items.length < 10) {
								that.loadhide = true
								that.morehidden = true
								that.nonehidden = false
							};
						};
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
								that.loadhide = true;
							}

							that.lists = res.data.items;
						}

						that.paixuOn = e.currentTarget.dataset.id
						that.hidden1 = true
						that.currentTab = 'q'
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				that.navtab = navtab
				that.page = 1
				that.scrolltop = 0
			},
			//筛选分类商品筛选；
			peisong: function(e) {
				var that = this;
				var peisong = e.currentTarget.dataset.peisong;
				var index = e.currentTarget.dataset.id;
				var xuanTap1 = that.xuanTap1;

				if (xuanTap1 != index) {
					params.pei_filter = peisong;
					that.xuanTap1 = index;
				} else {
					params.pei_filter = '';
					that.xuanTap1 = '-1';
				}
			},
			youhui: function(e) {
				var that = this;
				var youhui = e.currentTarget.dataset.youhui;
				var index = e.currentTarget.dataset.id;
				var xuanTap2 = that.xuanTap2;

				if (xuanTap2 != index) {
					params.youhui_filter = youhui;
					that.xuanTap2 = index;
				} else {
					params.youhui_filter = '';
					that.xuanTap2 = '-1';
				}
			},
			character: function(e) {
				var that = this;
				var character = e.currentTarget.dataset.character;
				var index = e.currentTarget.dataset.id;
				var xuanTap3 = that.xuanTap3;

				if (xuanTap3 != index) {
					params.feature_filter = character;
					that.xuanTap3 = index;
				} else {
					params.feature_filter = '';
					that.xuanTap3 = '-1';
				}
			},
			confirm: function(e) {
				var that = this;
				that.page = 1;
				params.page = 1; //重新赋值，解决下拉加载时的全局page值导致的筛选没数据的问题
				//数据筛选      
				// console.log(params); 

				app.globalData.shopLists(params, function(res) {
					if (res.error == '0') {
						if (res.data.items) {
							if (res.data.items.length < 10) {
								that.loadhide = true;
							}

							that.lists = res.data.items;
						}

						that.scrolltop = 0
						that.hidden1 = true
						that.currentTab = 'q';
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			empty: function(e) {
				var that = this;
				that.page = 1;
				params.pei_filter = '';
				params.youhui_filter = '';
				params.feature_filter = '';
				params.page = 1; //重新赋值，解决下拉加载时的全局page值导致的筛选没数据的问题
				//数据筛选       

				app.globalData.shopLists(params, function(res) {
					if (res.error == '0') {
						that.hidden1 = true
						that.currentTab = 'q'
						that.xuanTap1 = 'q'
						that.xuanTap2 = 'q'
						that.xuanTap3 = 'q'

						if (res.data.items) {
							that.lists = res.data.items;
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			masktap: function(e) {
				this.currentTab = 'q'
				this.hidden1 = true;
			},
			//去商家详情页；
			gotoDetail: function(e) {
				var id = e.currentTarget.id;
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
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
									that.morehidden = false
									that.loadhide = true;
								} else {
									that.lists = that.lists.concat(res.data.items)
									that.page = page
									that.loadhide = false
									that.morehidden = true
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
					this.hdShow = null;
				} else {
					this.hdShow = hdShow;
				}

				;
			},

			tosearch: function() {
				app.globalData.topage('/pages/indexSearch/search');
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
</style>