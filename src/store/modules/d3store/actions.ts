import * as d3 from 'd3';

export default {
  setSvg({ commit }, selector) {
    commit('SET_SVG', d3.select(selector));
  },

  setDataset({ commit }, payload) {
    commit('SET_DATASET', payload);
  },

  initLink({ commit }) {
    commit('SET_LINK');
  },

  initNode({ commit }) {
    commit('SET_NODE');
  },

  initDots({ commit }) {
    commit('SET_DOT');
  },

  initNodeText({ commit }) {
    commit('SET_NODE_TEXT');
  },

  initDotLinks({ commit }) {
    commit('SET_DOT_LINKS');
  },

  setSelectedNode({ commit }, payload) {
    commit('SET_SELECTED_NODE', payload);
  },

  setSelectedLink({ commit }, payload) {
    commit('SET_SELECTED_LINK', payload);
  },

  setSelectedDot({ commit }, payload) {
    commit('SET_SELECTED_DOT', payload);
  },

  setSelectedTargetNodes({ commit }, payload) {
    commit('SET_SELECTED_TARGET_NODE', payload);
  },

  changeOnClickToTargetNodes({ commit }) {
    commit('CHANGE_ON_CLICK_TO_TARGET_NODES');
  },

  changeOnClickToDefault({ commit }) {
    commit('CHANGE_ON_CLICK_TO_DEFAULT');
  },

  addSelectedTargetNodes({ commit }, payload) {
    commit('ADD_SELECTED_TARGET_NODE', payload);
  },

  insertNode({ commit }, payload) {
    commit('ADD_NODE', payload);
    commit('SET_NODE');
    commit('SET_NODE_TEXT');
    commit('REFRESH_SELECTION');
  },

  insertLink({ commit }, payload) {
    commit('ADD_LINK', payload);
    commit('SET_LINK');
  },

  insertBinding({ commit }, payload) {
    commit('ADD_BINDING', payload);
    commit('SET_DOT');
    commit('SET_DOT_LINKS');
  },

  editNodeDescription({ commit }, payload) {
    commit('EDIT_NODE_TEXT', payload);
    commit('SET_NODE_TEXT');
  },

  removeNode({ commit }, payload) {
    commit('REMOVE_NODE', payload);
    commit('SET_SELECTED_NODE', null);
    commit('SET_NODE');
    commit('SET_NODE_TEXT');
    commit('SET_LINK');
    commit('SET_DOT');
    commit('SET_DOT_LINKS');
  },

  removeLink({ commit }, payload) {
    commit('REMOVE_LINK', payload);
    commit('SET_LINK');
    commit('SET_DOT');
    commit('SET_DOT_LINKS');
  },

  removeBinding({ commit }, payload) {
    commit('REMOVE_BINDING', payload);
    commit('SET_DOT');
    commit('SET_DOT_LINKS');
  },
};
