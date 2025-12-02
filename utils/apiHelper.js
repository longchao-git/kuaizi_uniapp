/**
 * API 辅助函数
 * 自动将 API 模块的方法绑定到 globalData
 */

/**
 * 绑定 API 模块到目标对象
 * @param {Object} apiModule - API 模块对象
 * @param {Object} appInstance - App 实例
 * @returns {Object} - 绑定后的方法对象
 */
export function bindApiModule(apiModule, appInstance) {
	const boundMethods = {};
	
	for (const [key, fn] of Object.entries(apiModule)) {
		if (typeof fn === 'function') {
			// 自动绑定 appInstance 作为最后一个参数
			boundMethods[key] = function(params, callback, nothasloading) {
				return fn(params, callback, nothasloading, appInstance);
			};
		}
	}
	
	return boundMethods;
}

/**
 * 批量绑定多个 API 模块
 * @param {Object} modules - API 模块对象集合 { moduleName: moduleObject }
 * @param {Object} appInstance - App 实例
 * @returns {Object} - 绑定后的所有方法
 */
export function bindApiModules(modules, appInstance) {
	const allMethods = {};
	
	for (const [moduleName, moduleObject] of Object.entries(modules)) {
		Object.assign(allMethods, bindApiModule(moduleObject, appInstance));
	}
	
	return allMethods;
}

/**
 * 创建工具函数包装器
 * @param {Function} fn - 原始函数
 * @param {Object} appInstance - App 实例
 * @returns {Function} - 包装后的函数
 */
export function createUtilWrapper(fn, appInstance) {
	return function(...args) {
		return fn(...args, appInstance);
	};
}

/**
 * 批量创建工具函数包装器
 * @param {Object} utils - 工具函数对象
 * @param {Object} appInstance - App 实例
 * @returns {Object} - 包装后的工具函数对象
 */
export function createUtilWrappers(utils, appInstance) {
	const wrappedUtils = {};
	
	for (const [key, fn] of Object.entries(utils)) {
		if (typeof fn === 'function') {
			wrappedUtils[key] = createUtilWrapper(fn, appInstance);
		}
	}
	
	return wrappedUtils;
}
