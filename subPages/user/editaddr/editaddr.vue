<template>
	<view>
		<view class="page page-bg">
			<view class="topmask" :hidden="topmask"></view>
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

			<!-- 标签选择保留，如不需要可移除 -->
			<!-- <view class="form-card single">
				<view class="form-item">
					<view class="pub_list_bd addaddr_form_lable">
						<radio-group class="radio-group">
							<label v-for="(item, idx) in items" :key="idx" :data-idx="idx" @tap="switchTab"
								:class="'radio ' + (current==idx ? 'active' : '')">
								<radio :value="item.name" :checked="item.checked"></radio>{{item.value}}
							</label>
						</radio-group>
					</view>
				</view>
			</view> -->

			<view class="footer-btn-row">
				<button class="btn-grey" @tap="modalTap">删除</button>
				<button class="btn-red" @tap="saveBtn">保存</button>
			</view>
			<!--内容结束-->
		</view>

	</view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
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
				topmask: true,
				mobile: '',
				num: '',
				addr: '小区/写字楼/学校等',
				label: 0,

				current: "",
				addr_id: "",
				lat: "",
				lng: "",
				countryCode: '+34'
			};
		},

		components: {},
		props: {},
		onShow: function() {
			this.topmask = true;
			var that = this;
			uni.getStorage({
				key: 'addrInfo',
				success: function(res) {
					that.label = res.data.label
					that.name = res.data.name
					that.mobile = res.data.mobile
					that.num = res.data.num
					that.current = res.data.label - 1
					that.addr_id = res.data.id;
				}
			});
			uni.getStorage({
				key: 'addrInfo2',
				success: function(res) {
					that.label = res.data.label
					that.name = res.data.name
					that.mobile = res.data.mobile
					that.num = res.data.num
				}
			});
			uni.getStorage({
				key: 'addr',
				success: function(res) {
					that.addr = res.data.addr
					that.lat = res.data.lat
					that.lng = res.data.lng
				}
			});
		},
		onShareAppMessage: function() {
			app.globalData.share('微信小程序外卖', '/pages/index/index');
		},
		methods: {
			switchTab: function(e) {
				this.label = e.currentTarget.dataset.idx + 1;
				this.current = e.currentTarget.dataset.idx;
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
				this.topmask = false;
				var that = this;
				app.globalData.setstorage('addrInfo2', {
					name: that.name,
					mobile: that.mobile,
					num: that.num,
					label: that.label
				});
				app.globalData.topage('/pages/searchaddr/search');
			},
			saveBtn: function(e) {
				var that = this,
					datas = that;
				var params = {
					'page': 1,
					'lng': datas.lng,
					'lat': datas.lat,
					'addr_id': datas.addr_id,
					'addr': datas.addr,
					'house': datas.num,
					'mobile': datas.mobile,
					'contact': datas.name,
					'type': datas.label
				};
				app.globalData.editCreate(params, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: '修改地址成功'
						});
						setTimeout(function() {
							app.globalData.topage(1, 'back');
						}, 1000);
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				app.globalData.remove('addrInfo', 'addrInfo2', 'addr');
			},
			modalTap: function(e) {
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

			modalChange: function(e) {
				var that = this;
				var addr_id = that.addr_id;
				app.globalData.addrDel({
					"page": 1,
					addr_id: addr_id
				}, function(res) {
					if (res.error == '0') {
						app.globalData.topage('/subPages/user/addr/addr', 'back');
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});

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

	.addaddr_form_lable label {
		position: relative;
		color: #252628;
		display: inline-block;
		border: 1rpx solid #999999;
		width: 116rpx;
		height: 52rpx;
		line-height: 52rpx;
		text-align: center;
		margin-right: 16rpx;
		font-size: 28rpx;
		border-radius: 4rpx;
	}

	.addaddr_form_lable label.active {
		border: 2rpx solid #FF797C;
		color: #FF797C;
	}

	.addaddr_form_lable label radio {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
	}

	.footer-btn-row {
		margin: 50rpx 20rpx 0;
		display: flex;
		justify-content: space-between;
		gap: 24rpx;
	}

	.btn-grey,
	.btn-red {
		flex: 1;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		border-radius: 20rpx;
		border: none;
		font-size: 32rpx;
		border-radius: 60rpx;
	}

	.btn-grey {
		background: #e5e5e5;
		color: #a3a3a3;
	}

	.btn-red {
		background: #FF797C;
		color: #ffffff;
	}
</style>