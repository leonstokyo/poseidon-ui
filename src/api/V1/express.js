import request from '../../utils/request';

const ORDER_ROUTES = '/express/routes';

export default {
  // 获取运单路由
  getSFOrderRoutes(waybill) {
    return request.get(`${ORDER_ROUTES}/${waybill}`);
  },
};
