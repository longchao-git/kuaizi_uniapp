<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
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
	// subPages/member/membersCard/membersCard.js
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
					that.useDetailInfor = res.data.items
					that.useData = app.globalData.getLocalTime(res.data.items.dateline)

				} else {
					uni.showToast({
						title: res.message
					});
				}
			}); // 已购买配送卡

			app.globalData.minePeicard({}, function(res) {
				console.log(res);

				if (res.error == '0') {
					that.cardInfor = res.data.items
					that.saveMoney = res.data.moneys
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
						that.loadhide = true
						that.moreShow = false
					} else {
						that.loadhide = false
						that.moreShow = true
						that.useDetailInfor = that.useDetailInfor.concat(res.data.items)
						that.page = page
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
	/* subPages/member/membersCard/membersCard.wxss */
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
</style>