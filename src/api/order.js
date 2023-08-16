import request from '../utils/request';

const ORDER_BASE = '/v2/orders';
const ORDER_PUSH_STSATUS = '/order/status';

const ORIGIN_ORDER_INFO = 'v2/orders/get_origin_order_info';
const ORIGIN_ORDER_PRESCRIPTION = 'v2/orders/get_origin_prescription';

export default {
  // 获取订单列表
  getOrderList(params) {
    return request.get(ORDER_BASE, { params });
  },
  // 获取订单详情
  getOrderItem(id) {
    return request.get(`${ORDER_BASE}/${id}`);
  },
  // 修改订单上的验光单
  updateCommerceitemPrescription(data, commerceitemId, origin) {
    return request.put(`${ORDER_BASE}/update_order_prescription`, {
      data,
      commerceitemId,
      origin,
    });
  },

  // 修改订单状态
  updateOrderStatus(ordersn) {
    return request.post(ORDER_PUSH_STSATUS, { ordersn });
  },

  // 修改订单状态
  pushToFactory(ordersn) {
    return request.post(`${ORDER_BASE}/${ordersn}/push_to_factory`, { ordersn });
  },

  // 退款
  orderRefund(data) {
    return request.post(`${ORDER_BASE}/refund`, { data });
  },

  // 更新订单信息
  updateOrderInfo(orderId, data, origin) {
    return request.put(`${ORDER_BASE}/${orderId}`, {
      data,
      origin,
    });
  },
  // 获取原始订单信息
  getOriginOrderInfo(orderId) {
    return request.get(`${ORIGIN_ORDER_INFO}/${orderId}`);
  },
  // 获取原始验光单信息
  getOriginPrescription(prescriptionId) {
    return request.get(`${ORIGIN_ORDER_PRESCRIPTION}/${prescriptionId}`);
  },
};
