import request from '../utils/request';

const PERMISSION_LIST = '/permission/list';
const PERMISSION_TREE = '/permission/tree';
const PERMISSION_SUBLIST = '/permission/sublist';
const PERMISSION_CREATE = '/permission/create';
const PERMISSION_ITEM = '/permission/item';
const PERMISSION_UPSERT = '/permission/upsert';
const PERMISSION_DELETE = '/permission/delete';
const PERMISSION_ROLE_SUBLIST = '/permission/role/sublist';
const ROLE_BASE = '/v2/roles';

export default {
  // 获取权限列表
  getPermissionList(params) {
    return request.get(PERMISSION_LIST, { params });
  },
  // 获取权限树
  getPermissionTree() {
    return request.get(`${ROLE_BASE}/permission_lists`);
  },
  getPermissionSublist(type) {
    return request.get(PERMISSION_SUBLIST, { params: { type } });
  },
  getPermissionItem(id) {
    return request.get(PERMISSION_ITEM, { params: { id } });
  },
  createPermission(data) {
    return request.post(PERMISSION_CREATE, { data });
  },
  upsertPermission(data) {
    return request.post(PERMISSION_UPSERT, { data });
  },
  deletePermission(id) {
    return request.post(PERMISSION_DELETE, { id });
  },
  getRoleList(params) {
    return request.get(ROLE_BASE, { params });
  },
  getRoleSublist() {
    return request.get(`${ROLE_BASE}/options`);
  },
  getRoleItem(id) {
    return request.get(`${ROLE_BASE}/${id}`);
  },
  updateRole(role, origin) {
    return request.put(`${ROLE_BASE}/${role.id}`, { data: role, origin });
  },
  createRole(role) {
    return request.post(ROLE_BASE, { data: role });
  },
  getRolePermissionItem(role_id) {
    return request.get(`${ROLE_BASE}/${role_id}/permissions`);
  },
};
