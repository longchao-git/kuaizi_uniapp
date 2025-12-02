<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view class="search_box">
			<form>
				<view class="box">
					<view class="searchIcon">
						<image src="/static/image/quan_sou.png" @tap="sousou"></image>
					</view><input type="text" placeholder="搜索商家" class="text" @input="inputvalue" :value="kong"
						placeholder-style="color:#999;" @confirm="sousou">
				</view>
			</form>
		</view>
		<view class="page_cont_box search_contBox">
			<view class="page_cont">
				<view class="search">
					<view class="bt">
						<view class="fl">
							<text class="tyTitle">历史搜索</text>
						</view>
						<view class="fr" @tap="clearup">
							<image src="/static/image/clear-btn.png" class="fl ico"></image>
						</view>
						<view class="clear"></view>
					</view>
					<view class="ml10 mt10">
						<view v-for="(item, index) in hisSearch" :key="index" :data-itm="item" class=" mr10 his_link"
							@tap="hislink">{{item}}</view>
					</view>
				</view>
				<view class="search">
					<view class="bt">
						<view class="tyTitle">热门搜索</view>
						<view class="clear"></view>
					</view>
					<view class="mt10 ml10">
						<view v-for="(item, idx) in hotSearch" :key="idx" :data-idx="hotSearch[idx]" @tap="resou"
							class="fl mr10 mb10 hot_link">
							{{hotSearch[idx]}}
						</view>
						<view class="clear"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/indexSearch/search.js
	var app = getApp();
	var double = true;

	export default {
		data() {
			return {
				pageimg: app.globalData._CFG.IMG_URL || '',
				hotSearch: [],
				hisSearch: [],
				kong: '',
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onShow: function() {
			app.globalData._CFG.cateid = '';
			var that = this;
			app.globalData.hotSearch({
				"page": 1
			}, function(res) {
				uni.getStorage({
					key: 'hisSearch',
					success: function(res) {
						that.hisSearch = res.data
						that.kong = ''
					}
				});

				if (res.error == '0') {
					that.hotSearch = res.data.hots;
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},
		onShareAppMessage: function() {
			app.globalData.share('微信小程序外卖', '/pages/index/index');
		},
		methods: {
			inputvalue: function(e) {
				app.globalData._CFG.title = e.detail.value;
			},
			sousou: function(e) {

				var hisSearch = this.hisSearch;
				if (!hisSearch) {
					hisSearch = []
				}
				hisSearch.reverse();

				if (app.globalData._CFG.title != '' && app.globalData._CFG.title != null) {
					if (hisSearch.length >= 1) {
						for (var i = 0; i < hisSearch.length; i++) {
							if (app.globalData._CFG.title == hisSearch[i]) {
								hisSearch.splice(i, 1);
								hisSearch.push(app.globalData._CFG.title);
								break;
							} else {
								if (i == hisSearch.length - 1) {
									//判断是最后一次时
									hisSearch.push(app.globalData._CFG.title);
								}
							}
						}
					} else {
						hisSearch.push(app.globalData._CFG.title);
					}
				}

				hisSearch.reverse();
				this.hisSearch = hisSearch
				this.kong = ''
				uni.setStorage({
					//存储搜索历史记录
					key: 'hisSearch',
					data: hisSearch
				});
				app.globalData.topage('../searchshoplist/shoplist');
			},
			resou: function(e) {
				console.log(333)
				app.globalData._CFG.title = e.currentTarget.dataset.idx;
				this.sousou();
			},
			clearup: function(e) {
				uni.clearStorage({
					key: 'hisSearch'
				});
				this.hisSearch = [];
			},
			hislink: function(e) {
				app.globalData._CFG.title = e.currentTarget.dataset.itm;
				app.globalData.topage('../searchshoplist/shoplist');
			}
		}
	};
</script>
<style>
	page {
		background: #FAFAFA;
	}

	.search_box {
		padding: 10rpx 25rpx;
		position: fixed;
		width: 750rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #EDEDED;
	}

	.search_box .box {
		height: 68rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
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

	/* #ifdef MP-ALIPAY  */
	.search_box .box .text {
		height: 60rpx !important;
	}

	/* #endif */
	.search_box .box .text {
		background: #EDEDED;
		border-radius: 0 8rpx 8rpx 0;
		height: 68rpx;
		font-size: 28rpx;
		float: left;
		line-height: 68rpx;
		color: #333;
		width: 610rpx;
	}

	.search_box .box .btn {
		background: none;
		float: right;
		font-size: 32rpx;
		color: #333;
		width: 90rpx;
		text-align: right;
		height: 68rpx;
		line-height: 68rpx;
		padding: 0;
	}

	.search_box .box .btn:after {
		border: 0 none;
	}

	.search_contBox {
		padding-top: 92rpx;
		background: #ffffff;
		height: 100%;
		box-sizing: border-box;
	}

	.search_contBox .search {
		margin: 20rpx 0 30rpx;
	}

	.search_contBox .bt {
		padding: 0 20rpx;
		line-height: 48rpx;
	}

	.search_contBox .bt .ico {
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
		margin-top: 10rpx;
	}

	.search_contBox .bt .fr {
		width: 36rpx;
	}

	.search_contBox .hot_link {
		height: 70rpx;
		line-height: 70rpx;
		background: #F7F7F7;
		border-radius: 6rpx;
		display: inline-block;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #888;
		letter-spacing: 2rpx;
	}

	.search_contBox .pub_list {
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
	}

	.search_contBox .his_link {
		height: 70rpx;
		line-height: 70rpx;
		background: #F7F7F7;
		border-radius: 6rpx;
		display: inline-block;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #888;
		letter-spacing: 2rpx;
	}

	.tyTitle {
		font-size: 28rpx;
		color: #333;
	}
</style>