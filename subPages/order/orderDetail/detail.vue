<template>
	<view>
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
						<text
							v-else-if="orderdetail.order_status == 2">{{ orderdetail.pei_type == 3 ? '等待自提中' : '请耐心等待送达' }}</text>
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
	var common = require("../../../js/ecart.js");
	var ecart = null;
	var double = true;
	var reason;
	var QR = require("../../../utils/qrcode.js"); // 引入SDK核心类
	// 引入SDK核心类
	var QQMapWX = require("../../../js/qqmap-wx-jssdk.js");
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
				current: ""
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {
			orderid = e.orderid; // orderid = 11533;

			var that = this;
			that.orderid = orderid;
		},

		onShow(e) {
			this.bindonshow();
		},

		onPullDownRefresh() {
			this.bindonshow();
			uni.stopPullDownRefresh();
		},

		onShareAppMessage: function(res) {
			var that = this;
			if (res.from === 'button') {
				var hongbao = that.hongbao;
				return {
					title: hongbao.title,
					imageUrl: hongbao.imgUrl,
					path: "/subPages/other/webview/webview?url=" + encodeURIComponent(hongbao.link)
				};
			} else {
				return {
					title: '筷子',
					path: '/pages/index/index',
					success: function(res) { // 分享成功
					},
					fail: function(res) { // 分享失败
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
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
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
				}, function(res) {
					console.log(res);

					if (res.error == '0') {
						var data = res.data.detail;
						data.ordertime = that.getLocalTime(data.dateline);
						var mineyouhui = data.total_price - data.amount;
						data.order_youhui = mineyouhui.toFixed(2);
						var tmp_freight = data.freight;

						if (Number(res.data.detail.hongbao_num) > 0) {
							that.hongbao_num = false
							that.hongbao = res.data.detail.hongbao;
						} else {
							that.hongbao_num = true;
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
						that.orderdetail = data
						that.whitebg = true
						that.goods_lis = data.products
						that.createQrCode(data.spend_number, "mycanvas", 278, 278);
					} else {
						that.whitebg = true;
					}
				});
			},
			createQrCode: function(url, canvasId, cavW, cavH) {
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
					that.orderdetail = that.orderdetail;
				} else {
					setTimeout(function() {
						that.daojishi(pay_ltime, dateline);
					}, 500);
					that.mytime = timelabel;
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

			callRider: function() {
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
			},
			phoneTap: function(e) {
				this.phoneHidden = false;
			},
			maskHidden1: function(e) {
				this.phoneHidden = true;
			},
			phoneOne: function(e) {
				var that = this;
				var waimai_phone = that.waimai_phone;
				uni.makePhoneCall({
					phoneNumber: waimai_phone
				});
			},
			phoneTwo: function(e) {
				var that = this;
				var rider_mobile = that.rider_mobile;
				uni.makePhoneCall({
					phoneNumber: rider_mobile
				});
			},
			phoneThree: function(e) {
				var that = this;
				var kefu_phone = that.kefu_phone;
				uni.makePhoneCall({
					phoneNumber: kefu_phone
				});
			},
			cancelTap: function(e) {
				this.cancelHidden = false;
			},
			maskHidden2: function(e) {
				this.cancelHidden = true;
			},
			switchColor: function(e) {
				this.current = e.currentTarget.dataset.idx;
			},
			tuipop: function(e) {
				this.tuikuan = false
				this.tuikuan_reason = "请输入退款理由";
			},
			hide: function() {
				this.tuikuan = true
				this.modalHidden = true
				this.confirmorder = true
				this.codeOrder = true;
			},
			getReason: function(e) {
				reason = e.detail.value;
			},
			tuikuanFun: function(e) {
				var that = this;
				app.globalData.ordersTui({
					"order_id": orderid,
					"reason": reason
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: "申请退款成功"
						});
						app.globalData.ordersDetail({
							"order_id": orderid
						}, function(res) {
							if (res.error == '0') {
								that.orderdetail = res.data.detail
								that.goods_lis = res.data.detail.products
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
				this.tuikuan = true;
			},
			onemore: function(e) {
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

					setTimeout(function() {
						uni.navigateTo({
							url: '/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail
						});
					}, 1000);
					double = false;
					setTimeout(function() {
						double = true;
					}, 500);
				}
			},
			cancelpop: function() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要取消订单吗？',
					success: function(res) {
						if (res.confirm) {
							that.cancel()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			confirmpop: function() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确认收货吗？',
					success: function(res) {
						if (res.confirm) {


							that.confirm()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			cancel: function() {
				var that = this;
				app.globalData.ordersCancel({
					"order_id": orderid
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: '取消订单成功'
						});
						app.globalData.ordersDetail({
							"order_id": orderid
						}, function(res) {
							if (res.error == '0') {

								app.globalData.topage('/subPages/order/orderDetail/detail?orderid=' + orderid);
							}
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				this.modalHidden = true;
			},
			cui: function(e) {
				var that = this;
				app.globalData.ordersCui({
					"order_id": e.currentTarget.dataset.orderid,
					"reason": reason
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: '催单成功'
						});
						app.globalData.ordersDetail({
							"order_id": orderid
						}, function(res) {
							if (res.error == '0') {
								that.orderdetail = res.data.detail
								that.goods_lis = res.data.detail.products;
							}
						});
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
					"order_id": orderid
				}, function(res) {
					if (res.error == '0') {
						uni.showToast({
							title: '确认订单成功'
						});
						app.globalData.ordersDetail({
							"order_id": orderid
						}, function(res) {
							if (res.error == '0') {
								that.orderdetail = res.data.detail
								that.goods_lis = res.data.detail.products
							}
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				this.confirmorder = true;
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
						app.globalData.ordersDetail({
							"order_id": orderid
						}, function(res) {
							if (res.error == '0') {
								that.orderdetail = res.data.detail
								that.goods_lis = res.data.detail.products;
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
			status: function(e) {
				console.log(e);
				var that = this;
				app.globalData.ordersStatus({
					"order_id": e.currentTarget.dataset.orderid
				}, function(res) {
					if (res.error == '0') {
						uni.setStorage({
							key: 'order_logs',
							data: res.data.logs,
							success: function(res) {}
						});
						app.globalData.topage('/subPages/order/orderStatus/status');
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
			lookelv: function(e) {
				var id = e.currentTarget.dataset.shopid;
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('/subPages/shop/shoptail/shoptail?currentNavtab=1&id=' + app.globalData._CFG.shoptail);
			},

			//查看自提码
			seeCode() {
				this.codeOrder = false;
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
		border: 2rpx solid #ee8080;
		color: #ee8080;
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
</style>