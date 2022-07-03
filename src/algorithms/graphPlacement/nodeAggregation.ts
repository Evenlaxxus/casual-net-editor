import dijkstra from 'dijkstrajs';
import { clusterData } from '@greenelab/hclust';

export function getAllPossibleAggregations(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>
) {
  const adjacencyList = {};
  const ids = graph.map((e) => [e.id]);
  graph.map((node) => {
    adjacencyList[node.id] = [
      ...new Set([...node.incoming.flat(), ...node.outgoing.flat()]),
    ].reduce(
      (obj, item) => ({
        ...obj,
        [item]: 1,
      }),
      {}
    );
  });

  const nodeDistance = (arrayA: Array<number>, arrayB: Array<number>): number =>
    dijkstra.find_path(adjacencyList, arrayA[0], arrayB[0]).length;

  // const nodeLinkage = (
  //   setA: Array<number>,
  //   setB: Array<number>,
  //   distances: Array<Array<number>>
  // ): number => {
  //   let distance = 0;
  //   for (const a of setA) {
  //     for (const b of setB) distance += distances[a][b];
  //   }
  // };

  const { clusters, distances, order, clustersGivenK } = clusterData({
    data: ids,
    distance: nodeDistance,
  });

  console.log(clustersGivenK);
}
