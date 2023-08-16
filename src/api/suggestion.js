import request from '../utils/request';

const SUGGESTION_BASE = '/v2/suggestions';

export default {
  getSuggestionList(params) {
    return request.get(SUGGESTION_BASE, { params });
  },
  handleSuggestion(id, desc) {
    return request.post(`${SUGGESTION_BASE}/${id}/handle`, { desc });
  },
  getSuggestionItem(id) {
    return request.get(`${SUGGESTION_BASE}/${id}`);
  },
};
