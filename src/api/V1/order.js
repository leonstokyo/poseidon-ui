import request from '../../utils/request';

const ORDER_EXPORT_FACTORY = '/v2/orders/export';
const ORDER_EXPORT_INNER = '/v2/orders/export_new';

export default {
  // 获取订单列表
  getOrderExportDataToFactory(filter) {
    return request({
      method: 'get',
      url: ORDER_EXPORT_FACTORY, // 请求地址
      params: filter,
      responseType: 'blob',
    });
  },

  // 获取订单列表
  getOrderExportDataToInner(filter) {
    return request({
      method: 'get',
      url: ORDER_EXPORT_INNER, // 请求地址
      params: filter,
      responseType: 'blob',
    });
  },
};
