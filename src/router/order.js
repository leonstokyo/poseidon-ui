const order = [
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/layout/index'),
    redirect: '/order/index',
    children: [
      {
        path: 'index',
        name: 'OrderIndex',
        meta: {
          title: '订单列表',
        },
        resources: 'orders-index',
        component: () => import('@/views/order/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'OrderEdit',
        meta: {
          title: '订单-编辑',
        },
        resources: 'orders-show',
        component: () => import('@/views/order/edit.vue'),
      },
      {
        path: 'refund/:id',
        name: 'OrderRefund',
        meta: {
          title: '订单-退款',
        },
        resources: 'orders-refund',
        component: () => import('@/views/order/refund.vue'),
      },
    ],
  },
];

export default order;
