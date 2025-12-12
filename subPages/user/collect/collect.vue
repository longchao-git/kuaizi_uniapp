<template>
	<view>
		<view class="collect_lis" :hidden="!nostatusHidden">
			<view class="shop_card_list">
				<view v-for="(item, index) in collect_lis" :key="index" class="shop_card">
					<!-- 商家封面图 -->
					<view class="card_cover" @tap="getdetail" :id="item.shop_id">
						<image :src="item.shop_show ? item.shop_show : item.logo" class="cover_img" mode="aspectFill">
						</image>
						<image src="/static/image/label_new.png" class="new_tag" v-if="item.is_new == 1"></image>
					</view>

					<!-- 商家信息 -->
					<view class="card_info">
						<view class="shop_header">
							<view class="shop_name" @tap="getdetail" :id="item.shop_id">{{item.title}}</view>
							<view class="rating_score" v-if="item.avg_score">
								<image src="/static/image/score_icon.png" class="score_icon" mode="aspectFit"></image>
								<text class="score_text">{{item.avg_score}}</text>
							</view>
						</view>
						<view class="delivery_info">
							<view class="delivery_time">
								<image src="/static/image/time_icon.png" class="time_icon" mode="aspectFit"></image>
								<text>{{item.pei_time}}分钟</text>
							</view>
							<view class="cancel_btn" @tap="quxiao" :data-idx="index" :data-shopid="item.shop_id">
								取消关注
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>


		<NoData :show="!nostatusHidden" text="暂无收藏商家" />


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
				nostatusHidden: true
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
							that.nostatusHidden = true;
						} else {
							that.nostatusHidden = false;
						}

						that.collect_lis = res.data.collection;
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
						that.collect_lis = collect_lis;
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
				app.globalData.topage('/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
			}
		}
	};
</script>
<style>
	page {
		background-color: #fff;
		min-height: 100vh;
	}

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

	/* 商家卡片列表样式 */
	.shop_card_list {
		padding: 30rpx 25rpx;
		background: #fff;
	}

	.shop_card {
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
	}

	/* 商家封面图 */
	.card_cover {
		position: relative;
		width: 700rpx;
		height: 308rpx;
		overflow: hidden;
	}

	.cover_img {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 24rpx;
	}

	.new_tag {
		position: absolute;
		left: 0rpx;
		top: 0rpx;
		width: 80rpx;
		height: 80rpx;
		z-index: 2;
	}

	/* 商家信息 */
	.card_info {
		padding: 20rpx 24rpx;
	}

	.shop_header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12rpx;
	}

	.shop_name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 16rpx;
	}

	.rating_score {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666666;
	}

	.score_icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 8rpx;
	}

	.score_text {
		font-weight: 600;
		color: #333333;
	}

	.delivery_info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.delivery_time {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #999999;
	}

	.time_icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 6rpx;
	}

	.cancel_btn {
		font-size: 24rpx;
		color: #ff797c;
		padding: 8rpx 20rpx;
		border: 1rpx solid #ff797c;
		border-radius: 24rpx;
	}
</style>