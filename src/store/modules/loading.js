const state = {
  loading: false,
};

const getters = {
  loading: (state) => state.loading,
};

const actions = {
  setLoading({ commit }) {
    commit('setLoading');
  },

  setLoadingComplete({ commit }) {
    commit('setLoadingComplete');
  },
};

const mutations = {
  setLoading(state) {
    state.loading = true;
  },
  setLoadingComplete(state) {
    state.loading = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
