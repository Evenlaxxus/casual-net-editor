import _ from 'lodash';
import { Dot, Link, Node } from '@/utils/types';

export function removeCycles(
  adjacencyList: Record<number, Array<number>>,
  incomingAdjacencyList: Record<number, Array<number>>
): Record<number, Array<number>> {
  const acyclic: Record<number, Array<number>> = {};
  Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .map((e) => (acyclic[e] = []));

  let incoming: Record<number, Array<number>> = _.cloneDeep(
    incomingAdjacencyList
  );
  let outgoing: Record<number, Array<number>> = _.cloneDeep(adjacencyList);

  Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .sort(
      (a, b) => adjacencyList[b].flat().length - adjacencyList[a].flat().length
    )
    .map((vertex) => {
      if (outgoing[vertex].length >= incoming[vertex].length) {
        acyclic[vertex] = [...acyclic[vertex], ...outgoing[vertex]];
      } else {
        incoming[vertex].map((childVertex) => {
          acyclic[childVertex] = [...acyclic[childVertex], vertex];
        });
      }

      const incomingUpdated = _.cloneDeep(incoming);
      const outgoingUpdated = _.cloneDeep(outgoing);

      incomingUpdated[vertex] = [];
      outgoingUpdated[vertex] = [];

      outgoing[vertex].map((childVertex) => {
        incomingUpdated[childVertex] = incoming[childVertex].filter(
          (v) => v !== vertex
        );
      });

      incoming[vertex].map((childVertex) => {
        outgoingUpdated[childVertex] = outgoing[childVertex].filter(
          (v) => v !== vertex
        );
      });

      incoming = _.cloneDeep(incomingUpdated);
      outgoing = _.cloneDeep(outgoingUpdated);
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
