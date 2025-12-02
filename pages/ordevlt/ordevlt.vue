<template>
	<view>
		<!--提示框引入-开始：使用全局 Toast 组件-->
		<Toast :showToast="showToast" />
		<!--提示框引入-结束-->
		<view style="padding-bottom:100rpx;">
			<!--内容开始-->
			<view class="shangjiaEvlt mb10">
				<view class="anonymous" @tap="anonymous" v-if="isType!=1">
					<image class="ico"
						:src="'/static/image/' + (is_anonymous == 0 ? 'pj_selecter3x' : 'pj_selecter_checked3x') + '.png'">
					</image>匿名评价
				</view>
				<view class="img" v-if="isType!=1">
					<image mode="aspectFill" :src="pageimg + '' + order_detail.shop_logo"></image>
				</view>
				<view class="bt">{{order_detail.shop_title}}</view>
				<view class="shangjiaEvlt_tit"><text></text>{{isType==1?'打分':'商家打分'}}<text></text></view>
				<view class="evlt_star_bg">
					<image src="/static/image/evlt_star_bg.png" class="bg"></image>
					<view class="evlt_star_bar" :style="'width:' + shop_starPct + '%;'">
						<image src="/static/image/evlt_star_bar.png"></image>
					</view>
					<view class="evlt_star_click">
						<view v-for="(item, index) in shopevlt" :key="index" class="list" :data-idx="index"
							@tap="starclick1"></view>
					</view>
				</view>
				<view class="textarea_box mt10"><textarea maxlength="500" name="cont"
						:placeholder="isType==1?'请输入':'写下您对商家的建议吧~'" @input="contentsTap"></textarea></view>
			</view>

			<view class="goodsEvlt mb10" v-if="isType!=1">
				<view class="shangjiaEvlt_tit"><text></text>商品打分<text></text></view>
				<view v-for="(item, idx) in goodsList" :key="idx" class="list pub_list">
					<view class="pub_list_bd">{{item.product_name}}</view>
					<view class="zan_box">
						<view class="zan" @tap="zan" :data-id="idx" :data-zanurl="item.zanurl"
							:data-zannourl="item.zannourl">
							<image :src="item.zanurl"></image>
						</view>
						<view class="zan_no" @tap="zan_no" :data-id="idx" :data-zanurl="item.zanurl"
							:data-zannourl="item.zannourl">
							<image :src="item.zannourl"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="songEvlt mb10" v-if="isType!=1">
				<view class="shangjiaEvlt_tit"><text></text>配送打分<text></text></view>
				<view class="list pub_list">
					<view>送达时间</view>
					<view class="pub_list_bd time mr10">
						<picker @change="bindPickerChange" :value="index" :data-time="timeArray[index]"
							:range="timeArray">
							<view class="picker">{{timeArray[index]}}</view>
						</picker>
					</view>
					<image src="/static/image/icon-arrowR-gray2x.png" class="linkico"></image>
				</view>
				<view class="list pub_list">
					<view>配送服务</view>
					<view class=" pub_list_bd">
						<view class="evlt_star_bg">
							<image src="/static/image/evlt_star_bg.png" class="bg"></image>
							<view class="evlt_star_bar" :style="'width:' + peisong_starPct + '%;'">
								<image src="/static/image/evlt_star_bar.png"></image>
							</view>
							<view class="evlt_star_click">
								<view v-for="(item, index) in peisongevlt" :key="index" class="list" :data-idx="index"
									@tap="starclick2"></view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="goodsEvlt_img" v-if="isType!=1">
				<view class="images-wrapper">
					<view class="images-list">
						<block v-for="(image, index) in imageList" :key="index">
							<view class="image-item">
								<image :src="image" class="images-image" mode="aspectFill" :data-src="image"
									@tap="previewImage"></image>
								<view class="image-delete" @tap.stop="removeImage" :data-idx="index">×</view>
							</view>
						</block>
						<view class="images-image image-plus" v-if="imageList.length < 5" @tap="chooseImage">
							<view class="image-plus-horizontal"></view>
							<view class="image-plus-vertical"></view>
						</view>
					</view>
				</view>
				<view class="black9">(最多5张)</view>
			</view>

			<!--内容结束-->
		</view>
		<!--底部-->
		<view class="footer_order">
			<button type="primary" size="mini" @tap="fabu">发表评价</button>
			<view class="wz_box" v-if="isType!=1">评价后获得<text class="maincl">{{order_detail.jifen_total}}</text>积分</view>
		</view>
		<!--底部-->
	</view>
</template>

<script>
	var app = getApp();
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	];
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	];
	var goods_score = [];
var img_src = '';

	export default {
		data() {
			return {
				pageimg: app.globalData._CFG.IMG_URL || '',
				order_detail: '',
				goodsList: '',
				timeArray: [],
				shopevlt: [0, 1, 2, 3, 4],
				peisongevlt: [0, 1, 2, 3, 4],
				index: 0,
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 4,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				is_anonymous: 0,
				shop_starPct: '100',
				peisong_starPct: '100',
				imageList: [],
				order_id: "",
				pei_time: "",
				score: "",
				score_peisong: "",
				contents: "",
				imageList_len: "",
				uploadList: [],
				showToast: {
					isShow: false
				},
				isType: 0
			};
		},

		components: {},
		props: {},
		onLoad: function(e) {
			img_src = '';
			this.imageList = [],
				imageList_len: 0,
				uploadList: []
			;
			if (e.type == 1) {
				this.order_id = e.orderid
				this.isType = 1
				return
			}
			console.log("评价", e);
			var that = this;
			var obj = JSON.parse(e.obj);
			var order_id = obj.order_id; //商家商品

			var product = obj.products[0].product;
			console.log('商品打分', product);
			var zanurl = "/static/image/icon-good_gry.png";
			var zannourl = "/static/image/icon-bad_gry.png";
			var zannum = 1;

			for (var i in product) {
				// product[i].zanurl = zanurl;
				product[i].zanurl = "/static/image/icon-good.png";
				product[i].zannourl = zannourl;
				product[i].zannum = zannum;
			}

			; //商家配送时间

			var timeArray = [];

			for (var i in obj.time) {
				var str = obj.time[i].minute + "分钟送达（" + obj.time[i].date + "）";
				timeArray.push(str);
			}

			;
			that.order_detail = obj,
				goodsList: product,
				timeArray: timeArray,
				order_id: order_id
			;
			var reg = /\d+/g;
			var str = that.timeArray[0];
			var ms = str.match(reg);
			var shu = ms[0];
			that.pei_time = shu,
				score: '3',
				score_peisong: '3',
				shop_starPct: '100',
				peisong_starPct: '100'
			;
		},
		onShareAppMessage: function() {
			return {
				title: '微信小程序外卖',
				path: '/pages/index/index',
				success: function(res) { // 分享成功
				},
				fail: function(res) { // 分享失败
				}
			};
		},
		methods: {
			bindPickerChange: function(e) {
				var reg = /\d+/g;
				var num = e.detail.value;
				var str = this.timeArray[num];
				var ms = str.match(reg);
				var shu = ms[0];
				this.index = e.detail.value,
					pei_time: shu
				;
			},
			zan: function(e) {
				var goodsList = this.goodsList;
				var id = e.currentTarget.dataset.id;
				var zanurl = goodsList[id].zanurl;
				var zannourl = goodsList[id].zannourl;
				var zannum = goodsList[id].zannum;

				if (zanurl == "/static/image/icon-good_gry.png") {
					zanurl = "/static/image/icon-good.png";
					zannourl = "/static/image/icon-bad_gry.png";
					zannum = "1";
				} else {
					zanurl = "/static/image/icon-good_gry.png";
					zannum = "";
				}

				goodsList[id].zanurl = zanurl;
				goodsList[id].zannourl = zannourl;
				goodsList[id].zannum = zannum;
				this.goodsList = goodsList
				;
			},
			zan_no: function(e) {
				var goodsList = this.goodsList;
				var id = e.currentTarget.dataset.id;
				var zanurl = goodsList[id].zanurl;
				var zannourl = goodsList[id].zannourl;
				var zannum = goodsList[id].zannum;

				if (zannourl == "/static/image/icon-bad_gry.png") {
					zannourl = "/static/image/icon-bad.png";
					zanurl = "/static/image/icon-good_gry.png";
					zannum = "0";
				} else {
					zannourl = "/static/image/icon-bad_gry.png";
					zannum = "";
				}

				goodsList[id].zanurl = zanurl;
				goodsList[id].zannourl = zannourl;
				goodsList[id].zannum = zannum;
				this.goodsList = goodsList
				;
			},
			starclick1: function(e) {
				var idx = e.currentTarget.dataset.idx;
				this.shop_starPct = 20 * (idx + 1),
					score: idx + 1
				;
			},
			starclick2: function(e) {
				var idx = e.currentTarget.dataset.idx;
				this.peisong_starPct = 20 * (idx + 1),
					score_peisong: idx + 1
				;
			},
			contentsTap: function(e) {
				this.contents = e.detail.value
				;
			},
			chooseImage: function() {
				var that = this;
				var currentCount = this.imageList.length;
				var maxCount = 5;
				if (currentCount >= maxCount) {
					uni.showToast({
						title: '最多上传5张',
						icon: 'none'
					});
					return;
				}
				var oldLength = currentCount;
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: 1,
					success: function(res) {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) {
							return;
						}
						var selected = res.tempFilePaths.slice(0, 1);
						var newImageList = that.imageList.concat(selected).slice(0, maxCount);
						var uploadList = (that.uploadList || []).slice(0, newImageList.length);
						while (uploadList.length < newImageList.length) {
							uploadList.push('');
						}
						that.imageList = newImageList,
							imageList_len: newImageList.length,
							uploadList: uploadList
						;
						var targetIndex = oldLength;
						var files = [];
						app.globalData.upload('client/waimai/order/upload', selected, 0, 0, 0,
							selected.length, files,
							function(res) {
								var uploaded = Array.isArray(res) ? res : [res];
								if (!uploaded.length) {
									return;
								}
								var list = (that.uploadList || []).slice();
								uploaded.forEach(function(url, idx) {
									if (!url) {
										return;
									}
									var pos = targetIndex + idx;
									if (pos < maxCount) {
										list[pos] = url;
									}
								});
								that.uploadList = list
								;
								img_src = list.filter(function(item) {
									return item;
								}).join(',');
							});
					}
				});
			},
			removeImage: function(e) {
				var idx = e.currentTarget.dataset.idx;
				var imageList = this.imageList.slice();
				var uploadList = (this.uploadList || []).slice();
				if (idx < 0 || idx >= imageList.length) {
					return;
				}
				imageList.splice(idx, 1);
				if (idx < uploadList.length) {
					uploadList.splice(idx, 1);
				}
				this.imageList = imageList,
					imageList_len: imageList.length,
					uploadList: uploadList
				;
				img_src = uploadList.filter(function(item) {
					return item;
				}).join(',');
			},
			previewImage: function(e) {
				var current = e.target.dataset.src;
				uni.previewImage({
					current: current,
					urls: this.imageList
				});
			},

			//是否匿名
			anonymous() {
				var is_anonymous = this.is_anonymous;

				if (is_anonymous == 0) {
					this.is_anonymous = 1
					;
				} else {
					this.is_anonymous = 0
					;
				}

				;
			},

			fabu: function() {
				var that = this;
				var order_id = that.order_id;
				var contents = that.contents;
				var score = that.score;
				if (this.isType == 1) {
					app.globalData.qiangComment({
						'order_id': order_id,
						'score': score,
						'content': contents,
					}, function(res) {
						if (res.error == '0') {
							app.globalData.topage(1, "back");
						} else {
							uni.showToast({
								title: res.message
							});
						}
					});
					return
				}

				var pei_time = that.pei_time;
				var score_peisong = that.score_peisong;
				var is_anonymous = that.is_anonymous;
				var goodsList = that.goodsList;
				var goods_score_arr = [];

				for (var i in goodsList) {
					var zanid = goodsList[i].product_id;
					var zannum = goodsList[i].zannum;
					goods_score_arr.push(zanid + ":" + zannum);
				};
				var goods_score = goods_score_arr.join(); //数据筛选

				app.globalData.ordersCommentSubmt({
					'order_id': order_id,
					'score_peisong': score_peisong,
					'score': score,
					'pei_time': pei_time,
					'content': contents,
					goods_score,
					'file': img_src,
					'is_anonymous': is_anonymous
				}, function(res) {
					if (res.error == '0') {
						app.globalData.topage(1, "back");
					} else {
						uni.showToast({
							title: res.message
						});
					}
				});
			}
		}
	};
</script>
<style>
	.shangjiaEvlt {
		background: #fff;
		padding: 20rpx;
		position: relative;
	}

	.shangjiaEvlt .anonymous {
		position: absolute;
		right: 20rpx;
		top: 60rpx;
		font-size: 28rpx;
		color: #999;
	}

	.shangjiaEvlt .anonymous .ico {
		width: 28rpx;
		height: 28rpx;
		margin-right: 8rpx;
		vertical-align: middle;
	}

	.shangjiaEvlt .img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 100%;
		overflow: hidden;
		margin: 20rpx auto;
		background: #eee;
	}

	.shangjiaEvlt .img image {
		width: 120rpx;
		height: 120rpx;
	}

	.shangjiaEvlt .bt {
		text-align: center;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.shangjiaEvlt .evlt_star_bg {
		display: block;
		margin: 0 auto;
	}

	.shangjiaEvlt .textarea_box {
		background: #f5f5f5;
		padding: 20rpx 20rpx;
		height: 200rpx;
		overflow: hidden;
		position: relative;
	}

	.shangjiaEvlt .textarea_box textarea {
		width: 100%;
		height: 200rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		position: relative;
	}

	.shangjiaEvlt_tit {
		text-align: center;
		margin: 20rpx 0;
		color: #999;
	}

	.shangjiaEvlt_tit text {
		width: 20%;
		height: 2rpx;
		background: #eee;
		display: inline-block;
		vertical-align: middle;
		margin: 0 16rpx;
	}

	.goodsEvlt {
		background: #fff;
		padding: 20rpx;
	}

	.goodsEvlt .list {
		color: #999;
		line-height: 56rpx;
	}

	.goodsEvlt .list .zan_box {
		overflow: hidden;
	}

	.goodsEvlt .list .zan_box view {
		float: left;
		margin-left: 20rpx;
	}

	.goodsEvlt .list .zan_box view image {
		width: 80rpx;
		height: 56rpx;
	}

	.goodsEvlt .list .zan_box .zan .img2 {
		display: none;
	}

	.goodsEvlt .list .zan_box .zan.on .img2 {
		display: block;
	}

	.goodsEvlt .list .zan_box .zan.on .img1 {
		display: none;
	}

	.goodsEvlt .list .zan_box .zan_no .img2 {
		display: none;
	}

	.goodsEvlt .list .zan_box .zan_no.on .img2 {
		display: block;
	}

	.goodsEvlt .list .zan_box .zan_no.on .img1 {
		display: none;
	}

	.songEvlt {
		background: #fff;
		padding: 20rpx 0;
	}

	.songEvlt>.list {
		padding: 0 20rpx;
		line-height: 60rpx;
		font-size: 28rpx;
	}

	.songEvlt .list .linkico {
		width: 14rpx;
		height: 24rpx;
	}

	.songEvlt .list .pub_list_bd {
		text-align: right;
	}

	.songEvlt .list .time {
		font-size: 24rpx;
		color: #14AAE4;
	}

	.goodsEvlt_img {
		padding: 20rpx 10rpx;
	}

	.images-list {
		display: flex;
		flex-wrap: wrap;
	}

	.image-item {
		position: relative;
		width: 150rpx;
		height: 150rpx;
		margin: 0 10rpx 10rpx;
	}

	.images-image {
		width: 150rpx;
		height: 150rpx;
		margin: 0;
	}

	.image-plus {
		border: 1px solid #999;
		position: relative;
		margin: 0 10rpx 10rpx;
	}

	.image-plus-horizontal {
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: #d9d9d9;
		width: 4rpx;
		height: 80rpx;
		transform: translate(-50%, -50%);
	}

	.image-plus-vertical {
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: #d9d9d9;
		width: 80rpx;
		height: 4rpx;
		transform: translate(-50%, -50%);

	}

	.image-delete {
		position: absolute;
		top: -12rpx;
		right: -12rpx;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		font-size: 28rpx;
		line-height: 40rpx;
		text-align: center;
	}



	.footer_order {
		background: #fff;
		height: 100rpx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.footer_order button {
		width: 228rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 0;
		float: right;
		font-size: 32rpx;
	}

	.footer_order .wz_box {
		margin-right: 228rpx;
		font-size: 28rpx;
		line-height: 100rpx;
		padding-left: 24rpx;
	}

	.page_cont_box {
		height: calc(100% - 100rpx);
		width: 100%;
		overflow: hidden;
		background-color: #eef2f5;
	}

	
</style>