<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view class="ser_box_box">
			<view class="ser_box">
				<image src="/static/image/quan_sou.png" class="ico"></image><input placeholder="搜索小区/写字楼/学校等"
					:value='keyword' placeholder-style="color:#999" @input="keywordSearch">
			</view>
			<button type="primary" hover-class="none" @tap="sbmt"> 搜索 </button>
		</view>
		<view style="height:80rpx;"></view>
		<view class="mapBox">
			<map class="map" id="map" :longitude="longitude" :latitude="latitude" scale="16" show-compass="true"
				:markers="markers" style="width:100%; height:400rpx;"></map>
		</view>
		<view class="contBox">

			<view class="mapAddr_list_box">
				<view class="ml10 mb5 black6" v-if="mineLists.length > 0">我的收货地址</view>
				<block v-for="(item, index) in mineLists" :key="index">
					<view class="addr_list mb10" @tap="addrTo" :data-addr="item.addr + '-' + item.house"
						:data-title="item.title" :data-lat="item.lat" :data-lng="item.lng">
						<view class="bt">{{item.contact}}-{{item.mobile}}</view>
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
							<view class="addr">{{item.addr}}-{{item.house}}</view>
							<view class="clear"></view>
						</view>
					</view>
				</block>

				<view class="ml10 mb5 black6" v-if="nearlists.length > 0">附近地址</view>
				<view>
					<block v-for="(item, index) in nearlists" :key="index">
						<view class="mapAddr_list" @tap="addrTo" :data-addr="item.title" :data-lat="item.location[1]"
							:data-lng="item.location[0]">
							<image src="/static/image/index_icon_shopDes_location_ray3x.png" class="fl ico"></image>
							<view class="wz_box">
								<view class="bt overflow_clear">{{item.title}}</view>
								<view class="overflow_clear black9">{{item.address}}</view>
							</view>
							<view clss="clear"></view>
						</view>
					</block>
				</view>
				<view class="addr_no" v-if="searchlen==true">
					<image src="/static/image/addr_no.png"></image>
					<view>无法识别该地点</view>
				</view>
				<view class="addr_no" v-if="nearlists.length==0 && searchlen!=true">
					<image src="/static/image/addr_no.png"></image>
					<view>暂无地点，请输入搜索</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp(); // 引入高德SDK核心类

	var config = require("../../libs/config.js");
	export default {
		data() {
			return {
				keyword: '',
				addrId: '',
				currentaddr: '',
				chooseaddr: {},
				mineLists: [],
				nearlists: [],
				searchlen: false,
				city: '',
				latitude: '',
				longitude: '',
				markers: [],
				useraddrbt: false,
				addr_lists: "",
				showToast: {
					isShow: false
				}
			};
		},

		components: {},
		props: {},
		onLoad: function(option) {},
		onShow: function() {
			var that = this; //我的收货地址

			if (app.globalData._CFG.TOKEN.length > 0) {
				app.globalData.mineAddr({
					"page": 1
				}, function(res) {
					console.log(res);

					if (res.error == '0') {
						uni.setStorage({
							key: 'useraddr',
							data: res.data.items
						});
						uni.getStorage({
							key: 'useraddr',
							success: function(res) {
								that.mineLists = res.data
								that.useraddrbt = true;
							}
						});
					}
				});
			} else {
				app.globalData.remove('useraddr');
			}
		},
		methods: {
			//关键词搜索地址
			keywordSearch: function(e) {
				this.keyword = e.detail.value;
			},
			sbmt: function(e) {
				var that = this; // 调用接口

				var keyword = that.keyword,
					location = that.longitude + "," + that.latitude,
					city = that.city;
				uni.request({
					url: `https://apis.map.qq.com/ws/place/v1/suggestion?keyword=${keyword}&region=å¨å½&region_fix=0&policy=0&page_size=10&page_index=1&get_subpois=0&output=json&key=${config.data.key}&oversea=1`,
					// &location=40.935,-0.76&radius=30000
					success: res => {
						if (res.data.status == 0) {
							if (res.data.data.length == 0) {
								that.searchlen = true
								that.nearlists = []
								return false;
							}

							var nearlists = res.data.data;

							for (var i in nearlists) {
								nearlists[i].location = [nearlists[i].location.lng, nearlists[i].location
									.lat
								];
							}

							; // for (var i in nearlists) {
							//     if (JSON.stringify(nearlists[i].location) == "[]") {
							//     } else {
							//         nearlists[i].location = nearlists[i].location.split(",");
							//     };
							// };
							// nearlists = nearlists.filter(function (value) {
							//     return JSON.stringify(value.location) != "[]";
							// });

							that.latitude = nearlists[0].location[1];
							that.longitude = nearlists[0].location[0];
							that.currentaddr = nearlists[0].title;
							that.chooseaddr = {
								lng: nearlists[0].location[0],
								lat: nearlists[0].location[1]
							};
							that.markers = [{
								id: 0,
								latitude: nearlists[0].location[1],
								longitude: nearlists[0].location[0]
							}];
							that.nearlists = nearlists;
							return;
							that.addr_lists = res.data.data;
							if (res.data.data.length <= 0) return utils.showfail('该范围没有搜索到地址');
						} else {
							utils.showfail('搜索失败，请稍后再试');
						}
					},
					fail: err => {
						utils.showfail('搜索失败，请稍后再试');
					}
				});
				return;
			},
			addrTo: function(e) {
				var that = this;
				var addr = e.currentTarget.dataset.addr;
				var lat = e.currentTarget.dataset.lat;
				var lng = e.currentTarget.dataset.lng;
				uni.setStorage({
					key: 'addr',
					data: {
						addr: addr,
						lat: lat,
						lng: lng
					},
					success: function(res) {}
				});
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>
<style>
	/* #ifdef  H5 */
	.ser_box_box {
		margin-top: 80rpx;
	}

	/* #endif  */
	.ser_box_box {
		position: fixed;
		z-index: 10;
		left: 0;
		top: 0;
		/*   #ifdef  H5   */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*   #endif   */
		right: 0;
		background: #eef2f5;
	}

	.ser_box {
		margin: 10rpx 150rpx 10rpx 20rpx;
		background: #fff;
		border-radius: 10rpx;
		padding-left: 66rpx;
		height: 56rpx;
		border: 2rpx solid #eee;
		position: relative;
	}

	.ser_box input {
		width: 100%;
		height: 56rpx;
		color: #333;
		font-size: 28rpx;
	}

	.ser_box .ico {
		position: absolute;
		top: 15rpx;
		left: 20rpx;
		width: 26rpx;
		height: 26rpx;
	}

	.ser_box_box button {
		position: absolute;
		right: 20rpx;
		top: 10rpx;
		height: 56rpx;
		line-height: 56rpx;
		width: 110rpx;
		padding: 0;
		font-size: 28rpx;
		background: #f90;
	}

	.mapAddr_list {
		background: #fff;
	}

	.mapAddr_list:first-child .wz_box .bt {
		color: #1296fa;
	}

	.mapAddr_list .ico {
		width: 28rpx;
		height: 32rpx;
		margin: 0 30rpx;
		margin-top: 50rpx;
	}

	.mapAddr_list .wz_box {
		margin-left: 88rpx;
		line-height: 40rpx;
		padding: 20rpx 20rpx 20rpx 0;
		border-bottom: 2rpx solid #e6e6e6;
	}

	.mapAddr_list .wz_box .bt {
		font-size: 28rpx;
		margin-bottom: 10rpx;
	}

	.mapAddr_list_box {
		padding-top: 40rpx;
	}

	.currentadd {
		height: 80rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		line-height: 80rpx;
		padding-left: 24rpx;
		font-size: 28rpx;
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
	}

	.currentadd view {
		color: #ff797c;
		flex-shrink: 0;
	}

	.currentadd text {
		flex: 1;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.refresh {
		padding-right: 24rpx;
	}

	.addr_no {
		text-align: center;
		padding: 50px 0 20px;
		font-size: 13px;
		color: #666;
		line-height: 20px;
	}

	.addr_no image {
		width: 130px;
		height: 87px;
		margin-bottom: 10px;
	}

	.addr_list {
		background: #fff;
	}

	.addr_list .bt {
		padding: 20rpx;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.addr_list .addr {
		font-size: 24rpx;
		line-height: 40rpx;
		color: #666;
		margin-left: 112rpx;
	}

	.addr_list .bottom {
		padding: 0 20rpx 20rpx;
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

	.contBox {
		height: calc(100% - 480rpx);
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
</style>