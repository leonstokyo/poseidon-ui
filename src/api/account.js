import request from '../utils/request';

const LONG_IN = '/account/login';
const LONG_OUT = '/account/logout';
const INFO = '/account/info';
const ACCOUNT_LIST = '/account/list';
const ACCOUNT_ITEM = '/account/item';
const CREATE_ACCOUNT = '/account/create';
const UPDATE_ACCOUNT = '/account/update';
const PERMISSIONS = '/v2/accounts/permission';
const OPERATOR_LIST = '/account/operator/list';

export default {
  // 获取账号列表
  getAccountList(params) {
    return request.get(ACCOUNT_LIST, { params });
  },
  // 邮箱-密码 登录
  login(email, password) {
    return request.post(LONG_IN, { email, password });
  },
  // 登出
  logout() {
    return request.post(LONG_OUT);
  },
  // 获取用户信息
  getAccountInfo() {
    return request.get(INFO);
  },
  // 获取operator列表
  getOperatorList() {
    return request.get(OPERATOR_LIST);
  },
  // 获取单个用户
  getAccountItem(id) {
    return request.get(ACCOUNT_ITEM, { params: { id } });
  },
  // 更新用户
  updateAccount(data, origin) {
    return request.post(UPDATE_ACCOUNT, { data, origin });
  },
  // 创建用户
  createAccount(data) {
    return request.post(CREATE_ACCOUNT, { data });
  },
  // 获取用户的权限列表
  getAccountPermission() {
    return request.get(PERMISSIONS);
  },
};
