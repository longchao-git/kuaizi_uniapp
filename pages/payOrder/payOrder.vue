<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view class="flex-wrp" style="padding: 16rpx 32rpx;background: white;">
			<view>消费地址</view>
			<view class="beyond" style="margin-left: 16rpx;width:540rpx ;">
				{{orderCreateInfo.shop_addr.addr}}
			</view>
			<image src="@/static/image/arrowright.png" mode="" style="width: 32rpx;height: 32rpx;"></image>
		</view>
		<view class="flex-wrp" style="margin-top: 20rpx;padding: 16rpx 32rpx;background: white;">
			<image :src="productInfo.photo" mode="aspectFill" style="width: 160rpx;height: 160rpx;"></image>
			<view class="ml20" style="flex: 1;">
				<view class="flex-wrp" style="justify-content: space-between;">
					<view>{{productInfo.title}}</view>
					<view style="color: #ff797c;">€{{orderCreateInfo.discount_price}}</view>
				</view>
				<view style="color: #909090;font-size: 28rpx;margin-top: 10rpx;">{{productInfo.shop_name}}</view>
				<view style="color: #909090;font-size: 28rpx;margin-top: 10rpx">
					已售：{{productInfo.count_sku - productInfo.sku}}
					库存：{{productInfo.sku}} <text v-if="orderCreateInfo.is_limit==1">限购：1</text> </view>
			</view>
		</view>

		<view class="flex-wrp"
			style="margin-top: 20rpx;padding: 16rpx 32rpx;background: white;justify-content: space-between;">
			<view class="flex-wrp">
				数量
			</view>
			<view class="flex-wrp   " style="border: 1rpx solid #BCC4D0;height: 72rpx;border-radius: 8rpx;">
				<view style="justify-content: center;height: 72rpx;width: 72rpx;" class=" flex-wrp"
					@click="bingtapCilck(1)">
					<image src="/static/image/cell_jian.png" mode="aspectFill" style="width: 40rpx;height: 40rpx;">
					</image>
				</view>
				<view class=" font-weight-500  "
					style="width: 112rpx;border-left: 1rpx solid #BCC4D0;border-right: 1rpx solid #BCC4D0;font-size: 28rpx;ight: 72rpx;text-align: center;">
					{{numValue}}
				</view>
				<view style="justify-content: center;height: 72rpx;width: 72rpx" class=" flex-wrp"
					@click="bingtapCilck(2)">
					<image src="/static/image/cell_jia.png" mode="aspectFill" style="width: 40rpx;height: 40rpx;">
					</image>
				</view>
			</view>
		</view>
		<view class="flex-wrp"
			style="margin-top: 20rpx;padding: 16rpx 32rpx;background: white;justify-content: space-between;">
			<view class="flex-wrp">
				小计
			</view>
			<view style="color: #909090;font-size: 28rpx;margin-top: 10rpx">
				€{{orderCreateInfo.discount_price}}
			</view>
		</view>
		<view class="flex-wrp" style="padding: 16rpx 32rpx;background: white;justify-content: space-between;">
			<view class="flex-wrp">
				快递
			</view>
			<view style="color: #909090;font-size: 28rpx;margin-top: 10rpx">
				€0
			</view>
		</view>
		<view class="flex-wrp" style="padding: 16rpx 32rpx;background: white;justify-content: space-between;">
			<view class="flex-wrp">
				实付金额
			</view>
			<view style="color: #ff797c;font-size: 28rpx;margin-top: 10rpx">
				€{{orderCreateInfo.total_price}}
			</view>
		</view>
		<view class="footer_pay">
			<view class="footer_view">
				<text class="price">€{{orderCreateInfo.total_price}}</text>
				<view class="txt">待支付</view>
			</view>
			<button class="order_pay_btn " @click="orderCreate">
				立即下单
			</button>

		</view>

	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				id: '',
				orderCreateInfo: {},
				productInfo: {},
				showToast: {
					isShow: false
				},
				numValue: 1
			}
		},
		onLoad(options) {
			this.id = options.id
			this.qiangOrder()
			this.productGet()
		},
		methods: {
			bingtapCilck(type) {
				if (this.orderCreateInfo.is_limit == 1) {
					uni.showToast({
						title: "暂无更多数据~"
					});
				} else {
					if (type === 1) {
						if (this.numValue == 1) {
							uni.showToast({
								title: "至少购买一个"
							});
							return
						}
						this.numValue--
					} else {
						if (this.numValue == this.productInfo.sku) {
							uni.showToast({
								title: "购买不能超过库存"
							});
							return
						}
						this.numValue++
					}
					this.perinfoOrder()
				}

			},
			isShowToast(showToast) {
				return showToast.isShow ? showToast.isShow : false
			},
			productGet() {
				let that = this
				let params = {
					qiang_id: this.id
				}
				app.globalData.productGet(params, function(res) {
					if (res.error == "0") {
						that.productInfo = res.data.detail
					};
				})
			},
			perinfoOrder() {
				let that = this
				let params = {
					qiang_id: this.id,
					num: this.numValue,
					is_ziti: that.orderCreateInfo.ziti_status == 1 ? 1 : 0
				}
				app.globalData.perinfoOrder(params, function(res) {
					if (res.error == "0") {
						that.orderCreateInfo = res.data.items
					};
				})
			},
			qiangOrder() {
				let that = this
				let params = {
					qiang_id: this.id,
				}
				app.globalData.qiangOrder(params, function(res) {
					if (res.error == "0") {
						that.orderCreateInfo = res.data.items
					};
				})
			},
			orderCreate() {
				let that = this
				let params = {
					qiang_id: this.id,
					num: this.numValue,
					is_ziti: that.orderCreateInfo.ziti_status == 1 ? 1 : 0
				}
				app.globalData.orderCreate(params, function(res) {
					if (res.error == "0") {
						uni.redirectTo({
							url: '/pages/payment/payment?orderid=' + res.data.order_id + '&type=1'
						});
					};
				})
			}
		}
	}
</script>

<style>
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