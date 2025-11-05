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
			<!-- <view class="currentadd">
        <text bindtap="addrTo" data-addr="{{currentaddr}}" data-lat="{{chooseaddr.lat}}" data-lng="{{chooseaddr.lng}}">当前位置：{{currentaddr}}</text>
    </view> -->
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
	// var amapFile = require('../../utils/amap-wx.js');
	// var myAmapFun = new amapFile.AMapWX({ key: 'fc7801e1c9e0f7eb8877161e545ce96c' });
	// 引入高德SDK核心类
	// var amapFile = require('../../utils/amap-wx.js');
	// var myAmapFun = new amapFile.AMapWX({ key: 'fc7801e1c9e0f7eb8877161e545ce96c' });
	var config = require("../../libs/config.js"); // var QQMapWX = require('../../../js/qqmap-wx-jssdk.js')
	// let = new QQMapWX({
	//     key: config.data.key
	// });

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
								that.setData({
									mineLists: res.data,
									useraddrbt: true
								});
							}
						});
					}
				});
			} else {
				app.globalData.remove('useraddr');
			}

			; //地图中心点
			// myAmapFun.getRegeo({
			//     success: function(data) {
			//         var nearlists = data[0].regeocodeData.pois;
			//         for (var i in nearlists) {
			//             nearlists[i].location = nearlists[i].location.split(",");
			//         };
			//         if (data[0].regeocodeData.addressComponent.city != '') {
			//             that.setData({
			//                 city: data[0].regeocodeData.addressComponent.city
			//             });
			//         } else {
			//             that.setData({
			//                 city: data[0].regeocodeData.addressComponent.province
			//             });
			//         };
			//         that.setData({
			//             latitude: data[0].latitude,
			//             longitude: data[0].longitude,
			//             currentaddr: data[0].name,
			//             chooseaddr: {
			//                 lng: data[0].longitude,
			//                 lat: data[0].latitude
			//             },
			//             markers: [{
			//                 id: 0,
			//                 latitude: data[0].latitude,
			//                 longitude: data[0].longitude
			//             }],
			//             nearlists: nearlists
			//         });
			//     },
			//     fail: function(info) {
			//         //失败回调
			//         console.log(info)
			//     }
			// });
		},
		methods: {
			//关键词搜索地址
			keywordSearch: function(e) {
				this.setData({
					keyword: e.detail.value
				});
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
								that.setData({
									searchlen: true,
									nearlists: []
								});
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

							that.setData({
								latitude: nearlists[0].location[1],
								longitude: nearlists[0].location[0],
								currentaddr: nearlists[0].title,
								chooseaddr: {
									lng: nearlists[0].location[0],
									lat: nearlists[0].location[1]
								},
								markers: [{
									id: 0,
									latitude: nearlists[0].location[1],
									longitude: nearlists[0].location[0]
								}],
								nearlists: nearlists
							});
							return;
							that.setData({
								addr_lists: res.data.data
							});
							if (res.data.data.length <= 0) return utils.showfail('该范围没有搜索到地址');
						} else {
							utils.showfail('搜索失败，请稍后再试');
						}
					},
					fail: err => {
						utils.showfail('搜索失败，请稍后再试');
					}
				});
				return; // myAmapFun.getInputtips({
				//     keywords: keyword,
				//     city: city,
				//     citylimit: 1,
				//     location: location,
				//     success: function(data) {
				//         if (data.tips.length == 0) {
				//             that.setData({
				//                 searchlen: true,
				//                 nearlists: []
				//             });
				//             return false;
				//         };
				//         var nearlists = data.tips;
				//         for (var i in nearlists) {
				//             if (JSON.stringify(nearlists[i].location) == "[]") {} else {
				//                 nearlists[i].location = nearlists[i].location.split(",");
				//             };
				//         };
				//         nearlists = nearlists.filter(function(value) {
				//             return JSON.stringify(value.location) != "[]";
				//         });
				//         that.setData({
				//             latitude: nearlists[0].location[1],
				//             longitude: nearlists[0].location[0],
				//             currentaddr: nearlists[0].name,
				//             chooseaddr: {
				//                 lng: nearlists[0].location[0],
				//                 lat: nearlists[0].location[1]
				//             },
				//             markers: [{
				//                 id: 0,
				//                 latitude: nearlists[0].location[1],
				//                 longitude: nearlists[0].location[0]
				//             }],
				//             nearlists: nearlists
				//         });
				//     },
				//     fail: function(info) {
				//         //失败回调
				//         console.log(info)
				//     }
				// });
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

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwY1ZfcnFyJTNFIiwiPG5vIHNvdXJjZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSxlQUFlLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVDQTFELG9CQUFBLENBQUEsaURBQUEsQ0FBQSw0Q0FBQSxDQUFBLGdCQUFBLENEQTRELFFBQVEsRUFBRSxtQkFBbUIsQ0FBQztBQUMxRixTQUFTLCtCQUErQixDQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsa0JBQWtCLENBQUM7QUFDaEssZ0JBQWdCLFdBQVcsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQztBQUN6RSxjQUFjLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQztBQUN0RixvQkFBb0Isa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUNuSyxjQUFjLGdCQUFnQixDQUFDO0FBQy9CLHNDQUFzQyxjQUFjLENBQUM7QUFDckQsb0JBQW9CLFlBQVksRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixDQUFDO0FBQ25GLHNCQUFzQixrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSwyQkFBMkIsRUFBRSxpQ0FBaUMsQ0FBQztBQUM3SCwwQkFBMEIsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUM7QUFDakUsbUJBQW1CLGlCQUFpQixDQUFDO0FBQ3JDLFlBQVksYUFBYSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUM7QUFDcE0saUJBQWlCLGNBQWMsQ0FBQyxjQUFjLENBQUM7QUFDL0MsaUJBQWlCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztBQUNyRixTQUFTLG9CQUFvQixDQUFDOztBQUU5QixTQUFTLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUM7QUFDbEcsZUFBZSxZQUFZLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDOztBQUUvRCxXQUFXLGdCQUFnQixDQUFDO0FBQzVCLGVBQWUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDO0FBQ3BFLGlCQUFpQixnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLENBQUM7QUFDeEYsbUJBQW1CLHFCQUFxQixDQUFDO0FBQ3pDLHlCQUF5QixZQUFZLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQztBQUMvSCw0QkFBNEIsbUJBQW1CLENBQUM7QUFDaEQsNEJBQTRCLG1CQUFtQixDQUFDO0FBQ2hELDRCQUE0QixtQkFBbUIsQ0FBQztBQUNoRCw0QkFBNEIsbUJBQW1CLENBQUM7O0FBRWhELFNBQVMsMEJBQTBCLEdBQUcsY0FBYyxDQUFDLGlDQUFpQyxDQUFDIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zZXJfYm94X2JveHtwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDEwOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBiYWNrZ3JvdW5kOiAjZWVmMmY1O31cclxuLnNlcl9ib3h7bWFyZ2luOjEwcnB4IDE1MHJweCAxMHJweCAyMHJweDtiYWNrZ3JvdW5kOiNmZmY7IGJvcmRlci1yYWRpdXM6IDEwcnB4OyBwYWRkaW5nLWxlZnQ6IDY2cnB4OyBoZWlnaHQ6IDU2cnB4OyBib3JkZXI6IDJycHggc29saWQgI2VlZTsgcG9zaXRpb246IHJlbGF0aXZlO31cclxuLnNlcl9ib3ggaW5wdXR7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDU2cnB4OyBjb2xvcjogIzMzMzsgZm9udC1zaXplOjI4cnB4O31cclxuLnNlcl9ib3ggLmljb3twb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMTVycHg7bGVmdDogMjBycHg7IHdpZHRoOiAyNnJweDsgaGVpZ2h0OiAyNnJweDt9XHJcbi5zZXJfYm94X2JveCBidXR0b257cG9zaXRpb246IGFic29sdXRlOyByaWdodDogMjBycHg7IHRvcDogMTBycHg7IGhlaWdodDogNTZycHg7IGxpbmUtaGVpZ2h0OiA1NnJweDsgd2lkdGg6IDExMHJweDsgcGFkZGluZzogMDsgZm9udC1zaXplOiAyOHJweDsgYmFja2dyb3VuZDogI2Y5MDt9XHJcbi5tYXBBZGRyX2xpc3R7YmFja2dyb3VuZDogI2ZmZjt9XHJcbi5tYXBBZGRyX2xpc3Q6Zmlyc3QtY2hpbGQgLnd6X2JveCAuYnR7Y29sb3I6ICMxMjk2ZmE7fVxyXG4ubWFwQWRkcl9saXN0IC5pY297IHdpZHRoOiAyOHJweDsgaGVpZ2h0OiAzMnJweDsgbWFyZ2luOjAgMzBycHg7IG1hcmdpbi10b3A6IDUwcnB4O31cclxuLm1hcEFkZHJfbGlzdCAud3pfYm94e21hcmdpbi1sZWZ0OiA4OHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBwYWRkaW5nOjIwcnB4IDIwcnB4IDIwcnB4IDA7IGJvcmRlci1ib3R0b206IDJycHggc29saWQgI2U2ZTZlNjt9XHJcbi5tYXBBZGRyX2xpc3QgLnd6X2JveCAuYnR7Zm9udC1zaXplOiAyOHJweDsgbWFyZ2luLWJvdHRvbTogMTBycHg7fVxyXG4ubWFwQWRkcl9saXN0X2JveHsgcGFkZGluZy10b3A6NDBycHg7fVxyXG4uY3VycmVudGFkZHtoZWlnaHQ6IDgwcnB4O2JhY2tncm91bmQ6ICNmZmY7ZGlzcGxheTogZmxleDtqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47bGluZS1oZWlnaHQ6IDgwcnB4O3BhZGRpbmctbGVmdDogMjRycHg7Zm9udC1zaXplOiAyOHJweDt3aWR0aDogMTAwJTtvdmVyZmxvdzogaGlkZGVuO2JveC1zaXppbmc6IGJvcmRlci1ib3g7fVxyXG4uY3VycmVudGFkZCB2aWV3e2NvbG9yOiAjMjBhZDIwO2ZsZXgtc2hyaW5rOiAwO31cclxuLmN1cnJlbnRhZGQgdGV4dHtmbGV4OjE7dGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7b3ZlcmZsb3c6IGhpZGRlbjt3aGl0ZS1zcGFjZTogbm93cmFwO31cclxuLnJlZnJlc2h7cGFkZGluZy1yaWdodDogMjRycHg7fVxyXG5cclxuLmFkZHJfbm97dGV4dC1hbGlnbjogY2VudGVyO3BhZGRpbmc6IDUwcHggMCAyMHB4OyBmb250LXNpemU6IDEzcHg7IGNvbG9yOiAjNjY2OyBsaW5lLWhlaWdodDogMjBweDt9XHJcbi5hZGRyX25vIGltYWdle3dpZHRoOiAxMzBweDsgaGVpZ2h0OiA4N3B4OyBtYXJnaW4tYm90dG9tOiAxMHB4O31cclxuXHJcbi5hZGRyX2xpc3R7YmFja2dyb3VuZDogI2ZmZjt9XHJcbi5hZGRyX2xpc3QgLmJ0e3BhZGRpbmc6IDIwcnB4OyBmb250LXNpemU6IDI4cnB4OyBsaW5lLWhlaWdodDogNDBycHg7fVxyXG4uYWRkcl9saXN0IC5hZGRye2ZvbnQtc2l6ZTogMjRycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgY29sb3I6ICM2NjY7IG1hcmdpbi1sZWZ0OiAxMTJycHg7fVxyXG4uYWRkcl9saXN0IC5ib3R0b217cGFkZGluZzowIDIwcnB4IDIwcnB4O31cclxuLmFkZHJfbGlzdCAuYm90dG9tIC50YWd7IHdpZHRoOiA5NnJweDsgaGVpZ2h0OiA0MHJweDsgbGluZS1oZWlnaHQ6IDQwcnB4OyBib3JkZXItcmFkaXVzOiA2cnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiAjZmZmO31cclxuLmFkZHJfbGlzdCAuYm90dG9tIC50YWcuYmcxe2JhY2tncm91bmQ6ICNmZjY2NjA7fVxyXG4uYWRkcl9saXN0IC5ib3R0b20gLnRhZy5iZzJ7YmFja2dyb3VuZDogIzE0QUFFNDt9XHJcbi5hZGRyX2xpc3QgLmJvdHRvbSAudGFnLmJnM3tiYWNrZ3JvdW5kOiAjMjBBRDIwO31cclxuLmFkZHJfbGlzdCAuYm90dG9tIC50YWcuYmc0e2JhY2tncm91bmQ6ICM2NjY2NjY7fVxyXG5cclxuLmNvbnRCb3h7aGVpZ2h0OmNhbGMoMTAwJSAtIDQ4MHJweCk7ICBvdmVyZmxvdzogYXV0bzstd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7fVxyXG4iLG51bGxdfQ== */
</style>