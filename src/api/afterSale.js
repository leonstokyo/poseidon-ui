import request from '../utils/request';

const AFTER_SALE_BASE = '/v2/after_sales';

export default {
  // 获取售后订单
  getAfterSaleList(params) {
    return request.get(AFTER_SALE_BASE, { params });
  },
  // 审核售后订单
  auditAfterSale(data, afterSaleId) {
    return request.post(`${AFTER_SALE_BASE}/${afterSaleId}/audit`, {
      data,
    });
  },
  // 获取售后单详情
  getAfterSaleItem(id) {
    return request.get(`${AFTER_SALE_BASE}/${id}`);
  },
};
