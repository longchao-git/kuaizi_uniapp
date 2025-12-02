/**
 * 通用工具函数
 */

const charts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
	'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

/**
 * 生成随机字符串
 * @param {Number} n 字符串长度
 * @returns {String}
 */
export function setRandom(n) {
	var res = '';
	for (var i = 0; i < n; i++) {
		var id = Math.ceil(Math.random() * 35);
		res += charts[id];
	}
	return res;
}

/**
 * 提示框
 * @param {String} msg 提示信息
 * @param {String} icon 图标
 */
export function msgbox(msg, icon) {
	uni.showToast({
		title: msg,
		icon: 'success',
		image: icon,
		duration: 1000
	});
}

/**
 * 字符串转换（URL编码）
 * @param {String} str 字符串
 * @returns {String}
 */
export function urlencode(str) {
	str = (str + '').toString();
	return encodeURIComponent(str);
}

/**
 * 时间戳转换
 * @param {Number} nS 时间戳
 * @returns {String}
 */
export function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

/**
 * 上传图片
 * @param {String} api API地址
 * @param {Array} filePaths 文件路径数组
 * @param {Number} successUp 成功数量
 * @param {Number} failUp 失败数量
 * @param {Number} i 当前索引
 * @param {Number} length 总数
 * @param {Array} files 文件数组
 * @param {Function} callback 回调函数
 * @param {Object} appInstance App实例
 */
export function upload(api, filePaths, successUp, failUp, i, length, files, callback, appInstance) {
	filePaths = filePaths || {};
	callback = typeof callback == 'function' ? callback : function(res) {};
	
	var json = {
		"CLIENT_OS": "WXAPP",
		"CLIENT_API": "CUSTOM",
		"API": api,
		"TOKEN": appInstance._CFG.TOKEN || '',
		"LNG": appInstance._CFG.lng || '',
		"LAT": appInstance._CFG.lat || '',
		"WX_OPENID": appInstance._CFG.wx_openid,
		"data": {}
	};
	
	var API_BASE = appInstance._CFG.BASE_API;
	
	uni.uploadFile({
		url: API_BASE,
		filePath: filePaths[i],
		header: {
			'content-type': 'multipart/from-data'
		},
		name: 'file',
		formData: json,
		success: function(resp) {
			if (resp.data != 0) {
				successUp++;
				files[i] = resp.data;
			} else {
				failUp++;
			}
		},
		fail: function(res) {
			failUp++;
		},
		complete: function() {
			i++;
			
			if (i == length) {
				uni.showToast({
					title: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！',
					icon: 'success',
					duration: 2000
				});
				callback(files);
			} else {
				upload(api, filePaths, successUp, failUp, i, length, files, callback, appInstance);
			}
		}
	});
}

/**
 * 保存Cookies
 * @param {Object} res 响应对象
 * @param {Object} appInstance App实例
 */
export function saveCookies(res, appInstance) {
	let cookies = null;
	
	//#ifdef MP-ALIPAY || H5
	cookies = res.header['set-cookie'];
	if (typeof cookies == 'string') {
		cookies = [cookies];
	}
	//#endif
	
	//#ifdef MP-WEIXIN
	cookies = res.cookies;
	//#endif
	
	if (cookies == null) {
		return;
	}
	
	cookies.forEach(cookie => {
		let cookieContents = cookie.split('; ');
		var cookieObj = {};
		
		cookieContents.forEach((content, index) => {
			if (index == 0) {
				cookieObj['name'] = content.split('=')[0];
				cookieObj['value'] = content.split('=')[1];
				return;
			}
			cookieObj[content.split('=')[0]] = content.split('=')[1];
		});
		
		if (appInstance.URL.includes(cookieObj['domain'])) {
			if (cookieObj.value == 'deleted') {
				delete appInstance.cookies[cookieObj.name];
			} else {
				appInstance.cookies[cookieObj.name] = cookieObj;
			}
		}
	});
}
