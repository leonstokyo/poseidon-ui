import request from '../utils/request';

const INVOICE_BASE = '/v2/invoices';

export default {
  // 获取发票列表
  getInvoiceList(params) {
    return request.get(INVOICE_BASE, { params });
  },
  // 审核发票
  auditInvoice(orderId, btnId) {
    return request.post(`${INVOICE_BASE}/audit`, { orderId, btnId });
  },
  // 获取发票详情
  getInvoiceItem(invoiceId) {
    return request.get(`${INVOICE_BASE}/${invoiceId}`);
  },
};
