<template>
	<view>
		<!--提示框引入-开始-->
		<!--<import src="../components/showToast.wxml"></import>-->
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
					that.setData({
						cardType: res.data.items
					});
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
				this.setData({
					selectIndex: e.currentTarget.dataset.index,
					footMoney: fmoney,
					footTitle: ftitle,
					footCardId: fcardid,
					isDisabled: false
				});
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
		bbackground: #FFFFFF;
		border-radius: 24rpx;
		font-size: 28rpx;
		color: #3B96B1;
		text-align: center;
	}







	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwc3VWTFRDJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxRQUFRLFlBQVksQ0FBQywyQkFBMkIsQ0FBQyx5QkFBeUIsQ0FBQztBQUMzRSxNQUFNLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7QUFDbkUsVUFBVSxVQUFVLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDO0FBQzNFLFNBQVMsVUFBVSxDQUFDO0FBQ3BCLGFBQWEsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO0FBQzNFLFlBQVksa0JBQWtCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7QUFDOUQsU0FBUyxVQUFVLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDO0FBQ3ZFLFdBQVcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLENBQUMsbUJBQW1CLENBQUM7QUFDN0ksUUFBUSxZQUFZLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQ2pELFFBQVEsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDO0FBQ3pELFVBQVUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDO0FBQ3hELGlCQUFpQixXQUFXLENBQUM7QUFDN0IsU0FBUyxXQUFXLENBQUMsa0JBQWtCLENBQUM7QUFDeEMsV0FBVyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztBQUN0SCxXQUFXLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBQ2xGLGdCQUFnQixhQUFhLENBQUM7QUFDOUIsT0FBTyxZQUFZLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogcGFnZXMvYnVnTmV3Q2FyZC9idXlOZXdDYXJkLnd4c3MgKi9cclxuLmhlYWRlcnt3aWR0aDo3MDBycHg7cGFkZGluZzowIDI1cnB4IDMwcnB4IDI1cnB4O2hlaWdodDpjYWxjKDEwMCUgLSA5NnJweCk7fVxyXG4udGlwc3tmb250LXNpemU6IDI0cnB4O2NvbG9yOiM5OTk7aGVpZ2h0OiA4MHJweDtsaW5lLWhlaWdodDogODBycHg7fVxyXG4uY2FyZFNob3d7d2lkdGg6MTAwJTtoZWlnaHQ6MjM2cnB4IDtwb3NpdGlvbjogcmVsYXRpdmU7bWFyZ2luLWJvdHRvbTozNXJweDt9XHJcbi5jYXJkLWJne3dpZHRoOjEwMCU7fVxyXG4uc2VsZXRlZEljb257cG9zaXRpb246IGFic29sdXRlO2JvdHRvbTowO3JpZ2h0OjA7d2lkdGg6NjhycHg7aGVpZ2h0OiA2OHJweDt9XHJcbi5jYXJkU2hvd0lue3Bvc2l0aW9uOiBhYnNvbHV0ZTt0b3A6MDtsZWZ0OiAyNXJweDt3aWR0aDo2NTBycHg7fVxyXG4uY2FyZFRvcHt3aWR0aDoxMDAlO2hlaWdodDogNjBycHg7bGluZS1oZWlnaHQ6IDYwcnB4O21hcmdpbi10b3A6IDMwcnB4O31cclxuLmNhcmRUaXRsZXtmbG9hdDogbGVmdDtjb2xvcjojZmZmO2ZvbnQtc2l6ZTogNDBycHg7bWFyZ2luLWxlZnQ6IDcwcnB4O3dpZHRoOjYwJTtvdmVyZmxvdzogaGlkZGVuO3RleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO3doaXRlLXNwYWNlOiBub3dyYXA7fVxyXG4uc3RhdHVze2Zsb2F0OiByaWdodDtjb2xvcjojZmZmO2ZvbnQtc2l6ZTogNDBycHg7fVxyXG4udXNlTnVte2NvbG9yOiNCOEU5RUQ7Zm9udC1zaXplOiAyMnJweDttYXJnaW4tdG9wOiA1MHJweDt9XHJcbi5jYXJkRm9vdHtjb2xvcjojZmZmO2ZvbnQtc2l6ZTogMjJycHg7bWFyZ2luLXRvcDogMTBycHg7fVxyXG4ubWF4X2JyZWFrc01vbmV5e2Zsb2F0OiBsZWZ0O31cclxuLmVuZFRpbWV7ZmxvYXQ6IGxlZnQ7bWFyZ2luLWxlZnQ6IDQwcnB4O31cclxuLmZpeEZvb3Rlcnt3aWR0aDoxMDAlO2JhY2tncm91bmQ6ICNmZmY7aGVpZ2h0OiA5NnJweDtsaW5lLWhlaWdodDogOTZycHg7cG9zaXRpb246IGZpeGVkO2xlZnQ6IDA7Ym90dG9tOjA7ei1pbmRleDogOTk5O31cclxuLmZvb3RNb25leXtmb250LXNpemU6MjhycHggO2NvbG9yOiM2NjY7d2lkdGg6NDAwcnB4O2Zsb2F0OmxlZnQ7bWFyZ2luLWxlZnQ6IDI1cnB4O31cclxuLmZvb3RNb25leSB0ZXh0e2NvbG9yOiNGQTRDMzQ7fVxyXG4uZ29QYXl7d2lkdGg6MjAwcnB4O2hlaWdodDo5NnJweCA7bGluZS1oZWlnaHQ6OTZycHg7Ym9yZGVyOm5vbmU7cGFkZGluZy1sZWZ0OiAwO3BhZGRpbmctcmlnaHQ6MDtiYWNrZ3JvdW5kOiAjRkY3MjVDO2ZvbnQtc2l6ZTogMzJycHg7Y29sb3I6I2ZmZiA7dGV4dC1hbGlnbjogY2VudGVyO2JvcmRlci1yYWRpdXM6IDA7ZmxvYXQ6IHJpZ2h0O31cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIl19 */
</style>