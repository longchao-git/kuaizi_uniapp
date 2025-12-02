<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<scroll-view scroll-y class="header">
			<!-- <view class="tips">注: 购买不同种类的配送会员卡将同时生效</view> -->
			<view v-for="(item, index) in cardType" :key="index" class="cardShow" @tap="toSelected" :data-index="index">
				<!-- <image :src="item.photo" class="card-bg" mode="widthFix"></image> -->
				<view class="cardShowIn">
					<view class="cardTop">
						{{item.title}}
					</view>
					<view class="useNum">单日可使用次数: {{item.limits}}单</view>
					<view class="cardFoot">
						<view class="max_breaksMoney">每单最多减免配送费: €{{item.reduce}}</view>
						<!-- <view class="endTime">有效期限: {{item.days}}天</view> -->
					</view>
				</view>
				<image src="/static/image/Group22x.png" class="seletedIcon" v-if="selectIndex == index"></image>
				<image src="/static/image/Group23x.png" class="seletedIcon" v-if="selectIndex != index"></image>

			</view>
		</scroll-view>

		<view class="fixFooter">
			<view class="footMoney"> <text>€ {{footMoney}}</text></view>
			<button class="goPay" @tap="goPay" :disabled="isDisabled"
				:style="'background:' + (isDisabled ? '#999' : '') + ';color:' + (isDisabled ? '#fff' : '')">去支付</button>
		</view>
	</view>
</template>

<script>
	// pages/bugNewCard/buyNewCard.js
	var app = getApp();

	export default {
		data() {
			return {
				cardType: {},
				selectIndex: -1,
				footMoney: "0.00",
				isDisabled: true,
				footTitle: "",
				footCardId: "",

				showToast: {
					isShow: false
				},
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var that = this;
			app.globalData.peicard({}, function(res) {
				console.log(res);

				if (res.error == '0') {
					that.cardType = res.data.items
					;
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},

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
			// 选择会员卡类型
			toSelected: function(e) {
				var fmoney = this.cardType[e.currentTarget.dataset.index].amount;
				var ftitle = this.cardType[e.currentTarget.dataset.index].title;
				var fcardid = this.cardType[e.currentTarget.dataset.index].card_id;
				this.selectIndex = e.currentTarget.dataset.index,
					footMoney: fmoney,
					footTitle: ftitle,
					footCardId: fcardid,
					isDisabled: false
				;
			},
			// 去支付
			goPay: function() {
				app.globalData.topage('../card_payment/payment?title=' + this.footTitle + "&amount=" + this.footMoney +
					"&card_id=" + this.footCardId);
			}
		}
	};
</script>
<style>
	/* pages/bugNewCard/buyNewCard.wxss */
	.header {
		width: 700rpx;
		padding: 0 30rpx 30rpx 30rpx;
		height: calc(100% - 150rpx);
	}

	.tips {
		font-size: 24rpx;
		color: #999;
		height: 80rpx;
		line-height: 80rpx;
	}

	.cardShow {
		width: 690rpx;
		height: 218rpx;
		margin: 20rpx 0 0;
		position: relative;
		overflow: hidden;
		background: linear-gradient(184deg, #3B96B1 0%, #437989 100%, #437989 100%);
		border-radius: 16rpx;
	}

	.card-bg {
		width: 100%;
	}

	.seletedIcon {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 50rpx;
		height: 50rpx;
	}

	.cardTop {
		width: 600rpx;
		line-height: 45rpx;
		margin-top: 30rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-left: 30rpx;
	}

	.useNum {
		line-height: 40rpx;
		margin-top: 23rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		margin-left: 30rpx;
	}

	.cardFoot {
		line-height: 40rpx;
		margin-top: 10rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		margin-left: 30rpx;
	}

	/* .max_breaksMoney{float: left;} */
	/* .endTime{float: left;margin-left: 40rpx;} */

	.fixFooter {
		width: 670rpx;
		height: 140rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		background: #FF797C;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-radius: 30rpx 30rpx 0px 0px;
		padding: 0 40rpx;
	}

	.footMoney {
		font-size: 48rpx;
		color: #ffffff;
		font-weight: bold;
	}

	.goPay {
		width: 180rpx;
		height: 76rpx;
		line-height: 76rpx;
		border: none;
		padding-left: 0;
		padding-right: 0;
		background: #FFFFFF;
		border-radius: 24rpx;
		font-size: 28rpx;
		color: #3B96B1;
		text-align: center;
	}

</style>