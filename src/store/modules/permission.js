// import nav from '@/constant/nav.js';
// import Layout from '@/layout';
// import accountApi from '@/api/account';
//
// import product from '@/router/product';
// import user from '@/router/customer';
// import order from '@/router/order';
// import config from '@/router/config';
// import system from '@/router/system';
// import dashboard from '@/router/dashboard';
//
// const ALL_ROUTERS = [];
// ALL_ROUTERS.push(
//   ...product,
//   ...user,
//   ...order,
//   ...config,
//   ...system,
//   ...dashboard,
// );
// const state = {
//   displayMenu: [],
//   availableRouter: [],
//   availableButton: [],
//   accountPermission: {},
//   isAdmin: 0,
//   refresh: '-1',
// };
//
// const getters = {
//   displayMenu: (state) => state.displayMenu,
//   availableButton: (state) => state.availableButton,
//   availableRouter: (state) => state.availableRouter,
//   accountPermission: (state) => state.accountPermission,
//   isAdmin: (state) => state.isAdmin,
//   refresh: (state) => state.refresh,
//   canDo: (state) => (action) => {
//     return state.isAdmin == 1 || state.accountPermission.indexOf(action) > -1;
//   },
// };
//
// const actions = {
//   updateRefresh({ commit }, val) {
//     commit('updateRefresh', val);
//   },
//   updatePermission({ commit }) {
//     return accountApi
//       .getAccountPermission()
//       .then((res) => {
//         commit('updatePermission', res);
//       })
//       .catch((err) => {
//         document.cookie = 'is_login=0;sessionId=0';
//         location.reload();
//       });
//   },
// };
//
// const mutations = {
//   updatePermission(state, res) {
//     const { isAdmin, accountPermission } = res.data;
//     state.refresh = res.errorCode;
//     state.accountPermission = accountPermission;
//     if (isAdmin) {
//       ALL_ROUTERS.push(
//         {
//           path: '/',
//           component: Layout,
//           redirect: dashboard[0]['path'],
//         },
//         { path: '*', redirect: '/404' }
//       );
//       state.displayMenu = nav;
//       state.isAdmin = isAdmin;
//       state.availableRouter = ALL_ROUTERS;
//       state.availableButton = [];
//     } else {
//       state.isAdmin = isAdmin;
//       state.availableButton = [];
//
//       // 组装数据
//       const displayMenuTmp = [];
//       const availableRouterTmp = [];
//       // 组装导航
//       for (const item of nav) {
//         const tmp = {
//           name: item.name,
//           path: item.path,
//           icon: item.icon,
//           title: item.title,
//           children: [],
//         };
//         if (item.children.length > 0) {
//           for (const childrenItem of item.children) {
//             if (!childrenItem.resources || accountPermission.indexOf(childrenItem.resources) > -1) {
//               tmp.children.push(childrenItem);
//             }
//           }
//         }
//         if (tmp.children.length > 0) {
//           displayMenuTmp.push(tmp);
//         }
//       }
//       state.displayMenu = displayMenuTmp;
//
//       // 组装路由
//       for (const element of ALL_ROUTERS) {
//         const tmp = {
//           name: element.name,
//           path: element.path,
//           redirect: element.redirect,
//           component: element.component,
//           children: [],
//         };
//         if (element.children.length > 0) {
//           for (const childrenItem of element.children) {
//             if (!childrenItem.resources || accountPermission.indexOf(childrenItem.resources) > -1) {
//               tmp.children.push(childrenItem);
//             }
//           }
//         }
//         if (tmp.children.length > 0) {
//           availableRouterTmp.push(tmp);
//         }
//       }
//       availableRouterTmp.push(
//         {
//           path: '/',
//           component: Layout,
//           redirect: dashboard[0]['path'],
//         },
//         { path: '*', redirect: '/404' }
//       );
//       state.availableRouter = availableRouterTmp;
//     }
//   },
//   updateRefresh(state, val) {
//     state.refresh = val;
//   },
// };
//
// export default {
//   namespaced: true,
//   state,
//   getters,
//   actions,
//   mutations,
// };
