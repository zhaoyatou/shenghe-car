import { getCache, setCache, removeCache } from '@/utils/session';
import { login, logout, getCodeTest } from '@/api/user';
import { resetRouter } from '@/router';

const state = {
  accountInfo: getCache('USERINFO') || '',
  token: getCache('TOKEN') || '',
  userInfo: getCache('USERIFNO') || '',
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USERINFO(state, userInfo) {
    state.accountInfo = userInfo;
  },
  SET_USERIFNO(state, userInfo) {
    state.userInfo = userInfo;
  }
};

const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(res => {
          const { data } = res;
          if (data) {
            commit('SET_TOKEN', data.token);
            setCache('TOKEN', data.token);
            commit('SET_USERINFO', data.userInfo);
            setCache('USERINFO', data.userInfo);
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  codeTest({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      getCodeTest(userInfo)
        .then(res => {
          const { data } = res;
          if (data) {
            commit('SET_TOKEN', data.token);
            setCache('TOKEN', data.token);
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  logout({ commit, state }) {
    commit('SET_TOKEN', '');
    commit('SET_USERINFO', '');
    commit('permission/RESET_ROUTE', [], { root: true });
    removeCache('TOKEN');
    removeCache('USERIFNO');
    resetRouter();
  },

  updateInfo({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      commit('SET_USERINFO', userInfo);
      setCache('USERINFO', userInfo);
      resolve();
    });
  },
  userInfos({ commit }, userInfo) {
    if (!userInfo) {
      removeCache('TOKEN');
      removeCache('USERIFNO');
      commit('SET_TOKEN', '');
      commit('SET_USERINFO', '');
      return false
    }
    commit('SET_TOKEN', userInfo.token);
    setCache('TOKEN', userInfo.token);
    setCache('USERIFNO', userInfo);
    commit('SET_USERIFNO', userInfo);
    // setCache('TOKEN', data.token);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
