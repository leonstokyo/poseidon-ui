import request from '../../utils/request';

const LENS_CSV = '/V1/products/lens/csv';
const PRODUCT_ATTRIBUTES = '/v2/product_infos/attributes';
const FRAME_SIMPLE_BASE = '/v2/simples';

export default {
  // 获取镜片套餐excel
  getLensCsv() {
    return request({
      method: 'get',
      url: LENS_CSV, // 请求地址
      responseType: 'blob',
    });
  },
  // 通过名称获取attribute
  getAttributesByNameByName(names) {
    return request.post(PRODUCT_ATTRIBUTES, { names });
  },
  // 获取镜框Simple列表
  getFrameSimpleList(params) {
    return request.get(FRAME_SIMPLE_BASE, { params });
  },
  // 获取镜框Simple item
  getFrameSimpleItem(id) {
    return request.get(`${FRAME_SIMPLE_BASE}/${id}`);
  },
};
