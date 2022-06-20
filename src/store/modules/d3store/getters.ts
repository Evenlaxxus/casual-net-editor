export default {
  svg: (state) => state.svg,
  dataset: (state) => state.dataset,
  link: (state) => state.link,
  node: (state) => state.node,
  dot: (state) => state.dot,
  nodeIdText: (state) => state.nodeIdText,
  dotLinks: (state) => state.dotLinks,
  selectedNode: (state) => state.selectedNode,
  selectedLink: (state) => state.selectedLink,
  selectedDot: (state) => state.selectedDot,
  selectedTargetNodes: (state) => state.selectedTargetNodes,
  getNodeById: (state) => (id) => state.svg.select(id),
};