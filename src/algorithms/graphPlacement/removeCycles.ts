import _ from 'lodash';
import { Dot, Link, Node } from '@/utils/types';

export function removeCycles(
  adjacencyList: Record<number, Array<number>>,
  incomingAdjacencyList: Record<number, Array<number>>
): Record<number, Array<number>> {
  const acyclic: Record<number, Array<number>> = {};
  const incoming: Record<number, Array<number>> = _.cloneDeep(adjacencyList);
  const outgoing: Record<number, Array<number>> = _.cloneDeep(
    incomingAdjacencyList
  );
  Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .map((vertex) => {
      if (incoming[vertex].length >= outgoing[vertex].length) {
        acyclic[vertex] = incoming[vertex];
      } else {
        acyclic[vertex] = outgoing[vertex];
      }
      Object.keys(adjacencyList)
        .map((e) => parseInt(e))
        .map((e) => {
          incoming[e] = incoming[e].filter((v) => v !== vertex);
          outgoing[e] = outgoing[e].filter((v) => v !== vertex);
        });
    });
  Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .map((vertex) => {
      adjacencyList[vertex].map((childVertex) => {
        if (
          !acyclic[vertex].includes(childVertex) &&
          !acyclic[childVertex].includes(vertex)
        ) {
          acyclic[childVertex].push(vertex);
        }
      });
    });
  return acyclic;
}

export function restoreCycles(
  dataset: {
    nodes: Array<Node>;
    links: Array<Link>;
    dots: Array<Dot>;
    dotsLinks: Array<Link>;
  },
  adjacencyList: Record<number, Array<number>>
): {
  nodes: Array<Node>;
  links: Array<Link>;
  dots: Array<Dot>;
  dotsLinks: Array<Link>;
} {
  return {
    ...dataset,
    links: dataset.links.map((link) =>
      adjacencyList[link.source].includes(link.target)
        ? link
        : {
            ...link,
            source: link.target,
            target: link.source,
            bendPoints: _.reverse(link.bendPoints),
          }
    ),
  };
}
