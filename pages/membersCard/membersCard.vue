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
		<view class="header">
			<view class="top">
				<view class="saveMoney">已为您节省 € <text>{{saveMoney}}</text></view>
				<view class="bugNewCard" @tap="toBuyNewCard">购买新卡</view>
			</view>
			<view v-for="(item, index) in cardInfor" :key="index" class="cardShow">
				<image :src="item.photo" class="card-bg" mode="widthFix"></image>
				<view class="cardShowIn">
					<view class="cardTop">
						<view class="cardTitle">{{item.title}}</view>
						<view class="status">生效中</view>
					</view>
					<view class="useNum">单日可使用次数: {{item.limits}}单</view>
					<view class="cardFoot">
						<view class="max_breaksMoney">每单最多减免配送费: €{{item.reduce}}</view>
						<view class="endTime">{{item.ltime_label}} 到期</view>
					</view>
				</view>
			</view>
		</view>
		<view class="useDetailTitle">
			<text></text>
			减免明细
			<text></text>
		</view>

		<view class="useDetail">
			<view v-for="(item, index) in useDetailInfor" :key="index" class="useDetailLi">
				<view class="titleOrTime">
					<view class="useTitle">配送费减免</view>
					<view class="useTime">{{item.dateline}}</view>
				</view>
				<view class="useMoney">€ <text>{{item.money}}</text></view>
			</view>
			<view class="noMore" :hidden="moreShow">没有更多啦~</view>
		</view>
	</view>
</template>

<script>
	// pages/membersCard/membersCard.js
	var app = getApp();

	export default {
		data() {
			return {
				useDetailInfor: [],
				cardInfor: [],
				saveMoney: '',
				page: 1,
				moreShow: true,
				useData: "",
				loadhide: false,
				showToast: {
					isShow: false
				}
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
		onShow: function() {
			var that = this; // 配送卡使用记录列表

			app.globalData.peicardLogs({
				"page": that.page
			}, function(res) {
				for (var i = 0; i < res.data.items.length; i++) {
					res.data.items[i].dateline = that.toDate(res.data.items[i].dateline);
				}

				if (res.error == '0') {
					that.setData({
						useDetailInfor: res.data.items,
						useData: app.globalData.getLocalTime(res.data.items.dateline)
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}
			}); // 已购买配送卡

			app.globalData.minePeicard({}, function(res) {
				console.log(res);

				if (res.error == '0') {
					that.setData({
						cardInfor: res.data.items,
						saveMoney: res.data.moneys
					});
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},

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
		onReachBottom: function() {
			var that = this;
			var page = that.page;
			page++;
			app.globalData.peicardLogs({
				"page": page
			}, function(res) {
				for (var i = 0; i < res.data.items.length; i++) {
					res.data.items[i].dateline = that.toDate(res.data.items[i].dateline);
				}

				if (res.error == '0') {
					var len = res.data.items.length;

					if (len == 0) {
						that.setData({
							loadhide: true,
							moreShow: false
						});
					} else {
						that.setData({
							loadhide: false,
							moreShow: true,
							useDetailInfor: that.useDetailInfor.concat(res.data.items),
							page: page
						});
					}
				} else {
					uni.showToast({
						title: res.message
					});
				}
			});
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			// 跳转到购买新卡页面
			toBuyNewCard: function() {
				app.globalData.topage('../buyNewCard/buyNewCard');
			},
			//   时间戳格式化时间
			toDate: function(number) {
				var n = number * 1000;
				var date = new Date(n);
				var Y = date.getFullYear() + '/';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
				var Mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
				var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + "  " + H + Mi + S;
			}
		}
	};
</script>
<style>
	/* pages/membersCard/membersCard.wxss */
	page {
		background: #F5F7FA;
	}

	.header {
		width: 700rpx;
		padding: 0 25rpx 30rpx 25rpx;
	}

	.top {
		height: 120rpx;
	}

	.saveMoney {
		height: 120rpx;
		line-height: 120rpx;
		float: left;
		font-size: 28rpx;
		width: 500rpx;
		color: #333;
	}

	.bugNewCard {
		width: 156rpx;
		height: 56rpx;
		line-height: 56rpx;
		text-align: center;
		background: #FF725C;
		float: right;
		margin-top: 32rpx;
		color: #fff;
		border-radius: 5rpx;
		font-size: 24rpx;
	}

	.cardShow {
		width: 100%;
		height: 236rpx;
		position: relative;
		margin-bottom: 25rpx;
	}

	.card-bg {
		width: 100%;
	}

	.cardShowIn {
		position: absolute;
		top: 0;
		left: 25rpx;
		width: 650rpx;
	}

	.cardTop {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		margin-top: 30rpx;
	}

	.cardTitle {
		float: left;
		color: #fff;
		font-size: 40rpx;
		margin-left: 70rpx;
	}

	.status {
		float: right;
		color: #fff;
		font-size: 30rpx;
	}

	.useNum {
		color: #B8E9ED;
		font-size: 22rpx;
		margin-top: 50rpx;
	}

	.cardFoot {
		color: #B8E9ED;
		font-size: 22rpx;
		margin-top: 10rpx;
	}

	.max_breaksMoney {
		float: left;
	}

	.endTime {
		float: right;
	}

	.useDetailTitle {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		color: #999;
		text-align: center;
	}

	.useDetailTitle text {
		display: inline-block;
		width: 120rpx;
		height: 1rpx;
		background: #ccc;
		position: relative;
		top: -10rpx;
	}

	.useDetailTitle text:first-child {
		left: -30rpx;
	}

	.useDetailTitle text:last-child {
		right: -30rpx;
	}

	.useDetail {
		background: #fff;
	}

	.useDetailLi {
		width: 700rpx;
		padding: 0 25rpx;
		height: 120rpx;
		border-bottom: 1px solid #EDEDED;
	}

	.titleOrTime {
		width: 500rpx;
		float: left;
	}

	.useMoney {
		float: right;
		text-align: center;
		height: 120rpx;
		line-height: 120rpx;
		color: #E63737;
		font-size: 28rpx;
	}

	.useTitle {
		font-size: 28rpx;
		color: #333;
		margin-top: 25rpx;
	}

	.useTime {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.noMore {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		background: #F5F7FA;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwbF9DTVFDJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVDQUF1QztBQUN2QyxRQUFRLFlBQVksQ0FBQywyQkFBMkIsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNsRSxLQUFLLGNBQWMsQ0FBQztBQUNwQixXQUFXLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUNuRyxZQUFZLFlBQVksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNoTCxVQUFVLFVBQVUsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUM7QUFDM0UsU0FBUyxVQUFVLENBQUM7QUFDcEIsWUFBWSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztBQUM5RCxTQUFTLFVBQVUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUM7QUFDdkUsV0FBVyxXQUFXLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO0FBQ3RFLFFBQVEsWUFBWSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNqRCxRQUFRLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQztBQUN6RCxVQUFVLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQztBQUMzRCxpQkFBaUIsV0FBVyxDQUFDO0FBQzdCLFNBQVMsWUFBWSxDQUFDO0FBQ3RCLGdCQUFnQixVQUFVLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUM3RyxxQkFBcUIscUJBQXFCLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7QUFDcEgsaUNBQWlDLFlBQVksQ0FBQztBQUM5QyxnQ0FBZ0MsYUFBYSxDQUFDO0FBQzlDLFdBQVcsZ0JBQWdCLENBQUM7QUFDNUIsYUFBYSxZQUFZLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQztBQUN6RixhQUFhLFlBQVksQ0FBQyxXQUFXLENBQUM7QUFDdEMsVUFBVSxZQUFZLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUM1RyxVQUFVLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztBQUN4RCxTQUFTLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztBQUN2RCxRQUFRLFVBQVUsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHBhZ2VzL21lbWJlcnNDYXJkL21lbWJlcnNDYXJkLnd4c3MgKi9cclxuLmhlYWRlcnt3aWR0aDo3MDBycHg7cGFkZGluZzowIDI1cnB4IDMwcnB4IDI1cnB4O2JhY2tncm91bmQ6ICNmZmY7fVxyXG4udG9we2hlaWdodDogMTIwcnB4O31cclxuLnNhdmVNb25leXtoZWlnaHQ6IDEyMHJweDtsaW5lLWhlaWdodDogMTIwcnB4O2Zsb2F0OiBsZWZ0O2ZvbnQtc2l6ZTogMjhycHg7d2lkdGg6NTAwcnB4O2NvbG9yOiMzMzM7fVxyXG4uYnVnTmV3Q2FyZHt3aWR0aDoxNTZycHg7aGVpZ2h0OjU2cnB4IDtsaW5lLWhlaWdodDogNTZycHg7dGV4dC1hbGlnbjogY2VudGVyO2JhY2tncm91bmQ6ICNGRjcyNUM7ZmxvYXQ6IHJpZ2h0O21hcmdpbi10b3A6IDMycnB4O2NvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czogNXJweDtmb250LXNpemU6IDI0cnB4O31cclxuLmNhcmRTaG93e3dpZHRoOjEwMCU7aGVpZ2h0OjIzNnJweCA7cG9zaXRpb246IHJlbGF0aXZlO21hcmdpbi1ib3R0b206MjVycHg7fVxyXG4uY2FyZC1iZ3t3aWR0aDoxMDAlO31cclxuLmNhcmRTaG93SW57cG9zaXRpb246IGFic29sdXRlO3RvcDowO2xlZnQ6IDI1cnB4O3dpZHRoOjY1MHJweDt9XHJcbi5jYXJkVG9we3dpZHRoOjEwMCU7aGVpZ2h0OiA2MHJweDtsaW5lLWhlaWdodDogNjBycHg7bWFyZ2luLXRvcDogMzBycHg7fVxyXG4uY2FyZFRpdGxle2Zsb2F0OiBsZWZ0O2NvbG9yOiNmZmY7Zm9udC1zaXplOiA0MHJweDttYXJnaW4tbGVmdDogNzBycHg7fVxyXG4uc3RhdHVze2Zsb2F0OiByaWdodDtjb2xvcjojZmZmO2ZvbnQtc2l6ZTogMzBycHg7fVxyXG4udXNlTnVte2NvbG9yOiNCOEU5RUQ7Zm9udC1zaXplOiAyMnJweDttYXJnaW4tdG9wOiA1MHJweDt9XHJcbi5jYXJkRm9vdHtjb2xvcjojQjhFOUVEO2ZvbnQtc2l6ZTogMjJycHg7bWFyZ2luLXRvcDogMTBycHg7fVxyXG4ubWF4X2JyZWFrc01vbmV5e2Zsb2F0OiBsZWZ0O31cclxuLmVuZFRpbWV7ZmxvYXQ6IHJpZ2h0O31cclxuLnVzZURldGFpbFRpdGxle3dpZHRoOjEwMCU7aGVpZ2h0OiAxMDBycHg7bGluZS1oZWlnaHQ6IDEwMHJweDtmb250LXNpemU6MzBycHggO2NvbG9yOiM5OTk7dGV4dC1hbGlnbjogY2VudGVyO31cclxuLnVzZURldGFpbFRpdGxlIHRleHR7ZGlzcGxheTogaW5saW5lLWJsb2NrO3dpZHRoOjEyMHJweDtoZWlnaHQ6IDFycHg7YmFja2dyb3VuZDogI2NjYztwb3NpdGlvbjogcmVsYXRpdmU7dG9wOi0xMHJweDt9XHJcbi51c2VEZXRhaWxUaXRsZSB0ZXh0OmZpcnN0LWNoaWxke2xlZnQ6IC0zMHJweDt9XHJcbi51c2VEZXRhaWxUaXRsZSB0ZXh0Omxhc3QtY2hpbGR7cmlnaHQ6IC0zMHJweDt9XHJcbi51c2VEZXRhaWx7YmFja2dyb3VuZDogI2ZmZjt9XHJcbi51c2VEZXRhaWxMaXt3aWR0aDo3MDBycHg7cGFkZGluZzowIDI1cnB4O2hlaWdodDogMTIwcnB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNFREVERUQ7fVxyXG4udGl0bGVPclRpbWV7d2lkdGg6NTAwcnB4O2Zsb2F0OiBsZWZ0O31cclxuLnVzZU1vbmV5e2Zsb2F0OiByaWdodDt0ZXh0LWFsaWduOiBjZW50ZXI7aGVpZ2h0OiAxMjBycHg7bGluZS1oZWlnaHQ6IDEyMHJweDtjb2xvcjojRTYzNzM3O2ZvbnQtc2l6ZTogMjhycHg7fVxyXG4udXNlVGl0bGV7Zm9udC1zaXplOiAyOHJweDtjb2xvcjojMzMzO21hcmdpbi10b3A6IDI1cnB4O31cclxuLnVzZVRpbWV7Zm9udC1zaXplOiAyNHJweDtjb2xvcjojOTk5O21hcmdpbi10b3A6IDEwcnB4O31cclxuLm5vTW9yZXt3aWR0aDoxMDAlO2hlaWdodDogMTAwcnB4O2xpbmUtaGVpZ2h0OjEwMHJweDt0ZXh0LWFsaWduOiBjZW50ZXI7Zm9udC1zaXplOiAyOHJweDtjb2xvcjojNjY2O31cclxuIl19 */
</style>