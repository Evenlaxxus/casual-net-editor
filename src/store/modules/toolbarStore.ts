export const toolbarStore = {
  state: () => ({
    isToolbarVisible: false,
    header: 'Toolbar',
    content: null,
  }),
  mutations: {
    SET_IS_TOOLBAR_VISIBLE(state, payload) {
      state.isToolbarVisible = payload;
    },
    SET_HEADER(state, payload) {
      state.header = payload;
    },
  },
  actions: {
    setIsToolbarVisible({ commit }, payload) {
      commit('SET_IS_TOOLBAR_VISIBLE', payload);
    },
    setHeader({ commit }, payload) {
      commit('SET_HEADER', payload);
    },
  },
  getters: {
    isToolbarVisible: (state) => state.isToolbarVisible,
  },
};
