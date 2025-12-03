<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>

				<view v-if="isindexshow" :style="'height: 100%; background-color: #F5F7FA '+ ';'">
					<!--内容-开始-->
					<image class="indexBg" mode="widthFix" :src="indexBgColor.background"></image>
					<view class="WMhome" :catchtouchmove="screenTabShow ? catchtouchmove : ''">
						<block v-for="(module, module_idx) in indexCont" :key="module_idx">
							<!--模块1-->
							<view class="topBg_box" v-if="module.module == 'module1'"
								:style="'background-color:#' + module.background_color">
								<image class="topBg_pic" mode="aspectFit" :src="module.background"></image>
								<view class="topBg_nr">
									<!--头部定位-开始-->
									<block v-if="module.type == 2">
										<view id="searchBox_h"></view>
										<view class="topState" style="height:88rpx;">
											<view class="right_search fr" @tap.stop="tosearch">
												<view class="inp">
													<image class="ico_search" src="/static/image/quan_sou.png"
														mode="aspectFit"></image>
													<input placeholder="请输入" disabled="true">
												</view>
											</view>
											<view class="location" @tap.stop="tosearchaddr">
												<image class="addr_ico" :src="module.icon_location" mode="aspectFit">
												</image><text :style="'color:#' + module.color">{{currentaddr}}</text>
												<image class="down_ico" :src="module.icon_down" mode="aspectFit">
												</image>
											</view>
										</view>
									</block>
									<block v-else-if="module.type == 3">
										<view style="height:200rpx;">
											<view class="topState" id="searchBox_h">
												<view class="weather">
													<view class="fl">
														<image class="ico_weather" :src="module.weather.icon"
															mode="aspectFit"></image>{{module.weather.temperature}}
													</view>
													<view class="fl ml10">
														<view class="small">{{module.weather.indicator}}</view>
														<view class="small">{{module.weather.title}}</view>
													</view>
												</view>
												<view class="location" @tap.stop="tosearchaddr">
													<image class="addr_ico" :src="module.icon_location"
														mode="aspectFit"></image><text
														:style="'color:#' + module.color">{{currentaddr}}</text>
													<image class="down_ico" :src="module.icon_down" mode="aspectFit">
													</image>
												</view>
											</view>
											<view class="searchBox" @tap.stop="tosearch">
												<image class="ico_search" src="/static/image/quan_sou.png"
													mode="aspectFit"></image>

												<view
													style="height: 64rpx;font-size: 28rpx;color: #999;line-height: 64rpx;">
													请输入商家名称或商品名称</view>
											</view>
										</view>
									</block>
									<block v-else>
										<view style="height:200rpx;">
											<view class="topState" id="searchBox_h">
												<view class="location" style="max-width:80% !important;"
													@tap.stop="tosearchaddr">
													<image class="addr_ico" :src="module.icon_location"
														mode="aspectFit"></image><text
														:style="'color:#' + module.color">{{currentaddr}}</text>
													<image class="down_ico" :src="module.icon_down" mode="aspectFit">
													</image>
												</view>
											</view>
											<view class="searchBox" @tap.stop="tosearch">
												<image class="ico_search" src="/static/image/quan_sou.png"
													mode="aspectFit"></image>

												<view
													style="height: 64rpx;font-size: 28rpx;color: #999;line-height: 64rpx;">
													请输入商家名称或商品名称</view>
											</view>
										</view>
									</block>
									<!--头部定位-结束-->
									<!--头部热词-开始-->
									<view class="searchWord" v-if="module.searchBox.open == 1">
										<ul>
											<li v-for="(item, index) in module.searchBox.keywords" :key="index"
												class="list" @tap.stop="tosearchshoplist" :data-tit="item"
												:style="'color:#' + module.color">{{item}}</li>
										</ul>
									</view>
									<!--头部热词-结束-->
								</view>
							</view>

							<!--模块2-->
							<view class="bannerBg_box" v-if="module.module == 'module2'"
								:style="'background-color:#' + module.background_color">
								<!--轮播图-开始-->
								<block v-if="module.type == 1">
									<view class="idxBanner">
										<swiper autoplay="true" duration="1000" circular="true" indicator-dots="true"
											indicator-color="#D7D7D7" indicator-active-color="#FF797C"
											>
											<block v-for="(item, index) in module.content" :key="index">
												<swiper-item>
													<!-- @tap="toWxLink" -->
													<image :src="item.photo" mode="widthFix" :data-url="item.wxlink">
													</image>
												</swiper-item>
											</block>
										</swiper>
									</view>
								</block>
								<block v-if="module.type == 2">
									<image class="bannerBg_pic" :src="module.background"></image>
									<!-- @tap="toWxLink" -->
									<view class="idxBanner" :data-url="module.wxlink">
										<swiper indicator-dots="">
											<swiper-item></swiper-item>
										</swiper>
									</view>
								</block>
								<!--轮播图-结束-->
							</view>

							<!--模块3-->
							<!--分类导航-开始-->
							<view :class="'cateNav ' + (module.type == 1 ? 'col5' : '')"
								v-if="module.module == 'module3'"
								:style="'background-color:#' + module.background_color">
								<image class="cateNavBg_pic" mode="aspectFit" :src="module.background"></image>
								<swiper circular="true">
									<!-- <block
										v-for="(li, key) in module.type == 1 ? (module.content.length%10 != 0 ? module.content.length/10 : module.content.length/10) : (module.content.length%8 != 0 ? module.content.length/8 : module.content.length/8)"
										:key="key"> -->
									<swiper-item>
										<ul>
											<li v-for="(item, index) in module.content" :key="index"
												v-if="module.type == 1 ? (index < (key+1)*10 && index >= key*10) : (index < (key+1)*8 && index >= key*8)"
												@tap="toCateLink" :data-obj="JSON.stringify(item)" :data-idx="index">
												<image :src="item.photo"></image>
												<view class="txt" :style="'color:#' + module.color">{{item.title}}
												</view>
											</li>
										</ul>
									</swiper-item>
									<!-- </block> -->
								</swiper>
							</view>
							<!--分类导航-结束-->

							<!--模块5-6-->
							<!--优惠专区-开始-->
							<block v-if="module.module == 'module5' || module.module == 'module6'">
								<view class="idxTitle" @tap.stop="toYouhuiMore" :data-url="module.wxlink"
									@tap="toWxLink">
									<image :src="module.photo" mode="aspectFit"></image>
								</view>
								<!--左右滑动-->
								<view class="preferentialAarea preferentialAarea1 mb10"
									v-if="module.type == 1 || !(module.type)">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--两张-->
								<view class="preferentialAarea preferentialAarea2 mb10" v-else-if="module.type == 2">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--单张-->
								<view class="preferentialAarea preferentialAarea3 mb10" v-else-if="module.type == 3">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--三张-->
								<view class="preferentialAarea preferentialAarea4 mb10" v-else-if="module.type == 4">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--四张-->
								<view class="preferentialAarea preferentialAarea5 mb10" v-else-if="module.type == 5">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--四张混-->
								<view class="preferentialAarea preferentialAarea6 mb10" v-else-if="module.type == 6">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--六张-->
								<view class="preferentialAarea preferentialAarea7 mb10" v-else-if="module.type == 7">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
								<!--左右滑动-->
								<view class="preferentialAarea preferentialAarea1 mb10" v-else>
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap.stop="toWxLink"
											:data-url="item.wxlink">
											<image :src="item.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
							</block>
							<!--优惠专区-结束-->

							<!--模块7-->
							<!--大牌甄选-开始-->
							<block v-if="module.module == 'module7'">
								<view class="idxTitle" @tap.stop="toWxLink" :data-url="module.wxlink">
									<image :src="module.photo" mode="aspectFit"></image>
								</view>
								<view class="largeSelection1" v-if="module.type == 1 || !(module.type)">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap="toWxLink"
											:data-url="item.wxlink">
											<image class="pic" :src="item.photo"></image>
											<!-- <view class="overflow_clear tit">{{item.title}}</view> -->
										</li>
									</ul>
								</view>
								<view class="largeSelection2" v-if="module.type == 2">
									<ul>
										<li v-for="(item, index) in module.content" :key="index" @tap="toWxLink"
											:data-url="item.wxlink">
											<image class="pic" :src="item.photo" mode="widthFix"></image>
											<!-- <view class="logo_box">
                                <image class="logo" src="{{item.photo}}"></image>
                                <view class="overflow_clear tit">{{item.title}}</view>
                            </view> -->
										</li>
									</ul>
								</view>
							</block>
							<!--大牌甄选-结束-->

							<!--模块8-->
							<!--单条活动广告-开始-->
							<block v-if="module.module == 'module8'">
								<view class="preferentialAarea preferentialAarea3 mb10">
									<ul>
										<li @tap.stop="toWxLink" :data-url="module.wxlink">
											<image :src="module.photo" mode="aspectFill"></image>
										</li>
									</ul>
								</view>
							</block>
							<!--单条活动广告-结束-->
						</block>
						<view class="idxTitle">
							<view class="tit">附近商家</view>
						</view>
					</view>
					<!--商家列表-开始-->
					<view class="screenTab" id="screenTab">
						<view class="flex-wrp">
							<view :class="'list ' + (screenTabIndex == '0' || newscroTabIndex == '0' ? 'on' : '')"
								@tap="tapScreen" id="0">{{cateVal}}
								<image class="dwon_ico"
									:src="screenTabIndex != '0'|| newscroTabIndex == '0'  ? '/static/image/btn_arrow_b_small3x.png' : '/static/image/btn_arrow_t_small3x.png'"
									mode="aspectFit"></image>
							</view>
							<view class="ml30"
								:class="'list ' + (screenTabIndex == '1' || newscroTabIndex == '1' ? 'on' : '')"
								@tap="tapScreen" id="1">{{paiVal}}
								<image class="dwon_ico"
									:src="screenTabIndex != '1'|| newscroTabIndex == '1'  ? '/static/image/btn_arrow_b_small3x.png' : '/static/image/btn_arrow_t_small3x.png'"
									mode="aspectFit"></image>
							</view>
						</view>
						<view :class="'list ' + (screenTabIndex == '2' || newscroTabIndex == '2'  ? 'on' : '')"
							@tap="tapScreen" id="2">{{screenVal}}
							<image class="screen_ico" src="/static/image/btn_choose_select3x.png" mode="aspectFit">
							</image>
						</view>
					</view>
					<view class="shopLists_h">
						<view class="shop_card_list">
							<view v-for="(item, index) in shopLists" :key="index"
								:class="'shop_card ' + (item.yyst == 1 ? '' : 'close')" 
								@tap="gotoDetail"
								:id="item.shop_id">
								<!-- 商家封面图 -->
								<view class="card_cover">
									<image :src="item.shop_show?item.shop_show:item.logo" class="cover_img" mode="aspectFill"></image>
									<image src="/static/image/label_new.png" class="new_tag" v-if="item.is_new == 1"></image>
									<view class="closed_mask" v-if="item.yyst != 1">
										<text class="closed_text">已打烊</text>
									</view>
								</view>
								
								<!-- 商家信息 -->
								<view class="card_info">
									<view class="shop_header">
										<view class="shop_name">{{item.title}}</view>
										<view class="rating_score" v-if="item.comment_score_switch==1">
											<image src="/static/image/score_icon.png" class="score_icon" mode="aspectFit"></image>
											<text class="score_text">{{item.avg_score}}</text>
										</view>
									</view>
									<view class="delivery_time">
										<image src="/static/image/time_icon.png" class="time_icon" mode="aspectFit"></image>
										<text v-if="item.tips_label">{{item.tips_label}}</text>
										<text v-else>{{item.pei_time}}分钟</text>
									</view>
								</view>
							</view>
							<NoData :show="shopLists.length == 0" />
						</view>
					</view>
					<!--商家列表-结束-->
				</view>
				<!--内容-结束-->
				<!--筛选排序-开始-->
				<view class="screenTab_fixed" v-if="screenTabShow">
					<view class="screenTab" style="padding: 20rpx 30rpx;">
						<view :class="'list ' + (screenTabIndex == '0' ? 'on' : '')" @tap="tapScreen" id="0">{{cateVal}}
							<image class="dwon_ico"
								:src="screenTabIndex != '0' ? '/static/image/btn_arrow_b_small3x.png' : '/static/image/btn_arrow_t_small3x.png'"
								mode="aspectFit"></image>
						</view>
						<view :class="'list ' + (screenTabIndex == '1' ? 'on' : '')" @tap="tapScreen" id="1">{{paiVal}}
							<image class="dwon_ico"
								:src="screenTabIndex != '1' ? '/static/image/btn_arrow_b_small3x.png' : '/static/image/btn_arrow_t_small3x.png'"
								mode="aspectFit"></image>
						</view>
						<view :class="'list ' + (screenTabIndex == '2' ? 'on' : '')" @tap="tapScreen" id="2">
							{{screenVal}}
							<image class="screen_ico" src="/static/image/btn_choose_select3x.png" mode="aspectFit">
							</image>
						</view>
					</view>
					<view :class="'change_list ' + (screenTabIndex == 0 ? 'on' : '')" v-if="screenTabIndex == 0 ">
						<view class="allCates">
							<view class="left">
								<ul>

									<li v-for="(item, index) in allCates" :key="index" @tap="tapCates"
										:class="catesIndex == index ? 'on' : ''" :data-index="index">{{item.title}}</li>
								</ul>
							</view>
							<view class="right">
								<ul v-for="(item, index) in allCates" :key="index" v-if="catesIndex == index">
									<li v-for="(li, idx) in item.childrens" :key="idx"
										:class="cateIndex[index] == idx ? 'on' : ''" @tap="tapCate" :data-idx="idx">
										{{li.title}}
										<image class="ico_check" src="/static/image/icon_selected3x.png"
											mode="aspectFit"></image>
									</li>
								</ul>
							</view>
						</view>
					</view>
					<view :class="'change_list ' + (screenTabIndex == 1 ? 'on' : '')" v-if="screenTabIndex == 1 ">
						<view class="pais">
							<ul>
								<li v-for="(li, idx) in pais" :key="idx" :class="paiIndex == idx ? 'on' : ''"
									@tap="tapPai" :data-idx="idx">{{li.title}}
									<image class="ico_check" src="/static/image/icon_selected3x.png" mode="aspectFit">
									</image>
								</li>
							</ul>
						</view>
					</view>
					<view :class="'change_list ' + (screenTabIndex == 2 ? 'on' : '')" v-if="screenTabIndex == 2 ">
						<view class="screen">
							<view class="cont">
								<view class="tit">配送方式</view>
								<ul>
									<li v-for="(item, index) in peiWays" :key="index" @tap="peiWay" :data-idx="index"
										:class="peiWay_idx == index ? 'on' : ''">{{item.title}}</li>
								</ul>
								<view class="tit">优惠信息</view>
								<ul>
									<li v-for="(item, index) in youhuiWays" :key="index" @tap="youhuiWay"
										:data-idx="index" :class="youhuiWay_idx == index ? 'on' : ''">{{item.title}}
									</li>
								</ul>
								<view class="tit">商家特色</view>
								<ul>
									<li v-for="(item, index) in featureWays" :key="index" @tap="featureWay"
										:data-idx="index" :class="featureWay_idx == index ? 'on' : ''">{{item.title}}
									</li>
								</ul>
							</view>
							<view class="btn_box">
								<view class="btn" @tap="clearScreen">清空</view>
								<view class="btn btn2" @tap="confirmScreen">确定</view>
							</view>
						</view>
					</view>
				</view>
				<view class="mask_bg" style="z-index: 10;" v-if="screenTabIndex != null" @tap="tapScreen"
					catchtouchmove="catchtouchmove"></view>
				<!--筛选排序-结束-->

				<!--首页红包-开始-->
				<view class="idxHongbao_mask" v-if="hongbaosShow">
					<view class="idxHongbao_cont">
						<view class="cont">
							<image class="adv" style="display:block;width: 100%;" mode="widthFix"
								:src="hongbaosInfo.background"></image>
							<ul :style="'background:#' + hongbaosInfo.background_color">
								<li v-for="(item, index) in hongbaosInfo.items" :key="index">
									<image src="/static/image/redbag_box_inner3x.png" class="bg" mode="widthFix">
									</image>
									<view class="box">
										<view class="price"><span>€</span>{{item.amount}}</view>
										<view class="txt_box">
											<view class="h3">{{item.title}}</view>
											<p>满€{{item.min_amount}}可用</p>
											<span>有效期至{{item.time}}</span>
										</view>
									</view>
								</li>
							</ul>
						</view>
						<view class="btn" @tap="getHongbao" :data-type="hongbaosInfo.type">立即领取</view>
						<image @tap="sethongbaosShow" class="close" src="/static/image/icon_close3x.png"
							mode="aspectFit"></image>
					</view>
				</view>
				<!--首页红包-结束-->
				<!--首页红包-开始-->

				<view class="idxHongbao_mask" v-if="peicardShow">
					<view class="idxHongbao_cont">
						<view class="cont">
							<image class="adv" style="display:block;width: 100%;" mode="widthFix"
								:src="peicardInfo.background"></image>
							<ul :style="'background:#' + peicardInfo.background_color">

								<li v-for="(item, index) in peicardInfo.items" :key="index">
									<image src="/static/image/redbag_box_inner3x.png" class="bg" mode="widthFix">
									</image>
									<view class="box">
										<view class="price"><span>€</span>{{item.amount}}</view>
										<view class="txt_box">
											<view class="h3">新人配送{{item.title}}</view>
											<p>每单最多减免配送费:€{{item.limits}}</p>
											<p>单日可使用配送单数:{{item.reduce}}单</p>
											<p>有效期限{{item.days}}天</p>
										</view>
									</view>
								</li>
							</ul>
						</view>
						<view class="btn" style="background: transparent;box-shadow:none" @tap="setpeicardShow">
							<image style="width: 100rpx;height: 100rpx;" src='/static/image/btn_close3x.png'
								mode='aspectFit'></image>
						</view>
						<!-- <image @tap="sethongbaosShow" class="close" src="/static/image/icon_close3x.png" mode="aspectFit"></image> -->
					</view>
				</view>
				<!--首页红包-结束-->

				<block v-if="!isindexshow">
					<view class="nologin">
						<image src="/static/image/noorder.png"></image>
						<view class="tip black6">授权定位获取信息</view>
						<button type="primary" size="default" class="mt20" @tap="getplace">获取位置</button>
					</view>
				</block>

				<!--白布-开始-->
				<view class="bai-cont" :hidden="whitebg"></view>
				<!--白布-结束-->

				<!--用户点击手势调用授权设置-开始-->
				<block>
					<view class="pubOpenSetting" v-if="OpenSettingShow">
						<view class="cont">
							<view class="txt black6">获取用户授权</view>
							<view class="btn_box">
								<view class="btn cancel" @tap="closeSetting">取消</view>
								<view class="btn confirm" @tap="closeSetting">确定<button
										:open-type="OpenSettingType"></button></view>
							</view>
						</view>
					</view>
				</block>
				<!--用户点击手势调用授权设置-结束-->
			</view>
		</skeleton>
	</view>
</template>

<script>
	//获取应用实例
	let common = require("../../js/ecart.js");
	let app = getApp(),
		ecart = null,
		double = true,
		qqmapsdk;
	let QQMapWX = require("../../js/qqmap-wx-jssdk.js");
	let config = require("../../libs/config.js");
	let searchBox_h, _h; //创建节点选择器
	//创建节点选择器
	let query; //商家筛选参数
	//商家筛选参数
	let params = {
		page: 1,
		cate_id: 0,
		pei_filter: '',
		youhui_filter: '',
		feature_filter: '',
		order: '',
		index: 1
	};

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 20,
					showTitle: true,
				},
				indexCont: [],
				allCates: [],
				OpenSettingShow: false,
				pais: [{
					title: "智能排序",
					order: "default"
				}, {
					title: "距离最近",
					order: "juli"
				}, {
					title: "评分最高",
					order: "score"
				}, {
					title: "销量最高",
					order: "sales"
				}, {
					title: "起送价最低",
					order: "price"
				}, {
					title: "最早送达",
					order: "ptime"
				}],
				peiWays: [{
					title: "不限",
					filter: ''
				}, {
					title: "商家送",
					filter: 'shop_pei'
				}, {
					title: "平台送",
					filter: 'roof_pei'
				}],
				youhuiWays: [{
					title: "首单优惠",
					filter: 'youhui_first'
				}, {
					title: "满减优惠",
					filter: 'manjian'
				}, {
					title: "满返优惠",
					filter: 'manfan'
				}, {
					title: "进店领券",
					filter: 'coupon'
				}],
				featureWays: [{
						title: "新店开业",
						filter: 'is_new'
					}, {
						title: "在线支付",
						filter: 'online_pay'
					}, // {
					//     title: "货到付款",
					//     filter: 'is_daofu'
					// },
					{
						title: "免费配送",
						filter: 'free_pei'
					}, {
						title: "0€起送",
						filter: 'zero_amount'
					}
				],
				cateVal: '全部分类',
				paiVal: '排序',
				screenVal: '筛选',
				catesIndex: 0,
				cateIndex: [],
				paiIndex: null,
				peiWay_idx: 0,
				youhuiWay_idx: null,
				featureWay_idx: null,
				screenTabIndex: null,
				newscroTabIndex: null,
				searchBoxShow: false,
				//浮动搜索框是否出现
				screenTabShow: false,
				//下拉筛选浮动是否出现
				shopLists: [],
				page: 1,
				scrollTop: 0,
				hdShow: null,
				hdType: 1,
				loadhide: true,
				currentaddr: '',
				isindexshow: app.globalData._CFG.isindexshow,
				whitebg: false,
				loadimg: true,
				headerTitle: '',
				//首页红包
				hongbaosInfo: {
					background: "",
					items: [],
					background_color: "",
					type: ""
				},
				hongbaosShow: false,
				//首页红包
				peicardInfo: {
					background: "",
					items: [],
					background_color: "",
					type: ""
				},
				peicardShow: false,
				indexBgColor: {
					background: ""
				},
				showToast: {
					isShow: false
				},
				null: "",
				key: ''
			};
		},

		components: {},
		props: {},

		onLoad: function() {
			this.refreshPage3389();
		},
		created() {
			//骨架屏
			// this.reloadData()
		},
		onShow() {
			//请求数据
			var that = this;
			uni.getStorage({
				key: 'currentAddr',
				success: function(res) {
					if (!res.data) {
						return
					}

					if (that.currentaddr != res.data.addr) {
						app.globalData._CFG.lng = res.data.lng;
						app.globalData._CFG.lat = res.data.lat;
						app.globalData._CFG.isindexshow = true;
						that.currentaddr = res.data.addr;
						that.currentaddr = res.data.addr
						that.isindexshow = app.globalData._CFG.isindexshow
						that.https();
					}
				}
			}); //商家购物车商品变化

			if (that.shopLists.length > 0) {
				var shopLists = that.shopLists; //构造商家购物车数量

				for (var i = 0; i < shopLists.length; i++) {
					ecart = new common.ECart(shopLists[i].shop_id);
					shopLists[i].totalnum = ecart.total_count();
				};
				that.shopLists = shopLists;
			};
		},

		//上来加载
		onReachBottom(e) {
			let page = this.page;
			this.page = page + 1;
			this.initData();
		},

		onPullDownRefresh: function() {
			this.initData(1, function() {
				uni.stopPullDownRefresh();
			});
		},

		/*** 用户点击右上角分享*/
		onShareAppMessage: function(res) {
			return {
				title: this.headerTitle,
				path: '/pages/index/index'
			};
		},
		methods: {
			//骨架屏
			https: function(nothasloading) {
				var that = this;
				that.loading = true
				app.globalData.home({
					"lng": app.globalData._CFG.lng,
					"lat": app.globalData._CFG.lat
				}, function(res) {
					that.loading = false
					if (res.error == '0') {
						uni.setStorage({
							key: 'currentCityId',
							data: res.data.city_id
						});
						app.globalData.city_id = res.data.city_id;
						that.loadimg = true;
						// 确保 theme 是数组
						if (Array.isArray(res.data.theme)) {
							for (let i in res.data.theme) {
								if (res.data.theme[i].module == 'module2') {
									// 确保 content 是数组后再进行过滤
									if (Array.isArray(res.data.theme[i].content)) {
										// 使用 filter 方法过滤掉不需要的图片,避免循环中删除元素导致索引错误
										res.data.theme[i].content = res.data.theme[i].content.filter(item => {
											return item.photo !==
												'https://image.aioeuropa.com/photo/202110/20211001_235AF9D6370A3B7EC840B14D3DD2C837.png' &&
												item.photo !==
												'https://image.aioeuropa.com/photo/202111/20211102_AFB1755A541623C956F80246655FF536.png';
										});
									}
								}
							}
						}
						that.indexCont = res.data.theme || []
						that.whitebg = true
						// 确保 theme 是数组后再遍历
						if (Array.isArray(res.data.theme)) {
							for (var i = 0; i < res.data.theme.length; i++) {
								if (res.data.theme[i].module == "module0") {
									that.indexBgColor = res.data.theme[i];
								} else if (res.data.theme[i].module == "module9") {
									that.hdType = res.data.theme[i].type;
								};
							};
						}
					} else {
						app.globalData.msgbox(res.message);
						that.loadimg = true;
						that.whitebg = true;
					}
				}, nothasloading);
				app.globalData.homeInfo({}, function(ret) {
					that.loading = false
					if (ret.error == '0') {
						that.headerTitle = ret.data.title;
						that.allCates = ret.data.waimai_cates;
						uni.setNavigationBarTitle({
							title: ret.data.title
						});
					};
				});
				that.initData(1);
			},

			initData(setpage, completeCallback) {
				completeCallback = typeof completeCallback == 'function' ? completeCallback : function(res) {};
				var that = this;
				if (setpage == 0) {
					that.loading = true;
				}

				var page = setpage ? setpage : that.page;
				params.page = page;
				app.globalData.shopLists(params, function(res) {
					completeCallback();
					if (setpage == 0) {
						that.loading = false;
					}

					if (res.error == "0") {
						//构造商家购物车数量
						for (var i = 0; i < res.data.items.length; i++) {
							ecart = new common.ECart(res.data.items[i].shop_id);
							res.data.items[i].totalnum = ecart.total_count();
						}; //判断是否为刷新加载数据
						if (res.data.items.length > 0) {
							if (res.data.items.length < 10) {
								if (!setpage) {
									uni.showToast({
										title: "暂无更多数据~"
									});
								};
							};

							if (page > 1) {
								that.shopLists = that.shopLists.concat(res.data.items);
							} else {
								that.shopLists = res.data.items;
							};
						} else {
							if (!setpage) {
								that.shopLists = that.shopLists.concat(res.data.items);
								uni.showToast({
									title: "暂无更多数据~"
								});
							} else {
								that.shopLists = res.data.items;
							};
						}; //首页红包

						if (page <= 1) {
							if (res.data.hongbao.items.length > 0) {
								for (var i in res.data.hongbao.items) {
									res.data.hongbao.items[i].time = that.toDate(res.data.hongbao.items[i]
										.dateline);
								};
								that.hongbaosShow = true;
							} else {
								that.hongbaosShow = false;
							};
							that.hongbaosInfo = res.data.hongbao;
						};
						if (page <= 1) {
							if (res.data.peicard.items.length > 0) {
								that.peicardShow = true;
							} else {
								that.peicardShow = false;
							};
							that.peicardInfo = res.data.peicard;
						};
					};
				});
			},

			//地址
			addr: function() {
				var that = this;
				qqmapsdk = new QQMapWX({
					key: config.data.key
				});
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: app.globalData._CFG.currentlat,
						longitude: app.globalData._CFG.currentlng
					},
					success: function(res) {
						that.currentaddr = res.result.address_component.street + res.result
							.address_component.street_number;
					},
					fail: function(res) {
						that.currentaddr = '手动定位';
					}
				});
			},
			getplace: function() {
				var that = this;
				uni.getLocation({
					//type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
					type: 'gcj02',
					//手机定位问题
					success(res) {
						app.globalData._CFG.lng = res.longitude;
						app.globalData._CFG.lat = res.latitude;
						app.globalData._CFG.currentlng = res.longitude;
						app.globalData._CFG.currentlat = res.latitude;
						app.globalData._CFG.isindexshow = true;
						that.isindexshow = app.globalData._CFG.isindexshow;
						that.refreshPage3389({});
					},
					fail(err) {
						that.whitebg = true;
						uni.showModal({
							title: '提示',
							content: '检测到您没有打开外卖的定位权限，是否去设置打开？',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting({
										success: res => {
											if (res.authSetting[
													"scope.userLocation"]) {
												app.globalData._CFG.isindexshow =
													true;
												that.isindexshow = app
													.globalData._CFG
													.isindexshow;
												that.refreshPage3389({});
											} else {
												app.globalData._CFG.isindexshow =
													false;
												that.isindexshow = app
													.globalData._CFG
													.isindexshow;
												that.refreshPage3389({});
											}
										}
									});
								} else if (res.cancel) {
									app.globalData._CFG.isindexshow = false;
									that.isindexshow = app.globalData._CFG.isindexshow;
									that.refreshPage3389({});
								}
							}
						});
					}
				});
			},
			tosearchaddr: function() {
				app.globalData.topage('/pages/position/searchaddr/search');
			},
			//跳转商家搜索
			tosearch: function() {
				app.globalData.topage('/pages/indexSearch/search');
			},
			tosearchshoplist: function(e) {
				app.globalData._CFG.title = e.currentTarget.dataset.tit;
				app.globalData.topage('/subPages/shop/searchshoplist/shoplist');

			},

			//头部下拉事件
			tapScreen(e) {
				if (!this.screenTabShow) {
					this.scrollTop = _h;
				};
				if (e.currentTarget.id != '' && this.screenTabIndex != e.currentTarget.id) {
					this.newscroTabIndex = e.currentTarget.id
					this.screenTabIndex = e.currentTarget.id
					this.screenTabShow = true //头部下拉是否出现
				} else {
					this.screenTabIndex = null
					this.screenTabShow = false //头部下拉是否出现
				}
			},

			//全部分类事件
			tapCates(e) {
				var catesIndex = e.currentTarget.dataset.index;
				this.catesIndex = catesIndex;

				if (e.currentTarget.dataset.index != 0) {} else {
					this.cateIndex = []
					this.screenTabIndex = null
					this.screenTabShow = false
					//头部下拉是否出现
					this.page = 1
					this.cateVal = this.allCates[catesIndex].title
					params.cate_id = this.allCates[catesIndex].cate_id
					this.initData(1);
				};
			},

			tapCate(e) {
				var cateIndex = [];
				cateIndex[this.catesIndex] = e.currentTarget.dataset.idx;
				this.cateIndex = cateIndex
				this.screenTabIndex = null
				this.screenTabShow = false
				//头部下拉是否出现
				this.page = 1
				this.cateVal = this.allCates[this.catesIndex].title
				params.cate_id = this.allCates[this.catesIndex].childrens[e.currentTarget.dataset.idx].cate_id;
				this.initData(1);
			},

			//排序事件
			tapPai(e) {
				this.paiIndex = e.currentTarget.dataset.idx
				this.screenTabIndex = null
				this.screenTabShow = false
				//头部下拉是否出现
				this.page = 1
				this.paiVal = this.pais[e.currentTarget.dataset.idx].title
				params.order = this.pais[e.currentTarget.dataset.idx].order;
				this.initData(1);
			},

			//筛选事件
			peiWay(e) {
				var idx = e.currentTarget.dataset.idx;
				this.peiWay_idx = idx;
				params.pei_filter = this.peiWays[idx].filter;
			},

			youhuiWay(e) {
				var idx = e.currentTarget.dataset.idx;
				this.youhuiWay_idx = idx;
				params.youhui_filter = this.youhuiWays[idx].filter;
			},

			featureWay(e) {
				var idx = e.currentTarget.dataset.idx;
				this.featureWay_idx = idx;
				params.feature_filter = this.featureWays[idx].filter;
			},

			clearScreen() {
				this.peiWay_idx = 0
				this.youhuiWay_idx = null
				this.featureWay_idx = null
				params.pei_filter = 0;
				params.youhui_filter = '';
				params.feature_filter = '';
			},

			confirmScreen() {
				this.screenTabIndex = null
				this.screenTabShow = false
				//头部下拉是否出现
				this.page = 1
				this.initData(1);
			},

			//遮罩层阻止冒泡事件
			catchtouchmove: function() {},

			//去商家详情
			gotoDetail(e) {
				var id = e.currentTarget.id;
				app.globalData._CFG.shoptail = id;
				app.globalData.topage('/subPages/shop/shoptail/shoptail?id=' + app.globalData._CFG.shoptail);
			},

			//商家列表活动折叠展开
			tapHd(e) {
				var hdShow = e.currentTarget.dataset.index;

				if (this.hdShow == hdShow) {
					this.hdShow = null;
				} else {
					this.hdShow = hdShow;
				}

				;
			},

			//导航菜单链接
			toCateLink(e) {
				var obj = JSON.parse(e.currentTarget.dataset.obj);
				var title = obj.title;
				var cate_id = obj.cate_id;
				var url = obj.wxlink;
				var idx = e.currentTarget.dataset.idx;

				app.globalData._CFG.cateid = obj.cate_id;
				app.globalData._CFG.title = '';
				if (obj.wxlink == '') {
					uni.showToast({
						title: "请设置小程序的" + title + "链接"
					});
				} else {
					var ss = url.indexOf('?');

					if (ss == -1) {
						var src = url + '?idx=' + idx + '&title=' + title;
					} else {
						var src = url + '&idx=' + idx + '&title=' + title;
					};

					if (url.indexOf('/qiang') != -1) {
						app.globalData.topage('/pages/outsideLink/qianggou/qianggou');
					} else if (url.indexOf('/paotui') != -1) {
						app.globalData.topage('/subPages/other/paotui/paotui');
					} else if (url.indexOf('/jifen') != -1) {
						app.globalData.topage('/subPages/other/integralMall/integralMall');
					} else {
						app.globalData.gopage(src);
					}
				}

				;
			},

			//首页模块跳转链接
			toWxLink(e) {
				var url = e.currentTarget.dataset.url;
				let type = e.currentTarget.dataset.type;

				if (url) {
					app.globalData.gopage(url);
				} else {
					if (type == 1) {
						uni.navigateToMiniProgram({
							appId: 'wx887a6fc1e95cd883',
							// 「境外游礼包」小程序AppId（必填）
							path: 'pages/onlineactpage/onlineactpage',
							// 「境外游礼包」小程序活动页面指定路径（必填）
							extraData: {
								backPath: '***' // 用于指定「境外游礼包」小程序返回商户小程序的页面路径（注意是商户小程序的页面路径）（非必填）
								// 如有需要还可以补充其他字段

							}
						});
					} else {
						uni.navigateToMiniProgram({
							appId: 'wx887a6fc1e95cd883',
							// 「境外游礼包」小程序AppId（必填）
							path: 'pages/Lunarpage/Lunarpage?areaCode=999',
							// 「境外游礼包」小程序活动页面指定路径（必填）
							extraData: {
								backPath: '***' // 用于指定「境外游礼包」小程序返回商户小程序的页面路径（注意是商户小程序的页面路径）（非必填）
								// 如有需要还可以补充其他字段

							}
						});
					}
				}
			},

			//转时间戳
			toDate: function(number) {
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
				var Mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
				var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D;
			},

			//关闭红包弹层
			sethongbaosShow() {
				this.hongbaosShow = false;
			},
			setpeicardShow() {
				this.peicardShow = false;
			},
			//领取红包
			getHongbao(e) {
				var that = this,
					type = e.currentTarget.dataset.type;
				if (type == "2") {
					uni.setStorage({
						key: "newHb",
						data: true,
						success: function(res) {}
					});
					app.globalData.afterCheckLogin(function() {
						that.https();
					});
				};
			},

			//授权
			closeSetting() {
				uni.pubOpenSetting(false);
			},

			refreshPage3389: function() {
				app.globalData.getcitylist({}, res => {
					if (res.error === '0') app.globalData.allcitylist = res.data.items;
				});

				var that = this;
				that.loading = true;
				uni.getStorage({
					key: 'currentAddr',
					success: function(res) {
						if (res.data) {
							app.globalData._CFG.lng = res.data.lng;
							app.globalData._CFG.lat = res.data.lat;
							app.globalData._CFG.isindexshow = true;
							that.currentaddr = res.data.addr
							that.currentaddr = res.data.addr
							that.isindexshow = app.globalData._CFG.isindexshow;
							that.https();
						} else {
							app.globalData.getLocation(function() {
								app.globalData._CFG.currentlng = app.globalData._CFG.lng;
								app.globalData._CFG.currentlat = app.globalData._CFG.lat;
								app.globalData._CFG.isindexshow = true;
								that.isindexshow = app.globalData._CFG.isindexshow; //定位接口

								app.globalData.addrdecode({
									"lng": app.globalData._CFG.lng,
									"lat": app.globalData._CFG.lat
								}, function(ret) {
									if (ret.error == 0) {
										that.currentaddr = ret.data.addr.addr;
										uni.setStorage({
											key: "fzCity",
											data: ret.data.addr.city
										});
									} else {
										that.currentaddr = "手动定位";
									}
								});
								that.https();
							});
						}
					},
					fail: function(err) {
						// 本地存储没有地址数据,需要重新获取定位
						app.globalData.getLocation(function() {
							app.globalData._CFG.currentlng = app.globalData._CFG.lng;
							app.globalData._CFG.currentlat = app.globalData._CFG.lat;
							app.globalData._CFG.isindexshow = true;
							that.isindexshow = app.globalData._CFG.isindexshow;

							// 确保经纬度存在后再调用地址解析接口
							if (app.globalData._CFG.lng && app.globalData._CFG.lat) {
								app.globalData.addrdecode({
									"lng": app.globalData._CFG.lng,
									"lat": app.globalData._CFG.lat
								}, function(ret) {
									if (ret.error == 0) {
										that.currentaddr = ret.data.addr.addr;
										uni.setStorage({
											key: "fzCity",
											data: ret.data.addr.city
										});
									} else {
										that.currentaddr = "手动定位";
									}
								});
							} else {
								that.currentaddr = "手动定位";
							}
							that.https();
						});
					}
				});
			},

			toYouhuiMore() {},
			isShowToast(showToast) {
				return showToast.isShow ? showToast.isShow : false
			}
		},

	};
</script>
<style>
	/* #ifdef MP-ALIPAY  */
	.setINput {
		height: 54rpx !important;
	}

	/* #endif */
	.bannerBg_box {
		position: relative;
		background: #ffffff;
	}

	.bannerBg_box .bannerBg_pic {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		left: 0;
		top: 0;
	}

	.topBg_box {
		position: relative;
		padding-bottom: 1rpx;
	}

	.topBg_box .topBg_pic {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		left: 0;
		top: 0;
	}

	.topBg_box .topBg_nr {
		position: relative;
		z-index: 1;
		background: #ffffff;
	}

	.grey_h {
		height: 20rpx;
		background: #f7f7f7;
		width: 100%;
	}

	.indexBg {
		position: absolute;
		z-index: 0;
		left: 0;
		top: -40rpx;
		width: 100%;
	}

	.WMhome {
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.WMhome .location {
		font-size: 36rpx;
		padding: 4rpx 20rpx 18rpx;
		max-width: 46%;
	}

	.WMhome .location .addr_ico {
		display: inline-block;
		width: 36rpx;
		height: 36rpx;
		vertical-align: middle;
		margin-right: 12rpx;
	}

	.WMhome .location .down_ico {
		display: inline-block;
		width: 20rpx;
		height: 16rpx;
		vertical-align: middle;
		margin-left: 12rpx;
	}

	.WMhome .location text {
		display: inline-block;
		max-width: calc(100% - 72rpx);
		height: 40rpx;
		line-height: 40rpx;
		vertical-align: middle;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 30rpx;
	}

	.WMhome .topState {
		overflow: hidden;
		padding-top: 16rpx;
		box-sizing: border-box;
	}

	.WMhome .weather {
		overflow: hidden;
		font-size: 40rpx;
		line-height: 48rpx;
		color: #666;
		float: right;
		height: 48rpx;
		background: rgba(255, 255, 255, 0.8);
		margin-right: 20rpx;
		border-radius: 34rpx;
		padding: 10rpx 30rpx;
	}

	.WMhome .weather .ico_weather {
		display: inline-block;
		width: 48rpx;
		height: 48rpx;
		vertical-align: bottom;
		margin-right: 12rpx;
	}

	.WMhome .weather .small {
		font-size: 18rpx;
		line-height: 24rpx;
	}

	.WMhome .right_search {
		text-align: center;
		width: 180rpx;
		height: 60rpx;
		border-radius: 60rpx;
		background: rgba(255, 255, 255, 0.8);
		margin-right: 20rpx;
	}

	.WMhome .right_search .ico_search {
		width: 22rpx;
		height: 22rpx;
		position: absolute;
		left: 24rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.WMhome .right_search .inp {
		box-sizing: border-box;
		width: 100%;
		height: 60rpx;
		border-radius: 60rpx;
		padding-left: 66rpx;
		position: relative;
	}

	.WMhome .right_search input {
		box-sizing: border-box;
		width: 100%;
		height: 60rpx;
		font-size: 28rpx;
		color: #999;
	}

	.WMhome .topBg_box .searchBox {
		margin: 24rpx 25rpx 24rpx;
	}

	.searchBox {
		margin: 20rpx;
		box-sizing: border-box;
		height: 66rpx;
		border-radius: 60rpx;
		background: #EFF1F4;
		padding-left: 84rpx;
		position: relative;
	}

	.searchBox .ico_search {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		left: 24rpx;
		top: 50%;
		transform: translate(0, -50%);
	}

	.searchBox input {
		width: 100%;
		height: 64rpx;
		font-size: 28rpx;
		color: #999;
	}

	.searchBox_fixed {
		position: fixed;
		z-index: 20;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		background: #fff;
	}

	.WMhome .searchWord {
		padding: 10rpx 0;
		margin: 0 20rpx;
		overflow-x: auto;
		overflow-y: hidden;
		height: 62rpx;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch
	}

	.WMhome .searchWord ul {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.WMhome .searchWord ul li {
		display: inline-block;
		font-size: 30rpx;
		color: #666;
		line-height: 40rpx;
		padding: 0 10rpx;
	}

	.WMhome .idxBanner {
		position: relative;
		z-index: 1;
		background: #FFFFFF;
	}

	.WMhome .idxBanner swiper {
		width: 750rpx;
		height: 288rpx !important;
		display: block;
	}

	.WMhome .idxBanner swiper image {
		width: 700rpx;
		height: 308rpx;
		display: block;
		border-radius: 4rpx;
		margin: 0 24rpx;
		border-radius: 24rpx;
	}

	.WMhome .cateNav {
		position: relative;
	}

	.WMhome .cateNav .cateNavBg_pic {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		left: 0;
		top: 0;
	}

	.WMhome .cateNav swiper {
		width: 100%;
		height: 150rpx !important;
		background: #FFFFFF;
		display: block;
		position: relative;
		z-index: 1;
		border-radius: 0px 0px 16rpx 16rpx;
	}

	.WMhome .cateNav ul {
		display: block;
		overflow: hidden;
	}

	.WMhome .cateNav.col5 ul li {
		text-align: center;
		float: left;
		width: 20%;
	}

	.WMhome .cateNav ul li {
		text-align: center;
		margin-top: 20rpx;
		float: left;
		width: 25%;
		display: block;
	}

	.WMhome .cateNav ul li image {
		width: 66rpx;
		height: 66rpx;
	}

	.WMhome .cateNav ul li .txt {
		font-size: 24rpx;
		line-height: 40rpx;
		color: #333;
		margin-top: 8rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.idxTitle {
		overflow: hidden;
	}

	.idxTitle image {
		width: 750rpx;
		height: 80rpx;
	}

	.idxTitle .tit {
		font-size: 32rpx;
		float: left;
		padding: 24rpx 0 24rpx 30rpx;
		font-weight: 500;
		color: #000;
		background: #ffffff;
		border-radius: 16rpx 16rpx 0px 0px;
		width: 750rpx;
	}

	.idxTitle .more {
		float: right;
		font-size: 28rpx;
		color: #666;
	}

	.idxTitle .right_ico {
		display: inline-block;
		width: 12rpx;
		height: 20rpx;
		margin-left: 8rpx;
	}

	.preferentialAarea ul li {
		position: relative;
		overflow: hidden;
		display: block;
	}

	.preferentialAarea image {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.preferentialAarea1 {
		overflow-y: hidden;
		overflow-x: auto;
		padding: 0 30rpx;
		-webkit-overflow-scrolling: touch
	}

	.preferentialAarea1 ul {
		display: block;
		white-space: nowrap;
	}

	.preferentialAarea1 ul li {
		display: inline-block;
		width: 228rpx;
		height: 304rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.preferentialAarea2 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea2 ul {
		overflow: hidden;
	}

	.preferentialAarea2 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 0 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea3 {
		overflow: hidden;
		padding: 0 26rpx;
	}

	.preferentialAarea3 ul li {
		width: 100%;
		height: 132rpx;
		overflow: hidden;
	}

	.preferentialAarea4 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea4 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 0 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea4 ul li:last-child {
		margin-top: 8rpx;
	}

	.preferentialAarea4 ul li:first-child {
		padding: calc(32% + 4rpx) 0;
	}

	.preferentialAarea5 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea5 ul {
		overflow: hidden;
	}

	.preferentialAarea5 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 4rpx 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea6 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea6 ul {
		overflow: hidden;
	}

	.preferentialAarea6 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 4rpx 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea6 ul li:first-child {
		width: calc(100% - 8rpx);
	}

	.preferentialAarea6 ul li:nth-child(3),
	.preferentialAarea6 ul li:nth-child(4) {
		width: calc(25% - 8rpx);
	}

	.preferentialAarea7 {
		overflow: hidden;
		padding: 0 16rpx;
	}

	.preferentialAarea7 ul {
		overflow: hidden;
	}

	.preferentialAarea7 ul li {
		float: left;
		width: calc(50% - 8rpx);
		margin: 4rpx 4rpx;
		height: 0;
		padding: 16% 0;
		overflow: hidden;
	}

	.preferentialAarea7 ul li:nth-child(3),
	.preferentialAarea7 ul li:nth-child(4),
	.preferentialAarea7 ul li:nth-child(5),
	.preferentialAarea7 ul li:nth-child(6) {
		width: calc(25% - 8rpx);
	}

	.largeSelection1 {
		overflow: hidden;
	}

	.largeSelection1 ul li {
		float: left;
		width: 33.33%;
		text-align: center;
		padding: 0 0 20rpx;
		display: block;
	}

	.largeSelection1 ul li .pic {
		width: 136rpx;
		height: 136rpx;
		border-radius: 100%;
		overflow: hidden;
		margin: 8rpx auto;
	}

	.largeSelection1 ul li .h3 {
		font-size: 30rpx;
		color: #333;
		line-height: 40rpx;
	}

	.largeSelection2 {
		overflow: hidden;
		padding: 0 20rpx;
	}

	.largeSelection2 ul {
		margin-top: -10rpx;
		display: block;
	}

	.largeSelection2 ul li {
		float: left;
		width: calc(50% - 20rpx);
		margin: 10rpx 10rpx;
		display: block;
	}

	.largeSelection2 ul li .pic {
		width: 100%;
		height: 251rpx;
		overflow: hidden;
	}

	.largeSelection2 ul li .logo_box {
		overflow: hidden;
		margin-top: -44rpx;
		padding: 0 20rpx;
	}

	.largeSelection2 ul li .logo {
		width: 88rpx;
		height: 88rpx;
		border-radius: 4rpx;
		background-color: #eee;
		overflow: hidden;
		float: left;
	}

	.largeSelection2 ul li .tit {
		font-size: 30rpx;
		color: #333;
		line-height: 40rpx;
		padding-top: 44rpx;
		margin-left: 100rpx;
	}

	.screenTab {
		background: #fff;
		padding: 8rpx 30rpx 20rpx;
		width: 690rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.screenTab .list {
		text-align: center;
		font-size: 26rpx;
		color: #A3A3A4;
	}

	.screenTab .list.on {
		color: #ee8080;
	}

	.screenTab .list .dwon_ico {
		display: inline-block;
		width: 24rpx;
		height: 24rpx;
		margin-left: 4rpx;
	}

	.screenTab .list .screen_ico {
		display: inline-block;
		width: 24rpx;
		height: 24rpx;
		margin-left: 4rpx;
	}

	.shopLists_h {
		min-height: calc(100% - 0rpx);
	}

	.WMhome_scroll {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
	}

	.screenTab_fixed {
		position: fixed;
		z-index: 19;
		left: 0;
		top: 0rpx;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		border-bottom: 2rpx solid #eee;
	}

	.screenTab_fixed ul {
		display: block;
	}

	.screenTab_fixed .screenTab {
		position: relative;
		z-index: 19;
	}

	.screenTab_fixed .change_list {
		position: absolute;
		z-index: 18;
		left: 0;
		right: 0;
		transform: translate(0, -100%);
		transition: all 0.2s ease-in-out;
	}

	.screenTab_fixed .change_list.on {
		transform: translate(0, 0);
	}

	.screenTab_fixed .allCates {
		background: #fff;
		overflow: hidden;
		display: flex;
		align-items: stretch;
		max-height: 760rpx;
	}

	.screenTab_fixed .allCates .left {
		background: #f8f8f8;
		width: 50%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		flex: 1;
		-webkit-overflow-scrolling: touch;
	}

	.screenTab_fixed .allCates .right {
		width: 50%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		flex: 1;
		-webkit-overflow-scrolling: touch;
	}

	.screenTab_fixed .allCates ul li {
		font-size: 14px;
		line-height: 96rpx;
		height: 96rpx;
		padding: 0 28rpx;
		color: #333;
		overflow: hidden;
		display: block;
	}

	.screenTab_fixed .allCates ul li .ico_check {
		position: absolute;
		right: 28rpx;
		top: 50%;
		transform: translate(0, -50%);
		width: 24rpx;
		height: 24rpx;
		display: none;
	}

	.screenTab_fixed .allCates ul li.on {
		color: #ff797c;
		background: #fff;
		position: relative;
	}

	.screenTab_fixed .allCates .right ul li.on .ico_check {
		display: block;
	}

	.screenTab_fixed .pais {
		background: #fff;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		max-height: 760rpx;
		-webkit-overflow-scrolling: touch;
	}

	.screenTab_fixed .pais ul li {
		font-size: 14px;
		line-height: 96rpx;
		height: 96rpx;
		padding: 0 28rpx;
		color: #333;
		overflow: hidden;
		display: block;
	}

	.screenTab_fixed .pais ul li .ico_check {
		position: absolute;
		right: 28rpx;
		top: 50%;
		transform: translate(0, -50%);
		width: 24rpx;
		height: 24rpx;
		display: none;
	}

	.screenTab_fixed .pais ul li.on {
		color: #ff797c;
		background: #fff;
		position: relative;
	}

	.screenTab_fixed .pais ul li.on .ico_check {
		display: block;
	}

	.screenTab_fixed .pais {
		background: #fff;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		max-height: 760rpx;
	}

	.screenTab_fixed .screen {
		background: #fff;
		position: relative;
	}

	.screenTab_fixed .screen .cont {
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		max-height: 760rpx;
		-webkit-overflow-scrolling: touch;
	}

	.screenTab_fixed .screen .tit {
		padding: 20rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #999;
	}

	.screenTab_fixed .screen ul {
		overflow: hidden;
		padding: 0 12rpx;
		display: block
	}

	.screenTab_fixed .screen ul li {
		float: left;
		width: calc(33.33% - 16rpx);
		margin: 8rpx 8rpx;
		background: #f8f8f8;
		border-radius: 8rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #666;
		display: block;
	}

	.screenTab_fixed .screen ul li.on {
		background: #E8F6E8;
		color: #ff797c;
	}

	.screenTab_fixed .screen .btn_box {
		position: relative;
		z-index: 1;
		height: 96rpx;
		background: #fff;
		text-align: center;
		overflow: hidden;
	}

	.screenTab_fixed .screen .btn_box .btn {
		line-height: 96rpx;
		font-size: 32rpx;
		color: 333;
		width: 50%;
		float: left;
		border-top: 2rpx solid #eee;
	}

	.screenTab_fixed .screen .btn_box .btn2 {
		border-top: 2rpx solid #ff797c;
		background: #ff797c;
		color: #fff;
	}

	/*白布&登录&无数据&加载*/
	.nologin {
		text-align: center;
		position: absolute;
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

	.load-img {
		position: absolute;
		z-index: 1000;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		line-height: 0;
		width: 190rpx;
		height: 190rpx;
		text-align: center;
		background: rgba(0, 0, 0, .8);
		vertical-align: middle;
		opacity: .5;
	}

	.load-img image {
		width: 100rpx;
		height: 100rpx;
		margin-top: 45rpx;
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
		top: 50%;
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

	.none-cont {
		color: #666;
		text-align: center;
		padding-top: 80rpx;
		box-sizing: border-box;
	}

	.none-cont .main image {
		width: 200rpx;
		height: 200rpx
	}

	/* .shopCar{position: fixed;right:10rpx;bottom:20%;z-index: 999;width:96rpx;height:96rpx ;}
.shopCar image{width:100%;height: 100%;} */

	.idxHongbao_mask {
		position: fixed;
		left: 0;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		width: 100%;
		height: 100%;
		z-index: 100;
		background: rgba(0, 0, 0, 0.6);
	}

	.idxHongbao_cont {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 85%;
		transform: translate(-50%, -50%);
	}

	.idxHongbao_cont .cont {
		padding: 0 0rpx 2rpx;
		border-radius: 40rpx;
		overflow: hidden;
	}

	.idxHongbao_cont .btn {
		font-size: 32rpx;
		text-align: center;
		line-height: 88rpx;
		color: #f0021d;
		background-color: #faeb31;
		border-radius: 80rpx;
		box-shadow: 0 6rpx 0 0 #e4b103;
		margin: 0 auto;
		width: 74%;
		font-weight: bold;
		margin-top: 36rpx;
	}

	.idxHongbao_cont ul {
		max-height: 400rpx;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		display: block;
		padding: 16rpx 20rpx 2rpx;
	}

	.idxHongbao_cont ul li {
		display: block;
		border-radius: 12rpx;
		position: relative;
		margin: 16rpx 0;
	}

	.idxHongbao_cont ul li .bg {
		width: 100%;
		height: auto;
		min-height: 144rpx;
	}

	.idxHongbao_cont ul li .box {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.idxHongbao_cont ul li .price {
		width: 180rpx;
		text-align: center;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translate(0, -50%);
		font-size: 72rpx;
		color: #e13337;
	}

	.idxHongbao_cont .price small {
		font-size: 28rpx;
	}

	.idxHongbao_cont ul li .txt_box {
		margin-left: 180rpx;
		position: relative;
		padding: 4rpx 20rpx 0;
	}

	.idxHongbao_cont ul li .txt_box .h3 {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #E13337;
		display: block;
	}

	.idxHongbao_cont ul li .txt_box p {
		display: block;
		font-size: 20rpx;
	}

	.idxHongbao_cont .txt_box small {
		font-size: 20rpx;
		line-height: 40rpx;
		color: #666;
	}

	.idxHongbao_cont .close {
		position: absolute;
		right: -20rpx;
		top: -100rpx;
		transform: translate(-50%, 0);
		width: 54rpx;
		height: 132rpx;
	}

	/* 商家卡片列表样式 */
	.shop_card_list {
		padding: 0 25rpx;
		background: #fff;
	}

	.shop_card {
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
	}

	.shop_card.close {
		opacity: 0.7;
	}

	/* 商家封面图 */
	.card_cover {
		position: relative;
		width: 700rpx;
		height: 308rpx;
		overflow: hidden;
	}

	.cover_img {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 24rpx;
	}

	.new_tag {
		position: absolute;
		left: 0rpx;
		top: 0rpx;
		width: 80rpx;
		height: 80rpx;
		z-index: 2;
	}

	.closed_mask {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
		border-radius: 24rpx;
	}

	.closed_text {
		font-size: 48rpx;
		color: #FFFFFF;
		font-weight: bold;
	}

	/* 商家信息 */
	.card_info {
		padding: 20rpx 24rpx;
	}

	.shop_header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12rpx;
	}

	.shop_name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 16rpx;
	}

	.rating_score {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666666;
	}

	.score_icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 8rpx;
	}

	.score_text {
		font-weight: 600;
		color: #333333;
	}

	.delivery_time {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #999999;
	}

	.time_icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 6rpx;
	}
</style>