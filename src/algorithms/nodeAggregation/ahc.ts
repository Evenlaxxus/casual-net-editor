import _ from 'lodash';
import Graph from 'node-dijkstra';

export function ahc(
  adjacencyObject: Record<number, Array<number>>
): Array<Array<number>> {
  const graph = new Graph();
  const vertexList = Object.keys(adjacencyObject).map((e) => parseInt(e));
  const result: Array<Array<number>> = [];
  vertexList.map((v) => {
    graph.addNode(v.toString(), adjacencyObject[v]);
  });

  const getDistance = (a: string, b: string): number =>
    graph.path(a, b)?.length || 0;

  const getDistanceMatrix = (array: Array<number>): Array<Array<number>> =>
    array.map((v) => array.map((u) => getDistance(v.toString(), u.toString())));

  const distanceMatrix: Array<Array<number>> = getDistanceMatrix(vertexList);

  const getLinkage = (a: Array<number>, b: Array<number>) => {
    let linkage = distanceMatrix[a[0]][b[0]];
    a.map((node1) => {
      b.map((node2) => {
        linkage = Math.min(linkage, distanceMatrix[node1][node2]);
      });
    });
    return linkage;
  };

  let finalGroups: Array<Array<number>> = vertexList.map((e) => [e]);
  while (finalGroups.length > 1) {
    const groups: Array<Array<number>> = _.cloneDeep(finalGroups);
    let minLinkage = getLinkage(groups[0], groups[1]);
    let candidates = [0, 1];
    groups.map((group1, index1) => {
      groups.map((group2, index2) => {
        if (index1 !== index2) {
          const linkage = getLinkage(group1, group2);
          if (minLinkage > linkage) {
            minLinkage = linkage;
            candidates = [index1, index2];
          }
        }
      });
    });

    finalGroups = [
      ...groups.filter((_, index) => !candidates.includes(index)),
      [...groups[candidates[0]], ...groups[candidates[1]]],
    ];
    result.push([...groups[candidates[0]], ...groups[candidates[1]]]);
  }
  return result;
}
