// 全局配置
export const APP_CONFIG = {
	URL: "https://www.cuai-zi.com",

	BASE_API: "https://www.cuai-zi.com/api.php",

	// 签名密钥
	HEADER_SIGN_KEY: "dragoon4adhere_balinese4dwindle",
	SIGN_KEY: "AzRQBazpvKiy!_F@m-z83",

	// 默认经纬度（马德里）
	DEFAULT_LNG: '-3.709870',
	DEFAULT_LAT: '40.422980',

	// 是否开启分站功能
	IS_FZ: false
};

// 全局状态
export const APP_STATE = {
	auth_code: "",
	wx_openid: "",
	wx_unionid: "",
	wx_info: null,
	ali_openid: "",
	TOKEN: "",
	PHPSESSID: "",
	UID: 0,
	userInfo: null,
	userInfo2: null,
	shoptail: '',
	title: '',
	cateid: '',
	payorderid: '',
	isindexshow: true,
	currentlat: '',
	currentlng: '',
	lng: '',
	lat: '',
	double: true,
	useraddr: [],
	version: ''
};