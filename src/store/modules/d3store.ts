import actions from '@/store/modules/d3store/actions';
import getters from '@/store/modules/d3store/getters';
import mutations from '@/store/modules/d3store/mutations';

export const d3store = {
  state: () => ({
    svg: null,
    dataset: {
      nodes: [
        { id: 1, x: 233, y: 514, text: 'a' },
        { id: 2, x: 321, y: 386, text: 'b' },
        { id: 3, x: 543, y: 393, text: 'c' },
        { id: 4, x: 452, y: 561, text: 'd' },
        {
          id: 5,
          x: 373,
          y: 510,
          text: 'e',
        },
        { id: 6, x: 545, y: 465, text: 'f' },
      ],
      links: [
        { id: 1, source: 1, target: 5 },
        { id: 2, source: 4, target: 5 },
        { id: 3, source: 4, target: 6 },
        { id: 4, source: 3, target: 2 },
        { id: 5, source: 5, target: 2 },
        { id: 6, source: 1, target: 2 },
        { id: 7, source: 3, target: 4 },
      ],
      dots: [
        { id: 1, source: 1, target: 2, row: 1 },
        { id: 2, source: 1, target: 5, row: 1 },
        { id: 3, source: 1, target: 5, row: 2 },
      ],
      dotsLinks: [{ id: 1, source: 1, target: 2 }],
    },
    link: null,
    node: null,
    dot: null,
    nodeIdText: null,
    dotLinks: null,
    selectedNode: null,
    selectedTargetNodes: [],
    selectedLink: null,
    selectedDot: null,
  }),
  mutations,
  actions,
  getters,
};
