<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view class="search_box">
			<form>
				<view class="box">
					<view class="searchIcon">
						<image src="/static/image/quan_sou.png" class="ico"></image>
					</view>
					<view class="text" @tap="backup">
						<block v-if="title == ''">搜索商家</block>
						<block v-else><text class="black3">{{title}}</text></block>
					</view>
				</view>
			</form>
		</view>
		<scroll-view scroll-y="true" class="page_cont search_contBox" @scrolltolower="more">
			<view v-for="(list, shopidx) in lists" :key="shopidx" class="shopList" mode="aspectFill" :id="list.shop_id"
				@tap="todetail">
				<view class="top">
					<view class="left_pic">
						<image mode="aspectFill" style="width:124rpx;height:124rpx;" :src="list.logo"></image>
						<image src="/static/image/label_new.png" class="tag" v-if="list.is_new == 1"></image>
						<view class="state" v-if="list.yyst != '1'">打烊了</view>
						<!-- <view class='num' wx:if="{{item.totalnum > 0}}">{{item.totalnum}}</view> -->
					</view>
					<view class="list-text">
						<view class="shopTitle">
							<!-- <rich-text class="title" :nodes="list.title"></rich-text> -->
							<text style='color:#222222;font-size: 28rpx;'>{{list.title}}</text>
							<text v-if="wordLength2[shopidx] > 18">...</text>
						</view>
						<view class="yuding" v-if="list.tips_label != ''">{{list.tips_label}}</view>
						<view class="peisong" v-if="list.huodong.length>0">
							<view v-for="(HDlist, HDidx) in list.huodong" :key="HDidx" class="huodong" v-if="HDidx<5">
								{{HDlist.title}}
							</view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				<view :class="'productList ' + (shopidx === isActive ? 'active' : '')" v-if="list.products.length > 0">
					<view v-for="(proList, proIndex) in list.products" :key="proIndex" class="productLi">
						<view class="productImg">
							<image :src="proList.photo"></image>
						</view>
						<view class="productInfor">
							<view class="proTitle">
								<view class="Mb">
									<!-- <rich-text :nodes="proList.title" class="productTitle"></rich-text> -->
									<text style='color:#2998ff'>{{proList.title}}</text>
									<view class="mbout">
										<view class="mb1"></view>
										<view class="mb2"></view>
									</view>
								</view>
								<text class="shengluehao">...</text>
							</view>
							<!-- 已售{{proList.sales}}  -->
							<view class="sales">赞{{proList.good}}</view>
							<view class="productPrice">€<text>{{proList.price}}</text></view>
						</view>
						<view class="clear"></view>
					</view>
				</view>
				<view class="zhankai" v-if="list.products.length > 2" @tap.stop="zhankai" :data-index="shopidx">
					<view v-if="shopidx === isActive">收起<image src="/static/image/topBottom2.png"></image>
					</view>
					<view v-else>展开更多商品{{list.products.length}}个<image src="/static/image/topBottom.png"></image>
					</view>
				</view>
			</view>
			<view class="weui-loadmore" :hidden="loadhide">
				<image src="/static/image/loading.gif"></image>
				<text class="weui-loadmore__tips">正在加载</text>
			</view>
			<view :hidden="morehidden" class="morelist" @tap="tosearch">没有更多啦,试试<text>搜索</text>吧</view>
			<!--无数据-开始-->
			<NoData :show="!nodata" text="没有找到对应的商家~" />
			<!--无数据-结束-->
		</scroll-view>
	</view>
</template>

<script>
	var common = require("../../js/ecart.js");
	var app = getApp();
	var ecart = null;
	var double = true;

	export default {
		data() {
			return {
				lists: [],
				pageimg: app.globalData._CFG.IMG_URL || '',
				cat_id: '',
				topmask: true,
				morehidden: true,
				loadhide: true,
				page: 1,
				title: '',
				nodata: true,
				isActive: '',
				tempText: "",
				wordLength: [],
				wordLength2: [] // wordLength3:[],
					// wordLength4:[]
					,
				HDidx: 0,
				shopidx: "",
				list: {
					shop_id: ""
				},
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {
			var that = this; //    console.log("搜索内容",app._CFG.title);
			// app._CFG.lng = 117.26061;
			// app._CFG.lat = 31.8512;
			// app._CFG.title = "测试";

			app.globalData.shopSearchs({
				"page": 1,
				"type": 'shops',
				"title": app.globalData._CFG.title
			}, function(res) {
				console.log(res);

				if (res.error == '0') {
					for (let i = 0; i < res.data.items.length; i++) {
						ecart = new common.ECart(res.data.items[i].shop_id);
						res.data.items[i].totalnum = ecart.total_count();
						that.wordLength.push(res.data.items[i].title
							.length); // for (let j = 0; j < res.data.items[i].products.length; j++) {
						//   that.data.wordLength3.push(res.data.items[i].products[j].title.length);
						// };
						// console.log(that.data.wordLength3)
					}

					;

					if (res.data.items == '') {
						that.nodata = false
					} else {
						that.nodata = true
					}
					that.lists = res.data.items
					that.wordLength2 = that.wordLength // wordLength4: that.data.wordLength3
					that.shaixuan();
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
			that.title = app.globalData._CFG.title
			that.tempText = app.globalData._CFG.title
		},
		onShareAppMessage: function(e) {
			return {
				title: '微信小程序外卖',
				path: '/pages/searchshoplist/shoplist'
			};
		},
		methods: {
			backup: function() {
				app.globalData.topage('../indexSearch/search', "back");
			},
			todetail: function(e) {
				var id = e.currentTarget.id;
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('../shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
			},
			more: function() {
				var page = this.page;
				page++;
				var that = this; //数据筛选

				app.globalData.shopSearchs({
					"page": page,
					"type": 'shops',
					"title": app.globalData._CFG.title
				}, function(res) {
					if (res.error == '0') {
						for (var i = 0; i < res.data.items.length; i++) {
							ecart = new common.ECart(res.data.items[i].shop_id);
							res.data.items[i].totalnum = ecart.total_count();
						}

						if (res.data.items.length == 0) {
							that.morehidden = false
							that.loadhide = true
						} else {
							that.loadhide = false
							that.lists = that.lists.concat(res.data.items)
							that.page = page;
						}

						that.shaixuan();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				}); // that.getFilter();
			},
			zhankai: function(e) {
				var proindex = e.currentTarget.dataset.index;

				if (proindex === this.isActive) {
					this.isActive = '';
				} else {
					this.isActive = proindex;
				}
			},
			shaixuan: function() {
				var newJson = JSON.parse(JSON.stringify(this.lists));
				this.digui(newJson);
				this.lists = newJson;
			},
			digui: function(newJson, obj, key) {
				// 递归方法，来遍历最内层的字符串并通过正则来替换
				var that = this;
				var reg = new RegExp(that.tempText, 'g');

				if (newJson.constructor == Array) {
					newJson.forEach(function(item, index) {
						if (item.constructor == String) {
							obj[key].splice(index, 1, item.replace(reg, that.tempText));
						} else {
							that.digui(item, newJson);
						}
					});
				} else if (newJson.constructor == Object) {
					var json = {};

					for (var key in newJson) {
						json[key] = newJson;
						that.digui(newJson[key], newJson, key);
					}
				} else if (newJson.constructor == String) {
					// 这里做全局替换
					if (key) {
						obj[key] = newJson.replace(reg, that.tempText);
					}
				}
			},

			tosearch() {
				console.log("占位：函数 tosearch 未声明");
			}

		}
	};
</script>
<style>
	.search_box {
		background: #ffffff;
		padding: 10rpx 25rpx;
		position: fixed;
		width: 750rpx;
		box-sizing: border-box;
		z-index: 1;
		border-bottom: 1rpx solid #EDEDED;
	}

	.search_box .box {
		height: 68rpx;
		width: 100%;
	}

	.searchIcon {
		float: left;
		width: 90rpx;
		height: 68rpx;
		background: #EDEDED;
		border-radius: 8rpx 0 0 8rpx;
	}

	.searchIcon image {
		width: 25rpx;
		height: 28rpx;
		margin-left: 40rpx;
		margin-top: 20rpx;
	}

	.search_box .box .text {
		background: #EDEDED;
		border-radius: 0 8rpx 8rpx 0;
		height: 68rpx;
		font-size: 28rpx;
		float: left;
		line-height: 68rpx;
		color: #999;
		width: 610rpx;
	}

	.search_contBox {
		padding-top: 90rpx;
		height: 100%;
		box-sizing: border-box;
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

	.shopList {
		background: #fff;
		font-size: 24rpx;
		position: relative;
		margin-bottom: 16rpx;
	}

	.shopList .top {
		display: flex;
		padding: 20rpx 24rpx;
	}

	.shopList .left_pic {
		width: 80rpx;
		height: 80rpx;
		float: left;
		background: #f8f8f8;
		position: relative;
		overflow: hidden;
	}

	.shopList .left_pic image {
		max-width: 100%;
		max-height: 100%;
	}

	.shopList .left_pic .tag {
		position: absolute;
		left: -2rpx;
		top: -2rpx;
		width: 56rpx;
		height: 56rpx;
	}

	.shopList .left_pic .state {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		line-height: 32rpx;
		text-align: center;
		background: #bbb;
		color: #fff;
		display: block;
		font-size: 22rpx;
	}

	.shopList .list-text {
		margin-left: 20rpx;
		float: left;
		width: 594rpx;
	}

	.shopList .list-text .title {
		font-size: 32rpx;
		font-weight: bold;
		max-width: 540rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		display: inline-block;
	}

	.shopList .list-text .shopTitle text {
		font-size: 32rpx;
		font-weight: bold;
	}

	.shopList .list-text .yuding {
		padding: 0 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 22rpx;
		color: #fff;
		background: #4DBD4D;
		display: inline-block;
	}

	.shopList .list-text .peisong {
		margin-left: -4rpx;
		margin-top: 4rpx;
	}

	.shopList .list-text .peisong .huodong {
		display: inline-block;
		border: 1rpx solid #FCE9E9;
		color: #FF4D5B;
		border-radius: 4rpx;
		font-size: 22rpx;
		padding: 0 4rpx;
		margin: 4rpx 4rpx;
	}

	.productList {
		max-height: 356rpx;
		overflow: hidden;
		margin: 0 24rpx;
	}

	.active {
		max-height: unset;
		height: auto;
	}

	.productLi {
		border-top: 2rpx solid #eee;
		padding: 16rpx 0;
	}

	.productImg {
		width: 144rpx;
		height: 144rpx;
		float: left;
	}

	.productImg image {
		width: 100%;
		height: 100%;
	}

	.productInfor {
		width: 420rpx;
		float: left;
		margin-left: 20rpx;
	}

	.productTitle {
		font-size: 32rpx;
		color: #333;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 380rpx;
		overflow: hidden;
		font-weight: bold;
		height: 32rpx;
		line-height: 32rpx;
		display: inline-block;
	}

	.sales {
		font-size: 24rpx;
		color: #999;
		margin-top: 15rpx;
	}

	.productPrice {
		font-size: 24rpx;
		color: #FA4C34;
		margin-top: 15rpx;
	}

	.productPrice text {
		font-size: 36rpx;
		margin-left: 10rpx;
	}

	.zhankai {
		font-size: 24rpx;
		color: #666;
		border-top: 2rpx solid #eee;
		padding: 20rpx 24rpx;
		line-height: 40rpx;
		text-align: center;
	}

	.zhankai image {
		width: 24rpx;
		height: 14rpx;
		margin-left: 10rpx;
	}

	.proTitle {
		width: 100%;
		height: 32rpx;
		position: relative;
	}

	.Mb {
		position: absolute;
		top: 0;
		left: 0;
		height: 32rpx;
		width: 390rpx;
		z-index: 999;
		white-space: nowrap;
	}

	.shengluehao {
		position: absolute;
		right: 0;
		top: 0;
		display: block;
		height: 32rpx;
		line-height: 32rpx;
		width: 35rpx;
		z-index: 1;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.mbout {
		display: inline-block;
		height: 32rpx;
		width: 350rpx;
	}

	.mb1 {
		width: 35rpx;
		height: 100%;
		display: inline-block;
	}

	.mb2 {
		background: #fff;
		height: 100%;
		display: inline-block;
		width: calc(100% - 30rpx)
	}
</style>