<script>
/**
 * App.vue - 手动绑定版本
 * 虽然代码较多，但稳定可靠
 */

// 导入配置
import { APP_CONFIG, APP_STATE } from '@/config/appConfig.js';

// 导入工具函数
import { getUserLocationState, getLocation } from '@/utils/locationUtils.js';
import { onLogin, initLogin, checkLogin, afterCheckLogin } from '@/utils/authUtils.js';
import { removeStorage, setStorage, getStorage } from '@/utils/storageUtils.js';
import { gopage, topage, share, shareTimeline } from '@/utils/navigationUtils.js';
import { setRandom, msgbox, urlencode, getLocalTime, upload, saveCookies } from '@/utils/commonUtils.js';

// 导入API
import { http } from '@/api/request.js';
import * as AuthApi from '@/api/authApi.js';
import * as ShopApi from '@/api/shopApi.js';
import * as OrderApi from '@/api/orderApi.js';
import * as UserApi from '@/api/userApi.js';
import * as QiangApi from '@/api/qiangApi.js';
import * as CommonApi from '@/api/commonApi.js';

require("./utils/showToast.js");

var __APP = null;

export default {
	globalData: {
		URL: APP_CONFIG.URL,
		city_id: '',
		cookies: {},
		_CFG: { ...APP_STATE, ...APP_CONFIG },
		allcitylist: [],
		
		// ==================== 定位相关 ====================
		getUserLocationState(callback) {
			getUserLocationState(callback, __APP);
		},
		
		getLocation(callback) {
			getLocation(callback, __APP);
		},
		
		// ==================== 认证相关 ====================
		onLogin(callback) {
			onLogin(callback, __APP);
		},
		
		InitLogin(callback) {
			initLogin(callback, __APP);
		},
		
		CheckLogin() {
			return checkLogin(__APP);
		},
		
		afterCheckLogin(callback) {
			afterCheckLogin(callback, __APP);
		},
		
		// ==================== 工具函数 ====================
		setrandom(n) {
			return setRandom(n);
		},
		
		msgbox(msg, icon) {
			msgbox(msg, icon);
		},
		
		urlencode(str) {
			return urlencode(str);
		},
		
		getLocalTime(nS) {
			return getLocalTime(nS);
		},
		
		upload(api, filePaths, successUp, failUp, i, length, files, callback) {
			return upload(api, filePaths, successUp, failUp, i, length, files, callback, __APP);
		},
		
		saveCookies(res) {
			saveCookies(res, __APP);
		},
		
		// ==================== 导航相关 ====================
		gopage(url, method) {
			gopage(url, method, __APP);
		},
		
		topage(url, method) {
			topage(url, method, __APP);
		},
		
		share(title, path) {
			return share(title, path);
		},
		
		shareimeline(title, path, img) {
			return shareTimeline(title, path, img);
		},
		
		// ==================== 存储相关 ====================
		remove(...arr) {
			removeStorage(...arr);
		},
		
		setstorage(key, data) {
			setStorage(key, data);
		},
		
		getstorage(key, successCall, failCall) {
			getStorage(key, successCall, failCall);
		},
		
		// ==================== HTTP请求 ====================
		http(api, params, callback, nothasloading) {
			return http(api, params, callback, nothasloading, __APP);
		},
		
		// ==================== 认证API ====================
		endata(params, callback, nothasloading) {
			return AuthApi.endata(params, callback, nothasloading, __APP);
		},
		
		sendSms(params, callback, nothasloading) {
			return AuthApi.sendSms(params, callback, nothasloading, __APP);
		},
		
		getVerifyCode(params, callback, nothasloading) {
			return AuthApi.getVerifyCode(params, callback, nothasloading, __APP);
		},
		
		getVerifyImage(params, callback, nothasloading) {
			return AuthApi.getVerifyImage(params, callback, nothasloading, __APP);
		},
		
		getClientPassport(params, callback, nothasloading) {
			return AuthApi.getClientPassport(params, callback, nothasloading, __APP);
		},
		
		getClientLogin(params, callback, nothasloading) {
			return AuthApi.getClientLogin(params, callback, nothasloading, __APP);
		},
		
		getClientSignup(params, callback, nothasloading) {
			return AuthApi.getClientSignup(params, callback, nothasloading, __APP);
		},
		
		wxbind(params, callback, nothasloading) {
			return AuthApi.wxbind(params, callback, nothasloading, __APP);
		},
		
		alipayBind(params, callback, nothasloading) {
			return AuthApi.alipayBind(params, callback, nothasloading, __APP);
		},
		
		alipayAuthToken(params, callback, nothasloading) {
			return AuthApi.alipayAuthToken(params, callback, nothasloading, __APP);
		},
		
		// ==================== 商家API ====================
		hotSearch(params, callback, nothasloading) {
			return ShopApi.hotSearch(params, callback, nothasloading, __APP);
		},
		
		shopSearchs(params, callback, nothasloading) {
			return ShopApi.shopSearchs(params, callback, nothasloading, __APP);
		},
		
		shopLists(params, callback, nothasloading) {
			return ShopApi.shopLists(params, callback, nothasloading, __APP);
		},
		
		shopListsCates(params, callback, nothasloading) {
			return ShopApi.shopListsCates(params, callback, nothasloading, __APP);
		},
		
		shopDetail(params, callback, nothasloading) {
			return ShopApi.shopDetail(params, callback, nothasloading, __APP);
		},
		
		shopDetailSearch(params, callback, nothasloading) {
			return ShopApi.shopDetailSearch(params, callback, nothasloading, __APP);
		},
		
		shopComments(params, callback, nothasloading) {
			return ShopApi.shopComments(params, callback, nothasloading, __APP);
		},
		
		shopInfo(params, callback, nothasloading) {
			return ShopApi.shopInfo(params, callback, nothasloading, __APP);
		},
		
		shopCoupons(params, callback, nothasloading) {
			return ShopApi.shopCoupons(params, callback, nothasloading, __APP);
		},
		
		getCoupons(params, callback, nothasloading) {
			return ShopApi.getCoupons(params, callback, nothasloading, __APP);
		},
		
		shareImg(params, callback, nothasloading) {
			return ShopApi.shareImg(params, callback, nothasloading, __APP);
		},
		
		enterShop(params, callback, nothasloading) {
			return ShopApi.enterShop(params, callback, nothasloading, __APP);
		},
		
		// ==================== 订单API ====================
		orderForm(params, callback, nothasloading) {
			return OrderApi.orderForm(params, callback, nothasloading, __APP);
		},
		
		orderFormInfo(params, callback, nothasloading) {
			return OrderApi.orderFormInfo(params, callback, nothasloading, __APP);
		},
		
		orderFormAddr(params, callback, nothasloading) {
			return OrderApi.orderFormAddr(params, callback, nothasloading, __APP);
		},
		
		orderFormAddrCreate(params, callback, nothasloading) {
			return OrderApi.orderFormAddrCreate(params, callback, nothasloading, __APP);
		},
		
		orderFormAddrDel(params, callback, nothasloading) {
			return OrderApi.orderFormAddrDel(params, callback, nothasloading, __APP);
		},
		
		orderInfo(params, callback, nothasloading) {
			return OrderApi.orderInfo(params, callback, nothasloading, __APP);
		},
		
		orderPay(params, callback, nothasloading) {
			return OrderApi.orderPay(params, callback, nothasloading, __APP);
		},
		
		orders(params, callback, nothasloading) {
			return OrderApi.orders(params, callback, nothasloading, __APP);
		},
		
		ordersDetail(params, callback, nothasloading) {
			return OrderApi.ordersDetail(params, callback, nothasloading, __APP);
		},
		
		ordersTui(params, callback, nothasloading) {
			return OrderApi.ordersTui(params, callback, nothasloading, __APP);
		},
		
		ordersCancel(params, callback, nothasloading) {
			return OrderApi.ordersCancel(params, callback, nothasloading, __APP);
		},
		
		ordersConfirm(params, callback, nothasloading) {
			return OrderApi.ordersConfirm(params, callback, nothasloading, __APP);
		},
		
		ordersCui(params, callback, nothasloading) {
			return OrderApi.ordersCui(params, callback, nothasloading, __APP);
		},
		
		ordersKefu(params, callback, nothasloading) {
			return OrderApi.ordersKefu(params, callback, nothasloading, __APP);
		},
		
		ordersStatus(params, callback, nothasloading) {
			return OrderApi.ordersStatus(params, callback, nothasloading, __APP);
		},
		
		ordersCommentSubmt(params, callback, nothasloading) {
			return OrderApi.ordersCommentSubmt(params, callback, nothasloading, __APP);
		},
		
		// ==================== 用户API ====================
		mineInfo(params, callback, nothasloading) {
			return UserApi.mineInfo(params, callback, nothasloading, __APP);
		},
		
		moneyLog(params, callback, nothasloading) {
			return UserApi.moneyLog(params, callback, nothasloading, __APP);
		},
		
		moneyCash(params, callback, nothasloading) {
			return UserApi.moneyCash(params, callback, nothasloading, __APP);
		},
		
		moneyRecharge(params, callback, nothasloading) {
			return UserApi.moneyRecharge(params, callback, nothasloading, __APP);
		},
		
		moneyPay(params, callback, nothasloading) {
			return UserApi.moneyPay(params, callback, nothasloading, __APP);
		},
		
		mineAddr(params, callback, nothasloading) {
			return UserApi.mineAddr(params, callback, nothasloading, __APP);
		},
		
		editCreate(params, callback, nothasloading) {
			return UserApi.editCreate(params, callback, nothasloading, __APP);
		},
		
		addrCreate(params, callback, nothasloading) {
			return UserApi.addrCreate(params, callback, nothasloading, __APP);
		},
		
		addrDel(params, callback, nothasloading) {
			return UserApi.addrDel(params, callback, nothasloading, __APP);
		},
		
		peicard(params, callback, nothasloading) {
			return UserApi.peicard(params, callback, nothasloading, __APP);
		},
		
		peicardLogs(params, callback, nothasloading) {
			return UserApi.peicardLogs(params, callback, nothasloading, __APP);
		},
		
		minePeicard(params, callback, nothasloading) {
			return UserApi.minePeicard(params, callback, nothasloading, __APP);
		},
		
		payPeicard(params, callback, nothasloading) {
			return UserApi.payPeicard(params, callback, nothasloading, __APP);
		},
		
		mineCollect(params, callback, nothasloading) {
			return UserApi.mineCollect(params, callback, nothasloading, __APP);
		},
		
		tapCollect(params, callback, nothasloading) {
			return UserApi.tapCollect(params, callback, nothasloading, __APP);
		},
		
		mineCoupons(params, callback, nothasloading) {
			return UserApi.mineCoupons(params, callback, nothasloading, __APP);
		},
		
		mineHongbao(params, callback, nothasloading) {
			return UserApi.mineHongbao(params, callback, nothasloading, __APP);
		},
		
		invite(params, callback, nothasloading) {
			return UserApi.invite(params, callback, nothasloading, __APP);
		},
		
		mineMessageCates(params, callback, nothasloading) {
			return UserApi.mineMessageCates(params, callback, nothasloading, __APP);
		},
		
		mineMessage(params, callback, nothasloading) {
			return UserApi.mineMessage(params, callback, nothasloading, __APP);
		},
		
		readMessage(params, callback, nothasloading) {
			return UserApi.readMessage(params, callback, nothasloading, __APP);
		},
		
		redeempromocode(params, callback, nothasloading) {
			return UserApi.redeempromocode(params, callback, nothasloading, __APP);
		},
		
		// ==================== 抢购API ====================
		qiangTheme(params, callback, nothasloading) {
			return QiangApi.qiangTheme(params, callback, nothasloading, __APP);
		},
		
		qiangIndex(params, callback, nothasloading) {
			return QiangApi.qiangIndex(params, callback, nothasloading, __APP);
		},
		
		orderCreate(params, callback, nothasloading) {
			return QiangApi.orderCreate(params, callback, nothasloading, __APP);
		},
		
		qiangComment(params, callback, nothasloading) {
			return QiangApi.qiangComment(params, callback, nothasloading, __APP);
		},
		
		qiangTicket(params, callback, nothasloading) {
			return QiangApi.qiangTicket(params, callback, nothasloading, __APP);
		},
		
		qiangOrder(params, callback, nothasloading) {
			return QiangApi.qiangOrder(params, callback, nothasloading, __APP);
		},
		
		perinfoOrder(params, callback, nothasloading) {
			return QiangApi.perinfoOrder(params, callback, nothasloading, __APP);
		},
		
		qiangSearch(params, callback, nothasloading) {
			return QiangApi.qiangSearch(params, callback, nothasloading, __APP);
		},
		
		productGet(params, callback, nothasloading) {
			return QiangApi.productGet(params, callback, nothasloading, __APP);
		},
		
		qiangClientOrder(params, callback, nothasloading) {
			return QiangApi.qiangClientOrder(params, callback, nothasloading, __APP);
		},
		
		orderTicket(params, callback, nothasloading) {
			return QiangApi.orderTicket(params, callback, nothasloading, __APP);
		},
		
		ticketDetail(params, callback, nothasloading) {
			return QiangApi.ticketDetail(params, callback, nothasloading, __APP);
		},
		
		qiangPayback(params, callback, nothasloading) {
			return QiangApi.qiangPayback(params, callback, nothasloading, __APP);
		},
		
		// ==================== 公共API ====================
		home(params, callback, nothasloading) {
			return CommonApi.home(params, callback, nothasloading, __APP);
		},
		
		homeInfo(params, callback, nothasloading) {
			return CommonApi.homeInfo(params, callback, nothasloading, __APP);
		},
		
		homeHongbao(params, callback, nothasloading) {
			return CommonApi.homeHongbao(params, callback, nothasloading, __APP);
		},
		
		getHomeHongbao(params, callback, nothasloading) {
			return CommonApi.getHomeHongbao(params, callback, nothasloading, __APP);
		},
		
		addrdecode(params, callback, nothasloading) {
			return CommonApi.addrdecode(params, callback, nothasloading, __APP);
		},
		
		getcitylist(params, callback, nothasloading) {
			return CommonApi.getcitylist(params, callback, nothasloading, __APP);
		},
		
		citys(params, callback, nothasloading) {
			return CommonApi.citys(params, callback, nothasloading, __APP);
		},
		
		huodong(params, callback, nothasloading) {
			return CommonApi.huodong(params, callback, nothasloading, __APP);
		},
		
		invitePage(params, callback, nothasloading) {
			return CommonApi.invitePage(params, callback, nothasloading, __APP);
		},
		
		invitePage2(params, callback, nothasloading) {
			return CommonApi.invitePage2(params, callback, nothasloading, __APP);
		},
		
		tapInvite(params, callback, nothasloading) {
			return CommonApi.tapInvite(params, callback, nothasloading, __APP);
		},
		
		getStaticQrcode(params, callback, nothasloading) {
			return CommonApi.getStaticQrcode(params, callback, nothasloading, __APP);
		},
		
		hbpackagePay(params, callback, nothasloading) {
			return CommonApi.hbpackagePay(params, callback, nothasloading, __APP);
		},
		
		enterStaff(params, callback, nothasloading) {
			return CommonApi.enterStaff(params, callback, nothasloading, __APP);
		}
	},
	
	onLaunch: function() {
		//#ifdef MP-ALIPAY 
		const appIdRes = my.getAppIdSync();
		//#endif 
		
		__APP = this.globalData;
		var logs = uni.getStorageSync('logs') || [];
		this.globalData.city_id = uni.getStorageSync('currentCityId');
		
		logs.unshift(Date.now());
		uni.setStorageSync('logs', logs);
		
		__APP.getUserLocationState();
	},
	
	onShow: function() {
		if (__APP && __APP.getstorage) {
			__APP.getstorage('token', res => __APP._CFG.TOKEN = res.data, () => __APP._CFG.TOKEN = '');
			__APP.getstorage('unionid', res => __APP._CFG.wx_unionid = res.data, () => __APP._CFG.wx_unionid = '');
			__APP.getstorage('userinfo', res => __APP._CFG.userInfo = res.data, () => __APP._CFG.userInfo = {});
			__APP.getstorage('userinfo2', res => __APP._CFG.userInfo2 = res.data, () => __APP._CFG.userInfo2 = {});
			__APP.getstorage('wx_openid', res => __APP._CFG.wx_openid = res.data, () => __APP._CFG.wx_openid = '');
			__APP.getstorage('ali_openid', res => __APP._CFG.ali_openid = res.data, () => __APP._CFG.ali_openid = '');
		}
	},
	
	methods: {}
};
</script>

<style lang="scss">
@import "@/styles/common.scss";
@import "@/styles/shopList.scss";
@import "@/styles/user.scss";
</style>
