import request from '../../utils/request';

const LABEL_BASE = '/v2/labels';
const LABEL_MAPPING = '/v2/labels/mapping';

export default {
  // 获取标签列表
  getList(params) {
    return request.get(LABEL_BASE, { params });
  },
  getItem(id) {
    return request.get(`${LABEL_BASE}/${id}`);
  },
  update(id, data, origin) {
    return request.put(`${LABEL_BASE}/${id}`, { data, origin });
  },
  create(data) {
    return request.post(`${LABEL_BASE}`, { data });
  },
  delete(id) {
    return request.delete(`${LABEL_BASE}/${id}`);
  },
  getMapping() {
    return request.get(LABEL_MAPPING);
  },
  getLabelReference(id) {
    return request.get(`${LABEL_BASE}/${id}/reference`);
  },
};
