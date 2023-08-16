// 用户权限
import Vue from 'vue';
import router from './router';
import getPageTitle from '@/utils/get-page-title';
// 路由过滤
router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle(to.meta.title);
  const isLogin = Vue.cookie.get('is_login');
  if (isLogin == 1) {
    next();
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    if (to.path !== '/login') {
      if (to.path !== '/') {
        Vue.cookie.set('path', to.fullPath);
      }
      next({ path: '/login' });
    } else {
      next();
    }
  }
});
