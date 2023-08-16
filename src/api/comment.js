import request from '../utils/request';

const COMMENT_BASE = '/v2/comments';
const COMMENT_ITEM = '/comment/item';
const COMMENT_AUDIT = '/comment/audit';

export default {
  // 获取评论列表
  getCommentList(params) {
    return request.get(COMMENT_BASE, { params });
  },
  // 获取评论详情
  getCommentItem(id) {
    return request.get(`${COMMENT_BASE}/${id}`);
  },
  // 审核评论
  auditComment(review_id, btn) {
    return request.post(`${COMMENT_BASE}/${review_id}/audit`, { btn });
  },
};
