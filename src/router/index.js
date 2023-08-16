import Vue from 'vue';
import VueRouter from 'vue-router';

import product from '@/router/product';
import user from '@/router/customer';
import dashboard from '@/router/dashboard';
import system from '@/router/system';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/dashboard',

  },
  {
    path: '/404',
    component: () => import('@/views/404'),
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
  },
  // { path: '*', redirect: '/404' },
  ...product,
  ...user,
  ...dashboard,
  ...system,
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
  }
});

export default router;
