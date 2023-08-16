const nav = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'el-icon-s-data',
    title: '数据面板',
    children: [
      {
        name: 'DashboardIndex',
        path: '/dashboard/index',
        title: '数据概览',
        icon: 'el-icon-menu',
        resources: '',
      },
      {
        name: 'SalesReport',
        path: '/statistics/sales-report',
        title: '销量报表',
        icon: 'el-icon-menu',
        resources: 'statistics-salesReport',
      },
    ],
  },
  {
    name: 'Order',
    path: '/order',
    icon: 'el-icon-s-order',
    title: '订单管理',
    children: [
      {
        name: 'OrderIndex',
        path: '/order/index',
        title: '订单列表',
        icon: 'el-icon-menu',
        resources: 'orders-index',
      },
      {
        name: 'CommentIndex',
        path: '/order/comment/index',
        title: '评论管理',
        icon: 'el-icon-menu',
        resources: 'comments-index',
      },
    ],
  },
  {
    name: 'Config',
    path: '/config',
    icon: 'el-icon-share',
    title: '页面配置',
    children: [
      {
        name: 'NavigationIndex',
        path: '/config/navigation',
        title: '首页导航',
        icon: 'el-icon-menu',
        resources: 'navigations-index',
      },
      {
        name: 'BannerIndex',
        path: '/config/banner',
        title: '首页Banner',
        icon: 'el-icon-menu',
        resources: 'banners-index',
      },
      {
        name: 'HomepageIndex',
        path: '/config/homepage',
        title: '首页配置',
        icon: 'el-icon-menu',
        resources: 'homepages-index',
      },
      {
        name: 'OptionBannerIndex',
        path: '/config/option-banner',
        title: '筛选配置',
        icon: 'el-icon-menu',
        resources: 'filters-index',
      },
      // {
      //   name: 'MultiOptionIndex',
      //   path: '/config/multi-option',
      //   title: '产品属性',
      //   icon: 'el-icon-menu',
      // },
    ],
  },
  {
    name: 'System',
    path: '/system',
    icon: 'el-icon-s-tools',
    title: '系统管理',
    children: [
      {
        name: 'AccountIndex',
        path: '/system/account',
        title: '账号列表',
        icon: 'el-icon-menu',
        resources: 'accounts-index',
      },
      // {
      //   name: 'PermissionIndex',
      //   path: '/system/permission',
      //   title: '权限列表',
      //   icon: 'el-icon-menu',
      // },
      {
        name: 'RoleIndex',
        path: '/system/role',
        title: '角色列表',
        icon: 'el-icon-menu',
        resources: 'roles-index',
      },
      {
        name: 'OperationLog',
        path: '/system/operation/log',
        title: '操作日志',
        icon: 'el-icon-menu',
        resources: 'operation_logs-index',
      },
    ],
  },
];
export default nav;
