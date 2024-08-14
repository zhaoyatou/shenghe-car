import { getCache, setCache, removeCache } from '@/utils/session';

const state = {
  storeInfo: getCache('STORE_INFO') || '',
};
const mutations = {
  STORE_INFO(state, storeInfo) {
    state.storeInfo = storeInfo;
  }
};
const actions = {
  info({ commit }, storeInfo) {
    commit('STORE_INFO', storeInfo);
    setCache('STORE_INFO', storeInfo);
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
