const dashboard = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layout/index'),
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'DashboardIndex',
        meta: {
          title: '数据概览',
        },
        resources: '',
        component: () => import('@/views/dashboard/index.vue'),
      },
    ],
  },
];

export default dashboard;
