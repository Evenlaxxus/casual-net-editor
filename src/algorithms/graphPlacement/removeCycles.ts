import _ from 'lodash';

export function removeCycles(
  adjacencyList: Record<number, Array<number>>,
  incomingAdjacencyList: Record<number, Array<number>>
): Record<number, Array<number>> {
  const acyclic: Record<number, Array<number>> = {};
  const incoming: Record<number, Array<number>> = _.cloneDeep(adjacencyList);
  const outgoing: Record<number, Array<number>> = _.cloneDeep(
    incomingAdjacencyList
  );
  Object.keys(adjacencyList).map((vertex) => {
    if (
      incoming[parseInt(vertex)].length >= outgoing[parseInt(vertex)].length
    ) {
      acyclic[vertex] = incoming[vertex];
    } else {
      acyclic[vertex] = outgoing[vertex];
    }
    Object.keys(adjacencyList).map((e) => {
      incoming[parseInt(e)] = incoming[e].filter((v) => v !== parseInt(vertex));
      outgoing[parseInt(e)] = outgoing[e].filter((v) => v !== parseInt(vertex));
    });
  });
  Object.keys(adjacencyList).map((vertex) => {
    adjacencyList[vertex].map((childVertex) => {
      if (
        !acyclic[vertex].includes(childVertex) &&
        !acyclic[childVertex].includes(parseInt(vertex))
      ) {
        acyclic[childVertex].push(parseInt(vertex));
      }
    });
  });
  return acyclic;
}
