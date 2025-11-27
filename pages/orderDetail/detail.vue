<template>
	<view>
		<!--提示框引入-开始-->
		<!--<import src="../components/showToast.wxml"></import>-->
		<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
			<block v-if="showToast.isShow ? showToast.isShow : false">
				<!-- <view class="toast-bg" wx:if="{{showToast.mask==false? false : true}}"></view>   -->
				<view class="toast-center">
					<view class="toast">
						<image class="toast-icon" :src="showToast.icon" mode="scaleToFill" v-if="showToast.icon">
						</image>
						<text class="toast-text">{{ showToast.title }}</text>
					</view>
				</view>
			</block>
		</block>
		<!--提示框引入-结束-->
		<view class="page">
			<block>
				<view class="orderStatus">
					<!--<block wx:if="{{orderdetail.msg=='已取消'}}">
                <view class="bt">{{orderdetail.msg}}<image src="../../image/arrowright.png"></image></view>
            </block>
            <block wx:else>
                <view class="bt" bindtap="status" data-orderid="{{orderdetail.order_id}}">{{orderdetail.msg}}<image src="../../image/arrowright.png"></image></view>
            </block>-->
					<block>
						<view class="bt" @tap="status" :data-orderid="orderdetail.order_id">{{ orderdetail.msg }}</view>
					</block>

					<view class="ordertip">
						<text v-if="orderdetail.order_status == 8 && orderdetail.comment_status == 0">说说你对该单评价</text>
						<text v-else-if="orderdetail.order_status == 8 && orderdetail.comment_status == 1">订单已结束</text>
						<text v-else-if="orderdetail.order_status == -1">订单已取消</text>
						<text v-else-if="orderdetail.show_btn.pay == 1">订单将在<text style="color: #F8627F;"> {{ mytime }}
							</text>后自动取消请尽快支付</text>
						<text v-else-if="orderdetail.order_status == 2">{{ orderdetail.pei_type == 3 ? '等待自提中' : '请耐心等待送达' }}</text>
					</view>

					<view class="status_btn">
						<block v-if="orderdetail.show_btn.cui == '1'">
							<button type="default" :size="defaultSize" @tap="cui" hover-class="other-button-hover"
								:data-orderid="orderdetail.order_id">催单</button>
						</block>
						<block v-if="orderdetail.show_btn.pay == '1'">
							<button type="default" :size="defaultSize" @tap="paybtn" hover-class="other-button-hover"
								:data-orderid="orderdetail.order_id" class="pay_btn">去支付</button>
						</block>
						<!-- <block wx:if="{{orderdetail.show_btn.payback=='1'}}">
                    <button type="default"  size="{{defaultSize}}" bindtap="tuipop" hover-class="other-button-hover">申请退款</button>
                </block> -->
						<!--  -->
						<block v-if="orderdetail.show_btn.confirm == '1'">
							<button type="default" :size="defaultSize" @tap="confirmpop"
								hover-class="other-button-hover">{{orderdetail.pei_type == 3 ? '确认自提' : '确认送达'}}</button>
						</block>
						<block v-if="orderdetail.show_btn.admin == '1'">
							<button type="default" :size="defaultSize" @tap="kefu" hover-class="other-button-hover"
								:data-orderid="orderdetail.order_id">申请客服介入</button>
						</block>
						<block v-if="orderdetail.show_btn.waiting == '1'">
							<button type="default" :size="defaultSize" hover-class="other-button-hover">请耐心等待</button>
						</block>
						<block v-if="orderdetail.show_btn.see == '1'">
							<button type="default" :size="defaultSize" :data-shopid="orderdetail.waimai.shop_id"
								:data-orderid="orderdetail.order_id" @tap="lookelv"
								hover-class="other-button-hover">查看评价</button>
						</block>
						<block v-if="orderdetail.show_btn.comment == '1'">
							<button type="default" :size="defaultSize" @tap="evltTap" :data-obj="orderdetail"
								hover-class="other-button-hover">去评价</button>
						</block>
						<block v-if="orderdetail.show_btn.again == '1'">
							<button type="default" :size="defaultSize" @tap="onemore" hover-class="other-button-hover"
								:data-shopid="orderdetail.waimai.shop_id">再来一单</button>
						</block>
						<block v-if="orderdetail.show_btn.canel == '1'">
							<button type="default" :size="defaultSize" @tap="cancelpop"
								hover-class="other-button-hover">取消订单</button>
						</block>
					</view>
				</view>
			</block>
			<!--<block wx:if="{{orderdetail.show_map==1}}">
        <view class="orderMap">
            <view bindtap="callRider" class="tipNum clear_both">骑手：{{orderdetail.staff.name}}  {{orderdetail.staff.mobile}}<image src="../../image/btn_call_white.png" class="fr"></image></view>
            <view class="map">
                <map id="mapselect" style="width:{{map_width}}px;height:{{map_height}}px" latitude="{{rider_lat}}" longitude="{{rider_log}}" scale="14" markers="{{markers}}" show-location></map>
            </view>
        </view>
    </block>-->
			<view class="orderDetail mt10">
				<view class="pub_list tit" @tap="todetail" :id="orderdetail.waimai.shop_id">
					<view>{{ orderdetail.waimai.title }}</view>
					<image src="/static/image/arrowright.png" class="img2"></image>
				</view>
			</view>
			<view class="caidanListsTwo" v-if="goods_lis.length > 1">
				<view v-for="(item, index) in goods_lis" :key="index" class="basket_list">
					<image class="ico_basket" mode="aspectFit" src="/static/image/icon_basket3x.png"></image>
					<view class="right_box">
						<view class="title">{{ item.basket_title }}</view>
						<ul>
							<li v-for="(item, index2) in item.product" :key="index2" class="pub_list">
								<view class="pub_list_bd">
									<view class="tit overflow_clear">{{ item.product_name }}</view>
								</view>
								<view class="num">x {{ item.product_number }}</view>
								<view class="price">€{{ item.product_oldprices }}<text
										class="small">€{{ item.product_prices }}</text></view>
							</li>
						</ul>
					</view>
				</view>
			</view>
			<view class="caidanListsOne textborder" v-else>
				<ul v-for="(item, index) in goods_lis" :key="index">
					<li v-for="(item, index2) in item.product" :key="index2" class="pub_list ">
						<image class="pic" mode="aspectFill" :src="item.product_photo"></image>
						<view class="pub_list_bd">
							<view class="tit">
								{{ item.product_name }}
								<block v-for="(itemss, indexss) in item.specification" v-key="indexss">
									+{{ itemss.val }}/{{ itemss.val != '否' ? itemss.price : 0 }}€</block>
							</view>
						</view>
						<view class="num">x {{ item.product_number }}</view>
						<view class="price">€{{ item.product_prices }}<text
								class="small">€{{ item.product_oldprices }}</text></view>
					</li>
				</ul>
			</view>
			<view class="orderDetail  mb10">
				<view class="cost textborder">
					<view class="pub_list">
						<view>配送费</view>
						<view>€{{ orderdetail.freight }}</view>
					</view>
					<view class="pub_list">
						<view>包装费</view>
						<view>€{{ orderdetail.package_price }}</view>
					</view>
					<view v-for="(item, index) in orderdetail.youhui" :key="index" class="pub_list list_box"
						v-if="orderdetail.youhui.length > 0">
						<view class="clear_both">
							<!-- <text class="ico" :style="'background: #' + item.color + ';'"> -->
							<!-- {{item.word}}</text> -->
							{{ item.title }}
						</view>
						<view class="fontcl2">{{ item.word == '卡' ? '' : '-' }}€{{ item.amount }}</view>
					</view>
					<view class="pub_list list_box">
						<view><text class="mr20">总计€ {{ orderdetail.total_price }}</text>
							<block>优惠€{{ orderdetail.order_youhui }}</block>
						</view>
						<view>实付<text class="fontcl2">€{{ orderdetail.amount }}</text></view>
					</view>
				</view>
			</view>
			<view class="orderInfo mb10">
				<view class="bt">配送信息</view>
				<view class="list">送达时间：{{ orderdetail.pei_time }}</view>
				<view class="list">
					<view class="fl">收货地址：</view>
					<view class="addr" v-if="orderdetail.pei_type == 1||orderdetail.pei_type == 0">
						<view>{{ orderdetail.contact }}</view>
						<view>{{ orderdetail.mobile }}</view>
						<view class="overflow_clear">{{ orderdetail.addr }} - {{ orderdetail.house }}</view>
					</view>
					<view class="addr" v-if="orderdetail.pei_type == 3">
						<view>{{ orderdetail.phone }}</view>
						<view class="overflow_clear">{{ orderdetail.waimai.addr }} </view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="list">
					配送方式：
					<block v-if="orderdetail.pei_type == 0">商家送</block>
					<block v-if="orderdetail.pei_type == 1">平台送</block>
					<block v-if="orderdetail.pei_type == 3">用户自提</block>
				</view>
				<view class="list">
					呼叫骑手：
					<block>{{ orderdetail.apply_delivery_from }}</block>
				</view>
			</view>
			<view class="orderInfo mb10">
				<view class="bt">订单信息</view>
				<view class="list">订单号：{{ orderdetail.order_id }} <text class="fuzhi" @tap="setfuzhi">复制</text></view>
				<view class="list">支付方式：<block v-if="orderdetail.online_pay == 1">在线支付</block>
					<block v-else>
						<block v-if="orderdetail.is_pos == 1">餐到付款刷卡</block>
						<block v-else>餐到付款现金</block>
					</block>
				</view>
				<view class="list">下单时间：{{ orderdetail.ordertime }}</view>
				<view class="list">订单备注：{{ orderdetail.intro }}</view>
				<view class="list" v-if="orderdetail.spend_number">自提码：{{ orderdetail.spend_number }}</view>
			</view>
		</view>
		<!-- 红包弹出 -->
		<view class="fixed_hb" :hidden="hongbao_num">
			<image src="/static/image/btn_hongbao.png">
				<button open-type="share" class="hbshare_btn"></button>
			</image>
		</view>


		<!-- 电话弹出框 -->
		<!-- <view class="fixed_box" >
    <image src="../../image/order-details/btn_fr_order1x.png" bindtap="phoneTap"></image>
    <view wx-if="{{orderdetail.spend_number}}"><image src="../../image/order-details/btn_fr_order2x.png" bindtap='seeCode'></image></view>
</view>
<view class="phonePopup" hidden="{{phoneHidden}}">
        <view class="weui-mask"  bindtap="maskHidden1"></view>
        <view class="cont">
            <view class="list_box">
                <view class="list" bindtap="phoneOne">联系商家</view>
                <block wx:if="{{orderdetail.pei_type==1 && orderdetail.staff_id>0}}">
                    <view class="list" bindtap="phoneTwo">联系骑手</view>
                </block>
                <view class="list lxkfbtns"><button class="lxkfbtn" open-type="contact"></button>联系客服</view>
                
            </view>
        </view>
</view> -->
		<!-- 电话弹出框end -->

		<!-- 申请退款弹出框 -->
		<view class="cancel_popup" :hidden="tuikuan">
			<view class="weui-mask" @tap="hide"></view>
			<view class="cont">
				<view class="bt">退款理由</view>
				<view class="section">
					<textarea :hidden="tuikuan" :placeholder="tuikuan_reason" @input="getReason"></textarea>
				</view>
				<view class="btn_box">
					<button type="default" :disabled="disabled" :size="defaultSize" hover-class="other-button-hover"
						@tap="hide">取消</button>
					<button type="default" :size="defaultSize" @tap="tuikuanFun" hover-class="other-button-hover"
						class="btn">确定</button>
				</view>
			</view>
		</view>
		<!-- 申请退款弹出框end -->
		<view confirm-text="是" cancel-text="否" :hidden="modalHidden" mask @confirm="cancel" @cancel="hide">
			<text class="black3">确定要取消订单吗？</text>
		</view>
		<view confirm-text="是" cancel-text="否" :hidden="confirmorder" mask @confirm="confirm" @cancel="hide">
			<text class="black3">确认收货吗</text>
		</view>

		<!-- 查看自提码 -->
		<view title="自提码" confirm-text cancel-text :hidden="codeOrder" mask @cancel="hide">
			<view class="code_number">{{ orderdetail.spend_number }}</view>
			<view class="code_code">
				<canvas style="width:278px;height:278px;" canvas-id="mycanvas" class="code-image"></canvas>
			</view>
		</view>


		<view class="bai-cont" :hidden="whitebg">
			<view class="main-img">
				<image src="/static/image/loading2.gif"></image>
			</view>
		</view>
		<!--白布-->
	</view>
</template>

<script>
var app = getApp();
var orderid;
var common = require("../../js/ecart.js");
var ecart = null;
var double = true;
var reason;
var QR = require("../../utils/qrcode.js"); // 引入SDK核心类
// 引入SDK核心类
var QQMapWX = require("../../js/qqmap-wx-jssdk.js");
var qqmapsdk;

export default {
	data() {
		return {
			pageimg: app.globalData._CFG.IMG_URL || '',
			orderdetail: {
				msg: "",
				order_id: "",
				order_status: 0,
				comment_status: 0,
				show_btn: 0,
				waimai: "",
				freight: "",
				package_price: "",
				youhui: [],
				total_price: "",
				order_youhui: "",
				amount: "",
				pei_time: "",
				contact: "",
				mobile: "",
				addr: "",
				pei_type: 0,
				online_pay: 0,
				is_pos: 0,
				ordertime: "",
				intro: "",
				spend_number: ""
			},
			goods_lis: [],
			phoneHidden: true,
			cancelHidden: true,
			cancelList: [],
			tuikuan: true,
			modalHidden: true,
			confirmorder: true,
			tuikuan_reason: "",
			rider_mobile: '',
			waimai_phone: '',
			kefu_phone: '',
			mytime: '',
			whitebg: false,
			codeOrder: true,
			hongbao_num: "",
			hongbao: '',
			defaultSize: "",
			disabled: "",
			orderid: "",
			current: "",
			showToast: {
				isShow: false
			}
		};
	},

	components: {},
	props: {},
	onLoad: function (e) {
		orderid = e.orderid; // orderid = 11533;

		var that = this;
		that.setData({
			orderid: orderid
		});
	},

	onShow(e) {
		this.bindonshow();
	},

	onPullDownRefresh() {
		this.bindonshow();
		uni.stopPullDownRefresh();
	},

	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			let hongbao = this.hongbao;
			return {
				title: hongbao.title,
				imageUrl: hongbao.imgUrl,
				path: "/pages/webview/webview?url=" + encodeURIComponent(hongbao.link)
			};
		} else {
			return {
				title: '微信小程序外卖',
				path: '/pages/index/index',
				// imageUrl: '',
				success: function (res) { // 分享成功
				},
				fail: function (res) { // 分享失败
				}
			};
		}
	},
	methods: {
		setfuzhi() {
			let value = this.orderdetail.order_id
			// uni.setClipboardData({
			//        data:value,//要被复制的内容
			//        success:()=>{//复制成功的回调函数
			//          uni.showToast({//提示
			//            title:"复制成功"
			//          })
			//        }
			//      });  
			console.log(value)
			uni.setClipboardData({
				data: value,
				success: function (res) {
					uni.getClipboardData({
						success: function (res) {
							uni.showToast({
								title: '复制成功',
							})
						}
					})
				}
			})
		},

		bindonshow() {
			var that = this;
			var orderid = that.orderid;
			app.globalData.ordersDetail({
				"order_id": orderid
			}, function (res) {
				console.log(res);

				if (res.error == '0') {
					var data = res.data.detail;
					data.ordertime = that.getLocalTime(data.dateline);
					var mineyouhui = data.total_price - data.amount;
					data.order_youhui = mineyouhui.toFixed(2);
					var tmp_freight = data.freight;

					if (Number(res.data.detail.hongbao_num) > 0) {
						that.setData({
							hongbao_num: false,
							hongbao: res.data.detail.hongbao
						});
					} else {
						that.setData({
							hongbao_num: true
						});
					}

					if (tmp_freight == '0.00') {
						data.freight = "免配送费";
					}

					if (data.pei_time == '0') {
						data.pei_time = "立刻送达";
					} else {
						data.pei_time = new Date(parseInt(data.pei_time) * 1000).toLocaleString().replace(
							/:\d{1,2}$/, ' ');
					}

					if (data.show_btn.pay == 1) {
						that.daojishi(data.pay_ltime, data.dateline);
					}

					that.rider_mobile = data.staff.mobile || '';
					that.waimai_phone = data.waimai.phone;
					that.kefu_phone = data.kefu_phone;
					if (data.products.length == 1) {
						for (let i in data.products) {
							for (let s in data.products[i].product)
								for (let h in data.products[i].product[s].specification) {
									if (data.products[i].product[s].specification[h].price > 0 && data
										.products[i].product[s].specification[h].val != '否') {
										data.products[i].product[s].product_oldprices = parseFloat(data
											.products[i].product[s].product_oldprices) + parseFloat(data
												.products[i].product[s].specification[h].price)
										data.products[i].product[s].product_prices = parseFloat(data.products[
											i].product[s].product_prices) + parseFloat(data.products[i]
												.product[s].specification[h].price)
									}
								}
						}
					}
					that.setData({
						orderdetail: data,
						whitebg: true,
						goods_lis: data.products
					});
					that.createQrCode(data.spend_number, "mycanvas", 278, 278);
				} else {
					that.setData({
						whitebg: true
					});
				}
			});
		},
		createQrCode: function (url, canvasId, cavW, cavH) {
			//调用插件中的draw方法，绘制二维码图片
			QR.api.draw(url, canvasId, cavW, cavH);
		},

		daojishi(pay_ltime, dateline) {
			//2017/09/22 yufan
			var that = this;
			var payltime = parseInt(pay_ltime) * 60;
			var mytime = Date.parse(new Date()) / 1000;
			var reducetime = payltime - (mytime - dateline);
			var hour = parseInt(reducetime / (60 * 60));
			var minute = parseInt(reducetime / 60 % 60);
			var second = parseInt(reducetime % 60);

			if (minute < 10) {
				minute = '0' + minute;
			}

			if (second < 10) {
				second = '0' + second;
			}

			var timelabel = hour + '时' + minute + '分' + second + '秒';

			if (reducetime <= 0) {
				that.orderdetail.msg = '订单超时已取消';
				that.orderdetail.order_status = -1;
				that.orderdetail.show_btn = {
					'again': 1
				};
				that.setData({
					orderdetail: that.orderdetail
				});
			} else {
				setTimeout(function () {
					that.daojishi(pay_ltime, dateline);
				}, 500);
				that.setData({
					mytime: timelabel
				});
			} // console.log(reducetime);

		},

		getLocalTime(nS) {
			if (Number(nS)) {
				let _year = new Date(parseInt(nS) * 1000).getFullYear();

				let _month = new Date(parseInt(nS) * 1000).getMonth() + 1 >= 10 ? new Date(parseInt(nS) * 1000)
					.getMonth() + 1 : "0" + (new Date(parseInt(nS) * 1000).getMonth() + 1);

				let _date = new Date(parseInt(nS) * 1000).getDate() >= 10 ? new Date(parseInt(nS) * 1000).getDate() :
					"0" + new Date(parseInt(nS) * 1000).getDate();

				let _hour = new Date(parseInt(nS) * 1000).getHours() >= 10 ? new Date(parseInt(nS) * 1000).getHours() :
					"0" + new Date(parseInt(nS) * 1000).getHours();

				let _minute = new Date(parseInt(nS) * 1000).getMinutes() >= 10 ? new Date(parseInt(nS) * 1000)
					.getMinutes() : "0" + new Date(parseInt(nS) * 1000).getMinutes();

				return `${_year}/${_month}/${_date} ${_hour}:${_minute}`;
			} else {
				return 0;
			}
		},

		callRider: function () {
			var rider_mobile = this.rider_mobile;
			uni.makePhoneCall({
				phoneNumber: rider_mobile
			});
		},
		paybtn: function (e) {
			if (double) {
				app.globalData._CFG.payorderid = e.currentTarget.dataset.orderid;
				uni.navigateTo({
					url: '../payment/payment?orderid=' + e.currentTarget.dataset.orderid
				});
				double = false;
				setTimeout(function () {
					double = true;
				}, 500);
			}

			;
		},
		todetail: function (e) {
			var id = e.currentTarget.id;
			app.globalData._CFG.shoptail = id;
			app.globalData.topage('../shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
		},
		phoneTap: function (e) {
			this.setData({
				phoneHidden: false
			});
		},
		maskHidden1: function (e) {
			this.setData({
				phoneHidden: true
			});
		},
		phoneOne: function (e) {
			var that = this;
			var waimai_phone = that.waimai_phone;
			uni.makePhoneCall({
				phoneNumber: waimai_phone
			});
		},
		phoneTwo: function (e) {
			var that = this;
			var rider_mobile = that.rider_mobile;
			uni.makePhoneCall({
				phoneNumber: rider_mobile
			});
		},
		phoneThree: function (e) {
			var that = this;
			var kefu_phone = that.kefu_phone;
			uni.makePhoneCall({
				phoneNumber: kefu_phone
			});
		},
		cancelTap: function (e) {
			this.setData({
				cancelHidden: false
			});
		},
		maskHidden2: function (e) {
			this.setData({
				cancelHidden: true
			});
		},
		switchColor: function (e) {
			this.setData({
				current: e.currentTarget.dataset.idx
			});
		},
		tuipop: function (e) {
			this.setData({
				tuikuan: false,
				tuikuan_reason: "请输入退款理由"
			});
		},
		hide: function () {
			this.setData({
				tuikuan: true,
				modalHidden: true,
				confirmorder: true,
				codeOrder: true
			});
		},
		getReason: function (e) {
			reason = e.detail.value;
		},
		tuikuanFun: function (e) {
			var that = this;
			app.globalData.ordersTui({
				"order_id": orderid,
				"reason": reason
			}, function (res) {
				if (res.error == '0') {
					uni.showToast({
						title: "申请退款成功"
					});
					app.globalData.ordersDetail({
						"order_id": orderid
					}, function (res) {
						if (res.error == '0') {
							that.setData({
								orderdetail: res.data.detail,
								goods_lis: res.data.detail.products
							});
						} else {
							uni.showToast({
								title: res.message
							});
						}
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
			this.setData({
				tuikuan: true
			});
		},
		onemore: function (e) {
			if (double) {
				app.globalData._CFG.shoptail = e.currentTarget.dataset.shopid;
				ecart = new common.ECart(app.globalData._CFG.shoptail);
				var pro = this.orderdetail.products;
				ecart.clear(e.currentTarget.dataset.shopid);
				var sku_msg = [],
					str_name = '',
					str_obj = {}; //库存不足的商品名称

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

						var num; // var obj = {
						//     "price" :pro[i].product[j] .product_price,
						//     "sku_id" :sku_id,
						//     'spec_id':pro[i].product[j].spec_id,
						//     'product_id':pro[i].product[j].product_id,
						//     "num":num,
						//     "shopid":app._CFG.shoptail,
						//     "title":pro[i].product[j].product_name,
						//     'sale_sku':pro[i].product[j].sale_sku,
						//     'package': pro[i].product[j].package_price,
						//     'str_obj': pro[i].product[j].specification,
						//     'str_name': str_name,
						//     'pcate_id': pro[i].product[j].cate_id
						// }

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
							"shoptitle": this.orderdetail.shop_title,
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
							obj.num = pro[i].product[j].sale_sku;
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

				setTimeout(function () {
					uni.navigateTo({
						url: '../shoptail/shoptail?id=' + app.globalData._CFG.shoptail
					});
				}, 1000);
				double = false;
				setTimeout(function () {
					double = true;
				}, 500);
			}
		},
		cancelpop: function () {
			let that = this
			uni.showModal({
				title: '提示',
				content: '确定要取消订单吗？',
				success: function (res) {
					if (res.confirm) {
						that.cancel()
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			}); // this.setData({
			//   modalHidden: false
			// });

		},
		confirmpop: function () {
			let that = this
			uni.showModal({
				title: '提示',
				content: '确认收货吗？',
				success: function (res) {
					if (res.confirm) {
						// that.setData({
						//   orderid: e.currentTarget.dataset.orderid
						// });

						that.confirm()
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			// this.setData({
			//   confirmorder: false
			// });
		},
		cancel: function () {
			var that = this;
			app.globalData.ordersCancel({
				"order_id": orderid
			}, function (res) {
				if (res.error == '0') {
					uni.showToast({
						title: '取消订单成功'
					});
					app.globalData.ordersDetail({
						"order_id": orderid
					}, function (res) {
						if (res.error == '0') {
							//that.setData({
							//    orderdetail: res.data.detail,
							//    goods_lis: res.data.detail.products
							//})                
							app.globalData.topage('../orderDetail/detail?orderid=' + orderid);
						}
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
			this.setData({
				modalHidden: true
			});
		},
		cui: function (e) {
			var that = this;
			app.globalData.ordersCui({
				"order_id": e.currentTarget.dataset.orderid,
				"reason": reason
			}, function (res) {
				if (res.error == '0') {
					uni.showToast({
						title: '催单成功'
					});
					app.globalData.ordersDetail({
						"order_id": orderid
					}, function (res) {
						if (res.error == '0') {
							that.setData({
								orderdetail: res.data.detail,
								goods_lis: res.data.detail.products
							});
						}
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},
		confirm: function () {
			var that = this;
			app.globalData.ordersConfirm({
				"order_id": orderid
			}, function (res) {
				if (res.error == '0') {
					uni.showToast({
						title: '确认订单成功'
					});
					app.globalData.ordersDetail({
						"order_id": orderid
					}, function (res) {
						if (res.error == '0') {
							that.setData({
								orderdetail: res.data.detail,
								goods_lis: res.data.detail.products
							});
						}
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
			this.setData({
				confirmorder: true
			});
		},
		//申请客服2017/05/06yu
		kefu: function (e) {
			var that = this;
			app.globalData.ordersKefu({
				"order_id": e.currentTarget.dataset.orderid
			}, function (res) {
				if (res.error == '0') {
					uni.showToast({
						title: "申请客服成功，请耐心等待"
					});
					app.globalData.ordersDetail({
						"order_id": orderid
					}, function (res) {
						if (res.error == '0') {
							that.setData({
								orderdetail: res.data.detail,
								goods_lis: res.data.detail.products
							});
						}
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},
		//查看订单信息2017/05/06yu
		status: function (e) {
			console.log(e);
			var that = this;
			app.globalData.ordersStatus({
				"order_id": e.currentTarget.dataset.orderid
			}, function (res) {
				if (res.error == '0') {
					uni.setStorage({
						key: 'order_logs',
						data: res.data.logs,
						success: function (res) { }
					});
					app.globalData.topage('../orderStatus/status');
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},
		evltTap: function (e) {
			var obj = JSON.stringify(e.currentTarget.dataset.obj);
			app.globalData.topage('../ordevlt/ordevlt?obj=' + obj);
		},
		lookelv: function (e) {
			var id = e.currentTarget.dataset.shopid;
			app.globalData._CFG.shoptail = id;
			app.globalData.topage('../shoptail/shoptail?currentNavtab=1&id=' + app.globalData._CFG.shoptail);
		},

		//查看自提码
		seeCode() {
			this.setData({
				codeOrder: false
			});
		}

	}
};
</script>
<style>
.textborder {
	border-bottom: 1rpx #E6E6E6 solid;
}

page {
	background: #ffffff;
}

.fontcl2 {
	color: #FF797C;
}

.orderStatus {
	background: #ffffff;
	padding: 30rpx;
	text-align: center;
	border-bottom: 2rpx solid #E6EAED;
}

.orderStatus .bt {
	font-size: 40rpx;
	color: #3E4248;
	font-weight: 600;
}

.orderStatus .wz {
	margin-top: 24rpx;
}

.orderStatus button {
	border: 2rpx solid #037E98;
	color: #037E98;
	display: inline-block;
	background: #ffffff;
	line-height: 76rpx;
	width: 208rpx;
	font-size: 32rpx;
	margin-right: 30rpx;
	height: 76rpx;
	border-radius: 24rpx;
}

.orderStatus button:last-child {
	margin-right: 0;
}

.orderStatus button.pay_btn {
	background: #FF797C;
	color: #ffffff;
	border: none;
}

.orderStatus button.pay_btn:after {
	display: none;
}

.orderDetail,
.orderInfo {
	background: #ffffff;
}

.orderDetail .tit {
	padding: 0 40rpx;
	font-size: 32rpx;
	height: 80rpx;
	line-height: 80rpx;
	color: #262628;
	font-weight: bold;
}

.orderDetail .tit .img2 {
	width: 28rpx;
	height: 28rpx;
}

.caidanListsOne {
	margin: 0 40rpx;
}

.caidanListsOne ul li {
	background-color: #fff;
	padding: 12rpx 0;
}

.caidanListsOne ul li .pic {
	background-color: #eee;
	width: 96rpx;
	height: 96rpx;
	border-radius: 4rpx;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	margin-right: 20rpx;
}

.caidanListsOne ul li .tit {
	font-size: 28rpx;
	font-weight: normal;
	width: 256rpx;
	color: #262628;
	font-weight: bold;
}

.caidanListsOne ul li .num {
	font-size: 24rpx;
	color: #A3A3A4;
	width: 80rpx;
	font-weight: bold;
}

.caidanListsOne ul li .price {
	font-size: 28rpx;
	color: #262628;
	width: 256rpx;
	text-align: right;
	font-weight: 500;
}

.caidanListsOne ul li .small {
	font-size: 20rpx;
	color: #A8A8A9;
	margin-left: 8rpx;
	text-decoration: line-through;
}

.caidanListsTwo {
	background-color: #fff;
}

.caidanListsTwo .basket_list {
	overflow: hidden;
	margin: 0rpx 20rpx;
	padding: 20rpx 0;
	border-bottom: 2rpx solid #eee;
}

.caidanListsTwo .basket_list:last-child {
	border-bottom: 0;
}

.caidanListsTwo .ico_basket {
	display: block;
	float: left;
	width: 36rpx;
	height: 40rpx;
	background: url("/static/image/icon_basket3x.png") no-repeat center;
	background-size: contain;
}

.caidanListsTwo .right_box {
	margin-left: 56rpx;
}

.caidanListsTwo .title {
	font-size: 32rpx;
	line-height: 40rpx;
	color: #333;
	margin-bottom: 8rpx;
	font-weight: normal;
}

.caidanListsTwo ul li {
	background-color: #fff;
	padding: 0rpx 0;
}

.caidanListsTwo ul li .tit {
	font-size: 28rpx;
	color: #333;
	font-weight: normal;
	width: 256rpx;
}

.caidanListsTwo ul li .num {
	font-size: 28rpx;
	color: #666;
	width: 80rpx;
}

.caidanListsTwo ul li .price {
	font-size: 32rpx;
	color: #333;
	width: 256rpx;
	text-align: right;
}

.caidanListsTwo ul li .small {
	font-size: 20rpx;
	color: #999;
	margin-left: 8rpx;
}

.clear_both {
	color: #262628;
	font-size: 24rpx
}

.orderDetail .cost {
	margin: 0 40rpx;
}

.orderDetail .cost .pub_list {
	-webkit-box-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
	line-height: 80rpx;
	position: relative;
	border: none;
	color: #262628;
	font-size: 24rpx
}

.orderDetail .cost .list_box {
	font-size: 28rpx;
}

.orderDetail .cost .pub_list .ico {
	width: 32rpx;
	height: 32rpx;
	display: inline-block;
	border-radius: 8rpx;
	line-height: 32rpx;
	text-align: center;
	color: #fff;
	font-size: 24rpx;
	font-style: normal;
	margin-right: 12rpx;
	vertical-align: text-bottom;
}

.orderInfo .fuzhi {
	font-size: 26rpx;
	color: #3B96B1;
	float: right;
}

.orderInfo .bt {
	font-size: 28rpx;
	height: 80rpx;
	line-height: 80rpx;
	padding: 0 64rpx;
	margin-top: 10rpx;
	font-weight: 600;
}

.orderInfo .list {
	padding: 16rpx 64rpx;
	color: #262628;
}

.orderInfo .list .addr {
	margin-left: 120rpx;
}

.ordertip {
	font-size: 26rpx;
	margin-top: 20rpx;
}

.orderMap {
	width: 100%;
	height: 540rpx;
	position: relative;
}

.orderMap .tipNum {
	display: block;
	padding: 0 24rpx;
	height: 80rpx;
	background: #ff8800;
	color: #fff;
	line-height: 80rpx;
	font-size: 28rpx;
}

.orderMap .tipNum image {
	width: 40rpx;
	height: 40rpx;
	margin-top: 20rpx;
}

.orderMap .map {
	width: 100%;
	height: 400rpx;
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
	/*  #ifdef  H5  */
	top: calc(88rpx + constant(safe-area-inset-top));
	top: calc(88rpx + env(safe-area-inset-top));
	/*  #endif  */
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



.bai-cont {
	width: 100%;
	height: 100%;
	background: #fff;
	position: fixed;
	top: 0;
	/*  #ifdef  H5  */
	top: calc(88rpx + constant(safe-area-inset-top));
	top: calc(88rpx + env(safe-area-inset-top));
	/*  #endif  */
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
}

.bai-cont .main-img {
	position: absolute;
	z-index: 1000;
	top: 45%;
	left: 50%;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
	line-height: 0;
	width: 190rpx;
	height: 190rpx;
	text-align: center;
	background: rgba(0, 0, 0, .8);
	vertical-align: middle;
	opacity: .6;
	border-radius: 10rpx;
}

.bai-cont .main-img image {
	width: 100rpx;
	height: 100rpx;
	margin-top: 45rpx;
}

.status_btn {
	margin-top: 30rpx;
}

/*订单自提码*/
.code_number {
	font-size: 40rpx;
	margin: 30rpx 0;
	text-align: center;
	color: #f60;
}

.code_code {
	position: relative;
	width: 280px;
	height: 280px;
	border: 2rpx solid #ff797c;
	box-sizing: border-box;
	text-align: center;
	overflow: hidden;
}

/* .code_code canvas{position: absolute; left: 50%; top: 50%;  transform: translate(-50%,-50%); -webkit-ransform: translate(-50%,-50%);} */

/* 红包弹出框 */
.fixed_hb {
	position: fixed;
	right: 20rpx;
	bottom: 170rpx
}

.fixed_hb image {
	width: 100rpx;
	height: 100rpx;
	position: relative;
	display: inline-block
}

.hbshare_btn {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	opacity: 0;
}

.lxkfbtns {
	position: relative;
}

.lxkfbtn {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwb2o0MVBnJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYyxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsaUNBQWlDLENBQUM7QUFDekcsa0JBQWtCLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGFBQWEsQ0FBQztBQUNyRSx3QkFBd0IsWUFBWSxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSxrQkFBa0IsQ0FBQztBQUMvRixrQkFBa0IsaUJBQWlCLENBQUM7QUFDcEMscUJBQXFCLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDO0FBQzdJLGdDQUFnQyxjQUFjLENBQUM7QUFDL0MsNkJBQTZCLG1CQUFtQixFQUFFLGNBQWMsQ0FBQztBQUNqRSxtQ0FBbUMsYUFBYSxDQUFDOztBQUVqRCx5QkFBeUIsbUJBQW1CLENBQUM7QUFDN0MsbUJBQW1CLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxpQ0FBaUMsQ0FBQztBQUM1SCx5QkFBeUIsWUFBWSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQztBQUMxRSx5QkFBeUIsWUFBWSxFQUFFLGFBQWEsQ0FBQzs7QUFFckQsc0JBQXNCLHNCQUFzQixFQUFFLG9CQUFvQixDQUFDO0FBQ25FLDJCQUEyQixzQkFBc0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixFQUFFLDJCQUEyQixFQUFFLDRCQUE0QixFQUFFLG1CQUFtQixDQUFDO0FBQzVNLDRCQUE0QixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxDQUFDO0FBQzlGLDJCQUEyQixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDO0FBQ3ZFLDZCQUE2QixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDO0FBQzdGLDZCQUE2QixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUM7QUFDOUUsZ0JBQWdCLHNCQUFzQixDQUFDO0FBQ3ZDLDZCQUE2QixnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSw4QkFBOEIsQ0FBQztBQUNwSCx3Q0FBd0MsZ0JBQWdCLENBQUM7QUFDekQsNEJBQTRCLGNBQWMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSx5RUFBeUUsRUFBRSx3QkFBd0IsQ0FBQztBQUMxTCwyQkFBMkIsa0JBQWtCLENBQUM7QUFDOUMsdUJBQXVCLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztBQUNuSCxzQkFBc0Isc0JBQXNCLEVBQUUsZUFBZSxDQUFDO0FBQzlELDRCQUE0QixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxDQUFDO0FBQzlGLDJCQUEyQixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDO0FBQ3ZFLDZCQUE2QixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDO0FBQzdGLDZCQUE2QixnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUM7O0FBRTlFLG9CQUFvQixnQkFBZ0IsRUFBRSxpQ0FBaUMsQ0FBQztBQUN4RSwrQkFBK0IseUJBQXlCLEVBQUUsc0NBQXNDLEVBQUUsOEJBQThCLEdBQUcsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUM7QUFDMUssb0NBQW9DLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQ0FBaUMsQ0FBQztBQUNwSSwrQ0FBK0MsYUFBYSxDQUFDO0FBQzdELDhCQUE4QixnQkFBZ0IsQ0FBQztBQUMvQyxrQ0FBa0MsWUFBWSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsMkJBQTJCLENBQUM7OztBQUc3TyxnQkFBZ0IsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGlDQUFpQyxDQUFDO0FBQ3pILGtCQUFrQixvQkFBb0IsRUFBRSxjQUFjLEVBQUUsaUNBQWlDLENBQUM7QUFDMUYsd0JBQXdCLG1CQUFtQixDQUFDO0FBQzVDLFVBQVUsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUM7O0FBRTdDLFdBQVcsV0FBVyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQztBQUMzRCxtQkFBbUIsY0FBYyxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUU7QUFDM0kseUJBQXlCLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUM7QUFDeEUsZ0JBQWdCLFdBQVcsRUFBRSxjQUFjLENBQUM7O0FBRTVDLFlBQVksZUFBZSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUM7QUFDekQsa0JBQWtCLGFBQWEsRUFBRSxjQUFjLENBQUM7QUFDaEQsYUFBYSxlQUFlLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUNwRG5ELGtCQUFBLENBQUEsaURBQUEsQ0FBQSw0Q0FBQSxDQUFBLGNBQUEsQ0RvRHFELFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLDhCQUE4QixDQUFDO0FBQ2xILHVDQUF1QyxlQUFlLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsd0NBQXdDLEVBQUUsZ0NBQWdDLEVBQUUsVUFBVSxFQUFFLHNCQUFzQixFQUFFLG1DQUFtQyxFQUFFLDJCQUEyQixFQUFFLHVCQUF1QixFQUFFLHlDQUF5QyxFQUFFLGlDQUFpQyxFQUFFLHlCQUF5QixFQUFFLGdEQUFnRCxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSx5QkFBeUIsQ0FBQztBQUMvZix1QkFBdUI7QUFDdkIsbUJBQW1CLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLENBQUM7QUFDakksMkJBQTJCLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsNkJBQTZCLEVBQUUsY0FBYyxFQUFFLDZCQUE2QixFQUFFLHFCQUFxQixFQUFFLDhCQUE4QixFQUFFLHNCQUFzQixDQUFDO0FBQ2pRLHVDQUF1QyxhQUFhLENBQUM7O0FBRXJELG1CQUFtQixjQUFjLEVBQUUsb0JBQW9CLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixDQUFDO0FBQzlHLDBCQUEwQiw0QkFBNEIsQ0FBQztBQUN2RCwrQkFBK0IsZUFBZSxFQUFFLFdBQVcsQ0FBQztBQUM1RCxnQ0FBZ0MsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7QUFDMUUsOEJBQThCLFdBQVcsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsMEJBQTBCLEVBQUUsb0JBQW9CLEVBQUUsc0JBQXNCLEVBQUUsY0FBYyxDQUFDO0FBQzNMLGlDQUFpQyxtQkFBbUIsRUFBRSxjQUFjLEVBQUUscUJBQXFCLENBQUM7O0FBRTVGLHdCQUF3QixzQkFBc0IsQ0FBQztBQUMvQyxpQ0FBaUMsV0FBVyxFQUFFLGNBQWMsRUFBRSwwQkFBMEIsRUFBRSxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBRSxjQUFjLENBQUM7O0FBRXRKLHdCQUF3Qiw4QkFBOEIsQ0FBQztBQUN2RCxrQ0FBa0MscUJBQXFCLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsQ0FBQztBQUNwSixxQ0FBcUMsYUFBYSxDQUFDO0FBQ25ELDZCQUE2QiwrQkFBK0IsRUFBRSxzQkFBc0IsRUFBRSxjQUFjLENBQUM7Ozs7QUFJckcsVUFBVSxXQUFXLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxNQUFNLENDNUV6RSxrQkFBQSxpREFBQSw0Q0FBQSxjQUFBLEFENEUwRSxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7QUFDbEgsb0JBQW9CLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDLHVDQUF1QyxDQUFDLGNBQWMsQ0FBQyxZQUFZO0FBQ3pLLGFBQWE7QUFDYixpQkFBaUI7QUFDakIseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQixVQUFVLENBQUMsb0JBQW9CLENBQUM7QUFDaEMsMEJBQTBCLFlBQVksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUM7O0FBRXhFLFlBQVksaUJBQWlCLENBQUM7O0FBRTlCLFFBQVE7QUFDUixhQUFhLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQUM7QUFDL0UsV0FBVyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDLHNCQUFzQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDO0FBQy9JLDBJQUEwSTs7QUFFMUksVUFBVTtBQUNWLFVBQVUsZUFBZSxDQUFDLFlBQVksQ0FBQyxjQUFjO0FBQ3JELGdCQUFnQixhQUFhLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQjtBQUNyRixhQUFhLFdBQVcsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ2xGO0FBQ0E7SUFDSSxrQkFBa0I7QUFDdEI7QUFDQTtJQUNJLGtCQUFrQjtJQUNsQixLQUFLO0lBQ0wsT0FBTztJQUNQLFFBQVE7SUFDUixTQUFTO0lBQ1QsV0FBVztBQUNmIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5vcmRlclN0YXR1c3sgYmFja2dyb3VuZDogI2ZmZmZmZjsgcGFkZGluZzogMzBycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgYm9yZGVyLWJvdHRvbTogMnJweCBzb2xpZCAjRTZFQUVEO31cclxuLm9yZGVyU3RhdHVzIC5idHsgZm9udC1zaXplOiAzMnJweDsgbGluZS1oZWlnaHQ6IDMycnB4O2hlaWdodDogMzJycHg7fVxyXG4ub3JkZXJTdGF0dXMgLmJ0IGltYWdleyB3aWR0aDogMzJycHg7IGhlaWdodDogMzJycHg7IHZlcnRpY2FsLWFsaWduOm1pZGRsZTsgbWFyZ2luLWxlZnQ6IDIwcnB4O31cclxuLm9yZGVyU3RhdHVzIC53ensgbWFyZ2luLXRvcDogMjRycHg7fVxyXG4ub3JkZXJTdGF0dXMgYnV0dG9ueyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGJhY2tncm91bmQ6ICNmZmZmZmY7IGxpbmUtaGVpZ2h0OiA4MHJweDsgcGFkZGluZzogMCA0MHJweDsgZm9udC1zaXplOiAzMnJweDsgbWFyZ2luLXJpZ2h0OiAzMHJweDt9XHJcbi5vcmRlclN0YXR1cyBidXR0b246bGFzdC1jaGlsZHsgbWFyZ2luLXJpZ2h0OjA7fVxyXG4ub3JkZXJTdGF0dXMgYnV0dG9uLnBheV9idG57IGJhY2tncm91bmQ6ICNGRjY2MDA7IGNvbG9yOiAjZmZmZmZmO31cclxuLm9yZGVyU3RhdHVzIGJ1dHRvbi5wYXlfYnRuOmFmdGVyeyBkaXNwbGF5OiBub25lO31cclxuXHJcbi5vcmRlckRldGFpbCwub3JkZXJJbmZveyBiYWNrZ3JvdW5kOiAjZmZmZmZmO31cclxuLm9yZGVyRGV0YWlsIC50aXR7IHBhZGRpbmc6IDAgMjRycHg7IGZvbnQtc2l6ZTogMjhycHg7IGhlaWdodDogODBycHg7IGxpbmUtaGVpZ2h0OiA4MHJweDsgYm9yZGVyLWJvdHRvbTogMnJweCBzb2xpZCAjRTZFQUVEO31cclxuLm9yZGVyRGV0YWlsIC50aXQgLmltZzF7IHdpZHRoOiAzMnJweDsgaGVpZ2h0OiAzMHJweDsgbWFyZ2luLXJpZ2h0OiAyMHJweDt9XHJcbi5vcmRlckRldGFpbCAudGl0IC5pbWcyeyB3aWR0aDogMjhycHg7IGhlaWdodDogMjhycHg7fVxyXG5cclxuLmNhaWRhbkxpc3RzT25lIHVsIGxpe2JhY2tncm91bmQtY29sb3I6ICNmZmY7IHBhZGRpbmc6IDEycnB4IDIwcnB4O31cclxuLmNhaWRhbkxpc3RzT25lIHVsIGxpIC5waWN7YmFja2dyb3VuZC1jb2xvcjogI2VlZTsgd2lkdGg6IDk2cnB4OyBoZWlnaHQ6IDk2cnB4OyBib3JkZXItcmFkaXVzOiA0cnB4OyBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyOyBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7IGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7IG1hcmdpbi1yaWdodDogMjBycHg7fVxyXG4uY2FpZGFuTGlzdHNPbmUgdWwgbGkgLnRpdHsgZm9udC1zaXplOiAzMnJweDsgY29sb3I6ICMzMzM7IGZvbnQtd2VpZ2h0OiBub3JtYWw7IHdpZHRoOiAyNTZycHg7fVxyXG4uY2FpZGFuTGlzdHNPbmUgdWwgbGkgLm51bXtmb250LXNpemU6IDI0cnB4OyBjb2xvcjogIzY2Njsgd2lkdGg6IDgwcnB4O31cclxuLmNhaWRhbkxpc3RzT25lIHVsIGxpIC5wcmljZXtmb250LXNpemU6IDMycnB4OyBjb2xvcjogIzMzMzsgd2lkdGg6IDI1NnJweDsgdGV4dC1hbGlnbjogcmlnaHQ7fVxyXG4uY2FpZGFuTGlzdHNPbmUgdWwgbGkgLnNtYWxse2ZvbnQtc2l6ZTogMjBycHg7IGNvbG9yOiAjOTk5OyBtYXJnaW4tbGVmdDogOHJweDt9XHJcbi5jYWlkYW5MaXN0c1R3b3tiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO31cclxuLmNhaWRhbkxpc3RzVHdvIC5iYXNrZXRfbGlzdHtvdmVyZmxvdzogaGlkZGVuOyBtYXJnaW46IDBycHggMjBycHg7IHBhZGRpbmc6IDIwcnB4IDA7IGJvcmRlci1ib3R0b206IDJycHggc29saWQgI2VlZTt9XHJcbi5jYWlkYW5MaXN0c1R3byAuYmFza2V0X2xpc3Q6bGFzdC1jaGlsZHtib3JkZXItYm90dG9tOiAwO31cclxuLmNhaWRhbkxpc3RzVHdvIC5pY29fYmFza2V0e2Rpc3BsYXk6IGJsb2NrOyBmbG9hdDogbGVmdDsgd2lkdGg6IDM2cnB4OyBoZWlnaHQ6IDQwcnB4OyBiYWNrZ3JvdW5kOnVybChcIi4uLy4uL3N0YXRpYy9uZXc0LjAvaWNvbl9iYXNrZXRAM3gucG5nXCIpIG5vLXJlcGVhdCBjZW50ZXI7IGJhY2tncm91bmQtc2l6ZTogY29udGFpbjt9XHJcbi5jYWlkYW5MaXN0c1R3byAucmlnaHRfYm94e21hcmdpbi1sZWZ0OiA1NnJweDt9IFxyXG4uY2FpZGFuTGlzdHNUd28gLnRpdGxle2ZvbnQtc2l6ZTogMzJycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgY29sb3I6ICMzMzM7IG1hcmdpbi1ib3R0b206IDhycHg7IGZvbnQtd2VpZ2h0OiBub3JtYWw7fSBcclxuLmNhaWRhbkxpc3RzVHdvIHVsIGxpe2JhY2tncm91bmQtY29sb3I6ICNmZmY7IHBhZGRpbmc6IDBycHggMDt9XHJcbi5jYWlkYW5MaXN0c1R3byB1bCBsaSAudGl0eyBmb250LXNpemU6IDI4cnB4OyBjb2xvcjogIzMzMzsgZm9udC13ZWlnaHQ6IG5vcm1hbDsgd2lkdGg6IDI1NnJweDt9XHJcbi5jYWlkYW5MaXN0c1R3byB1bCBsaSAubnVte2ZvbnQtc2l6ZTogMjhycHg7IGNvbG9yOiAjNjY2OyB3aWR0aDogODBycHg7fVxyXG4uY2FpZGFuTGlzdHNUd28gdWwgbGkgLnByaWNle2ZvbnQtc2l6ZTogMzJycHg7IGNvbG9yOiAjMzMzOyB3aWR0aDogMjU2cnB4OyB0ZXh0LWFsaWduOiByaWdodDt9XHJcbi5jYWlkYW5MaXN0c1R3byB1bCBsaSAuc21hbGx7Zm9udC1zaXplOiAyMHJweDsgY29sb3I6ICM5OTk7IG1hcmdpbi1sZWZ0OiA4cnB4O31cclxuXHJcbi5vcmRlckRldGFpbCAuY29zdHsgcGFkZGluZzogMCAyNHJweDsgYm9yZGVyLWJvdHRvbTogMnJweCBzb2xpZCAjRTZFQUVEO31cclxuLm9yZGVyRGV0YWlsIC5jb3N0IC5wdWJfbGlzdHsgIC13ZWJraXQtYm94LXBhY2s6IGp1c3RpZnk7IC13ZWJraXQtanVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47ICBsaW5lLWhlaWdodDogODBycHg7IHBvc2l0aW9uOiByZWxhdGl2ZTt9XHJcbi5vcmRlckRldGFpbCAuY29zdCAucHViX2xpc3Q6YWZ0ZXJ7IGNvbnRlbnQ6IFwiXCI7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTowOyBib3JkZXItYm90dG9tOiAycnB4IHNvbGlkICNFNkVBRUQ7fVxyXG4ub3JkZXJEZXRhaWwgLmNvc3QgLnB1Yl9saXN0Omxhc3QtY2hpbGQ6YWZ0ZXJ7IGRpc3BsYXk6IG5vbmU7fVxyXG4ub3JkZXJEZXRhaWwgLmNvc3QgLmxpc3RfYm94eyBmb250LXNpemU6IDI4cnB4O31cclxuLm9yZGVyRGV0YWlsIC5jb3N0IC5wdWJfbGlzdCAuaWNve3dpZHRoOiAzMnJweDtoZWlnaHQ6IDMycnB4O2Rpc3BsYXk6IGlubGluZS1ibG9jaztib3JkZXItcmFkaXVzOiA4cnB4O2xpbmUtaGVpZ2h0OiAzMnJweDt0ZXh0LWFsaWduOiBjZW50ZXI7Y29sb3I6ICNmZmY7Zm9udC1zaXplOiAyNHJweDtmb250LXN0eWxlOiBub3JtYWw7bWFyZ2luLXJpZ2h0OiAxMnJweDt2ZXJ0aWNhbC1hbGlnbjogdGV4dC1ib3R0b207fVxyXG5cclxuXHJcbi5vcmRlckluZm8gLmJ0eyBmb250LXNpemU6IDI4cnB4OyBoZWlnaHQ6IDgwcnB4OyBsaW5lLWhlaWdodDogODBycHg7IHBhZGRpbmc6IDAgMjRycHg7IGJvcmRlci1ib3R0b206IDJycHggc29saWQgI0U2RUFFRDt9XHJcbi5vcmRlckluZm8gLmxpc3R7IHBhZGRpbmc6IDI2cnB4IDI0cnB4OyBjb2xvcjogIzY2NjY2NjsgYm9yZGVyLWJvdHRvbTogMnJweCBzb2xpZCAjRTZFQUVEO31cclxuLm9yZGVySW5mbyAubGlzdCAuYWRkcnsgbWFyZ2luLWxlZnQ6IDEyMHJweDt9XHJcbi5vcmRlcnRpcHtmb250LXNpemU6IDI4cnB4O21hcmdpbi10b3A6IDIwcnB4O31cclxuXHJcbi5vcmRlck1hcHsgd2lkdGg6IDEwMCU7IGhlaWdodDogNTQwcnB4OyBwb3NpdGlvbjogcmVsYXRpdmU7fVxyXG4ub3JkZXJNYXAgLnRpcE51bXsgZGlzcGxheTogYmxvY2s7IHBhZGRpbmc6IDAgMjRycHg7IGhlaWdodDo4MHJweDsgYmFja2dyb3VuZDogI2ZmODgwMDsgY29sb3I6ICNmZmY7IGxpbmUtaGVpZ2h0OiA4MHJweDsgZm9udC1zaXplOiAyOHJweDsgfVxyXG4ub3JkZXJNYXAgLnRpcE51bSBpbWFnZXsgd2lkdGg6IDQwcnB4OyBoZWlnaHQ6IDQwcnB4OyBtYXJnaW4tdG9wOiAyMHJweDt9XHJcbi5vcmRlck1hcCAubWFweyB3aWR0aDogMTAwJTsgaGVpZ2h0OiA0MDBycHg7fVxyXG5cclxuLmZpeGVkX2JveHsgcG9zaXRpb246IGZpeGVkOyByaWdodDogMjBycHg7IGJvdHRvbTogNjBycHg7fVxyXG4uZml4ZWRfYm94IGltYWdleyB3aWR0aDogMTAwcnB4OyBoZWlnaHQ6IDEwMHJweDt9XHJcbi53ZXVpLW1hc2sgeyBwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDEwMDA7IHRvcDogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7IGJvdHRvbTogMDsgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjQpO31cclxuLnBob25lUG9wdXAgLmNvbnQsLmNhbmNlbF9wb3B1cCAuY29udHsgcG9zaXRpb246IGZpeGVkOyBsZWZ0OiA1MCU7IHRvcDogNTAlOyBib3R0b206IGF1dG87IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7IHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpOyB3aWR0aDogOTAlOyBib3gtc2l6aW5nOiBib3JkZXItYm94OyAtd2Via2l0LWJhY2tmYWNlLXZpc2liaWxpdHk6IGhpZGRlbjsgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuM3M7IHRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4zczsgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC4zczsgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC4zcywgLXdlYmtpdC10cmFuc2Zvcm0gLjNzOyB6LWluZGV4OiA1MDAwOyBib3JkZXItcmFkaXVzOiA4cnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO31cclxuLnBob25lUG9wdXAgLmxpc3RfYm94IHt9XHJcbi5waG9uZVBvcHVwIC5saXN0eyBmb250LXNpemU6IDMycnB4OyBoZWlnaHQ6IDEwMHJweDsgbGluZS1oZWlnaHQ6IDEwMHJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBjb2xvcjogIzMzMzMzMzsgcG9zaXRpb246IHJlbGF0aXZlO31cclxuLnBob25lUG9wdXAgLmxpc3Q6YmVmb3JlIHsgY29udGVudDogXCIgXCI7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyByaWdodDogMDsgaGVpZ2h0OiAxcHg7IGJvcmRlci10b3A6IDFweCBzb2xpZCAjRDlEOUQ5OyBjb2xvcjogI0Q5RDlEOTsgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiAwIDA7IHRyYW5zZm9ybS1vcmlnaW46IDAgMDsgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlWSgwLjUpOyB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpO31cclxuLnBob25lUG9wdXAgLmxpc3Q6Zmlyc3QtY2hpbGQ6YmVmb3JlIHsgZGlzcGxheTogbm9uZTt9XHJcblxyXG4uY2FuY2VsX3BvcHVwIC5idHsgcGFkZGluZzogMzBycHg7IG1hcmdpbi1ib3R0b206IDEwcnB4OyBmb250LXNpemU6IDI4cnB4OyBjb2xvcjogIzMzMzMzMzsgdGV4dC1hbGlnbjogY2VudGVyO31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94eyBwYWRkaW5nOiAxMHJweCAyMHJweCAwIDQwcnB4O31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94IC5ib3h7IHdpZHRoOiAzMy4zMzMzJTsgZmxvYXQ6IGxlZnQ7fVxyXG4uY2FuY2VsX3BvcHVwIC5yYWRpb19ib3ggLmxpc3R7IG1hcmdpbi1yaWdodDogMjBycHg7IG1hcmdpbi1ib3R0b206IDIwcnB4O31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94IC5icXsgd2lkdGg6IDEwMCU7IGhlaWdodDogNjBycHg7IGxpbmUtaGVpZ2h0OiA2MHJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBib3JkZXI6IDJycHggc29saWQgI0U2RUFFRDsgYm9yZGVyLXJhZGl1czogMzBycHg7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGNvbG9yOiAjMzMzMzMzO31cclxuLmNhbmNlbF9wb3B1cCAucmFkaW9fYm94IC5icS5vbnsgYmFja2dyb3VuZDogIzIwQUQyMDsgY29sb3I6ICNmZmZmZmY7IGJvcmRlci1jb2xvcjogIzIwQUQyMDt9XHJcblxyXG4uY2FuY2VsX3BvcHVwIC5zZWN0aW9ueyBwYWRkaW5nOiAwIDQwcnB4IDMwcnB4O31cclxuLmNhbmNlbF9wb3B1cCAuc2VjdGlvbiB0ZXh0YXJlYXsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTYwcnB4OyBib3JkZXI6IDJycHggc29saWQgI0U2RUFFRDsgYm9yZGVyLXJhZGl1czogOHJweDsgYm94LXNpemluZzogYm9yZGVyLWJveDsgcGFkZGluZzogMjBycHg7fVxyXG5cclxuLmNhbmNlbF9wb3B1cCAuYnRuX2JveHsgYm9yZGVyLXRvcDogMnJweCBzb2xpZCAjRTZFQUVEO31cclxuLmNhbmNlbF9wb3B1cCAuYnRuX2JveCB3eC1idXR0b257IGRpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDUwJTsgaGVpZ2h0OiA4NnJweDsgbGluZS1oZWlnaHQ6IDg2cnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOyB2ZXJ0aWNhbC1hbGlnbjogdG9wO31cclxuLmNhbmNlbF9wb3B1cCAuYnRuX2JveCBidXR0b246YWZ0ZXJ7IGRpc3BsYXk6IG5vbmU7fVxyXG4uY2FuY2VsX3BvcHVwIC5idG5fYm94IC5idG57IGJvcmRlci1sZWZ0OiAycnB4IHNvbGlkICNFNkVBRUQ7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGNvbG9yOiAjRkYwMDAwO31cclxuXHJcblxyXG5cclxuLmJhaS1jb250e3dpZHRoOiAxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQ6ICNmZmY7cG9zaXRpb246IGZpeGVkO3RvcDogMDtib3R0b206IDA7bGVmdDogMDtyaWdodDogMDt6LWluZGV4OiA5OTk7fVxyXG4uYmFpLWNvbnQgLm1haW4taW1ne3Bvc2l0aW9uOiBhYnNvbHV0ZTt6LWluZGV4OiAxMDAwO3RvcDo0NSU7bGVmdDo1MCU7dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwtNTAlKTstd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7bGluZS1oZWlnaHQ6IDA7d2lkdGg6MTkwcnB4O1xyXG5oZWlnaHQ6MTkwcnB4O1xyXG50ZXh0LWFsaWduOmNlbnRlcjtcclxuYmFja2dyb3VuZDpyZ2JhKDAsMCwwLC44KTtcclxudmVydGljYWwtYWxpZ246bWlkZGxlO1xyXG5vcGFjaXR5Oi42O2JvcmRlci1yYWRpdXM6IDEwcnB4O31cclxuLmJhaS1jb250IC5tYWluLWltZyBpbWFnZXt3aWR0aDoxMDBycHg7aGVpZ2h0OiAxMDBycHg7bWFyZ2luLXRvcDogNDVycHg7fVxyXG5cclxuLnN0YXR1c19idG57bWFyZ2luLXRvcDogMzBycHg7fVxyXG5cclxuLyrorqLljZXoh6rmj5DnoIEqL1xyXG4uY29kZV9udW1iZXJ7Zm9udC1zaXplOiA0MHJweDttYXJnaW46IDMwcnB4IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgY29sb3I6ICNmNjA7fVxyXG4uY29kZV9jb2Rle3Bvc2l0aW9uOnJlbGF0aXZlOyB3aWR0aDoyODBweDtoZWlnaHQ6MjgwcHg7Ym9yZGVyOiAycnB4IHNvbGlkICMyMGFkMjA7Ym94LXNpemluZzogYm9yZGVyLWJveDsgdGV4dC1hbGlnbjogY2VudGVyOyBvdmVyZmxvdzogaGlkZGVuO31cclxuLyogLmNvZGVfY29kZSBjYW52YXN7cG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiA1MCU7IHRvcDogNTAlOyAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwtNTAlKTsgLXdlYmtpdC1yYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSk7fSAqL1xyXG5cclxuLyog57qi5YyF5by55Ye65qGGICovXHJcbi5maXhlZF9oYntwb3NpdGlvbjogZml4ZWQ7cmlnaHQ6IDIwcnB4O2JvdHRvbTogMTcwcnB4fVxyXG4uZml4ZWRfaGIgaW1hZ2V7d2lkdGg6IDEwMHJweDtoZWlnaHQ6IDEwMHJweDtwb3NpdGlvbjogcmVsYXRpdmU7ZGlzcGxheTogaW5saW5lLWJsb2NrfVxyXG4uaGJzaGFyZV9idG57d2lkdGg6IDEwMCU7aGVpZ2h0OiAxMDAlO3Bvc2l0aW9uOiBhYnNvbHV0ZTtsZWZ0OiAwO3RvcDogMDtvcGFjaXR5OiAwO1xyXG59XHJcbi5seGtmYnRuc3tcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG4ubHhrZmJ0bntcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDowO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgb3BhY2l0eTogMCA7XHJcbn0iLG51bGxdfQ== */
</style>