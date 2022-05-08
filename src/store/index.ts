import { createStore } from 'vuex';
import { d3store, datasetStore, toolbarStore } from './modules';

export default createStore({
  modules: { d3store, datasetStore, toolbarStore },
});
