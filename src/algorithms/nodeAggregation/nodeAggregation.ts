import { createAdjacencyList } from '@/utils/helpers';
import { ahc } from '@/algorithms/nodeAggregation/ahc';

export function getAllPossibleAggregations(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>
) {
  const { adjacencyList, incomingAdjacencyList } = createAdjacencyList(graph);
  const adjacencyObject = {};
  Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .map((e) => {
      adjacencyObject[e.toString()] = [
        ...new Set([...adjacencyList[e], ...incomingAdjacencyList[e]]),
      ].reduce(
        (obj, item) => ({
          ...obj,
          [item.toString()]: 1,
        }),
        {}
      );
    });

  return ahc(adjacencyObject);
}
