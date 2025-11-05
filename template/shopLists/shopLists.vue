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
								<view class="pic" :style="''background-image:url(+ ' + pli.pic + ' +);''"></view>
								<view class="overflow_clear bt">12</view>
								<view class="price"><span>€</span>555</view>
							</li>
						</ul>
					</view>
				</view>
			</view>
			<view class="pub-nodata" v-if="lists.length == 0">
				<image src="/static/image/noorder.png"></image>
				<view class="black6">暂无数据</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwNVFqcW5KJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixDQUFDO0FBQzlELGlCQUFpQixZQUFZLENBQUM7QUFDOUIsaUJBQWlCLGFBQWEsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsMEJBQTBCLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDO0FBQ2hJLHNCQUFzQixhQUFhLEVBQUUsY0FBYyxFQUFFLG1CQUFtQixDQUFDO0FBQ3pFLHNCQUFzQixrQkFBa0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUM7QUFDdkYsd0JBQXdCLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQztBQUNuSyxzQkFBc0Isa0JBQWtCLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsZUFBZSxDQUFDO0FBQzlMLG9CQUFvQixtQkFBbUIsQ0FBQztBQUN4QyxnQkFBZ0IsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7QUFDckQsNEJBQTRCLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBQztBQUM3SyxnQkFBZ0IsZUFBZSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztBQUNsRSxrQkFBa0IscUJBQXFCLEVBQUUsWUFBWSxFQUFFLDJCQUEyQixFQUFFLDBCQUEwQixFQUFFLGNBQWMsRUFBRSw4QkFBOEIsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUM7QUFDbE0s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WUFBWTtBQUNaLGlCQUFpQjtBQUNqQixlQUFlO0FBQ2YsYUFBYTtBQUNiLG9CQUFvQjtBQUNwQixlQUFlO0FBQ2Y7QUFDQTtBQUNBLFlBQVk7QUFDWixZQUFZO0FBQ1o7QUFDQSxNQUFNLGlCQUFpQjtBQUN2QixNQUFNO0FBQ04sS0FBSztBQUNMLFdBQVc7QUFDWCxhQUFhO0FBQ2IsZUFBZTtBQUNmLG9CQUFvQjtBQUNwQjtBQUNBLFlBQVksWUFBWTtBQUN4QixZQUFZO0FBQ1oiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNob3BsaXN0c3tiYWNrZ3JvdW5kOiAjZmZmOyBwYWRkaW5nOiAyMHJweDsgb3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5zaG9wbGlzdHMuY2xvc2V7b3BhY2l0eTogMC41O31cclxuLnNob3BsaXN0cyAubG9nb3t3aWR0aDogMTYwcnB4OyBoZWlnaHQ6IDE2MHJweDsgYm9yZGVyLXJhZGl1czogOHJweDsgYm9yZGVyOiAycnB4IHNvbGlkICNlNmU2ZTY7cG9zaXRpb246IHJlbGF0aXZlOyBmbG9hdDogbGVmdDt9XHJcbi5zaG9wbGlzdHMgLmxvZ28gLnBpY3t3aWR0aDogMTYwcnB4OyBoZWlnaHQ6IDE2MHJweDsgYm9yZGVyLXJhZGl1czogOHJweDt9XHJcbi5zaG9wbGlzdHMgLmxvZ28gLnRhZ3twb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgd2lkdGg6IDY0cnB4OyBoZWlnaHQ6IDY0cnB4O31cclxuLnNob3BsaXN0cyAubG9nbyAuc3RhdGV7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowOyByaWdodDowOyBib3R0b206MDsgbGluZS1oZWlnaHQ6MzZycHg7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZDojYmJiO2NvbG9yOiNmZmY7ZGlzcGxheTogYmxvY2s7Zm9udC1zaXplOjI0cnB4O31cclxuLnNob3BsaXN0cyAubG9nbyAubnVte3Bvc2l0aW9uOiBhYnNvbHV0ZTtyaWdodDogLThycHg7dG9wOiAtOHJweDtsaW5lLWhlaWdodDogMjhycHg7dGV4dC1hbGlnbjogY2VudGVyO2JhY2tncm91bmQ6ICNGRjRENUI7Y29sb3I6ICNmZmY7Zm9udC1zaXplOiAyMHJweDtib3JkZXItcmFkaXVzOiA2MHJweDsgcGFkZGluZzogMCA5cnB4O31cclxuLnNob3BsaXN0cyAudHh0X2JveHttYXJnaW4tbGVmdDogMTgwcnB4O31cclxuLnNob3BsaXN0cyAudGl0e2ZvbnQtc2l6ZTogMzZycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDt9XHJcbi5zaG9wbGlzdHMgLm9wZW5fc3RhdGUgdGV4dHtiYWNrZ3JvdW5kOiAjNERCRDREO2JvcmRlci1yYWRpdXM6IDJycHg7Zm9udC1zaXplOiAyMnJweDtjb2xvcjogI2ZmZjtsaW5lLWhlaWdodDogMzJycHg7cGFkZGluZzogMCAxNHJweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7bWFyZ2luLXRvcDogMTJycHg7fVxyXG4uc2hvcGxpc3RzIC5ib3h7b3ZlcmZsb3c6aGlkZGVuO2ZvbnQtc2l6ZTogMjRycHg7IG1hcmdpbjogMTJycHggMDt9XHJcbi5zaG9wbGlzdHMgLnNvbmd7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgZmxvYXQ6IHJpZ2h0OyBmb250LXNpemU6IDIwcnB4ICFpbXBvcnRhbnQ7IGJvcmRlcjogMnJweCBzb2xpZCAjMjc5N2ZmOyBjb2xvcjogIzI3OTdmZjsgYm9yZGVyLXJhZGl1czogMTBycHggMCAxMHJweCAwO3BhZGRpbmc6MCA2cnB4OyBsaW5lLWhlaWdodDogMzJycHg7fVxyXG4uc2hvcGxpc3RzIC5zb25nMntib3JkZXItY29sb3I6I2ZmOTAwMDsgY29sb3I6ICNmZjkwMDA7fVxyXG4uc2hvcGxpc3RzIC5ncmVlbntjb2xvcjogIzIwQUQyMDt9XHJcbi5zaG9wbGlzdHMgLmdyZXl7Y29sb3I6ICNlNmU2ZTY7fVxyXG4uc2hvcGxpc3RzIGRlbHtjb2xvcjogIzk5OTsgZm9udC1zaXplOiAyNHJweDsgcG9zaXRpb246IHJlbGF0aXZlOyBtYXJnaW4tbGVmdDogNHJweDt9XHJcbi5zaG9wbGlzdHMgZGVsOmFmdGVye2NvbnRlbnQ6ICcnOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAycnB4OyBiYWNrZ3JvdW5kOiAjOTk5OyBwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogNTAlO31cclxuLnNob3BsaXN0cyAuc3RhclN7ZGlzcGxheTogaW5saW5lLWJsb2NrO2ZvbnQtc2l6ZTogMjZycHg7IGNvbG9yOiAjZmY0ZDViOyBtYXJnaW4tcmlnaHQ6IDIwcnB4O31cclxuLnNob3BsaXN0cyAuc3RhclMgaW1hZ2V7d2lkdGg6IDI0cnB4OyBoZWlnaHQ6IDI0cnB4OyBtYXJnaW4tcmlnaHQ6IDhycHg7fVxyXG4uc2hvcGxpc3RzIC5saW5le3dpZHRoOiAxMDAlOyBkaXNwbGF5OiBibG9jazsgaGVpZ2h0OiAwOyBib3JkZXI6MDsgYm9yZGVyLWJvdHRvbTogMnJweCBzb2xpZCAjZjZmNmY2OyBtYXJnaW46MjBycHggMDsgcGFkZGluZzogMDt9XHJcbi5zaG9wbGlzdHMgLnN1cHBvcnR7b3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5zaG9wbGlzdHMgLnN1cHBvcnQgc3BhbntvdmVyZmxvdzogaGlkZGVuOyBib3JkZXI6IDJycHggc29saWQgIzIwQUQyMDsgY29sb3I6ICMyMEFEMjA7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgbWFyZ2luLXJpZ2h0OiA4cnB4OyBwYWRkaW5nOiAwIDhycHg7IGJvcmRlci1yYWRpdXM6IDRycHg7fVxyXG4uc2hvcGxpc3RzIC5oZHtvdmVyZmxvdzogaGlkZGVuO31cclxuLnNob3BsaXN0cyAuaGQgLnJpZ2h0e2Zsb2F0OiByaWdodDsgd2lkdGg6IDE3MnJweDsgdGV4dC1hbGlnbjogcmlnaHQ7IGZvbnQtc2l6ZTogMjRycHg7IGNvbG9yOiAjOTk5O31cclxuLnNob3BsaXN0cyAuaGQgLnJpZ2h0IC5pY297d2lkdGg6IDIwcnB4OyBoZWlnaHQ6IDIwcnB4OyBtYXJnaW4tbGVmdDogOHJweDsgZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDIwcnB4OyBjb2xvcjogI2ZmZjt9XHJcbi5zaG9wbGlzdHMgLmhkIHVse2Rpc3BsYXk6IGJsb2NrOyBtYXJnaW4tcmlnaHQ6IDE4MHJweDsgbWF4LWhlaWdodDogMTQ0cnB4O31cclxuLnNob3BsaXN0cyAuaGQgdWwub257aGVpZ2h0OiBhdXRvOyBtYXgtaGVpZ2h0OnVuc2V0O31cclxuLnNob3BsaXN0cyAuaGQgdWwgbGl7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwOyBmb250LXNpemU6IDI0cnB4OyBjb2xvcjogIzY2NjsgbGluZS1oZWlnaHQ6IDMycnB4OyBkaXNwbGF5OiBibG9jazt9XHJcbi5zaG9wbGlzdHMgLmhkIHVsIGxpIC5pY297d2lkdGg6IDMycnB4OyBoZWlnaHQ6IDMycnB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGJvcmRlci1yYWRpdXM6IDhycHg7IGxpbmUtaGVpZ2h0OiAzMnJweDsgdGV4dC1hbGlnbjogY2VudGVyOyBjb2xvcjogI2ZmZjsgZm9udC1zaXplOiAyNHJweDsgZm9udC1zdHlsZTogbm9ybWFsOyBtYXJnaW46OHJweCA4cnB4IDhycHggMDt9XHJcbi5zaG9wbGlzdHMgLnB1bGxCb3h7b3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5zaG9wbGlzdHMgLnB1bGxCb3ggLnJpZ2h0e2Zsb2F0OiByaWdodDsgd2lkdGg6IDgwcnB4OyBoZWlnaHQ6IDgwcnB4OyB0ZXh0LWFsaWduOiByaWdodDt9XHJcbi5zaG9wbGlzdHMgLnB1bGxCb3ggLnJpZ2h0IC5pY297d2lkdGg6IDIwcnB4OyBoZWlnaHQ6IDIwcnB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxyXG4uc2hvcGxpc3RzIC5wdWxsQm94IC5sZWZ0e2Rpc3BsYXk6IGJsb2NrOyBtYXJnaW4tcmlnaHQ6IDkwcnB4OyBtYXgtaGVpZ2h0OiA3NnJweDsgb3ZlcmZsb3c6IGhpZGRlbjt9XHJcbi5zaG9wbGlzdHMgLnB1bGxCb3ggLmxlZnQub257bWF4LWhlaWdodDogdW5zZXQ7fVxyXG4uc2hvcGxpc3RzIC5wdWxsQm94IC5sZWZ0IC5saXN0e2Rpc3BsYXk6IGlubGluZS1ibG9jazsgYm9yZGVyOiAycnB4IHNvbGlkICNGQ0U5RTk7IGxpbmUtaGVpZ2h0OiAyOHJweDsgcGFkZGluZzogMCA4cnB4OyBtYXJnaW4tcmlnaHQ6IDRycHg7IG1hcmdpbi1ib3R0b206IDRycHg7IGZvbnQtc2l6ZTogMjJycHg7IGNvbG9yOiAjRkY0RDVCO31cclxuLnNob3BsaXN0cyAucHVsbEJveCAubGVmdCBzcGFue2Rpc3BsYXk6IGlubGluZS1ibG9jazsgYm9yZGVyOiAycnB4IHNvbGlkICNlZWU7IGxpbmUtaGVpZ2h0OiAyOHJweDsgcGFkZGluZzogMCA4cnB4OyBtYXJnaW4tcmlnaHQ6IDRycHg7IG1hcmdpbi1ib3R0b206IDRycHg7IGZvbnQtc2l6ZTogMjJycHg7IGNvbG9yOiAjNjY2O31cclxuXHJcbi5zaG9wbGlzdHMgLnByb2R1Y3Rze292ZXJmbG93LXg6IGhpZGRlbjsgb3ZlcmZsb3cteTogYXV0bzsgbWFyZ2luLXRvcDogMTJycHg7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNofVxyXG4uc2hvcGxpc3RzIC5wcm9kdWN0cyB1bHtkaXNwbGF5OiBibG9jazsgd2hpdGUtc3BhY2U6bm93cmFwOyBtYXJnaW46IDAgLTEwcnB4O31cclxuLnNob3BsaXN0cyAucHJvZHVjdHMgdWwgbGl7ZGlzcGxheTogaW5saW5lLWJsb2NrOyBtYXJnaW46IDAgMTBycHg7fVxyXG4uc2hvcGxpc3RzIC5wcm9kdWN0cyB1bCBsaSAucGlje3dpZHRoOiAyNDBycHg7IGhlaWdodDogMTc2cnB4OyBvdmVyZmxvdzogaGlkZGVuOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0OyBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7IGJhY2tncm91bmQtc2l6ZTogY292ZXI7IHBvc2l0aW9uOiByZWxhdGl2ZTsgYmFja2dyb3VuZC1jb2xvcjogI2VlZTt9XHJcbi5zaG9wbGlzdHMgLnByb2R1Y3RzIHVsIGxpIC5idHtmb250LXNpemU6IDI4cnB4OyBjb2xvcjogIzY2NjsgbGluZS1oZWlnaHQ6IDQwcnB4OyBtYXJnaW46IDEycnB4IDAgOHJweDt9XHJcbi5zaG9wbGlzdHMgLnByb2R1Y3RzIHVsIGxpIC5wcmljZXtmb250LXNpemU6IDM2cnB4OyBjb2xvcjogI0ZBNEMzNDt9XHJcbi5zaG9wbGlzdHMgLnByb2R1Y3RzIC5wcmljZSBzbWFsbHtmb250LXNpemU6IDI4cnB4O31cclxuXHJcbi5zdGFyQmd7d2lkdGg6MTcwcnB4O1xyXG5oZWlnaHQ6MjRycHg7XHJcbnBvc2l0aW9uOnJlbGF0aXZlO1xyXG5vdmVyZmxvdzpoaWRkZW47XHJcbmxpbmUtaGVpZ2h0OjA7XHJcbmRpc3BsYXk6aW5saW5lLWJsb2NrO1xyXG50ZXh0LWFsaWduOmxlZnQ7XHJcbn1cclxuLnN0YXJCZ2ltZ3tcclxud2lkdGg6MTcwcnB4O1xyXG5oZWlnaHQ6MjRycHg7XHJcbn1cclxuLnN0YXJ7cG9zaXRpb246YWJzb2x1dGU7XHJcbmxlZnQ6MDtcclxudG9wOjA7XHJcbmhlaWdodDoxMDAlO1xyXG5saW5lLWhlaWdodDowO1xyXG5vdmVyZmxvdzpoaWRkZW47XHJcbmRpc3BsYXk6aW5saW5lLWJsb2NrO1xyXG59XHJcbi5zdGFyIGltYWdle3dpZHRoOjE3MHJweDtcclxuaGVpZ2h0OjI0cnB4O1xyXG59Il19 */
</style>