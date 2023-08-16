import Vue from 'vue';
import Vuex from 'vuex';

import permission from './modules/permission';
import loading from './modules/loading';
import options from './modules/options';
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  modules: {
    permission,
    options,
    loading,
  },
  strict: debug,
});
