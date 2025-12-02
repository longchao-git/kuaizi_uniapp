<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>

				<!-- 用户点击手势调用授权设置：使用全局 AuthSettingDialog 组件 -->
				<AuthSettingDialog :show="OpenSettingShow" :openType="OpenSettingType" @cancel="closeSetting"
					@confirm="closeSetting" />
				<!--用户点击手势调用授权设置-结束-->

				<view class="iflogin" :hidden="nologin">

					<image class="image-bg" src="/static/image/WechatIMG166.png"></image>

					<view class="nologin">
						<view class="tip black6">登录后查看订单</view>


						<!-- #ifdef MP-WEIXIN || MP-BAIDU-->
						<button type="primary" size="default" class="mt20" open-type="getUserInfo"
							@getuserinfo="bindgetuserinfo">立即登录</button>

						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<!-- <button type="primary" size="default" class="mt20"   open-type="getAuthorize"  @getAuthorize="bindgetuserinfo" scope='userInfo' >立即登录</button> -->
						<button type="primary" size="default" class="mt20" @click="bindgetuserinfo"
							scope='userInfo'>立即登录</button>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<button type="primary" size="default" class="mt20" @tap="bindgetuserinfo"
							scope='userInfo'>立即登录</button>

						<!-- #endif -->
					</view>
				</view>

				<NoData :show="!noorder" text="暂无订单" />
				<view class="page" :hidden="login">
					<!--<scroll-view class="order_list_box" scroll-into-view="{{toview}}" scroll-y="true" bindscrolltolower="loadmore" bindscrolltoupper="refresh">-->
					<view class="order_list_box">
						<view v-for="(item, idx) in order_list" :key="idx" :data-idx="idx">
							<view class="order_list mb10" :id="idx==0?'first':''">
								<view class="info_box">
									<!-- <image class="fl img" :src="pageimg + '' + item.shop_logo"></image> -->
									<block v-if="item.msg=='已取消'">
										<view class="state fr black9 beyond">{{item.msg}}</view>
									</block>
									<block v-else>
										<view class="state fr colorword beyond">{{item.msg}}</view>
									</block>
									<view class="wz" @tap="todetail" :id="item.shop_id">
										<view>订单号:{{item.order_id}}</view>
									
									</view>
								</view>
								<view class="list" @tap.stop="toorderdetail" :data-orderid="item.order_id">
									<view class="name">{{item.shop_title}}</view>
									<text>{{item.product_title}}</text>
									<view class="picre">总计</view>
									<view class="fr" style="margin-bottom: 16rpx;">€{{item.amount}}</view>
								</view>
								<view class="btn_box">
									<view class="time">{{item.dateline}}</view>

									<view class="flex-wrp">
										<block v-if="item.show_btn.cui=='1'">
											<button type="default" :size="defaultSize" @tap="cui"
												hover-class="other-button-hover" class="cui_btn"
												:data-shopid="item.shop_id" :data-orderid="item.order_id"
												:data-idx="idx">催单</button>
										</block>

										<block v-if="item.show_btn.pay=='1'">
											<button type="default" :size="defaultSize" @tap="paybtn"
												:data-shopid="item.shop_id" hover-class="other-button-hover"
												class="pay_btn"
												:data-orderid="item.order_id">去支付{{item.mytime?item.mytime:''}}</button>
										</block>

										<!-- <block wx:if="{{item.show_btn.payback=='1'}}">
			  	    <button type="default"  size="{{defaultSize}}" bindtap="tuipop" hover-class="other-button-hover" class="payback_btn" data-idx="{{idx}}" data-shopid="{{item.shop_id}}" data-orderid="{{item.order_id}}">申请退款</button>
			  	</block> -->
										<block v-if="item.show_btn.confirm=='1'">
											<button type="default" :size="defaultSize" :data-shopid="item.shop_id"
												:data-orderid="item.order_id" @tap="confirmpop"
												hover-class="other-button-hover" class="confirm_btn">确认送达</button>
										</block>
										<block v-if="item.show_btn.admin=='1'">
											<button type="default" :data-shopid="item.shop_id"
												:data-orderid="item.order_id" :size="defaultSize" @tap="kefu"
												hover-class="other-button-hover" class="admin_btn">申请客服介入</button>
										</block>
										<block v-if="item.show_btn.see=='1'">
											<button type="default" :data-shopid="item.shop_id"
												:data-orderid="item.order_id" :size="defaultSize" @tap="lookelv"
												hover-class="other-button-hover" class="see_btn">查看评价</button>
										</block>
										<block v-if="item.show_btn.comment=='1'">
											<button type="default" :size="defaultSize" @tap="evltTap" :data-obj="item"
												hover-class="other-button-hover" class="comment_btn">去评价</button>
										</block>
										<block v-if="item.show_btn.again=='1'">
											<button type="default" :size="defaultSize" @tap="onemore"
												hover-class="other-button-hover" class="again_btn"
												:data-shopid="item.shop_id" :data-orderid="item.order_id"
												:data-idx="idx">再来一单</button>
										</block>
										<block v-if="item.show_btn.canel=='1'">
											<button type="default" :size="defaultSize" @tap="cancelpop"
												hover-class="other-button-hover" class="cancel_btn"
												:data-shopid="item.shop_id" :data-orderid="item.order_id">取消订单</button>
										</block>
									</view>

								</view>
							</view>
						</view>
						<view class="weui-loadmore" :hidden="loadhide">
							<image src="/static/image/loading.gif"></image>
							<text class="weui-loadmore__tips">正在加载</text>
						</view>
						<!--</scroll-view>-->
					</view>
				</view>
				<!-- 申请退款弹出框 -->
				<view class="cancel_popup" :hidden="tuikuan">
					<view class="weui-mask" @tap="hide"></view>
					<view class="cont">
						<view class="bt">退款理由</view>
						<view class="section">
							<textarea :hidden="tuikuan" :placeholder="tuikuan_reason" @input="getReason"></textarea>
						</view>
						<view class="btn_box">
							<button type="default" :disabled="disabled" :size="defaultSize" @tap="Setdefault"
								hover-class="other-button-hover">取消</button>
							<button type="default" :size="defaultSize" @tap="settuikuan"
								hover-class="other-button-hover" class="btn">确定</button>
						</view>
					</view>
				</view>
				<!-- 申请退款弹出框end -->


			</view>
		</skeleton>
	</view>
</template>

<script>
	var app = getApp();
	var common = require("../../js/ecart.js");
	var ecart = null;
	var reason;
	var double = true;
	var that = null;

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},
				defaultSize: 'mini',
				pageimg: app.globalData._CFG.IMG_URL || '',
				disabled: false,
				plain: false,
				//loading: false,
				order_list: [],
				page: 1,
				cancelHidden: true,
				tuikuan: true,
				orderid: '',


				toview: '',
				tuikuan_reason: "",
				loadhide: true,
				nologin: false,
				login: true,
				noorder: true,
				OpenSettingShow: false
			}
		},

		components: {},

		props: {},

		onShow: function() {
			this.bindonshow()
			// this.reloadData()
		},
		created() {
			//骨架屏

		},
		onReachBottom: function() {
			var page = this.page;
			page++;
			var that = this;
			app.globalData.orders({
				"page": page,
				"lng": app.globalData._CFG.lng,
				"lat": app.globalData._CFG.lat
			}, function(res) {
				if (res.error == '0') {
					if (res.data.items.length == 0) {
						that.loadhide = true;
					} else {
						that.loadhide = false
						that.order_list = that.order_list.concat(res.data.items)
						that.page = page
					}
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},

		onPullDownRefresh: function() {
			this.bindonshow();
			uni.stopPullDownRefresh();
		},
		onShareAppMessage: function() {
			return {
				title: '微信小程序外卖',
				path: '/pages/index/index',
				success: function(res) { // 分享成功
				},
				fail: function(res) { // 分享失败
				}
			};
		},
		methods: {
			//骨架屏
			// reloadData() {
			//      this.loading = true
			//      setTimeout(() => {
			//        this.loading = false
			//      }, 1000)
			//    },

			bindonshow() {
				that = this;
				this.loading = true
				if (app.globalData.CheckLogin()) {
					app.globalData.orders({
						"page": 1,
						"lng": app.globalData._CFG.lng,
						"lat": app.globalData._CFG.lat
					}, function(res) {
						that.loading = false
						uni.showLoading({
							title: '加载中...'
						});
						if (res.error == '0') {
							if (res.data.items.length == 0) {
								setTimeout(function() {
									uni.hideLoading();
								}, 500);
								that.noorder = false
								that.nologin = true
								that.login = true
							} else {
								// for (var j = 0; j < res.data.items.length; j++) {
								//     var productName = res.data.items[j].products;
								//     var allName = []
								//     if(productName){
								//         for (var i = 0; i < productName.length; i++) {
								//             allName.push(productName[i].product_name)
								//         }
								//     }
								//     res.data.items[j].ordername = allName.join('')
								//     res.data.items[j].orderlength = allName.length
								// }
								for (var i = 0; i < res.data.items.length; i++) {
									res.data.items[i].dateline = new Date(parseInt(res.data.items[i].dateline) *
										1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
								}

								that.order_list = res.data.items
								that.login = false
								that.nologin = true
								that.page = 1
								that.noorder = true;
								setTimeout(function() {
									uni.hideLoading();
								}, 500);
							}
						} else {
							//wx.hideLoading()
							setTimeout(function() {
								uni.hideLoading();
							}, 500);
							uni.showToast({
								title: res.message
							});
						}
					});
				} else {
					this.loading = false
					that.login = true
					that.nologin = false;
				} //先定义一个变量存储自己
			},
			setlogin: function() {
				app.globalData.afterCheckLogin(function() {
					that.bindonshow();
				});
			},
			paybtn: function(e) {
				if (double) {
					app.globalData._CFG.payorderid = e.currentTarget.dataset.orderid;
					uni.navigateTo({
						url: '/subPages/order/payment/payment?orderid=' + e.currentTarget.dataset.orderid
					});
					double = false;
					setTimeout(function() {
						double = true;
					}, 500);
				}
			},
			setDisabled: function(e) {
				this.disabled = !this.data.disabled;
			},
			setPlain: function(e) {
				this.plain = !this.data.plain;
			},
			setLoading: function(e) {
				this.loading = !this.data.loading;
			},
			todetail: function(e) {
				var id = e.currentTarget.id;
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
			},
			onemore: function(e) {

				if (double) {
					var id = e.currentTarget.dataset.shopid;
					app.globalData._CFG.shoptail = id;
					ecart = new common.ECart(app.globalData._CFG.shoptail);
					var idx = e.currentTarget.dataset.idx;
					var pro = this.order_list[idx].products;
					ecart.clear(id);
					var sku_msg = [],
						str_name = '',
						str_obj = {};

					for (var i = 0; i < pro.length; i++) {
						for (var j = 0; j < pro[i].product.length; j++) {
							var sku_id;

							if (pro[i].product[j].spec_id) {
								sku_id = pro[i].product[j].product_id + '_' + pro[i].product[j].spec_id;
							} else {
								sku_id = pro[i].product[j].product_id + '_0';
							}

							if (pro[i].product[j].specification && pro[i].product[j].specification.length > 0) {
								for (var l = 0; l < pro[i].product[j].specification.length; l++) {
									if (pro[i].product[j].specification[l].val == '否') {
										pro[i].product[j].specification[l].price = 0
									}
									str_name += ':' + pro[i].product[j].specification[l]['key'] + ':' + pro[i].product[
										j].specification[l]['val'];
									str_obj[l] = {
										key: pro[i].product[j].specification[l]['key'],
										val: pro[i].product[j].specification[l]['val']
									};
								}
							}

							var num;
							var obj = {
								"is_discount": pro[i].product[j].is_discount,
								"is_must": pro[i].product[j].is_must,
								"oldprice": pro[i].product[j].oldprice,
								"price": pro[i].product[j].price,
								'package': pro[i].product[j].package_price,
								'product_id': pro[i].product[j].product_id,
								'pcate_id': pro[i].product[j].cate_id,
								"sku_id": sku_id,
								'sale_sku': pro[i].product[j].sale_sku,
								"sale_type": pro[i].product[j].sale_type,
								'spec_id': pro[i].product[j].spec_id || '',
								"shoptitle": this.order_list[idx].shop_title,
								"shopid": app.globalData._CFG.shoptail,
								'str_obj': pro[i].product[j].specification,
								'str_name': str_name,
								"title": pro[i].product[j].product_name
							};
							if (pro[i].product[j].specification && pro[i].product[j].specification.length > 0) {
								for (let x = 0; x < pro[i].product[j].specification.length; x++) {
									obj.title += '+' + pro[i].product[j].specification[x].val
								}
							}
							if (parseInt(pro[i].product[j].sale_sku) < parseInt(pro[i].product[j].product_number)) {
								sku_msg[i] = pro[i].product[j].product_name;
								obj.num = 0;
							} else {
								obj.num = pro[i].product[j].product_number;
							}

							ecart.add(sku_id, obj.num, obj, str_obj);
						}

						;
					}

					var msg = sku_msg.join();

					if (msg) {
						uni.showToast({
							title: msg + '库存不足'
						});
					}

					app.globalData.topage('/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
				}
			},
			lookelv: function(e) {
				console.log(e)
				var id = e.currentTarget.dataset.shopid;
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('/subPages/shop/shoptail/shoptail?currentNavtab=1&id=' + app.globalData._CFG.shoptail);
			},
			tuipop: function(e) {
				this.tuikuan = false
				this.orderid = e.currentTarget.dataset.orderid
				this.tuikuan_reason = "请输入退款理由";
			},
			hide: function() {
				this.tuikuan = true;
			},
			cancelpop: function(e) {
				console.log(e)
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要取消订单吗？',
					success: function(res) {
						if (res.confirm) {
							that.orderid = e.currentTarget.dataset.orderid;

							that.cancel()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			confirmpop: function(e) {
				console.log(e)
				let that = this
				uni.showModal({
					title: '提示',
					content: '确认收货吗？',
					success: function(res) {
						if (res.confirm) {
							that.orderid = e.currentTarget.dataset.orderid;

							that.confirm()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			getReason: function(e) {
				reason = e.detail.value;
			},
			settuikuan: function() {
				var that = this;
				app.globalData.ordersTui({
					"order_id": that.orderid,
					"reason": reason
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "申请退款成功"
						});
						that.bindonshow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				this.tuikuan = true;
			},
			cancel: function() {
				var that = this;
				app.globalData.ordersCancel({
					"order_id": that.orderid
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "取消订单成功"
						});
						that.bindonshow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});

			},
			confirm: function() {
				var that = this;
				app.globalData.ordersConfirm({
					"order_id": that.orderid,
					"reason": reason
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "确认订单成功"
						});
						that.bindonshow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});

			},
			toorderdetail: function(e) {
				var orderid = e.currentTarget.dataset.orderid;
				app.globalData.topage('/subPages/order/orderDetail/detail?orderid=' + orderid);
			},
			cui: function(e) {
				app.globalData.ordersCui({
					"order_id": e.currentTarget.dataset.orderid,
					"reason": reason
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "催单成功"
						});
						this.bindonshow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			//申请客服2017/05/06yu
			kefu: function(e) {
				var that = this;
				app.globalData.ordersKefu({
					"order_id": e.currentTarget.dataset.orderid
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "申请客服成功，请耐心等待"
						});
						that.bindonshow();
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			evltTap: function(e) {
				var obj = JSON.stringify(e.currentTarget.dataset.obj);
				app.globalData.topage('/subPages/user/ordevlt/ordevlt?obj=' + obj);
			},
			//授权
			closeSetting() {
				uni.pubOpenSetting(false);
			},

			bindgetuserinfo(e) {
				console.log(e)
				this.setlogin();
			}
		},

	};
</script>
<style>
	.order_list {
		background: #fff;
		position: relative;
		margin: 20rpx 30rpx 0;
		box-shadow: 0px 0px 16rpx 0px rgba(219, 219, 219, 0.5);
		border-radius: 16rpx;
	}

	.page {
		height: 100%;
	}

	.order_list_box {
		height: 100%;
		position: relative;
		z-index: 1;
	}

	.order_list .info_box {
		overflow: hidden;
		padding: 18rpx 0;
		position: relative;
		margin: 0 30rpx;
		border-bottom: 1rpx #E6E6E6 solid;
		line-height: 33rpx;
		font-size: 24rpx;
		color: #3E4248;
	}

	.order_list .info_box image.img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
		overflow: hidden;
		background: #eee;
	}

	.order_list .info_box .wz {
		margin-right: 200rpx;
	}

	.order_list .info_box .wz .tit {
		font-size: 28rpx;
		line-height: 30rpx;
	}

	.order_list .info_box .wz .tit .linkico {
		width: 28rpx;
		height: 28rpx;
		vertical-align: text-bottom;
		margin-left: 14rpx;
	}

	.order_list .info_box .wz .time {
		font-size: 22rpx;
		line-height: 40rpx;
		color: #999;
	}

	.order_list .info_box .state {
		font-size: 24rpx;
		line-height: 33rpx;
		width: 200rpx;
		text-align: right;
	}

	.order_list .info_box .colorword {
		color: #ff797c;
		margin-top: 20rpx;
	}

	.order_list .info_box .tag {
		border-radius: 16rpx 0 0 0;
		position: absolute;
		left: 0;
		top: 0;
		background: #FFB74C;
		border-radius: 0 0px 20px 0;
		color: #fff;
		font-size: 22rpx;
		padding: 6rpx 10rpx 10rpx 6rpx;
	}

	.order_list .list {
		overflow: hidden;
		padding: 30rpx 20rpx;
		font-size: 24rpx;
		line-height: 40rpx;
	}

	.order_list .list text {
		max-width: 80%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: block;
	}

	.order_list .list .picre {
		float: left;
		margin-top: 16rpx;
	}

	.order_list .list .name {
		color: #3E4248;
		font-size: 26rpx;
		margin-bottom: 16rpx;
	}

	.order_list .btn_box {
		overflow: hidden;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 0;
		margin: 0 30rpx;
		border-top: 1rpx #E6E6E6 solid;
	}

	.order_list .btn_box .time {
		color: #9292AF;
		font-size: 22rpx;
	}

	.order_list .payback_btn {
		color: #ff797c;
	}

	.order_list .payback_btn:after {
		border: 2rpx solid #ff797c;
	}

	.order_list .btn_box button {
		line-height: 60rpx;
		padding: 0 24rpx;
		background: #fff;
		margin-left: 16rpx;
		height: 60rpx;
		color: #3E4248;
	}

	.order_list .btn_box button.btn_time {
		color: #ff797c;
	}

	.order_list .btn_box button.btn_time::after {
		border: 1px solid #ff797c;
	}


	.weui-loadmore {
		height: 80rpx;
		line-height: 80rpx;
		background: #f8f8f8;
		text-align: center
	}

	.weui-loadmore image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		display: inline-block;
		vertical-align: middle;
	}


	.cancel_popup .bt {
		padding: 30rpx;
		margin-bottom: 10rpx;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
	}

	.cancel_popup .radio_box {
		padding: 10rpx 20rpx 0 40rpx;
	}

	.cancel_popup .radio_box .box {
		width: 33.3333%;
		float: left;
	}

	.cancel_popup .radio_box .list {
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}

	.cancel_popup .radio_box .bq {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 2rpx solid #E6EAED;
		border-radius: 30rpx;
		box-sizing: border-box;
		color: #333333;
	}

	.cancel_popup .radio_box .bq.on {
		background: #ff797c;
		color: #ffffff;
		border-color: #ff797c;
	}

	.cancel_popup .section {
		padding: 0 40rpx 30rpx;
	}

	.cancel_popup .section textarea {
		width: 100%;
		height: 160rpx;
		border: 2rpx solid #E6EAED;
		border-radius: 8rpx;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.cancel_popup .btn_box {
		border-top: 2rpx solid #E6EAED;
	}

	.cancel_popup .btn_box wx-button {
		display: inline-block;
		width: 50%;
		height: 86rpx;
		line-height: 86rpx;
		background-color: #fff;
		vertical-align: top;
	}

	.cancel_popup .btn_box button:after {
		display: none;
	}

	.cancel_popup .btn_box .btn {
		border-left: 2rpx solid #E6EAED;
		box-sizing: border-box;
		color: #FF0000;
	}

	.iflogin {
		position: relative;
		z-index: 0;
	}

	.nologin {
		text-align: center;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-weblit-transform: translate(-50%, -50%)
	}

	.nologin view {
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.nologin button {
		height: 60rpx;
		line-height: 60rpx;
		width: 200rpx;
		font-size: 24rpx;
	}

	.nologin image {
		width: 200rpx;
		height: 200rpx;
	}

	.image-bg {
		position: fixed;
		z-index: -1;
		left: 0;
		right: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}





	.fixed_box {
		position: fixed;
		right: 20rpx;
		bottom: 60rpx;
	}

	.fixed_box image {
		width: 100rpx;
		height: 100rpx;
	}

	.weui-mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
	}

	.phonePopup .cont,
	.cancel_popup .cont {
		position: fixed;
		left: 50%;
		top: 50%;
		bottom: auto;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		width: 90%;
		box-sizing: border-box;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		background: transparent;
		-webkit-transition: -webkit-transform .3s;
		transition: -webkit-transform .3s;
		transition: transform .3s;
		transition: transform .3s, -webkit-transform .3s;
		z-index: 5000;
		border-radius: 8rpx;
		background-color: #FFFFFF;
	}

	.phonePopup .list {
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		color: #333333;
		position: relative;
	}

	.phonePopup .list:before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #D9D9D9;
		color: #D9D9D9;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.phonePopup .list:first-child:before {
		display: none;
	}

	.order_list .btn_box .pay_btn {
		background: #FF797C;
		color: #ffffff;
	}
</style>