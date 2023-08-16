import productApi from '@/api/V1/product';

const state = {
  attributeOptions: {},
  attributeMappings: {},
  optionNames: [
    'color',
    'material',
    'rim_type',
    'frame_type',
    'frame_shape_type',
    'visibility',
    'accessory_type_code',
    'lens_usage',
    'package_type',
    'population',
    'occasion',
  ],
};

const getters = {
  attributeOptions: (state) => state.attributeOptions,
  attributeMappings: (state) => state.attributeMappings,
  optionNames: (state) => state.optionNames,
};

const actions = {
  updateOptions({ commit, state }, names) {
    const sendNames = names || state.optionNames;
    return productApi.getAttributesByNameByName(sendNames).then((res) => {
      commit('updateOptions', res);
    });
  },
};

const mutations = {
  updateOptions(state, res) {
    state.attributeOption = res['data']['attributesOption'];
    state.attributeMappings = res['data']['attributeMapping'];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
