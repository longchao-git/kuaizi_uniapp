<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>

				<view class="page">
					<!--内容开始-->
					<view class="add_view">
						<view class="addaddr_form_int pub_list border_b">
							<view class="bt">地址</view>
							<view class="pub_list_bd">
								<!--<input type="text" class="int" placeholder="小区/写字楼/学校等"  value="{{addr}}" bindtap="changeaddr"/>-->
								<view class="int" @tap="changeaddr">{{addr}}</view>
							</view>
							<image src="/static/image/arrowright.png" class="linkico"></image>
						</view>
						<view class="addaddr_form_int pub_list ">
							<view class="bt">门牌号</view>
							<view class="pub_list_bd">
								<input type="text" class="int" placeholder="例：5号楼101室" :value="num" id="door"
									@input="changedoor">
							</view>
						</view>
					</view>
					<view class="add_view">
						<view class="addaddr_form_int pub_list border_b">
							<view class="bt">收货人</view>
							<view class="pub_list_bd">
								<input type="text" class="int" id="name" placeholder="请输入收货人姓名" :value="name"
									@input="changename">
							</view>
						</view>
						<view class="addaddr_form_int pub_list border_b mb10">
							<view class="bt">手机号</view>
							<view class="pub_list_bd">
								<input type="text" class="int" id="phone" placeholder="请输入收货人手机号" :value="mobile"
									@input="changephone">
							</view>
						</view>
					</view>
					<view class="add_view">
						<view class="addaddr_form_int pub_list  mb10">

							<view class="pub_list_bd addaddr_form_lable">
								<radio-group class="radio-group">
									<label v-for="(item, idx) in items" :key="idx" :data-idx="idx" @tap="switchTab"
										:class="'radio ' + (current==idx ? 'active' : '')">
										<radio :value="item.name" :checked="item.checked"></radio>{{item.value}}
									</label>
								</radio-group>
							</view>
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
	.add_view {
		width: 630rpx;
		margin: 20rpx 20rpx 0;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 0 30rpx;
	}

	.pub_list_bd {
		min-height: 40rpx;
		line-height: 30rpx;
	}

	.addaddr_form_int {
		background: #fff;
		padding: 24rpx 0;
	}

	.addaddr_form_int .bt {
		font-size: 28rpx;
		margin-right: 30rpx;
		width: 100rpx;
		color: #3E4248;
	}

	.addaddr_form_int .int {
		font-size: 28rpx;
		color: #555;
	}

	.addaddr_form_int .linkico {
		display: block;
		width: 28rpx;
		height: 28rpx;
		margin-left: 14rpx;
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

	.footer_btn_long button {
		background: #FF797C;
		border: none;
	}
</style>