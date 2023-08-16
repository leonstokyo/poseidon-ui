import request from '../utils/request';

const COUPON_BASE = '/v2/coupons';
const COUPON_CUSTOMER_BASE = '/v2/customers_coupons';

export default {
  // 获取优惠券订单
  getCouponList(params) {
    return request.get(COUPON_BASE, { params });
  },
  getCouponSublist(params) {
    return request.get(`${COUPON_BASE}/options`, { params });
  },
  // 获取用户优惠券
  getCustomerCouponList(params) {
    return request.get(COUPON_CUSTOMER_BASE, { params });
  },
  // 上架优惠券
  enableCoupon(type, data) {
    return request.post(COUPON_BASE, { type, data });
  },
  // 下发用户优惠券
  deliveryCoupon(data) {
    return request.post(COUPON_CUSTOMER_BASE, { data });
  },
};
