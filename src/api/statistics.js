import request from '../utils/request';

const ACTIVITY_SALE_LIST = '/statistics/activity-sale/list';
const ACTIVITY_SALE_DOWNLOAD = '/statistics/activity-sale/download';

export default {
  // 获取订单列表
  getActivitySaleList({ currentPage, pageSize, filter }) {
    return request.get(ACTIVITY_SALE_LIST, { params: { currentPage, pageSize, filter } });
  },
  // 获取excel文件
  getActivitySaleListExcel({ filter }) {
    return request({
      method: 'get',
      url: ACTIVITY_SALE_DOWNLOAD, // 请求地址
      params: { filter },
      responseType: 'blob',
    });
  },

  getSalesReport(params) {
    return request.get('/v2/statistics/sales_report', { params });
  },
};
