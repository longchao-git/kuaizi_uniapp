<template>
	<view class="container" v-if="productInfo.discount_price">
		<view class="swiperTop relative">
			<swiper circular="true" :autoplay="true" style='height:750rpx;width: 750rpx ;' :interval='3000'
				:disable-programmatic-animation='true' :disable-touch='true' easing-function='linear'
				:indicator-dots='true' indicator-color='rgba(255, 255, 255, 0.55)' indicator-active-color='#ffffff'>
				<swiper-item v-for="(item,index) in [productInfo.photo]" :key="index">
					<view class="color-62540B font24 relative">
						<image :src="item" class="homeBaner" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="bgf " style="border-radius:  12rpx 12rpx 0 0;background: #ff797c;padding: 32rpx;">
			<view class="line54 font-weight-500  " style="color: #fff;font-size: 36rpx;">{{productInfo.title}}
			</view>
			<view style="color: #fff;font-size: 28rpx;">{{productInfo.shop_name}}</view>
		</view>

		<view class="flex-wrp  "
			style="justify-content: space-between;padding: 24rpx 32rpx;border-radius:  12rpx 12rpx 0 0;border-bottom: 1rpx solid #eee;">
			<view class="flex-wrp  mt16">
				<view class="font32" style="font-size: 48rpx;color: #ff797c;">€{{productInfo.discount_price}}</view>
				<view style="font-size: 28rpx;text-decoration: line-through;color: #909090;margin-left: 16rpx;">
					€{{productInfo.price}}</view>
			</view>
			<view style="font-size: 28rpx;">剩余{{productInfo.sku}}/{{productInfo.count_sku}}</view>
		</view>
		<view class="flex-wrp" style="padding: 12rpx 32rpx;justify-content: space-between;padding-bottom: 32rpx;"
			@click="isShow = true">
			<view class="flex-wrp" v-for="(item,index) in productInfo.notes_label">
				<image src="/static/image/icon_notice3x.png" mode="" style="width: 32rpx;height: 32rpx;"></image>
				<view style="margin-left: 4rpx;font-size: 24rpx;color: #ff797c;">{{item.title}}</view>
			</view>
		</view>
		<view class=" bgf" style="background: white;border-top: 16rpx solid #f2f2f2;">
			<view style="color:#171D1E;padding: 16rpx 32rpx;font-size: 32rpx;font-weight: 500;">使用规则</view>
			<view class="flex-wrp " style="width: 750rpx;padding-bottom: 16rpx;padding-left: 16rpx;">
				<text space="emsp">{{productInfo.rules}}</text>
			</view>
		</view>
		<view class="bgf" style="background: white;border-top: 16rpx solid #f2f2f2;padding: 16rpx 32rpx;">
			<view style="color: #ff797c;font-size: 32rpx;">团购截止时间：{{productInfo.use_ltime_label}}</view>
		</view>
		<view class="flex-wrp"
			style="background: white;border-top: 16rpx solid #f2f2f2;padding: 16rpx 32rpx;justify-content: space-between;">
			<view>
				<view style="font-size: 32rpx;color: #2c2c2c;">{{productInfo.shop_name}}</view>
				<view style="font-size: 24rpx;color: #909090;margin-top: 8rpx;">{{productInfo.shop_addr}}</view>
				<view style="font-size: 28rpx;color: #ff797c;margin-top: 8rpx;"
					@click="setClipboardData(productInfo.shop_addr)">点击复制地址</view>
			</view>
			<image src="/static/image/order-details/btn_fr_order1x.png" mode="" style="width: 88rpx;height: 88rpx;"
				@click="bindTapPuhone">
			</image>
		</view>
		<view class=" bgf" style="padding-bottom: 160rpx;">
			<view style="color:#171D1E;padding: 32rpx;font-size: 32rpx;font-weight: 500;">商品详情</view>
			<view class="flex-wrp " style="flex-direction: column;width: 750rpx;">
				<view v-html="productInfo.info"></view>
			</view>
		</view>
		<view class="goods_footer">
			<view class="goods_footer_s">
				<view style="display:flex;align-items:center;">

					<view class="goods_footer_s_ti">
						<view class="goods_footer_s_ti1">
							€{{productInfo.discount_price}}
						</view>
						<view class="goods_footer_s_ti2" style="text-decoration: line-through;"> €{{productInfo.price}}
						</view>
					</view>
					<view>
						<view class="num"
							style="padding: 4rpx 8rpx ;border-radius:10rpx ;color: #fff;text-align: center;margin-left: 16rpx;border: 1rpx solid #fff;">
							{{((productInfo.price-productInfo.discount_price)/productInfo.price*100).toFixed(0)}}%
						</view>
					</view>
				</view>
				<block>
					<view class="goods_footer_s_btn goods_footer_s_btn_op" @click="bingTaoCilck">立即购买</view>
				</block>
			</view>
		</view>
		<view class="mask" v-if="isShow" style="z-index: 20;">
			<view class="maskView">
				<image src="/static/image/index_btn_close2x.png" @click="isShow=false" mode="" class="index_btn"
					style="width: 32rpx;height: 32rpx;"></image>
				<view style="color: #2c2c2c; font-size: 32rpx;text-align: center;">说明</view>
				<view class='flex-wrp' style="padding: 16rpx 0;border-bottom: 1rpx solid #eee;"
					v-for="(item,index) in productInfo.notes_label">
					<image src="/static/image/icon_notice3x.png" mode="" style="width: 48rpx;height: 48rpx;"></image>
					<view style="margin-left: 16rpx;">
						<view style="margin-left: 4rpx;font-size: 24rpx;color: #ff797c;">{{item.title}}</view>
						<view style="margin-left: 4rpx;font-size: 24rpx;color: #909090;">{{item.note}}</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	// import api from '@/api/api.js'
	let app = getApp()
	export default {
		data() {
			return {
				productInfo: {},
				productId: '',
				isShow: false
			}
		},
		onLoad(options) {
			this.productId = options.id
			this.productGet()
		},
		methods: {
			bingTaoCilck() {
				app.globalData.topage('/subPages/order/payOrder/payOrder?id=' + this.productId + '&type=' + '1');
			},
			bindTapPuhone() {
				uni.makePhoneCall({
					phoneNumber: this.productInfo.shop_phone
				})
			},
			setClipboardData(data) {
				uni.setClipboardData({
					data: data,
				})
			},
			productGet() {
				let that = this
				let params = {
					qiang_id: this.productId
				}
				app.globalData.productGet(params, function(res) {
					if (res.error == "0") {
						that.productInfo = res.data.detail
					};
				})
			}

		}
	}
</script>

<style scoped lang="less">
	.container {
		background: #fff;
	}

	.mask {
		position: fixed;
		/* top: calc(88upx + constant(safe-area-inset-top));
		top: calc(88upx + env(safe-area-inset-top)); */
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.maskView {
		position: absolute;
		width: 686rpx;
		border-radius: 24rpx 24rpx 0 0;
		background: white;
		padding: 32rpx;
		bottom: 0;
	}

	.index_btn {
		position: absolute;
		z-index: 20;
		left: 32rpx;
		top: 32rpx;
	}

	.swiperTop {


		width: 750rpx;
		height: 750rpx;

		.homeBaner {
			width: 750rpx;
			height: 750rpx;
		}
	}

	.fiex_view {
		background: #FFF;
		box-shadow: 0px -2rpx 2rpx 0px rgba(0, 0, 0, 0.06);
		width: 750rpx;
		height: 160rpx;
		position: fixed;
		bottom: 0;

		>view {
			position: absolute;
			top: 32rpx;
			right: 32rpx;
			width: 224rpx;
			height: 96rpx;
			background: #EA623D;
			border-radius: 124rpx;
			text-align: center;
			line-height: 96rpx;
			color: #FFF;
			font-weight: 500;
		}
	}

	.goods_footer {
		height: 140rpx;
		background: #FF797C;
		border-radius: 30rpx 30rpx 0 0;
		position: fixed;
		z-index: 12;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.goods_footer_s {
		margin-left: 30rpx;
		margin-right: 40rpx;
		width: 654rpx;
		height: 76rpx;
		/* background-color: red; */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods_footer_s_num {
		background: #FFFFFF;
		border-radius: 24rpx;
		height: 76rpx;
		width: 76rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #FF797C;
		margin-right: 26rpx;
	}

	.goods_footer_s_ti1 {
		display: flex;
		align-items: center;
		height: 40rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		margin-bottom: 4rpx;
	}

	.goods_footer_s_ti2 {
		display: flex;
		align-items: center;
		height: 32rpx;
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.goods_footer_s_btn {
		width: 180rpx;
		height: 76rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #3B96B1;
	}

	.goods_footer_s_btn_op {
		opacity: .8;
	}

	.goods_footer .cart {
		margin-left: 16rpx;
		margin-top: -12rpx;
		position: relative;
	}

	.goods_footer .cart .num {
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		color: #FF797C;
		background: #ffffff;
		font-weight: bold;
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
</style>