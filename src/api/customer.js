import request from '../utils/request';

const CUSTOMER_BASE = '/v2/customers';
const CUSTOMER_ADDRESS_LIST = '/customer/address/list';
const CUSTOMER_ADDRESS_ITEM = '/customer/address/item';
const CUSTOMER_ADDRESS_CODE = '/customer/address-code/list';
const CUSTOMER_ADDRESS_UPDATE = '/customer/address/update';
const CUSTOMER_PRESCRIPTION_LIST = '/customer/prescription/list';
const CUSTOMER_PRESCRIPTION_ITEM = '/customer/prescription/item';
const CUSTOMER_PRESCRIPTION_UPDATE = '/customer/prescription/update';
const CUSTOMER_PRESCRIPTION_CREATE = '/customer/prescription/create';
const PRESCRIPTION_BASE = '/v2/prescriptions';
const ADDRESS_BASE = '/v2/addresses';
const INVOICE_TITLE_BASE = '/v2/invoice_titles';
const WISHLIST_BASE = '/v2/wishlists';

export default {
  // 获取用户列表
  getCustomerList(params) {
    return request.get(CUSTOMER_BASE, { params });
  },
  // 获取单个用户
  getCustomerItem(id) {
    return request.get(`${CUSTOMER_BASE}/${id}`);
  },
  // 更新用户
  updateCustomer(data) {
    return request.put(`${CUSTOMER_BASE}/${data.id}`, { data });
  },
  // 地址列表
  getAddressList(customerId) {
    return request.get(CUSTOMER_ADDRESS_LIST, { params: { id: customerId } });
  },
  // 单个地址
  getAddressItem(id) {
    return request.get(CUSTOMER_ADDRESS_ITEM, { params: { id } });
  },
  // 获取地址码
  getAddressCode(code) {
    return request.get(`${ADDRESS_BASE}/code`, { params: { code } });
  },
  // 更新地址
  updateAddress(data) {
    return request.post(CUSTOMER_ADDRESS_UPDATE, { data });
  },
  // 处方列表
  getPrescriptionList(id) {
    return request.get(CUSTOMER_PRESCRIPTION_LIST, { params: { id } });
  },
  // 单个处方
  getPrescriptionItem(id) {
    return request.get(`${PRESCRIPTION_BASE}/${id}`, { params: { id } });
  },
  // 更新处方
  updatePrescription(data, origin) {
    return request.post(`${PRESCRIPTION_BASE}/${data.id}`, { data, origin });
  },
  // 创建处方
  createPrescription(data) {
    return request.post(PRESCRIPTION_BASE, { data });
  },
  // 所有用户地址
  getAllAddressList(params) {
    return request.get(ADDRESS_BASE, { params });
  },
  getAllPrescriptionList(params) {
    return request.get(PRESCRIPTION_BASE, { params });
  },
  getAllTitleList(params) {
    return request.get(INVOICE_TITLE_BASE, { params });
  },
  getAllWishlistList(params) {
    return request.get(WISHLIST_BASE, { params });
  },
};
