import actions from '@/store/modules/d3store/actions';
import getters from '@/store/modules/d3store/getters';
import mutations from '@/store/modules/d3store/mutations';

export const d3store = {
  state: () => ({
    svg: null,
    dataset: {},
    link: null,
    node: null,
    dot: null,
    dotLinks: null,
    selectedNode: null,
    selectedTargetNodes: [],
    selectedLink: null,
    selectedDot: null,
    possibleAggregations: [],
    aggregationRects: [],
    adjacencyList: {},
    activeAggregations: {},
  }),
  mutations,
  actions,
  getters,
};
