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
						that.setData({
							hisSearch: res.data,
							kong: ''
						});
					}
				});

				if (res.error == '0') {
					that.setData({
						hotSearch: res.data.hots
					});
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
				this.setData({
					hisSearch: hisSearch,
					kong: ''
				});
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
				this.setData({
					hisSearch: []
				});
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwT1RMZUp5JTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEtBQUssbUJBQW1CLENBQUM7QUFDekIsY0FBYyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLGdDQUFnQyxDQUFDO0FBQ3RILG1CQUFtQixhQUFhLENBQUMsVUFBVSxDQUFDO0FBQzVDLFlBQVksV0FBVyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsNEJBQTRCLENBQUM7QUFDbkcsa0JBQWtCLFdBQVcsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUM7QUFDakYsd0JBQXdCLG1CQUFtQixDQUFDLDRCQUE0QixDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztBQUNoSyxzQkFBc0IsZUFBZSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7QUFDeEosNkJBQTZCLGNBQWMsQ0FBQztBQUM1QyxpQkFBaUIsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDO0FBQzFGLHlCQUF5QixxQkFBcUIsQ0FBQztBQUMvQyxxQkFBcUIsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7QUFDMUQsMEJBQTBCLFlBQVksRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUM7QUFDOUYsd0JBQXdCLFdBQVcsQ0FBQzs7QUFFcEMsMkJBQTJCLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDO0FBQzlMLDJCQUEyQix5QkFBeUIsRUFBRSxzQ0FBc0MsRUFBRSw4QkFBOEIsQ0FBQztBQUM3SCwyQkFBMkIsYUFBYSxFQUFFLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7QUFDOUwsU0FBUyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsicGFnZXtiYWNrZ3JvdW5kOiAjRkFGQUZBO31cclxuLnNlYXJjaF9ib3h7ICBwYWRkaW5nOiAxMHJweCAyNXJweDtwb3NpdGlvbjpmaXhlZDt3aWR0aDo3NTBycHg7Ym94LXNpemluZzpib3JkZXItYm94O2JvcmRlci1ib3R0b206MXJweCBzb2xpZCAjRURFREVEO31cclxuLnNlYXJjaF9ib3ggLmJveHsgIGhlaWdodDogNjhycHg7d2lkdGg6MTAwJTt9XHJcbi5zZWFyY2hJY29ue2Zsb2F0OiBsZWZ0O3dpZHRoOjkwcnB4O2hlaWdodDogNjhycHg7YmFja2dyb3VuZDogI0VERURFRDtib3JkZXItcmFkaXVzOiA4cnB4IDAgMCA4cnB4O31cclxuLnNlYXJjaEljb24gaW1hZ2V7d2lkdGg6MjVycHg7aGVpZ2h0OiAyOHJweDttYXJnaW4tbGVmdDogNDBycHg7bWFyZ2luLXRvcDogMjBycHg7fVxyXG4uc2VhcmNoX2JveCAuYm94IC50ZXh0eyBiYWNrZ3JvdW5kOiAjRURFREVEO2JvcmRlci1yYWRpdXM6IDAgOHJweCA4cnB4IDA7aGVpZ2h0OiA2OHJweDsgZm9udC1zaXplOiAyOHJweDtmbG9hdDogbGVmdDtsaW5lLWhlaWdodDogNjhycHg7Y29sb3I6IzMzMzt3aWR0aDo2MTBycHg7fVxyXG4uc2VhcmNoX2JveCAuYm94IC5idG57YmFja2dyb3VuZDpub25lO2Zsb2F0OiByaWdodDtmb250LXNpemU6IDMycnB4O2NvbG9yOiMzMzM7d2lkdGg6OTBycHg7dGV4dC1hbGlnbjogcmlnaHQ7aGVpZ2h0OiA2OHJweDtsaW5lLWhlaWdodDogNjhycHg7cGFkZGluZzowO31cclxuLnNlYXJjaF9ib3ggLmJveCAuYnRuOmFmdGVyeyBib3JkZXI6IDAgbm9uZTt9XHJcbi5zZWFyY2hfY29udEJveHsgcGFkZGluZy10b3A6OTJycHg7IGJhY2tncm91bmQ6ICNmZmZmZmY7aGVpZ2h0OjEwMCU7Ym94LXNpemluZzpib3JkZXItYm94O31cclxuLnNlYXJjaF9jb250Qm94IC5zZWFyY2h7IG1hcmdpbjogMjBycHggMCAzMHJweDt9IFxyXG4uc2VhcmNoX2NvbnRCb3ggLmJ0eyBwYWRkaW5nOiAwIDIwcnB4OyBsaW5lLWhlaWdodDogNDhycHg7fVxyXG4uc2VhcmNoX2NvbnRCb3ggLmJ0IC5pY297IHdpZHRoOiAyOHJweDsgaGVpZ2h0OiAyOHJweDsgbWFyZ2luLXJpZ2h0OiAxMnJweDsgbWFyZ2luLXRvcDogMTBycHg7fVxyXG4uc2VhcmNoX2NvbnRCb3ggLmJ0IC5mcnt3aWR0aDozNnJweDt9XHJcblxyXG4uc2VhcmNoX2NvbnRCb3ggLmhvdF9saW5reyBoZWlnaHQ6IDcwcnB4OyBsaW5lLWhlaWdodDogNzBycHg7YmFja2dyb3VuZDogI0Y3RjdGNztib3JkZXItcmFkaXVzOiA2cnB4O2Rpc3BsYXk6IGlubGluZS1ibG9jaztwYWRkaW5nOjAgMjBycHg7Zm9udC1zaXplOiAyOHJweDtjb2xvcjojODg4ICA7bGV0dGVyLXNwYWNpbmc6IDJycHg7fVxyXG4uc2VhcmNoX2NvbnRCb3ggLnB1Yl9saXN0eyAtd2Via2l0LWJveC1wYWNrOiBqdXN0aWZ5OyAtd2Via2l0LWp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO31cclxuLnNlYXJjaF9jb250Qm94IC5oaXNfbGlua3sgaGVpZ2h0OiA3MHJweDsgbGluZS1oZWlnaHQ6IDcwcnB4O2JhY2tncm91bmQ6ICNGN0Y3Rjc7Ym9yZGVyLXJhZGl1czogNnJweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7cGFkZGluZzowIDIwcnB4O2ZvbnQtc2l6ZTogMjhycHg7Y29sb3I6Izg4OCAgO2xldHRlci1zcGFjaW5nOiAycnB4O31cclxuLnR5VGl0bGV7Zm9udC1zaXplOjI4cnB4IDtjb2xvcjojMzMzO31cclxuIl19 */
</style>