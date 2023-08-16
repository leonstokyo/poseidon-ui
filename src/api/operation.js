import request from '../utils/request';

const OPERATION_LOG_BASE = '/v2/operation_logs';

export default {
  // 获取操作日志列表
  getOperationLogList(params) {
    return request.get(OPERATION_LOG_BASE, { params });
  },
  getOperationLogOption() {
    return request.get(`${OPERATION_LOG_BASE}/options`);
  },
  getOperationLogItem(id) {
    return request.get(`${OPERATION_LOG_BASE}/${id}`);
  },
};
