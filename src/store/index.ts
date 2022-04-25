import { createStore } from 'vuex';

export default createStore({
  state: {
    graphFile: File,
  },
  getters: {
    graphFile: (state) => state.graphFile,
  },
  mutations: {
    SET_GRAPH_FILE(state, file) {
      state.graphFile = file;
    },
  },
  actions: {
    setGraphFile({ commit }, file) {
      commit('SET_GRAPH_FILE', file);
    },
  },
  modules: {},
});
