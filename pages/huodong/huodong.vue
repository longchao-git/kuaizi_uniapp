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
		<view :class="'actPro ' + (actDetail.type == '1' ? 'shop' : 'pro')">
			<view class="actAd">
				<image :src="actDetail.banner" mode="widthFix"></image>
			</view>
			<view class="actTit">{{actDetail.title}}</view>
			<view class="actTime">活动时间：{{stime}}-{{ltime}}</view>
			<view class="actShop_list_box" v-if="actDetail.type == '1'">
				<view v-for="(item, index) in actShops" :key="index" class="list" @tap="toShopDelt"
					:data-shop_id="item.shop_id">
					<view class="img fl">
						<image :src="item.logo" mode="aspectFill"></image>
						<block v-if="item.yy_status==1 && item.yysj_status==1"></block>
						<block v-else>
							<view class="blacktip">打烊了</view>
						</block>
					</view>
					<view class="wz_box">
						<view class="bt overflow_clear">{{item.title}}</view>
						<view class="score_box">
							<view class="evlt_star_bg fl">
								<image src="/static/image/evlt_star_bg.png"></image>
								<view class="evlt_star_bar" :style="'width:' + (item.avg_score*20) + '%'">
									<image src="/static/image/evlt_star_bar.png"></image>
								</view>
							</view>
							<text class="fl ml5 fontcl3">{{item.avg_score}}分</text>
							<!-- <text class="fl ml10 black9">已售{{item.orders}}单</text> -->
						</view>
						<view class="price_box black9">
							<view class="fl">€{{item.min_amount}}起送 / <block v-if="item.freight > 0">
									配送费{{item.freight}}€</block>
								<block v-else>免配送费</block>
							</view>
							<view class="fr">{{item.juli_label}}/<text class="fontcl1">{{item.pei_time}}分钟</text></view>
						</view>
						<view class="pei_type" :style="'background:#' + item.peiType.line_color + ';'">
							{{item.peiType.label}}</view>
					</view>
					<view class="clear"></view>
					<view class="hd" v-if="item.huodong.length > 0">
						<view class="right" @tap.stop="tapHd" :data-index="index" v-if="item.huodong.length > 3">
							{{item.huodong.length}}个活动<image class="ico" mode="aspectFit"
								:src="'/static/image/' + (hdShow == index ? 'btn_arrow_up_small3x.png' : 'btn_arrow_down_small3x.png')">
							</image>
						</view>
						<ul :class="hdShow == index ? 'on' : ''">
							<li v-for="(li, idx) in item.huodong" :key="idx">
								<i class="ico" :style="'background:#' + li.color">{{li.word}}</i>
								{{li.title}}
							</li>
						</ul>
					</view>
				</view>
			</view>
			<view class="actPro_list_box" v-if="actDetail.type == '2'">
				<view v-for="(item, index) in actPros" :key="index" class="list" @tap="toShopDelt"
					:data-shop_id="item.shop_id" :data-product_id="item.product_id">
					<view class="box">
						<view class="img">
							<image :src="item.photo" mode="aspectFill"></image>
						</view>
						<view class="wz_box">
							<view class="bt overflow_clear">{{item.title}}</view>
							<view class="price fontcl2">€{{item.price}}</view>
							<view class="from black9 overflow_clear">{{item.intro}}</view>
							<view class="btn"></view>
						</view>
					</view>
				</view>
				<view class="clear"></view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var params = {
		"huodong_id": '',
		"lng": '',
		"lat": ''
	};

	export default {
		data() {
			return {
				actDetail: '',
				//详情；
				actShops: [],
				//存放活动商家列表数据；
				actPros: [],
				//存放活动商品列表数据；
				hdShow: null,
				ltime: "",
				stime: "",
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {
			params.huodong_id = e.huodong_id; // params.huodong_id = 4;

			params.lat = app.globalData._CFG.lat;
			params.lng = app.globalData._CFG.lng;
		},
		onShow: function() {
			var that = this;
			app.globalData.huodong(params, function(res) {
				// console.log(res);
				if (res.error == "0") {
					if (res.data.detail.type == '1') {
						that.setData({
							actShops: res.data.lists,
							actDetail: res.data.detail,
							stime: that.toDate(res.data.detail.stime),
							ltime: that.toDate(res.data.detail.ltime)
						});
					} else {
						that.setData({
							actPros: res.data.lists,
							actDetail: res.data.detail,
							stime: that.toDate(res.data.detail.stime),
							ltime: that.toDate(res.data.detail.ltime)
						});
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

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			//转时间
			toDate: function(number) {
				//时间戳转成日期
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '/';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = date.getHours();
				var m = date.getMinutes();
				var s = date.getSeconds();
				return Y + M + D;
			},

			//去商品详情页；
			toShopDelt(e) {
				var shop_id = e.currentTarget.dataset.shop_id;
				var product_id = e.currentTarget.dataset.product_id;
				app.globalData._CFG.shoptail = shop_id;
				var url = '../shoptail/shoptail?id=' + shop_id + '&product_id=' + product_id;
				app.globalData.topage(url);
			},

			//商家列表活动折叠展开
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
			}

		}
	};
</script>
<style>
	.actPro {
		min-height: 100%;
	}

	.actPro.shop {
		background: #592818;
	}

	.actPro.pro {
		background: #BD140D;
	}

	.actPro .actAd {
		width: 100%;
		height: auto;
		overflow: hidden;
		background: #fff;
		line-height: 0;
	}

	.actPro .actAd image {
		width: 100%;
	}

	.actPro .actTit {
		text-align: center;
		line-height: 40rpx;
		font-size: 32rpx;
		color: #fff;
		margin: 20rpx auto;
	}

	.actPro .actTime {
		margin: 20rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 8rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 16rpx 30rpx;
		color: #fff;
	}

	.actShop_list_box {
		padding-bottom: 2rpx;
	}

	.actShop_list_box .list {
		margin: 20rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 20rpx;
	}

	.actShop_list_box .list .img {
		width: 140rpx;
		height: 140rpx;
		border: 2rpx solid #e6e6e6;
		border-radius: 8rpx;
		overflow: hidden;
		background: #eee;
		position: relative;
	}

	.actShop_list_box .img image {
		width: 100%;
		height: 100%;
	}

	.actShop_list_box .img .blacktip {
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

	.actShop_list_box .wz_box {
		margin-left: 160rpx;
		position: relative;
		height: 140rpx;
	}

	.actShop_list_box .wz_box .bt {
		margin-right: 120rpx;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.actShop_list_box .price_box {
		overflow: hidden;
		font-size: 24rpx;
	}

	.actShop_list_box .pei_type {
		position: absolute;
		right: 0rpx;
		top: 0rpx;
		line-height: 38rpx;
		height: 38rpx;
		border-radius: 16rpx 0 16rpx 0;
		padding: 0 16rpx 0 8rpx;
		color: #fff;
		font-size: 22rpx;
		background: #F74663;
	}

	.actShop_list_box .pei_type::after {
		content: '';
		width: 6rpx;
		height: 6rpx;
		border-radius: 100%;
		background: #fff;
		position: absolute;
		right: 6rpx;
		top: 6rpx;
	}

	.actShop_list_box .pei_type.pei_type2 {
		background: #0f88d0;
	}

	.actShop_list_box .score_box {
		overflow: hidden;
		margin: 20rpx 0;
		font-size: 24rpx;
	}

	.actShop_list_box .score_box .evlt_star_bg {
		margin-left: -6rpx;
	}

	.evlt_star_bg {
		width: 200rpx;
		height: 31rpx;
		position: relative;
		overflow: hidden;
		line-height: 0;
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
		width: 200rpx;
		height: 31rpx;
	}

	.actPro_list_box {
		padding: 20rpx 10rpx 20rpx 20rpx;
	}

	.actPro_list_box .list {
		width: 50%;
		float: left;
		margin-bottom: 20rpx;
	}

	.actPro_list_box .list .box {
		margin-right: 10rpx;
		background: #fff;
	}

	.actPro_list_box .list .img {
		height: 0;
		padding: 50%;
		overflow: hidden;
		position: relative;
		background: #eee;
	}

	.actPro_list_box .list .img image {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.actPro_list_box .list .wz_box {
		padding: 10rpx 20rpx;
		position: relative;
	}

	.actPro_list_box .list .wz_box .btn {
		position: absolute;
		right: 16rpx;
		bottom: 20rpx;
		width: 48rpx;
		height: 48rpx;
		background-size: contain;
	}

	.actPro_list_box .list .wz_box .bt {
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.actPro_list_box .list .wz_box .price {
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.actPro_list_box .list .wz_box .from {
		line-height: 40rpx;
		font-size: 24rpx;
		height: 40rpx;
	}


	.hd {
		overflow: hidden;
		margin-top: 10rpx;
	}

	.hd .right {
		float: right;
		width: 172rpx;
		text-align: right;
		font-size: 24rpx;
		color: #999;
	}

	.hd .right .ico {
		width: 20rpx;
		height: 20rpx;
		margin-left: 8rpx;
		display: inline-block;
		font-size: 20rpx;
		color: #fff;
	}

	.hd ul {
		display: block;
		margin-right: 180rpx;
		max-height: 144rpx;
	}

	.hd ul.on {
		height: auto;
		max-height: unset;
	}

	.hd ul li {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24rpx;
		color: #666;
		line-height: 32rpx;
		display: block;
	}

	.hd ul li .ico {
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwUDRvdFZYJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVEsZ0JBQWdCLENBQUM7QUFDekIsYUFBYSxtQkFBbUIsQ0FBQztBQUNqQyxZQUFZLG1CQUFtQixDQUFDO0FBQ2hDLGVBQWUsV0FBVyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7QUFDN0YscUJBQXFCLFdBQVcsQ0FBQztBQUNqQyxnQkFBZ0Isa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixDQUFDO0FBQzFHLGlCQUFpQixhQUFhLEVBQUUsaUNBQWlDLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxDQUFDO0FBQ2hLLGtCQUFrQixvQkFBb0IsQ0FBQztBQUN2Qyx3QkFBd0IsYUFBYSxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsQ0FBQztBQUM3Riw2QkFBNkIsYUFBYSxFQUFFLGNBQWMsRUFBRSwwQkFBMEIsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQztBQUNwSyw2QkFBNkIsV0FBVyxFQUFFLFlBQVksQ0FBQztBQUN2RCxpQ0FBaUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQztBQUNwTCwwQkFBMEIsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxDQUFDO0FBQ2xGLDhCQUE4QixvQkFBb0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQztBQUN6Riw2QkFBNkIsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7QUFDaEUsNEJBQTRCLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLDhCQUE4QixFQUFFLHVCQUF1QixFQUFFLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQztBQUN0TixtQ0FBbUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQztBQUM1SixzQ0FBc0MsbUJBQW1CLENBQUM7QUFDMUQsNkJBQTZCLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQztBQUNqRiwyQ0FBMkMsa0JBQWtCLENBQUM7QUFDOUQsY0FBYyxhQUFhLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQztBQUNqRyxlQUFlLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQztBQUMxSCxvQkFBb0IsYUFBYSxFQUFFLGFBQWEsQ0FBQzs7QUFFakQsaUJBQWlCLGdDQUFnQyxDQUFDO0FBQ2xELHVCQUF1QixVQUFVLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDO0FBQ3BFLDRCQUE0QixtQkFBbUIsRUFBRSxnQkFBZ0IsQ0FBQztBQUNsRSw0QkFBNEIsU0FBUyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUM1RyxrQ0FBa0MsV0FBVyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQ2hHLCtCQUErQixvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQztBQUN4RSxvQ0FBb0Msa0JBQWtCLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLHdCQUF3QixDQUFDO0FBQzFJLG1DQUFtQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUN4RSxzQ0FBc0Msa0JBQWtCLEVBQUUsZ0JBQWdCLENBQUM7QUFDM0UscUNBQXFDLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLGFBQWEsQ0FBQzs7O0NBR3ZGLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7Q0FDdEMsV0FBVyxZQUFZLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQztDQUN6RixnQkFBZ0IsWUFBWSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7Q0FDckgsT0FBTyxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLENBQUM7Q0FDaEUsVUFBVSxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7Q0FDekMsVUFBVSxlQUFlLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGNBQWMsQ0FBQztDQUN2SSxlQUFlLFlBQVksRUFBRSxhQUFhLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLHVCQUF1QixDQUFDIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5hY3RQcm97bWluLWhlaWdodDogMTAwJTt9XHJcbi5hY3RQcm8uc2hvcHtiYWNrZ3JvdW5kOiAjNTkyODE4O31cclxuLmFjdFByby5wcm97YmFja2dyb3VuZDogI0JEMTQwRDt9XHJcbi5hY3RQcm8gLmFjdEFke3dpZHRoOiAxMDAlOyBoZWlnaHQ6IGF1dG87IG92ZXJmbG93OiBoaWRkZW47IGJhY2tncm91bmQ6ICNmZmY7IGxpbmUtaGVpZ2h0OiAwO31cclxuLmFjdFBybyAuYWN0QWQgaW1hZ2V7d2lkdGg6IDEwMCU7fVxyXG4uYWN0UHJvIC5hY3RUaXR7dGV4dC1hbGlnbjogY2VudGVyOyBsaW5lLWhlaWdodDogNDBycHg7IGZvbnQtc2l6ZTogMzJycHg7IGNvbG9yOiAjZmZmOyBtYXJnaW46IDIwcnB4IGF1dG87fVxyXG4uYWN0UHJvIC5hY3RUaW1le21hcmdpbjogMjBycHg7IGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4yKTsgYm9yZGVyLXJhZGl1czogOHJweDsgZm9udC1zaXplOiAyOHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBwYWRkaW5nOiAxNnJweCAzMHJweDsgY29sb3I6ICNmZmY7fVxyXG4uYWN0U2hvcF9saXN0X2JveHtwYWRkaW5nLWJvdHRvbTogMnJweDt9XHJcbi5hY3RTaG9wX2xpc3RfYm94IC5saXN0e21hcmdpbjogMjBycHg7IGJhY2tncm91bmQ6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDhycHg7IHBhZGRpbmc6IDIwcnB4O31cclxuLmFjdFNob3BfbGlzdF9ib3ggLmxpc3QgLmltZ3t3aWR0aDogMTQwcnB4OyBoZWlnaHQ6IDE0MHJweDsgYm9yZGVyOiAycnB4IHNvbGlkICNlNmU2ZTY7IGJvcmRlci1yYWRpdXM6IDhycHg7IG92ZXJmbG93OiBoaWRkZW47IGJhY2tncm91bmQ6ICNlZWU7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5hY3RTaG9wX2xpc3RfYm94IC5pbWcgaW1hZ2V7d2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTt9XHJcbi5hY3RTaG9wX2xpc3RfYm94IC5pbWcgLmJsYWNrdGlwe3dpZHRoOiAxMDAlO2hlaWdodDogNDBycHg7cG9zaXRpb246IGFic29sdXRlO2JvdHRvbTogMDtsZWZ0OjA7dGV4dC1hbGlnbjogY2VudGVyO2xpbmUtaGVpZ2h0OiA0MHJweDtmb250LXNpemU6IDI0cnB4O2JhY2tncm91bmQ6ICNiYmI7IGNvbG9yOiAjZmZmO31cclxuLmFjdFNob3BfbGlzdF9ib3ggLnd6X2JveHttYXJnaW4tbGVmdDogMTYwcnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7IGhlaWdodDogMTQwcnB4O31cclxuLmFjdFNob3BfbGlzdF9ib3ggLnd6X2JveCAuYnR7bWFyZ2luLXJpZ2h0OiAxMjBycHg7IGZvbnQtc2l6ZTogMjhycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDt9XHJcbi5hY3RTaG9wX2xpc3RfYm94IC5wcmljZV9ib3h7b3ZlcmZsb3c6IGhpZGRlbjsgZm9udC1zaXplOiAyNHJweDt9XHJcbi5hY3RTaG9wX2xpc3RfYm94IC5wZWlfdHlwZXtwb3NpdGlvbjogYWJzb2x1dGU7IHJpZ2h0OiAwcnB4OyB0b3A6IDBycHg7IGxpbmUtaGVpZ2h0OiAzOHJweDsgaGVpZ2h0OiAzOHJweDsgYm9yZGVyLXJhZGl1czogMTZycHggMCAxNnJweCAwOyBwYWRkaW5nOiAwIDE2cnB4IDAgOHJweDsgY29sb3I6ICNmZmY7Zm9udC1zaXplOiAyMnJweDsgYmFja2dyb3VuZDogI0Y3NDY2Mzt9XHJcbi5hY3RTaG9wX2xpc3RfYm94IC5wZWlfdHlwZTo6YWZ0ZXJ7Y29udGVudDogJyc7d2lkdGg6IDZycHg7IGhlaWdodDogNnJweDsgYm9yZGVyLXJhZGl1czogMTAwJTsgYmFja2dyb3VuZDogI2ZmZjsgcG9zaXRpb246IGFic29sdXRlOyByaWdodDogNnJweDsgdG9wOiA2cnB4O31cclxuLmFjdFNob3BfbGlzdF9ib3ggLnBlaV90eXBlLnBlaV90eXBlMntiYWNrZ3JvdW5kOiAjMGY4OGQwO31cclxuLmFjdFNob3BfbGlzdF9ib3ggLnNjb3JlX2JveHtvdmVyZmxvdzogaGlkZGVuOyBtYXJnaW46IDIwcnB4IDA7IGZvbnQtc2l6ZTogMjRycHg7fVxyXG4uYWN0U2hvcF9saXN0X2JveCAuc2NvcmVfYm94IC5ldmx0X3N0YXJfYmd7bWFyZ2luLWxlZnQ6IC02cnB4O31cclxuLmV2bHRfc3Rhcl9iZ3t3aWR0aDogMjAwcnB4OyBoZWlnaHQ6IDMxcnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7IG92ZXJmbG93OiBoaWRkZW47IGxpbmUtaGVpZ2h0OiAwO31cclxuLmV2bHRfc3Rhcl9iYXJ7cG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IGhlaWdodDogMTAwJTsgbGluZS1oZWlnaHQ6IDA7IG92ZXJmbG93OiBoaWRkZW47IGRpc3BsYXk6IGlubGluZS1ibG9jazt9XHJcbi5ldmx0X3N0YXJfYmcgaW1hZ2V7d2lkdGg6IDIwMHJweDsgaGVpZ2h0OiAzMXJweDt9XHJcblxyXG4uYWN0UHJvX2xpc3RfYm94e3BhZGRpbmc6IDIwcnB4IDEwcnB4IDIwcnB4IDIwcnB4O31cclxuLmFjdFByb19saXN0X2JveCAubGlzdHt3aWR0aDogNTAlO2Zsb2F0OiBsZWZ0OyBtYXJnaW4tYm90dG9tOiAyMHJweDt9XHJcbi5hY3RQcm9fbGlzdF9ib3ggLmxpc3QgLmJveHttYXJnaW4tcmlnaHQ6IDEwcnB4OyBiYWNrZ3JvdW5kOiAjZmZmO31cclxuLmFjdFByb19saXN0X2JveCAubGlzdCAuaW1ne2hlaWdodDogMDsgcGFkZGluZzogNTAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7IGJhY2tncm91bmQ6ICNlZWU7fVxyXG4uYWN0UHJvX2xpc3RfYm94IC5saXN0IC5pbWcgaW1hZ2V7d2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgcG9zaXRpb246YWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDt9XHJcbi5hY3RQcm9fbGlzdF9ib3ggLmxpc3QgLnd6X2JveHtwYWRkaW5nOiAxMHJweCAyMHJweDsgcG9zaXRpb246IHJlbGF0aXZlO31cclxuLmFjdFByb19saXN0X2JveCAubGlzdCAud3pfYm94IC5idG57cG9zaXRpb246IGFic29sdXRlOyByaWdodDogMTZycHg7IGJvdHRvbTogMjBycHg7IHdpZHRoOiA0OHJweDsgaGVpZ2h0OiA0OHJweDtiYWNrZ3JvdW5kLXNpemU6IGNvbnRhaW47fVxyXG4uYWN0UHJvX2xpc3RfYm94IC5saXN0IC53el9ib3ggLmJ0e2xpbmUtaGVpZ2h0OiA0MHJweDsgZm9udC1zaXplOiAyNHJweDt9XHJcbi5hY3RQcm9fbGlzdF9ib3ggLmxpc3QgLnd6X2JveCAucHJpY2V7bGluZS1oZWlnaHQ6IDQwcnB4OyBmb250LXNpemU6IDI0cnB4O31cclxuLmFjdFByb19saXN0X2JveCAubGlzdCAud3pfYm94IC5mcm9te2xpbmUtaGVpZ2h0OiA0MHJweDsgZm9udC1zaXplOiAyNHJweDtoZWlnaHQ6IDQwcnB4O31cclxuXHJcblxyXG4gLmhke292ZXJmbG93OiBoaWRkZW47bWFyZ2luLXRvcDoxMHJweDt9XHJcbiAuaGQgLnJpZ2h0e2Zsb2F0OiByaWdodDsgd2lkdGg6IDE3MnJweDsgdGV4dC1hbGlnbjogcmlnaHQ7IGZvbnQtc2l6ZTogMjRycHg7IGNvbG9yOiAjOTk5O31cclxuIC5oZCAucmlnaHQgLmljb3t3aWR0aDogMjBycHg7IGhlaWdodDogMjBycHg7IG1hcmdpbi1sZWZ0OiA4cnB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMjBycHg7IGNvbG9yOiAjZmZmO31cclxuIC5oZCB1bHtkaXNwbGF5OiBibG9jazsgbWFyZ2luLXJpZ2h0OiAxODBycHg7IG1heC1oZWlnaHQ6IDE0NHJweDt9XHJcbiAuaGQgdWwub257aGVpZ2h0OiBhdXRvOyBtYXgtaGVpZ2h0OnVuc2V0O31cclxuIC5oZCB1bCBsaXtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7IGZvbnQtc2l6ZTogMjRycHg7IGNvbG9yOiAjNjY2OyBsaW5lLWhlaWdodDogMzJycHg7IGRpc3BsYXk6IGJsb2NrO31cclxuIC5oZCB1bCBsaSAuaWNve3dpZHRoOiAzMnJweDsgaGVpZ2h0OiAzMnJweDsgZGlzcGxheTogaW5saW5lLWJsb2NrOyBib3JkZXItcmFkaXVzOiA4cnB4OyBsaW5lLWhlaWdodDogMzJycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgY29sb3I6ICNmZmY7IGZvbnQtc2l6ZTogMjRycHg7IGZvbnQtc3R5bGU6IG5vcm1hbDsgbWFyZ2luOjhycHggOHJweCA4cnB4IDA7fSJdfQ== */
</style>