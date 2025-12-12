<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>

				<view class="page page-bg">
					<!--内容开始-->
					<view class="form-card">
						<view class="form-item border_b">
							<view class="label">姓名</view>
							<input type="text" class="int" id="name" placeholder="请输入收货人姓名" :value="name"
								@input="changename">
						</view>
						<view class="form-item border_b">
							<view class="label">手机号码</view>
							<view class="phone-input">
								<!-- <view class="code-box">{{countryCode}}</view> -->
								<input type="text" class="int phone" id="phone" placeholder="请输入收货人手机号" :value="mobile"
									@input="changephone">
							</view>
						</view>
						<view class="form-item address-row" @tap="changeaddr">
							<view class="label">地址</view>
							<view class="int address-text">{{addr}}</view>
							<image src="/static/image/arrowright.png" class="linkico"></image>
						</view>
					</view>
					<view class="form-card single">
						<view class="form-item">
							<view class="label">门牌号</view>
							<input type="text" class="int" placeholder="例：5号楼101室" :value="num" id="door"
								@input="changedoor">
						</view>
					</view>

					<view class="footer_btn_long" style="padding-right: 40rpx;">
						<button type="primary" size="default" @tap="saveBtn">保存</button>
					</view>
					<!--内容结束-->
				</view>
			</view>
		</skeleton>
	</view>
</template>

<script>
	var app = getApp();
	var double = true;

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},

				items: [{
					name: 'USA',
					value: '公司'
				}, {
					name: 'CHN',
					value: '家',
					checked: 'true'
				}, {
					name: 'BRA',
					value: '学校'
				}, {
					name: 'JPN',
					value: '其他'
				}],
				name: '',
				mobile: '',
				num: '',
				addr: '小区/写字楼/学校等',
				countryCode: '+34',
				label: 0,
				lat: '',
				lng: '',
				current: ""
			};
		},

		components: {},
		props: {},
		created() {
			//骨架屏
			this.reloadData()
		},
		onShow: function() {
			var that = this;
			uni.getStorage({
				key: 'addrInfo',
				success: function(res) {
					if (res.data) {
						that.name = res.data.name
						that.mobile = res.data.mobile
						that.num = res.data.num
						that.label = res.data.label;
					}

				}
			});
			uni.getStorage({
				key: 'addr',
				success: function(res) {
					if (res.data) {
						that.addr = res.data.addr
						that.lat = res.data.lat
						that.lng = res.data.lng
					}
				}
			});
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
			switchTab: function(e) {
				console.log(e)
				this.current = e.currentTarget.dataset.idx
				this.label = e.currentTarget.dataset.idx + 1
			},
			changename: function(e) {
				this.name = e.detail.value;
			},
			changephone: function(e) {
				this.mobile = e.detail.value;
			},
			changedoor: function(e) {
				this.num = e.detail.value;
			},
			changeaddr: function(e) {
				var that = this;
				app.globalData.setstorage('addrInfo', {
					name: that.name,
					mobile: that.mobile,
					num: that.num,
					label: that.label
				});
				app.globalData.topage('/pages/searchaddr/search');
			},
			saveBtn: function(e) {
				var that = this,
					label = that.label,
					name = that.name,
					mobile = that.mobile,
					num = that.num,
					addr = that.addr,
					lat = that.lat,
					lng = that.lng;
				app.globalData.addrCreate({
					"page": 1,
					"lng": lng,
					"lat": lat,
					"type": label,
					"contact": name,
					"mobile": mobile,
					"house": num,
					"addr": addr
				}, function(res) {
					if (res.error == '0') {
						app.globalData.topage(1, 'back');
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				app.globalData.remove('addrInfo', 'addr', 'addrInfo2');
			}
		}
	};
</script>
<style>
	.page-bg {
		background: #f5f6f7;
		min-height: 100vh;
		padding-bottom: 40rpx;
	}

	.form-card {
		margin: 20rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
		overflow: hidden;
	}

	.form-card.single {
		margin-top: 10rpx;
	}

	.form-item {
		display: flex;
		align-items: center;
		padding: 32rpx 28rpx;
	}

	.border_b {
		border-bottom: 1rpx solid #f0f1f3;
	}

	.label {
		width: 140rpx;
		font-size: 30rpx;
		color: #1a1a1a;
		font-weight: 600;
	}

	.int {
		flex: 1;
		font-size: 30rpx;
		color: #3e4248;
	}

	.phone-input {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.code-box {
		min-width: 120rpx;
		height: 64rpx;
		padding: 0 18rpx;
		margin-right: 16rpx;
		background: #f5f6f7;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #9ea2ab;
		font-weight: 600;
	}

	.phone {
		height: 64rpx;
		line-height: 64rpx;
	}

	.address-row {
		align-items: flex-start;
	}

	.address-text {
		flex: 1;
		color: #9ea2ab;
		line-height: 42rpx;
	}

	.linkico {
		display: block;
		width: 32rpx;
		height: 32rpx;
		margin-left: 14rpx;
		margin-top: 6rpx;
	}

	.footer_btn_long {
		margin: 40rpx 20rpx 0;
	}

	.footer_btn_long button {
		background: #FF797C;
		border: none;
		border-radius: 16rpx;
		height: 96rpx;
		border-radius: 60rpx;
		line-height: 96rpx;
	}
</style>