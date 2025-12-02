<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<view class="ser_box_box">
					<view v-if="is_fz" class="city" @tap.stop="toCity"><text>{{currentCity}}</text>
						<image class="ico" src="/static/image/topBottom.png" mode="aspectFit"></image>
					</view>
					<view class="ser_box">
						<image src="/static/image/quan_sou.png" class="ico"></image><input placeholder="请输入你的收货地址"
							:value='keyword' placeholder-style="color:#999" @input="keywordSearch">
					</view>
					<button type="primary" hover-class="none" @tap="sbmt"> 搜索 </button>
				</view>
				<view class="currentadd">
					<text @tap="addrTo" :data-addr="currentaddr" :data-lat="chooseaddr.lat"
						:data-lng="chooseaddr.lng">当前位置:{{currentaddr}}</text>
					<!--<view class="refresh" bindtap="again">重新定位</view>-->
				</view>
				<view class="mapAddr_list_box">
					<view class="ml10 mb5 black6" v-if="addr_lis.length>0">我的收货地址</view>
					<scroll-view scroll-y="true" style="height:100%;" v-if="addr_lis.length>0">
						<block v-for="(item, index) in addr_lis" :key="index">
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
					</scroll-view>
					<view class="ml10 mb5 black6" v-if="addr_lists.length > 0">附近地址</view>
					<view class="addr_no" v-if="searchlen==true">
						<image src="/static/image/addr_no.png"></image>
						<view>无法识别该地点</view>
					</view>
					<view class="addr_no" v-if="addr_lists.length==0 && addr_lis.length==0 && searchlen!=true">
						<image src="/static/image/addr_no.png"></image>
						<view>暂无地点，请输入搜索</view>
					</view>
					<scroll-view scroll-y="true" style="height:100%;">
						<block v-for="(item, index) in addr_lists" :key="index">
							<view class="mapAddr_list" @tap="addrTo" :data-addr="item.title"
								:data-lat="item.location.lat" :data-lng="item.location.lng"
								:data-alladdr="item.title + item.address">
								<image src="/static/image/index_icon_shopDes_location_ray3x.png" class="fl ico"></image>
								<view class="wz_box">
									<view class="bt overflow_clear">{{item.title}}</view>
									<view class="overflow_clear black9">{{item.address}}</view>
								</view>
								<view clss="clear"></view>
							</view>
						</block>
					</scroll-view>
				</view>

			</view>
		</skeleton>

	</view>
</template>

<script>
	var app = getApp(); // 引入SDK核心类
	// 引入SDK核心类
	var QQMapWX = require("../../../js/qqmap-wx-jssdk.js");
	var config = require("../../../libs/config.js");
	var qqmapsdk;

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},

				is_fz: app.globalData._CFG.is_fz,
				addr_lists: [],
				keyword: '',
				latitude: '',
				longitude: '',
				markers: [],
				controls: [],
				addrId: '',
				currentaddr: '',
				chooseaddr: {
					lng: "",
					lat: ""
				},
				addr_lis: [],
				searchlen: false,
				currentCity: '' //当前城市

			};
		},

		components: {},
		props: {},
		created() {
			//骨架屏
			this.reloadData()
		},
		onLoad: function(option) {
			// 实例化API核心类

			qqmapsdk = new QQMapWX({
				key: config.data.key
			});
			var that = this; //定位接口

			app.globalData.addrdecode({
				"lng": app.globalData._CFG.currentlng,
				"lat": app.globalData._CFG.currentlat
			}, function(ret) {
				console.log("定位", ret);

				if (ret.error == 0) {
					that.currentaddr = ret.data.addr.addr;
					that.chooseaddr = {
						lat: ret.data.addr.lat,
						lng: ret.data.addr.lng
					};
				} else {
					that.currentaddr = "定位失败,请重新定位";
				}
			});
		},
		onShow: function() {
			var that = this; //获取分站城市

			uni.getStorage({
				key: 'fzCity',
				success: function(res) {
					that.currentCity = res.data;
				}
			});
			app.globalData.getcitylist({}, res => {
				if (res.error === '0') app.globalData.allcitylist = res.data.items;
			}); // 调用接口


			if (app.globalData._CFG.TOKEN.length > 0) {
				app.globalData.mineAddr({
					"page": 1
				}, function(res) {
					// console.log(res);
					if (res.error == '0') {
						uni.setStorage({
							key: 'useraddr',
							data: res.data.items
						});
						uni.getStorage({
							key: 'useraddr',
							success: function(res) {
								that.useraddrbt = true;
								that.addr_lis = res.data;
							}
						});
					}
				});
			} else {
				app.globalData.remove('useraddr');
			}

			;
		},
		methods: {
			//骨架屏
			reloadData() {
				this.loading = true
				setTimeout(() => {
					this.loading = false
				}, 3000)
			},
			//实时搜索
			keywordSearch: function(e) {
				var that = this;
				that.keyword = e.detail.value; // // 调用接口

			},
			sbmt: function(e) {
				var that = this; // 调用接口

				var keyword = that.is_fz ? that.currentCity + that.keyword : that.keyword;
				uni.request({
					url: `https://apis.map.qq.com/ws/place/v1/suggestion?keyword=${keyword}&region=å¨å½&region_fix=0&policy=0&page_size=10&page_index=1&get_subpois=0&output=json&key=${config.data.key}&oversea=1`,
					// &location=40.935,-0.76&radius=30000
					success: res => {
						if (res.data.status == 0) {
							that.addr_lists = res.data.data;
							if (res.data.data.length <= 0) return utils.showfail('该范围没有搜索到地址');
						} else { // utils.showfail('搜索失败，请稍后再试');
						}
					},
					fail: err => {
						utils.showfail('搜索失败，请稍后再试');
					}
				});
			},
			addrTo: function(e) {
				var that = this;
				var addr = e.currentTarget.dataset.addr;
				var alladdr = e.currentTarget.dataset.alladdr;
				var lat = e.currentTarget.dataset.lat;
				var lng = e.currentTarget.dataset.lng;
				console.log(addr, lat, lng, app.globalData.allcitylist, app.globalData._CFG.lat, app.globalData._CFG
					.lng, app.globalData); // return

				let allcitylist = app.globalData.allcitylist;

				for (let i = 0, len = allcitylist.length; i < len; i++) {
					if (alladdr ? alladdr.indexOf(allcitylist[i].city_en_name) > -1 : addr.indexOf(allcitylist[i]
							.city_en_name) > -1) {
						app.globalData.city_id = allcitylist[i].city_id;
						uni.setStorage({
							key: 'currentCityId',
							data: allcitylist[i].city_id
						});
						break;
					}
				}

				app.globalData._CFG.lat = lat;
				app.globalData._CFG.lng = lng;
				uni.setStorage({
					key: 'currentAddr',
					data: {
						addr: addr,
						lat: lat,
						lng: lng
					},
					success: function(res) {
						app.globalData.topage(1, "back");
					}
				});
			},

			//去城市页面
			toCity() {
				app.globalData.topage("/pages/position/city/city");
			}

		}
	};
</script>
<style>
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
		background: #fff;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.ser_box {
		margin: 10rpx 150rpx 10rpx 20rpx;
		background: #f7f7f7;
		border-radius: 10rpx;
		padding-left: 66rpx;
		height: 56rpx;
		border: 2rpx solid #eee;
		position: relative;
		flex: 1;
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

	.ser_box_box .city {
		line-height: 56rpx;
		padding: 10rpx 0 10rpx 20rpx;
	}

	.ser_box_box .city text {
		line-height: 56rpx;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 80rpx;
		vertical-align: bottom;
		font-size: 26rpx;
	}

	.ser_box_box .city .ico {
		width: 16rpx;
		height: 10rpx;
		margin-left: 4rpx;
		vertical-align: middle;
	}

	.mapAddr_list {
		background: #fff;
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
		margin-top: 82rpx;
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
</style>