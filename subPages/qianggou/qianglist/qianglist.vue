<template>
	<view>
		<view style="background: white;">
			<view :style="'height: 100%; '" style="padding: 20rpx 0;">
				<view class="searchBox" v-if="type == 1">
					<image class="ico_search" src="/static/image/quan_sou.png" mode="aspectFit" @tap.stop="tosearch">
					</image>
					<!-- 	<view style="height: 64rpx;font-size: 28rpx;color: #999;line-height: 64rpx;">
						请输入商家名称或商品名称</view> -->
					<input placeholder="请输入商家名称或商品名称"
						style="height: 64rpx;font-size: 28rpx;color: #999;line-height: 64rpx;" v-model="search"
						@confirm="tosearch" />
				</view>
				<!--商家列表-开始-->
				<view class="shopLists_h">
					<block data-type="template" data-is="shoplists" data-attr="lists:shopLists">
						<view class="shoplistsNewBox">
							<view v-for="(item, index) in shopLists" :key="index" class="shopnewlists" @tap="gotoDetail"
								:id="item.qiang_id">
								<view class="logo">
									<image :src="item.photo" class="pic" mode="aspectFill"></image>
									<view class="num">
										{{ parseInt((((item.price-item.discount_price)/item.price)*100).toFixed(0)) }}%
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
						<NoData :show="shopLists.length == 0" />
					</block>
					<view style="height:1px"></view>
				</view>
			</view>

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
				OpenSettingShow: false,
				//下拉筛选浮动是否出现
				shopLists: [],
				page: 1,
				showToast: {
					isShow: false
				},
				cateid: '',
				type: 0,
				search: ''
			};
		},

		onLoad: function(options) {
			this.cateid = options.cateid

			if (options.type) {
				this.type = options.type
				if (options.title) {
					this.search = options.title
				}
			}

			this.page = 1
			;
			if (this.type == 0) {
				this.initData();
			} else {
				this.qiangSearch()
			}

		},
		onShow() {

		},
		//上来加载
		onReachBottom(e) {
			let page = this.page;
			this.page = page + 1
			;
			if (this.type == 0) {
				this.initData();
			} else {
				this.qiangSearch()
			}
		},

		onPullDownRefresh: function() {
			if (this.type == 0) {
				this.initData(1, function() {
					uni.stopPullDownRefresh();
				});
			} else {
				this.qiangSearch(1, function() {
					uni.stopPullDownRefresh();
				});
			}

		},

		methods: {
			tosearch() {
				this.page = 1
				;
				this.qiangSearch()
			},
			qiangSearch(setpage, completeCallback) {
				completeCallback = typeof completeCallback == 'function' ? completeCallback : function(res) {};
				var that = this;
				if (setpage == 0) {
					that.loading = true;
				}

				var page = setpage ? setpage : that.page;
				params.page = page;
				params.search = this.search
				app.globalData.qiangSearch(params, function(res) {
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
								that.shopLists = that.shopLists.concat(res.data.items)
								;
							} else {
								that.shopLists = res.data.items
								;
							};
						} else {
							if (!setpage) {
								that.shopLists = that.shopLists.concat(res.data.items)
								;
								uni.showToast({
									title: "暂无更多数据~"
								});
							} else {
								that.shopLists = res.data.items
								;
							};
						};
					};
				});
			},

			initData(setpage, completeCallback) {
				completeCallback = typeof completeCallback == 'function' ? completeCallback : function(res) {};
				var that = this;
				if (setpage == 0) {
					that.loading = true;
				}

				var page = setpage ? setpage : that.page;
				params.page = page;
				params.cate = this.cateid
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
								that.shopLists = that.shopLists.concat(res.data.items)
								;
							} else {
								that.shopLists = res.data.items
								;
							};
						} else {
							if (!setpage) {
								that.shopLists = that.shopLists.concat(res.data.items)
								;
								uni.showToast({
									title: "暂无更多数据~"
								});
							} else {
								that.shopLists = res.data.items
								;
							};
						};
					};
				});
			},


			//去商家详情
			gotoDetail(e) {
				var id = e.currentTarget.id;
				app.globalData.topage('/subPages/qianggou/qiangdetail/qiangdetail?id=' + id);
			},

			//授权
			closeSetting() {
				uni.pubOpenSetting(false);
			},


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
		color: #ee8080;
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

	
</style>



