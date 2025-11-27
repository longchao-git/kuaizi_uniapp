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
			<view class="none-cont" :hidden="nodata">
				<view class="main">
					<image src="/static/image/noorder.png"></image>
					<view class="black6">没有找到对应的商家~</view>
				</view>
			</view>
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
						that.setData({
							nodata: false
						});
					} else {
						that.setData({
							nodata: true
						});
					}

					;
					that.setData({
						lists: res.data.items,
						wordLength2: that.wordLength // wordLength4: that.data.wordLength3

					});
					that.shaixuan();
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
			that.setData({
				title: app.globalData._CFG.title,
				tempText: app.globalData._CFG.title
			});
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
							that.setData({
								morehidden: false,
								loadhide: true
							});
						} else {
							that.setData({
								loadhide: false,
								lists: that.lists.concat(res.data.items),
								page: page
							});
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
					this.setData({
						isActive: ''
					});
				} else {
					this.setData({
						isActive: proindex
					});
				}
			},
			shaixuan: function() {
				var newJson = JSON.parse(JSON.stringify(this.lists));
				this.digui(newJson);
				this.setData({
					lists: newJson
				});
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwaGh5dkFJJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWEsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUM7QUFDcEosa0JBQWtCLGFBQWEsQ0FBQyxVQUFVLENBQUM7QUFDM0MsWUFBWSxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyw0QkFBNEIsQ0FBQztBQUNuRyxrQkFBa0IsV0FBVyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQztBQUNqRix3QkFBd0IsbUJBQW1CLENBQUMsNEJBQTRCLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDOztBQUVoSyxpQkFBaUIsaUJBQWlCLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDOztBQUVyRSxlQUFlLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0I7QUFDdEYscUJBQXFCLFlBQVksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLENBQUM7QUFDakgsVUFBVSxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUM7QUFDbEcsZUFBZSxjQUFjLENBQUM7O0FBRTlCLFVBQVUsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsb0JBQW9CLENBQUM7QUFDckYsZUFBZSxhQUFhLEVBQUUsbUJBQW1CLENBQUM7QUFDbEQsb0JBQW9CLFlBQVksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDO0FBQ3RILDBCQUEwQixlQUFlLENBQUMsZ0JBQWdCLENBQUM7QUFDM0QseUJBQXlCLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQztBQUNsRywyQkFBMkIsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDO0FBQ3RLLHFCQUFxQixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO0FBQ2pFLDRCQUE0QixnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQztBQUNqSyxxQ0FBcUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUM7QUFDeEUsNkJBQTZCLGVBQWUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDO0FBQ3BKLDhCQUE4QixrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUNuRSx1Q0FBdUMscUJBQXFCLENBQUMsMEJBQTBCLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFNUssYUFBYSxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUM7QUFDbEUsUUFBUSxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7QUFDdkMsWUFBWSwyQkFBMkIsRUFBRSxnQkFBZ0IsQ0FBQztBQUMxRCxZQUFZLFlBQVksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQ3BELGtCQUFrQixVQUFVLENBQUMsWUFBWSxDQUFDO0FBQzFDLGNBQWMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztBQUMxRCxjQUFjLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCLENBQUM7QUFDbE0sT0FBTyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7QUFDckQsY0FBYyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUM7QUFDL0QsbUJBQW1CLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDO0FBQ3RELFNBQVMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDO0FBQzlILGVBQWUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQzs7QUFFNUQsVUFBVSxVQUFVLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0FBQ3RELElBQUksa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQztBQUNqRyxhQUFhLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztBQUNuSyxPQUFPLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7QUFDeEQsS0FBSyxXQUFXLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDO0FBQ25ELEtBQUssZUFBZSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNlYXJjaF9ib3h7IGJhY2tncm91bmQ6ICNmZmZmZmY7IHBhZGRpbmc6IDEwcnB4IDI1cnB4O3Bvc2l0aW9uOmZpeGVkO3dpZHRoOjc1MHJweDtib3gtc2l6aW5nOmJvcmRlci1ib3g7ei1pbmRleDoxO2JvcmRlci1ib3R0b206MXJweCBzb2xpZCAjRURFREVEO31cclxuLnNlYXJjaF9ib3ggLmJveHsgaGVpZ2h0OiA2OHJweDt3aWR0aDoxMDAlO31cclxuLnNlYXJjaEljb257ZmxvYXQ6IGxlZnQ7d2lkdGg6OTBycHg7aGVpZ2h0OiA2OHJweDtiYWNrZ3JvdW5kOiAjRURFREVEO2JvcmRlci1yYWRpdXM6IDhycHggMCAwIDhycHg7fVxyXG4uc2VhcmNoSWNvbiBpbWFnZXt3aWR0aDoyNXJweDtoZWlnaHQ6IDI4cnB4O21hcmdpbi1sZWZ0OiA0MHJweDttYXJnaW4tdG9wOiAyMHJweDt9XHJcbi5zZWFyY2hfYm94IC5ib3ggLnRleHR7IGJhY2tncm91bmQ6ICNFREVERUQ7Ym9yZGVyLXJhZGl1czogMCA4cnB4IDhycHggMDtoZWlnaHQ6IDY4cnB4OyBmb250LXNpemU6IDI4cnB4O2Zsb2F0OiBsZWZ0O2xpbmUtaGVpZ2h0OiA2OHJweDtjb2xvcjojOTk5O3dpZHRoOjYxMHJweDt9XHJcblxyXG4uc2VhcmNoX2NvbnRCb3h7IHBhZGRpbmctdG9wOjkwcnB4O2hlaWdodDoxMDAlO2JveC1zaXppbmc6Ym9yZGVyLWJveDt9XHJcblxyXG4ud2V1aS1sb2FkbW9yZXtoZWlnaHQ6IDgwcnB4O2xpbmUtaGVpZ2h0OiA4MHJweDtiYWNrZ3JvdW5kOiAjZjhmOGY4O3RleHQtYWxpZ246IGNlbnRlcn1cclxuLndldWktbG9hZG1vcmUgaW1hZ2V7d2lkdGg6IDQwcnB4O2hlaWdodDogNDBycHg7bWFyZ2luLXJpZ2h0OiAxMHJweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246IG1pZGRsZTt9XHJcbi5tb3JlbGlzdHt0ZXh0LWFsaWduOmNlbnRlcjtoZWlnaHQ6ODBycHg7bGluZS1oZWlnaHQ6ODBycHg7YmFja2dyb3VuZDojZjhmOGY4O21hcmdpbi1ib3R0b206MjBycHg7fVxyXG4ubW9yZWxpc3QgdGV4dHtjb2xvcjogIzBmOGZkMDt9XHJcblxyXG4uc2hvcExpc3R7YmFja2dyb3VuZDogI2ZmZjtmb250LXNpemU6IDI0cnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7bWFyZ2luLWJvdHRvbTogMTZycHg7fVxyXG4uc2hvcExpc3QgLnRvcHtkaXNwbGF5OiBmbGV4OyBwYWRkaW5nOjIwcnB4IDI0cnB4O31cclxuLnNob3BMaXN0IC5sZWZ0X3BpY3t3aWR0aDogODBycHg7aGVpZ2h0OiA4MHJweDtmbG9hdDogbGVmdDsgYmFja2dyb3VuZDogI2Y4ZjhmODsgcG9zaXRpb246IHJlbGF0aXZlOyBvdmVyZmxvdzogaGlkZGVuO31cclxuLnNob3BMaXN0IC5sZWZ0X3BpYyBpbWFnZXttYXgtd2lkdGg6IDEwMCU7bWF4LWhlaWdodDogMTAwJTt9XHJcbi5zaG9wTGlzdCAubGVmdF9waWMgLnRhZ3twb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IC0ycnB4OyB0b3A6IC0ycnB4OyB3aWR0aDogNTZycHg7IGhlaWdodDogNTZycHg7fVxyXG4uc2hvcExpc3QgLmxlZnRfcGljIC5zdGF0ZXtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7IHJpZ2h0OjA7IGJvdHRvbTowOyBsaW5lLWhlaWdodDozMnJweDt0ZXh0LWFsaWduOmNlbnRlcjtiYWNrZ3JvdW5kOiNiYmI7Y29sb3I6I2ZmZjtkaXNwbGF5OiBibG9jaztmb250LXNpemU6MjJycHg7fVxyXG4uc2hvcExpc3QgLmxpc3QtdGV4dHttYXJnaW4tbGVmdDogMjBycHg7ZmxvYXQ6IGxlZnQ7d2lkdGg6NTk0cnB4O31cclxuLnNob3BMaXN0IC5saXN0LXRleHQgLnRpdGxle2ZvbnQtc2l6ZTogMzJycHg7Zm9udC13ZWlnaHQ6IGJvbGQ7bWF4LXdpZHRoOjU0MHJweDt3aGl0ZS1zcGFjZTpub3dyYXA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztvdmVyZmxvdzogaGlkZGVuO2Rpc3BsYXk6IGlubGluZS1ibG9jazt9XHJcbi5zaG9wTGlzdCAubGlzdC10ZXh0IC5zaG9wVGl0bGUgdGV4dHtmb250LXNpemU6IDMycnB4O2ZvbnQtd2VpZ2h0OiBib2xkO31cclxuLnNob3BMaXN0IC5saXN0LXRleHQgLnl1ZGluZ3twYWRkaW5nOjAgMjBycHg7aGVpZ2h0OiA0MHJweDtsaW5lLWhlaWdodDogNDBycHg7Zm9udC1zaXplOiAyMnJweDtjb2xvcjojZmZmO2JhY2tncm91bmQ6ICM0REJENEQ7ZGlzcGxheTogaW5saW5lLWJsb2NrO31cclxuLnNob3BMaXN0IC5saXN0LXRleHQgLnBlaXNvbmd7bWFyZ2luLWxlZnQ6IC00cnB4OyBtYXJnaW4tdG9wOiA0cnB4O31cclxuLnNob3BMaXN0IC5saXN0LXRleHQgLnBlaXNvbmcgLmh1b2Rvbmd7ZGlzcGxheTogaW5saW5lLWJsb2NrO2JvcmRlcjogMXJweCBzb2xpZCAjRkNFOUU5O2NvbG9yOiAjRkY0RDVCO2JvcmRlci1yYWRpdXM6IDRycHg7Zm9udC1zaXplOiAyMnJweDtwYWRkaW5nOjAgNHJweDttYXJnaW46NHJweCA0cnB4O31cclxuXHJcbi5wcm9kdWN0TGlzdHttYXgtaGVpZ2h0OiAzNTZycHg7b3ZlcmZsb3c6IGhpZGRlbjsgbWFyZ2luOiAwIDI0cnB4O31cclxuLmFjdGl2ZXttYXgtaGVpZ2h0OiB1bnNldDtoZWlnaHQ6IGF1dG87fVxyXG4ucHJvZHVjdExpeyBib3JkZXItdG9wOiAycnB4IHNvbGlkICNlZWU7IHBhZGRpbmc6IDE2cnB4IDA7fVxyXG4ucHJvZHVjdEltZ3t3aWR0aDoxNDRycHg7aGVpZ2h0OiAxNDRycHg7ZmxvYXQ6IGxlZnQ7fVxyXG4ucHJvZHVjdEltZyBpbWFnZXt3aWR0aDoxMDAlO2hlaWdodDogMTAwJTt9XHJcbi5wcm9kdWN0SW5mb3J7d2lkdGg6NDIwcnB4O2Zsb2F0OiBsZWZ0O21hcmdpbi1sZWZ0OiAyMHJweDt9XHJcbi5wcm9kdWN0VGl0bGV7Zm9udC1zaXplOjMycnB4IDtjb2xvcjojMzMzO3doaXRlLXNwYWNlOiBub3dyYXA7dGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7bWF4LXdpZHRoOjM4MHJweDtvdmVyZmxvdzogaGlkZGVuO2ZvbnQtd2VpZ2h0OiBib2xkO2hlaWdodDogMzJycHg7bGluZS1oZWlnaHQ6IDMycnB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxyXG4uc2FsZXN7Zm9udC1zaXplOiAyNHJweDtjb2xvcjojOTk5O21hcmdpbi10b3A6IDE1cnB4O31cclxuLnByb2R1Y3RQcmljZXtmb250LXNpemU6MjRycHggO2NvbG9yOiNGQTRDMzQ7bWFyZ2luLXRvcDogMTVycHg7fVxyXG4ucHJvZHVjdFByaWNlIHRleHR7Zm9udC1zaXplOiAzNnJweDttYXJnaW4tbGVmdDoxMHJweDt9XHJcbi56aGFua2Fpe2ZvbnQtc2l6ZTogMjRycHg7Y29sb3I6IzY2Njtib3JkZXItdG9wOiAycnB4IHNvbGlkICNlZWU7IHBhZGRpbmc6MjBycHggMjRycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgdGV4dC1hbGlnbjogY2VudGVyO31cclxuLnpoYW5rYWkgaW1hZ2V7d2lkdGg6MjRycHg7aGVpZ2h0OiAxNHJweDttYXJnaW4tbGVmdDogMTBycHg7fVxyXG5cclxuLnByb1RpdGxle3dpZHRoOjEwMCU7aGVpZ2h0OiAzMnJweDtwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4uTWJ7cG9zaXRpb246IGFic29sdXRlO3RvcDowO2xlZnQ6IDA7aGVpZ2h0OiAzMnJweDt3aWR0aDozOTBycHg7ei1pbmRleDogOTk5O3doaXRlLXNwYWNlOiBub3dyYXA7fVxyXG4uc2hlbmdsdWVoYW97cG9zaXRpb246IGFic29sdXRlO3JpZ2h0OjA7dG9wOjA7ZGlzcGxheTogYmxvY2s7aGVpZ2h0OiAzMnJweDtsaW5lLWhlaWdodDogMzJycHg7d2lkdGg6MzVycHg7ei1pbmRleDogMTtmb250LXNpemU6MzJycHggO2NvbG9yOiMzMzM7Zm9udC13ZWlnaHQ6IGJvbGQ7fVxyXG4ubWJvdXR7ZGlzcGxheTogaW5saW5lLWJsb2NrO2hlaWdodDogMzJycHg7d2lkdGg6MzUwcnB4O31cclxuLm1iMXt3aWR0aDozNXJweDtoZWlnaHQ6MTAwJTtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxyXG4ubWIye2JhY2tncm91bmQ6I2ZmZjtoZWlnaHQ6MTAwJTtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7d2lkdGg6Y2FsYygxMDAlIC0gMzBycHgpfVxyXG4iXX0= */
</style>