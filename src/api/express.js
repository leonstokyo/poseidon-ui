import request from '../utils/request';

const EXPRESSES_BASE = '/v2/expresses';

export default {
  // 创建顺丰运单
  createSFOrder(orderId) {
    return request.post(EXPRESSES_BASE, { orderId });
  },
  // 获取运单路由
  getSFOrderRoutes(waybill) {
    return request.get(`${EXPRESSES_BASE}/routes`, { params: { waybill } });
  },
};
