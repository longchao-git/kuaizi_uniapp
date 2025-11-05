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
		<view class="collect_lis" :hidden="!nostatusHidden">
			<block v-for="(item, index) in collect_lis" :key="index">
				<view class="collect_list mb10">
					<view class="img fl" @tap="getdetail" :id="item.shop_id">
						<image :src="pageimg + '' + item.logo"></image>
					</view>
					<view class="wz_r fr">
						<button class="btn" size="mini" @tap="quxiao" :data-idx="index"
							:data-shopid="item.shop_id">取消关注</button>
						<view class="fontcl4">{{item.pei_time}}分钟</view>
						<!--<view class="black9">{{item.jili_label}}</view>-->
					</view>
					<view class="wz_box" @tap="getdetail" :id="item.shop_id">
						<view class="bt overflow_clear">{{item.title}}</view>
						<view class="wz " style="margin-top: 20rpx;">
							<view class='starS'>
								<image src='/static/image/Star-pre3x.png' class="icon30"></image>{{item.score}}
							</view>
							<block v-if="item.comments">评价{{item.comments}}</block>
						</view>
						<view class=" shoplists fl flex-wrp">
							<view class="text_amount">
								起送€{{item.min_amount}}
							</view>
							<span class='text_freight'>
								<block v-if="item.freight == 0">免配送费</block>
								<!-- <span class='del'>€{{item.freight}}</span> -->
								<block v-else-if="item.is_reduce_pei == 1">配送费{{item.reduceEd_freight}}起 </block>
								<block v-else>配送€{{item.freight}}起</block>
							</span>
						</view>
						<view class="support">
							<span v-if="item.is_refund == 1">极速退款</span>
							<span v-if="item.is_ziti == 1">支持自提</span>

						</view>
						<!-- <view class="wz black9">€{{item.min_amount}}起送 / <text v-if="item.freight > 0">配送费{{item.freight}}€</text><text v-else>免配送费</text></view> -->
					</view>
					<view class="clear"></view>
				</view>
			</block>
		</view>


		<view :hidden="nostatusHidden" class="none-cont">
			<view class="main">
				<image src="/static/image/noorder.png"></image>
				<view class="black6">暂无收藏商家</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp(),
		double = true;

	export default {
		data() {
			return {
				collect_lis: [],
				pageimg: app.globalData._CFG.IMG_URL || '',
				nostatusHidden: true,
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onShow: function() {
			this.https();
		},
		onShareAppMessage: function() {
			app.globalData.share('微信小程序外卖', '/pages/index/index');
		},
		methods: {
			https: function() {
				var that = this;
				app.globalData.mineCollect({
					"page": 1,
					"type": 1
				}, function(res) {
					if (res.error == '0') {
						if (res.data.collection.length > 0) {
							that.setData({
								nostatusHidden: true
							});
						} else {
							that.setData({
								nostatusHidden: false
							});
						}

						that.setData({
							collect_lis: res.data.collection
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			quxiao: function(e) {
				var that = this,
					shop_id = e.currentTarget.dataset.shopid,
					collect_lis = that.collect_lis,
					idx = e.currentTarget.dataset.idx;
				app.globalData.tapCollect({
					"type": 'waimai',
					"can_id": shop_id,
					"status": 0
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: '取消收藏'
						});
						collect_lis.splice(idx, 1);
						that.setData({
							collect_lis: collect_lis
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				}, true);
			},
			getdetail: function(e) {
				var id = e.currentTarget.id;
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('../shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
			}
		}
	};
</script>
<style>
	/*点评星星样式*/
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

	.collect_list {
		background: #fff;
		padding: 20rpx;
	}

	.collect_list .img {
		width: 198rpx;
		height: 198rpx;
		box-shadow: 0px 0px 40rpx 0px rgba(163, 163, 164, 0.1);
		border-radius: 24rpx;
		overflow: hidden;
	}

	.collect_list .img image {
		width: 198rpx;
		height: 198rpx;
	}

	.collect_list .wz_box {
		margin-left: 214rpx;
		margin-right: 180rpx;
	}

	.collect_list .wz_box .wz {
		line-height: 44rpx;
	}

	.collect_list .wz_box .bt {
		font-size: 32rpx;
		margin-bottom: 8rpx;
		color: #262628;
		font-weight: bold;
	}

	.collect_list .wz_r {
		text-align: right;
		line-height: 36rpx;
	}

	.collect_list .wz_r .btn {
		height: 48rpx;
		background: #fff;
		padding: 0 20rpx;
		line-height: 48rpx;
		font-size: 24rpx;
		color: #666;
	}

	.collect_list .starS {
		color: #FF797C;
		font-size: 28rpx;
		margin-left: 10rpx;
	}

	.collect_list .starS image {
		margin-right: 10rpx;
	}

	.shoplists {
		padding: 16rpx 0;
	}


	.support span {
		overflow: hidden;
		border: 2rpx solid #037E98;
		color: #037E98;
		display: inline-block;
		margin-right: 8rpx;
		padding: 0 8rpx;
		border-radius: 4rpx;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwYzNZRVVBJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxjQUFjLGFBQWEsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLHFCQUFxQixDQUFDO0FBQ3hILHVCQUF1QixhQUFhLEVBQUUsYUFBYSxDQUFDO0FBQ3BELGVBQWUsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDO0FBQzFILG9CQUFvQixhQUFhLEVBQUUsYUFBYSxDQUFDOztBQUVqRCxjQUFjLGdCQUFnQixFQUFFLGNBQWMsQ0FBQztBQUMvQyxtQkFBbUIsYUFBYSxFQUFFLGNBQWMsRUFBRSwwQkFBMEIsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsQ0FBQztBQUNwSCx5QkFBeUIsYUFBYSxFQUFFLGNBQWMsQ0FBQztBQUN2RCxzQkFBc0IsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7QUFDaEUsMEJBQTBCLGtCQUFrQixDQUFDO0FBQzdDLDBCQUEwQixnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQztBQUNoRSxvQkFBb0IsaUJBQWlCLEVBQUUsa0JBQWtCLENBQUM7QUFDMUQsMEJBQTBCLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8q54K56K+E5pif5pif5qC35byPKi9cclxuLmV2bHRfc3Rhcl9iZ3t3aWR0aDogMTcwcnB4OyBoZWlnaHQ6IDI0cnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7IG92ZXJmbG93OiBoaWRkZW47IGxpbmUtaGVpZ2h0OiAwOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxyXG4uZXZsdF9zdGFyX2JnIGltYWdlLmJne3dpZHRoOiAxNzBycHg7IGhlaWdodDogMjRycHg7fVxyXG4uZXZsdF9zdGFyX2Jhcntwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgaGVpZ2h0OiAxMDAlOyBsaW5lLWhlaWdodDogMDsgb3ZlcmZsb3c6IGhpZGRlbjsgZGlzcGxheTogaW5saW5lLWJsb2NrO31cclxuLmV2bHRfc3Rhcl9iZyBpbWFnZXt3aWR0aDogMTcwcnB4OyBoZWlnaHQ6IDI0cnB4O31cclxuXHJcbi5jb2xsZWN0X2xpc3R7YmFja2dyb3VuZDogI2ZmZjsgcGFkZGluZzogMjBycHg7fVxyXG4uY29sbGVjdF9saXN0IC5pbWd7d2lkdGg6IDExNnJweDsgaGVpZ2h0OiAxMTZycHg7IGJvcmRlcjogMnJweCBzb2xpZCAjZTZlNmU2OyBib3JkZXItcmFkaXVzOiA4cnB4OyBvdmVyZmxvdzogaGlkZGVuO31cclxuLmNvbGxlY3RfbGlzdCAuaW1nIGltYWdle3dpZHRoOiAxMTZycHg7IGhlaWdodDogMTE2cnB4O31cclxuLmNvbGxlY3RfbGlzdCAud3pfYm94e21hcmdpbi1sZWZ0OiAxNDBycHg7IG1hcmdpbi1yaWdodDogMTgwcnB4O31cclxuLmNvbGxlY3RfbGlzdCAud3pfYm94IC53entsaW5lLWhlaWdodDogNDRycHg7fVxyXG4uY29sbGVjdF9saXN0IC53el9ib3ggLmJ0e2ZvbnQtc2l6ZTogMjhycHg7IG1hcmdpbi1ib3R0b206IDhycHg7fVxyXG4uY29sbGVjdF9saXN0IC53el9ye3RleHQtYWxpZ246IHJpZ2h0OyBsaW5lLWhlaWdodDogMzZycHg7fVxyXG4uY29sbGVjdF9saXN0IC53el9yIC5idG57IGhlaWdodDogNDhycHg7IGJhY2tncm91bmQ6ICNmZmY7IHBhZGRpbmc6MCAyMHJweDsgbGluZS1oZWlnaHQ6IDQ4cnB4OyBmb250LXNpemU6IDI0cnB4OyBjb2xvcjogIzY2Njt9XHJcblxyXG5cclxuIl19 */
</style>