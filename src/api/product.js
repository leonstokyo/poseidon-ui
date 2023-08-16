import request from '../utils/request';
// 镜框
const FRAME_BASE = '/v2/frames';
// 镜片
const LENS_BASE = '/v2/lens';
// 配件
const ACCESSORY_BASE = '/v2/accessories';

const ATTRIBUTE_ITEMS = '/product/attributes';
const CATEGORIES = '/v2/product_infos/categories';
const STOCK_FLOW_LIST = '/product/stock-flow/list';
const STOCK_ENTRY_BASE = '/v2/stock_entries';
const STOCK_DELIVERY_BASE = '/v2/stock_deliveries';
// 上新数据
const NEW_PRODUCT_LIST = '/product/new/list';

const NEW_PRODUCT_CSV = '/product/new/csv';

const LENS_CSV = '/product/new/package';

const NEW_PRODUCT_CHILDREN = '/product/new/children';

export default {
  // 获取镜框列表
  getFrameList(params) {
    return request.get(FRAME_BASE, { params });
  },
  getFrameItem(sku) {
    return request.get(`${FRAME_BASE}/${sku}`);
  },
  // 更新镜框
  updateFrame(data, origin) {
    return request.put(`${FRAME_BASE}/${data.id}`, { data, origin });
  },

  // 获取镜片列表
  getLensList(params) {
    return request.get(LENS_BASE, { params });
  },
  // 获取镜片Item
  getLensItem(sku) {
    return request.get(`${LENS_BASE}/${sku}`, { params: { sku } });
  },
  // 更新镜片
  updateLens(data, origin) {
    return request.put(`${LENS_BASE}/${data.id}`, { data, origin });
  },
  // 新建镜片
  createLens(data) {
    return request.post(LENS_BASE, { data });
  },

  // 获取配件列表
  getAccessoryList(params) {
    return request.get(ACCESSORY_BASE, { params });
  },
  // 获取配件Item
  getAccessoryItem(sku) {
    return request.get(`${ACCESSORY_BASE}/${sku}`, { params: { sku } });
  },
  // 更新配件
  updateAccessory(data, origin) {
    return request.put(`${ACCESSORY_BASE}/${data.id}`, { data, origin });
  },
  // 新建配件
  createAccessory(data) {
    return request.post(ACCESSORY_BASE, { data });
  },
  // 获取库存流水列表
  getStockFlowList({ currentPage, pageSize, filter }) {
    return request.post(STOCK_FLOW_LIST, { currentPage, pageSize, filter });
  },

  getStockEntriesList(params) {
    return request.get(STOCK_ENTRY_BASE, { params });
  },

  getStockDeliveryList(params) {
    return request.get(STOCK_DELIVERY_BASE, { params });
  },

  getAttributes(names) {
    return request.post(ATTRIBUTE_ITEMS, { names });
  },
  getCategories() {
    return request.get(CATEGORIES);
  },
  getNewProductList(params) {
    return request.get(NEW_PRODUCT_LIST, { params });
  },
  getNewProductChildren(child_skus) {
    return request.get(NEW_PRODUCT_CHILDREN, { params: { child_skus } });
  },
  // 获取excel文件
  getNewProductCsv({ filter }) {
    return request({
      method: 'get',
      url: NEW_PRODUCT_CSV, // 请求地址
      params: { filter },
      responseType: 'blob',
    });
  },

  // 获取镜片套餐excel
  getLensCsv() {
    return request({
      method: 'get',
      url: LENS_CSV, // 请求地址
      responseType: 'blob',
    });
  },
};
