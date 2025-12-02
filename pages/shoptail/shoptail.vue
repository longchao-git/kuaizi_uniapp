<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束 -->

		<!-- 用户点击手势调用授权设置：使用全局 AuthSettingDialog 组件 -->
		<AuthSettingDialog :show="OpenSettingShow" :openType="OpenSettingType" @cancel="closeSetting"
			@confirm="closeSetting" />

		<!-- #ifdef MP-WEIXIN || H5-->
		<view
			:style="'width:750rpx;height:' + sysinfo.statusBarHeight + 'px;background-color:#F5F7FA;position: fixed;top: 0;left: 0;right: 0;z-index: 100;'">
		</view>
		<view class="cunav" :style="'top:' + sysinfo.statusBarHeight + 'px'">

			<view class="cunav_back" @tap="backpages">
				<image src="/static/image/icon_back.png"></image>
			</view>

			<!-- #ifdef MP-WEIXIN  -->
			<view class="cunav_setup" :style="'top:' + (sysinfo.statusBarHeight+44) + 'px;'" @click="shareWayMaskShow">
				点击分享好友
				<view class="cunav_view"></view>
			</view>
			<!-- #endif -->
		</view>
		<view :style="'width:750rpx;height:' + (sysinfo.statusBarHeight+44) + 'px;background-color:#F5F7FA;'"></view>
		<!-- #endif -->

		<!-- #ifdef MP-ALIPAY -->
		<!-- <view class="cunav">

			<view class="cunav_setup">
				点击分享好友
				<view class="cunav_view"></view>

			</view>
		</view> -->
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN || MP-ALIPAY  -->
		<view style="width:750rpx;height:86rpx;background-color:#F5F7FA;"></view>
		<!-- #endif -->
		<!-- 顶部基本信息-开始 -->
		<view class="topInfo">
			<view class="info">
				<view class="img fl">
					<image :src="topInfo.logo" mode="aspectFill"></image>
					<!-- <view class='state {{topInfo.yy_status == "1" && topInfo.yysj_status == "1" ? "state1" : "state2"}}'>
                <block wx:if="{{topInfo.yy_status == '1' && topInfo.yysj_status == '1'}}">
                    营业中
                </block>
                <block wx:else>打烊了</block>
            </view> -->
				</view>
				<view class="wz_box">
					<view class="tit overflow_clear">

						<text class="newbeyond">{{topInfo.title}}</text>
						<view
							:class="'state_new ' + (topInfo.yy_status == '1' && topInfo.yysj_status == '1' ? 'state_new1' : 'state_new2')">
							<block v-if="topInfo.yy_status == '1' && topInfo.yysj_status == '1'">
								营业中
							</block>
							<block v-else>打烊了</block>
						</view>
						<image src="/static/image/serch_ico2.png" class="search" @tap="toshopsearch"></image>
						<image v-if='topInfo.collect==0' src="/static/image/index_btn_collect_no3x.png" class="collect"
							@tap="collect"></image>
						<image v-if='topInfo.collect==1' src="/static/image/settion_icon.png" class="collect"
							@tap="collect"></image>
					</view>

					<!-- 	<view class="open_state" v-if="topInfo.tips_label != ''" >
						<text>{{topInfo.tips_label}}</text>
					</view> -->
					<view class="notice beyond" @tap="setnoticeshow">
						公告：
						<block v-if="topInfo.delcare.length > 0">{{topInfo.delcare}}</block>
						<block v-else>用餐高峰请提前下单，O(∩_∩)O谢谢！！</block>
					</view>
					<view class="txt setuplists" style="margin-top:15rpx;">
						<view class="sending_off">起送€{{topInfo.min_amount}}</view>
						<view class="cudeliveryfee">
							<block v-if="topInfo.freight == 0">免配送费</block>
							<block v-else-if="topInfo.is_reduce_pei == 1">
								配送费{{topInfo.reduceEd_freight}}起
								<text class="del">€{{topInfo.freight}}</text>
							</block>
							<block v-else>配送€{{topInfo.freight}}</block>
						</view>
						<!-- <text style="font-size: 24rpx;color: #262628;">{{topInfo.pei_time}}分钟</text> -->
					</view>
				</view>
			</view>
			<view class="hd" @tap="setnoticeshow">
				<block v-if="topInfo.huodong.length > 0">
					<view class="fr more">查看更多></view>
					<view v-for="(hdList, index) in topInfo.huodong" :key="index" class="wz overflow_clear"
						v-if="index < 1">
						<i class="ico" :style="'background:#' + hdList.color">{{hdList.word}}</i>
						{{hdList.title}}
					</view>
				</block>
				<block v-else>
					<view class="wz overflow_clear">暂无活动</view>
				</block>
			</view>
			<!-- <image src='{{topInfo.collect == "0" ? "../../image/index_btn_collect_no3x.png" : "../../image/index_btn_collect_yes3x.png"}}' class='collect' bindtap='collect'></image> -->
			<!-- <image src='../../image/icon_share3x.png' class='share' bindtap='shareWayMaskShow'></image> -->
			<!-- <image src='../../image/serch_ico2.png' class='search' bindtap='toshopsearch'></image> -->
		</view>
		<!-- 顶部基本信息-结束 -->
		<!-- tab-开始 -->
		<view class="tabBox">
			<view :class="'list ' + (tabIndex == 0 ? 'on' : '')" @tap="settabIndex" data-idx="0">菜单</view>
			<view :class="'list ' + (tabIndex == 1 ? 'on' : '')" @tap="settabIndex" data-idx="1">点评</view>
			<view :class="'list ' + (tabIndex == 2 ? 'on' : '')" @tap="settabIndex" data-idx="2">商家信息</view>
		</view>
		<!-- tab-结束 -->
		<!-- 菜单-开始 -->
		<block v-if="tabIndex == 0">
			<view class="goodsListBox"
				:style="'padding-bottom:' + ((couTips.length > 0) ? '204rpx' : '140rpx') + '; overflow: visible;'">
				<view
					:style="'height:100%; position:relative; ' + (specShow_idx != null || tcHideIdx != null ? 'overflow: visible; z-index:12;' : 'z-index:1;')">
					<!-- 店铺招牌-开始 -->
					<view class="recommend" id="recommend"
						:style="tcHideIdx != null && specShow_tj ? 'position:relative; overflow: visible; z-index:13;' : ''"
						v-if="tj_items != '' && tj_items.products.length > 0">
						<view class="bt">{{tj_items.title}}</view>
						<scroll-view :scroll-x="specShow_idx != null || tcHideIdx != null ? false : true"
							class="list_box">
							<view v-for="(proList, index) in tj_items.products" :key="index" class="lists"
								style="overflow: visible;" @tap.stop="shutDown" data-tj="1"
								:data-product_id="proList.product_id">
								<image :src="proList.photo" mode="aspectFill" class="pic"></image>
								<view class="banck_div"></view>
								<view class="title overflow_clear">{{proList.title}}</view>
								<view class="price">
									<text class="small">€</text>
									{{proList.price}}
								</view>
								<!-- 加减框开始 -->
								<view class="goods_int_box"
									v-if="proList.specs.length == 0 && proList.specification.length == 0">
									<image src="/static/image/icon_remove_new.png" class="jian" v-if="proList.num != 0"
										@tap.stop="reduceCart" :data-sku_id="proList.sku_id" :data-sku_obj="proList"
										:data-skuadx="idx" :data-skubdx="index"></image>
									<view class="num" v-if="proList.num != 0">{{proList.num}}</view>
									<image src="/static/image/icon_add_new.png" class="jia" @tap.stop="addCart"
										:data-sku_id="proList.sku_id" :data-sku_obj="proList" :data-skuadx="idx"
										:data-skubdx="index"></image>
									<view class="clear"></view>
								</view>
								<!-- 加减框结束 -->
								<!-- 选规格-开始 -->
								<view class="spec serg_btn" @tap.stop="setspecShow" data-tj="1"
									:data-product_id="proList.product_id" :data-products="proList" v-else>
									可选规格
									<view class="num" v-if="proList.num > 0">{{proList.num}}</view>
								</view>
								<view class="specMask" @tap.stop="maopao"
									:hidden="specShow_idx == proList.product_id && specShow_tj ? false : true"
									:style="'width:' + (scrollWidth*0.8) + 'px'">
									<image src="/static/image/index_btn_close2x.png" class="close"
										@tap.stop="setspecShow"></image>
									<view class="tit">{{proList.title}}</view>
									<view class="discount" v-if="proList.is_discount == '1'">
										<view class="fl zhe">
											<text class="one">{{proList.disclabel}}</text>
											<text class="two">{{proList.quotalabel}}</text>
										</view>
										<view class="fl shu" v-if="proList.quotalabel != '不限购'">
											剩余{{proList.quota}}份
										</view>
									</view>
									<view class="cont">
										<view class="spec_bt" v-if="proList.specs.length > 0">规格</view>
										<view class="spec_list">
											<view v-for="(items, specs_idx) in proList.specs" :key="specs_idx"
												:class="'list ' + (specsIdx == specs_idx ? 'on' : '')"
												@tap.stop="specsOpt" :data-specs_idx="specs_idx"
												:data-products="proList">
												{{items.spec_name}}
											</view>
										</view>
										<view class="attr" v-if="proList.specification.length > 0">
											<block v-for="(items, specification_idx) in proList.specification"
												:key="specification_idx">
												<view class="bt">{{items.key}}
													<block v-if="items.price&&items.price>0">/{{items.price}}€</block>
												</view>
												<view class="spec_list">
													<view v-for="(itemss, index) in items.val" :key="index"
														:class="'list ' + (index == specsK[specification_idx] ? 'on' : '')"
														@tap.stop="setspecsK" :data-idx="index"
														:data-specification_idx="specification_idx"
														:data-products="proList">
														{{itemss}}
													</view>
												</view>
											</block>
										</view>
									</view>
									<view class="bottom">
										<view class="price fl">
											<text>€</text>
											<block v-if="proList.specs.length > 0">
												{{newToptoMroey?newToptoMroey:proList.specs[specsIdx].price}}
											</block>
											<block v-else>{{newToptoMroey?newToptoMroey:proList.price}}</block>
										</view>
										<!-- 加减框开始 -->
										<view class="goods_int_box fr">
											<image src="/static/image/icon_remove_new.png" class="jian"
												v-if="newSpecs.num != 0" @tap.stop="reduceCart"
												:data-sku_id="newSpecs.sku_id" :data-sku_obj="newSpecs"
												:data-skuadx="idx" :data-skubdx="index"></image>
											<view class="num" v-if="newSpecs.num != 0">
												{{newSpecs.num}}
											</view>
											<image src="/static/image/icon_add_new.png" class="jia" @tap.stop="addCart"
												:data-sku_id="newSpecs.sku_id" :data-sku_obj="newSpecs"
												:data-skuadx="idx" :data-skubdx="index"></image>
											<view class="clear"></view>
										</view>
										<!-- 加减框结束 -->
									</view>
								</view>
								<view class="mask_bg" @tap.stop="maopao"
									:hidden="specShow_idx == proList.product_id && specShow_tj ? false : true"
									:style="'z-index:' + (specShow ? 20 : 9) + ';'"></view>
								<!-- 选规格-结束 -->
								<!-- 商品详情-开始 -->
								<view class="gdsDetails_mask"
									:hidden="tcHideIdx == proList.product_id && specShow_tj ? false : true"
									@tap.stop="shutDown">
									<view class="gdsDetails_maskOut">
										<view class="gdsDetails_maskIn">
											<view class="goodsDetails">
												<image class="goodsDetailsImg" mode="aspectFill" :src="proList.photo">
												</image>
												<view class="shopName">{{proList.title}}</view>
												<!-- 已售{{proList.sales}} -->
												<view class="shopSales"></view>
												<view class="goodsDetailsFoot">
													<view class="shopPrice">
														<text>€</text>
														{{proList.price}}
														<text>/{{proList.unit}}</text>
														<text class="del ml5" v-if="proList.is_discount == '1'">
															{{proList.oldprice}}/{{proList.unit}}
														</text>
													</view>
													<view class="fr">
														<!-- 加减框开始 -->
														<view class="goods_int_box"
															v-if="proList.specs.length == 0 && proList.specification.length == 0">
															<image src="/static/image/icon_remove_new.png" class="jian"
																v-if="proList.num != 0" @tap.stop="reduceCart"
																:data-sku_id="proList.sku_id" :data-sku_obj="proList"
																:data-skuadx="idx" :data-skubdx="index"></image>
															<view class="num" v-if="proList.num != 0">
																{{proList.num}}
															</view>
															<image src="/static/image/icon_add_new.png" class="jia"
																@tap.stop="addCart" :data-sku_id="proList.sku_id"
																:data-sku_obj="proList" :data-skuadx="idx"
																:data-skubdx="index"></image>
															<view class="clear"></view>
														</view>
														<!-- 加减框结束 -->
														<!-- 选规格-开始 -->
														<view class="spec serg_btn" @tap.stop="setspecShow" data-tj="1"
															:data-product_id="proList.product_id"
															:data-products="proList" v-else>
															可选规格
															<view class="num" v-if="proList.num > 0">
																{{proList.num}}
															</view>
														</view>
														<view class="specMask"
															:hidden="specShow_idx == proList.product_id && specShow_tj ? false : true"
															:style="'width:' + (scrollWidth*0.8) + 'px'">
															<image src="/static/image/index_btn_close2x.png"
																class="close" @tap.stop="setspecShow"></image>
															<view class="tit">{{proList.title}}</view>
															<view class="discount" v-if="proList.is_discount == '1'">
																<view class="fl zhe">
																	<text class="one">
																		{{proList.disclabel}}
																	</text>
																	<text class="two">
																		{{proList.quotalabel}}
																	</text>
																</view>
																<view class="fl shu" v-if="proList.quotalabel != '不限购'">
																	剩余{{proList.quota}}份
																</view>
															</view>
															<view class="cont">
																<view class="spec_bt" v-if="proList.specs.length > 0">
																	规格
																</view>
																<view class="spec_list">
																	<view v-for="(items, specs_idx) in proList.specs"
																		:key="specs_idx"
																		:class="'list ' + (specsIdx == specs_idx ? 'on' : '')"
																		@tap.stop="specsOpt" :data-specs_idx="specs_idx"
																		:data-products="proList">
																		{{items.spec_name}}
																	</view>
																</view>
																<view class="attr"
																	v-if="proList.specification.length > 0">
																	<block
																		v-for="(items, specification_idx) in proList.specification"
																		:key="specification_idx">
																		<view class="bt">{{items.key}}
																			<block v-if="items.price&&items.price>0">
																				/{{items.price}}€</block>
																		</view>
																		<view class="spec_list">
																			<view v-for="(itemss, index) in items.val"
																				:key="index"
																				:class="'list ' + (index == specsK[specification_idx] ? 'on' : '')"
																				@tap.stop="setspecsK" :data-idx="index"
																				:data-specification_idx="specification_idx"
																				:data-products="proList">
																				{{itemss}}
																			</view>
																		</view>
																	</block>
																</view>
															</view>
															<view class="bottom">
																<view class="price fl">
																	<text>€</text>
																	<block v-if="proList.specs.length > 0">
																		{{newToptoMroey?newToptoMroey:proList.specs[specsIdx].price}}
																	</block>
																	<block v-else>
																		{{newToptoMroey?newToptoMroey:proList.price}}
																	</block>
																</view>
																<!-- 加减框开始 -->
																<view class="goods_int_box fr">
																	<image src="/static/image/icon_remove_new.png"
																		class="jian" v-if="newSpecs.num != 0"
																		@tap.stop="reduceCart"
																		:data-sku_id="newSpecs.sku_id"
																		:data-sku_obj="newSpecs" :data-skuadx="idx"
																		:data-skubdx="index"></image>
																	<view class="num" v-if="newSpecs.num != 0">
																		{{newSpecs.num}}
																	</view>
																	<image src="/static/image/icon_add_new.png"
																		class="jia" @tap.stop="addCart"
																		:data-sku_id="newSpecs.sku_id"
																		:data-sku_obj="newSpecs" :data-skuadx="idx"
																		:data-skubdx="index"></image>
																	<view class="clear"></view>
																</view>
																<!-- 加减框结束 -->
															</view>
														</view>
														<view class="mask_bg"
															:hidden="specShow_idx == proList.product_id && specShow_tj ? false : true"
															:style="'z-index:' + (specShow ? 20 : 9) + ';'"></view>
														<!-- 选规格-结束 -->
													</view>
													<view class="clear"></view>
												</view>
											</view>
											<image src="/static/image/btn_close3x.png" class="shutDown"
												@tap.stop="shutDown"></image>
										</view>
									</view>
								</view>
								<!-- 商品详情-结束 -->
							</view>
							<view class="clear"></view>
						</scroll-view>
					</view>
					<!-- 店铺招牌-结束 -->
					<view class="is_texitea">全部菜品</view>
					<!-- 商品分类-开始 -->
					<scroll-view :scroll-y="true" class="goodsCate"
						:scroll-into-view="'tab_list_index_id_'+tab_list_index_id">
						<view v-for="(items, index) in goodsCate" :key="index"
							:class="'list ' + (items.cate_id == goodsCate_idx ? 'on' : '')" @tap="cateTap"
							:data-cate_id="items.cate_id" :data-index="index" :id="'tab_list_index_id_'+index">
							<image v-if="items.cate_id == 'hot'" class="ico" src="/static/image/icon_hot3x.png"></image>
							<image v-if="items.cate_id == 'must'" class="ico" src="/static/image/icon_need3x.png">
							</image>
							{{items.title}}
							<view class="num" v-if="items.pcate_num && items.pcate_num > 0">
								{{items.pcate_num}}
							</view>
						</view>
					</scroll-view>
					<!-- 商品分类-结束 -->
					<!-- 商品列表-开始 -->
					<scroll-view class="goodsList_right"
						:scroll-y="specShow_idx != null || tcHideIdx != null ? false : true"
						:style="specShow_idx != null ? 'overflow: visible; z-index:12;' : ''"
						@scrolltolower="bindtolower" @scroll="bindscrollIn"
						:scroll-into-view="'good_list_index_id_'+good_list_index_id">
						<!-- 领取优惠券-开始 -->
						<view class="shopCoupon pub_list" v-if="shopCoupon.coupon_amount > 0">
							<view class="price">
								€
								<text class="big">{{shopCoupon.coupon_amount}}</text>
							</view>
							<view class="pub_list_bd">
								<view class="bt">商家优惠券</view>
								<view class="txt">{{shopCoupon.title}}</view>
							</view>
							<view class="btn" @tap="toGetCoupon">立即领券</view>
						</view>
						<!-- 领取优惠券-结束 -->
						<!-- 广告-开始 -->
						<view class="shopAdv">
							<image v-for="(items, index) in shopAdv" :key="index" mode="aspectFill" :src="items.photo"
								@tap="toShopAdv" :data-obj="items"></image>
						</view>
						<!-- 广告-结束 -->
						<!-- goodsList -->
						<view v-for="(item, idx) in goodsArr" :key="idx" class="list_box goods_item_height"
							v-if="idx<=has_index" :id="'list_' + idx" style="overflow: visible;">
							<view class="cateTit" :id="'good_list_index_id_'+idx">{{item.title}}</view>
							<view v-for="(proList, index) in item.products" :key="index" class="goodsList"
								style="overflow: visible;" @tap.stop="shutDown" :data-product_id="proList.product_id">
								<image :src="proList.photo" class="img fl" mode="aspectFill"></image>
								<view class="wz_box">
									<view style="min-height:140rpx;">
										<view class="tit">{{proList.title}}</view>
										<view class="discount" v-if="proList.is_discount == '1'">
											<view class="fl zhe">
												<text class="one">{{proList.disclabel}}</text>
												<text class="two">{{proList.quotalabel}}</text>
											</view>
											<view class="fl shu" v-if="proList.quotalabel != '不限购'">
												剩余{{proList.quota}}份
											</view>
										</view>
										<!-- <view class="txt overflow_clear">{{proList.intro}}</view> -->
										<block v-if="topInfo.sold_count_switch==1">已售{{proList.sales}}</block>
										<text class="txt"
											v-if="topInfo.sold_count_switch==1">赞{{proList.good?proList.good:'0'}}</text>
									</view>
									<view class="price">
										<text>€</text>
										{{proList.price}}
										<text>/ {{proList.unit}}</text>
										<text class="del ml5" v-if="proList.is_discount == '1'">
											{{proList.oldprice}}/{{proList.unit}}
										</text>
									</view>
								</view>
								<!-- 加减框开始 -->
								<view class="goods_int_box"
									v-if="proList.specs.length == 0 && proList.specification.length == 0&&proList.sale_sku>0">
									<image src="/static/image/icon_remove_new.png" class="jian" v-if="proList.num != 0"
										@tap.stop="reduceCart" :data-sku_id="proList.sku_id" :data-sku_obj="proList"
										:data-skuadx="idx" :data-skubdx="index"></image>
									<view class="num" v-if="proList.num != 0">{{proList.num}}</view>
									<image src="/static/image/icon_add_new.png" class="jia" @tap.stop="addCart"
										:data-sku_id="proList.sku_id" :data-sku_obj="proList" :data-skuadx="idx"
										:data-skubdx="index"></image>
									<view class="clear"></view>
								</view>
								<!-- 加减框结束 -->
								<view class="spec serg_btnss" v-else-if="proList.sale_sku<=0">已售罄</view>
								<!-- 选规格-开始 -->
								<view class="spec serg_btn" @tap.stop="setspecShow"
									:data-product_id="proList.product_id" :data-products="proList" v-else>
									可选规格
									<view class="num" v-if="proList.num > 0">{{proList.num}}</view>
								</view>
								<view class="specMask"
									:hidden="specShow_idx == proList.product_id && !specShow_tj ? false : true"
									:style="'width:' + (scrollWidth*0.8) + 'px'" @tap.stop="maopao">
									<image src="/static/image/index_btn_close2x.png" class="close"
										@tap.stop="setspecShow"></image>
									<view class="tit">{{proList.title}}</view>
									<view class="discount" v-if="proList.is_discount == '1'">
										<view class="fl zhe">
											<text class="one">{{proList.disclabel}}</text>
											<text class="two">{{proList.quotalabel}}</text>
										</view>
										<view class="fl shu" v-if="proList.quotalabel != '不限购'">
											剩余{{proList.quota}}份
										</view>
									</view>
									<view class="cont">
										<view class="spec_bt" v-if="proList.specs.length > 0">规格</view>
										<view class="spec_list">
											<view v-for="(items, specs_idx) in proList.specs" :key="specs_idx"
												:class="'list ' + (specsIdx == specs_idx ? 'on' : '')"
												@tap.stop="specsOpt" :data-specs_idx="specs_idx"
												:data-products="proList">
												{{items.spec_name}}
											</view>
										</view>
										<view class="attr" v-if="proList.specification.length > 0">
											<block v-for="(items, specification_idx) in proList.specification"
												:key="specification_idx">
												<view class="bt">{{items.key}}
													<block v-if="items.price&&items.price>0">/{{items.price}}€</block>
												</view>
												<view class="spec_list">
													<view v-for="(itemss, index) in items.val" :key="index"
														:class="'list ' + (index == specsK[specification_idx] ? 'on' : '')"
														@tap.stop="setspecsK" :data-idx="index"
														:data-specification_idx="specification_idx"
														:data-products="proList">
														{{itemss}}
													</view>
												</view>
											</block>
										</view>
									</view>
									<view class="bottom">
										<view class="price fl">
											<text>€</text>
											<block v-if="proList.specs.length > 0">
												{{newToptoMroey?newToptoMroey:proList.specs[specsIdx].price}}
											</block>
											<block v-else>{{newToptoMroey?newToptoMroey:proList.price}}</block>
										</view>
										<!-- 加减框开始 -->
										<view class="goods_int_box fr">
											<image src="/static/image/icon_remove_new.png" class="jian"
												v-if="newSpecs.num != 0" @tap="reduceCart"
												:data-sku_id="newSpecs.sku_id" :data-sku_obj="newSpecs"
												:data-skuadx="idx" :data-skubdx="index"></image>
											<view class="num" v-if="newSpecs.num != 0">
												{{newSpecs.num}}
											</view>
											<image src="/static/image/icon_add_new.png" class="jia" @tap.stop="addCart"
												:data-sku_id="newSpecs.sku_id" :data-sku_obj="newSpecs"
												:data-skuadx="idx" :data-skubdx="index"></image>
											<view class="clear"></view>
										</view>
										<!-- 加减框结束 -->
									</view>
								</view>
								<view class="mask_bg"
									:hidden="specShow_idx == proList.product_id && !specShow_tj ? false : true"
									:style="'z-index:' + (specShow ? 20 : 9) + ';'" @tap.stop="maopao"></view>
								<!-- 选规格-结束 -->
								<!-- 商品详情-开始 -->
								<view class="gdsDetails_mask"
									:hidden="tcHideIdx == proList.product_id && !specShow_tj ? false : true"
									@tap.stop="shutDown">
									<view class="gdsDetails_maskOut">
										<view class="gdsDetails_maskIn">
											<view class="goodsDetails">
												<image class="goodsDetailsImg" mode="aspectFill" :src="proList.photo">
												</image>
												<view class="shopName">{{proList.title}}</view>
												<view class="shopSales" v-if="topInfo.sold_count_switch==1">
													已售{{proList.sales}}</view>
												<view class="goodsDetailsFoot">
													<view class="shopPrice">
														<text>€</text>
														{{proList.price}}
														<text>/{{proList.unit}}</text>
														<text class="del ml5" v-if="proList.is_discount == '1'">
															{{proList.oldprice}}/{{proList.unit}}
														</text>
													</view>
													<view class="fr">
														<!-- 加减框开始 -->
														<view class="goods_int_box"
															v-if="proList.specs.length == 0 && proList.specification.length == 0">
															<image src="/static/image/icon_remove_new.png" class="jian"
																v-if="proList.num != 0" @tap.stop="reduceCart"
																:data-sku_id="proList.sku_id" :data-sku_obj="proList"
																:data-skuadx="idx" :data-skubdx="index"></image>
															<view class="num" v-if="proList.num != 0">
																{{proList.num}}
															</view>
															<image src="/static/image/icon_add_new.png" class="jia"
																@tap.stop="addCart" :data-sku_id="proList.sku_id"
																:data-sku_obj="proList" :data-skuadx="idx"
																:data-skubdx="index"></image>
															<view class="clear"></view>
														</view>
														<!-- 加减框结束 -->
														<view class="spec serg_btn" @tap.stop="setspecShow"
															:data-product_id="proList.product_id"
															:data-products="proList" v-else>
															可选规格
															<view class="num" v-if="proList.num > 0">
																{{proList.num}}
															</view>
														</view>
													</view>
													<view class="clear"></view>
												</view>
											</view>
											<image src="/static/image/btn_close3x.png" class="shutDown"
												@tap.stop="shutDown"></image>
										</view>
									</view>
								</view>
								<!-- 商品详情-结束 -->
							</view>
						</view>
						<view style="height: 150rpx;">

						</view>
					</scroll-view>
					<!-- 商品列表-结束 -->
				</view>
			</view>
			<!-- 底部购物车-开始 -->
			<view class="goods_footer">
				<view class="goods_footer_s">
					<view style="display:flex;align-items:center;">

						<view class="cart fl" v-if="total_num > 0" @click="setcartShow">
							<!-- <image src="/static/image/index_btn_cart3x.png"></image> -->
							<view class="num">{{total_num}}</view>

						</view>
						<view class="cart fl" v-else @click="setcartShow">
							<image src="/static/image/index_btn_cart3x.png"></image>
						</view>

						<!-- <view class="goods_footer_s_num" wx:if="{{total_num > 0}}" bindtap="cartShow">
					<image src="../../image/index_btn_cart3x.png"></image>
					{{total_num}}
				</view>
				<view class="goods_footer_s_num" wx:if="{{!total_num|| total_num<= 0}}"></view> -->
						<view class="goods_footer_s_ti">
							<view class="goods_footer_s_ti1">
								€{{totalPrice}}
								<!-- <span wx:if="{{total_oldprice > 0 && total_oldprice > totalPrice}}">
							€{{total_oldprice}}
						</span> -->
							</view>
							<view class="goods_footer_s_ti2">配送费以订单为准</view>
						</view>
					</view>
					<block>
						<!-- 打样状态按钮 -->
						<view class="goods_footer_s_btn goods_footer_s_btn_op goods_footer_s_btn_disabled"
							v-if="topInfo.yy_status == '0' || topInfo.yysj_status == '0'">
							打样了
						</view>
						<!-- 正常状态按钮 -->
						<block v-else>
							<view class="goods_footer_s_btn goods_footer_s_btn_op" v-if="priceDif > 0">
								<block v-if="totalPrice!=0">差</block>{{priceDif}}起送
							</view>
							<view class="goods_footer_s_btn goods_footer_s_btn_op"
								v-else-if="have_must == false && is_must != '0'" @tap="cateTap" data-cate_id="must">
								请添加必点商品
							</view>
							<view class="goods_footer_s_btn" v-else-if="total_num > 0" @tap="linkOrdersubmit">
								立即购买
							</view>
							<view class="goods_footer_s_btn goods_footer_s_btn_op" v-else>请选择商品</view>
						</block>

					</block>
				</view>
			</view>
			<view :class="'goods_cart ' + (cartShow ? 'show' : '')">
				<view class="tit_box">
					<view class="tit fl">购物车</view>
					<view class="fr clear_btn" @tap="emptyTap">
						<image src="/static/image/index_btn_delete3x.png" class="ico"></image>
						清空
					</view>
				</view>
				<view class="list_box">
					<view v-for="(item, index) in cartLists" :key="index" class="list">
						<!-- 加减框开始 -->
						<view class="goods_int_box fr">
							<image src="/static/image/icon_remove_new.png" class="jian" @tap="reduceCart"
								:data-sku_id="item.sku_id" :data-sku_obj="item" :data-skuadx="idx" :data-skubdx="index">
							</image>
							<view class="num">{{item.num}}</view>
							<image src="/static/image/icon_add_new.png" class="jia" @tap="addCart"
								:data-sku_id="item.sku_id" :data-sku_obj="item" :data-skuadx="idx" :data-skubdx="index">
							</image>
						</view>
						<!-- 加减框结束 -->
						<view class="price fr">
							<text class="old" v-if="item.is_discount == 1 && (item.oldprices != item.prices)">
								€{{item.oldprices}}
							</text>
							€{{item.prices}}
						</view>
						<view class="bt">{{item.title}}</view>
						<view class="clear"></view>
					</view>
					<view class="list" v-if="package_price > 0">
						<view class="price fr">€{{package_price}}</view>
						<view class="bt">打包费</view>
						<view class="clear"></view>
					</view>
				</view>
			</view>
			<!-- 底部购物车-结束 -->
			<!-- 凑一凑-开始 -->
			<view :class="'goods_cart ' + (couShow ? 'show' : '')">
				<view class="tit_box">
					<view class="tit fl">凑一凑</view>
				</view>
				<view class="list_box">
					<view v-for="(item, index) in couLists" :key="index" class="list">
						<!-- 加减框开始 -->
						<view class="goods_int_box fr">
							<image src="/static/image/icon_remove_new.png" class="jian" @tap="reduceCart"
								:data-sku_id="item.sku_id" :data-sku_obj="item" :data-skuadx="idx" :data-skubdx="index">
							</image>
							<view class="num">{{item.num}}</view>
							<image src="/static/image/icon_add_new.png" class="jia" @tap="addCart"
								:data-sku_id="item.sku_id" :data-sku_obj="item" :data-skuadx="idx" :data-skubdx="index">
							</image>
						</view>
						<!-- 加减框结束 -->
						<view class="price fr">€{{item.price}}</view>
						<view class="bt">{{item.title}}</view>
						<view class="clear"></view>
					</view>
				</view>
			</view>
			<!-- 凑一凑-结束 -->
			<!-- 自提浮动-开始 -->
			<!--  -->
			<template
				v-if="have_must == true && topInfo.can_zero_ziti == '1' || (is_must == '0' && total_num > 0 && topInfo.can_zero_ziti == '1')">
				<view @tap="linkOrdersubmit_ziti" class="zitiFixed"
					:style="'bottom:' + (couTips.length > 0 ? '204' : '140') + 'rpx;'">
					<image src="/static/image/Group103x.png">
					</image>
					<text>去自提</text>
				</view>
			</template>


			<!-- 自提浮动-结束 -->
			<!-- 计算优惠浮动-开始 -->
			<view class="countTipsFixed" v-if="couTips.length > 0">
				{{couTips}}
				<text @tap="tapCouShow" v-if="couPrice > 0">去凑单 ></text>
			</view>
			<!-- 计算优惠浮动-结束 -->
		</block>
		<!-- 菜单-结束 -->
		<!-- 评价-开始 -->
		<block v-if="tabIndex == 1">
			<view class="xiangqing">
				<view class="ctn1">
					<scroll-view scroll-y class="content_wrap" @scrolltolower="more">
						<view class="cuscore" v-if="topInfo.comment_score_switch==1">
							<view class="cuscore_num">
								<view class="cuscore_num1">
									<image src="/static/image/icon_Starred.png"></image>
									{{evaluate.avg_score}}
								</view>
								<view class="cuscore_num2">商家好评率{{evaluate.avg_good}}%</view>
							</view>
							<view class="cuscore_start">
								<view class="cuscore_start1">
									<view class="cuscore_start_icon">
										<view>
											<image src="/static/image/icon_Staryellow.png"></image>
										</view>
										{{evaluate.avg_score}}
									</view>
									<view class="cuscore_start_text">商家评分</view>
								</view>
								<view>
									<view class="cuscore_start_icon">
										<view>
											<image src="/static/image/icon_Staryellow.png"></image>
										</view>
										{{evaluate.avg_score}}
									</view>
									<view class="cuscore_start_text">商家评分</view>
								</view>
							</view>
						</view>
						<!-- <view class="pingfen mt10">
                    <view class="left border_r">
                        <view class="number">{{evaluate.avg_score}}</view>
                        <view class="ping">综合评分</view>
                        <view class="black6">商家好评率{{evaluate.avg_good}}%</view>
                    </view>
                    <view class="pingfenStar">
                        <view class="taiduNum mt5">
                            <text>商家评分</text>
                            <view class="evlt_star_bg ml20">
                                <image src="../../image/evlt_star_bg.png" class="bg"></image>
                                <view class="evlt_star_bar" style="width:{{evaluate.avg_score*20}}%">
                                    <image src="../../image/evlt_star_bar.png"></image>
                                </view>
                            </view>
                            <text class="fenshu ml5">{{evaluate.avg_score}}分</text>
                        </view>
                        <view class="peisongNum mt5">
                            <text>配送评分</text>
                            <view class="evlt_star_bg ml20">
                                <image src="../../image/evlt_star_bg.png" class="bg"></image>
                                <view class="evlt_star_bar" style="width:{{evaluate.avg_peisong*20}}%">
                                    <image src="../../image/evlt_star_bar.png"></image>
                                </view>
                            </view>
                            <text class="fenshu ml5">{{evaluate.avg_peisong}}分</text>
                        </view>
                    </view>
                    <view class="clear"></view>
                </view> -->
						<view class="sj_Pingjia" v-if="topInfo.comment_switch==1 || pjDetail.length > 0">
							<view class="qiehuan ">
								<view class="switchNav">
									<view v-for="(item, switchIdx) in switchnav" :key="switchIdx"
										:class="currentSwitchBox==switchIdx ? 'switchNav-active' : ''"
										:data-idx="switchIdx" @tap="switchbox">
										{{item.name}}({{item.num}})
									</view>
								</view>
								<checkbox-group class="sm-nav ">
									<label for class="checkbox">
										<checkbox value="只看有内容的评价" :checked="comm" @tap="hascon"
											style="transform:scale(0.7);"></checkbox>
										<text class="newcheckbox_text">只看有内容的评价</text>
									</label>
								</checkbox-group>
							</view>
							<view class="pingjia">
								<view v-for="(item, comment) in pjDetail" :key="comment" class="box  ">
									<view class="top mb10">
										<view class="left fl">
											<view class="fl pic">
												<image :src="pageimg + '' + item.face"></image>
											</view>
											<view class="text">
												<view class="username">
													<view style="display:flex;align-items: center;">
														<text>{{item.nickname}}</text>
														<text class="username_sa">{{item.pei_time}}</text>
													</view>
													<view class="username_createTime">
														{{item.dateline}}
													</view>
												</view>
												<!-- <view>
                                            <view class="evlt_star_bg">
                                                <image src="../../image/evlt_star_bg.png" class="bg"></image>
                                                <view class="evlt_star_bar" style="width:{{item.score*20}}%">
                                                    <image src="../../image/evlt_star_bar.png"></image>
                                                </view>
                                            </view>
                                            <text class="black9 ml10">{{item.pei_time}}</text>
                                        </view> -->
											</view>
										</view>
										<!-- <view class="fr black9 createTime">{{item.dateline}}</view> -->
										<view class="clear"></view>
									</view>
									<view class="detail mt5" style="margin-left: 76rpx;">
										{{item.content}}
									</view>
									<block v-if="item.have_photo==1">
										<view class="pics mt5" style="margin-left: 76rpx;">
											<view v-for="(li, inidx) in item.comment_photos" :key="inidx" class="pic"
												:data-outidx="comment" :data-inidx="inidx" @tap="previewimage"
												:data-pics="item.comment_photos">
												<view>
													<image mode="aspectFill" style="width:120rpx;height:120rpx;"
														:src="li.photo"></image>
												</view>
											</view>
										</view>
									</block>
									<view v-if="item.reply!=''" class="shopreply" style="margin-left: 76rpx;">
										<view>
											商家回复
											<text class="black9">({{item.reply_time}})</text>
											:
										</view>
										<view>{{item.reply}}</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 加载提示-开始 -->
						<view class="weui-loadmore" :hidden="loadhide">
							<image src="/static/image/loading.gif"></image>
							<text class="weui-loadmore__tips">正在加载</text>
						</view>
						<view :hidden="morehidden" class="morelist" @tap="tosearch">没有更多啦</view>
						<NoData :show="pjDetail.length === 0" />

						<!-- 加载提示-结束 -->
					</scroll-view>
				</view>
			</view>
		</block>
		<!-- 评价-结束 -->
		<!-- 详情-开始 -->
		<block v-if="tabIndex == 2">
			<view class="sjdets">
				<view class="sjdets_head">

					<view class="sjdets_head_item" @tap="bindClipboardData" :data-tel="xinxi.addr">
						<view class="sjdets_head_item_title">地址</view>
						<view class="sjdets_head_item_main">{{xinxi.addr}}</view>
					</view>
					<view class="sjdets_head_item">
						<view class="sjdets_head_item_title">营业时间</view>
						<view class="sjdets_head_item_main">
							<block v-for="(item, index) in xinxi.yy_peitime" :key="index">
								<block v-if="index != (xinxi.yy_peitime.length - 1)">
									{{item.stime}}-{{item.ltime}},
								</block>
								<block v-else>{{item.stime}}-{{item.ltime}}</block>
							</block>
						</view>
					</view>
					<view class="sjdets_head_item">
						<view class="sjdets_head_item_title">服务</view>
						<view class="sjdets_head_item_main">
							<block v-if="xinxi.pei_type=='0'">商家配送</block>
							<block v-else-if="xinxi.pei_type=='1'">平台配送</block>
						</view>
					</view>
					<!-- <view class="sjdets_head_item">
                <view class="sjdets_head_item_title">堂食营业时间</view>
                <view class="sjdets_head_item_main">{{xinxi.phone}}</view>
            </view> -->
				</view>
				<view class="sjdets_exe">
					<view v-for="(item, index) in xinxi.huodong" :key="index" class="activity_single">
						<!-- <text class="ico" :style="'background:#' + item.color + ';'">{{item.word}}</text> -->
						<text class="txt">{{item.title}}</text>
					</view>
				</view>
				<view class="sjdets_img" v-if="xinxi.verify.length>0">
					<view class="sjdets_img_title">商家信息</view>
					<view class="sjdets_img_main">
						<scroll-view scroll-x class="sjdets_img_main">
							<view :style="'width:' + (xinxi.verify.length*220-20) + 'rpx;height:200rpx;display:flex;'">
								<view v-for="(item, picidx) in xinxi.verify" :key="picidx" class="sjdets_img_main_pic"
									:data-picidx="picidx" @tap="preview_zizhi">
									<image :data-picidx="picidx" :src="pageimg + '' + item"
										style="width:200rpx;height:200rpx;" mode="aspectFill"></image>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="sjdets_img" v-if="xinxi.album.length>0">
					<view class="sjdets_img_title">商家实景</view>
					<view class="sjdets_img_main">
						<scroll-view scroll-x class="sjdets_img_main">
							<view :style="'width:' + (xinxi.album.length*220-20) + 'rpx;height:200rpx'">
								<view v-for="(item, picidx) in xinxi.album" :key="picidx" class="sjdets_img_main_pic"
									:data-picidx="picidx" @tap="preview_shijing">
									<image :src="pageimg + '' + item + '_thumb.jpg'" style="width:200rpx;height:200rpx;"
										mode="aspectFill"></image>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>

		</block>
		<!-- 详情-结束 -->
		<!-- 查看更多活动与消息弹层-开始 -->
		<view class="noticeMask" :hidden="noticeshow">
			<view class="top">
				<view class="title">{{topInfo.title}}</view>
				<view
					:class="'state ' + (topInfo.yy_status == '1' && topInfo.yysj_status == '1' ? 'state1' : 'state2')">
					<block v-if="topInfo.yy_status == '1' && topInfo.yysj_status == '1'">营业中</block>
					<block v-else>打烊了</block>
				</view>
				<view class="evlt_star_bg">
					<image src="/static/image/evlt_star_bg.png" class="bg"></image>
					<view class="evlt_star_bar" :style="'width:' + (topInfo.avg_score*20) + '%'">
						<image src="/static/image/evlt_star_bar.png"></image>
					</view>
				</view>
			</view>
			<view class="bt">商家活动</view>
			<view class="hd">
				<view v-for="(item, index) in topInfo.huodong" :key="index" v-if="topInfo.huodong.length>0"
					class="wz overflow_clear">
					<i class="ico" :style="'background:#' + item.color">{{item.word}}</i>
					{{item.title}}
				</view>
				<view v-if="topInfo.huodong.length<=0" class="wz overflow_clear">
					暂无活动
				</view>
			</view>
			<view class="bt">商家公告</view>
			<view class="nr">
				<block v-if="topInfo.delcare.length > 0">{{topInfo.delcare}}</block>
				<block v-else>用餐高峰请提前下单，O(∩_∩)O谢谢！！</block>
			</view>
			<image src="/static/image/btn_close3x.png" @tap="setnoticeshow" class="close"></image>
		</view>
		<!-- 查看更多活动与消息弹层-结束 -->
		<!-- 快速导航-开始 -->
		<view :class="'shangcheng-links-fixed ' + (clickopen ? 'on' : '')"
			:style="'z-index: ' + (clickopen ? 21 : 1) + ';'" id="tuoyituo">
			<view class="open" @tap="openspeednav">
				<image src="/static/image/icon-doublearrowR-white2x.png" class="jt"></image>
				快速导航
			</view>
			<view class="list_box">
				<view class="linkto" @tap="toindex">
					<view class="img">
						<image src="/static/image/footer/tabbar012x.png" class="tu"></image>
					</view>
					<view>首页</view>
				</view>
				<view class="linkto" @tap="toorder">
					<view class="img">
						<image src="/static/image/footer/tabbar0322x.png" class="tu"></image>
					</view>
					<view>订单</view>
				</view>
				<!-- <view class="linkto" bindtap="togocar">
            <view class="img"><image src="../../image/footer/tabbar032x.png" class='tu'></image></view>
            <view>购物车</view>
        </view> -->
				<view class="linkto" @tap="tocenter">
					<view class="img">
						<image src="/static/image/footer/tabbar042x.png" class="tu"></image>
					</view>
					<view>个人中心</view>
				</view>
			</view>
		</view>
		<!-- 快速导航-结束 -->
		<view class="mask_bg" :hidden="cartShow || clickopen || couShow || shareShow ? false : true"
			:style="'z-index:' + (clickopen ? 20 : 9) + ';'" @tap.stop="hideMask"></view>
		<!-- 商家打烊 -->
		<view class="shopOffTips" v-if="topInfo.yy_status == '0' || topInfo.yysj_status == '0'"
			:style="'display:' + (tipsShow ? 'block' : 'none')">
			<view class="shopOffTipsOut">
				<view class="shopOffTipsIn">
					<image src="/static/image/btn_close3x.png" class="tipsOff" @tap="tipsOff"></image>
					<image src="/static/image/icon_pop_shop3x.png" class="tipsImg"></image>
					<text>非营业时间，商户休息中</text>
				</view>
			</view>
		</view>
		<!-- 商家超出配送范围 -->
		<view class="shopOffTips" v-else-if="topInfo.is_distance == '1'"
			:style="'display:' + (tipsShow ? 'block' : 'none')">
			<view class="shopOffTipsOut">
				<view class="shopOffTipsIn">
					<image src="/static/image/btn_close3x.png" class="tipsOff" @tap="tipsOff"></image>
					<image src="/static/image/icon_pop_map3x.png" class="tipsImg"></image>
					<text>超出配送范围</text>
				</view>
			</view>
		</view>
		<!-- 商家优惠弹窗 topInfo.huodong {{topInfo.title}} {{topInfo.logo}}-->
		<view class="shopOffTips" v-else-if="newhuodong.length>0" :style="'display:' + (tipsShow ? 'block' : 'none')">
			<view class="shopOffTipsOut">
				<view class="shopOffTipsIn" style="min-height: 570rpx;">
					<view class="shopOffyouhui">
						<image :src="topInfo.logo" class="tipsyouhui"></image>
						<view class="youhuiname">{{topInfo.title}}</view>
						<view style="margin: 26rpx 0 31rpx;">
							<block v-for="(item, index) in newhuodong" :key="index">
								<view class="newhuodongname">菜品{{item}}</view>
							</block>
						</view>

						<view class="newhuodongbutton" @tap="tipsOff">知道了，点餐啦！</view>
					</view>
				</view>
			</view>
		</view>

		<view class="sharePicMask" :style="'bottom:' + (!shareShow?'-2000':'488') + 'rpx;'">
			<view>
				<canvas canvas-id="shareImg" :style="'width:' + posterWidth + 'px;height:' + posterHeight + 'px;'"
					class="sharecanvas"></canvas>
			</view>
		</view>

		<view :class="'shareWayMask ' + (shareShow ? 'show' : '')">
			<view class="list_box">
				<view class="list">
					<image class="ico" src="/static/image/btn_wechat_share3x.png"></image>
					<view class="txt">微信</view>
					<button open-type="share" class="share"></button>
				</view>
				<!-- <view class='list'>
            <image class='ico' src='../../image/btn_wechats_share@3x.png'></image>
            <view class='txt'>朋友圈</view>
        </view> -->
				<view class="list">
					<image class="ico" src="/static/image/btn_img_share3x.png"></image>
					<view class="txt">保存图片</view>
					<button @tap="savePoster" class="share"></button>
				</view>
			</view>
			<view class="cancel" @tap="shareWayMaskShow">取消</view>
		</view>
		<!-- 分享海报-结束 -->
		<!-- </block> -->
	</view>
</template>

<script>
	var app = getApp();
	var shop_id = '389',
		common = require("../../js/ecart.js"),
		ecart = null,
		str_obj = {},
		str_name = '',
		isnull,
		commenttype;
	var addr_h;
	let goods_item_height = [];
	// let MenuButton = uni.getMenuButtonBoundingClientRect();
	// console.log(MenuButton);

	export default {
		data() {
			return {
				noticeshow: true,
				newToptoMroey: 0,
				tabIndex: 0,
				goodsCate: [],
				goodsCate_idx: "all",
				goodsList: [],
				goodsArr: [],
				specShow_idx: null,
				specShow: false,
				cartShow: false,
				cartLists: [],
				specsIdx: 0,
				specsK: [],
				newSpecs: {
					sku_id: "",
					num: 0
				},
				min_amount: 0,
				//起送价
				priceDif: 0,
				//差价
				total_price: 0,
				//总价
				total_oldprice: 0,
				//总的原价
				totalPrice: 0,
				//优惠后的总价
				useFirst: false,
				//是否首单优惠
				have_must: false,
				//购物车是否有必点商品；
				is_must: 0,
				//商家是否有必点商品
				is_ziti: false,
				morehidden: true,
				loadhide: true,
				currentSwitchBox: "0",
				//评价分类下标
				comm: false,
				//评价分类下标
				tipsShow: true,
				//商家商品弹窗
				tcHideIdx: null,
				//凑一凑
				couTips: '',
				//底部优惠提示内容
				couShow: false,
				//是否弹出
				couPrice: false,
				//凑一凑价格
				couLists: [],
				//凑一凑商品列表
				//分享海报
				shareShow: false,
				share_pic: '',
				windowWidth: '',
				posterHeight: '',
				posterWidth: '',
				// 
				good_list_index_id: 0,
				tab_list_index_id: 0,
				recommend_height: 0,
				page_scrolling: false,
				has_index: 1,
				topInfo: {
					yy_status: 1,
					yysj_status: 1,
					logo: "",
					title: "",
					tips_label: "",
					delcare: "",
					min_amount: "",
					freight: 0,
					reduceEd_freight: "",
					is_reduce_pei: 0,
					huodong: [],
					can_zero_ziti: "",
					is_distance: "",
				},
				//
				sysinfo: uni.getSystemInfoSync(),
				// MenuButton:MenuButton,
				tj_items: {
					title: "",
					products: []
				},
				specs_idx: "",
				specification_idx: false,
				proList: {
					product_id: ""
				},
				null: "",
				shopCoupon: {
					coupon_amount: "",
					title: ""
				},
				shopAdv: [],
				total_num: "",
				package_price: "",
				evaluate: {
					avg_score: "",
					avg_good: ""
				},
				switchIdx: "",
				switchnav: [],
				pageimg: "",
				inidx: "",
				comment: "",
				pjDetail: [],
				xinxi: {
					addr: "",
					yy_peitime: [],
					pei_type: "",
					huodong: [],
					verify: [],
					album: []
				},
				picidx: "",
				clickopen: false,
				newhuodong: [],
				commentpage: 0,
				specShow_tj: false,
				scrollWidth: "",
				idx: 0,
				showToast: {
					isShow: false
				},
				OpenSettingShow: false,
				sheraImg: ''
			};
		},

		components: {},
		props: {},

		onHide() {
			this.shareShow = false;
		},
		onReachBottom() {
			console.log(122121)
		},
		onLoad: function(e) {
			if (e.scene) {
				const scene = decodeURIComponent(e.scene)
				let ids = scene.split('=')
				shop_id = ids[ids.length - 1]
				app.globalData._CFG.shoptail = ids[ids.length - 1]
				console.log(scene)
			} else {
				shop_id = e.id || '389';
				app.globalData._CFG.shoptail = e.id;
			}


			isnull = '';
			var that = this;
			commenttype = '0'; //测试数据

			//跳转商家详情评价

			if (e.currentNavtab) {
				that.tabIndex = e.currentNavtab;
				if (e.currentNavtab == 1) {
					that.newshopComments()
				}
			};

		},
		onShow: function() {
			this.http();
			this.getStaticQrcode()
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#2C3B53',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			}); // app.getLocation(function() {
			//     that.http();
			// });
		},

		/*** 用户点击右上角分享*/
		onShareAppMessage: function() {
			app.globalData.share('微信小程序外卖', '/pgaes/shoptail/shoptail?id=' + shop_id);
		},
		methods: {
			getStaticQrcode() {
				app.globalData.getStaticQrcode({
					"page": "pages/shoptail/shoptail",
					"param": {
						"shop_id": shop_id,
					}
				}, (res) => {
					uni.downloadFile({
						url: res.data.path,
						success: logo => {
							this.sheraImg = logo.tempFilePath
							console.log(this.sheraImg)
						},
						fail: e => {
							this.failedgenerateshareimage();
						}
					});

				});
			},
			backpages() {
				var pages = getCurrentPages();

				if (pages.length <= 1) {
					uni.switchTab({
						url: '/pages/index/index'
					});
				} else {
					uni.navigateBack();
				}
			},

			onPageScroll: function(page) {
				this.recommend_height = page.scrollTop;
			},

			//凑一凑
			tapCouShow() {
				var that = this,
					couPrice = that.couPrice,
					couLists = [],
					goodsArr = that.goodsArr,
					arr = [];

				for (var i in goodsArr) {
					//过滤重复、有规格属性商品
					if (!isNaN(parseInt(goodsArr[i].cate_id))) {
						for (var k in goodsArr[i].products) {
							if (!(goodsArr[i].products[k].specs.length > 0 || goodsArr[i].products[k].specification
									.length > 0) && goodsArr[i].products[k].sale_sku > 0) {
								arr.push(goodsArr[i].products[k]);
							}

							;
						}

						;
					};
				}

				;

				for (var j in arr) {
					//取满足差价的商品（价格≥差价即可）
					var price = Number(arr[j].price);
					if (!isNaN(price) && price >= Number(couPrice)) {
						couLists.push(arr[j]);
					}
				}

				;
				that.couLists = couLists;
				console.log(couLists);

				if (couLists.length > 0) {
					that.couShow = true
					that.cartShow = false
				} else {
					uni.showToast({
						title: "暂无满足要求的凑单商品"
					});
				}

				;
			},

			//凑一凑数据渲染
			resetDataCou() {
				var that = this,
					couLists = that.couLists,
					goodsArr = that.goodsArr;

				for (var i in goodsArr) {
					for (var k in goodsArr[i].products) {
						if (!(goodsArr[i].products[k].specs.length > 0 || goodsArr[i].products[k].specification.length >
								0) && goodsArr[i].products[k].sale_sku > 0) {
							for (var j in couLists) {
								if (couLists[j].sku_id == goodsArr[i].products[k].sku_id) {
									couLists[j].num = goodsArr[i].products[k].num;
								}

								;
							}

							;
						}

						;
					}

					;
				}

				;
				that.couLists = couLists;
			},

			//4.3计算满减 起送价信息
			manjianCalculate(useMj, totalOldPrice, totalPrice) {
				if (typeof useMj == 'undefined') {
					//默认使用满减活动
					useMj = 1;
				}

				totalPrice = parseFloat(totalPrice || 0);
				var differencePrice = Math.max(0, parseFloat(totalOldPrice - totalPrice)).toFixed(2);
				var manjian = this.manjian;
				var productLen = Object.keys(ecart.shop_cart).length;
				var song = parseFloat(this.topInfo.min_amount);
				var html = '';

				if (productLen == 0) {
					//没有选择任何商品
					// console.log("执行0");
					if (useMj && typeof manjian == 'object' && manjian.length > 0) {
						for (var k in manjian) {
							if (k != 0) {
								html += ',';
							}

							;
							html += '满' + manjian[k].order_amount + '€减' + manjian[k].coupon_amount;
						}

						;
					}

					;
					this.couPrice = 0;
				} else if (song > 0 && totalOldPrice >= 0 && song > totalOldPrice) {
					// console.log("执行1");
					html = '差' + (song - totalOldPrice).toFixed(2) + '€起送,';
					this.couPrice = (song - totalOldPrice).toFixed(2);
				} else if (!useMj && differencePrice > 0) {
					// console.log("执行2");
					html = '已减' + differencePrice;
					this.couPrice = 0;
				} else if (useMj > 0 && typeof manjian == 'object' && manjian.length > 0) {
					var nowMj = {};
					var nextMj = {};

					for (var k in manjian) {
						if (totalOldPrice >= manjian[k].order_amount) {
							if (Object.keys(nowMj).length == 0) {
								nowMj = manjian[k];
							} else if (manjian[k].order_amount >= nowMj.order_amount) {
								nowMj = manjian[k];
							}
						} else {
							if (Object.keys(nextMj).length == 0) {
								nextMj = manjian[k];
							} else if (manjian[k].order_amount < nextMj.order_amount) {
								nextMj = manjian[k];
							}
						}

						;
					}

					;

					if (Object.keys(nowMj).length > 0 && Object.keys(nextMj).length > 0) {
						html = '已减' + nowMj.coupon_amount + '€, 再买' + (nextMj.order_amount - totalOldPrice).toFixed(2) +
							'€减' + nextMj.coupon_amount + '€,';
						this.couPrice = (nextMj.order_amount - totalOldPrice).toFixed(2);
					} else if (Object.keys(nowMj).length > 0 && Object.keys(nextMj).length == 0) {
						html = '已减' + nowMj.coupon_amount;
						this.couPrice = 0;
					} else if (Object.keys(nowMj).length == 0 && Object.keys(nextMj).length > 0) {
						html = '满' + nextMj.order_amount + '€减' + nextMj.coupon_amount + ', 差' + (nextMj.order_amount -
							totalOldPrice).toFixed(2) + '€';
						this.couPrice = (nextMj.order_amount - totalOldPrice).toFixed(2);
					}

					; // console.log("执行3", html);
				}

				;
				this.couTips = html;
			},

			//4.2获取最近的满减金额
			getAmount() {
				var that = this;
				var cartCount = ecart.total_count(); //商家购物车商品数量

				var total_price = parseFloat(that.total_price); //商品减去折扣后的总价(购物车金额)；

				var useFirst = 1,
					useMj = 1,
					useDisc = 1; //默认享受首单,满减,折扣

				if (cartCount > 0) {
					//购物车有商品
					var first_share = parseInt(that.first_share); //首单是否共享

					var firstAmount = parseFloat(that.firstAmount); //首单优惠金额

					var difAmount = parseFloat(that.total_oldprice) - parseFloat(that.total_price); //商品折扣优惠金额

					var total_oldprice = parseFloat(that.total_oldprice); //没有折扣的商品总价

					var mjAmount = that.getMjAmount(total_oldprice);
					var isHasDiscount = ecart.isHasDiscount();

					if (firstAmount <= 0) {
						useFirst = 0;
					}

					if (isHasDiscount) {
						useMj = 0;
						useDisc = 1;
					}

					if (firstAmount > 0 && first_share == 0) {
						if (useMj == 1) {
							if (firstAmount >= mjAmount) {
								useMj = 0;
							} else {
								useFirst = 0;
							}
						}
					}

					;
					total_price = total_oldprice; // if (useFirst == 1) {
					//     total_price -= parseFloat(firstAmount);
					// }

					if (useDisc == 1) {
						total_price -= parseFloat(difAmount);
					}

					if (useMj == 1) {
						total_price -= parseFloat(mjAmount);
					}

					;
					that.manjianCalculate(useMj, total_oldprice, total_price); //4.3满减 起送 展示 

					total_price = Math.max(0.01, total_price);
				} else {
					that.manjianCalculate();
				}

				;
				that.useFirst = useFirst == 1 ? true : false;
				that.totalPrice = total_price.toFixed(2);
			},

			getMjAmount(total_price) {
				var manjian = this.manjian;
				var mjAmount = 0;
				var min = 0;

				if (manjian.length > 0) {
					manjian.forEach(function(item, index) {
						var cha = parseFloat(total_price) - parseFloat(item.order_amount);

						if (mjAmount == 0 && item.order_amount <= total_price) {
							min = cha;
							mjAmount = parseFloat(item.coupon_amount);
						} else if (item.order_amount <= total_price && cha < min) {
							mjAmount = parseFloat(item.coupon_amount);
						}
					});
				}

				;
				return mjAmount;
			},

			//收藏
			collect() {
				var that = this;
				app.globalData.afterCheckLogin(function() {
					var collect,
						topInfo = that.topInfo;

					if (topInfo.collect == '0') {
						collect = '1';
					} else {
						collect = '0';
					}

					;
					app.globalData.tapCollect({
						"type": "waimai",
						"can_id": shop_id,
						"status": collect
					}, function(res) {
						if (res.error == '0') {
							var title;

							if (collect == 0) {
								topInfo.collect = '0';
								uni.showToast({
									title: '取消收藏',
									duration: 2000
								});
							} else {
								topInfo.collect = '1';
								uni.showToast({
									title: '收藏成功',
									duration: 2000
								});
							}

							that.topInfo = topInfo;
						} else {
							uni.showToast({
								title: res.message,
								duration: 2000
							});
						}

						;
					}, true);
				});
			},

			//搜索商家商品；
			toshopsearch: function() {
				var that = this;
				uni.setStorageSync('newshopinfo', that.topInfo);
				uni.setStorageSync('newgoodsArr', that.goodsArr);
				var shopinfo = JSON.stringify(that.topInfo);
				var goodsArr = JSON.stringify(that.goodsArr);
				// uin.setstorage()
				app.globalData.topage('../shopsearch/shopsearch?shop_id=' + shop_id + '&min_amount=' + that.topInfo
					.min_amount + '&shoptitle=' + that.topInfo.title);
			},
			newshopComments() {
				let that = this
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				app.globalData.shopComments({
					page: 1,
					"shop_id": shop_id,
					'type': commenttype,
					'is_null': isnull
				}, function(res) {
					// console.log("评论",res);
					if (res.error == '0') {
						var comment_list = res.data.items;

						for (var i = 0; i < comment_list.length; i++) {
							comment_list[i].reply_time = app.globalData.getLocalTime(comment_list[i]
								.reply_time);
							comment_list[i].dateline = app.globalData.getLocalTime(comment_list[i].dateline);
						}

						that.evaluate = res.data.detail
						that.switchnav = res.data.switchnav
						that.pjDetail = comment_list
						that.commentpage = 1
						that.loadhide = true
						that.morehidden = true
						uni.hideLoading();
					} else {
						uni.hideLoading();
						uni.showToast({
							title: res.message
						});
					}
				});
			},
			//tab切换
			settabIndex(e) {
				var that = this;

				if (e.currentTarget.dataset.idx == 1) {
					that.newshopComments()
				};

				if (e.currentTarget.dataset.idx == 2) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					});
					app.globalData.shopInfo({
						"shop_id": shop_id
					}, function(res) {
						if (res.error == '0') {
							var xinxi = res.data.detail;
							that.xinxi = xinxi;
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.message
							});
						}
					});
				}

				;
				that.tabIndex = e.currentTarget.dataset.idx;
			},

			//计算是否达到起送价；
			setpriceDif(min_amount, total_price) {
				if (parseFloat(min_amount) > parseFloat(total_price)) {
					return (parseFloat(min_amount) - parseFloat(total_price)).toFixed(2);
				} else {
					return 0;
				};
			},

			bindtolower() {
				if (this.has_index < this.goodsArr.length) {
					this.has_index = this.has_index + 1;
					this.setcreateSelectorQuery()
				} else {
					uni.showToast({
						title: "暂无更多数据~"
					});
				}
			},

			//请求数据；
			http() {
				var that = this;
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				app.globalData.shopDetail({
					"shop_id": shop_id
				}, function(res) {
					console.log(res);

					if (res.error == "0") {
						uni.setNavigationBarTitle({
							title: res.data.detail.title
						}); //设置头部标题;

						let goodsArr = res.data.detail.items;
						let huodong = res.data.detail.huodong;
						let newhuodong = [];
						let Mynumber = 0
						for (let i in goodsArr) {
							Mynumber += goodsArr[i].products.length
							if (Mynumber >= 40) {
								that.has_index = i;
								break
							} else {
								that.has_index = i;
							}
						}
						for (let i = 0; i < huodong.length; i++) {
							if (huodong[i].word == '减') {
								newhuodong = huodong[i].title.split(',');
								uni.setStorage({
									data: newhuodong,
									key: 'newhuodong'
								});
								uni.setStorage({
									data: res.data.detail.logo,
									key: 'newlogo'
								});
							}
						}

						that.manjian = res.data.detail.manjian ? res.data.detail.manjian.config : [];
						that.firstAmount = res.data.detail.first_youhui;
						that.first_share = res.data.detail.support.first_share;
						that.newhuodong = newhuodong;
						that.topInfo = res.data.detail;
						that.min_amount = res.data.detail.min_amount;
						that.shopCoupon = res.data.detail.shop_coupon;
						//商家优惠券信息；
						that.shopAdv = res.data.detail.advs;
						//商家广告；
						that.tj_items = res.data.detail.tj_items ? res.data.detail.tj_items : '';
						//商家推荐；
						that.goodsCate_idx = res.data.detail.items[0] ? res.data.detail.items[0].cate_id : '';
						that.goodsArr = goodsArr;
						that.is_must = res.data.detail.have_must;
						ecart = new common.ECart(shop_id, {
							"quota": that.topInfo.quota
						});
						that.resetData();
						that.resetData2(); // that.createNewImg(false);
					}

					;
				});
			},

			bindPhoneCall(e) {
				let phone = e.currentTarget.dataset.phone;
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例，并非真实的电话号码

				});
			},

			bindClipboardData(e) {
				let tel = e.currentTarget.dataset.tel;
				uni.showModal({
					title: '提示',
					content: '是否复制当前地址',

					success(res) {
						if (res.confirm) {
							uni.setClipboardData({
								data: tel,

								success(res) {
									uni.getClipboardData({
										success(res) {
											console.log(res.data); // data
										}

									});
								}

							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}

				});
			},

			//渲染数据2
			resetData2() {
				var that = this,
					goodsArr2 = that.tj_items,
					pro_num,
					sku_id;

				if (!goodsArr2) {
					return false;
				}

				;

				for (var j = 0; j < goodsArr2.products.length; j++) {
					if (goodsArr2.products[j].length != 0) {
						//定义商品规格及sku_id；
						if (goodsArr2.products[j].specs && goodsArr2.products[j].specs.length > 0) {
							for (var h = 0; h < goodsArr2.products[j].specs.length; h++) {
								sku_id = goodsArr2.products[j].product_id + "_" + goodsArr2.products[j].specs[h].spec_id;
								goodsArr2.products[j].specs[h].sku_id = sku_id;
								goodsArr2.products[j].specs[h].title = goodsArr2.products[j].title + '(' + goodsArr2
									.products[j].specs[h].spec_name + ')';
								goodsArr2.products[j].specs[h].is_must = goodsArr2.products[j].is_must;

								if (ecart.shop_cart[sku_id]) {
									if (ecart.shop_cart[sku_id].num > goodsArr2.products[j].specs[h].sale_sku) {
										uni.showToast({
											title: '库存发生变化'
										});
										ecart.clear();
									}

									;
								};
							};
							goodsArr2.products[j].num = ecart.sku_count(goodsArr2.products[j].product_id);
						} else if (goodsArr2.products[j].specification && goodsArr2.products[j].specification.length > 0) {
							sku_id = goodsArr2.products[j].product_id + "_0";
							goodsArr2.products[j].sku_id = sku_id;
							goodsArr2.products[j].num = ecart.sku_count(goodsArr2.products[j].product_id);
						} else {
							sku_id = goodsArr2.products[j].product_id + "_0";
							goodsArr2.products[j].sku_id = sku_id;

							if (ecart.shop_cart[sku_id]) {
								if (ecart.shop_cart[sku_id].num > goodsArr2.products[j].sale_sku) {
									uni.showToast({
										title: '库存发生变化'
									});
									ecart.clear();
								} else {
									pro_num = ecart.shop_cart[sku_id].num;
									goodsArr2.products[j].num = pro_num;
								}

								;
							} else {
								goodsArr2.products[j].num = 0;
							};
						};
					};
				};
				console.log(goodsArr2);
				that.tj_items = goodsArr2;
			},

			//渲染数据
			resetData() {
				var that = this,
					goodsCate = [],
					goodsArr = that.goodsArr,
					goodsList = [],
					arr = {
						title: '全部',
						cate_id: 'all',
						pcate_num: ecart.total_count(),
						products: []
					},
					obj,
					pro_num,
					sku_id;

				for (var i = 0; i < goodsArr.length; i++) {
					//一级菜单下单量；
					if (ecart.pcate_num(goodsArr[i].cate_id)) {
						goodsArr[i].pcate_num = ecart.pcate_num(goodsArr[i].cate_id);
					} else {
						goodsArr[i].pcate_num = 0;
					}

					; //商品分类；

					goodsCate.push({
						"title": goodsArr[i].title,
						"cate_id": goodsArr[i].cate_id,
						"pcate_num": goodsArr[i].pcate_num
					});

					for (var j = 0; j < goodsArr[i].products.length; j++) {
						if (goodsArr[i].products[j].length != 0) {
							//全部商品；
							if (!isNaN(parseInt(goodsArr[i].cate_id))) {
								arr.products.push(goodsArr[i].products[j]);
							}

							; //定义商品规格及sku_id；

							if (goodsArr[i].products[j].specs && goodsArr[i].products[j].specs.length > 0) {
								for (var h = 0; h < goodsArr[i].products[j].specs.length; h++) {
									sku_id = goodsArr[i].products[j].product_id + "_" + goodsArr[i].products[j].specs[h]
										.spec_id;
									goodsArr[i].products[j].specs[h].sku_id = sku_id;
									goodsArr[i].products[j].specs[h].title = goodsArr[i].products[j].title + '(' +
										goodsArr[i].products[j].specs[h].spec_name + ')';
									goodsArr[i].products[j].specs[h].is_must = goodsArr[i].products[j].is_must;

									if (ecart.shop_cart[sku_id]) {
										if (ecart.shop_cart[sku_id].num > goodsArr[i].products[j].specs[h].sale_sku) {
											uni.showToast({
												title: '库存发生变化'
											});
											ecart.clear();
										}

										;
									}

									; // if (ecart.shop_cart[sku_id].num > goodsArr[i].products[j].specs[h].sale_sku) {
									//     wx.showToast({ title: '库存发生变化' });
									//     ecart.clear();
									// };
								}

								;
								goodsArr[i].products[j].num = ecart.sku_count(goodsArr[i].products[j].product_id);
							} else if (goodsArr[i].products[j].specification.length > 0) {
								sku_id = goodsArr[i].products[j].product_id + "_0";
								goodsArr[i].products[j].sku_id = sku_id;
								goodsArr[i].products[j].num = ecart.sku_count(goodsArr[i].products[j].product_id);
							} else {
								sku_id = goodsArr[i].products[j].product_id + "_0";
								goodsArr[i].products[j].sku_id = sku_id;

								if (ecart.shop_cart[sku_id]) {
									if (ecart.shop_cart[sku_id].num > goodsArr[i].products[j].sale_sku) {
										uni.showToast({
											title: '库存发生变化'
										});
										ecart.clear();
									} else {
										pro_num = ecart.shop_cart[sku_id].num;
										goodsArr[i].products[j].num = pro_num;
									}

									;
								} else {
									goodsArr[i].products[j].num = 0;
								}

								;
							}

							;
						}

						;
					}

					; //切换分类商品

					if (that.goodsCate_idx == goodsArr[i].cate_id) {
						obj = goodsArr[i];
					} else if (that.goodsCate_idx == 'all') { // obj = arr;
					}

					;
				}

				; // goodsCate.unshift({ title: "全部", cate_id: "all" });

				goodsList.splice(0, 1, obj); //购物车是否有必点商品；

				var have_must = that.have_must,
					must_arr = [],
					is_must = that.have_must;

				for (var k in ecart.shop_cart) {
					must_arr.push(ecart.shop_cart[k].is_must);
				}

				;

				if (must_arr.indexOf("1") != -1) {
					have_must = true;
				} else {
					have_must = false;
				};

				that.total_price = ecart.total_price();
				that.goodsArr = goodsArr
				that.goodsCate = goodsCate
				that.goodsList = goodsList
				that.total_num = ecart.total_count()
				that.total_oldprice = ecart.total_oldprice()
				that.package_price = ecart.package_price()
				that.cartLists = ecart.shop_cart
				that.have_must = have_must
				that.priceDif = that.setpriceDif(that.min_amount, ecart.total_price()) //计算是否达到起送价；

				//计算优惠后总价
				that.setcreateSelectorQuery()
				that.getAmount(); //凑一凑数据

				that.resetDataCou(); //当购物车为空弹层隐藏；

				if (ecart.total_count() == 0) {
					that.cartShow = false;
				}

				;
			},
			setcreateSelectorQuery() {
				var query = uni.createSelectorQuery();
				let goodsArr = this.goodsArr
				let count_height = 0;
				goods_item_height = []
				setTimeout(res => {
					for (let i = 0, len = goodsArr.length; i < len; i++) {
						query.select(`#list_${i}`).boundingClientRect();
					}
					query.exec(res => {
						for (let i = 0, len = res.length; i < len; i++) {
							count_height += res[i] && res[i].height ? res[i].height : 0;
							goods_item_height.push(count_height);
						}
					});
				}, 1000);
			},
			//加入购物车
			addCart(e) {
				var that = this,
					num,
					info = {},
					sku_id = e.currentTarget.dataset.sku_id,
					sku_obj = e.currentTarget.dataset.sku_obj,
					newSpecs = that.newSpecs,
					specShow = that.specShow,
					a_sku_id = '';

				if (specShow) {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					}

					;
				} else {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					} else {
						str_obj = {};
						str_name = '';
					}

					;
				}

				; //如果有规格口味选择，改变存入购物车的商品title；

				var tit_str = '';

				for (var i in str_obj) {
					tit_str += "+" + str_obj[i].val;
				}

				;
				info = {
					"is_discount": sku_obj.is_discount,
					"is_must": sku_obj.is_must,
					"oldprice": sku_obj.oldprice,
					"price": sku_obj.price,
					"package": sku_obj.package_price,
					"product_id": sku_obj.product_id,
					"pcate_id": sku_obj.cate_id,
					"sku_id": sku_id,
					"sale_sku": sku_obj.sale_sku,
					"sale_type": sku_obj.sale_type,
					"spec_id": sku_obj.spec_id || '',
					"shoptitle": that.topInfo.title,
					"shopid": shop_id,
					'str_obj': str_obj,
					'str_name': str_name,
					"title": sku_obj.title + tit_str
				};
				a_sku_id = sku_id + str_name;

				if (ecart.shop_cart[a_sku_id]) {
					num = ecart.shop_cart[a_sku_id].num;
				} else {
					num = 0;
				};

				if (num < sku_obj.sale_sku) {
					ecart.add(sku_id, 1, info, str_obj);
					newSpecs.num += 1;
				} else {
					uni.showToast({
						title: '商品库存不足',
						icon: 'none'
					});
					return
				}

				;
				let gdlist = this.goodsArr;
				let skuadx = e.currentTarget.dataset.skuadx;
				let skubdx = e.currentTarget.dataset.skubdx;
				if (skuadx && skubdx) gdlist[skuadx]['products'][skubdx].num = num; // console.log(newSpecs, num)

				that.resetData();
				that.resetData2();
				that.newSpecs = newSpecs // goodsArr: gdlist

				;
			},

			//减少购物车
			reduceCart(e) {
				var that = this,
					info = {},
					gdlist = that.goodsArr,
					sku_id = e.currentTarget.dataset.sku_id,
					sku_obj = e.currentTarget.dataset.sku_obj,
					specShow = that.specShow,
					newSpecs = that.newSpecs;

				if (specShow) {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					}

					;
				} else {
					if (sku_obj.str_name) {
						str_name = sku_obj.str_name;
						str_obj = sku_obj.str_obj;
					} else {
						str_obj = {};
						str_name = {};
					}

					;
				}

				; //如果有规格口味选择，改变存入购物车的商品title；

				var tit_str = '';

				for (var i in str_obj) {
					tit_str += "+" + str_obj[i].val;
				}

				;
				info = {
					"oldprice": sku_obj.oldprice,
					"price": sku_obj.price,
					"package": sku_obj.package_price,
					"product_id": sku_obj.product_id,
					"pcate_id": sku_obj.cate_id,
					"sku_id": sku_id,
					"sale_sku": sku_obj.sale_sku,
					"sale_type": sku_obj.sale_type,
					"spec_id": sku_obj.spec_id || '',
					"shoptitle": that.topInfo.title,
					"shopid": shop_id,
					'str_obj': str_obj,
					'str_name': str_name,
					"title": sku_obj.title + tit_str
				};
				ecart.add(sku_id, -1, info, str_obj);
				newSpecs.num -= 1; //渲染数据

				that.resetData();
				that.resetData2();
				that.newSpecs = newSpecs // goodsArr: gdlist

				;
			},

			//清空购物车
			emptyTap() {
				ecart.clear(); //渲染数据

				this.resetData();
				this.resetData2();
			},

			//规格临时数据渲染；
			specsData(sku_id, products) {
				var that = this,
					specsK = that.specsK,
					newSpecs = {},
					str = '',
					strobj = {},
					a_sku_id,
					specsIdx = that.specsIdx; //有规格属性；

				if (products.specs.length > 0) {
					newSpecs = products.specs[specsIdx];
					newSpecs.cate_id = products.cate_id;
				} else {
					newSpecs = products;
				}

				;

				if (products.specification.length > 0) {
					for (let i = 0; i < products.specification.length; i++) {
						str += ":" + products.specification[i]['key'] + ':' + products.specification[i]['val'][specsK[i]];
						strobj[i] = {
							key: products.specification[i]['key'],
							val: products.specification[i]['val'][specsK[i]],
							price: specsK[i] != 0 ? products.specification[i]['price'] : 0,
						};
					}

					;
					str_name = str;
					str_obj = strobj;
				}

				; //判断购物车是否有a_sku_id商品；

				a_sku_id = sku_id + str;

				if (ecart.shop_cart[a_sku_id]) {
					newSpecs.num = ecart.shop_cart[a_sku_id].num;
				} else {
					newSpecs.num = 0;
				}

				;
				that.newSpecs = newSpecs;
			},

			//规格筛选；
			specsOpt(e) {
				var specs_idx = e.currentTarget.dataset.specs_idx,
					products = e.currentTarget.dataset.products;
				this.specsIdx = specs_idx; //规格临时数据渲染；
				let newToptoMroey = 0
				let listspecs = products.specification
				for (let i in listspecs) {
					if (listspecs[i].price && listspecs[i].price > 0 && this.specsK[i] != 0) {
						newToptoMroey += parseFloat(listspecs[i].price)
					}
				}

				this.newToptoMroey = parseFloat(products.specs[specs_idx].price) + newToptoMroey;
				this.specsData(products.specs[specs_idx].sku_id, products);
			},

			//规格口味筛选；
			setspecsK(e) {
				var idx = e.currentTarget.dataset.idx,
					specification_idx = e.currentTarget.dataset.specification_idx,
					specsK = this.specsK,
					products = e.currentTarget.dataset.products,
					specsIdx = this.specsIdx;
				specsK[specification_idx] = idx;
				this.specsK = specsK; //规格临时数据渲染；

				if (products.specs.length > 0) {
					let newToptoMroey = 0
					let listspecs = products.specification
					for (let i in listspecs) {
						if (listspecs[i].price && listspecs[i].price > 0 && this.specsK[i] != 0) {
							newToptoMroey += parseFloat(listspecs[i].price)
						}
					}

					this.newToptoMroey = parseFloat(products.specs[specsIdx].price) + newToptoMroey;
					this.specsData(products.specs[specsIdx].sku_id, products);
				} else {
					let newToptoMroey = 0
					let listspecs = products.specification
					for (let i in listspecs) {
						if (listspecs[i].price && listspecs[i].price > 0 && this.specsK[i] != 0) {
							newToptoMroey += parseFloat(listspecs[i].price)
						}
					}
					this.newToptoMroey = parseFloat(products.price) + newToptoMroey;
					this.specsData(products.sku_id, products);
				}

				;
			},

			//规格弹层；
			setspecShow(e) {
				var that = this,
					product_id = e.currentTarget.dataset.product_id,
					products = e.currentTarget.dataset.products,
					specsK = [];
				var tj = e.currentTarget.dataset.tj;
				this.newToptoMroey = 0;
				if (tj) {
					that.specShow_tj = true;
				} else {
					that.specShow_tj = false;
				};

				if (product_id) {
					uni.getSystemInfo({
						success: function(res) {
							//console.info(res);
							that.visible = 'visible', that.visible_t = '';
							that.scrollWidth = res.windowWidth;
						}
					});
					that.specShow_idx = product_id
					that.specShow = true
					that.tcHideIdx = null; //构建临时数据；

					for (let i = 0; i < products.specification.length; i++) {
						specsK.push(0);
					};
					that.specsIdx = 0
					that.specsK = specsK; //规格临时数据渲染；

					if (products.specs.length > 0) {
						that.specsData(products.specs[0].sku_id, products);
					} else {
						that.specsData(products.sku_id, products);
					};
				} else {
					that.specShow_idx = null
					that.specShow = false
					str_name = '';
					str_obj = {};
				};
			},

			//商品详情弹出
			shutDown: function(e) {
				var that = this;
				var product_id = e.currentTarget.dataset.product_id || '';
				var tj = e.currentTarget.dataset.tj;

				if (tj) {
					that.specShow_tj = true;
				} else {
					that.specShow_tj = false;
				}

				;

				if (that.tcHideIdx != null) {
					that.tcHideIdx = null;
				} else {
					uni.getSystemInfo({
						success: function(res) {
							that.visible = 'visible', that.visible_t = '';
							that.tcHideIdx = product_id;
						}
					});
				}

				;
			},

			//商品分类菜单；
			cateTap(e) {
				var that = this,
					goodsCate_idx = e.currentTarget.dataset.cate_id,
					index = e.currentTarget.dataset.index;
				if (index !== undefined && index !== null && index !== '') {
					index = Number(index);
				}

				if (index === undefined || index === null || index === '') {
					var goodsArr = that.goodsArr || [];
					for (var i = 0; i < goodsArr.length; i++) {
						if (goodsArr[i].cate_id == goodsCate_idx) {
							index = i;
							break;
						}
					}
				}
				if (index === undefined || index === null || index === '') {
					index = 0;
				}

				if (that.has_index <= index) {
					that.has_index = index
					that.tab_list_index_id = index
					that.goodsCate_idx = goodsCate_idx
					that.good_list_index_id = index
				} else {
					that.tab_list_index_id = index
					that.goodsCate_idx = goodsCate_idx
					that.good_list_index_id = index
				}

			},

			//购物车弹出效果
			setcartShow() {
				var that = this;
				var cartShow = that.cartShow;

				if (cartShow) {
					that.cartShow = false
					that.couShow = false
				} else {
					that.cartShow = true
					that.couShow = false
				}

				;
			},

			//查看更多活动与消息弹层；
			setnoticeshow() {
				var noticeshow = this.noticeshow;

				if (noticeshow) {
					this.noticeshow = false;
				} else {
					this.noticeshow = true;
				}

				;
			},

			//去领取优惠券页
			toGetCoupon() {
				var url = '../getcoupon/getcoupon?shop_id=' + shop_id;
				app.globalData.topage(url);
			},

			//跳转商家广告链接
			toShopAdv(e) {
				var url = e.currentTarget.dataset.obj.wxlink;
				app.globalData.gopage(url);
			},

			//去下单
			ordertocallback() {
				var that = this,
					product_info = '',
					cart = ecart.shop_cart,
					is_ziti;

				if (that.is_ziti == true) {
					is_ziti = 'ziti';
				};
				for (var i in cart) {
					var product_info;

					if (cart[i].spec_id) {
						product_info += cart[i].product_id + ':' + cart[i].spec_id + ':' + cart[i].num + ',';
					} else {
						product_info += cart[i].product_id + ':' + 0 + ':' + cart[i].num + ',';
					}
				};
				product_info = product_info.substring(0, product_info.length - 1);
				product_info = product_info.substring(0, product_info.length - 1); //console.log("老乡鸡1", product_info);

				var url = '../wm_order/wm_order?id=' + shop_id + '&is_ziti=' + is_ziti;
				app.globalData.topage(url);
			},

			linkOrdersubmit_ziti() {
				console.log(12121)
				var that = this;
				that.is_ziti = true;
				app.globalData.afterCheckLogin(that.ordertocallback);
			},

			linkOrdersubmit() {
				var that = this;
				that.is_ziti = false;
				app.globalData.afterCheckLogin(that.ordertocallback);
			},

			//快速导航
			toindex: function() {
				app.globalData.topage('../index/index', 'tab');
			},
			toorder: function() {
				app.globalData.topage('../order/order', 'tab');
			},
			tocenter: function() {
				app.globalData.topage('../mine/mine', 'tab');
			},
			openspeednav: function() {
				if (this.clickopen == true) {
					this.clickopen = false;
				} else {
					this.clickopen = true;
				}
			},
			//商家评论筛选
			switchbox: function(e) {
				var idx = e.currentTarget.dataset.idx;
				commenttype = idx;
				var that = this;
				app.globalData.shopComments({
					"shop_id": shop_id,
					"type": commenttype,
					"page": 1,
					'is_null': isnull
				}, function(res) {
					if (res.error == '0') {
						var comment_list = res.data.items;

						for (var i = 0; i < comment_list.length; i++) {
							comment_list[i].reply_time = app.globalData.getLocalTime(comment_list[i]
								.reply_time);
							comment_list[i].dateline = app.globalData.getLocalTime(comment_list[i].dateline);
						}

						that.evaluate = res.data.detail
						that.switchnav = res.data.switchnav
						that.pjDetail = comment_list
						that.commentpage = 1
						that.loadhide = true
						that.morehidden = true
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
				this.currentSwitchBox = idx;
			},
			//是否有评价内容；
			hascon: function() {
				var comm = this.comm;

				if (comm == false) {
					isnull = 'hascontent';
					comm = true;
					var that = this;
					app.globalData.shopComments({
						page: 1,
						"shop_id": shop_id,
						'type': commenttype,
						"is_null": isnull
					}, function(res) {
						if (res.error == '0') {
							var comment_list = res.data.items;

							for (var i = 0; i < comment_list.length; i++) {
								comment_list[i].reply_time = app.globalData.getLocalTime(comment_list[i]
									.reply_time);
								comment_list[i].dateline = app.globalData.getLocalTime(comment_list[i]
									.dateline);
							}

							that.evaluate = res.data.detail
							that.switchnav = res.data.switchnav
							that.comm = comm
							that.pjDetail = comment_list
							that.commentpage = 1
						} else {
							uni.showToast({
								title: res.message
							});
						}
					});
				} else {
					isnull = '';
					comm = false;
					var that = this;
					app.globalData.shopComments({
						page: 1,
						"shop_id": shop_id,
						'type': commenttype,
						'is_null': isnull
					}, function(res) {
						if (res.error == '0') {
							var comment_list = res.data.items;

							for (var i = 0; i < comment_list.length; i++) {
								comment_list[i].reply_time = app.globalData.getLocalTime(comment_list[i]
									.reply_time);
								comment_list[i].dateline = app.globalData.getLocalTime(comment_list[i]
									.dateline);
							}

							that.evaluate = res.data.detail
							that.switchnav = res.data.switchnav
							that.pjDetail = comment_list
							that.comm = comm
							that.commentpage = 1
							that.loadhide = true
							that.morehidden = true
						} else {
							uni.showToast({
								title: res.message
							});
						}
					});
				}
			},
			//商家评价加载更多
			more: function() {
				if (this.tabIndex == 1) {
					var page = this.commentpage;
					var that = this; //数据筛选

					app.globalData.shopComments({
						page: page,
						"shop_id": shop_id,
						'type': commenttype,
						'is_null': isnull
					}, function(res) {
						if (res.error == '0') {
							var comment_list = res.data.items;

							for (var i = 0; i < comment_list.length; i++) {
								comment_list[i].reply_time = app.globalData.getLocalTime(comment_list[i]
									.reply_time);
								comment_list[i].dateline = app.globalData.getLocalTime(comment_list[i]
									.dateline);
							}

							if (page == 1) {
								if (comment_list.length > 0) {
									page++;
									that.commentpage = page
									that.loadhide = false
									that.morehidden = true
								} else {
									that.commentpage = page
									that.loadhide = true
									that.morehidden = true
								}

							} else {
								if (comment_list.length > 0) {
									page++;
									that.pjDetail = that.pjDetail.concat(comment_list)
									that.commentpage = page
									that.loadhide = false
									that.morehidden = true
								} else {
									that.commentpage = page
									that.loadhide = true
									that.morehidden = false
								}

								;
							}

							;
						} else {
							uni.showToast({
								title: res.message
							});
						}

						;
					});
				}
			},

			//查看评价图片
			previewimage(e) {
				// console.log(e.currentTarget.dataset.pics);
				var picidx = e.currentTarget.dataset.inidx;
				var pics = e.currentTarget.dataset.pics;
				var currenturl = pics[picidx].photo;
				var urls = [];

				for (var i = 0; i < pics.length; i++) {
					urls.push(pics[i].photo);
				}

				uni.previewImage({
					current: currenturl,
					urls: urls
				});
			},

			//资质实景图查看；
			previewpic: function(e, pics) {
				var picidx = e.currentTarget.dataset.picidx;
				var currenturl = pics[picidx];
				var urls = [];

				for (var i = 0; i < pics.length; i++) {
					urls.push(pics[i]);
				}

				uni.previewImage({
					current: currenturl,
					urls: urls
				});
			},

			preview_zizhi(e) {
				var pics = this.xinxi.verify;
				this.previewpic(e, pics);
			},

			preview_shijing(e) {
				var pics = this.xinxi.album;
				this.previewpic(e, pics);
			},


			bindscrollIn: function(e) {
				let top = e.detail.scrollTop;
				let scrollTop = top >= 20 ? 2000 : 0;
				let that = this;
				if (this.recommend_height < scrollTop && !this.page_scrolling) {
					this.page_scrolling = true;
					uni.pageScrollTo({
						scrollTop: scrollTop,
						duration: 500,
						complete: function() {
							that.recommend_height = scrollTop;
							that.page_scrolling = false;
						}
					});
				}
				for (let i = 0, len = goods_item_height.length; i < len; i++) {
					if (top <= goods_item_height[i]) {
						if (this.tab_list_index_id != i) {
							this.tab_list_index_id = i;
							this.tab_list_index_id = i
							this.goodsCate_idx = this.goodsCate[i].cate_id
						}
						break;
					}
				}

				return;
			},
			jisuan: function(callback) {
				//选择id
				var query = uni.createSelectorQuery();
				setTimeout(function() {
					query.select('#recommend').boundingClientRect();
					query.exec(res => {
						addr_h = res[0].height;
						callback();
					});
				}, 200);
			},
			tipsOff: function() {
				this.tipsShow = false;
			},

			maopao() {},

			hideMask() {
				this.cartShow = false
				this.couShow = false
				this.shareShow = false
			},

			onShareTimeline: function() {
				app.globalData.shareimeline('微信小程序外卖', '/pages/shoptail/shoptail?id=' + shop_id);
			},

			//绘制海报，将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
			createNewImg(bool) {
				// var that = this,
				//     topInfo = that.data.topInfo;
				if (bool) {
					this.shareShow = true;
				}

				if (this.share_pic !== '') return;

				if (bool) {
					uni.showLoading({
						title: '正在生成分享图'
					});
				}

				try {
					//海报尺寸
					const systemInfo = uni.getSystemInfoSync(); // 计算比例

					let windowWidth = systemInfo.windowWidth;
					let proportion = 500 / 750;
					let height_proportion = 500 / 600;
					windowWidth = windowWidth * proportion;
					let windowHeight = windowWidth / height_proportion;
					this.posterHeight = windowHeight
					this.posterWidth = windowWidth

					const ctx = uni.createCanvasContext('shareImg'); // 绘制背景

					ctx.setFillStyle('#ffffff');
					ctx.fillRect(0, 0, windowWidth, windowHeight);
					ctx.draw(true); // 绘制中心icon背景

					ctx.setFillStyle('#ffffff');
					let icon_rdu = 30 / 500 * windowWidth;
					ctx.lineJoin = "round";
					ctx.lineWidth = icon_rdu;
					let icon_width = windowWidth * 0.396;
					ctx.fillRect((windowWidth - icon_width) / 2, icon_rdu, icon_width, icon_width);
					ctx.draw(true); // 绘制中心icon图片

					icon_width = windowWidth * 0.252;
					uni.downloadFile({
						url: this.topInfo.logo,
						success: logo => {
							console.log(logo);

							if (logo.statusCode !== 200) return this.failedgenerateshareimage();
							ctx.drawImage(logo.tempFilePath, (windowWidth - icon_width) / 2, windowWidth *
								0.08, icon_width, icon_width);
							ctx.draw(true); // 绘制商家标题

							let title = this.topInfo.title;

							title = text_substring(title);
							ctx.setFontSize(windowWidth * 0.056);
							ctx.setFillStyle('#2D2D2D');
							let top_height = windowWidth * 0.42;
							ctx.fillText(title, (windowWidth - ctx.measureText(title).width) / 2, top_height);
							ctx.draw(true); // 绘制满减

							// let activity = this.topInfo.huodong;

							// activity = activity.splice(0, 3);
							// top_height += windowWidth * 0.05;
							// let activity_fontsize = windowWidth * 0.052;

							// for (let i = 0, len = activity.length; i < len; i++) {
							// 	ctx.setFontSize(activity_fontsize);
							// 	ctx.setFillStyle('#6D7278');
							// 	title = activity[i].title.split("");
							// 	let temp = "",
							// 		row = [];
							// 	for (var a = 0; a < title.length; a++) {
							// 		console.log(temp);

							// 		if (ctx.measureText(temp).width < windowWidth * .8) {
							// 			temp += title[a];
							// 		} else {
							// 			a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比

							// 			row.push(temp);
							// 			temp = "";
							// 		}
							// 	}
							// 	row.push(temp); //如果数组长度大于2 则截取前两个
							// 	if (row.length > 2) {
							// 		var rowCut = row.slice(0, 2);
							// 		var rowPart = rowCut[1];
							// 		var test = "";
							// 		var empty = [];
							// 		for (var a = 0; a < rowPart.length; a++) {
							// 			if (ctx.measureText(test).width < windowWidth * .8) {
							// 				test += rowPart[a];
							// 			} else {
							// 				break;
							// 			}
							// 		}
							// 		empty.push(test);
							// 		var group = empty[0] + "...";
							// 		rowCut.splice(1, 1, group);
							// 		row = rowCut;
							// 	}
							// 	top_height += activity_fontsize * 1.2;
							// 	for (var b = 0; b < row.length; b++) {
							// 		top_height = top_height + b * activity_fontsize * 1.2;
							// 		ctx.fillText(row[b], (windowWidth - ctx.measureText(row[b]).width) / 2,
							// 			top_height);
							// 	}
							// 	ctx.draw(true);
							// 	top_height += activity_fontsize * .1;
							// }


							icon_width = windowWidth * 0.5;
							// "/static/image/sharecode/formaledition_code.jpg" this.sheraImg
							ctx.drawImage(this.sheraImg, (windowWidth -
								icon_width) / 2, windowWidth * 0.5, icon_width, icon_width);

							ctx.draw(true); // 将图片保存本地设置临时路径

							let that = this,
								num_count = 0;
							setTimeout(() => {
								canvasToTempFilePath();
							}, 500);

							function canvasToTempFilePath() {
								num_count++;
								uni.canvasToTempFilePath({
									canvasId: 'shareImg',
									success: shareImg => {
										console.log('生成成功', shareImg);
										uni.hideLoading();
										that.share_pic = shareImg.tempFilePath
										that.shareShow = true
									},
									fail: e => {
										console.log(e, num_count);
										return num_count > 3 ? that.failedgenerateshareimage() :
											canvasToTempFilePath();
									}
								}, that);
							}
						},
						fail: e => {
							console.log(e);
							this.failedgenerateshareimage();
						}
					});
				} catch (error) {
					console.log(error);
					this.failedgenerateshareimage();
				}

				function text_substring(text) {
					return text.length > 15 ? text.substring(0, 15) + '...' : text;
				}
			},

			failedgenerateshareimage() {
				this.share_pic = ''
				this.shareShow = false
				uni.hideLoading();
				uni.showToast({
					title: '生成分享图失败',
					icon: 'none',
					duration: 2000
				});
			},

			//保存海报
			savePoster() {
				var that = this,
					imgSrc = that.share_pic;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',

								success(rs) {

									//图片保存到本地
									uni.saveImageToPhotosAlbum({
										filePath: imgSrc,
										success: function(data) {
											uni.showToast({
												title: '保存成功',
												icon: 'success',
												duration: 2000
											});
										},
										fail: function(err) {
											console.log(err);

											if (err.errMsg ===
												"saveImageToPhotosAlbum:fail auth deny") {
												console.log("当初用户拒绝，再次发起授权");
												uni.pubOpenSetting(true, "openSetting");
											}
										}
									});
								},

								fail(er) {
									uni.saveImageToPhotosAlbum({
										filePath: imgSrc,
										success: function(data) {
											uni.showToast({
												title: '保存成功',
												icon: 'success',
												duration: 2000
											});
										},
										fail: function(err) {
											console.log(err);

											if (err.errMsg ===
												"saveImageToPhotosAlbum:fail auth deny") {
												console.log("当初用户拒绝，再次发起授权");
												uni.pubOpenSetting(true, "openSetting");
											}
										}
									}); //     },
									// });
								}

							});
						} else {
							//图片保存到本地
							uni.saveImageToPhotosAlbum({
								filePath: imgSrc,
								success: function(data) {
									uni.showToast({
										title: '保存成功',
										icon: 'success',
										duration: 2000
									});
								},
								fail: function(err) {
									console.log(err);

									if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
										console.log("当初用户拒绝，再次发起授权");
										uni.pubOpenSetting(true, "openSetting");
									}
								}
							}); //     },
							// });
						}
					},

					fail(err) { // console.log(err);
					}

				});
			},

			//关闭海报
			shareWayMaskShow() {
				if (this.shareShow) {
					this.shareShow = false;
				} else {
					this.createNewImg(true); //海报
				}

				;
			},

			//授权
			closeSetting() {
				uni.pubOpenSetting(false);
			},

			tosearch() {
				console.log("占位：函数 tosearch 未声明");
			}

		}
	};
</script>
<style>
	.newbeyond {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		display: inline-block;
		max-width: 260rpx;
		color: #262628;
		font-size: 32rpx;
		font-weight: bold;
	}

	.beyond {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		display: inline-block;
	}

	/* pages/shoptail/shoptail.wxss */
	pages {
		background: #F5F7FA;
	}

	.topInfo {
		background: #F5F7FA;
		height: 274rpx;
		position: relative;
	}

	.topInfo .info {
		overflow: hidden;
		width: 690rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 auto;
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
		line-height: 36rpx;
	}

	.topInfo .info .img {
		width: 198rpx;
		height: 198rpx;
		background: #fcfcfc;
		overflow: hidden;
		border-radius: 6rpx;
		position: relative;
	}

	.topInfo .info .img image {
		width: 198rpx;
		height: 198rpx;
	}

	.topInfo .info .img .state {
		width: 100%;
		line-height: 40rpx;
		height: 40rpx;
		font-size: 24rpx;
		text-align: center;
		color: #fff;
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
	}

	.topInfo .info .img .state1 {
		background: #ff797c;
	}

	.topInfo .info .img .state2 {
		background: #999999;
	}

	.topInfo .info .wz_box {
		width: 476rpx;
		height: 198rpx;
		color: #fff;
	}

	.topInfo .info .wz_box .tit {
		font-size: 32rpx;
		height: 48rpx;
		color: #262628;
		display: flex;
		align-items: center;
	}

	.topInfo .info .wz_box .tit>.state_new {
		width: 74rpx;
		height: 34rpx;
		border: 1rpx solid #FF797C;
		color: #FF797C;
		border-radius: 8rpx;
		font-size: 20rpx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.state_new2 {
		border: 1rpx solid #999999;
		color: #999999;
	}

	.topInfo .info .wz_box .txt .del {
		font-size: 22rpx;
		position: relative;
		color: #999;
		margin-left: 10rpx;
		text-decoration: line-through;
	}

	/* .topInfo .info .wz_box .txt .del:after {
    content: '';
    width: 100%;
    height: 2rpx;
    background: #999;
    position: absolute;
    left: 0;
    top: 50%;
} */

	.open_state text {
		font-size: 22rpx;
		color: #fff;
		line-height: 32rpx;
		margin: 0 0 10rpx;
	}

	.topInfo .hd {
		overflow: hidden;
		color: #6D7278;
		font-size: 24rpx;
		width: 690rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}

	.topInfo .hd .wz {
		margin-right: 160rpx;
	}

	.topInfo .hd .wz .ico {
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

	.topInfo .notice {
		width: 100%;
		line-height: 48rpx;
		display: flex;
		font-size: 24rpx;
		color: #A3A3A4;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		font-weight: 500;
		margin-top: 10rpx;
		-webkit-box-orient: vertical;
	}

	.topInfo .notice .ico {
		width: 32rpx;
		height: 28rpx;
		margin-right: 8rpx;
		vertical-align: sub;
	}

	.topInfo .collect {
		width: 44rpx;
		height: 44rpx;
		position: absolute;
		right: 30rpx;
	}

	.topInfo .share {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 76rpx;
	}

	.topInfo .search {
		width: 44rpx;
		height: 44rpx;
		position: absolute;
		right: 94rpx;
	}

	.tabBox {
		width: 100%;
		height: 88rpx;
		background: #fff;
		overflow: hidden;
		box-sizing: border-box;
		/* border-bottom: 2rpx solid #e6e6e6; */
		display: flex;
		align-items: center;
		box-shadow: 0px -16rpx 16rpx 0px rgba(213, 225, 236, 0.09);
		border-radius: 30rpx 30rpx 0px 0px;
	}

	.tabBox .list {
		font-size: 28rpx;
		height: 40rpx;
		position: relative;
		margin: 0 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #A3A3A4;
	}

	.tabBox .list.on {
		color: #FF797C;
	}

	.tabBox .list.on:after {
		content: '';
		width: 32rpx;
		height: 4rpx;
		background: #FF797C;
		position: absolute;
		left: 50%;
		bottom: -10rpx;
		margin-left: -16rpx;
	}

	.noticeMask {
		background: rgba(0, 0, 0, 0.7);
		position: fixed;
		z-index: 101;
		left: 0;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		width: 100%;
		height: 100%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding: 60rpx 60rpx 200rpx;
		color: #fff;
		overflow: hidden;
	}

	/*   #ifdef  MP-ALIPAY || H5   */
	.noticeMask {
		padding: 100rpx 60rpx 200rpx;
	}

	/*   #endif   */
	.noticeMask .top {
		text-align: center;
	}

	.noticeMask .title {
		font-size: 32rpx;
		line-height: 60rpx;
		margin-top: 48rpx;
	}

	.noticeMask .state {
		display: inline-block;
		color: #fff;
		line-height: 40rpx;
		padding: 0 16rpx;
		border-radius: 4rpx;
		margin: 20rpx 0;
	}

	.noticeMask .state1 {
		background: #ff797c;
	}

	.noticeMask .state2 {
		background: #999999;
	}

	.noticeMask .evlt_star_bg {
		display: block;
		width: 150rpx;
		height: auto;
		text-align: left;
		margin: 0 auto;
	}

	.noticeMask .evlt_star_bg image {
		width: 150rpx;
		height: 22rpx;
	}

	.noticeMask .bt {
		text-align: center;
		font-size: 36rpx;
		line-height: 60rpx;
		margin: 20rpx 0;
		position: relative;
	}

	.noticeMask .bt:before {
		content: '';
		width: 30%;
		height: 4rpx;
		background: #fff;
		position: absolute;
		left: 5%;
		top: 50%;
		margin-top: -2rpx;
	}

	.noticeMask .bt:after {
		content: '';
		width: 30%;
		height: 4rpx;
		background: #fff;
		position: absolute;
		right: 5%;
		top: 50%;
		margin-top: -2rpx;
	}

	.noticeMask .wz {
		margin: 16rpx 0;
		line-height: 32rpx;
	}

	.noticeMask .wz .ico {
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

	.noticeMask .close {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		left: 50%;
		margin-left: -50rpx;
		bottom: 50rpx;
	}

	/*领取优惠券*/
	.shopCoupon {
		margin: 20rpx 20rpx 30rpx;
		background: #ff4848;
		border-radius: 8rpx;
		color: #fff;
	}

	.shopCoupon .price {
		width: 130rpx;
		text-align: center;
		color: #fff;
	}

	.shopCoupon .price .big {
		font-size: 40rpx;
	}

	.shopCoupon .pub_list_bd {
		border-left: 2rpx dotted #ff7878;
		position: relative;
		padding: 20rpx;
	}

	.shopCoupon .pub_list_bd:before {
		content: '';
		display: block;
		width: 14rpx;
		height: 14rpx;
		background: #fff;
		border-radius: 100%;
		position: absolute;
		left: -8rpx;
		top: -10rpx;
	}

	.shopCoupon .pub_list_bd:after {
		content: '';
		display: block;
		width: 14rpx;
		height: 14rpx;
		background: #fff;
		border-radius: 100%;
		position: absolute;
		left: -8rpx;
		bottom: -10rpx;
	}

	.shopCoupon .pub_list_bd .bt {
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 500;
		margin-bottom: 8rpx;
	}

	.shopCoupon .btn {
		border: 2rpx solid #fff;
		border-radius: 40rpx;
		line-height: 44rpx;
		padding: 0 10rpx;
		color: #fff;
		margin-right: 20rpx;
	}

	/*规格*/
	.specMask {
		position: fixed;
		z-index: 21;
		left: 50%;
		top: 50%;
		background: #fff;
		border-radius: 6rpx;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		overflow: hidden;
		width: 80%;
	}

	.specMask .close {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}

	.specMask .tit {
		text-align: center;
		font-size: 32rpx;
		line-height: 40rpx;
		padding: 30rpx 80rpx 14rpx;
	}

	.specMask .discount {
		overflow: hidden;
		margin: 0 30rpx;
	}

	.specMask .discount .zhe {
		border: 2rpx solid #FF4848;
		border-radius: 4rpx;
	}

	.specMask .discount .zhe .one {
		background: #FF4848;
		color: #fff;
		padding: 0 8rpx;
	}

	.specMask .discount .zhe .two {
		color: #FF4848;
		padding: 0 8rpx;
	}

	.specMask .discount .shu {
		color: #ff797c;
		background: #feb;
		padding: 0 8rpx;
		margin-left: 12rpx;
	}

	.specMask .bottom {
		overflow: hidden;
		background: #f5f5f5;
		padding: 20rpx;
	}

	.specMask .bottom .price {
		font-size: 40rpx;
		color: #f60;
	}

	.specMask .bottom .price text {
		font-size: 24rpx;
	}

	.specMask .bottom .goods_int_box {
		position: relative;
		right: auto;
		bottom: auto;
		background: none;
	}

	.specMask .cont {
		padding: 0 30rpx 30rpx;
		max-height: 500rpx;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		-webkit-overflow-scrolling: touch
	}

	.specMask .cont .spec_bt {
		font-size: 28rpx;
		line-height: 40rpx;
		margin: 16rpx 0;
	}

	.specMask .cont .spec_list {
		overflow: hidden;
	}

	.specMask .cont .spec_list .list {
		float: left;
		padding: 4rpx 24rpx;
		line-height: 40rpx;
		border: 2rpx solid #e6e6e6;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #333;
		margin: 0 16rpx 16rpx 0;
	}

	.specMask .cont .spec_list .list.on {
		border-color: #ff797c;
		background: #f1fcf1;
		color: #ff797c;
	}

	.specMask .cont .attr {
		background: #edf2f5;
		padding: 4rpx 0 8rpx 16rpx;
		border-radius: 6rpx;
	}

	.specMask .cont .attr .bt {
		line-height: 40rpx;
		margin: 16rpx 0;
	}

	.is_texitea {
		width: 690rpx;
		background: #FFFFFF;
		border-bottom: 1rpx rgba(208, 212, 227, 0.27) solid;
		padding: 18rpx 0 18rpx 60rpx;
		line-height: 32rpx;
		color: #2D2D2D;
		font-size: 32rpx;
		font-weight: 600;
	}

	/*商品页*/
	.goodsListBox {
		width: 100%;
		height: 100vh;
		left: 0;
		top: 320rpx;
		background: #fff;
		padding-bottom: 100rpx;
		box-sizing: border-box;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.goodsCate {
		width: 150rpx;
		height: 100%;
		background: #ffffff;
		float: left;
		position: relative;
		z-index: 0;
		padding: 35rpx 0 100rpx;
	}

	.goodsCate .list {
		padding: 35rpx 16rpx 35rpx 20rpx;
		position: relative;
		/* border-bottom: 1px solid #e6e6e6; */
		line-height: 36rpx;
		color: #A3A3A4;
		font-weight: 600;
		font-size: 28rpx
	}

	.goodsCate .list.on {
		/* background: #fff; */
		color: #FF797C;
	}

	/* .goodsCate .list.on:before {
    content: '';
    width: 3px;
    height: 100%;
    background: #65bc05;
    position: absolute;
    left: 0;
    top: 0;
} */

	.goodsCate .list image {
		width: 16px;
		height: 16px;
		vertical-align: middle;
		margin-right: 6rpx;
	}

	.goodsCate .list .num {
		position: absolute;
		right: 4rpx;
		top: 4rpx;
		min-width: 24rpx;
		height: 24rpx;
		border-radius: 20rpx;
		text-align: center;
		font-size: 20rpx;
		color: #fff;
		background: #ff9900;
		line-height: 24rpx;
	}

	.goodsList_right {
		width: calc(100% - 150rpx);
		height: 100%;
		background: #fff;
		box-sizing: border-box;
		float: right;
		position: relative;
		z-index: 1;
		padding-bottom: 30rpx;
	}

	.cateTit_top {
		background: #f4f4f4;
		height: 52rpx;
		line-height: 52rpx;
		padding: 0 24rpx;
		border-left: 2px solid #e6e6e6;
		color: #666;
		position: fixed;
		left: 150rpx;
		top: 320rpx;
		right: 0;
		z-index: 2;
	}

	.goodsListBox .list_box {
		background: #fff;
		padding-bottom: 20rpx;
	}

	.cateTit {
		/* background: #f4f4f4; */
		font-size: 32rpx;
		color: #2D2D2D;
		height: 45rpx;
		line-height: 45rpx;
		padding: 0 24rpx;
		font-weight: 600;
		margin-bottom: 24rpx;
	}

	.goodsList {

		margin: 0 0 24rpx 20rpx;
		position: relative;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;

		height: 248rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 40rpx 0px rgba(163, 163, 164, 0.1);
		border-radius: 24rpx;
	}

	.goodsList:last-child {
		border-bottom: 0;
	}

	.goodsList .img {
		width: 198rpx;
		height: 248rpx;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.goodsList .wz_box {
		margin-left: 214rpx;
		position: relative;
		min-height: 248rpx;
		overflow: hidden;
		color: #A3A3A4;
	}

	.goodsList .wz_box .tit {
		font-size: 32rpx;
		line-height: 34rpx;
		margin-bottom: 6rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		text-overflow: -o-ellipsis-lastline;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		max-width: 360rpx;
		color: #262628;
		height: 80rpx;
		margin-top: 30rpx;
	}

	.goodsList .wz_box .txt {
		font-size: 22rpx;
		line-height: 40rpx;
		color: #A3A3A4;
		margin-left: 30rpx;
	}

	.goodsList .wz_box .price {
		font-size: 28rpx;
		line-height: 40rpx;
		/* color: #ff9900; */
		color: #FF797C;
		margin-top: 12rpx;
	}

	.goodsList .wz_box .price text {
		font-size: 24rpx;
	}

	.goodsList .wz_box .del {
		color: #999;
		position: relative;
		font-size: 20rpx;
	}

	.goodsList .wz_box .del:after {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 2rpx;
		background: #999;
	}

	.goodsList .wz_box .discount {
		overflow: hidden;
	}

	.goodsList .wz_box .discount .zhe {
		border: 2rpx solid #FF4848;
		border-radius: 4rpx;
	}

	.goodsList .wz_box .discount .zhe .one {
		background: #FF4848;
		color: #fff;
		padding: 0 8rpx;
	}

	.goodsList .wz_box .discount .zhe .two {
		color: #FF4848;
		padding: 0 8rpx;
	}

	.goodsList .wz_box .discount .shu {
		color: #ff797c;
		background: #feb;
		padding: 0 8rpx;
		margin-left: 12rpx;
	}

	.goodsList .spec {
		position: absolute;
		right: 20rpx;
		bottom: 22rpx;
		font-size: 24rpx;
		line-height: 52rpx;
		padding: 0 20rpx;
		color: #fff;
		border-radius: 52rpx;
		background: #ff797c;
	}

	.goodsList .spec .num {
		position: absolute;
		right: -8rpx;
		top: -12rpx;
		min-width: 24rpx;
		height: 24rpx;
		border-radius: 20rpx;
		text-align: center;
		font-size: 20rpx;
		color: #fff;
		background: #ff9900;
		line-height: 24rpx;
	}

	.goodsList .goods_int_box {
		position: absolute;
		right: 20rpx;
		bottom: 22rpx;
		background-color: #fff;
	}

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

	.goods_footer {
		height: 140rpx;
		background: #FF797C;
		border-radius: 30rpx 30rpx 0 0;
		position: fixed;
		z-index: 12;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.goods_footer_s {
		margin-left: 30rpx;
		margin-right: 40rpx;
		width: 654rpx;
		height: 76rpx;
		/* background-color: red; */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods_footer_s_num {
		background: #FFFFFF;
		border-radius: 24rpx;
		height: 76rpx;
		width: 76rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #FF797C;
		margin-right: 26rpx;
	}

	.goods_footer_s_ti1 {
		display: flex;
		align-items: center;
		height: 40rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		margin-bottom: 4rpx;
	}

	.goods_footer_s_ti2 {
		display: flex;
		align-items: center;
		height: 32rpx;
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.goods_footer_s_btn {
		width: 180rpx;
		height: 76rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #3B96B1;
	}

	.goods_footer_s_btn_op {
		opacity: .8;
	}

	.goods_footer_s_btn_disabled {
		pointer-events: none;
		cursor: not-allowed;
		background: #E0E0E0 !important;
		color: #999999 !important;
	}

	.goods_footer_s_btn_extra {
		width: 180rpx;
		height: 76rpx;
		background: #3B96B1;
		border-radius: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #FFFFFF;
		margin-left: 16rpx;
	}

	.goods_footer .cart {
		margin-left: 16rpx;
		margin-top: -12rpx;
		position: relative;
	}

	.goods_footer .cart .num {
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		color: #FF797C;
		background: #ffffff;
		font-weight: bold;
	}

	.goods_footer .cart,
	.goods_footer .cart image {
		height: 100rpx;
		width: 100rpx;
	}

	.goods_footer .wz_box {
		margin-left: 20rpx;
		line-height: 40rpx;
		padding-top: 8rpx;
	}

	.goods_footer .wz_box .price {
		font-size: 32rpx;
		line-height: 40rpx;
		color: #ff9900;
	}

	.goods_footer .wz_box .price small {
		font-size: 24rpx;
		color: #999;
		position: relative;
		margin-left: 8rpx;
	}

	.goods_footer .wz_box .price small:after {
		content: '';
		width: 100%;
		height: 2rpx;
		background: #999;
		position: absolute;
		left: 0;
		top: 50%;
	}

	.goods_footer .btn {
		width: 228rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
		background: #f60;
	}

	.goods_footer .btn2 {
		background: #aaa;
		font-size: 26rpx;
	}

	/*购物车*/
	.goods_cart {
		background: #fff;
		width: 100%;
		position: fixed;
		z-index: 11;
		left: 0;
		bottom: 140rpx;
		max-height: calc(80% - 200rpx);
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		transform: translate(0, 100%);
		-webkit-transform: translate(0, 100%);
		transition: all 0.5s ease;
		-webkit-transition: all 0.5s ease;
	}

	.goods_cart.show {
		transform: translate(0, 0);
		-webkit-transform: translate(0, 0);
	}

	.goods_cart .tit_box {
		background: #edf2f5;
		padding: 20rpx 20rpx;
		height: 40rpx;
		position: sticky;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.goods_cart .tit_box .tit {
		font-size: 32rpx;
		line-height: 40rpx;
		border-left: 6rpx solid #FF797C;
		padding-left: 20rpx;
	}

	.goods_cart .tit_box .clear_btn {
		font-size: 24rpx;
		line-height: 40rpx;
		color: #333;
	}

	.goods_cart .tit_box .clear_btn .ico {
		width: 24rpx;
		height: 28rpx;
		vertical-align: middle;
		margin-right: 8rpx;
	}

	.goods_cart .list {
		padding: 28rpx 24rpx;
		line-height: 48rpx;
		border-bottom: 1px solid #e6eaed;
	}

	.goods_cart .list:last-child {
		border-bottom: 0;
	}

	.goods_cart .list .price {
		width: 200rpx;
		color: #FF797C;
		text-align: right;
		padding-right: 20rpx;
	}

	.goods_cart .list .price .old {
		font-size: 18rpx;
		color: #999;
		position: relative;
	}

	.goods_cart .list .price .old:after {
		width: 100%;
		height: 2rpx;
		background: #999;
		position: absolute;
		left: 0;
		top: 50%;
		content: '';
	}

	.goods_cart .list .bt {
		margin-right: 360rpx;
	}

	.goods_cart .list .bt:before {
		content: '';
		background: #FF797C;
		width: 10rpx;
		height: 10rpx;
		border-radius: 100%;
		display: inline-block;
		margin-right: 16rpx;
	}

	/*自提浮层*/
	.zitiFixed {
		display: block;
		width: 120rpx;
		height: 60rpx;
		text-align: center;
		position: fixed;
		z-index: 10;
		right: 30rpx;

	}

	.zitiFixed text {
		color: #333;
		font-size: 24rpx;
		line-height: 44rpx;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
	}

	.zitiFixed image {
		width: 120rpx;
		height: 60rpx;
	}

	/*优惠提示计算悬浮*/
	.countTipsFixed {
		display: block;
		background: rgba(255, 240, 209, 0.93);
		line-height: 64rpx;
		height: 64rpx;
		font-size: 24rpx;
		text-align: center;
		color: #333;
		position: fixed;
		z-index: 1;
		left: 0;
		bottom: 140rpx;
		width: 100%;
	}

	.countTipsFixed text {
		color: #ff797c;
		font-size: 28rpx;
	}

	.countTipsFixed image {
		width: 14rpx;
		height: 24rpx;
		margin-left: 12rpx;
	}

	/* 快速导航 */
	.shangcheng-links-fixed {
		position: fixed;
		z-index: 1;
		right: 0;
		bottom: 300rpx;
		padding-left: 104rpx;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		transform: translate(calc(100% - 104rpx), 0);
		-webkit-transform: translate(calc(100% - 104rpx), 0);
		transition: all 0.2s ease-in-out;
		-webkit-transition: all 0.2s ease-in-out;
	}

	.shangcheng-links-fixed.on {
		transform: translate(0%, 0);
		-webkit-transform: translate(0%, 0);
	}

	.shangcheng-links-fixed .open {
		width: 104rpx;
		height: 80rpx;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border-radius: 8rpx 0 0 8rpx;
		background: rgba(0, 0, 0, 0.60);
		padding-left: 44rpx;
		padding-top: 8rpx;
		line-height: 32rpx;
		color: #fff;
		font-size: 24rpx;
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -40rpx;
	}

	.shangcheng-links-fixed .open .jt {
		position: absolute;
		left: 8rpx;
		top: 50%;
		width: 28rpx;
		height: 26rpx;
		margin-top: -12rpx;
	}

	.shangcheng-links-fixed .list_box {
		background: #fff;
		padding: 12rpx 0 4rpx;
		border-radius: 8rpx 0 0 8rpx;
		overflow: hidden;
	}

	.shangcheng-links-fixed .list_box .linkto {
		display: block;
		float: left;
		width: 104rpx;
		text-align: center;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #666;
		padding: 0 4rpx;
	}

	.shangcheng-links-fixed .list_box .linkto .img {
		height: 40rpx;
		line-height: 0;
	}

	.shangcheng-links-fixed .list_box .linkto .img .tu {
		width: 36rpx;
		height: 36rpx
	}

	/* 商家广告 */
	.shopAdv {
		margin: 20rpx 20rpx 10rpx;
	}

	.shopAdv image {
		display: block;
		width: 100%;
		height: 142rpx;
		margin-bottom: 20rpx;
	}

	/*商家推荐*/
	.recommend {
		padding: 40rpx 0 30rpx 60rpx;
		overflow: visible;
	}

	.recommend .bt {
		font-size: 32rpx;
		color: #2D2D2D;
		line-height: 45rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
	}

	.recommend .list_box {
		width: 100%;
		white-space: nowrap;
		overflow: visible;
	}

	.recommend .lists {
		display: inline-block;
		margin-right: 20rpx;
		position: relative;
		overflow: visible;
		width: 360rpx;
		height: 270rpx;
		/* background: #FACD5D linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.58) 100%); */
		border-radius: 24rpx;
	}

	.recommend .banck_div {
		width: 360rpx;
		height: 270rpx;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.58) 100%);
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 24rpx;
	}

	.recommend .lists .pic {
		width: 360rpx;
		height: 270rpx;
		border-radius: 24rpx;
		position: absolute;

	}

	.recommend .lists .title {
		position: absolute;
		left: 16rpx;
		bottom: 60rpx;
		font-size: 28rpx;
		color: #ffffff;

	}

	.recommend .lists .price {
		font-size: 28rpx;
		left: 16rpx;
		bottom: 24rpx;
		color: #ffffff;
		left: 16rpx;
		position: absolute;
	}

	.recommend .lists .price .small {
		font-size: 24rpx;
	}

	.recommend .lists>.goods_int_box {
		position: absolute;
		right: 16rpx;
		bottom: 24rpx;

	}

	.recommend .lists .spec {
		position: absolute;
		right: 4rpx;
		bottom: 4rpx;
		font-size: 24rpx;
		line-height: 52rpx;
		padding: 0 20rpx;
		color: #fff;
		border-radius: 52rpx;
		background: #ff797c;
	}

	.recommend .lists .spec .num {
		position: absolute;
		right: 0rpx;
		top: 0rpx;
		min-width: 24rpx;
		height: 24rpx;
		border-radius: 20rpx;
		text-align: center;
		font-size: 20rpx;
		color: #fff;
		background: #ff9900;
		line-height: 24rpx;
	}

	/*评价*/
	.xiangqing {
		height: calc(100% - 336rpx);
	}

	.xiangqing .ctn1 {
		height: 100%;
	}

	.xiangqing .content_wrap {
		height: 100%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		overflow-x: hidden;
		background: #FFFFFF;
	}

	.xiangqing .ctn1 .pingfen {
		background: #fff;
		padding: 20rpx 0;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.ctn1 .starBg {
		margin-right: 30rpx;
	}

	.xiangqing .ctn1 .pingfen .left {
		text-align: center;
		padding: 0 40rpx;
	}

	.xiangqing .ctn1 .pingfen .fenshu {
		color: #f90;
	}

	.xiangqing .ctn1 .pingfen .left .number {
		font-size: 40rpx;
		color: #f30;
		padding-bottom: 20rpx;
	}

	.xiangqing .ctn1 .pingfen .left .ping {
		font-size: 28rpx;
		padding-bottom: 10rpx;
	}

	.xiangqing .ctn1 .pingfen .pingfenStar {
		flex: 1;
		text-align: center;
	}

	.xiangqing .ctn1 {
		padding: 30rpx;
		background: #fff;
	}

	.xiangqing .ctn1 .sj_Pingjia {
		padding: 16rpx 0 24rpx;
		/* background: #fff; */
	}

	.xiangqing .ctn1 .sj_Pingjia .qiehuan {
		padding-bottom: 24rpx;
		box-shadow: 0px 8rpx 10rpx 0px rgba(208, 212, 227, 0.27);

	}

	.xiangqing .ctn1 .sj_Pingjia .switchNav {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 30rpx;

	}

	.xiangqing .ctn1 .box {
		position: relative;
	}

	.xiangqing .ctn1 .createTime {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}

	.xiangqing .ctn1 .shopreply {
		font-size: 28rpx;
		background: #eee;
		color: #666;
		margin-top: 20rpx;
		padding: 20rpx;
		position: relative;
		border-radius: 6rpx;
	}

	.xiangqing .ctn1 .shopreply view {
		word-wrap: break-word;
	}

	.xiangqing .ctn1 .shopreply:after {
		content: '';
		display: block;
		position: absolute;
		border: 16rpx solid transparent;
		border-bottom-color: #eee;
		left: 20rpx;
		top: -24rpx;
	}

	.xiangqing .ctn1 .shopreply view {
		padding-bottom: 20rpx;
	}

	.xiangqing .ctn1 .shopreply view text {
		font-size: 24rpx;
	}

	.xiangqing .ctn1 .sj_Pingjia .switchNav view {
		padding: 4rpx 10rpx;
		text-align: center;
		border: 1rpx solid #037E98;
		color: #037E98;
		border-radius: 8rpx;
		margin-bottom: 16rpx;
		font-size: 22rpx;
	}

	.xiangqing .ctn1 .sj_Pingjia .switchNav .switchNav-active {
		background-image: linear-gradient(1deg, #00656B 0%, #037E98 100%);
		color: #fff;
		/* background: #ff797c; */
	}

	.xiangqing .ctn1 .sj_Pingjia .sm-nav {
		display: block;
		margin-left: 24rpx;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia {
		padding: 0 30rpx;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .box {
		padding: 24rpx 0 20rpx;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .top .pic {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .top .pic image {
		max-width: 100%;
		max-height: 100%;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .top .text {
		margin-left: 76rpx;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .top .text .username {
		/* padding-bottom: 24rpx; */
		width: 600rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.username_createTime {
		font-size: 20rpx;
		color: #B8BED0;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .detail {
		font-size: 28rpx;
		line-height: 44rpx;
		color: #000000;
		font-size: 24rpx
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .pic view {
		width: 120rpx;
		height: 120rpx;
		border: 2rpx solid #e6e6e6;
		float: left;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .pics {
		display: flex;
		flex-wrap: wrap;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .pic {
		margin-right: 10rpx;
	}

	.xiangqing .ctn1 .sj_Pingjia .pingjia .pic view image {
		max-width: 100%;
		max-height: 100%;
	}

	.xiangqing .ctn1 .evlt_star_bg {
		width: 170rpx;
		height: 24rpx;
		position: relative;
		overflow: hidden;
		line-height: 0;
		display: inline-block;
		text-align: left;
	}

	.xiangqing .ctn1 .evlt_star_bg image.bg {
		width: 170rpx;
		height: 24rpx;
	}

	.xiangqing .ctn1 .evlt_star_bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		line-height: 0;
		overflow: hidden;
		display: inline-block;
	}

	.xiangqing .ctn1 .evlt_star_bg image {
		width: 170rpx;
		height: 24rpx;
	}

	/*数据加载提示*/
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

	.morelist {
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		background: #f8f8f8;
		margin-bottom: 20rpx;
	}

	.morelist text {
		color: #0f8fd0;
	}

	.none-cont {
		padding-bottom: 60rpx;
	}

	/*详情*/
	.xiangqing .ctn2 {
		box-sizing: border-box;
		height: 100%;
	}

	.xiangqing .ctn2 .content_wrap .haspad {
		padding-top: 20rpx;
	}

	.xiangqing .ctn2 .xinxi {
		overflow: hidden;
		background: #fff;
		line-height: 40rpx;
		padding-left: 24rpx;
	}

	.xiangqing .ctn2 .xinxi .flex {
		display: flex;
		background: #fff;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #dedede;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}

	.xiangqing .ctn2 .xinxi:last-child .flex {
		border: 0;
	}

	.xiangqing .ctn2 .xinxi .flex .wz {
		flex: 1;
	}

	.xiangqing .ctn2 .xinxi view .img1 {
		width: 32rpx;
		height: 32rpx;
		margin-right: 20rpx;
	}

	.xiangqing .ctn2 .xinxi view .img2 {
		width: 14rpx;
		height: 24rpx;
	}

	.xiangqing .ctn2 .activity {
		background: #fff;
		margin-top: 20rpx;
		padding: 0 24rpx;
		color: #333;
	}

	.xiangqing .ctn2 .activity .activity_single:first-child {
		padding-top: 20rpx;
	}

	.xiangqing .ctn2 .activity .activity_single:last-child {
		padding-bottom: 20rpx;
	}

	.xiangqing .ctn2 .activity .activity_single {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.xiangqing .ctn2 .activity .activity_single .ico {
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

	.xiangqing .ctn2 .shangjiaPic {
		margin-top: 20rpx;
		padding: 0 24rpx 24rpx;
		background: #fff;
	}

	.xiangqing .ctn2 .shangjiaPic .picTitle {
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.xiangqing .ctn2 .shangjiaPic .pics {
		display: flex;
		flex-wrap: wrap;
	}

	.xiangqing .ctn2 .shangjiaPic .pics .pic {
		width: 210rpx;
		height: 140rpx;
		margin-left: 16rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.shopOffTips {
		position: fixed;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
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

	.shopOffTipsIn .tipsOff {
		position: absolute;
		right: 0;
		top: -64rpx;
		width: 64rpx;
		height: 64rpx;
	}

	.shopOffTipsIn .tipsImg {
		width: 100%;
		height: 100%;
	}

	.shopOffTipsIn text {
		font-size: 28rpx;
		color: #333;
		position: absolute;
		bottom: 80rpx;
		display: block;
		width: 100%;
		text-align: center;
	}

	/*点击商品图弹出遮罩层  */
	.gdsDetails_mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 9999999;
		box-sizing: border-box;
	}

	.gdsDetails_maskOut {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.gdsDetails_maskIn {
		width: 700rpx;
	}

	.goodsDetails {
		max-height: calc(100% - 100rpx);
		background: #fff;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.goodsDetailsImg {
		width: 100%;
		height: 700rpx;
	}

	.shopName {
		font-size: 36rpx;
		color: #000;
		padding-left: 20rpx;
		font-weight: bold;
		margin-top: 5rpx;
	}

	.shopSales {
		font-size: 26rpx;
		color: #666;
		padding-left: 20rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.shutDown {
		width: 80rpx;
		height: 80rpx;
		margin: 0 auto;
		border-radius: 50%;
		overflow: hidden;
		display: block;
		margin-top: 40rpx;
	}

	.goodsDetailsFoot {
		width: 660rpx;
		margin: 0 auto;
		height: 60rpx;
		margin-top: 30rpx;
		margin-bottom: 10rpx;
	}

	.goodsDetailsFoot .shopPrice {
		float: left;
		font-size: 34rpx;
		color: #f60;
		font-weight: bold;
	}

	.goodsDetailsFoot .shopPrice .del {
		color: #999;
		position: relative;
		font-size: 20rpx;
	}

	.goodsDetailsFoot .shopPrice .del:after {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 2rpx;
		background: #999;
	}

	.goodsDetailsFoot .spec {
		position: unset !important;
		right: auto;
		bottom: auto;
	}

	.goodsDetailsFoot .goods_int_box {
		position: unset;
		right: auto;
		bottom: auto;
	}

	/*分享海报*/
	.sharePicMask {
		position: fixed;
		z-index: 101;
		left: 50%;
		bottom: 488rpx;
		transform: translate(-50%, 0);
		background: #FFFFFF;
		box-shadow: 0 4rpx 8rpx 0 rgba(102, 102, 102, 0.50);
		border-radius: 16rpx;
		width: 500rpx;
		height: 570rpx;
		overflow: hidden;
	}

	.sharecanvas {
		width: 500rpx;
		height: 570rpx;
	}

	.sharePicMask .pic_box {
		text-align: center;
		background-color: #2c3b53;
		position: relative;
		line-height: 0;
		padding: 60rpx 0 0;
		margin-bottom: 140rpx;
		font-size: 0;
	}

	.sharePicMask .pic_box .ico {
		position: absolute;
		left: 0;
		bottom: -2rpx;
		width: 100%;
		height: 100%;
	}

	.sharePicMask .logo {
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		width: 280rpx;
		height: 280rpx;
		border: 10rpx solid #fff;
		border-radius: 100%;
		display: inline-block;
		position: relative;
		z-index: 1;
		margin-bottom: -112rpx;
		box-shadow: 0 2rpx 6rpx #eee;
		box-sizing: border-box;
	}

	.sharePicMask .box {
		padding: 0 24rpx 24rpx;
		overflow: hidden;
	}

	.sharePicMask .wz_box {
		margin-right: 160rpx;
	}

	.sharePicMask .wz_box .tit {
		font-size: 36rpx;
		line-height: 40rpx;
		font-weight: normal;
		margin-bottom: 12rpx;
	}

	.sharePicMask .wz_box .txt {
		font-size: 24rpx;
		line-height: 40rpx;
		color: #999;
	}

	.sharePicMask .code {
		width: 140rpx;
		height: 140rpx;
	}

	.sharePicMask .tag {
		overflow: hidden;
		margin: 20rpx 0 0;
	}

	.sharePicMask .tag span {
		float: left;
		border: 2rpx solid #FCE9E9;
		border-radius: 2rpx;
		line-height: 36rpx;
		padding: 0 8rpx;
		font-size: 22rpx;
		color: #FF4D5B;
		margin-right: 8rpx;
		margin-bottom: 8rpx;
	}

	.sharePicMask .tag span.grey {
		border-color: #eee;
		color: #666;
	}

	.sharePicMask .pic {
		width: 100%;
	}

	.shareWayMask {
		background: #fff;
		position: fixed;
		z-index: 100;
		left: 0;
		right: 0;
		bottom: 0;
		transform: translate(0, 100%);
		transition: all 0.5s ease;
		-webkit-transition: all 0.5s ease;
	}

	.shareWayMask.show {
		transform: translate(0, 0);
	}

	.shareWayMask .list_box {
		overflow: hidden;
		padding: 100rpx 0 40rpx;
		display: flex;
	}

	.shareWayMask .list {
		flex: 1;
		text-align: center;
		position: relative;
	}

	.shareWayMask .list .share {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.shareWayMask .list .ico {
		width: 88rpx;
		height: 88rpx;
	}

	.shareWayMask .list .txt {
		font-size: 28rpx;
		color: #666;
		line-height: 40rpx;
		margin-top: 20rpx;
	}

	.shareWayMask .cancel {
		display: block;
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		font-size: 32rpx;
		color: #666;
		border-top: 2rpx solid #f5f5f5;
	}

	.cunav {
		width: 750rpx;
		height: 44px;
		background-color: #F5F7FA;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		position: fixed;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		left: 0;
		right: 0;
		z-index: 100;
	}

	.cunav_back {
		width: 48rpx;
		height: 48rpx;
		margin-left: 50rpx;
		background-color: #037E98;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cunav_back>image {
		width: 32rpx;
		height: 32rpx;
		margin-left: -6rpx;
	}

	.cunav_setup>view {
		width: 0px;
		/*设置宽高为0，所以div的内容为空，从才能形成三角形尖角*/
		height: 0px;
		border-bottom: 10rpx solid white;
		border-left: 10rpx solid transparent;
		/*transparent 表示透明*/
		border-right: 10rpx solid transparent;
		position: absolute;
		z-index: 1;
		top: -10rpx;
		left: 84rpx;
	}

	.cunav_setup {
		width: 218rpx;
		height: 66rpx;
		position: fixed;
		margin-top: 10rpx;
		line-height: 66rpx;
		right: 20px;
		z-index: 100;
		text-align: center;
		font-size: 22rpx;
		color: #252628;
		background: #FFFFFF;
		box-shadow: 0 4rpx 10rpx 0 rgba(196, 200, 203, 0.50);
		border-radius: 8rpx;
	}

	.newhuodongbutton {
		border-radius: 16rpx;
		background: #ECF1F8;
		padding: 20rpx;
		color: #ff797c;
	}

	.cunav_setup .collect {
		width: 42rpx;
		height: 40rpx;
		margin-left: 16rpx;
	}

	.cunav_setup .share {
		width: 40rpx;
		height: 40rpx;
	}

	.cunav_setup .search {
		width: 40rpx;
		height: 40rpx;
		margin-right: 16rpx;
	}

	.setuplists {
		display: flex;
		align-items: center;
	}

	.sending_off {
		padding: 0 14rpx;
		height: 48rpx;
		/* background-color: #2D2D2D; */
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #3E4248;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10rpx;
	}

	.cudeliveryfee {
		margin-right: 10rpx;
		font-size: 24rpx;
		color: #3E4248;
		display: flex;
		align-items: center;
	}

	.cuscore {
		width: 690rpx;
		height: 144rpx;
		border-radius: 16rpx;
		box-shadow: 4rpx 4rpx 16rpx 4rpx rgba(191, 204, 217, 0.40);
		margin: 0 auto;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		margin-bottom: 26rpx;
	}

	.cuscore_num {
		width: 345rpx;
		height: 144rpx;
		overflow: hidden;
		line-height: 1;
	}

	.cuscore_num1 {
		width: 315rpx;
		height: 48rpx;
		display: flex;
		align-items: flex-end;
		font-size: 48rpx;
		color: #FF797C;
		margin-left: 30rpx;
		margin-top: 30rpx;
		margin-bottom: 4rpx;
	}

	.cuscore_num1>image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}

	.cuscore_num2 {
		display: flex;
		align-items: center;
		width: 315rpx;
		height: 48rpx;
		font-size: 24rpx;
		color: #A3A3A4;
		margin-left: 30rpx;
	}

	.cuscore_start {
		width: 345rpx;
		height: 144rpx;
		overflow: hidden;
		line-height: 1;
	}

	.cuscore_start>view {
		width: 345rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
	}

	.cuscore_start1 {
		margin-top: 21rpx;
		margin-bottom: 11rpx;
	}

	.cuscore_start_icon {
		font-size: 28rpx;
		color: #F8C262;
		display: flex;
		align-items: center;
	}

	.cuscore_start_icon>view {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
	}

	.cuscore_start_icon image {
		width: 28rpx;
		height: 28rpx;
	}

	.cuscore_start_text {
		font-size: 24rpx;
		color: #A3A3A4;
		display: flex;
		align-items: center;
	}

	.cuscore_start_text::before {
		content: '';
		display: inline-block;
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		margin: 0 10rpx 0 13rpx;
		background-color: #A3A3A4;
	}

	.newcheckbox_text {
		font-size: 22rpx;
		color: #037E98;
	}

	.sjdets {
		overflow: hidden;
		background: #ffffff;
	}

	.sjdets_head {
		background: #ffffff;
		box-shadow: 0 4rpx 16rpx 0 rgba(191, 204, 217, 0.40);
		width: 690rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		overflow: hidden;
		border-radius: 16rpx;
	}

	.sjdets_head_item {
		margin: 24rpx auto 0;
		width: 642rpx;
		min-height: 28rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}


	.sjdets_head_item:last-child {
		margin-bottom: 24rpx;
	}

	.sjdets_head_item_title {
		display: flex;
		align-items: center;
		width: 140rpx;
		height: 28rpx;
		font-size: 20rpx;
		color: #AEB5BD;
	}

	.sjdets_head_item_main {
		font-size: 20rpx;
		color: #252628;
		width: 502rpx;
		line-height: 1.3;
	}

	.sjdets_exe {
		margin: 30rpx 0 70rpx 53rpx;
	}

	.sjdets_exe .activity_single {
		display: flex;
		align-items: center;
	}

	.sjdets_exe .activity_single:not(:first-child) {
		margin-bottom: 20rpx;
	}

	.sjdets_exe .activity_single>.ico {
		width: 26rpx;
		height: 26rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 20rpx;
		margin-right: 12rpx;
	}

	.sjdets_exe .activity_single>text {
		font-size: 20rpx;
		color: #037E98;
	}

	.sjdets_img {
		width: 690rpx;
		height: 266rpx;
		overflow: hidden;
		margin: 0 auto 40rpx;
	}

	.sjdets_img_title {
		width: 100%;
		height: 40rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #2D2D2D;
		margin-bottom: 26rpx;
	}

	.sjdets_img_main {
		width: 100%;
		height: 200rpx;
	}

	.sjdets_img_main_pic {
		width: 200rpx;
		height: 200rpx;
		overflow: hidden;
		margin-right: 20rpx;
		float: left;
	}

	.sjdets_img_main_pic:last-child {
		margin-right: 0;
	}

	.username_sa {
		font-size: 20rpx;
		color: #37B2FF;
		margin-left: 25rpx;
	}

	.serg_btn {
		background: #FF797C !important;
		font-size: 20rpx !important;
		line-height: 30rpx !important;
		padding: 0 14rpx !important;
		color: #fff !important;
	}

	.serg_btnss {
		background: #ffffff !important;
		font-size: 20rpx !important;
		line-height: 30rpx !important;
		padding: 0 14rpx !important;
		color: #999 !important;
	}
</style>