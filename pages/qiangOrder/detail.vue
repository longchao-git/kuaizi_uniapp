<template>
	<view>

		<view class="flex-wrp"
			style="margin-top: 20rpx;padding: 16rpx 32rpx;background: white;border-bottom: 1rpx solid #eee;">
			<image :src="productInfo.photo" mode="aspectFill" style="width: 160rpx;height: 160rpx;"></image>
			<view class="ml20" style="flex: 1;">
				<view class="flex-wrp" style="justify-content: space-between;">
					<view>{{productInfo.qiang_title}}</view>
				</view>
				<view style="color: #909090;font-size: 28rpx;margin-top: 10rpx">
					数量：{{productInfo.qiang_number}}</view>
				<view class="flex-wrp">
					<view style="color: #ff797c;">€{{productInfo.qiang_discount_price}}</view>
					<view style="color: #909090;text-decoration: line-through;margin-left: 16rpx;">
						€{{productInfo.qiang_price}}</view>
				</view>
			</view>
		</view>
		<view class="flex-wrp"
			style="padding: 12rpx 32rpx;justify-content: space-between;padding-bottom: 32rpx;background: white;">
			<view class="flex-wrp" v-for="(item,index) in productInfo.note_label">
				<image src="/static/image/icon_notice3x.png" mode="" style="width: 32rpx;height: 32rpx;"></image>
				<view style="margin-left: 4rpx;font-size: 24rpx;color: #ff797c;">{{item.title}}</view>
			</view>
		</view>

		<view v-if="order_list&&order_list.number&&productInfo.show_btn.detail !='1'" class="flex-wrp"
			@click="bindTapMask"
			style="background: white;border-top: 16rpx solid #f2f2f2;padding: 16rpx 32rpx;justify-content: space-between;border-bottom: 1rpx solid #eee;">
			<view>
				<view style="font-size: 32rpx;color: #2c2c2c;">团购券</view>
				<view style="font-size: 24rpx;color: #909090;margin-top: 8rpx;"
					v-if="productInfo.ticket&&productInfo.ticket.use_ltime_label">
					有效期{{productInfo.ticket.use_ltime_label}}</view>

			</view>
			<image src="/static/image/order-details/btn_fr_order2x.png" mode="" style="width: 88rpx;height: 88rpx;">
			</image>
		</view>
		<view class="flex-wrp" v-if="order_list&&order_list.number&&productInfo.show_btn.detail !='1'"
			style="padding: 12rpx 32rpx;justify-content: space-between;padding-bottom: 32rpx;background: white;">
			<view style="font-size: 28rpx;color: #2c2c2c;">券码：{{order_list.number}}（{{order_list.qiang_number}}）张
			</view>
			<view style="margin-left: 4rpx;font-size: 24rpx;color: #ff797c;">{{order_list.status_label}}</view>
		</view>
		<view class="flex-wrp"
			style="background: white;border-top: 16rpx solid #f2f2f2;padding: 16rpx 32rpx;justify-content: space-between;">
			<view>
				<view style="font-size: 32rpx;color: #2c2c2c;">{{productInfo.shop.shop_title}}</view>
				<view style="font-size: 24rpx;color: #909090;margin-top: 8rpx;">{{productInfo.shop.shop_addr}}</view>
				<view style="font-size: 28rpx;color: #ff797c;margin-top: 8rpx;"
					@click="setClipboardData(productInfo.shop.shop_addr)">点击复制地址</view>
			</view>
			<image src="/static/image/order-details/btn_fr_order1x.png" mode="" style="width: 88rpx;height: 88rpx;"
				@click="bindTapPuhone">
			</image>
		</view>
		<view style="margin-top: 20rpx;padding: 16rpx 32rpx;background: white;">
			<view class="flex-wrp mt16" style="margin-top: 16rpx;">
				订单详情
			</view>
			<view class="" style="line-height: 66rpx;">订单编号：{{productInfo.order_id}}</view>
			<view class="" style="line-height: 66rpx;">购买手机号：{{productInfo.member_mobile}}</view>
			<view class="" style="line-height: 66rpx;">付款时间：{{productInfo.dateline}}</view>
			<view class="" style="line-height: 66rpx;">数量：{{productInfo.qiang_number}}</view>
			<view class="" style="line-height: 66rpx;">总价：€{{productInfo.amount}}</view>
			<view class="" style="line-height: 66rpx;">实付：€{{productInfo.qiang_discount_price}}</view>
		</view>


		<view class="mask" v-if="isShow" style="z-index: 20;">
			<view class="maskView">
				<image src="/static/image/index_btn_close2x.png" @click="isShow=false" mode="" class="index_btn"
					style="width: 32rpx;height: 32rpx;"></image>
				<view style="color: #2c2c2c; font-size: 32rpx;text-align: center;">{{productInfo.qiang_title}}</view>
				<view style="padding: 16rpx 0;">
					<image :src="order_list.number_qr" mode="" style="width: 440rpx;height: 440rpx;margin-left: 30rpx;">
					</image>
					<view>
						<view style="margin-left: 4rpx;font-size: 24rpx;color: #ff797c;text-align: center;">
							{{order_list.number}}
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				orderid: '',
				productInfo: {},
				order_list: {},
				isShow: false,
			}
		},
		onLoad(options) {
			this.orderid = options.orderid
			this.ticketDetail()
			this.qiangTicket()
		},
		methods: {
			bindTapMask() {
				this.isShow = true
			},
			setClipboardData(data) {
				uni.setClipboardData({
					data: data,
				})
			},
			bindTapPuhone() {
				uni.makePhoneCall({
					phoneNumber: this.productInfo.shop.shop_phone
				})
			},
			qiangTicket() {
				let that = this
				let params = {
					order_id: this.orderid,
				}
				app.globalData.qiangTicket(params, function(res) {
					if (res.error == "0") {
						that.order_list = res.data.order_list
					};
				})
			},

			ticketDetail() {
				let that = this
				// 
				let params = {
					order_id: this.orderid,
				}
				app.globalData.ticketDetail(params, function(res) {
					if (res.error == "0") {
						res.data.detail.dateline = new Date(parseInt(res.data.detail
								.dateline) *
							1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						that.productInfo = res.data.detail

					};
				})
			},

		}
	}
</script>

<style>
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
		width: 500rpx;
		height: 530rpx;
		border-radius: 24rpx;
		background: white;
		padding: 32rpx;
		top: 50%;
		left: 50%;
		margin-top: -250rpx;
		margin-left: -265rpx;

	}

	.index_btn {
		position: absolute;
		z-index: 20;
		left: 32rpx;
		top: 32rpx;
	}

	.footer_pay {
		padding: 0 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		z-index: 10;
		bottom: 0;
		width: 750rpx;
		height: 140rpx;
		background: #FF797C;
		border-radius: 30rpx 30rpx 0px 0px;
	}

	.footer_pay .order_pay_btn {
		width: 180rpx;
		height: 76rpx;
		background: #ffffff;
		color: #3B96B1;
		text-align: center;
		line-height: 76rpx;
		font-size: 28rpx;
		border-radius: 24rpx;
	}

	.footer_pay .txt {
		font-size: 28rpx;
		color: #ffffff;
		height: 28rpx;
		line-height: 28rpx;
	}

	.footer_pay .footer_view {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 140rpx;
	}

	.footer_pay .price {
		font-size: 32rpx;
		color: #ffffff;
		font-weight: bold;
		margin-bottom: 14rpx;
		height: 32rpx;
		line-height: 32rpx;
	}
</style>