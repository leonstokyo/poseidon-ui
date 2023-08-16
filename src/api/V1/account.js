import request from '../../utils/request';

const ACCOUNT_BASE_URL = '/v1/accounts';
const ACCOUNT_LOGIN = '/v1/accounts/login';
const ACCOUNT_LOGOUT = 'v2/accounts/logout';
const ACCOUNT_ME = 'v2/accounts/me';

export default {
  getList(params) {
    return request.get(ACCOUNT_BASE_URL, { params });
  },
  getItem(id) {
    return request.get(`${ACCOUNT_BASE_URL}/${id}`);
  },
  create(data) {
    return request.post(`${ACCOUNT_BASE_URL}`, { data });
  },
  update(id, data) {
    return request.put(`${ACCOUNT_BASE_URL}/${id}`, { data });
  },
  login(username, password) {
    return request.post(ACCOUNT_LOGIN, { username, password });
  },
  logout() {
    return request.post(ACCOUNT_LOGOUT);
  },
  getInfo() {
    return request.get(ACCOUNT_ME);
  },
};
