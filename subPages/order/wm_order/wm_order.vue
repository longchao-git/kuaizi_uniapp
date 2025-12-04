<template>
	<view>
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
		<form @submit="formSubmit" @reset="formReset" report-submit="true">
			<view class="page_cont_pay"
				:style="'height:' + (!payHidden || !cardHidden || !hongHidden || !youhuiHidden ? '100%; ' : heview-60+'px')">
				<view class="page_cont"
					:style="'overflow:' + (!payHidden || !cardHidden || !hongHidden || !youhuiHidden ? 'hidden' : 'auto') + ';'">
					<!--是否自提-开始-->
					<!-- -->
					<!--  -->
					<view class="ordZiti" v-if="address.is_ziti == 1">
						<view class="ordZiti_tab">
							<view :class="!ordZiti ? 'on' : ''" @tap.stop="switchZiti" data-ziti="0"
								style="border-radius: 24rpx  0 0 24rpx;">外卖配送</view>
							<view :class="ordZiti ? 'on' : ''" @tap.stop="switchZiti" data-ziti="1"
								style="border-radius: 0 24rpx 24rpx 0 ;">到店自提</view>
						</view>
						<view class="ziti_addr mb10" :hidden="ordZiti ? false : true">
							<view class="bt fl">自提地址</view>
							<image src="/static/image/iconnewback2.png" class="linkico fr icon44"></image>
							<view class="addr font28">{{address.shop_addr}}</view>
						</view>
					</view>
					<view class="wm_order_addr" @tap="toaddr" :hidden="ordZiti">
						<view class="add_detail mr10" v-if="addrtop.mobile && addrtop.mobile.length > 0">
							<view class="shouphone">{{addrtop.mobile}}</view>
							<view class="shouhuo">{{addrtop.addr}}--{{addrtop.house}}</view>
							<view class="addr col26 font28">{{addrtop.contact}}</view>
						</view>
						<view class="add_detail mr10 font28" v-else>请选择地址</view>
						<image src="/static/image/iconnewback2.png" class="add_right fr icon44"></image>
					</view>
					<!--是否自提-结束-->
					<!--配送时间选择-->
					<view class="selectBox " @tap="setsonTimeShow">
						<view class="bt">送达时间</view>
						<view class="nr blue">
							<block v-if="!(sonTimeChange_idx == 0 &&  timeArray[1]&&timeArray[1].length > 0)">{{sonDay}}
							</block>{{sonTime}}
						</view>
						<image src="/static/image/iconnewback1.png" class="linkico icon30"></image>
					</view>
					<!--支付方式选择-->
					<view class="selectBox  mb10">
						<view class="bt">支付方式</view>
						<view class="nr blue" @tap="payTap">{{payway}}</view>
						<image src="/static/image/iconnewback1.png" class="linkico icon30"></image>
						<view :hidden="payHidden">
							<view class="topHideShow" @click="payChange"></view>
							<view class="setaction-sheet">
								<view class="title">选择支付方式</view>
								<radio-group class="group" @change="payradioChange" name="radio-group">
									<view v-for="(item, index) in payitem" :key="index" class="label ">
										<label class="label-2__text"><text>{{item.title}}</text></label>
										<radio :id="item.title" :value="item.title" :checked="item.checked" class="fr">
										</radio>
									</view>
								</radio-group>
							</view>
						</view>

					</view>
					<!--商品详情-->
					<view class="wm_order_cai">

						<view class="title ">
							<text class="fl">{{title}}</text>

						</view>
						<view class="cai ">
							<view v-for="(item, index) in address.product_lists" :key="index" class="list">
								<image :src="item.photo" class="pic" mode="aspectFill"></image>
								<view class="tit">{{item.title}}
									<block v-for="(itemss,index) in item.specification" v-key="itemss">
										+{{itemss.val}}/{{itemss.val!= '否'?itemss.price:0}}€</block>
									<!-- <block v-if="item.spec_name">（{{item.spec_name}}）</block> -->
								</view>
								<view class="num">x{{item.num}}</view>

								<view class="price"><text
										v-if="item.oldprices != item.prices">€{{item.oldprices}}</text>€{{item.prices}}
								</view>
							</view>
						</view>
						<view class="li_info flex-wrp" style="justify-content: space-between;">
							<text class="flex-wrp">
								<image src="../../static/image/order_icon1.png"
									style="width: 60rpx;height: 60rpx;margin-right: 30rpx;"></image>
								<text>配送费</text>
							</text>

							<text
								class="fr">€{{address.freight_stage-(address.is_bad_weather&&address.is_bad_weather!=0?address.weather_extra_fee:0)}}</text>
						</view>

						<view class="li_info " v-if="address.package_price>0" style="justify-content: space-between;">
							<text class="flex-wrp">
								<image src="../../static/image/order_icon2.png"
									style="width: 60rpx;height: 60rpx;margin-right: 30rpx;"></image>
								<text>包装费</text>
							</text>
							<text class="fr">€{{address.package_price}}</text>
						</view>
						<block v-for="(item, index) in address.youhui" :key="index">
							<!-- <text class="ico" :style="'background-color:#' + item.color">{{item.word}}</text> -->
							<view class="li_info flex-wrp" style="justify-content: space-between;">
								<text class="flex-wrp">
									<image src="../../static/image/order_icon3.png"
										style="width: 60rpx;height: 60rpx;margin-right: 30rpx;"></image>
									<text>{{item.title}}</text>
								</text>
								<text class="fr fontcl1">-€{{item.amount}}</text>
							</view>
						</block>

					</view>
					<!--是否选择首单优惠-开始-->
					<view class="wm_orderchoose">
						<view class="firstYouhui_box " v-if="support_first_share == 0 && first_order == 1">
							<view class="bt fl">首单优惠</view>
							<view class="fr">
								<switch :checked="is_first == '1' ? true : false" @change="switchFirstYouhui"></switch>
							</view>
						</view>
					</view>


					<!--优惠列表-->
					<view class="shopOffTips" v-if="tipsShow">
						<view class="shopOffTipsOut">
							<view class="shopOffTipsIn">
								<view class="shopOffyouhui">
									<image :src="newlogo" class="tipsyouhui"></image>
									<view class="youhuiname">{{topInfo.title}}</view>
									<view style="margin: 26rpx 0 31rpx;">
										<block v-for="(item, index) in newhuodong" :key="index">
											<view class="newhuodongname">菜品{{item}}</view>
										</block>
									</view>
									<view class="newhuodongbutton" @tap="tipsOff">知道了</view>
								</view>
							</view>
						</view>
					</view>

					<!--choose-->
					<view class="wm_orderchoose">

						<!--红包-->
						<view class="choose  hong" v-if="payway != '货到付款'">
							<text>红包 </text>
							<view class="flex-wrp">
								<block v-if="!address.hongbaos[0]"><text class="hong black9" @tap="hongTap">暂无可用</text>
								</block>
								<block v-else>
									<text class="hong right_txt" @tap="hongTap">{{hongway}}</text>
								</block>
								<image src="/static/image/iconnewback1.png"></image>
								<view :hidden="hongHidden">
									<view class="topHideShow" @click="hongChange"></view>
									<view class="hongBaoLists setaction-sheet">
										<view class="title ">选择红包</view>
										<radio-group class="group" @change="hongradioChange" name="radio-group2">
											<!--新-->
											<label class="list" v-if="address.hongbaos.length > 0">
												<view class="cont">
													<view class="tit">不使用红包</view>
													<radio id="0" :value="address.hongbaos.length + '个可用'" class="check"
														@tap="getredamount"></radio>
												</view>
											</label>
											<view class="list over" v-if="address.hongbaos.length == 0">
												<view class="cont">
													<view class="tit">暂无可用</view>
												</view>
											</view>
											<label v-for="(item, index) in hongitem" :key="index"
												:class="'list ' + (item.is_canuse == '1' ? '' : 'over')">
												<view class="cont">
													<view class="price">
														<view class="num">€<text class="big">{{item.amount}}</text>
														</view>
														<view class="txt">满{{item.min_amount}}可用</view>
													</view>
													<view class="txt_box">
														<view class="tit overflow_clear">{{item.title}}</view>
														<p>有效期至{{item.ltime}}</p>
														<p>{{item.limit_time_label}}</p>
													</view>
													<radio v-if="item.is_canuse == '1'" :id="item.hongbao_id"
														:value="'-€' + item.amount" class="check" @tap="getredamount"
														:checked="item.checked"></radio>
												</view>
												<view class="instr" v-if="item.is_canuse != '1'">
													<p class="fontcl1">
														<image src="/static/image/icon_notice3x.png"></image>不可用原因
													</p>
													<p class="black9">{{item.reason}}</p>
												</view>
											</label>
										</radio-group>
									</view>
								</view>

							</view>
						</view>
						<!--优惠-->
						<view class="choose  youhui" v-if="payway != '货到付款'">
							<text>优惠券</text>
							<view class="flex-wrp">
								<block v-if="!address.coupons[0]"><text class="youhui black9"
										@tap="youhuiTap">暂无可用</text></block>
								<block v-else><text class="youhui right_txt" @tap="youhuiTap">{{youhuiway}}</text>
								</block>
								<image src="/static/image/iconnewback1.png"></image>
								<view :hidden="youhuiHidden">
									<view class="topHideShow" @click="youhuiChange"></view>
									<view class="couponLists setaction-sheet">
										<view class="title ">选择优惠券</view>
										<radio-group class="group" @change="youhuiradioChange" name="radio-group3">
											<!--新-->
											<label class="list" v-if="address.coupons.length > 0">
												<view class="cont">
													<view class="tit">不使用优惠券</view>
													<radio id="0" :value="address.coupons.length + '个可用'" class="check"
														@tap="getcouponid"></radio>
												</view>
											</label>
											<view class="list over" v-if="address.coupons.length == 0">
												<view class="cont">
													<view class="tit">暂无可用</view>
												</view>
											</view>
											<label v-for="(item, index) in youhuiitem" :key="index"
												:class="'list ' + (item.is_canuse == '1' ? '' : 'over')">
												<view class="cont">
													<view class="price">
														<view class="num">€<text
																class="big">{{item.coupon_amount}}</text></view>
														<view class="txt">满{{item.order_amount}}可用</view>
													</view>
													<view class="txt_box">
														<view class="tit overflow_clear">{{item.title}}</view>
														<p>有效期至{{item.ltime}}</p>
													</view>
													<radio v-if="item.is_canuse == '1'" :id="item.coupon_id"
														:value="'-€' + item.coupon_amount" class="check"
														@tap="getcouponid" :checked="item.checked"></radio>
												</view>
												<view class="instr" v-if="item.is_canuse != '1'">
													<p class="fontcl1">
														<image src="/static/image/icon_notice3x.png"></image>不可用原因
													</p>
													<p class="black9">{{item.reason}}</p>
												</view>
											</label>
										</radio-group>
									</view>
								</view>

							</view>
						</view>

						<!--配送会员卡-开始-->
						<view class="choose  card" v-if="peicards && peicards.length > 0 && !ordZiti">
							<text>会员卡</text>
							<view>
								<block v-if="address.have_peicard == '1'">
									<text class="youhui right_txt" @tap="cardTap">{{cardtxt}}</text>
									<image src="/static/image/iconnewback1.png"></image>
								</block>
								<block v-else>
									<text class="youhui right_txt">{{cardtxt}}</text>
								</block>
								<view :hidden="cardHidden">
									<view class="topHideShow" @click="cardChange"></view>
									<view class="setaction-sheet">
										<view class="title ">选择配送会员卡</view>
										<radio-group class="group" name="radio-group3" @change="getcardid">
											<view class="label " v-if="address.have_peicard == '1'">
												<label class="label-2__text">
													<text>不使用</text>
													<radio id :value="''" class="fr"
														:checked="peicard_id != '' ? false : true"></radio>
												</label>
											</view>
											<view v-for="(item, index) in peicards" :key="index" class="label ">
												<label class="label-2__text">
													<view class="tit">{{item.title}}<text class="fontcl1 ml10"
															v-if="address.have_peicard != '1'">€{{item.amount}}</text>
													</view>
													<view class="txt">今日可减免配送单数：<text>{{item.limits}}单</text></view>
													<view class="txt">本单最多减免配送费：<text>€{{item.reduce}}</text></view>
												</label>
												<radio :data-id="item"
													:id="(address.have_peicard == '1') ? item.cid : item.card_id"
													:value="(address.have_peicard == '1') ? item.cid : item.card_id"
													class="fr" :checked="item.checked"></radio>
											</view>
										</radio-group>
									</view>
								</view>

							</view>
						</view>
						<!--配送会员卡-结束-->
						<view style="padding-bottom:2rpx;"
							v-if="address.cards.length > 0 || address.hongbaoPackage.package_id">
							<!--购买配送会员卡-->
							<view class="card_demo pub_list" @tap.stop="buyPcard" v-if="address.cards.length > 0">
								<view class="pub_list_bd" @tap.stop="cardTap">
									<view class="tit">AIO配送会员卡-月卡</view>
									<view class="txt">每单立减{{pcard_demo.reduce}}€配送费</view>
								</view>
								<view class="text">{{pcard_demo.days}}days</view>
								<view class="price">€{{pcard_demo.amount}}</view>
								<image class="ico"
									:src="'/static/image/' + (pcard_id.length > 0 ? 'icon_radio_selected3x' : 'pj_selecter3x') + '.png'">
								</image>
							</view>
							<!--购买红包套餐-->
							<view class="card_demo pub_list" @tap.stop="hongbaoPackage"
								:data-id="address.hongbaoPackage.package_id" v-if="address.hongbaoPackage.package_id">
								<view class="pub_list_bd">
									<view class="tit">购红包套餐,每单立减{{address.hongbaoPackage.hongbao.amount}}€</view>
									<view class="txt">
										立得{{address.hongbaoPackage.limit}}张{{address.hongbaoPackage.hongbao.amount}}€大红包
									</view>
								</view>
								<view class="price">€{{address.hongbaoPackage.amount}}</view>
								<image class="ico"
									:src="'/static/image/' + (hongbao_package_id.length > 0 ? 'icon_radio_selected3x' : 'pj_selecter3x') + '.png'">
								</image>
							</view>
						</view>
					</view>


					<!-- 恶劣天气 -->
					<view class="wm_order_cai" v-if="address.is_bad_weather&&address.is_bad_weather!=0">
						<view class='li_info '>
							恶劣天气附加配送费
							<text class='fr'>€{{address.weather_extra_fee}}</text>
						</view>
					</view>

					<view class="wm_order_cai">
						<view class="li_info ">
							实付配送费
							<view class='fr'>
								<text v-if="address.youhui.length>0" class="fr"
									style="color: #999999; margin-left: 10rpx; text-decoration: line-through">
									€{{address.freight_stage}}</text>
								<text class="fr fontcl1">€{{address.actual_freight}}</text>
							</view>
						</view>
					</view>

					<!--合计-->
					<view class="wm_order_cai mb10">
						<view class="li_info">
							<view class="fr"><text
									class="small black9 mr10">共{{address.product_number}}件商品</text>合计：<text
									class="fontcl1 big">€{{address.amount}}</text></view>
						</view>
					</view>
					<!--换购商品-开始-->
					<view class="huangous mb10" v-if="huangous.length > 0">
						<view class="title">超值换购</view>
						<view v-for="(item, index) in huangous" :key="index" class="lists">
							<image class="pic" :src="item.photo"></image>
							<view class="txt_box">
								<view class="tit">{{item.title}}</view>
								<view class="price"><text class="small">€</text>{{item.price}}<text
										class="del">€{{item.oldprice}}</text></view>
							</view>
							<view class="right_box">
								<view class="btn" @tap="addPro" :data-product_id="item.product_id" :data-sku_obj="item"
									v-if="item.num == 0">换购</view>
								<!--加减框开始-->
								<view class="goods_int_box" v-else>
									<image src="/static/image/icon_remove_new.png" class="jian" @tap="reducePro"
										:data-product_id="item.product_id" :data-sku_obj="item"></image>
									<view class="num">{{item.num}}</view>
									<image src="/static/image/icon_add_new.png" class="jia" @tap="addPro"
										:data-product_id="item.product_id" :data-sku_obj="item"></image>
									<view class="clear"></view>
								</view>
								<!--加减框结束-->
							</view>
						</view>
						<view class="pub_list nr_li  ">
							<view class="bt">餐盒费</view>
							<view class="pub_list_bd text_r fontcl2 total_package">€{{huangou_package_price1}}</view>
						</view>
						<view class="total">
							<text>共{{huangou_product_number}}件商品</text>
							<text class="big">合计：<text
									class="fontcl2 total_price">€{{huangou_product_price1}}</text></text>
						</view>
					</view>
					<!--换购商品-结束-->
					<!--留言-->
					<view class="wm_order_liuyan mb30">
						<view>买家留言</view>
						<textarea type="text" placeholder="点击输入（选填）" @input="info" name="input"></textarea>
					</view>

				</view>
			</view>

			<!--底部-->
			<view class="footer_pay" v-if="payHidden && cardHidden && hongHidden &&youhuiHidden">
				<view class="footer_view">
					<text class="price">€{{payamount}}</text>
					<view class="txt">待支付</view>
				</view>
				<button class="order_pay_btn " form-type="submit">
					立即下单
				</button>

			</view>
			<!--收货地址弹层-->
			<view :class="'addr_list_mask ' + (addrpop==1 ? 'active' : '')">
				<view class="title">我的收货地址</view>
				<block v-if="addr_lis.length == 0">
					<image src="/static/image/mine/mall_my_icon_location_no.png" class="noaddress"></image>
					<view class="noaddress">暂无地址</view>
				</block>
				<block v-else>
					<scroll-view class="list" scroll-y>
						<view v-for="(item, idx) in addr_lis" :key="idx"
							:class="'addr_list ' + (idx == chooseidx ? 'choosed' : '')">
							<view @tap="direct" :data-contact="item.contact" :data-mobile="item.mobile"
								:data-addr="item.addr" :data-house="item.house" :data-addrid="item.addr_id"
								:data-idx="idx" :data-is_in="item.is_in" :data-lng="item.lng" :data-lat="item.lat">
								<view class="bt">{{item.contact}}-{{item.mobile}}</view>
								<view class="addr">收货地址：{{item.addr}}-{{item.house}}</view>
							</view>
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
								<view class="fr btn_box">
									<button type="default" size="mini" class="btn edit" @tap="editTap"
										:data-contact="item.contact" :data-mobile="item.mobile" :data-addr="item.addr"
										:data-house="item.house" :data-type="item.type" :data-lat="item.lat"
										:data-lng="item.lng" :id="item.addr_id">
										<image src="/static/image/mine/mall_my_btn_edit.png"
											style="width: 30rpx; height: 30rpx;"></image>
									</button>
									<button type="default" size="mini" class="btn del" @tap="modalTap"
										:id="item.addr_id" :data-idx="idx">
										<image src="/static/image/mine/mall_my_btn_delete.png"
											style="width: 30rpx; height: 30rpx;"></image>
									</button>
								</view>
								<view class="clear"></view>
							</view>
							<block v-if="item.is_in==0">
								<image src="/static/image/no_in.png" class="noin"></image>
							</block>
						</view>
					</scroll-view>
				</block>
				<view class="footer_btn_long">
					<navigator url="../addaddr/addaddr">
						<button type="primary" size="default" style="background: #FF797C;border:none;">添加收货地址+</button>
					</navigator>
				</view>
			</view>
			<!--删除地址弹层-开始-->
			<view confirm-text="是" cancel-text="否" :hidden="modalHidden" mask @confirm="modalChange"
				@cancel="modalcancel">
				<text class="black3">确定要删除该地址吗？</text>
			</view>
			<!--删除地址弹层-结束-->
			<!--时间弹层-开始-->
			<view :class="'sonTime_mask ' + (sonTimeShow ? 'show' : '')">
				<view class="title">选择送达时间
					<view class="close" @tap="setsonTimeShow">
						<image src="/static/image/index_btn_close2x.png"></image>
					</view>
				</view>
				<view class="left fl">
					<view v-for="(item, index) in timeArray[0]" :key="index"
						:class="'list ' + (index == sonTimeChange_idx ? 'on' : '')" @tap="sonTimeChange"
						:data-idx="index" :data-value="item">{{item.day}}</view>
				</view>
				<view class="right fr">
					<view class="list_box" v-if="sonTimeChange_idx == 0 && timeArray[1]&&timeArray[1].length > 0">
						<view v-for="(item, index) in timeArray[1]" :key="index"
							:class="'list ' + (index == sonTimeSelct_idx1 ? 'on' : '')" @tap="sonTimeSelct"
							:data-idx="index" data-id="0" :data-value="item">{{item}}
							<image src="/static/image/icon_selected3x.png"></image>
						</view>
					</view>
					<view class="list_box" v-else>
						<view v-for="(item, index) in timeArray[2]" :key="index"
							:class="'list ' + (index == sonTimeSelct_idx2 ? 'on' : '')" @tap="sonTimeSelct"
							:data-idx="index" data-id="1" :data-value="item">{{item}}
							<image src="/static/image/icon_selected3x.png"></image>
						</view>
					</view>
				</view>
				<view class="clear"></view>
			</view>
			<!--时间弹层-结束-->

			<view class="addmask_bg" :hidden="addrpop == 1 ? false : true" @tap="hideaddr"></view>
			<view class="addmask_bg" :hidden="sonTimeShow ? false : true" @tap="setsonTimeShow"></view>
		</form>



	</view>
</template>

<script>
	var common = require("../../../js/ecart.js");
	var app = getApp();
	var ecart = null;
	var addrtop = '';
	var intro;
	var double = true;
	var delidx,
		product_info = '',
		is_ziti;

	export default {
		data() {
			return {
				address: {
					shop_addr: "",
					is_ziti: 0,
					product_lists: [],
					package_price: "",
					freight_stage: 0,
					youhui: [],
					have_peicard: "",
					hongbaos: false,
					coupons: false,
					cards: [],
					hongbaoPackage: "",
					product_number: "",
					amount: ""
				},
				addrtop: '',
				//默认地址信息；
				currentlng: app.globalData._CFG.lng,
				//经度；
				currentlat: app.globalData._CFG.lat,
				//纬度；
				sonTimeChange_idx: 0,
				//时间天选择；
				sonTimeSelct_idx1: 0,
				//时间段选择；
				sonTimeSelct_idx2: 0,
				//时间段选择；
				sonDay: '',
				sonTime: '尽快送达',
				sonDate: '',
				timeArray: [],
				//送达时间；
				day_dates: [],
				topmask: true,
				pay: ['请选择', '在线支付', '货到付款'],
				hongbao: [],
				payHidden: "true",
				hongHidden: "true",
				youhuiHidden: "true",
				zxPayHidden: "true",
				payorderid: '',
				payitem: [],
				hongitem: [],
				hongway: "请选择红包",
				youhuiitem: [],
				payway: "请选择",
				youhuiway: "请选择优惠券",
				caiOrder: [],
				manjian: "-€5",
				addr_lis: [],
				pageimg: app.globalData._CFG.IMG_URL || '',
				modalHidden: true,
				idx: 0,
				addrpop: 0,
				chooseidx: 'q',
				product_list: [],
				hongbao_id: -1,
				coupon_id: -1,
				youhui: [],
				//是否自提
				pei_type: 0,
				ordZiti: false,
				//是否自提false为否，true为是；
				//配送会员卡
				cardHidden: true,
				peicards: [],
				cardtxt: '',
				peicard_id: '',
				pcard_id: '',
				//超值换购
				huangous: [],
				huangou_package_price: 0,
				huangou_product_number: 0,
				huangou_product_price: 0,
				huangou_package_price1: 0.00,
				huangou_product_price1: 0.00,
				//首页优惠
				first_order: '',
				support_first_share: '',
				is_first: '',
				//默认传值下单接口，1开启首单，0不开启
				// first_youhui:'', //首单优惠金额，大于0显示默认开启首单优惠
				hongbao_package_id: '',
				//红包套餐id
				tipsShow: false,
				has_youhui: true,
				title: "",
				newlogo: "",
				topInfo: {
					title: ""
				},
				newhuodong: [],
				pcard_demo: {
					reduce: "",
					days: "",
					amount: ""
				},
				payamount: "",
				sonTimeShow: false,
				showToast: {
					isShow: false
				},
				heview: 0
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {
			is_ziti = e.is_ziti;
			console.log(uni.getSystemInfoSync())
			this.heview = uni.getSystemInfoSync().windowHeight

			if (is_ziti == 'ziti') {
				this.ordZiti = true
				this.pei_type = 3;
			}
		},
		onShow: function() {
			intro = '';
			ecart = new common.ECart(app.globalData._CFG.shoptail);
			var product_info2 = '';
			var that = this;
			var addrS;
			var cart = ecart.shop_cart;
			var title = '';

			for (var i in cart) {
				title = cart[i].shoptitle;
				if (cart[i].spec_id) product_info2 += cart[i].product_id + ':' + cart[i].spec_id + ':' + cart[i].num;
				else product_info2 += cart[i].product_id + ':' + 0 + ':' + cart[i].num;
				var str_obj = cart[i].str_obj;

				if (str_obj[0]) {
					product_info2 += ':&';

					for (let k in str_obj) {
						if (str_obj[k].val != '否') {
							product_info2 += str_obj[k].key + '_' + str_obj[k].val + '-';
						}
					}

					product_info2 = product_info2.substring(0, product_info2.length - 1, 1);
				}

				product_info2 += ',';
			}

			that.product_list = cart;
			product_info = product_info2.substring(0, product_info2.length - 1, 1); //测试数据
			// app._CFG.shoptail = "473";

			app.globalData.orderFormAddr({
				"page": 1,
				"shop_id": app.globalData._CFG.shoptail
			}, function(res) {
				if (res.error == '0') {
					// console.log("地址",res);
					var addr_list = res.data.items;
					that.addr_lis = addr_list;
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
			var currentlng = that.currentlng;
			var currentlat = that.currentlat,
				ziti;

			if (is_ziti == 'ziti') {
				ziti = 1;
			} else {
				ziti = 0;
			}

			; //测试数据
			// app._CFG.shoptail="473";
			// product_info = "11329:0:2";
			// ziti = 0;

			app.globalData.orderForm({
				"shop_id": app.globalData._CFG.shoptail,
				"lng": currentlng,
				"lat": currentlat,
				"products": product_info,
				'is_ziti': ziti,
				'pei_type': that.pei_type
			}, function(res) {
				//   console.log(res)
				if (res.error == '0') {
					if (res.data.m_addr) {
						addrS = res.data.m_addr;
					};
					uni.getStorage({
						key: 'address',
						success: function(res) {
							var addrchange = '';
							addrchange.contact = res.data.contact ? res.data.contact : "";
							addrchange.mobile = res.data.mobile;
							addrchange.addr = res.data.addr;
							addrchange.house = res.data.house;
							addrchange.addr_id = res.data.addr_id;
							that.addrtop = addrchange;
						},
						fail: function() {
							that.addrtop = addrS;
						},
						complete: function() {
							uni.removeStorage({
								key: 'address'
							});
						}
					}); // console.log("默认选择地址", that.data.addrtop);
					//支付方式

					var payitem = [];

					if (res.data.online_pay == 1) {
						var arr = {
							'title': '在线支付',
							'code': 1
						};
						payitem.push(arr);
					}

					if (res.data.is_daofu == 1) {
						var arr = {
							'title': '餐到付款现金',
							'code': 0
						};
						payitem.push(arr);

						if (res.data.is_pos == 1) {
							var arr1 = {
								'title': '餐到付款刷卡',
								'code': 0
							};
							payitem.push(arr1);
						}
					}

					for (var i = 0; i < payitem.length; i++) {
						payitem[i].checked = false;

						if (i == 0) {
							payitem[i].checked = true;
						}

						;
					}

					; //配送时间

					var timeArray = []; //定义一个送达时间空数组；

					var arr = [];

					for (var i = 0; i < res.data.day_dates.length; i++) {
						arr.push(res.data.day_dates[i]);
					}

					;
					timeArray.push(arr); //将week放入数组；

					if (res.data.set_time_date.set_time.length > 0) {
						if (res.data.set_time_date.set_time[0] == "0") {
							//是否显示立即送达
							res.data.set_time_date.set_time[0] = '尽快送达';
						}

						;
					}

					;
					timeArray.push(res.data.set_time_date.set_time); //将时间time放入数组

					timeArray.push(res.data.set_time_date.nomal_time); //将时间week的time放入数组
					//优惠数组

					var youhuiitem = res.data.coupon_list;

					if (res.data.coupon_id > 0 && res.data.coupon_amount) {
						that.coupon_id = res.data.coupon_id
						that.youhuiway = '-€' + res.data.coupon_amount
					}

					;

					for (var i = 0; i < youhuiitem.length; i++) {
						//默认选择优惠券
						// youhuiitem[i].ltime = that.toDate(youhuiitem[i].ltime);
						if (youhuiitem[i].coupon_id == res.data.coupon_id) {
							youhuiitem[i].checked = true;
						} else {
							youhuiitem[i].checked = false;
						}
					}

					; //红包数组

					var hongitem = res.data.hongbao_list;

					if (res.data.hongbao_id > 0 && res.data.hongbao_amount) {
						that.hongbao_id = res.data.hongbao_id
						that.hongway = '-€' + res.data.hongbao_amount
					}

					for (var i = 0; i < hongitem.length; i++) {
						//默认选择红包
						if (hongitem[i].hongbao_id == res.data.hongbao_id) {
							hongitem[i].checked = true;
						} else {
							hongitem[i].checked = false;
						}
					}

					; //配送会员卡
					if (res.data.have_peicard == "1") {
						var peicards = res.data.peicards;
						for (var i = 0; i < peicards.length; i++) {
							//默认选择配送卡
							if (peicards[i].cid == res.data.peicard_id) {
								peicards[i].checked = true;
								that.cardtxt = "-€" + Number(res.data.peicard_amount)
								that.peicard_id = res.data.peicard_id;
							} else {
								peicards[i].checked = false;
							}
						};

					} else {
						var peicards = res.data.cards;
						that.cardtxt = "未购买"
						that.pcard_demo = peicards[0] || [];

						for (var i = 0; i < peicards.length; i++) {
							//默认购买配送卡
							// peicards[i].checked = false;
							if (peicards[i].card_id == that.pcard_demo.card_id) {
								peicards[i].checked = true;
							} else {
								peicards[i].checked = false;
							};
						};


					}

					; //换购商品数据添加数量字段

					var huangous = res.data.huangous;

					for (var i = 0; i < huangous.length; i++) {
						huangous[i].num = 0;
					}

					;
					res.data.reduce_freight = Number(res.data.reduce_freight);

					if (that.ordZiti) {
						res.data.freight_stage = 0;
					}

					console.log(res.data.youhui);

					if (res.data.youhui.length > 0) {
						for (let i in res.data.youhui) {
							console.log(res.data.youhui[i].type);

							if (res.data.youhui[i].type == 'reduceFreight') {
								console.log(111);
								that.has_youhui = false;
							}
						}
					}

					console.log(res.data);
					that.sonDate = timeArray[0][0].date;
					that.caiOrder = ecart.shop_cart;
					for (let i in res.data.product_lists) {
						for (let h in res.data.product_lists[i].specification) {
							if (res.data.product_lists[i].specification[h].price > 0 && res.data.product_lists[
									i].specification[h].val != '否') {
								res.data.product_lists[i].prices = parseFloat(res.data.product_lists[i]
									.prices) + (parseFloat(res.data.product_lists[i].specification[h]
										.price) *
									res.data.product_lists[i].num)
							}
						}
					}
					that.address = res.data
					that.payamount = res.data.amount
					that.timeArray = timeArray
					//送达时间数组；
					that.sonDay = timeArray[0][0].day
					that.sonTime = timeArray[1][0] ? timeArray[1][0] : timeArray[2][0]
					that.title = res.data.shop_title
					that.hongitem = hongitem
					that.payitem = payitem
					that.payway = payitem[0].title || that.payway
					that.chooseidx = 'q'
					that.youhuiitem = youhuiitem
					that.huangous = huangous
					that.peicards = peicards
					that.peicard_id = res.data.peicard_id
					that.pcard_id = ''
					that.first_order = parseFloat(res.data.first_order)
					that.support_first_share = parseFloat(res.data.support_first_share)
					that.is_first = res.data.is_first
					that.hongbao_package_id = '';
					if (res.data.have_peicard == "1") {
						that.preinfo();
					} else {
						that.buyPcard()
					}

				} else {
					uni.showToast({
						title: res.message
					});
				}

				;
			});
		},
		methods: {
			settipsShow(e) {
				let amount = e.currentTarget.dataset.amout
				let that = this;
				uni.getStorage({
					key: 'newhuodong',

					success(res) {
						let list = JSON.parse(JSON.stringify(res.data))
						let AerrY = []
						for (let i in list) {
							list[i] = list[i].split('配送费')
							console.log(amount)
							if (amount >= parseInt(list[i][list[i].length - 1])) {
								AerrY.push(res.data[i])
							}
						}
						that.newhuodong = AerrY
						that.tipsShow = true;
					}

				});
				uni.getStorage({
					key: 'newlogo',

					success(res) {
						that.newlogo = res.data;
					}

				});
			},

			tipsOff() {
				this.tipsShow = false;
			},

			toaddr: function() {
				var that = this;
				that.addrpop = 1;
			},
			hideaddr: function() {
				this.addrpop = 0;
			},
			todetail: function(e) {
				app.globalData.topage('/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
			},
			payTap: function(e) {
				this.payHidden = !this.payHidden;
			},
			payChange: function(e) {
				this.payHidden = !this.payHidden;
			},
			payradioChange: function(e) {
				var checked = e.detail.value;
				var payitem = this.payitem;

				for (var i = 0; i < payitem.length; i++) {
					if (checked.indexOf(payitem[i].title) !== -1) {
						payitem[i].checked = true;
					} else {
						payitem[i].checked = false;
					}
				}

				this.payitem = payitem;
				this.payway = e.detail.value;
				this.payHidden = !this.payHidden;
				this.preinfo();
			},
			//选择红包；
			hongTap: function(e) {
				this.hongHidden = !this.hongHidden;
			},
			hongChange: function(e) {
				this.hongHidden = !this.hongHidden;
			},
			hongradioChange: function(e) {
				var checked = e.detail.value;
				var hongitem = this.hongitem;

				for (var i = 0; i < hongitem.length; i++) {
					if (checked.indexOf(hongitem[i].list) !== -1) {
						hongitem[i].checked = true;
					} else {
						hongitem[i].checked = false;
					}
				}

				this.hongitem = hongitem;
				this.hongway = e.detail.value;
			},
			getredamount: function(e) {
				this.hongbao_id = e.currentTarget.id
				//获取红包id
				this.hongHidden = !this.hongHidden
				this.preinfo();
			},

			//是否购买红包套餐
			hongbaoPackage(e) {
				if (this.hongbao_package_id.length > 0) {
					this.hongbao_package_id = '';
				} else {
					this.hongbao_package_id = e.currentTarget.dataset.id;
				}

				;
				this.preinfo();
			},

			//选择优惠券；
			youhuiTap: function(e) {
				this.youhuiHidden = !this.youhuiHidden;
			},
			youhuiChange: function(e) {
				this.youhuiHidden = !this.youhuiHidden;
			},
			youhuiradioChange: function(e) {
				var checked = e.detail.value;
				var youhuiitem = this.youhuiitem;

				for (var i = 0; i < youhuiitem.length; i++) {
					if (checked.indexOf(youhuiitem[i].list) !== -1) {
						youhuiitem[i].checked = true;
					} else {
						youhuiitem[i].checked = false;
					}
				}

				this.youhuiitem = youhuiitem;
				this.youhuiway = e.detail.value;
			},
			getcouponid: function(e) {
				this.coupon_id = e.currentTarget.id
				//获取优惠券id
				this.youhuiHidden = !this.youhuiHidden
				this.preinfo();
			},

			//选择送达时间；
			setsonTimeShow() {
				this.sonTimeShow = !this.sonTimeShow;
			},

			sonTimeChange(e) {
				// console.log(e);
				if (e.currentTarget.dataset.idx != 0) {
					this.sonDate = e.currentTarget.dataset.value.date;
					this.sonTime = this.timeArray[2][0]
					this.sonTimeSelct_idx2 = 0
					this.sonDay = e.currentTarget.dataset.value.day
					this.sonTimeChange_idx = e.currentTarget.dataset.idx
				} else {
					this.sonDate = e.currentTarget.dataset.value.date;
					this.sonTime = this.timeArray[1][0]
					this.sonTimeSelct_idx1 = 0
					this.sonDay = e.currentTarget.dataset.value.day
					this.sonTimeChange_idx = e.currentTarget.dataset.idx
				}

				;
			},

			sonTimeSelct(e) {
				var idx = e.currentTarget.dataset.idx,
					id = e.currentTarget.dataset.id,
					value = e.currentTarget.dataset.value;

				if (id == '0') {
					this.sonTimeSelct_idx1 = idx,
						this.sonTimeSelct_idx2 = null,
						this.sonTime = value
				} else {
					this.sonTimeSelct_idx2 = idx
					this.sonTimeSelct_idx1 = null
					this.sonTime = value
				}

				;
			},

			info: function(e) {
				intro = e.detail.value;
			},
			//选择配送地址；
			direct: function(e) {
				// console.log( app._CFG.lng, app._CFG.lat);
				var idx = e.currentTarget.dataset.idx;
				var is_in = e.currentTarget.dataset.is_in;
				ecart = new common.ECart(app.globalData._CFG.shoptail);
				var product_info2 = '';
				var cart = ecart.shop_cart;

				for (var i in cart) {
					var title = cart[i].shoptitle;
					if (cart[i].spec_id) product_info2 += cart[i].product_id + ':' + cart[i].spec_id + ':' + cart[i]
						.num;
					else product_info2 += cart[i].product_id + ':' + 0 + ':' + cart[i].num;
					var str_obj = cart[i].str_obj;

					if (str_obj[0]) {
						product_info2 += ':&';

						for (let k in str_obj) {
							if (str_obj[k].val != '否') {
								product_info2 += str_obj[k].key + '_' + str_obj[k].val + '-';
							}
						}

						product_info2 = product_info2.substring(0, product_info2.length - 1, 1);
					}

					product_info2 += ',';
				}

				;
				product_info = product_info2.substring(0, product_info2.length - 1, 1);
				var that = this;

				if (is_in == '1') {
					//如果在配送范围内则执行；
					this.addrtop = this.addr_lis[idx]
					this.addrpop = 0
					this.chooseidx = idx
					this.currentlat = e.currentTarget.dataset.lat
					this.currentlng = e.currentTarget.dataset.lng
					var currentlng = this.currentlng;
					var currentlat = this.currentlat;
					this.preinfo();
				}

				;
			},

			//选择会员卡事件
			cardTap() {
				this.cardHidden = !this.cardHidden;
			},

			cardChange() {
				this.cardHidden = !this.cardHidden;
			},


			getcardid: function(e) {
				if (this.address.have_peicard == "1") {
					this.peicard_id = e.detail.value
					//获取会员卡id
					this.pcard_id = '' //获取购买会员卡id

				} else {
					this.peicard_id = ''
					//获取会员卡id
					this.pcard_id = ''
					//获取购买会员卡id
					// pcard_id: e.currentTarget.id, //获取购买会员卡id
					this.pcard_demo = e.detail.value ? e.detail.value : {}
				};

				this.cardHidden = !this.cardHidden;
				this.preinfo();
			},

			//是否选择购买配送会员卡
			buyPcard() {
				var pcard_demo = this.pcard_demo;
				if (this.pcard_id.length > 0) {
					this.peicard_id = ''
					//获取会员卡id
					this.pcard_id = '' //获取购买会员卡id
				} else {
					this.peicard_id = ''
					//获取会员卡id
					this.pcard_id = pcard_demo.card_id //获取购买会员卡id
				};
				this.preinfo();
			},

			//添加换购商品事件
			addPro(e) {
				var huangous = this.huangous,
					huangou_package_price = this.huangou_package_price,
					huangou_product_number = this.huangou_product_number,
					huangou_product_price = this.huangou_product_price;

				for (var i = 0; i < huangous.length; i++) {
					if (huangous[i].product_id == e.currentTarget.dataset.product_id) {
						if (parseInt(huangous[i].sale_sku) > parseInt(huangous[i].num)) {
							huangous[i].num = parseInt(huangous[i].num) + 1;
							huangou_package_price = huangou_package_price + parseFloat(huangous[i].package_price);
							huangou_product_number = huangou_product_number + 1;
							huangou_product_price = huangou_product_price + parseFloat(huangous[i].price) + parseFloat(
								huangous[i].package_price);
						} else {
							uni.showToast({
								title: '商品库存不足',
								icon: 'none'
							});
							return
						};
					};
				}

				;
				var aaa = parseFloat(this.address.amount) + huangou_product_price;
				this.huangous = huangous
				this.huangou_package_price = huangou_package_price
				this.huangou_product_number = huangou_product_number
				this.huangou_product_price = huangou_product_price
				this.huangou_package_price1 = huangou_package_price.toFixed(2)
				this.huangou_product_price1 = huangou_product_price.toFixed(2)
				this.payamount = aaa.toFixed(2)
			},

			reducePro(e) {
				var huangous = this.huangous,
					huangou_package_price = this.huangou_package_price,
					huangou_product_number = this.huangou_product_number,
					huangou_product_price = this.huangou_product_price;

				for (var i = 0; i < huangous.length; i++) {
					if (huangous[i].product_id == e.currentTarget.dataset.product_id) {
						if (parseInt(huangous[i].num) > 0) {
							huangous[i].num = parseInt(huangous[i].num) - 1;
							huangou_package_price = huangou_package_price - parseFloat(huangous[i].package_price);
							huangou_product_number = huangou_product_number - 1;
							huangou_product_price = huangou_product_price - parseFloat(huangous[i].price) - parseFloat(
								huangous[i].package_price);
						}

						;
					}

					;
				}

				;
				var aaa = parseFloat(this.address.amount) + huangou_product_price;
				this.huangous = huangous
				this.huangou_package_price = huangou_package_price
				this.huangou_product_number = huangou_product_number
				this.huangou_product_price = huangou_product_price
				this.huangou_package_price1 = huangou_package_price.toFixed(2)
				this.huangou_product_price1 = huangou_product_price.toFixed(2)
				this.payamount = aaa.toFixed(2)
			},

			//请求数据动态渲染事件
			preinfo: function() {
				console.log(12212)
				var that = this;
				var is_ziti = 0,
					onlinepay = 0,
					is_pos = 0;

				if (that.ordZiti) {
					is_ziti = 1;
				}

				if (that.payway == '在线支付' || that.payway == '请选择') {
					onlinepay = 1;
				} else if (this.payway == '餐到付款现金') {
					onlinepay = 0;
					is_pos = 0;
				} else if (this.payway == '餐到付款刷卡') {
					onlinepay = 0;
					is_pos = 1;
				}

				var params = {
					"shop_id": app.globalData._CFG.shoptail,
					"addr_id": that.addrtop.addr_id,
					"coupon_id": that.coupon_id,
					'hongbao_id': that.hongbao_id,
					"is_ziti": is_ziti,
					"products": product_info,
					"online_pay": onlinepay,
					"hg_products": '',
					"peicard_id": that.peicard_id,
					"pcard_id": that.pcard_id,
					"is_first": that.is_first,
					"hongbao_package_id": that.hongbao_package_id
				};

				if (is_pos == 0 || is_pos == 1) {
					params.is_pos = is_pos;
				}

				console.log(params); // return

				app.globalData.orderFormInfo(params, function(res) {
					if (res.error == 0) {
						console.log('orderFormInfo', res)
						//优惠券
						var youhuiitem = res.data.coupon_list;

						if (res.data.coupon_id > 0 && res.data.coupon_amount) {
							that.coupon_id = res.data.coupon_id
							that.youhuiway = '-€' + res.data.coupon_amount
						}
						for (var i = 0; i < youhuiitem.length; i++) {
							//默认选择优惠券
							// youhuiitem[i].ltime = that.toDate(youhuiitem[i].ltime);
							if (youhuiitem[i].coupon_id == res.data.coupon_id) {
								youhuiitem[i].checked = true;
							} else {
								youhuiitem[i].checked = false;
							}
						}

						; //红包

						var hongitem = res.data.hongbao_list;

						if (res.data.hongbao_id > 0 && res.data.hongbao_amount) {
							that.hongbao_id = res.data.hongbao_id
							that.hongway = '-€' + res.data.hongbao_amount
						}

						for (var i = 0; i < hongitem.length; i++) {
							//默认选择红包
							if (hongitem[i].hongbao_id == res.data.hongbao_id) {
								hongitem[i].checked = true;
							} else {
								hongitem[i].checked = false;
							}
						}

						; //会员卡

						if (res.data.have_peicard == "1") {
							var peicards = res.data.peicards;

							for (var i = 0; i < peicards.length; i++) {
								//默认选择配送卡
								if (peicards[i].cid == res.data.peicard_id) {
									peicards[i].checked = true;
								} else {
									peicards[i].checked = false;
								}
							}

							;
						} else {
							var peicards = res.data.cards;

							for (var i = 0; i < peicards.length; i++) {
								//默认购买配送卡
								// if (peicards[i].card_id == res.data.pcard_id) {
								if (peicards[i].card_id == that.pcard_demo.card_id) {
									peicards[i].checked = true;
								} else {
									peicards[i].checked = false;
								}

								;
							}

							;
						}

						;

						if (that.address.have_peicard == "1" && Number(res.data.peicard_amount) == 0) {
							that.cardtxt = res.data.peicards.length + '张会员卡可用';
						} else if (Number(res.data.peicard_amount) == 0) {
							that.cardtxt = '未购买';
						} else {
							that.cardtxt = '-€' + Number(res.data.peicard_amount);
						}

						; //数据

						var aaa = parseFloat(res.data.amount) + that.huangou_product_price;
						res.data.reduce_freight = Number(res.data.reduce_freight);
						for (let i in res.data.product_lists) {
							for (let h in res.data.product_lists[i].specification) {
								if (res.data.product_lists[i].specification[h].price > 0 && res.data
									.product_lists[i].specification[h].val != '否') {
									res.data.product_lists[i].prices = parseFloat(res.data.product_lists[i]
										.prices) + (parseFloat(res.data.product_lists[i].specification[h]
										.price) * res.data.product_lists[i].num)
								}
							}
						}
						that.address = res.data
						that.payamount = aaa.toFixed(2)
						that.hongitem = hongitem
						that.youhuiitem = youhuiitem
						that.peicards = peicards
					}
				});
			},
			editTap: function(e) {
				var that = this;
				var label = e.currentTarget.dataset.type;
				var name = e.currentTarget.dataset.contact;
				var mobile = e.currentTarget.dataset.mobile;
				var num = e.currentTarget.dataset.house;
				var addr = e.currentTarget.dataset.addr;
				var id = e.currentTarget.id;
				var lat = e.currentTarget.dataset.lat;
				var lng = e.currentTarget.dataset.lng;
				uni.setStorage({
					key: 'addrInfo',
					data: {
						name: name,
						mobile: mobile,
						num: num,
						label: label,
						id: id
					},
					success: function(res) {}
				});
				uni.setStorage({
					key: 'addr',
					data: {
						addr: addr,
						lat: lat,
						lng: lng
					},
					success: function(res) {}
				});
				app.globalData.topage('/subPages/user/editaddr/editaddr?=' + id);
			},
			modalTap: function(e) {
				delidx = e.currentTarget.dataset.idx;
				var id = e.currentTarget.id;
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要删除该地址吗？',
					success: function(res) {
						if (res.confirm) {
							that.idx = id;
							that.modalChange()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			modalcancel: function(e) {
				this.modalHidden = true;
			},
			modalChange: function(e) {
				var that = this;
				var idx = that.idx;

				if (that.addrtop.addr_id == that.addr_lis[delidx].addr_id) {
					that.addrtop = '';
				}

				app.globalData.orderFormAddrDel({
					"lng": app.globalData._CFG.lng,
					"lat": app.globalData._CFG.lat,
					addr_id: idx
				}, function(res) {
					if (res.error == '0') {} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				app.globalData.orderFormAddr({
					"page": 1,
					"shop_id": app.globalData._CFG.shoptail
				}, function(res) {
					if (res.error == '0') {
						var addr_list = res.data.items;
						that.addr_lis = addr_list;
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				that.modalHidden = true;
			},
			//是否自提单；
			switchZiti: function(e) {
				var that = this;
				var currentlng = that.currentlng;
				var currentlat = that.currentlat;

				if (is_ziti == 'ziti') {
					that.ordZiti = true
					that.pei_type = 3
					uni.showModal({
						title: '切换后不满足起送价，是否去添加商品？',
						success: function(res) {
							if (res.confirm) {
								app.globalData.topage(1, 'back');
							}
						}
					});
				} else {
					if (e.currentTarget.dataset.ziti == '1') {
						that.ordZiti = true
						that.pei_type = 3
						that.preinfo()
					} else {
						that.ordZiti = false
						that.pei_type = 0
						that.preinfo();
					}

					;
				}
			},

			//是否享受首单优惠
			switchFirstYouhui(e) {
				// console.log(e.detail.value);
				if (e.detail.value) {
					this.is_first = 1;
				} else {
					this.is_first = 0;
				}

				;
				this.preinfo();
			},

			//下单；
			formSubmit: function(e) {
				if (app.globalData._CFG.double) {
					app.globalData._CFG.double = false;
					var formId = e.detail.formId;
					var onlinepay, peitime, is_pos; //var info = app.urlencode(product_info);

					var info = product_info;

					if (this.payway == '在线支付' || this.payway == '请选择') {
						onlinepay = 1;
					} else if (this.payway == '餐到付款现金') {
						onlinepay = 0;
						is_pos = 0;
					} else if (this.payway == '餐到付款刷卡') {
						onlinepay = 0;
						is_pos = 1;
					}

					var timestamp = Date.parse(new Date(this.sonDate + ' ' + this.sonTime));
					timestamp = timestamp / 1000;

					if (timestamp > 0) {
						peitime = timestamp;
					} else {
						peitime = 0;
					}

					; //换购商品拼接事件；

					var huangous = this.huangous,
						str = "",
						str_arr = [];

					for (var i = 0; i < huangous.length; i++) {
						if (huangous[i].num > 0) {
							str_arr.push(huangous[i].product_id + ':' + huangous[i].num);
						}

						;
					};

					str = str_arr.join(",");
					var params = {
						"shop_id": app.globalData._CFG.shoptail,
						"addr_id": this.addrtop.addr_id,
						"coupon_id": this.coupon_id,
						'hongbao_id': this.hongbao_id,
						"pei_type": this.pei_type,
						"pei_time": peitime,
						"online_pay": onlinepay,
						"products": info,
						"intro": intro,
						"formId": formId,
						"hg_products": str,
						"peicard_id": this.peicard_id,
						"pcard_id": this.pcard_id,
						"is_first": this.is_first,
						"hongbao_package_id": this.hongbao_package_id
					};

					if (is_pos == 0 || is_pos == 1) {
						params.is_pos = is_pos;
					}
					var that = this;
					if (this.addrtop.addr_id) {
						uni.showModal({
							title: '配送地址',
							content: this.addrtop.mobile + this.addrtop.addr + '--' + this.addrtop.house + this
								.addrtop.contact,
							cancelText: '修改',
							success: function(res) {
								if (res.confirm) {
									that.bindapp(params)
								} else if (res.cancel) {
									app.globalData._CFG.double = true;
									that.addrpop = 1;
								}
							}
						});
					} else {

						that.bindapp(params)
					}

				};
			},
			bindapp(params) {
				let that = this
				app.globalData.orderFormAddrCreate(params, function(res) {
					if (res.error == '0') {
						ecart.clear(app.globalData._CFG.shoptail); //订单提交成功，删除当前商家的购物车
						that.payorderid = res.data.order_id;
						if (res.data.online_pay == 1) {
							call();
						} else {
							if (res.data.is_pos == 0) {
								uni.showToast({
									title: '订单已提交（餐到付款现金）'
								});
							} else {
								uni.showToast({
									title: '订单已提交（餐到付款刷卡）'
								});
							}

							setTimeout(function() {
								uni.redirectTo({
									url: '/subPages/order/orderDetail/detail?orderid=' + res.data.order_id
								});
							}, 2000);
						}
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});

				function call() {
					console.log(double)
					if (double) {
						app.globalData._CFG.payorderid = that.payorderid;
						uni.redirectTo({
							url: '/subPages/order/payment/payment?orderid=' + that.payorderid
						});
						double = false;
						setTimeout(function() {
							double = true;
						}, 500);
					}
				};
				setTimeout(function() {
					app.globalData._CFG.double = true;
				}, 1000);
			},
			//问题提示弹窗
			quesShow(e) {
				uni.showModal({
					content: e.currentTarget.dataset.instr || '',
					showCancel: false,
					confirmColor: "#0075FF",

					success(res) {
						if (res.confirm) { // console.log('用户点击确定')
						}

						;
					}

				});
			},

			//转时间
			toDate: function(number) {
				//时间戳转成日期
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = date.getHours();
				var m = date.getMinutes();
				var s = date.getSeconds();
				return Y + M + D;
			},

			formReset() {
				console.log("占位：函数 formReset 未声明");
			}

		}
	};
</script>
<style>
	.setaction-sheet {
		position: fixed;
		width: 100%;
		background: #FFFFFF;
		width: 750rpx;
		bottom: 0;
		z-index: 10;
		left: 0;
	}

	.topHideShow {
		position: fixed;
		width: 750rpx;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		top: 0;
		left: 0;
		z-index: 2;
	}

	.wm_orderchoose {
		background: #fff;
		font-size: 28rpx;
	}

	.wm_orderchoose .choose {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 40rpx 0 40rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.wm_orderchoose .choose image {
		width: 30rpx;
		height: 30rpx;
	}

	.wm_orderchoose .choose label {
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 28rpx;
		height: 100rpx;
		line-height: 100rpx;
	}

	.wm_orderchoose .title {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.wm_orderchoose .choose .picker,
	.wm_orderchoose .choose .right_txt {
		color: #f30;
	}

	.wm_order_cai {
		background: #fff;
	}

	.wm_order_cai .title {
		padding: 40rpx 24rpx 20rpx 40rpx;
		line-height: 40rpx;
		font-size: 44rpx;
		color: #262628;
		overflow: hidden;
		font-weight: bold;
	}

	.wm_order_cai .title .ico {
		width: 30rpx;
		height: 30rpx;
		float: left;
		margin-right: 10rpx;
		margin-top: 5rpx;
	}

	.wm_order_cai .cai .list {
		display: flex;
		align-items: center;
		padding: 10rpx 40rpx;
	}

	.wm_order_cai .cai .pic {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
	}

	.wm_order_cai .cai .tit {
		width: 300rpx;
		font-size: 30rpx;
		padding-left: 40rpx;
		color: #262628;
		font-size: 28rpx;
	}

	.wm_order_cai .cai .num {
		width: 80rpx;
		font-size: 26rpx;
		text-align: right;
		color: #A3A3A4;
		font-size: 24rpx;
	}

	.wm_order_cai .cai .price {
		width: 200rpx;
		font-size: 30rpx;
		text-align: right;
		color: #262628;
		font-size: 28rpx;
	}

	.wm_order_cai .cai .price text {
		font-size: 24rpx;
		color: #A8A8A9;
		margin-right: 20rpx;
		position: relative;
	}

	.wm_order_cai .cai .price text:after {
		content: '';
		width: 100%;
		height: 2rpx;
		background: #A8A8A9;
		position: absolute;
		left: 0;
		top: 50%;
	}

	.wm_order_cai .li_info {
		padding: 20rpx 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		overflow: hidden;
	}

	.wm_order_cai .li_info .small {
		font-size: 24rpx;
	}

	.wm_order_cai .li_info .big {
		font-size: 36rpx;
	}

	.wm_order_cai .li_info .ico {
		width: 32rpx;
		height: 32rpx;
		display: inline-block;
		border-radius: 8rpx;
		line-height: 32rpx;
		text-align: center;
		color: #fff;
		font-size: 24rpx;
		margin-right: 12rpx;
		vertical-align: text-bottom;
	}

	.wm_order_cai .li_info .ques_ico {
		width: 32rpx;
		height: 32rpx;
		display: inline-block;
		margin-left: 12rpx;
		vertical-align: middle;
	}

	.wm_order_liuyan {
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
		background: #fff;
		font-size: 28rpx;
		padding-left: 40rpx;
		padding-right: 40rpx;
		padding-bottom: 200rpx;
	}

	.wm_order_liuyan textarea {
		margin-left: 30rpx;
		margin-top: 16rpx;
		height: 200rpx;
		background: #eef2f5;
		border-radius: 24rpx;
		padding: 32rpx;
		flex: 1;
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
		color: #ff797c;
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

	.addr_list_mask .title {
		height: 100rpx;
		font-size: 32rpx;
		line-height: 100rpx;
		text-align: center;
		background: #fff;
	}

	.addr_list_mask {
		height: 800rpx;
		transform: translate(0, 100%);
		overflow: hidden;
		position: fixed;
		bottom: 0;
		right: 0;
		width: 100%;
		z-index: 11;
		transition: all .3s cubic-bezier(0.77, 0, 0.175, 1);
		background: #f7f7f7;
	}

	.addr_list_mask .list {
		height: 560rpx;
	}

	.addr_list_mask.active {
		transform: translate(0, 0);
		transition: all .3s cubic-bezier(0.77, 0, 0.175, 1);
	}

	.addr_list {
		position: relative;
		background: #fff;
		margin: 24rpx;
		border-radius: 24rpx;
	}

	.addr_list .bt {
		padding: 20rpx;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.addr_list .addr {
		padding: 0 20rpx 20rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #666;
	}

	.addr_list .bottom {
		padding: 20rpx;
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

	.addr_list .bottom button {
		width: 40rpx;
		height: 40rpx;
		background: none;
		vertical-align: middle;
		font-size: 0;
		line-height: 0;
		border-radius: 0;
		margin-left: 30rpx;
	}

	.addr_list .bottom button image {
		width: 40rpx;
		height: 40rpx;
	}

	.addr_list .bottom button::after {
		display: none;
	}

	.noin {
		width: 180rpx;
		height: 120rpx;
		position: absolute;
		right: 24rpx;
		top: 10rpx;
	}

	.footer_btn_long {
		position: absolute;
		bottom: 0rpx;
		width: 96%;
		background: #fff;
	}

	.addmask_bg {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		left: 0;
		background: rgba(0, 0, 0, .3)
	}

	page {
		height: 100%;
		overflow: hidden;
	}

	.noaddress {
		width: 140rpx;
		height: 140rpx;
		position: absolute;
		top: 180rpx;
		left: 50%;
		transform: translateX(-50%)
	}

	view.noaddress {
		text-align: center;
		color: #666;
		margin-top: 160rpx;
	}

	.addr_list.choosed .bt,
	.addr_list.choosed .addr {
		color: #ff797c;
	}

	/*是否自提单*/
	.ordZiti_tab {
		background: #FF797C;
		height: 88rpx;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #eee;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.ordZiti_tab view {
		font-size: 30rpx;
		line-height: 66rpx;
		position: relative;
		height: 66rpx;
		background: #FFA6A8;
		width: 226rpx;
		color: #FFFFFF;
		text-align: center;
	}

	.ordZiti_tab view.on {
		color: #FF797C;
		background: #FFFFFF;
	}

	.ordZiti {
		overflow: hidden;
	}

	.ordZiti .ziti_addr {
		overflow: hidden;
		padding: 56rpx 50rpx 20rpx 64rpx;
		background: #fff;
		position: relative;
		min-height: 40rpx;
		margin-top: -30rpx;
		border-radius: 30rpx 30rpx 0 0;
	}

	.ordZiti .bt {
		font-size: 28rpx;
		line-height: 40rpx;
		width: 140rpx;
	}

	.ordZiti .ziti_addr .linkico {
		position: absolute;
		top: 50%;
		margin-top: -20rpx;
		right: 50rpx;
	}

	.ordZiti .ziti_addr .bt {
		position: absolute;
		top: 50%;
		margin-top: -20rpx;
		font-size: 24rpx;
	}

	.ordZiti .ziti_addr .addr {
		font-size: 28rpx;
		line-height: 40rpx;
		margin: 0 40rpx 0 140rpx;
		word-break: break-all;
	}

	/*/配送地址*/
	.wm_order_addr {
		padding: 56rpx 50rpx 32rpx 64rpx;
		display: flex;
		align-items: center;
		background: #fff;
		position: relative;
		margin-top: -30rpx;
		border-radius: 30rpx 30rpx 0 0;
	}

	.wm_order_addr .add_detail {
		flex: 1;
		font-size: 24rpx;
	}

	.wm_order_addr .shouhuo {
		font-size: 32rpx;
		padding-bottom: 10rpx;
		color: #2D2D2D;
		font-weight: bold;
	}

	.wm_order_addr .shouphone {
		font-size: 24rpx;
		color: #ff797c;
		padding-bottom: 10rpx;
	}

	.wm_order_addr .addr {
		line-height: 34rpx;
	}

	/*送达时间弹层*/
	.picker_time_mask {
		position: fixed;
		z-index: 99;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 300px;
		background: #fff;
	}

	/*时间弹层*/
	.sonTime_mask {
		position: fixed;
		left: 0;
		bottom: 0;
		background: #fff;
		z-index: 99;
		width: 100%;
		height: 50%;
		overflow: hidden;
		transform: translate(0, 100%);
		transition: all 0.4s ease;
	}

	.sonTime_mask.show {
		transform: translate(0, 0);
	}

	.sonTime_mask .title {
		text-align: center;
		padding: 20rpx;
		height: 36rpx;
		line-height: 36rpx;
		font-size: 32rpx;
		position: sticky;
		left: 0;
		top: 0;
		right: 0;
		overflow: hidden;
		border-bottom: 2rpx solid #e6e6e6;
	}

	.sonTime_mask .title .close {
		float: left;
		width: 40rpx;
		height: 40rpx;
	}

	.sonTime_mask .title .close image {
		width: 40rpx;
		height: 40rpx;
	}

	.sonTime_mask .left {
		height: 100%;
		width: 40%;
		background: #f7f7f7;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.sonTime_mask .right {
		height: 100%;
		width: 60%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		-webkit-overflow-scrolling: touch;
	}

	.sonTime_mask .left .list.on {
		color: #ff797c;
		background: #fff;
	}

	.sonTime_mask .right .list.on {
		color: #ff797c;
	}

	.sonTime_mask .list {
		padding: 20rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		text-align: center;
		position: relative;
	}

	.sonTime_mask .list::after {
		content: '';
		width: 100%;
		height: 2rpx;
		background: #e6e6e6;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.sonTime_mask .right .list image {
		position: absolute;
		right: 20rpx;
		top: 50%;
		margin-top: -20rpx;
		display: none;
	}

	.sonTime_mask .right .list.on image {
		position: absolute;
		right: 20rpx;
		top: 50%;
		margin-top: -20rpx;
		display: block;
		width: 36rpx;
		height: 26rpx;
	}

	/*换购商品*/
	.huangous {
		background-color: #fff;
	}

	.huangous .title {
		border-bottom: 2rpx solid #eee;
		padding: 20rpx 24rpx;
		font-size: 32rpx;
		line-height: 40rpx;
		font-weight: normal;
	}

	.huangous .lists {
		overflow: hidden;
		position: relative;
		padding: 16rpx 20rpx;
	}

	.huangous .lists .pic {
		overflow: hidden;
		width: 100rpx;
		height: 100rpx;
		border-radius: 4rpx;
		float: left;
	}

	.huangous .lists .txt_box {
		margin-left: 120rpx;
		margin-right: 168rpx;
	}

	.huangous .lists .txt_box .tit {
		font-size: 30rpx;
		line-height: 40rpx;
		font-weight: normal;
	}

	.huangous .lists .txt_box .price {
		font-size: 36rpx;
		color: #FA4C34;
	}

	.huangous .lists .txt_box .price .small {
		font-size: 26rpx;
	}

	.huangous .lists .txt_box .price .del {
		font-size: 24rpx;
		color: #999;
		margin-left: 8rpx;
	}

	.huangous .lists .right_box {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translate(0, -50%);
		-webkit-transform: translate(0, -50%);
	}

	.huangous .lists .btn {
		background: #4A92F6;
		border-radius: 8rpx;
		width: 128rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #fff;
		font-size: 32rpx;
		text-align: center;
	}

	.huangous .nr_li {
		font-size: 28rpx;
		padding: 20rpx 24rpx;
		line-height: 40rpx;
	}

	.huangous .total {
		font-size: 24rpx;
		padding: 20rpx 24rpx;
		line-height: 40rpx;
		text-align: right;
	}

	.huangous .total .big {
		font-size: 36rpx;
		margin-left: 12rpx;
	}

	/*加减框*/
	.goods_int_box {
		height: 54rpx;
	}

	.goods_int_box .num {
		width: 60rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		float: left;
	}

	.goods_int_box .jian,
	.goods_int_box .jia {
		width: 50rpx;
		height: 50rpx;
		float: left;
	}

	/*配送会员卡*/
	.wm_orderchoose .choose.card .label {
		position: relative;
	}

	.wm_orderchoose .choose.card label {
		padding: 16rpx 30rpx;
		height: auto;
		line-height: 40rpx;
		display: block;
	}

	.wm_orderchoose .choose.card radio {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.wm_orderchoose .choose.card .tit {
		font: 30rpx;
	}

	.wm_orderchoose .choose.card .txt {
		font-size: 24rpx;
		color: #999;
	}

	.wm_orderchoose .choose.card .txt text {
		color: #f30;
	}

	.wm_orderchoose .choose radio-group {
		max-height: 800rpx;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		-webkit-overflow-scrolling: touch
	}

	.card_demo {
		margin: 24rpx 40rpx 22rpx;
		padding: 16rpx 24rpx;
	}

	.card_demo .tit {
		font-size: 24rpx;
		line-height: 40rpx;
		margin-bottom: 8rpx;
		color: #ee8080;
	}

	.card_demo .txt {
		font-size: 24rpx;
		line-height: 40rpx;
		color: #ee8080;
	}

	.card_demo .price {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #ee8080;
		font-weight: 500;
	}

	.card_demo .ico {
		width: 32rpx;
		height: 32rpx;
		margin-left: 16rpx;
	}

	.card_demo .text {
		margin-right: 60rpx;
		color: #A3A3A4;
		font-size: 24rpx;
	}

	/*首单优惠*/
	.firstYouhui_box {
		background: #fff;
		padding: 20rpx 40rpx;
		overflow: hidden;
	}

	.firstYouhui_box switch {
		zoom: .6;
	}


	.selectBox {
		padding: 10rpx 50rpx 10rpx 64rpx;
		display: flex;
		align-items: center;
		font-size: 24rpx;
		line-height: 40rpx;
		background: #fff;
		color: #262628;
	}

	.selectBox .nr {
		flex: 1;
		text-align: right;
	}

	.selectBox .blue {
		color: #ff797c;
	}

	.selectBox .title {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.selectBox .label {
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 28rpx;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	/*红包选择*/
	.wm_orderchoose .hongBaoLists .list {
		margin: 24rpx;
		display: block;
		background: #fff;
		padding: 0;
		line-height: unset;
		width: auto;
		height: auto;
		line-height: 40rpx;
	}

	.hongBaoLists .list.over {
		opacity: 0.5
	}

	.hongBaoLists .list .cont {
		padding: 24rpx 24rpx;
		overflow: hidden;
		position: relative;
	}

	.hongBaoLists .list .price {
		width: 216rpx;
		text-align: center;
		float: left;
	}

	.hongBaoLists .list .price .num {
		font-size: 48rpx;
		color: #FF725C;
		line-height: 80rpx;
	}

	.hongBaoLists .list .price .num .big {
		font-size: 72rpx;
	}

	.hongBaoLists .list .price .txt {
		font-size: 24rpx;
		color: #999;
	}

	.hongBaoLists .list .txt_box {
		margin-left: 236rpx;
		margin-right: 100rpx;
	}

	.hongBaoLists .list .tit {
		font-size: 32rpx;
		line-height: 40rpx;
	}

	.hongBaoLists .list .txt_box .tit {
		margin-bottom: 8rpx;
	}

	.hongBaoLists .list .txt_box p {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #666;
		display: block;
	}

	.hongBaoLists .list .check {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.hongBaoLists .list .instr {
		border-top: 2rpx solid #eee;
		padding: 8rpx 24rpx;
	}

	.hongBaoLists .list .instr p {
		font-size: 24rpx;
		line-height: 36rpx;
		display: block;
	}

	.hongBaoLists .list .instr image {
		vertical-align: inherit;
		width: 24rpx;
		height: 24rpx;
	}

	/*优惠券选择*/
	.wm_orderchoose .couponLists .list {
		margin: 24rpx;
		display: block;
		/* border: 2rpx solid #eee; */
		background: #fff;
		padding: 0;
		line-height: unset;
		width: auto;
		height: auto;
		line-height: 40rpx;
	}

	.couponLists .list.over {
		opacity: 0.5
	}

	.couponLists .list .cont {
		padding: 24rpx 24rpx;
		overflow: hidden;
		position: relative;
	}

	.couponLists .list .price {
		width: 216rpx;
		text-align: center;
		float: left;
	}

	.couponLists .list .price .num {
		font-size: 48rpx;
		color: #FF725C;
		line-height: 80rpx;
	}

	.couponLists .list .price .num .big {
		font-size: 72rpx;
	}

	.couponLists .list .price .txt {
		font-size: 24rpx;
		color: #999;
	}

	.couponLists .list .txt_box {
		margin-left: 236rpx;
		margin-right: 100rpx;
	}

	.couponLists .list .tit {
		font-size: 32rpx;
		line-height: 40rpx;
	}

	.couponLists .list .txt_box .tit {
		margin-bottom: 8rpx;
	}

	.couponLists .list .txt_box p {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #666;
		display: block;
	}

	.couponLists .list .check {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.couponLists .list .instr {
		border-top: 2rpx solid #eee;
		padding: 8rpx 24rpx;
	}

	.couponLists .list .instr p {
		font-size: 24rpx;
		line-height: 36rpx;
		display: block;
	}

	.couponLists .list .instr image {
		vertical-align: inherit;
		width: 24rpx;
		height: 24rpx;
	}

	.shopOffTips {
		position: fixed;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		background: rgba(0, 0, 0, .4)
	}

	.shopOffTipsOut {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.shopOffTipsIn {
		position: relative;
		width: 460rpx;
		height: 460rpx;
	}

	.shopOffyouhui {
		position: relative;
		width: 500rpx;
		min-height: 570rpx;
		background: white;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
	}

	.shopOffyouhui .tipsyouhui {
		width: 198rpx;
		height: 198rpx;
		margin-top: 24rpx;
	}

	.shopOffyouhui .youhuiname {
		font-size: 28rpx;
		color: #2D2D2D;
		margin-top: 24rpx;
	}

	.shopOffyouhui .newhuodongname {
		font-size: 26rpx;
		color: #6D7278;

	}

	.newhuodongbutton {
		border-radius: 16rpx;
		background: #ECF1F8;
		padding: 20rpx;
		color: #ff797c;
	}
</style>