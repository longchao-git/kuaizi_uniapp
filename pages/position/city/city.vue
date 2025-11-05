<template>
	<view>
		<skeleton :loading="loading" :showAvatar='false' :row="skeleton1.row" :showTitle="skeleton1.showTitle">
			<view>
				<!--提示框引入-开始-->
				<!--<import src="../../components/showToast.wxml"></import>-->
				<block data-type="template" data-is="showToast" data-attr="showToast: showToast">
					<block v-if="showToast.isShow? showToast.isShow: false">
						<!-- <view class="toast-bg" wx:if="{{showToast.mask==false? false : true}}"></view>   -->
						<view class="toast-center">
							<view class="toast">
								<image class="toast-icon" :src="showToast.icon" mode="scaleToFill"
									v-if="showToast.icon"></image>
								<text class="toast-text">{{showToast.title}}</text>
							</view>
						</view>
					</block>
				</block>
				<!--提示框引入-结束-->
				<scroll-view scroll-y style="height: 100%;" :scroll-into-view="toView" scroll-with-animation="true"
					enable-back-to-top="true">
					<view class="city_list">
						<view class="city_index">当前定位城市</view>
						<view class="city_name" @tap="tapCity" :data-obj="currentCity">{{currentCity}}</view>
					</view>
					<view v-for="(item, index) in citys" :key="index" class="city_list">
						<block>
							<view class="city_index" :id="'index_' + index">{{item[0].py}}</view>
							<view v-for="(item, index2) in item" :key="index2" class="city_name" @tap="tapCity"
								:data-obj="item.city_name">{{item.city_name}}</view>
						</block>
					</view>
				</scroll-view>
				<!--右侧浮动-开始-->
				<view class="city_index_right">
					<view v-for="(item, index) in citys" :key="index" class="index" @tap="toIndex" :id="index">
						<block v-if="item.index == '当前定位'">#</block>
						<block v-else-if="item.index == '热门城市'">热</block>
						<block v-else>{{item[0].py}}</block>
					</view>
				</view>
				<!--右侧浮动-结束-->
			</view>
		</skeleton>
	</view>
</template>

<script>
	const app = getApp();

	export default {
		data() {
			return {
				//骨架屏
				loading: true,
				skeleton1: {
					row: 10,
					showTitle: true,
				},

				currentCity: '',
				citys: [],
				toView: ''
			};
		},

		components: {},
		props: {},
		created() {
			//骨架屏
			this.reloadData()
		},
		onShow: function() {
			var that = this; //定位接口

			app.globalData.addrdecode({
				"lng": app.globalData._CFG.currentlng,
				"lat": app.globalData._CFG.currentlat
			}, function(ret) {
				console.log("定位", ret);

				if (ret.error == 0) {
					that.setData({
						currentCity: ret.data.addr.city
					});
				}
			});
			app.globalData.citys({}, function(res) {
				if (res.error == "0") {
					var citys_arr = res.data.items,
						obj_arr = {},
						citys = [];

					if (citys_arr.length > 0) {
						for (var i in citys_arr) {
							obj_arr[citys_arr[i].py] = [];
						}

						;

						for (var i in citys_arr) {
							for (var j in obj_arr) {
								if (j == citys_arr[i].py) {
									obj_arr[j].push(citys_arr[i]);
								}

								;
							}

							;
						}

						;
					}

					;

					for (var j in obj_arr) {
						citys.push(obj_arr[j]);
					}

					;

					for (var i = 0; i < citys.length; i++) {
						for (var j = i + 1; j < citys.length; j++) {
							if (citys[i][0].py > citys[j][0].py) {
								var tmp = citys[i];
								citys[i] = citys[j];
								citys[j] = tmp;
							}
						}
					} // console.log("citys", citys);


					that.setData({
						citys: citys
					});
				}

				;
			});
		},
		methods: {
			//骨架屏
			reloadData() {
				this.loading = true
				setTimeout(() => {
					this.loading = false
				}, 3000)
			},
			//位置跳转
			toIndex(e) {
				this.setData({
					toView: 'index_' + e.currentTarget.id
				});
			},

			//选择城市
			tapCity(e) {
				uni.setStorage({
					key: "fzCity",
					data: e.currentTarget.dataset.obj,
					success: function() {
						app.globalData.topage(1, 'back');
					}
				});
			}

		}
	};
</script>
<style>
	.city_list .city_index {
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #999;
		background: #f7f7f7;
		height: 80rpx;
		line-height: 80rpx;
	}

	.city_list .city_name {
		padding: 0 24rpx;
		font-size: 32rpx;
		color: #333;
		background: #fff;
		height: 96rpx;
		line-height: 96rpx;
		border-bottom: 2rpx solid #eee;
	}

	.city_index_right {
		position: fixed;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		max-height: 88%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		text-align: center;
	}

	.city_index_right .index {
		font-size: 24rpx;
		line-height: 40rpx;
		padding: 4rpx 24rpx;
	}

	/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiUzQ2lucHV0JTIwY3NzJTIwMUF5aXdUJTNFIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVCQUF1QixnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixDQUFDO0FBQy9ILHNCQUFzQixnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLDhCQUE4QixDQUFDO0FBQzNKLGtCQUFrQixlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxlQUFlLEdBQUcsY0FBYyxDQUFDLGlDQUFpQyxFQUFFLGtCQUFrQixDQUFDO0FBQzVLLHlCQUF5QixnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY2l0eV9saXN0IC5jaXR5X2luZGV4e3BhZGRpbmc6IDAgMjRycHg7IGZvbnQtc2l6ZTogMjhycHg7IGNvbG9yOiAjOTk5OyBiYWNrZ3JvdW5kOiAjZjdmN2Y3OyBoZWlnaHQ6IDgwcnB4OyBsaW5lLWhlaWdodDogODBycHg7fVxyXG4uY2l0eV9saXN0IC5jaXR5X25hbWV7cGFkZGluZzogMCAyNHJweDsgZm9udC1zaXplOiAzMnJweDsgY29sb3I6ICMzMzM7IGJhY2tncm91bmQ6ICNmZmY7IGhlaWdodDogOTZycHg7IGxpbmUtaGVpZ2h0OiA5NnJweDsgYm9yZGVyLWJvdHRvbTogMnJweCBzb2xpZCAjZWVlO31cclxuLmNpdHlfaW5kZXhfcmlnaHR7cG9zaXRpb246IGZpeGVkOyByaWdodDogMDsgdG9wOiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTUwJSk7IG1heC1oZWlnaHQ6IDg4JTsgIG92ZXJmbG93OiBhdXRvOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDsgdGV4dC1hbGlnbjogY2VudGVyO31cclxuLmNpdHlfaW5kZXhfcmlnaHQgLmluZGV4e2ZvbnQtc2l6ZTogMjRycHg7IGxpbmUtaGVpZ2h0OiA0MHJweDsgcGFkZGluZzogNHJweCAyNHJweDt9Il19 */
</style>