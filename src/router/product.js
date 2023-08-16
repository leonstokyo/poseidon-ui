const product = [
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/frame',
    children: [
      {
        path: 'frame',
        name: 'FrameIndex',
        meta: {
          title: '镜框列表',
        },
        resources: 'frames-index',
        component: () => import('@/views/product/frame/index.vue'),
      },
      {
        path: 'frame/edit/:type/:sku',
        name: 'FrameEdit',
        meta: {
          title: '镜框-编辑',
        },
        resources: 'frames-show',
        component: () => import('@/views/product/frame/edit.vue'),
      },
      {
        path: 'simple',
        name: 'SimpleIndex',
        meta: {
          title: 'Simple列表',
        },
        resources: 'simples-index',
        component: () => import('@/views/product/simple/index.vue'),
      },
      {
        path: 'simple/edit/:id',
        name: 'SimpleEdit',
        meta: {
          title: 'SKU-编辑',
        },
        resources: 'simples-show',
        component: () => import('@/views/product/simple/edit.vue'),
      },
      {
        path: 'lens',
        name: 'LensIndex',
        meta: {
          title: '镜片列表',
        },
        resources: 'lens-index',
        component: () => import('@/views/product/lens/index.vue'),
      },
      {
        path: 'lens/edit/:sku',
        name: 'LensEdit',
        meta: {
          title: '镜片-编辑',
        },
        resources: 'lens-update',
        component: () => import('@/views/product/lens/edit.vue'),
      },
      {
        path: 'lens/add',
        name: 'LensAdd',
        meta: {
          title: '镜片-添加',
        },
        resources: 'lens-create',
        component: () => import('@/views/product/lens/edit.vue'),
      },
      {
        path: 'accessory',
        name: 'AccessoryIndex',
        meta: {
          title: '配件列表',
        },
        resources: 'accessories-index',
        component: () => import('@/views/product/accessory/index.vue'),
      },
      {
        path: 'accessory/edit/:sku',
        name: 'AccessoryEdit',
        meta: {
          title: '配件-编辑',
        },
        resources: 'accessories-update',
        component: () => import('@/views/product/accessory/edit.vue'),
      },
      {
        path: 'new',
        name: 'NewIndex',
        meta: {
          title: '上新列表',
        },
        component: () => import('@/views/product/new/index.vue'),
      },
    ],
  },
];

export default product;
