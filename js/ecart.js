/* ECart 通用型JS购物车
 * Author:wuquanyao
 * Date:2016-03-15
 * 说明：ECart购物车依赖jscookie.js库
 */

/* 构造函数
 * key,购物车的cookie的键名
 * shop,商铺id及shop_id
 */
var ECart = function(shop_id, discount) {
	this.shop_id = shop_id; // this.title_list = wx.getStorageSync("title_list") || {};
	// if (!this.title_list[shop_id] && title) {
	//     this.title_list[shop_id] = title;
	// }
	// wx.setStorageSync('title_list', this.title_list);
	//折扣活动

	this.discount_list = uni.getStorageSync("discount_list") || {};

	if (discount) {
		this.discount_list[shop_id] = discount;
	}
	if (this.discount_list) {
		uni.setStorageSync('discount_list', this.discount_list);
	}
	this.init();
}; //初始化购物车


ECart.prototype.init = function() {
	try {
		this.cart_list = uni.getStorageSync("ECart") || {};
		this.discount_list = uni.getStorageSync("discount_list") || {};
		this.quotaRemind = uni.getStorageSync("quotaRemind") || {};
	} catch (e) { //todo...  
	}

	this.shop_cart = this.cart_list[this.shop_id] || {};
	this.discount = this.discount_list[this.shop_id] || {};
	this.is_remind = this.quotaRemind[this.shop_id] || false;
	this.save();
};

ECart.prototype.get_sku_id = function(sku_id, attrs) {
	var str = "";

	for (var i in attrs) {
		str += ":" + attrs[i]['key'] + ':' + attrs[i]['val'];
	}

	return sku_id + str;
}; //保存购物车信息


ECart.prototype.save = function(construct) {
	this.cart_list[this.shop_id] = this.shop_cart;

	construct = construct || function() {}; // this.construct();


	construct();
	uni.setStorageSync("ECart", this.cart_list);
	var cookie_cart = {};

	for (var sid in this.cart_list) {
		var sp = [];

		if (typeof this.cart_list[sid] == 'object') {
			for (var pid in this.cart_list[sid]) {
				var signstr = "";

				for (var i in this.cart_list[sid][pid]['str_obj']) {
					signstr += "-" + this.cart_list[sid][pid]['str_obj'][i]['key'] + "_" + this.cart_list[sid][pid][
						'str_obj'
					][i]['val'];
				}

				sp.push(this.cart_list[sid][pid]['sku_id'] + ":" + this.cart_list[sid][pid]['num'] + "&" +
					encodeURI(signstr));
			}
		}

		cookie_cart[sid] = sp.join(",");
	}

	uni.setStorageSync("ECart_kw", cookie_cart);
};
/* 增加
 * product,产品id及product_id
 * spec,规格id及spec_id,选填
 * info,要存放的数据,对象格式{'title':'','price':'',...}
 * 注意:请将商品数量自行更新
 */


ECart.prototype.add = function(sku_id, num, info, attrs) {
	var new_attrs = attrs || {};
	var o_sku_id = sku_id;
	sku_id = this.get_sku_id(sku_id, new_attrs);

	if (this.shop_cart[sku_id]) {
		this.shop_cart[sku_id]['sale_type'] = info['sale_type'];
		this.shop_cart[sku_id]['sale_sku'] = info['sale_sku'];
		this.shop_cart[sku_id]['num'] = parseInt(this.shop_cart[sku_id]['num'], 10) + parseInt(num, 10);
	} else {
		this.shop_cart[sku_id] = info;
		this.shop_cart[sku_id]['sku_id'] = o_sku_id;
		this.shop_cart[sku_id]['num'] = parseInt(num, 10);
	}

	if (this.shop_cart[sku_id]['num'] > 99) {
		this.shop_cart[sku_id]['num'] = 99;
	} else if (parseInt(this.shop_cart[sku_id]['sale_type'], 10) > 0) {
		var product_num = 0;

		for (var i in this.shop_cart) {
			if (this.shop_cart[i]['sku_id'] == o_sku_id) {
				product_num += parseInt(this.shop_cart[i]['num'], 10);
			}
		}
		if (product_num > this.shop_cart[sku_id]['sale_sku'] && this.shop_cart[sku_id]['sale_type'] == 1) {
			if (type == "2") {
				// Widget.MsgBox.error('商品库存不足');
				uni.showToast({
					title: '商品库存不足',
					icon: 'none'
				});
				return
			} else {
				uni.setStorageSync("again_error", '1');
			}

			if (o_sku_id == sku_id) {
				this.shop_cart[sku_id]['num'] = this.shop_cart[sku_id]['sale_sku'];
			} else {
				if (this.shop_cart[sku_id]['num'] > num) {
					this.shop_cart[sku_id]['num'] = this.shop_cart[sku_id]['num'] - num;
				} else {
					this.shop_cart[sku_id]['num'] = 0;
				}
			}
		}
	}

	var product_list = {};

	for (var k in this.shop_cart) {
		this.shop_cart[k]['num'] = parseInt(this.shop_cart[k]['num'], 10);

		if (this.shop_cart[k]['num'] > 0) {
			product_list[k] = this.shop_cart[k];
		}
	}

	this.shop_cart = product_list;
	this.save(this.construct());
};

ECart.prototype.remove = function(sku_id, attrs) {
	var new_attrs = attrs || {};
	sku_id = this.get_sku_id(sku_id, new_attrs);
	var product_list = {};

	for (var k in this.shop_cart) {
		this.shop_cart[k]['num'] = parseInt(this.shop_cart[k]['num'], 10);

		if (this.shop_cart[k]['num'] > 0 && k != sku_id) {
			product_list[k] = this.shop_cart[k];
		}
	}

	this.shop_cart = product_list;
	this.save();
};

ECart.prototype.clear = function() {
	this.shop_cart = {};
	this.save();
};
/* 商品
 * sku_id
 */


ECart.prototype.product = function(sku_id, attrs) {
	var new_attrs = attrs || {};
	sku_id = this.get_sku_id(sku_id, new_attrs);
	return this.shop_cart[sku_id] || {};
};
/* 商品数量
 * sku_id
 */


ECart.prototype.product_num = function(sku_id, attrs) {
	var new_attrs = attrs || {};
	sku_id = this.get_sku_id(sku_id, new_attrs);

	if (typeof this.shop_cart[sku_id] == 'undefined') {
		return 0;
	} else {
		return this.shop_cart[sku_id]['num'] || 0;
	}
};
/* 商品加入购物车数量by一级分类
 * pcate_id
 */


ECart.prototype.pcate_num = function(pcate_id) {
	var count = 0;

	for (var i in this.shop_cart) {
		if (this.shop_cart[i]['pcate_id'] != undefined) {
			var ext = this.shop_cart[i]['pcate_id'].split(',');

			for (var ii in ext) {
				if (ext[ii] == pcate_id) {
					count += parseInt(this.shop_cart[i]['num'] || 0, 10);
				}
			}
		}
	}

	return count;
};

ECart.prototype.sku_count = function(product_id) {
	var count = 0;

	for (var i in this.shop_cart) {
		if (this.shop_cart[i]['product_id'] == product_id) {
			count += parseInt(this.shop_cart[i]['num'] || 0, 10);
		}
	}

	return count;
}; //*********************************


ECart.prototype.spec_count = function(sku_id) {
	var count = 0;

	for (var i in this.shop_cart) {
		if (this.shop_cart[i]['sku_id'] == sku_id) {
			count += parseInt(this.shop_cart[i]['num'] || 0, 10);
		}
	}

	return count;
}; //*********************************

/** 
 * 购物车所有商品
 * shop_id，可选
 */


ECart.prototype.product_list = function() {
	return this.shop_cart;
};

ECart.prototype.total_count = function() {
	var count = 0;

	for (var i in this.shop_cart) {
		count += parseInt(this.shop_cart[i]['num'] || 0, 10);
	}

	return count;
};

ECart.prototype.total_price = function() {
	var price = 0;
	var package_price = 0;

	for (var i in this.shop_cart) {
		var num = this.shop_cart[i]['num'] || 0;
		price += parseFloat(this.shop_cart[i]['prices']);
		package_price += parseFloat(this.shop_cart[i]['packages']);
	}

	var total_price = price + package_price;
	var length1 = total_price.toString().length;
	var length2 = total_price.toFixed(2).toString().length;

	if (length2 > length1) {
		return total_price;
	} else {
		return total_price.toFixed(2);
	}
}; //打包费；


ECart.prototype.package_price = function() {
	var package_price = 0;

	for (var i in this.shop_cart) {
		var num = parseInt(this.shop_cart[i]['num'] || 0, 10);
		package_price += parseFloat(this.shop_cart[i]['packages'], 10);
	}

	return package_price.toFixed(2);
};

ECart.prototype.total_oldprice = function() {
	var oldprice = 0;
	var package_price = 0;

	for (var i in this.shop_cart) {
		var num = this.shop_cart[i]['num'] || 0;
		oldprice += parseFloat(this.shop_cart[i]['oldprices']);
		package_price += parseFloat(this.shop_cart[i]['packages']);
	}

	var total_oldprice = oldprice + package_price;
	var length1 = total_oldprice.toString().length;
	var length2 = total_oldprice.toFixed(2).toString().length;

	if (length2 > length1) {
		return total_oldprice;
	} else {
		return total_oldprice.toFixed(2);
	}
}; //计算折扣商品的优惠前后价格,并存入对应商品的优惠前后总金额


ECart.prototype.construct = function() {
	var lists = [];
	var quota = Number(this.discount['quota']) || 0;

	for (var i in this.shop_cart) {
		let str_objprices = 0
		for (let h in this.shop_cart[i].str_obj) {
			str_objprices += parseFloat(this.shop_cart[i].str_obj[h].price)
		}
		let price = str_objprices + parseFloat(this.shop_cart[i]['price'])
		let oldprice = str_objprices + parseFloat(this.shop_cart[i]['oldprice'])
		var num = this.shop_cart[i]['num'];
		var is_discount = this.shop_cart[i]['is_discount'];
		var prices = parseFloat(price * num, 10);
		var oldprices = parseFloat(oldprice * num, 10);
		var packages = parseFloat(this.shop_cart[i]['package'] * num, 10);
		this.shop_cart[i]['prices'] = prices.toFixed(2);
		this.shop_cart[i]['oldprices'] = oldprices.toFixed(2);
		this.shop_cart[i]['packages'] = packages.toFixed(2);

		if (is_discount == 1) {
			lists.push(this.shop_cart[i]);
		}
	}

	lists = lists.sort(sortPrice);
	var nums = 0;
	var objlists = {};

	for (var k = 0; k < lists.length; k++) {
		var num = lists[k]['num'];
		var prices = lists[k]['prices'];
		nums += num;

		if (quota > 0 && nums > quota) {
			if (parseInt(nums - quota) > num) {
				prices = parseFloat(lists[k]['oldprice'] * num, 10);
			} else {
				prices = parseFloat(parseFloat(lists[k]['price'] * (quota - nums + num), 10) + parseFloat(lists[k][
					'oldprice'
				] * (nums - quota), 10));
			}

			lists[k]['prices'] = prices.toFixed(2); // wx.showToast({ title: '折扣商品限购' + quota + '份，超出按原价计算' });

			if (!this.is_remind) {
				// Widget.MsgBox.error('折扣商品限购' + quota + '份，超出按原价计算');
				uni.showToast({
					title: '折扣商品限购' + quota + '份，超出按原价计算'
				});
				this.is_remind = true;
			}
		}

		objlists[lists[k]['sku_id']] = lists[k];
	}

	;

	for (var i in objlists) {
		for (var j in this.shop_cart) {
			if (i == this.shop_cart[j]['sku_id'] && objlists[i]['signstr'] == this.shop_cart[j]['signstr']) {
				this.shop_cart[j] = objlists[i];
			}
		}

		;
	}
};

function sortPrice(a, b) {
	return parseFloat(b['oldprice'] - b['price']) - parseFloat(a['oldprice'] - a['price']);
} //判断购物车里面是否含有折扣商品


ECart.prototype.isHasDiscount = function() {
	for (var i in this.shop_cart) {
		var is_discount = this.shop_cart[i]['is_discount'];

		if (is_discount == 1) {
			return true;
		}
	}

	return false;
};

module.exports.ECart = ECart;