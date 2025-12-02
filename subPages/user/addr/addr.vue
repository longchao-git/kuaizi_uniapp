<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<!--提示框引入-开始：使用全局 Toast 组件-->
				<Toast :showToast="showToast" />
				<!--提示框引入-结束-->

				<view>
					<view class="topmask" :hidden="topmask"></view>
					<view style="padding-bottom:100rpx;">
						<!--内容开始-->
						<view :hidden="!addrhidden">
							<view class="noaddr_box">
								<image src="/static/image/mine/mall_my_icon_location_no.png"></image>
								<view class="text">您还未添加收货地址</view>
							</view>
						</view>
						<view :hidden="addrhidden">
							<block v-for="(item, index) in addr_lis" :key="index">
								<view class="addr_list mb10" @tap="editTap" :data-contact="item.contact"
									:data-mobile="item.mobile" :data-addr="item.addr" :data-house="item.house"
									:data-type="item.type" :data-lat="item.lat" :data-lng="item.lng" :id="item.addr_id">
									<view>
										<view class="bt">{{item.contact}}-{{item.mobile}}</view>
										<view class="addr">{{item.addr}}-{{item.house}}</view>
									</view>
									<image src="/static/image/iconnewback1.png"></image>
									<view class="bottom">
										<block v-if="item.type==1">
											<view class="fl tag bg1">公司</view>
										</block>
										<block v-if="item.type==2">
											<view class="fl tag bg2">家</view>
										</block>
										<block v-if="item.type==3">
											<view class="fl tag bg3">学校</view>
										</block>
										<block v-if="item.type==4">
											<view class="fl tag bg4">其他</view>
										</block>
									</view>
								</view>
							</block>
						</view>
						<!--内容结束-->
					</view>
				</view>
				<view class="footer_btn_long">
					<navigator url="../addaddr/addaddr">
						<view>添加收货地址+</view>
					</navigator>
				</view>


			</view>
		</skeleton>
	</view>
</template>

<script>
	var app = getApp(),
		idx = 0;

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},

				addr_lis: [],

				topmask: true,
				addrhidden: false,
				showToast: {
					isShow: false
				},
			};
		},

		components: {},
		props: {},
		created() {
			//骨架屏
			this.reloadData()
		},
		onShow: function() {
			this.bindonShow()
		},

		onShareAppMessage: function() {
			app.globalData.share('微信小程序外卖', '/pages/index/index');
		},
		methods: {
			//骨架屏
			reloadData() {
				this.loading = true
				setTimeout(() => {
					this.loading = false
				}, 3000)
			},

			modalTap: function(e) {
				idx = e.currentTarget.dataset.id;

				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要删除该地址吗？',
					success: function(res) {
						if (res.confirm) {
							that.modalChange()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},

			bindonShow() {
				this.topmask = true;
				var that = this;
				app.globalData.mineAddr({
					"page": 1
				}, function(res) {


					if (res.error == '0') {
						if (res.data.items.length > 0) {
							that.addrhidden = false
							that.addr_lis = res.data.items
						} else {
							that.addrhidden = true
							that.addr_lis = res.data.items
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				app.globalData.remove('addrInfo', 'addr', 'addrInfo2');
			},
			modalChange: function(e) {
				var that = this;
				app.globalData.addrDel({
					"page": 1,
					addr_id: idx
				}, function(res) {
					if (res.error == '0') {
						that.bindonShow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});

			},
			editTap: function(e) {
				this.topmask = false;
				var current = e.currentTarget.dataset;
				app.globalData.setstorage('addrInfo', {
					name: current.contact,
					mobile: current.mobile,
					num: current.house,
					label: current.type,
					id: e.currentTarget.id
				});
				app.globalData.setstorage('addr', {
					addr: current.addr,
					lat: current.lat,
					lng: current.lng
				});
				app.globalData.topage('../editaddr/editaddr?=' + e.currentTarget.id);
			}
		}
	};
</script>
<style>
	.addr_list {
		background: #fff;
		margin: 20rpx 30rpx 0;
		padding: 30rpx 30rpx 24rpx;
		position: relative;
		border-radius: 16rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.addr_list .bt {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #43474D;
	}

	.addr_list .addr {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #43474D;
		margin-top: 16rpx;
	}

	.addr_list .bottom {
		border-top: 2rpx solid #e6e6e6;
		position: absolute;
		top: 0;
		right: 0;
	}

	.addr_list .bottom .tag {
		width: 96rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 6rpx;
		text-align: center;
		color: #fff;
	}

	.addr_list .bottom .tag.bg1 {
		background: #ff6660;
	}

	.addr_list .bottom .tag.bg2 {
		background: #14AAE4;
	}

	.addr_list .bottom .tag.bg3 {
		background: #ff797c;
	}

	.addr_list .bottom .tag.bg4 {
		background: #666666;
	}

	.addr_list image {
		width: 30rpx;
		height: 30rpx;
	}

	.noaddr_box {
		text-align: center;
		padding: 100rpx 0 0;
	}

	.noaddr_box image {
		width: 180rpx;
		height: 180rpx;
	}

	.noaddr_box .text {
		font-size: 32rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
	}

	.footer_btn_long {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 750rpx;
		height: 120rpx;
		font-size: 32rpx;
		background: #FF797C;
		border-radius: 30rpx 30rpx 0px 0px;
		padding: 0;
		font-weight: 500;
		color: #ffffff;
		text-align: center;
		line-height: 120rpx;
	}
</style>