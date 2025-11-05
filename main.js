import Vue from 'vue';
import App from './App';

//骨架屏
import Skeleton from './components/primewind-skeleton/components/skeleton/index.vue'
Vue.component('skeleton', Skeleton);

// 配置公共方法
import common from './js/common.js'
Vue.prototype.$noMultipleClicks = common.noMultipleClicks;

// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';
Polyfill.init();

// 全局mixins，用于实现setData等功能';
import Mixin from './polyfill/mixins';
Vue.mixin(Mixin);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	...App
});
app.$mount();