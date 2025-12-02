<template>
	<view>
		<template name="shoplists">
			<view class="shoplists_box">
				<view v-for="(item, index) in lists" :key="index"
					:class="'shoplists ' + (item.yyst == 1 ? '' : 'close')" @tap="gotoDetail" :id="item.shop_id">
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
                            <image src='../../image/evlt_star_bg.png' class='starBgimg'></image>
                            <view class="star" style="width:{{item.avg_score*20}}%;">
                                <image src='../../image/evlt_star_bar.png'></image>
                            </view>
                        </view> -->
								<view class="starS">
									<image src="/static/image/Star-pre3x.png"></image>{{item.avg_score}}
								</view>
								<!-- 已售{{item.orders}}单 -->
								评价{{item.comments}}
								<view class="fr"><span class="green">{{item.pei_time}}分钟</span> {{item.juli_label}}
								</view>
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
							<!-- <view class="line"></view> -->
							<view class="support">
								<span v-if="item.is_refund == 1">极速退款</span>
								<span v-if="item.is_ziti == 1">支持自提</span>
							</view>
							<view class="hd" v-if="item.huodong.length > 0">
								<view class="right" @tap.stop="tapHd" :data-index="index"
									v-if="item.huodong.length > 3">{{item.huodong.length}}个活动<image class="ico"
										mode="aspectFit"
										:src="'/static/image/' + (hdShow == index ? 'btn_arrow_up_small3x.png' : 'topBottom.png')">
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
										:src="'/static/image/' + (hdShow == index ? 'btn_arrow_up_small3x.png' : 'topBottom.png')">
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
								<view class="pic" :style="''background-image:url(+ ' + pli.pic + ' +);''"></view>
								<view class="overflow_clear bt">12</view>
								<view class="price"><span>€</span>555</view>
							</li>
						</ul>
					</view>
				</view>
			</view>
		</template>
		<NoData :show="lists.length == 0" />
	</template>

	<script>
		export default {
			data() {
				return {
					hdShow: "",
					hdType: "",
					lists: []
				};
		data() {
			return {
				hdShow: "",
				hdType: "",
				lists: []
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			gotoDetail() {
				console.log("占位：函数 gotoDetail 未声明");
			},

			tapHd() {
				console.log("占位：函数 tapHd 未声明");
			}

		}
	};
</script>
<style>
	.shoplists {
		background: #fff;
		padding: 20rpx;
		overflow: hidden;
	}

	.shoplists.close {
		opacity: 0.5;
	}

	.shoplists .logo {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		border: 2rpx solid #e6e6e6;
		position: relative;
		float: left;
	}

	.shoplists .logo .pic {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
	}

	.shoplists .logo .tag {
		position: absolute;
		left: 0;
		top: 0;
		width: 64rpx;
		height: 64rpx;
	}

	.shoplists .logo .state {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		line-height: 36rpx;
		text-align: center;
		background: #bbb;
		color: #fff;
		display: block;
		font-size: 24rpx;
	}

	.shoplists .logo .num {
		position: absolute;
		right: -8rpx;
		top: -8rpx;
		line-height: 28rpx;
		text-align: center;
		background: #FF4D5B;
		color: #fff;
		font-size: 20rpx;
		border-radius: 60rpx;
		padding: 0 9rpx;
	}

	.shoplists .txt_box {
		margin-left: 180rpx;
	}

	.shoplists .tit {
		font-size: 36rpx;
		line-height: 40rpx;
	}

	.shoplists .open_state text {
		background: #4DBD4D;
		border-radius: 2rpx;
		font-size: 22rpx;
		color: #fff;
		line-height: 32rpx;
		padding: 0 14rpx;
		display: inline-block;
		margin-top: 12rpx;
	}

	.shoplists .box {
		overflow: hidden;
		font-size: 24rpx;
		margin: 12rpx 0;
	}

	.shoplists .song {
		display: inline-block;
		float: right;
		font-size: 20rpx !important;
		border: 2rpx solid #2797ff;
		color: #2797ff;
		border-radius: 10rpx 0 10rpx 0;
		padding: 0 6rpx;
		line-height: 32rpx;
	}

	.shoplists .song2 {
		border-color: #ff9000;
		color: #ff9000;
	}

	.shoplists .green {
		color: #ff797c;
	}

	.shoplists .grey {
		color: #e6e6e6;
	}

	.shoplists del {
		color: #999;
		font-size: 24rpx;
		position: relative;
		margin-left: 4rpx;
	}

	.shoplists del:after {
		content: '';
		width: 100%;
		height: 2rpx;
		background: #999;
		position: absolute;
		left: 0;
		top: 50%;
	}

	.shoplists .starS {
		display: inline-block;
		font-size: 26rpx;
		color: #ff4d5b;
		margin-right: 20rpx;
	}

	.shoplists .starS image {
		width: 24rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}

	.shoplists .line {
		width: 100%;
		display: block;
		height: 0;
		border: 0;
		border-bottom: 2rpx solid #f6f6f6;
		margin: 20rpx 0;
		padding: 0;
	}

	.shoplists .support {
		overflow: hidden;
	}

	.shoplists .support span {
		overflow: hidden;
		border: 2rpx solid #ff797c;
		color: #ff797c;
		display: inline-block;
		margin-right: 8rpx;
		padding: 0 8rpx;
		border-radius: 4rpx;
	}

	.shoplists .hd {
		overflow: hidden;
	}

	.shoplists .hd .right {
		float: right;
		width: 172rpx;
		text-align: right;
		font-size: 24rpx;
		color: #999;
	}

	.shoplists .hd .right .ico {
		width: 20rpx;
		height: 20rpx;
		margin-left: 8rpx;
		display: inline-block;
		font-size: 20rpx;
		color: #fff;
	}

	.shoplists .hd ul {
		display: block;
		margin-right: 180rpx;
		max-height: 144rpx;
	}

	.shoplists .hd ul.on {
		height: auto;
		max-height: unset;
	}

	.shoplists .hd ul li {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24rpx;
		color: #666;
		line-height: 32rpx;
		display: block;
	}

	.shoplists .hd ul li .ico {
		width: 32rpx;
		height: 32rpx;
		display: inline-block;
		border-radius: 8rpx;
		line-height: 32rpx;
		text-align: center;
		color: #fff;
		font-size: 24rpx;
		font-style: normal;
		margin: 8rpx 8rpx 8rpx 0;
	}

	.shoplists .pullBox {
		overflow: hidden;
	}

	.shoplists .pullBox .right {
		float: right;
		width: 80rpx;
		height: 80rpx;
		text-align: right;
	}

	.shoplists .pullBox .right .ico {
		width: 20rpx;
		height: 20rpx;
		display: inline-block;
	}

	.shoplists .pullBox .left {
		display: block;
		margin-right: 90rpx;
		max-height: 76rpx;
		overflow: hidden;
	}

	.shoplists .pullBox .left.on {
		max-height: unset;
	}

	.shoplists .pullBox .left .list {
		display: inline-block;
		border: 2rpx solid #FCE9E9;
		line-height: 28rpx;
		padding: 0 8rpx;
		margin-right: 4rpx;
		margin-bottom: 4rpx;
		font-size: 22rpx;
		color: #FF4D5B;
	}

	.shoplists .pullBox .left span {
		display: inline-block;
		border: 2rpx solid #eee;
		line-height: 28rpx;
		padding: 0 8rpx;
		margin-right: 4rpx;
		margin-bottom: 4rpx;
		font-size: 22rpx;
		color: #666;
	}

	.shoplists .products {
		overflow-x: hidden;
		overflow-y: auto;
		margin-top: 12rpx;
		-webkit-overflow-scrolling: touch
	}

	.shoplists .products ul {
		display: block;
		white-space: nowrap;
		margin: 0 -10rpx;
	}

	.shoplists .products ul li {
		display: inline-block;
		margin: 0 10rpx;
	}

	.shoplists .products ul li .pic {
		width: 240rpx;
		height: 176rpx;
		overflow: hidden;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		position: relative;
		background-color: #eee;
	}

	.shoplists .products ul li .bt {
		font-size: 28rpx;
		color: #666;
		line-height: 40rpx;
		margin: 12rpx 0 8rpx;
	}

	.shoplists .products ul li .price {
		font-size: 36rpx;
		color: #FA4C34;
	}

	.shoplists .products .price small {
		font-size: 28rpx;
	}

	.starBg {
		width: 170rpx;
		height: 24rpx;
		position: relative;
		overflow: hidden;
		line-height: 0;
		display: inline-block;
		text-align: left;
	}

	.starBgimg {
		width: 170rpx;
		height: 24rpx;
	}

	.star {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		line-height: 0;
		overflow: hidden;
		display: inline-block;
	}

	.star image {
		width: 170rpx;
		height: 24rpx;
	}

	
</style>