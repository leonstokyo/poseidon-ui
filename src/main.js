import Vue from 'vue';
import router from './router';
import store from './store';
import VueSessionStorage from 'vue-sessionstorage';
import VueCookie from 'vue-cookie';
import '@/permission'; // permission control
import ElementUI from 'element-ui';
import { DatePicker, LocaleProvider } from 'ant-design-vue';
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.scss';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';

Vue.use(DatePicker);
Vue.use(LocaleProvider);

Vue.use(ElementUI);
Vue.use(VueSessionStorage);
Vue.use(VueCookie);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
