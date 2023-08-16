const customer = [
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('@/layout/index'),
    redirect: '/customer/index',
    children: [
      {
        path: 'index',
        name: 'CustomerIndex',
        meta: {
          title: '用户列表',
        },
        resources: 'customers-index',
        component: () => import('@/views/customer/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'CustomerEdit',
        meta: {
          title: '编辑-用户',
        },
        resources: 'customers-update',
        component: () => import('@/views/customer/edit.vue'),
      },
      // {
      //   path: 'prescription/index/:id',
      //   name: 'PrescriptionIndex',
      //   meta: {
      //     title: '用户处方',
      //   },
      //   component: () => import('@/views/customer/prescription/index.vue'),
      // },
      // {
      //   path: 'prescription/edit/:id',
      //   name: 'PrescriptionEdit',
      //   meta: {
      //     title: '编辑-处方',
      //   },
      //   resources: 'prescription-create',
      //   component: () => import('@/views/customer/prescription/edit.vue'),
      // },
      {
        path: 'prescription/add/:customerId',
        name: 'PrescriptionAdd',
        meta: {
          title: '添加-处方',
        },
        resources: 'prescriptions-create',
        component: () => import('@/views/customer/prescription/edit.vue'),
      },
      // {
      //   path: 'address/index/:id',
      //   name: 'AddressIndex',
      //   meta: {
      //     title: '用户地址',
      //   },
      //   component: () => import('@/views/customer/address/index.vue'),
      // },
      // {
      //   path: 'address/edit/:id',
      //   name: 'AddressEdit',
      //   meta: {
      //     title: '编辑-地址',
      //   },
      //   component: () => import('@/views/customer/address/edit.vue'),
      // },
      {
        path: 'coupon/delivery/:id',
        name: 'CouponDelivery',
        meta: {
          title: '分发-优惠券',
        },
        resources: 'customers_coupons-create',
        component: () => import('@/views/customer/coupon/delivery.vue'),
      },
      {
        path: 'all-address/index',
        name: 'CustomerAllAddressIndex',
        meta: {
          title: '地址列表',
        },
        resources: 'addresses-index',
        component: () => import('@/views/customer/list/address/index.vue'),
      },
      {
        path: 'all-prescription/index',
        name: 'CustomerAllPrescriptionIndex',
        meta: {
          title: '处方列表',
        },
        resources: 'prescriptions-index',
        component: () => import('@/views/customer/list/prescription/index.vue'),
      },
      {
        path: 'all-title/index',
        name: 'CustomerAllTitleIndex',
        meta: {
          title: '抬头列表',
        },
        resources: 'invoice_titles-index',
        component: () => import('@/views/customer/list/title/index.vue'),
      },
      {
        path: 'all-wishlist/index',
        name: 'CustomerAllWishlistIndex',
        meta: {
          title: '收藏夹',
        },
        resources: 'wishlists-index',
        component: () => import('@/views/customer/list/wishlist/index.vue'),
      },
      {
        path: 'all-coupon/index',
        name: 'CustomerAllCouponIndex',
        meta: {
          title: '优惠券-列表',
        },
        resources: 'customers_coupons-index',
        component: () => import('@/views/customer/list/coupon/index.vue'),
      },
    ],
  },
];

export default customer;
