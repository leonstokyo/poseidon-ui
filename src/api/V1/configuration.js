import request from '../../utils/request';
// banner
const BANNER_BASE = '/v2/banners';

// homepage
const HOMEPAGE_BASE = '/v2/homepages';

// optionBanner(filter)
const OPTION_BANNER_BASE = '/v2/filters';
// navigation
const NAVIGATION_BASE = '/v2/navigations';

export default {
  getBannerList(params) {
    return request.get(BANNER_BASE, { params });
  },

  getBannerItem(id) {
    return request.get(`${BANNER_BASE}/${id}`);
  },

  createBanner(data) {
    return request.post(BANNER_BASE, { data });
  },

  updateBanner(id, data, origin) {
    return request.put(`${BANNER_BASE}/${id}`, { data, origin });
  },

  // homepage
  getHomepageList(params) {
    return request.get(HOMEPAGE_BASE, { params });
  },

  getHomepageItem(id) {
    return request.get(`${HOMEPAGE_BASE}/${id}`);
  },

  createHomepage(data) {
    return request.post(HOMEPAGE_BASE, { data });
  },

  updateHomepage(id, data, origin) {
    return request.put(`${HOMEPAGE_BASE}/${id}`, { data, origin });
  },
  // 获取optionBanner列表
  getOptionBannerList(params) {
    return request.get(OPTION_BANNER_BASE, { params });
  },

  // 获取optionBanner子列表
  getOptionBannerChildren(parent_id) {
    return request.get(`${OPTION_BANNER_BASE}/${parent_id}/children`);
  },

  // 创建optionBanner
  createOptionBanner(data) {
    return request.post(OPTION_BANNER_BASE, { data });
  },

  getOptionBannerItem(id) {
    return request.get(`${OPTION_BANNER_BASE}/${id}`);
  },

  deleteOptionBanner(id) {
    return request.delete(`${OPTION_BANNER_BASE}/${id}`);
  },

  // 更新optionBanner
  updateOptionBanner(id, data, origin) {
    return request.put(`${OPTION_BANNER_BASE}/${id}`, { data, origin });
  },

  // 删除navigation
  deleteNavigation(id) {
    return request.delete(`${NAVIGATION_BASE}/${id}`);
  },

  // 获取导航列表
  getNavigationList(params) {
    return request.get(NAVIGATION_BASE, { params });
  },

  getNavigationItem(id) {
    return request.get(`${NAVIGATION_BASE}/${id}`);
  },
  getNavigationChildren(parent_id) {
    return request.get(`${NAVIGATION_BASE}/${parent_id}/children`);
  },

  // 创建navigation
  createNavigation(params) {
    return request.post(NAVIGATION_BASE, { params });
  },

  // 更新navigation
  updateNavigation(params, origin) {
    return request.put(`${NAVIGATION_BASE}/${params.navigation.id}`, { params, origin });
  },
};
