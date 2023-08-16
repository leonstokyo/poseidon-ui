const account = [
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/layout/index'),
    redirect: '/system/account',
    children: [
      {
        path: 'account',
        name: 'AccountIndex',
        meta: {
          title: '账号列表',
        },
        component: () => import('@/views/system/account'),
      },
    ],
  },
];

export default account;
