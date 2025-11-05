<template>
	<view>
		<!--提示框引入-开始-->
		<!--<import src="../components/showToast.wxml"></import>-->
		<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
			<block v-if="showToast.isShow? showToast.isShow: false">
				<!-- <view class="toast-bg" wx:if="{{showToast.mask==false? false : true}}"></view>   -->
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
		<view class="ser_box_box">
			<view class="ser_box">
				<image src="/static/image/quan_sou.png" class="ico"></image>
				<input placeholder="搜索店内商品" :value='keyword' placeholder-style="color:#999" @input="keywordSearch">
			</view>
			<button type="primary" hover-class="none" @tap="sbmt"> 搜索</button>
		</view>
		<!--列表-开始-->
		<view class="goodsListBox" :style="'padding-bottom:' + (have_must ? '164rpx' : '100rpx') + ';'">
			<view v-for="(proList, index) in products" :key="index" class="goodsList">
				<image :src="proList.photo" class="img fl"></image>
				<view class="wz_box">
					<view class="tit overflow_clear">{{proList.title}}</view>
					<view class="discount" v-if="proList.is_discount == '1'">
						<view class="fl zhe">
							<text class="one">{{proList.disclabel}}</text>
							<text class="two">{{proList.quotalabel}}</text>
						</view>
						<view class="fl shu">剩余{{proList.quota}}份</view>
					</view>
					<!-- 已售{{proList.sales}} /  -->
					<view class="txt">库存{{proList.sale_sku}}</view>
					<view class="price"><text>€</text>{{proList.price}}<text>/{{proList.unit}}</text> <text
							class="del ml5"
							v-if="proList.is_discount == '1'">{{proList.oldprice}}/{{proList.unit}}</text></view>
				</view>
				<!--加减框开始-->
				<view class="goods_int_box" v-if="proList.specs.length == 0 && proList.specification.length == 0">
					<image src="/static/image/btn-num_subtraction3x.png" class="jian" v-if="proList.num != 0"
						@tap="reduceCart" :data-sku_id="proList.sku_id" :data-sku_obj="proList"></image>
					<view class="num" v-if="proList.num != 0">{{proList.num}}</view>
					<image src="/static/image/btn-num_addCart3x.png" class="jia" @tap="addCart"
						:data-sku_id="proList.sku_id" :data-sku_obj="proList"></image>
					<view class="clear"></view>
				</view>
				<!--加减框结束-->
				<!--选规格-开始-->
				<view class="spec" @tap="setspecShow" :data-product_id="proList.product_id" :data-products="proList"
					v-else>可选规格</view>
				<view class="specMask" :hidden="specShow_idx == proList.product_id ? false : true">
					<image src="/static/image/index_btn_close2x.png" class="close" @tap="setspecShow"></image>
					<view class="tit">{{proList.title}}</view>
					<view class="discount" v-if="proList.is_discount == '1'">
						<view class="fl zhe">
							<text class="one">{{proList.disclabel}}</text>
							<text class="two">{{proList.quotalabel}}</text>
						</view>
						<view class="fl shu">剩余{{proList.quota}}份</view>
					</view>
					<view class="cont">
						<view class="spec_bt" v-if="proList.specs.length > 0">规格</view>
						<view class="spec_list">
							<view v-for="(item, specs_idx) in proList.specs" :key="specs_idx"
								:class="'list ' + (specsIdx == specs_idx ? 'on' : '')" @tap="specsOpt"
								:data-specs_idx="specs_idx" :data-products="proList">{{item.spec_name}}</view>
						</view>
						<view class="attr" v-if="proList.specification.length > 0">
							<block v-for="(item, specification_idx) in proList.specification" :key="specification_idx">
								<view class="bt">{{item.key}}</view>
								<view class="spec_list">
									<view v-for="(item, index) in item.val" :key="index"
										:class="'list ' + (index == specsK[specification_idx] ? 'on' : '')"
										@tap="setspecsK" :data-idx="index" :data-specification_idx="specification_idx"
										:data-products="proList">{{item}}</view>
								</view>
							</block>
						</view>
					</view>
					<view class="bottom">
						<view class="price fl"><text>€</text>
							<block v-if="proList.specs.length > 0">{{proList.specs[specsIdx].price}}</block>
							<block v-else>{{proList.price}}</block>
						</view>
						<!--加减框开始-->
						<view class="goods_int_box fr">
							<image src="/static/image/btn-num_subtraction3x.png" class="jian" v-if="newSpecs.num != 0"
								@tap="reduceCart" :data-sku_id="newSpecs.sku_id" :data-sku_obj="newSpecs"></image>
							<view class="num" v-if="newSpecs.num != 0">{{newSpecs.num}}</view>
							<image src="/static/image/btn-num_addCart3x.png" class="jia" @tap="addCart"
								:data-sku_id="newSpecs.sku_id" :data-sku_obj="newSpecs"></image>
							<view class="clear"></view>
						</view>
						<!--加减框结束-->
					</view>
				</view>
				<!--选规格-结束-->
			</view>
		</view>
		<!--列表-结束-->
		<!--购物车-开始-->
		<!-- <view class="goods_footer">
    <view class="cart fl" wx:if="{{total_num > 0}}" bindtap="cartShow">
        <image src="../../image/index_btn_cart3x.png">
            <view class="num">{{total_num}}</view>
        </image> 
    </view>
    <view class="cart fl" wx:else>
        <image src="../../image/index_btn_cart3x.png"></image> 
    </view>
    <view class="wz_box fl">
        <view class="price fontcl1"><span>€</span>{{total_price}}</view>
        <view class='black9'>配送费以订单为准</view>
    </view>
    <view class="btn btn2 fr" wx:if="{{priceDif != 0}}">还差{{priceDif}}起送</view>
    <view class="btn btn2 fr" wx:elif="{{have_must == false && is_must != '0'}}">请添加必点商品</view>
    <view class="btn fr" wx:elif="{{total_num > 0}}" bindtap='linkOrdersubmit'>去结算</view>
    <view class="btn btn2 fr" wx:else>去结算</view>
    <view class="clear"></view>
</view> -->
		<view class="goods_footer">
			<view class="cart fl" v-if="total_num > 0" @tap="setcartShow">
				<image src="/static/image/index_btn_cart3x.png">
					<view class="num">{{total_num}}</view>
				</image>
			</view>
			<view class="cart fl" v-else>
				<image src="/static/image/index_btn_cart3x.png"></image>
			</view>
			<view class="wz_box fl">
				<view class="price fontcl1">€{{totalPrice}}<span
						v-if="total_oldprice > 0 && total_oldprice > totalPrice">€{{total_oldprice}}</span></view>
				<view class="black9">配送费以订单为准</view>
			</view>
			<view class="btn btn2 fr" v-if="priceDif > 0">还差{{priceDif}}起送</view>
			<view class="btn btn2 fr" v-else-if="have_must == false && is_must != '0'" @tap="cateTap"
				data-cate_id="must">请添加必点商品</view>
			<view class="btn fr" v-else-if="total_num > 0" @tap="linkOrdersubmit">去结算</view>
			<view class="btn btn2 fr" v-else>去结算</view>
			<view class="clear"></view>
		</view>
		<view :class="'goods_cart ' + (cartShow ? 'show' : '')">
			<view class="tit_box">
				<view class="tit fl">购物车</view>
				<view class="fr clear_btn" @tap="emptyTap">
					<image src="/static/image/index_btn_delete3x.png" class="ico"></image>清空
				</view>
			</view>
			<view class="list_box">
				<view v-for="(item, index) in cartLists" :key="index" class="list">
					<!--加减框开始-->
					<view class="goods_int_box fr">
						<image src="/static/image/btn-num_subtraction3x.png" class="jian" @tap="reduceCart"
							:data-sku_id="item.sku_id" :data-sku_obj="item"></image>
						<view class="num">{{item.num}}</view>
						<image src="/static/image/btn-num_addCart3x.png" class="jia" @tap="addCart"
							:data-sku_id="item.sku_id" :data-sku_obj="item"></image>
					</view>
					<!--加减框结束-->
					<view class="price fr">€{{item.prices}}</view>
					<view class="bt">{{item.title}}</view>
					<view class="clear"></view>
				</view>
				<view class="list" v-if="package_price > 0">
					<view class="price fr">€{{package_price}}</view>
					<view class="bt">打包费</view>
					<view class="clear"></view>
				</view>
			</view>
		</view>
		<!--购物车-结束-->
		<!--凑一凑-开始-->
		<view :class="'goods_cart ' + (couShow ? 'show' : '')">
			<view class="tit_box">
				<view class="tit fl">凑一凑</view>
			</view>
			<view class="list_box">
				<view v-for="(item, index) in couLists" :key="index" class="list">
					<!--加减框开始-->
					<view class="goods_int_box fr">
						<image src="/static/image/btn-num_subtraction3x.png" class="jian" @tap="reduceCart"
							:data-sku_id="item.sku_id" :data-sku_obj="item"></image>
						<view class="num">{{item.num}}</view>
						<image src="/static/image/btn-num_addCart3x.png" class="jia" @tap="addCart"
							:data-sku_id="item.sku_id" :data-sku_obj="item"></image>
					</view>
					<!--加减框结束-->
					<view class="price fr">€{{item.price}}</view>
					<view class="bt">{{item.title}}</view>
					<view class="clear"></view>
				</view>
			</view>
		</view>
		<!--凑一凑-结束-->
		<!--自提浮动-开始-->
		<!-- <view class='zitiFixed' bindtap='linkOrdersubmit_ziti' wx:if="{{have_must == true}}">自提无须达到起送价 <text>去自提</text> <image src='../../image/icon-arrowR-orange2x.png'></image></view> -->
		<!--自提浮动-结束-->
		<!--自提浮动-开始-->
		<template v-if="have_must == true">
			<view class="zitiFixed">
				<image src="/static/image/Group103x.png" @tap="linkOrdersubmit_ziti"></image>
				<text>去自提</text>
			</view>
		</template>

		<!--自提浮动-结束-->
		<!--计算优惠浮动-开始-->
		<view class="countTipsFixed" v-if="couTips.length > 0">{{couTips}}<text @tap="tapCouShow"
				v-if="couPrice > 0">去凑单 ></text>
		</view>
		<!--计算优惠浮动-结束-->
		<view class="mask_bg" :hidden="cartShow || specShow  || couShow ? false : true"
			:style="'z-index:' + (specShow  ? 20 : 9) + ';'" @tap="hideMask"></view>
	</view>
</template>

<script>
	var app = getApp(),
		common = require("../../js/ecart.js");
	var ecart = null,
		shop_id,
		str_obj = {},
		str_name = '',
		shoptitle = "",
		min_amount,
		manjian = [],
		shopInfo,
		savepage = 1;

	export default {
		data() {
			return {
				keyword: '',
				products: [],
				specShow_idx: null,
				specShow: false,
				cartShow: false,
				cartLists: [],
				specsIdx: 0,
				specsK: [],
				newSpecs: {
					sku_id: "",
					num: 0
				},
				min_amount: 0,
				//起送价
				priceDif: 0,
				//差价
				total_price: 0,
				//总价
				total_oldprice: 0,
				//总的原价
				totalPrice: 0,
				//优惠后的总价
				useFirst: false,
				//是否首单优惠
				have_must: false,
				//购物车是否有必点商品；
				is_must: 0,
				//商家是否有必点商品
				is_ziti: false,
				page: 1,
				//凑一凑
				couTips: '',
				//底部优惠提示内容
				couShow: false,
				//是否弹出
				couPrice: false,
				//凑一凑价格
				couLists: [] //凑一凑商品列表
					,
				specs_idx: "",
				specification_idx: false,
				proList: {
					product_id: ""
				},
				total_num: "",
				package_price: "",
				goodsArr: "",
				manjian: "",
				firstAmount: "",
				first_share: "",
				shareShow: false,
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {
			console.log(e)
			// uni.setStorageSync('newshopinfo', that.topInfo);
			// uni.setStorageSync('newgoodsArr', that.goodsArr);
			shopInfo = uni.getStorageSync('newshopinfo');
			var goodsArr = uni.getStorageSync('newgoodsArr');
			shop_id = e.shop_id;
			shoptitle = e.shoptitle;
			min_amount = Number(e.min_amount);

			if (shopInfo.manjian && shopInfo.manjian.config) {
				manjian = shopInfo.manjian.config;
			}

			ecart = new common.ECart(shop_id);
			console.log("商家搜索", shopInfo); //购物车是否有必点商品；

			var that = this,
				have_must = that.have_must,
				must_arr = [];

			for (var k in ecart.shop_cart) {
				must_arr.push(ecart.shop_cart[k].is_must);
			}

			;

			if (shopInfo.have_must == "0" && ecart.total_count() > 0) {
				have_must = true;
			} else if (shopInfo.have_must != "0") {
				if (must_arr.indexOf("1") != -1) {
					have_must = true;
				} else {
					have_must = false;
				}

				;
			} else {
				have_must = false;
			}

			;
			that.setData({
				total_num: ecart.total_count(),
				total_price: ecart.total_price(),
				package_price: ecart.package_price(),
				cartLists: ecart.shop_cart,
				have_must: have_must,
				priceDif: that.setpriceDif(min_amount, ecart.total_price()),
				//计算是否达到起送价；
				goodsArr: goodsArr,
				total_oldprice: ecart.total_oldprice(),
				is_must: shopInfo.have_must,
				manjian: shopInfo.manjian ? shopInfo.manjian.config : [],
				firstAmount: shopInfo.first_youhui,
				first_share: shopInfo.support.first_share //首单是否共享

			});
			setTimeout(function() {
				that.resetData();
			}, 200);
		},
		//下拉加载更多；
		onReachBottom: function() {
			var that = this,
				keyword = that.keyword,
				sku_id,
				pro_num,
				page = that.page;
			app.globalData.shopDetailSearch({
				page: page,
				'keyword': keyword,
				'shop_id': shop_id
			}, function(res) {
				if (res.error == '0') {
					var products = res.data.items;
					uni.hideLoading();

					if (products.length > 0) {
						for (var j = 0; j < products.length; j++) {
							//定义商品规格及sku_id；
							if (products[j].specs.length > 0) {
								for (var h = 0; h < products[j].specs.length; h++) {
									sku_id = products[j].product_id + "_" + products[j].specs[h].spec_id;
									products[j].specs[h].sku_id = sku_id;
									products[j].specs[h].title = products[j].title + '(' + products[j].specs[h]
										.spec_name + ')';
									products[j].specs[h].is_must = products[j].is_must;

									if (ecart.sku_count(products[j].product_id) > products[j].specs[h]
										.sale_sku) {
										uni.showToast({
											title: '库存发生变化'
										}); // ecart.clear();
									}

									;
								}

								;
								products[j].num = ecart.sku_count(products[j].product_id);
							} else if (products[j].specification.length > 0) {
								sku_id = products[j].product_id + "_0";
								products[j].sku_id = sku_id;
								products[j].num = ecart.sku_count(products[j].product_id);
							} else {
								sku_id = products[j].product_id + "_0";
								products[j].sku_id = sku_id;

								if (ecart.shop_cart[sku_id]) {
									if (ecart.shop_cart[sku_id].num > products[j].sale_sku) {
										uni.showToast({
											title: '库存发生变化'
										}); // ecart.clear();
									} else {
										pro_num = ecart.shop_cart[sku_id].num;
										products[j].num = pro_num;
									}

									;
								} else {
									products[j].num = 0;
								}

								;
							}

							;
						}

						;

						if (page > 1) {
							that.setData({
								products: that.products.concat(products),
								page: page + 1
							});
						} else {
							that.setData({
								page: page + 1
							});
						}

						;
					} else {
						uni.showToast({
							title: "没有更多了"
						});
					}

					;
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},
		onShareAppMessage: function() {
			return {
				title: '微信小程序外卖',
				path: '/pages/index/index',
				success: function(res) {},
				fail: function(res) {}
			};
		},
		methods: {
			//关键字搜索；
			keywordSearch: function(e) {
				this.keyword = e.detail.value;
			},
			sbmt: function(e) {
				var that = this,
					keyword = that.keyword,
					sku_id,
					pro_num;
				app.globalData.shopDetailSearch({
					page: 1,
					'keyword': keyword,
					'shop_id': shop_id
				}, function(res) {
					if (res.error == '0') {
						console.log(res);
						var products = res.data.items;

						if (products.length > 0) {
							for (let j = 0; j < products.length; j++) {
								//定义商品规格及sku_id；
								if (products[j].specs.length > 0) {
									for (var h = 0; h < products[j].specs.length; h++) {
										sku_id = products[j].product_id + "_" + products[j].specs[h].spec_id;
										products[j].specs[h].sku_id = sku_id;
										products[j].specs[h].title = products[j].title + '(' + products[j]
											.specs[h].spec_name + ')';
										products[j].specs[h].is_must = products[j].is_must;

										if (ecart.sku_count(products[j].product_id) > products[j].specs[h]
											.sale_sku) {
											uni.showToast({
												title: '库存发生变化'
											}); // ecart.clear();
										}

										;
									}

									;
									products[j].num = ecart.sku_count(products[j].product_id);
								} else if (products[j].specification.length > 0) {
									sku_id = products[j].product_id + "_0";
									products[j].sku_id = sku_id;
									products[j].num = ecart.sku_count(products[j].product_id);
								} else {
									sku_id = products[j].product_id + "_0";
									products[j].sku_id = sku_id;
									console.log(ecart);

									if (ecart && ecart.shop_cart[sku_id]) {
										if (ecart.shop_cart[sku_id].num > products[j].sale_sku) {
											uni.showToast({
												title: '库存发生变化'
											}); // ecart.clear();
										} else {
											pro_num = ecart.shop_cart[sku_id].num;
											products[j].num = pro_num;
										}

										;
									} else {
										products[j].num = 0;
									}

									;
								}

								;
							}

							;
						}

						;
						that.setData({
							products: products,
							page: 1
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},

			//凑一凑
			tapCouShow() {
				var that = this,
					couPrice = that.couPrice,
					couLists = [],
					goodsArr = that.goodsArr,
					arr = [];

				for (var i in goodsArr) {
					//过滤重复、有规格属性商品
					if (!isNaN(parseInt(goodsArr[i].cate_id))) {
						for (var k in goodsArr[i].products) {
							if (!(goodsArr[i].products[k].specs.length > 0 || goodsArr[i].products[k].specification
									.length > 0) && goodsArr[i].products[k].sale_sku > 0) {
								arr.push(goodsArr[i].products[k]);
							}

							;
						}

						;
					}

					;
				}

				;

				for (var j in arr) {
					//取价格范围内商品
					if (Number(arr[j].price) <= couPrice) {
						couLists.push(arr[j]);
					}

					;
				}

				;
				that.setData({
					couLists: couLists
				}); // console.log(couLists);

				if (couLists.length > 0) {
					that.setData({
						couShow: true,
						cartShow: false
					});
				} else {
					uni.showToast({
						title: "暂无满足要求的凑单商品"
					});
				}

				;
			},

			//凑一凑数据渲染
			resetDataCou() {
				var that = this,
					couLists = that.couLists,
					goodsArr = that.goodsArr;

				for (var i in goodsArr) {
					for (var k in goodsArr[i].products) {
						if (!(goodsArr[i].products[k].specs.length > 0 || goodsArr[i].products[k].specification.length >
								0) && goodsArr[i].products[k].sale_sku > 0) {
							for (var j in couLists) {
								if (couLists[j].sku_id == goodsArr[i].products[k].sku_id) {
									if (ecart.shop_cart[goodsArr[i].products[k].sku_id]) {
										couLists[j].num = ecart.shop_cart[goodsArr[i].products[k].sku_id].num;
									} else {
										couLists[j].num = 0;
									}

									;
								}

								;
							}

							;
						}

						;
					}

					;
				}

				;
				that.setData({
					couLists: couLists
				});
			},

			//4.3计算满减 起送价信息
			manjianCalculate(useMj, totalOldPrice, totalPrice) {
				if (typeof useMj == 'undefined') {
					//默认使用满减活动
					useMj = 1;
				}

				totalPrice = parseFloat(totalPrice || 0);
				var differencePrice = Math.max(0, parseFloat(totalOldPrice - totalPrice)).toFixed(2);
				var manjian = '';

				if (shopInfo.manjian && shopInfo.manjian.config) {
					manjian = shopInfo.manjian.config;
				}

				var productLen = Object.keys(ecart.shop_cart).length;
				var song = parseFloat(min_amount);
				var html = '';

				if (productLen == 0) {
					//没有选择任何商品
					// console.log("执行0");
					if (useMj && typeof manjian == 'object' && manjian.length > 0) {
						for (var k in manjian) {
							if (k != 0) {
								html += ',';
							}

							;
							html += '满' + manjian[k].order_amount + '€减' + manjian[k].coupon_amount;
						}

						;
					}

					;
					this.setData({
						couPrice: 0
					});
				} else if (song > 0 && totalOldPrice >= 0 && song > totalOldPrice) {
					// console.log("执行1", totalOldPrice);
					html = '还差' + (song - totalOldPrice).toFixed(2) + '€起送,';
					this.setData({
						couPrice: (song - totalOldPrice).toFixed(2)
					});
				} else if (!useMj && differencePrice > 0) {
					// console.log("执行2");
					html = '已减' + differencePrice;
					this.setData({
						couPrice: 0
					});
				} else if (useMj > 0 && typeof manjian == 'object' && manjian.length > 0) {
					var nowMj = {};
					var nextMj = {};

					for (var k in manjian) {
						if (totalOldPrice >= manjian[k].order_amount) {
							if (Object.keys(nowMj).length == 0) {
								nowMj = manjian[k];
							} else if (manjian[k].order_amount >= nowMj.order_amount) {
								nowMj = manjian[k];
							}
						} else {
							if (Object.keys(nextMj).length == 0) {
								nextMj = manjian[k];
							} else if (manjian[k].order_amount < nextMj.order_amount) {
								nextMj = manjian[k];
							}
						}

						;
					}

					;

					if (Object.keys(nowMj).length > 0 && Object.keys(nextMj).length > 0) {
						html = '已减' + nowMj.coupon_amount + '€, 再买' + (nextMj.order_amount - totalOldPrice).toFixed(2) +
							'€减' + nextMj.coupon_amount + '€,';
						this.setData({
							couPrice: (nextMj.order_amount - totalOldPrice).toFixed(2)
						});
					} else if (Object.keys(nowMj).length > 0 && Object.keys(nextMj).length == 0) {
						html = '已减' + nowMj.coupon_amount;
						this.setData({
							couPrice: 0
						});
					} else if (Object.keys(nowMj).length == 0 && Object.keys(nextMj).length > 0) {
						html = '满' + nextMj.order_amount + '€减' + nextMj.coupon_amount + ', 还差' + (nextMj.order_amount -
							totalOldPrice).toFixed(2) + '€';
						this.setData({
							couPrice: (nextMj.order_amount - totalOldPrice).toFixed(2)
						});
					}

					; // console.log("执行3", html);
				}

				;
				this.setData({
					couTips: html
				});
			},

			//4.2获取最近的满减金额
			getAmount() {
				var that = this;
				var cartCount = ecart.total_count(); //商家购物车商品数量

				var total_price = parseFloat(that.total_price); //商品减去折扣后的总价(购物车金额)；

				var useFirst = 1,
					useMj = 1,
					useDisc = 1; //默认享受首单,满减,折扣

				if (cartCount > 0) {
					//购物车有商品
					var first_share = parseInt(that.first_share); //首单是否共享

					var firstAmount = parseFloat(that.firstAmount); //首单优惠金额

					var difAmount = parseFloat(that.total_oldprice) - parseFloat(that.total_price); //商品折扣优惠金额

					var total_oldprice = parseFloat(that.total_oldprice); //没有折扣的商品总价

					var mjAmount = that.getMjAmount(total_oldprice);
					var isHasDiscount = ecart.isHasDiscount();

					if (firstAmount <= 0) {
						useFirst = 0;
					}

					if (isHasDiscount) {
						useMj = 0;
						useDisc = 1;
					}

					if (firstAmount > 0 && first_share == 0) {
						if (useMj == 1) {
							if (firstAmount >= mjAmount) {
								useMj = 0;
							} else {
								useFirst = 0;
							}
						}
					}

					;
					total_price = total_oldprice; // if (useFirst == 1) {
					//     total_price -= parseFloat(firstAmount);
					// }

					if (useDisc == 1) {
						total_price -= parseFloat(difAmount);
					}

					if (useMj == 1) {
						total_price -= parseFloat(mjAmount);
					}

					;
					that.manjianCalculate(useMj, total_oldprice, total_price); //4.3满减 起送 展示 

					total_price = Math.max(0.01, total_price);
				} else {
					that.manjianCalculate();
				}

				;
				that.useFirst = useFirst == 1 ? true : false;
				that.setData({
					totalPrice: total_price.toFixed(2)
				});
			},

			getMjAmount(total_price) {
				var manjian = '';

				if (shopInfo.manjian && shopInfo.manjian.config) {
					manjian = shopInfo.manjian.config;
				}

				var mjAmount = 0;
				var min = 0;

				if (manjian.length > 0) {
					manjian.forEach(function(item, index) {
						var cha = parseFloat(total_price) - parseFloat(item.order_amount);

						if (mjAmount == 0 && item.order_amount <= total_price) {
							min = cha;
							mjAmount = parseFloat(item.coupon_amount);
						} else if (item.order_amount <= total_price && cha < min) {
							mjAmount = parseFloat(item.coupon_amount);
						}
					});
				}

				;
				return mjAmount;
			},

			//计算是否达到起送价；
			setpriceDif(min_amount, total_price) {
				if (min_amount > total_price) {
					return parseFloat(min_amount - total_price).toFixed(2);
				} else {
					return 0;
				}

				;
			},

			//渲染数据
			resetData(sku_id) {
				var that = this,
					products = that.products,
					pro_num;

				for (var j = 0; j < products.length; j++) {
					//定义商品规格及sku_id；
					if (products[j].specs.length > 0) {
						for (var h = 0; h < products[j].specs.length; h++) {
							if (products[j].specs[h].sku_id == sku_id) {
								products[j].num = ecart.sku_count(products[j].product_id);
							}

							;
						}

						;
					} else if (products[j].specification.length > 0) {
						if (products[j].sku_id == sku_id) {
							products[j].num = ecart.sku_count(products[j].product_id);
						}

						;
					} else {
						if (products[j].sku_id == sku_id) {
							if (ecart.shop_cart[sku_id]) {
								pro_num = ecart.shop_cart[sku_id].num;
								products[j].num = pro_num;
							} else {
								products[j].num = 0;
							}

							;
						}

						;
					}

					;
				}

				; //购物车是否有必点商品；

				var have_must = that.have_must,
					must_arr = [];

				for (var k in ecart.shop_cart) {
					must_arr.push(ecart.shop_cart[k].is_must);
				}

				;

				if (shopInfo.have_must == "0" && ecart.total_count() > 0) {
					have_must = true;
				} else if (shopInfo.have_must != "0") {
					if (must_arr.indexOf("1") != -1) {
						have_must = true;
					} else {
						have_must = false;
					}

					;
				} else {
					have_must = false;
				}

				;
				that.setData({
					products: products,
					total_num: ecart.total_count(),
					total_price: ecart.total_price(),
					package_price: ecart.package_price(),
					cartLists: ecart.shop_cart,
					have_must: have_must,
					priceDif: that.setpriceDif(min_amount, ecart.total_price()),
					//计算是否达到起送价；
					total_oldprice: ecart.total_oldprice()
				}); //计算优惠后总价

				that.getAmount(); //凑一凑数据

				that.resetDataCou(); //当购物车为空弹层隐藏；

				if (ecart.total_count() == 0) {
					that.setData({
						cartShow: false
					});
				}

				;
			},

			//加入购物车
			addCart(e) {
				var that = this,
					num,
					info = {},
					sku_id = e.currentTarget.dataset.sku_id,
					sku_obj = e.currentTarget.dataset.sku_obj,
					newSpecs = that.newSpecs,
					specShow = that.specShow,
					a_sku_id = '';

				if (specShow) {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					}

					;
				} else {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					} else {
						str_obj = {};
						str_name = {};
					}

					;
				}

				; //如果有规格口味选择，改变存入购物车的商品title；

				var tit_str = '';

				for (var i in str_obj) {
					tit_str += "+" + str_obj[i].val;
				}

				;
				info = {
					"is_discount": sku_obj.is_discount,
					"is_must": sku_obj.is_must,
					"oldprice": sku_obj.oldprice,
					"price": sku_obj.price,
					"package": sku_obj.package_price,
					"product_id": sku_obj.product_id,
					"pcate_id": sku_obj.cate_id,
					"sku_id": sku_id,
					"sale_sku": sku_obj.sale_sku,
					"sale_type": sku_obj.sale_type,
					"spec_id": sku_obj.spec_id || '',
					"shoptitle": shoptitle,
					"shopid": shop_id,
					'str_obj': str_obj,
					'str_name': str_name,
					"title": sku_obj.title + tit_str
				};
				a_sku_id = sku_id + str_name;

				if (ecart && ecart.shop_cart[a_sku_id]) {
					num = ecart.shop_cart[a_sku_id].num;
				} else {
					num = 0;
				}

				;

				if (num < sku_obj.sale_sku) {
					ecart.add(sku_id, 1, info, str_obj);
				} else {
					uni.showToast({
						title: '商品库存不足',
						icon: 'none'
					});
					return
				};
				console.log(sku_id, str_obj, info);
				console.log("购物车", ecart);
				newSpecs.num += 1; //渲染数据

				that.resetData(sku_id);
				that.setData({
					newSpecs: newSpecs
				});
			},

			//减少购物车
			reduceCart(e) {
				var that = this,
					info = {},
					sku_id = e.currentTarget.dataset.sku_id,
					sku_obj = e.currentTarget.dataset.sku_obj,
					specShow = that.specShow,
					newSpecs = that.newSpecs;

				if (specShow) {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					}

					;
				} else {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					} else {
						str_obj = {};
						str_name = {};
					}

					;
				}

				; //如果有规格口味选择，改变存入购物车的商品title；

				var tit_str = '';

				for (var i in str_obj) {
					tit_str += "+" + str_obj[i].val;
				}

				;
				info = {
					"oldprice": sku_obj.oldprice,
					"price": sku_obj.price,
					"package": sku_obj.package_price,
					"product_id": sku_obj.product_id,
					"pcate_id": sku_obj.cate_id,
					"sku_id": sku_id,
					"sale_sku": sku_obj.sale_sku,
					"sale_type": sku_obj.sale_type,
					"spec_id": sku_obj.spec_id || '',
					"shoptitle": shoptitle,
					"shopid": shop_id,
					'str_obj': str_obj,
					'str_name': str_name,
					"title": sku_obj.title + tit_str
				};
				ecart.add(sku_id, -1, info, str_obj);
				newSpecs.num -= 1; //渲染数据

				that.resetData(sku_id);
				that.setData({
					newSpecs: newSpecs
				});
			},

			//清空购物车
			emptyTap() {
				ecart.clear(); //渲染数据

				var that = this,
					products = that.products;

				if (products.length > 0) {
					for (var j = 0; j < products.length; j++) {
						//定义商品规格及sku_id；
						products[j].num = ecart.sku_count(products[j].product_id);
					}

					;
				}

				; //购物车是否有必点商品；

				var have_must = that.have_must,
					must_arr = [];

				for (var k in ecart.shop_cart) {
					must_arr.push(ecart.shop_cart[k].is_must);
				}

				;

				if (shopInfo.have_must == "0" && ecart.total_count() > 0) {
					have_must = true;
				} else if (shopInfo.have_must != "0") {
					if (must_arr.indexOf("1") != -1) {
						have_must = true;
					} else {
						have_must = false;
					}

					;
				} else {
					have_must = false;
				}

				;
				that.total_price = ecart.total_price();
				that.setData({
					products: products,
					total_num: ecart.total_count(),
					package_price: ecart.package_price(),
					cartLists: ecart.shop_cart,
					have_must: have_must,
					priceDif: that.setpriceDif(min_amount, ecart.total_price()) //计算是否达到起送价；

				}); //当购物车为空弹层隐藏；

				if (ecart.total_count() == 0) {
					that.setData({
						cartShow: false
					});
				}

				;
			},

			//规格临时数据渲染；
			specsData(sku_id, products) {
				var that = this,
					specsK = that.specsK,
					newSpecs = {},
					str = '',
					strobj = {},
					a_sku_id,
					specsIdx = that.specsIdx; //有规格属性；

				if (products.specs.length > 0) {
					newSpecs = products.specs[specsIdx];
					newSpecs.cate_id = products.cate_id;
				} else {
					newSpecs = products;
				}

				;

				if (products.specification.length > 0) {
					for (let i = 0; i < products.specification.length; i++) {
						str += ":" + products.specification[i]['key'] + ':' + products.specification[i]['val'][specsK[i]];
						strobj[i] = {
							key: products.specification[i]['key'],
							val: products.specification[i]['val'][specsK[i]]
						};
					}

					;
					str_name = str;
					str_obj = strobj;
				}

				; //判断购物车是否有a_sku_id商品；

				a_sku_id = sku_id + str;

				if (ecart && ecart.shop_cart[a_sku_id]) {
					newSpecs.num = ecart.shop_cart[a_sku_id].num;
				} else {
					newSpecs.num = 0;
				}

				;
				that.setData({
					newSpecs: newSpecs
				});
			},

			//规格筛选；
			specsOpt(e) {
				var specs_idx = e.currentTarget.dataset.specs_idx,
					products = e.currentTarget.dataset.products;
				this.setData({
					specsIdx: specs_idx
				}); //规格临时数据渲染；

				this.specsData(products.specs[specs_idx].sku_id, products);
			},

			//规格口味筛选；
			setspecsK(e) {
				var idx = e.currentTarget.dataset.idx,
					specification_idx = e.currentTarget.dataset.specification_idx,
					specsK = this.specsK,
					products = e.currentTarget.dataset.products,
					specsIdx = this.specsIdx;
				specsK[specification_idx] = idx;
				this.setData({
					specsK: specsK
				}); //规格临时数据渲染；

				if (products.specs.length > 0) {
					this.specsData(products.specs[specsIdx].sku_id, products);
				} else {
					this.specsData(products.sku_id, products);
				}

				;
			},

			//规格弹层；
			setspecShow(e) {
				var that = this,
					product_id = e.currentTarget.dataset.product_id,
					products = e.currentTarget.dataset.products,
					specsK = [];

				if (product_id) {
					that.setData({
						specShow_idx: product_id,
						specShow: true
					}); //构建临时数据；

					for (let i = 0; i < products.specification.length; i++) {
						specsK.push(0);
					}

					;
					that.setData({
						specsIdx: 0,
						specsK: specsK
					}); //规格临时数据渲染；

					if (products.specs.length > 0) {
						that.specsData(products.specs[0].sku_id, products);
					} else {
						that.specsData(products.sku_id, products);
					}

					;
				} else {
					that.setData({
						specShow_idx: null,
						specShow: false
					});
					str_name = '';
					str_obj = {};
				}

				;
			},

			//购物车弹出效果
			setcartShow() {
				var that = this;
				var cartShow = that.cartShow;

				if (cartShow) {
					that.setData({
						cartShow: false,
						couShow: false
					});
				} else {
					that.setData({
						cartShow: true,
						couShow: false
					});
				}

				;
			},

			//去下单
			ordertocallback() {
				var that = this,
					product_info = '',
					cart = ecart.shop_cart,
					is_ziti;

				if (that.is_ziti == true) {
					is_ziti = 'ziti';
				}

				;

				for (var i in cart) {
					var product_info = product_info + cart[i].sku_id + ':' + cart[i].num + ',';
				}

				;
				product_info = product_info.substring(0, product_info.length - 1);
				app.globalData.orderForm({
					"shop_id": shop_id,
					"lng": app.globalData._CFG.lng,
					"lat": app.globalData._CFG.lat,
					"products": product_info
				}, function(res) {
					if (res.error == '230') {
						uni.showToast({
							title: res.message
						});
					} else if (res.error == '211') {
						uni.showToast({
							title: res.message
						});
					} else {
						var url = '../wm_order/wm_order?id=' + shop_id + '&is_ziti=' + is_ziti;
						app.globalData.topage(url);
					}
				});
			},

			linkOrdersubmit_ziti() {
				var that = this;
				that.setData({
					is_ziti: true
				});
				app.globalData.afterCheckLogin(that.ordertocallback);
			},

			linkOrdersubmit() {
				var that = this;
				that.setData({
					is_ziti: false
				});
				app.globalData.afterCheckLogin(that.ordertocallback);
			},

			hideMask() {
				this.setData({
					cartShow: false,
					couShow: false,
					shareShow: false
				});
			},

			cateTap() {
				console.log("占位：函数 cateTap 未声明");
			}

		}
	};
</script>
<style>
	.ser_box_box {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		background: #fff;
	}

	.ser_box {
		margin: 10rpx 150rpx 10rpx 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding-left: 66rpx;
		height: 64rpx;
		border: 1rpx solid #eee;
		position: relative;
		/* border-radius: 4rpx; */
	}

	.ser_box input {
		width: 100%;
		height: 64rpx;
		color: #333;
		font-size: 28rpx;
	}

	/*  #ifdef  MP-ALIPAY || H5  */
	.ser_box input {
		height: 48rpx;
	}

	/*  #endif  */
	/*  #ifdef   H5  */
	.ser_box_box {
		top: 88rpx !important;
	}

	/*  #endif  */
	.ser_box .ico {
		position: absolute;
		top: 15rpx;
		left: 20rpx;
		width: 26rpx;
		height: 26rpx;
	}

	.ser_box_box button {
		position: absolute;
		right: 20rpx;
		top: 10rpx;
		height: 64rpx;
		line-height: 64rpx;
		width: 110rpx;
		padding: 0;
		font-size: 28rpx;
		background: #ff797c;
	}





	/*重构样式*/
	/*规格*/
	.specMask {
		position: fixed;
		z-index: 21;
		left: 50%;
		top: 50%;
		background: #fff;
		border-radius: 6rpx;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		overflow: hidden;
		width: 80%;
	}

	.specMask .close {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}

	.specMask .tit {
		text-align: center;
		font-size: 32rpx;
		line-height: 40rpx;
		padding: 60rpx 20rpx 14rpx;
	}

	.specMask .discount {
		overflow: hidden;
		margin: 0 30rpx;
	}

	.specMask .discount .zhe {
		border: 2rpx solid #FF4848;
		border-radius: 4rpx;
	}

	.specMask .discount .zhe .one {
		background: #FF4848;
		color: #fff;
		padding: 0 8rpx;
	}

	.specMask .discount .zhe .two {
		color: #FF4848;
		padding: 0 8rpx;
	}

	.specMask .discount .shu {
		color: #ff797c;
		background: #feb;
		padding: 0 8rpx;
		margin-left: 12rpx;
	}

	.specMask .bottom {
		overflow: hidden;
		background: #f5f5f5;
		padding: 20rpx;
	}

	.specMask .bottom .price {
		font-size: 40rpx;
		color: #f60;
	}

	.specMask .bottom .price text {
		font-size: 24rpx;
	}

	.specMask .bottom .goods_int_box {
		position: relative;
		right: auto;
		bottom: auto;
	}

	.specMask .cont {
		padding: 0 30rpx 30rpx;
		max-height: 500rpx;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.specMask .cont .spec_bt {
		font-size: 28rpx;
		line-height: 40rpx;
		margin: 16rpx 0;
	}

	.specMask .cont .spec_list {
		overflow: hidden;
	}

	.specMask .cont .spec_list .list {
		float: left;
		padding: 4rpx 24rpx;
		line-height: 40rpx;
		border: 2rpx solid #e6e6e6;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #333;
		margin: 0 16rpx 16rpx 0;
	}

	.specMask .cont .spec_list .list.on {
		border-color: #ff797c;
		background: #f1fcf1;
		color: #ff797c;
	}

	.specMask .cont .attr {
		background: #edf2f5;
		padding: 4rpx 0 8rpx 16rpx;
		border-radius: 6rpx;
	}

	.specMask .cont .attr .bt {
		line-height: 40rpx;
		margin: 16rpx 0;
	}

	.goodsListBox {
		width: 100%;
		padding-bottom: 100rpx;
		padding-top: 80rpx;
		box-sizing: border-box;
	}

	.cateTit_top {
		background: #f4f4f4;
		height: 52rpx;
		line-height: 52rpx;
		padding: 0 24rpx;
		border-left: 2px solid #e6e6e6;
		color: #666;
		position: fixed;
		left: 150rpx;
		top: 320rpx;
		right: 0;
		z-index: 2;
	}

	.goodsListBox .list_box {
		background: #fff;
	}

	.cateTit {
		background: #f4f4f4;
		height: 52rpx;
		line-height: 52rpx;
		padding: 0 24rpx;
		border-left: 2px solid #e6e6e6;
		color: #666;
	}

	.goodsList {
		padding: 20rpx;
		border-bottom: 1px solid #e6e6e6;
		position: relative;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		background: #fff;
	}

	.goodsList:last-child {
		border-bottom: 0;
	}

	.goodsList .img {
		width: 120rpx;
		height: 120rpx;
		background: #eee;
		overflow: hidden;
	}

	.goodsList .wz_box {
		margin-left: 140rpx;
		position: relative;
	}

	.goodsList .wz_box .tit {
		font-size: 24rpx;
		line-height: 40rpx;
		margin-bottom: 6rpx;
	}

	.goodsList .wz_box .txt {
		font-size: 22rpx;
		line-height: 40rpx;
		color: #999;
	}

	.goodsList .wz_box .price {
		font-size: 30rpx;
		line-height: 40rpx;
		color: #ff9900;
		margin-top: 4rpx;
	}

	.goodsList .wz_box .price text {
		font-size: 24rpx;
	}

	.goodsList .wz_box .del {
		color: #999;
		position: relative;
		font-size: 20rpx;
	}

	.goodsList .wz_box .del:after {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 2rpx;
		background: #999;
	}

	.goodsList .wz_box .discount {
		overflow: hidden;
	}

	.goodsList .wz_box .discount .zhe {
		border: 2rpx solid #FF4848;
		border-radius: 4rpx;
	}

	.goodsList .wz_box .discount .zhe .one {
		background: #FF4848;
		color: #fff;
		padding: 0 8rpx;
	}

	.goodsList .wz_box .discount .zhe .two {
		color: #FF4848;
		padding: 0 8rpx;
	}

	.goodsList .wz_box .discount .shu {
		color: #ff797c;
		background: #feb;
		padding: 0 8rpx;
		margin-left: 12rpx;
	}

	.goodsList .spec {
		position: absolute;
		right: 20rpx;
		bottom: 22rpx;
		font-size: 24rpx;
		line-height: 52rpx;
		padding: 0 20rpx;
		color: #fff;
		border-radius: 52rpx;
		background: #ff797c;
	}

	.goodsList .goods_int_box {
		position: absolute;
		right: 20rpx;
		bottom: 22rpx;
	}

	.goods_int_box {
		height: 50rpx;
	}

	.goods_int_box .num {
		width: 60rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		float: left;
	}

	.goods_int_box .jian,
	.goods_int_box .jia {
		width: 50rpx;
		height: 50rpx;
		float: left;
	}

	.goods_footer {
		height: 100rpx;
		background: #fff;
		box-shadow: 0 -1px 1px #eee;
		position: fixed;
		z-index: 11;
		left: 0;
		bottom: 0;
		width: 100%;
	}

	.goods_footer .cart {
		margin-left: 16rpx;
		margin-top: -12rpx;
		position: relative;
	}

	.goods_footer .cart .num {
		position: absolute;
		right: 4rpx;
		top: 4rpx;
		min-width: 28rpx;
		height: 28rpx;
		border-radius: 20rpx;
		text-align: center;
		font-size: 20rpx;
		color: #fff;
		background: #ff9900;
		line-height: 24rpx;
	}

	.goods_footer .cart,
	.goods_footer .cart image {
		height: 100rpx;
		width: 100rpx;
	}

	.goods_footer .wz_box {
		margin-left: 20rpx;
		line-height: 40rpx;
		padding-top: 8rpx;
	}

	.goods_footer .wz_box .price {
		font-size: 32rpx;
		line-height: 40rpx;
		color: #ff9900;
	}

	.goods_footer .wz_box .price small {
		font-size: 24rpx;
		color: #999;
		position: relative;
		margin-left: 8rpx;
	}

	.goods_footer .wz_box .price small:after {
		content: '';
		width: 100%;
		height: 2rpx;
		background: #999;
		position: absolute;
		left: 0;
		top: 50%;
	}

	.goods_footer .btn {
		width: 228rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
		background: #f60;
	}

	.goods_footer .btn2 {
		background: #aaa;
		font-size: 26rpx;
	}

	/*购物车*/
	.goods_cart {
		-webkit-overflow-scrolling: touch;
		background: #fff;
		width: 100%;
		position: fixed;
		z-index: 10;
		left: 0;
		bottom: 100rpx;
		max-height: calc(80% - 200rpx);
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		transform: translate(0, 100%);
		-webkit-transform: translate(0, 100%);
		transition: all 0.5s ease;
		-webkit-transition: all 0.5s ease;
	}

	.goods_cart.show {
		transform: translate(0, 0);
		-webkit-transform: translate(0, 0);
	}

	.goods_cart .tit_box {
		background: #edf2f5;
		padding: 20rpx 20rpx;
		height: 40rpx;
		position: sticky;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.goods_cart .tit_box .tit {
		font-size: 32rpx;
		line-height: 40rpx;
		border-left: 6rpx solid #ff797c;
		padding-left: 20rpx;
	}

	.goods_cart .tit_box .clear_btn {
		font-size: 24rpx;
		line-height: 40rpx;
		color: #333;
	}

	.goods_cart .tit_box .clear_btn .ico {
		width: 24rpx;
		height: 28rpx;
		vertical-align: middle;
		margin-right: 8rpx;
	}

	.goods_cart .list {
		padding: 28rpx 24rpx;
		line-height: 48rpx;
		border-bottom: 1px solid #e6eaed;
	}

	.goods_cart .list .price {
		width: 200rpx;
		color: #ff9900;
		text-align: right;
		padding-right: 20rpx;
	}

	.goods_cart .list .price .old {
		font-size: 18rpx;
		color: #999;
		position: relative;
	}

	.goods_cart .list .price .old:after {
		width: 100%;
		height: 2rpx;
		background: #999;
		position: absolute;
		left: 0;
		top: 50%;
		content: '';
	}

	.goods_cart .list .bt {
		margin-right: 360rpx;
	}

	.goods_cart .list .bt:before {
		content: '';
		background: #65bc05;
		width: 10rpx;
		height: 10rpx;
		border-radius: 100%;
		display: inline-block;
		margin-right: 16rpx;
	}

	/*自提浮层*/
	.zitiFixed {
		display: block;
		width: 120rpx;
		height: 60rpx;
		text-align: center;
		position: fixed;
		z-index: 2;
		right: 30rpx;
		bottom: 120rpx;
	}

	.zitiFixed text {
		color: #333;
		font-size: 24rpx;
		line-height: 44rpx;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
	}

	.zitiFixed image {
		width: 120rpx;
		height: 60rpx;
	}

	/*优惠提示计算悬浮*/
	.countTipsFixed {
		display: block;
		background: rgba(255, 240, 209, 0.93);
		line-height: 64rpx;
		height: 64rpx;
		font-size: 24rpx;
		text-align: center;
		color: #333;
		position: fixed;
		z-index: 1;
		left: 0;
		bottom: 100rpx;
		width: 100%;
	}

	.countTipsFixed text {
		color: #ff797c;
		font-size: 28rpx;
	}

	.countTipsFixed image {
		width: 14rpx;
		height: 24rpx;
		margin-left: 12rpx;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwY21yTnFDJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSxlQUFlLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVDQXpELGtCQUFBLENBQUEsaURBQUEsQ0FBQSw0Q0FBQSxDQUFBLGNBQUEsQ0RBMkQsUUFBUSxFQUFFLGdCQUFnQixDQUFDO0FBQ3RGLFNBQVMsK0JBQStCLENBQUMsZUFBZSxFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSx1QkFBdUIsRUFBRSxrQkFBa0IsQ0FBQztBQUNoSyxnQkFBZ0IsV0FBVyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDO0FBQ3pFLGNBQWMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO0FBQ3RGLG9CQUFvQixrQkFBa0IsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDOzs7Ozs7QUFNdEssT0FBTztBQUNQLEtBQUs7QUFDTCxVQUFVLGVBQWUsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSwrQkFBK0IsQ0FBQyx1Q0FBdUMsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLENBQUM7QUFDMU0saUJBQWlCLFlBQVksRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQztBQUMzRixlQUFlLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLDBCQUEwQixDQUFDO0FBQ3BHLG9CQUFvQixnQkFBZ0IsRUFBRSxlQUFlLENBQUM7QUFDdEQseUJBQXlCLHlCQUF5QixFQUFFLG1CQUFtQixDQUFDO0FBQ3hFLDhCQUE4QixrQkFBa0IsRUFBRSxXQUFXLEVB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LEVBQUUsUUFBUSxDQUFDOztBQUVqSCxXQUFXO0FBQ1gsZ0JBQWdCLGNBQWMsQ0FBQyxrQ0FBa0MsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7QUFDL00scUJBQXFCLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQztBQUN0RCxzQkFBc0IsWUFBWSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2VyX2JveF9ib3h7cG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBiYWNrZ3JvdW5kOiAjZmZmO31cclxuLnNlcl9ib3h7bWFyZ2luOjEwcnB4IDE1MHJweCAxMHJweCAyMHJweDtiYWNrZ3JvdW5kOiNmZmY7IGJvcmRlci1yYWRpdXM6IDEwcnB4OyBwYWRkaW5nLWxlZnQ6IDY2cnB4OyBoZWlnaHQ6IDU2cnB4OyBib3JkZXI6IDJycHggc29saWQgI2VlZTsgcG9zaXRpb246IHJlbGF0aXZlO31cclxuLnNlcl9ib3ggaW5wdXR7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDU2cnB4OyBjb2xvcjogIzMzMzsgZm9udC1zaXplOjI4cnB4O31cclxuLnNlcl9ib3ggLmljb3twb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMTVycHg7bGVmdDogMjBycHg7IHdpZHRoOiAyNnJweDsgaGVpZ2h0OiAyNnJweDt9XHJcbi5zZXJfYm94X2JveCBidXR0b257cG9zaXRpb246IGFic29sdXRlOyByaWdodDogMjBycHg7IHRvcDogMTBycHg7IGhlaWdodDogNTZycHg7IGxpbmUtaGVpZ2h0OiA1NnJweDsgd2lkdGg6IDExMHJweDsgcGFkZGluZzogMDsgZm9udC1zaXplOiAyOHJweDsgYmFja2dyb3VuZDogI2ZmNjYwMDt9XHJcblxyXG5cclxuXHJcblxyXG5cclxuLyrph43mnoTmoLflvI8qL1xyXG4vKuinhOagvCovXHJcbi5zcGVjTWFza3twb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDIxOyBsZWZ0OiA1MCU7IHRvcDogNTAlOyBiYWNrZ3JvdW5kOiAjZmZmOyBib3JkZXItcmFkaXVzOiA2cnB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpOy13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwtNTAlKTsgb3ZlcmZsb3c6IGhpZGRlbjsgd2lkdGg6IDgwJTt9XHJcbi5zcGVjTWFzayAuY2xvc2V7d2lkdGg6IDM2cnB4OyBoZWlnaHQ6IDM2cnB4OyBwb3NpdGlvbjogYWJzb2x1dGU7IHJpZ2h0OiAyMHJweDsgdG9wOiAyMHJweDt9XHJcbi5zcGVjTWFzayAudGl0e3RleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAzMnJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBwYWRkaW5nOiA2MHJweCAyMHJweCAxNHJweDt9XHJcbi5zcGVjTWFzayAuZGlzY291bnR7b3ZlcmZsb3c6IGhpZGRlbjsgbWFyZ2luOiAwIDMwcnB4O31cclxuLnNwZWNNYXNrIC5kaXNjb3VudCAuemhle2JvcmRlcjoycnB4IHNvbGlkICNGRjQ4NDg7IGJvcmRlci1yYWRpdXM6IDRycHg7fVxyXG4uc3BlY01hc2sgLmRpc2NvdW50IC56aGUgLm9uZXtiYWNrZ3JvdW5kOiNGRjQ4NDg7IGNvbG9yOiAjZmZmOyBwYWRkaW5nOiAwIDhycHg7fVxyXG4uc3BlY01hc2sgLmRpc2NvdW50IC56aGUgLnR3b3tjb2xvcjogI0ZGNDg0ODsgcGFkZGluZzogMCA4cnB4O31cclxuLnNwZWNNYXNrIC5kaXNjb3VudCAuc2h1e2NvbG9yOiAjZmY2NjAwO2JhY2tncm91bmQ6ICNmZWI7IHBhZGRpbmc6IDAgOHJweDsgbWFyZ2luLWxlZnQ6IDEycnB4O31cclxuLnNwZWNNYXNrIC5ib3R0b217b3ZlcmZsb3c6IGhpZGRlbjsgYmFja2dyb3VuZDogI2Y1ZjVmNTsgcGFkZGluZzogMjBycHg7fVxyXG4uc3BlY01hc2sgLmJvdHRvbSAucHJpY2V7Zm9udC1zaXplOiA0MHJweDsgY29sb3I6ICNmNjA7fVxyXG4uc3BlY01hc2sgLmJvdHRvbSAucHJpY2UgdGV4dHtmb250LXNpemU6IDI0cnB4O31cclxuLnNwZWNNYXNrIC5ib3R0b20gLmdvb2RzX2ludF9ib3h7cG9zaXRpb246cmVsYXRpdmU7ICByaWdodDogYXV0bzsgYm90dG9tOiBhdXRvO31cclxuLnNwZWNNYXNrIC5jb250e3BhZGRpbmc6IDAgMzBycHggMzBycHg7IG1heC1oZWlnaHQ6IDUwMHJweDsgIG92ZXJmbG93OiBhdXRvOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDt9XHJcbi5zcGVjTWFzayAuY29udCAuc3BlY19idHtmb250LXNpemU6IDI4cnB4OyBsaW5lLWhlaWdodDogNDBycHg7IG1hcmdpbjogMTZycHggMDt9XHJcbi5zcGVjTWFzayAuY29udCAuc3BlY19saXN0e292ZXJmbG93OiBoaWRkZW47fVxyXG4uc3BlY01hc2sgLmNvbnQgLnNwZWNfbGlzdCAubGlzdHtmbG9hdDogbGVmdDsgcGFkZGluZzogNHJweCAyNHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBib3JkZXI6IDJycHggc29saWQgI2U2ZTZlNjsgYm9yZGVyLXJhZGl1czogNHJweDsgZm9udC1zaXplOiAyNHJweDsgY29sb3I6ICMzMzM7IG1hcmdpbjogMCAxNnJweCAxNnJweCAwO31cclxuLnNwZWNNYXNrIC5jb250IC5zcGVjX2xpc3QgLmxpc3Qub257Ym9yZGVyLWNvbG9yOiAjMjBBRDIwOyBiYWNrZ3JvdW5kOiAjZjFmY2YxOyBjb2xvcjogIzIwQUQyMDt9XHJcbi5zcGVjTWFzayAuY29udCAuYXR0cntiYWNrZ3JvdW5kOiAjZWRmMmY1OyBwYWRkaW5nOiA0cnB4IDAgOHJweCAxNnJweDsgYm9yZGVyLXJhZGl1czogNnJweDt9XHJcbi5zcGVjTWFzayAuY29udCAuYXR0ciAuYnR7bGluZS1oZWlnaHQ6IDQwcnB4OyBtYXJnaW46IDE2cnB4IDA7fVxyXG5cclxuLmdvb2RzTGlzdEJveHt3aWR0aDogMTAwJTtwYWRkaW5nLWJvdHRvbTogMTAwcnB4OyBwYWRkaW5nLXRvcDo4MHJweDsgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7fVxyXG4uY2F0ZVRpdF90b3B7YmFja2dyb3VuZDogI2Y0ZjRmNDsgaGVpZ2h0OiA1MnJweDtsaW5lLWhlaWdodDogNTJycHg7IHBhZGRpbmc6IDAgMjRycHg7IGJvcmRlci1sZWZ0OiAycHggc29saWQgI2U2ZTZlNjsgY29sb3I6ICM2NjY7IHBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMTUwcnB4OyB0b3A6IDMyMHJweDsgcmlnaHQ6IDA7IHotaW5kZXg6IDI7fVxyXG4uZ29vZHNMaXN0Qm94IC5saXN0X2JveHtiYWNrZ3JvdW5kOiAjZmZmO31cclxuLmNhdGVUaXR7YmFja2dyb3VuZDogI2Y0ZjRmNDsgaGVpZ2h0OiA1MnJweDtsaW5lLWhlaWdodDogNTJycHg7IHBhZGRpbmc6IDAgMjRycHg7IGJvcmRlci1sZWZ0OiAycHggc29saWQgI2U2ZTZlNjsgY29sb3I6ICM2NjY7fVxyXG4uZ29vZHNMaXN0e3BhZGRpbmc6IDIwcnB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U2ZTZlNjsgcG9zaXRpb246IHJlbGF0aXZlOyBib3gtc2l6aW5nOiBib3JkZXItYm94OyAtd2Via2l0LWJveC1zaXppbmc6IGJvcmRlci1ib3g7IGJhY2tncm91bmQ6ICNmZmY7fVxyXG4uZ29vZHNMaXN0Omxhc3QtY2hpbGR7Ym9yZGVyLWJvdHRvbTogMDt9XHJcbi5nb29kc0xpc3QgLmltZ3t3aWR0aDogMTIwcnB4OyBoZWlnaHQ6IDEyMHJweDsgYmFja2dyb3VuZDogI2VlZTsgb3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5nb29kc0xpc3QgLnd6X2JveHsgbWFyZ2luLWxlZnQ6IDE0MHJweDtwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uZ29vZHNMaXN0IC53el9ib3ggLnRpdHtmb250LXNpemU6IDI0cnB4OyBsaW5lLWhlaWdodDogNDBycHg7IG1hcmdpbi1ib3R0b206IDZycHg7fVxyXG4uZ29vZHNMaXN0IC53el9ib3ggLnR4dHtmb250LXNpemU6IDIycnB4OyBsaW5lLWhlaWdodDogNDBycHg7IGNvbG9yOiAjOTk5O31cclxuLmdvb2RzTGlzdCAud3pfYm94IC5wcmljZXtmb250LXNpemU6IDMwcnB4OyBsaW5lLWhlaWdodDogNDBycHg7IGNvbG9yOiAjZmY5OTAwOyBtYXJnaW4tdG9wOiA0cnB4O31cclxuLmdvb2RzTGlzdCAud3pfYm94IC5wcmljZSB0ZXh0e2ZvbnQtc2l6ZTogMjRycHg7fVxyXG4uZ29vZHNMaXN0IC53el9ib3ggLmRlbHtjb2xvcjogIzk5OTsgcG9zaXRpb246IHJlbGF0aXZlOyBmb250LXNpemU6IDIwcnB4O31cclxuLmdvb2RzTGlzdCAud3pfYm94IC5kZWw6YWZ0ZXJ7Y29udGVudDogJyc7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiA1MCU7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDJycHg7IGJhY2tncm91bmQ6ICM5OTk7fVxyXG4uZ29vZHNMaXN0IC53el9ib3ggLmRpc2NvdW50e292ZXJmbG93OiBoaWRkZW47fVxyXG4uZ29vZHNMaXN0IC53el9ib3ggLmRpc2NvdW50IC56aGV7Ym9yZGVyOjJycHggc29saWQgI0ZGNDg0ODsgYm9yZGVyLXJhZGl1czogNHJweDt9XHJcbi5nb29kc0xpc3QgLnd6X2JveCAuZGlzY291bnQgLnpoZSAub25le2JhY2tncm91bmQ6I0ZGNDg0ODsgY29sb3I6ICNmZmY7IHBhZGRpbmc6IDAgOHJweDt9XHJcbi5nb29kc0xpc3QgLnd6X2JveCAuZGlzY291bnQgLnpoZSAudHdve2NvbG9yOiAjRkY0ODQ4OyBwYWRkaW5nOiAwIDhycHg7fVxyXG4uZ29vZHNMaXN0IC53el9ib3ggLmRpc2NvdW50IC5zaHV7Y29sb3I6ICNmZjY2MDA7YmFja2dyb3VuZDogI2ZlYjsgcGFkZGluZzogMCA4cnB4OyBtYXJnaW4tbGVmdDogMTJycHg7fVxyXG4uZ29vZHNMaXN0IC5zcGVje3Bvc2l0aW9uOiBhYnNvbHV0ZTsgcmlnaHQ6IDIwcnB4OyBib3R0b206IDIycnB4OyBmb250LXNpemU6IDI0cnB4OyBsaW5lLWhlaWdodDogNTJycHg7IHBhZGRpbmc6IDAgMjBycHg7IGNvbG9yOiAjZmZmOyBib3JkZXItcmFkaXVzOiA1MnJweDsgYmFja2dyb3VuZDogIzIwQUQyMDt9XHJcbi5nb29kc0xpc3QgLmdvb2RzX2ludF9ib3h7cG9zaXRpb246IGFic29sdXRlOyByaWdodDogMjBycHg7IGJvdHRvbTogMjJycHg7fVxyXG4uZ29vZHNfaW50X2JveHtoZWlnaHQ6IDUwcnB4O31cclxuLmdvb2RzX2ludF9ib3ggLm51bXt3aWR0aDogNjBycHg7IGhlaWdodDogNTBycHg7IGxpbmUtaGVpZ2h0OiA1MHJweDsgdGV4dC1hbGlnbjogY2VudGVyO2Zsb2F0OiBsZWZ0O31cclxuLmdvb2RzX2ludF9ib3ggLmppYW4sLmdvb2RzX2ludF9ib3ggLmppYXt3aWR0aDogNTBycHg7IGhlaWdodDogNTBycHg7IGZsb2F0OiBsZWZ0O31cclxuXHJcbi5nb29kc19mb290ZXJ7IGhlaWdodDogMTAwcnB4OyBiYWNrZ3JvdW5kOiAjZmZmOyBib3gtc2hhZG93OiAwIC0xcHggMXB4ICNlZWU7IHBvc2l0aW9uOiBmaXhlZDsgei1pbmRleDogMTE7IGxlZnQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7fVxyXG4uZ29vZHNfZm9vdGVyIC5jYXJ0e21hcmdpbi1sZWZ0OiAxNnJweDsgbWFyZ2luLXRvcDogLTEycnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uZ29vZHNfZm9vdGVyIC5jYXJ0IC5udW17cG9zaXRpb246IGFic29sdXRlO3JpZ2h0OiA0cnB4OyB0b3A6NHJweDttaW4td2lkdGg6IDI0cnB4O2hlaWdodDogMjRycHg7IGJvcmRlci1yYWRpdXM6IDIwcnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMjBycHg7IGNvbG9yOiAjZmZmOyBiYWNrZ3JvdW5kOiAjZmY5OTAwOyBsaW5lLWhlaWdodDogMjRycHg7fVxyXG4uZ29vZHNfZm9vdGVyIC5jYXJ0LC5nb29kc19mb290ZXIgLmNhcnQgaW1hZ2V7IGhlaWdodDogMTAwcnB4OyB3aWR0aDogMTAwcnB4O31cclxuLmdvb2RzX2Zvb3RlciAud3pfYm94e21hcmdpbi1sZWZ0OiAyMHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBwYWRkaW5nLXRvcDogOHJweDt9XHJcbi5nb29kc19mb290ZXIgLnd6X2JveCAucHJpY2V7IGZvbnQtc2l6ZTogMzJycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgY29sb3I6ICNmZjk5MDA7fVxyXG4uZ29vZHNfZm9vdGVyIC53el9ib3ggLnByaWNlIHNtYWxse2ZvbnQtc2l6ZTogMjRycHg7Y29sb3I6ICM5OTk7IHBvc2l0aW9uOiByZWxhdGl2ZTsgbWFyZ2luLWxlZnQ6IDhycHg7fVxyXG4uZ29vZHNfZm9vdGVyIC53el9ib3ggLnByaWNlIHNtYWxsOmFmdGVye2NvbnRlbnQ6ICcnOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAycnB4OyBiYWNrZ3JvdW5kOiAjOTk5OyBwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogNTAlO31cclxuLmdvb2RzX2Zvb3RlciAuYnRue3dpZHRoOiAyMjhycHg7IGhlaWdodDogMTAwcnB4OyBsaW5lLWhlaWdodDogMTAwcnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMzJycHg7IGNvbG9yOiAjZmZmOyBiYWNrZ3JvdW5kOiAjZjYwO31cclxuLmdvb2RzX2Zvb3RlciAuYnRuMntiYWNrZ3JvdW5kOiAjYWFhOyBmb250LXNpemU6IDI2cnB4O31cclxuXHJcbi8q6LSt54mp6L2mKi9cclxuLmdvb2RzX2NhcnR7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO2JhY2tncm91bmQ6ICNmZmY7IHdpZHRoOiAxMDAlOyBwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDEwOyBsZWZ0OjA7IGJvdHRvbTogMTAwcnB4OyBtYXgtaGVpZ2h0OmNhbGMoODAlIC0gMjAwcnB4KTsgIG92ZXJmbG93OiBhdXRvOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDt0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLDEwMCUpOy13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwxMDAlKTsgdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZTsgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlO31cclxuLmdvb2RzX2NhcnQuc2hvd3t0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLDApOy13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwwKTt9XHJcbi5nb29kc19jYXJ0IC50aXRfYm94e2JhY2tncm91bmQ6ICNlZGYyZjU7cGFkZGluZzogMjBycHggMjBycHg7IGhlaWdodDogNDBycHg7IHBvc2l0aW9uOnN0aWNreTsgbGVmdDogMDsgdG9wOiAwOyB6LWluZGV4OiAxO31cclxuLmdvb2RzX2NhcnQgLnRpdF9ib3ggLnRpdHsgZm9udC1zaXplOiAzMnJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBib3JkZXItbGVmdDogNnJweCBzb2xpZCAjMjBBRDIwOyBwYWRkaW5nLWxlZnQ6IDIwcnB4O31cclxuLmdvb2RzX2NhcnQgLnRpdF9ib3ggLmNsZWFyX2J0bnsgZm9udC1zaXplOiAyNHJweDsgIGxpbmUtaGVpZ2h0OiA0MHJweDsgY29sb3I6ICMzMzM7fVxyXG4uZ29vZHNfY2FydCAudGl0X2JveCAuY2xlYXJfYnRuIC5pY297d2lkdGg6IDI0cnB4OyBoZWlnaHQ6IDI4cnB4OyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBtYXJnaW4tcmlnaHQ6IDhycHg7fVxyXG4uZ29vZHNfY2FydCAubGlzdHtwYWRkaW5nOiAyOHJweCAyNHJweDsgbGluZS1oZWlnaHQ6IDQ4cnB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U2ZWFlZDt9XHJcbi5nb29kc19jYXJ0IC5saXN0IC5wcmljZXt3aWR0aDogMjAwcnB4OyBjb2xvcjogI2ZmOTkwMDsgdGV4dC1hbGlnbjogcmlnaHQ7IHBhZGRpbmctcmlnaHQ6IDIwcnB4O31cclxuLmdvb2RzX2NhcnQgLmxpc3QgLnByaWNlIC5vbGR7Zm9udC1zaXplOiAxOHJweDsgY29sb3I6ICM5OTk7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5nb29kc19jYXJ0IC5saXN0IC5wcmljZSAub2xkOmFmdGVye3dpZHRoOiAxMDAlOyBoZWlnaHQ6IDJycHg7IGJhY2tncm91bmQ6ICM5OTk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOjUwJTsgY29udGVudDogJyc7fVxyXG4uZ29vZHNfY2FydCAubGlzdCAuYnR7bWFyZ2luLXJpZ2h0OiAzNjBycHg7fVxyXG4uZ29vZHNfY2FydCAubGlzdCAuYnQ6YmVmb3Jle2NvbnRlbnQ6ICcnO2JhY2tncm91bmQ6ICM2NWJjMDU7IHdpZHRoOiAxMHJweDsgaGVpZ2h0OiAxMHJweDsgYm9yZGVyLXJhZGl1czogMTAwJTsgZGlzcGxheTogaW5saW5lLWJsb2NrOyBtYXJnaW4tcmlnaHQ6IDE2cnB4O31cclxuXHJcbi8q6Ieq5o+Q5rWu5bGCKi9cclxuLnppdGlGaXhlZHtkaXNwbGF5OiBibG9jazsgd2lkdGg6IDEyMHJweDsgaGVpZ2h0OiA2MHJweDsgdGV4dC1hbGlnbjogY2VudGVyO3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTtyaWdodDozMHJweDtib3R0b206MTY4cnB4O31cclxuLnppdGlGaXhlZCB0ZXh0e2NvbG9yOiAjMzMzOyBmb250LXNpemU6IDI0cnB4OyBsaW5lLWhlaWdodDogNDRycHg7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyByaWdodDogMDt9XHJcblxyXG4vKuS8mOaDoOaPkOekuuiuoeeul+aCrOa1riovXHJcbi5jb3VudFRpcHNGaXhlZHtkaXNwbGF5OiBibG9jaztiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNDAsMjA5LDAuOTMpO2xpbmUtaGVpZ2h0OiA2NHJweDsgaGVpZ2h0OiA2NHJweDsgZm9udC1zaXplOiAyNHJweDt0ZXh0LWFsaWduOiBjZW50ZXI7Y29sb3I6ICMzMzM7IHBvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTtsZWZ0OjA7Ym90dG9tOjEwMHJweDt3aWR0aDoxMDAlO31cclxuLmNvdW50VGlwc0ZpeGVkIHRleHR7Y29sb3I6ICNmZjY2MDA7IGZvbnQtc2l6ZTogMjhycHg7fVxyXG4uY291bnRUaXBzRml4ZWQgaW1hZ2V7d2lkdGg6IDE0cnB4OyBoZWlnaHQ6IDI0cnB4OyBtYXJnaW4tbGVmdDogMTJycHg7fSIsbnVsbF19 */
</style>