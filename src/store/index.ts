import { createStore } from 'vuex';
import { d3store, datasetStore } from './modules';

export default createStore({
  modules: { d3store, datasetStore },
});
