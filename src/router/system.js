const system = [
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layout/index'),
    redirect: '/system/account',
    children: [
      {
        path: 'account',
        name: 'AccountIndex',
        meta: {
          title: '账号列表',
        },
        resources: 'accounts-index',
        component: () => import('@/views/system/account'),
      },
      {
        path: 'account/add',
        name: 'AccountAdd',
        meta: {
          title: '账号-添加',
        },
        component: () => import('@/views/system/account/edit.vue'),
      },
      {
        path: 'account/edit/:id',
        name: 'AccountEdit',
        meta: {
          title: '账号-编辑',
        },
        resources: 'accounts-update',
        component: () => import('@/views/system/account/edit.vue'),
      },
      // {
      //   path: 'permission',
      //   name: 'PermissionIndex',
      //   meta: {
      //     title: '权限列表',
      //   },
      //   component: () => import('@/views/system/permission/index.vue'),
      // },
      // {
      //   path: 'permission/add',
      //   name: 'PermissionAdd',
      //   meta: {
      //     title: '权限-添加',
      //   },
      //   component: () => import('@/views/system/permission/edit.vue'),
      // },
      // {
      //   path: 'permission/edit/:id',
      //   name: 'PermissionEdit',
      //   meta: {
      //     title: '权限-编辑',
      //   },
      //   component: () => import('@/views/system/permission/edit.vue'),
      // },
      {
        path: 'role',
        name: 'RoleIndex',
        meta: {
          title: '角色列表',
        },
        resources: 'roles-index',
        component: () => import('@/views/system/role/index.vue'),
      },
      {
        path: 'role/add',
        name: 'RoleAdd',
        meta: {
          title: '角色-添加',
        },
        resources: 'roles-create',
        component: () => import('@/views/system/role/edit.vue'),
      },
      {
        path: 'role/edit/:id',
        name: 'RoleEdit',
        meta: {
          title: '角色-编辑',
        },
        resources: 'roles-update',
        component: () => import('@/views/system/role/edit.vue'),
      },
      // {
      //   path: 'role-permission/edit/:id',
      //   name: 'RolePermissionEdit',
      //   meta: {
      //     title: '角色权限-编辑',
      //   },
      //   component: () => import('@/views/system/role/edit.vue'),
      // },
      {
        path: 'operation/log',
        name: 'OperationLog',
        meta: {
          title: '操作日志',
        },
        resources: 'operation_logs-index',
        component: () => import('@/views/system/operationLog/index.vue'),
      },
      {
        path: 'operation/log/edit/:id',
        name: 'OperationLogEdit',
        meta: {
          title: '操作日志-编辑',
        },
        resources: 'operation_logs-show',
        component: () => import('@/views/system/operationLog/edit.vue'),
      },
    ],
  },
];

export default system;
