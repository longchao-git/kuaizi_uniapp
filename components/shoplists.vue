<template name="shoplists">
	<view class="shoplists_box">
		<view v-for="(item, index) in shopLists" :key="index" :class="'shoplists ' + (item.yyst == 1 ? '' : 'close')"
			@tap="gotoDetail" :id="item.shop_id">
			<view class="logo">
				<image :src="item.logo" class="pic" mode="aspectFill"></image>
				<image src="/static/image/label_new.png" class="tag" v-if="item.is_new == 1"></image>
				<view class="state" v-if="item.yyst != 1">打烊了</view>
				<view class="num" v-if="item.totalnum > 0">{{item.totalnum}}</view>
			</view>
			<view class="txt_box">
				<view class="overflow_clear tit">{{item.title}}</view>
				<view class="open_state" v-if="item.tips_label != ''"><text>{{item.tips_label}}</text></view>
				<block v-if="hdType == '1'">
					<view class="box">
						<!-- <view class="starBg">
                            <image src='../../image/min_evlt_star_bg.png' class='starBgimg'></image>
                            <view class="star" style="width:{{item.avg_score*20}}%;">
                                <image src='../../image/min_evlt_star_bar.png'></image>
                            </view> 
                        </view> -->
						<view class="starS">
							<image src="/static/image/Star-pre3x.png"></image>{{item.avg_score}}
						</view>
						<!-- 已售{{item.orders}}单 -->
						评价{{item.comments}}
						<view class="fr"><span class="green">{{item.pei_time}}分钟</span> {{item.juli_label}}</view>
					</view>
					<view class="box">
						<view class="fl flex-wrp">
							<view class="text_amount">
								起送€{{item.min_amount}}
							</view>
							<span class='text_freight'>
								<block v-if="item.freight == 0">免配送费</block>
								<!-- <span class='del'>€{{item.freight}}</span> -->
								<block v-else-if="item.is_reduce_pei == 1">配送费{{item.reduceEd_freight}}起</block>
								<block v-else>配送€{{item.freight}}起</block>
							</span>
						</view>
						<!-- <view class="song song2" style='border-color:#{{item.peiType.line_color}}; color:#{{item.peiType.color}};'>{{item.peiType.label}}</view> -->
					</view>
					<!--     <view class="line"></view> -->
					<view class="support">
						<span v-if="item.is_refund == 1">极速退款</span>
						<span v-if="item.is_ziti == 1">支持自提</span>
					</view>
					<view class="hd" v-if="item.huodong.length > 0">
						<view class="right" @tap.stop="tapHd" :data-index="index" v-if="item.huodong.length > 3">
							{{item.huodong.length}}个活动<image class="ico" mode="aspectFit"
								:src="'/static/image/' + (hdShow == index ? 'btn_arrow_up_small3x.png' : 'btn_arrow_down_small3x.png')">
							</image>
						</view>
						<ul :class="hdShow == index ? 'on' : ''">
							<li v-for="(li, idx) in item.huodong" :key="idx">
								<i class="ico" :style="'background:#' + li.color">{{li.word}}</i>
								{{li.title}}
							</li>
						</ul>
					</view>
				</block>
				<block v-if="hdType == '2'">
					<view class="box black6">
						<view class="starS">
							<image src="/static/image/Star-pre3x.png"></image>{{item.avg_score}}
						</view>
						评价{{item.comments}}
						<!-- 已售{{item.orders}}单 -->
						<view class="fr"><span>{{item.pei_time}}分钟</span> {{item.juli_label}}</view>
					</view>
					<view class="box black6">
						<view class="fl flex-wrp">
							<view class="text_amount">
								起送€{{item.min_amount}}
							</view>
							<span class='text_freight'>
								<block v-if="item.freight == 0">免配送费</block>
								<block v-else-if="item.is_reduce_pei == 1">配送费{{item.freight}}起 <span
										class='del'>€{{item.reduceEd_freight}}</span></block>
								<block v-else>配送€{{item.freight}}</block>
							</span>
						</view>
						<!-- 商家专送 -->
						<!-- <view class="song song2" style='border-color:#{{item.peiType.line_color}}; color:#{{item.peiType.color}};'>{{item.peiType.label}}</view> -->
					</view>
					<!-- <view class="line"></view> -->
					<view class="pullBox">
						<view class="right" @tap.stop="tapHd" :data-index="index">
							<image class="ico" mode="aspectFit"
								:src="'/static/image/' + (hdShow == index ? 'btn_arrow_up_small3x.png' : 'btn_arrow_down_small3x.png')">
							</image>
						</view>
						<view :class="'left ' + (hdShow == index ? 'on' : '')">
							<view v-for="(li, idx) in item.huodong" :key="idx" class="list">{{li.title}}</view>
							<span v-if="item.is_refund == 1">极速退款</span>
							<span v-if="item.is_ziti == 1">支持自提</span>
						</view>
					</view>
				</block>
			</view>
			<view class="clear"></view>
			<view class="products" hidden="true">
				<ul>
					<!-- <li>
						<view class="pic" style="'background-image:url(+ {{pli.pic}} +);'"></view>
						<view class="overflow_clear bt">{{pli.title}}</view>
						<view class="price"><span>€</span>{{pli.price}}</view>
					</li> -->
					<li>
						<view class="pic" :style="''background-image:url(+ ' + pli.pic + ' +)''"></view>
						<view class="overflow_clear bt">12</view>
						<view class="price"><span>€</span>555</view>
					</li>
				</ul>
			</view>
		</view>
	</view>
	<view class="pub-nodata" v-if="shopLists.length == 0">
		<image src="/static/image/noorder.png"></image>
		<view class="black6">暂无数据</view>
	</view>
</template>