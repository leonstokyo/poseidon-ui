const config = [
  {
    path: '/config',
    name: 'Config',
    component: () => import('@/layout/index'),
    redirect: '/config/navigation',
    children: [
      {
        path: 'navigation',
        name: 'NavigationIndex',
        meta: {
          title: '首页导航',
        },
        resources: 'navigations-index',
        component: () => import('@/views/config/navigation/index.vue'),
      },
      {
        path: 'navigation/add',
        name: 'NavigationAdd',
        meta: {
          title: '首页导航-添加',
        },
        resources: 'navigations-create',
        component: () => import('@/views/config/navigation/edit.vue'),
      },
      {
        path: 'navigation/edit/:id',
        name: 'NavigationEdit',
        meta: {
          title: '首页导航-编辑',
        },
        resources: 'navigations-update',
        component: () => import('@/views/config/navigation/edit.vue'),
      },
      {
        path: 'banner',
        name: 'BannerIndex',
        meta: {
          title: '首页Banner',
        },
        resources: 'banners-index',
        component: () => import('@/views/config/banner/index.vue'),
      },
      {
        path: 'banner/add',
        name: 'BannerAdd',
        meta: {
          title: '首页Banner-添加',
        },
        resources: 'banners-create',
        component: () => import('@/views/config/banner/edit.vue'),
      },
      {
        path: 'banner/edit/:id',
        name: 'BannerEdit',
        meta: {
          title: '首页Banner-编辑',
        },
        resources: 'banners-update',
        component: () => import('@/views/config/banner/edit.vue'),
      },
      {
        path: 'homepage',
        name: 'HomepageIndex',
        meta: {
          title: 'Homepage',
        },
        resources: 'homepages-index',
        component: () => import('@/views/config/homepage/index.vue'),
      },
      {
        path: 'homepage/add',
        name: 'HomepageAdd',
        meta: {
          title: 'Homepage-添加',
        },
        resources: 'homepages-create',
        component: () => import('@/views/config/homepage/edit.vue'),
      },
      {
        path: 'homepage/edit/:id',
        name: 'HomepageEdit',
        meta: {
          title: 'Homepage-编辑',
        },
        resources: 'homepages-update',
        component: () => import('@/views/config/homepage/edit.vue'),
      },
      {
        path: 'option-banner',
        name: 'OptionBannerIndex',
        meta: {
          title: '筛选项',
        },
        resources: 'filters-index',
        component: () => import('@/views/config/option-banner/index.vue'),
      },
      {
        path: 'option-banner/add',
        name: 'OptionBannerAdd',
        meta: {
          title: '筛选项-添加',
        },
        resources: 'filters-create',
        component: () => import('@/views/config/option-banner/edit.vue'),
      },
      {
        path: 'option-banner/edit/:id',
        name: 'OptionBannerEdit',
        meta: {
          title: '筛选项-编辑',
        },
        resources: 'filters-update',
        component: () => import('@/views/config/option-banner/edit.vue'),
      },
      // {
      //   path: 'multi-option',
      //   name: 'MultiOptionIndex',
      //   meta: {
      //     title: '多选项',
      //   },
      //   component: () => import('@/views/config/multi-option/index.vue'),
      // },
    ],
  },
];

export default config;
