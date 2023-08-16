import request from '../utils/request';
// banner
const BANNER_LIST = '/distribution/banner/list';
const BANNER_ITEM = '/distribution/banner/item';
const CREATE_BANNER = '/distribution/banner/create';
// navigation
const NAVIGATION_LIST = '/distribution/navigation/list';
const NAVIGATION_ITEM = '/distribution/navigation/item';
const CREATE_NAVIGATION = '/distribution/navigation/create';
const UPDATE_NAVIGATION = '/distribution/navigation/update';
const NAVIGATION_CHILDREN = '/distribution/navigation/sublist';
const DELETE_NAVIGATION = '/distribution/navigation/delete';
// optionBanner
const OPTION_BANNER_LIST = '/distribution/option-banner/list';
const OPTION_BANNER_ITEM = '/distribution/option-banner/item';
const CREATE_OPTION_BANNER = '/distribution/option-banner/create';
const UPDATE_OPTION_BANNER = '/distribution/option-banner/update';
const OPTION_BANNER_CHILDREN = '/distribution/option-banner/sublist';
const DELETE_OPTION_BANNER = '/distribution/option-banner/delete';

export default {
  // 获取产品列表
  getBannerList(params) {
    return request.get(BANNER_LIST, { params });
  },

  getBannerItem(id) {
    return request.get(BANNER_ITEM, { params: { id } });
  },

  // 创建navigation
  createBanner(params, origin) {
    return request.post(CREATE_BANNER, { params, origin });
  },

  // 删除optionBanner
  deleteOptionBanner(id) {
    return request.post(DELETE_OPTION_BANNER, { id });
  },

  // 获取optionBanner列表
  getOptionBannerList(params) {
    return request.get(OPTION_BANNER_LIST, { params });
  },

  getOptionBannerItem(id) {
    return request.get(OPTION_BANNER_ITEM, { params: { id } });
  },

  getOptionBannerChildren(parent_id) {
    return request.get(OPTION_BANNER_CHILDREN, { params: { parent_id } });
  },

  // 创建optionBanner
  createOptionBanner(params) {
    return request.post(CREATE_OPTION_BANNER, params);
  },

  // 更新optionBanner
  updateOptionBanner(params, origin) {
    return request.post(UPDATE_OPTION_BANNER, { params, origin });
  },

  // 删除navigation
  deleteNavigation(id) {
    return request.post(DELETE_NAVIGATION, { id });
  },

  // 获取导航列表
  getNavigationList(params) {
    return request.get(NAVIGATION_LIST, { params });
  },

  getNavigationItem(id) {
    return request.get(NAVIGATION_ITEM, { params: { id } });
  },
  getNavigationChildren(parent_id) {
    return request.get(NAVIGATION_CHILDREN, { params: { parent_id } });
  },

  // 创建navigation
  createNavigation(params) {
    return request.post(CREATE_NAVIGATION, params);
  },

  // 更新navigation
  updateNavigation(params, origin) {
    return request.post(UPDATE_NAVIGATION, { params, origin });
  },
};
