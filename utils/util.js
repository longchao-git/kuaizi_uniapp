function formatTime(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}

function callapi(api, params, callback) {
	var app = getApp();
	params = params || {}; // TOKEN, LNG,LAT,

	var json = {
		"TOKEN": app.globalData.web_config.TOKEN || '',
		"LNG": app.globalData.web_config.lng || '',
		"LAT": app.globalData.web_config.lat || '',

		/* "CITY_ID" : this.userInfo.city_id||'',*/
		"data": JSON.stringify(params) //

	};
	var API_BASE = app.globalData.web_config.API_URL + api;
	uni.request({
		url: API_BASE,
		data: json.data,
		method: "POST",
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		success: function(res) {
			/*var ret = JSON.parse(res.data);*/
			if (res.data.error == '0') {
				typeof callback == "function" && callback(res.data.data); //todo...
			} else { //this.callback(ret.data);
			}
		},
		fail: function(error) {}
	});
}

module.exports = {
	formatTime: formatTime,
	http: callapi
};