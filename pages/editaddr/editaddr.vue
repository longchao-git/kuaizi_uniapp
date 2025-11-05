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
		<view class="page">
			<view class="topmask" :hidden="topmask"></view>
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
				<view class="addaddr_form_int pub_list border_b">
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
				<view class="addaddr_form_int pub_list border_b mb10">

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

			<view class="footer_btn_long">
				<button class="mb10 buttom1" @tap="saveBtn">保存</button>
				<button class="buttom2" @tap="modalTap"><text class="fontcl1">删除</text></button>
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
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onShow: function() {
			this.setData({
				topmask: true
			});
			var that = this;
			uni.getStorage({
				key: 'addrInfo',
				success: function(res) {
					that.label = res.data.label;
					that.setData({
						name: res.data.name,
						mobile: res.data.mobile,
						num: res.data.num,
						current: res.data.label - 1,
						addr_id: res.data.id
					});
				}
			});
			uni.getStorage({
				key: 'addrInfo2',
				success: function(res) {
					that.label = res.data.label;
					that.setData({
						name: res.data.name,
						mobile: res.data.mobile,
						num: res.data.num
					});
				}
			});
			uni.getStorage({
				key: 'addr',
				success: function(res) {
					that.setData({
						addr: res.data.addr,
						lat: res.data.lat,
						lng: res.data.lng
					});
				}
			});
		},
		onShareAppMessage: function() {
			app.globalData.share('微信小程序外卖', '/pages/index/index');
		},
		methods: {
			switchTab: function(e) {
				this.label = e.currentTarget.dataset.idx + 1;
				this.setData({
					current: e.currentTarget.dataset.idx
				});
			},
			changename: function(e) {
				this.setData({
					name: e.detail.value
				});
			},
			changephone: function(e) {
				this.setData({
					mobile: e.detail.value
				});
			},
			changedoor: function(e) {
				this.setData({
					num: e.detail.value
				});
			},
			changeaddr: function(e) {
				this.setData({
					topmask: false
				});
				var that = this;
				app.globalData.setstorage('addrInfo2', {
					name: that.name,
					mobile: that.mobile,
					num: that.num,
					label: that.label
				});
				app.globalData.topage('../searchaddr/search');
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
						app.globalData.topage('../addr/addr', 'back');
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

	.pub_list_bd {
		min-height: 40rpx;
		line-height: 30rpx;
	}

	.add_view {
		width: 630rpx;
		margin: 20rpx 20rpx 0;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 0 30rpx;
	}

	.footer_btn_long .buttom1 {
		background: #FF797C;
		border: none;
		color: #ffffff;
	}


	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwaWZINFlrJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtCQUFrQixnQkFBZ0IsRUFBRSxjQUFjLENBQUM7QUFDbkQsdUJBQXVCLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDO0FBQzdELHVCQUF1QixnQkFBZ0IsRUFBRSxXQUFXLENBQUM7QUFDckQsMkJBQTJCLGNBQWMsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0FBQzFGLDBCQUEwQixrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSx1QkFBdUIsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDO0FBQy9OLGtDQUFrQywwQkFBMEIsRUFBRSxjQUFjLENBQUM7QUFDN0UsZ0NBQWdDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5hZGRhZGRyX2Zvcm1faW50e2JhY2tncm91bmQ6ICNmZmY7IHBhZGRpbmc6IDIwcnB4O31cclxuLmFkZGFkZHJfZm9ybV9pbnQgLmJ0eyBmb250LXNpemU6IDI4cnB4OyBtYXJnaW4tcmlnaHQ6IDIwcnB4O31cclxuLmFkZGFkZHJfZm9ybV9pbnQgLmludHtmb250LXNpemU6IDI4cnB4OyBjb2xvcjogIzU1NTt9XHJcbi5hZGRhZGRyX2Zvcm1faW50IC5saW5raWNve2Rpc3BsYXk6IGJsb2NrOyB3aWR0aDogMjhycHg7IGhlaWdodDogMjhycHg7bWFyZ2luLWxlZnQ6IDE0cnB4O31cclxuLmFkZGFkZHJfZm9ybV9sYWJsZSBsYWJlbHtwb3NpdGlvbjogcmVsYXRpdmU7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgYm9yZGVyOiAycnB4IHNvbGlkICNjY2M7IHdpZHRoOiAxMTZycHg7IGhlaWdodDogNTJycHg7IGxpbmUtaGVpZ2h0OiA1MnJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBtYXJnaW4tcmlnaHQ6IDE2cnB4OyBmb250LXNpemU6IDI4cnB4OyBib3JkZXItcmFkaXVzOiA0cnB4O31cclxuLmFkZGFkZHJfZm9ybV9sYWJsZSBsYWJlbC5hY3RpdmV7IGJvcmRlcjogMnJweCBzb2xpZCAjMjBBRDIwOyBjb2xvcjogIzIwQUQyMDt9XHJcbi5hZGRhZGRyX2Zvcm1fbGFibGUgbGFiZWwgcmFkaW97cG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IG9wYWNpdHk6IDA7fVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIl19 */
</style>