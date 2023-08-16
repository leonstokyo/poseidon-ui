import request from '../../utils/request';

const LENS_PACKAGE_BASE = '/v2/lens_packages';
const LENS_PACKAGE_LIST = '/v2/lens_packages/frame';
const LENS_SHAPE_INFO = '/v2/lens_packages/lens_shapes';
const LENS_ATTRIBUTES = '/v2/lens_packages/attributes_map';
export default {
  // 获取标签列表
  getList(configurableId) {
    return request.get(`${LENS_PACKAGE_LIST}/${configurableId}`);
  },
  getItem(id) {
    return request.get(`${LENS_PACKAGE_BASE}/${id}`);
  },
  update(data, id) {
    return request.put(`${LENS_PACKAGE_BASE}/${id}`, { data });
  },
  create(data) {
    return request.post(`${LENS_PACKAGE_BASE}`, { data });
  },
  delete(id) {
    return request.delete(`${LENS_PACKAGE_BASE}/${id}`);
  },
  getLensShapeInfo() {
    return request.get(LENS_SHAPE_INFO);
  },
  getAttributesMap() {
    return request.get(LENS_ATTRIBUTES);
  },
};
