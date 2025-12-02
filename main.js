import Vue from 'vue';
import App from './App';

//骨架屏
import Skeleton from './components/primewind-skeleton/components/skeleton/index.vue'
Vue.component('skeleton', Skeleton);

// 全局Toast组件
import Toast from './components/Toast.vue';
Vue.component('Toast', Toast);

// 全局无数据组件
import NoData from './components/NoData.vue';
Vue.component('NoData', NoData);

// 全局授权弹窗组件
import AuthSettingDialog from './components/AuthSettingDialog.vue';
Vue.component('AuthSettingDialog', AuthSettingDialog);

// 配置公共方法
import common from './js/common.js'
Vue.prototype.$noMultipleClicks = common.noMultipleClicks;

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	...App
});
app.$mount();