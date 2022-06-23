import { coffmanGraham } from '@/algorithms/graphPlacement/assignLayers';
import { sortLayers } from '@/algorithms/graphPlacement/sortLayers';
import { assignCoordinates } from '@/algorithms/graphPlacement/assignCoordinates';
import { Dot, Link, Node } from '@/utils/types';
import { addDummyVertices } from '@/algorithms/graphPlacement/dummyVertices';
import {
  removeCycles,
  restoreCycles,
} from '@/algorithms/graphPlacement/removeCycles';

export function graphPlacement(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>,
  W: number
) {
  const { adjacencyList, incomingAdjacencyList } = createAdjacencyList(graph);

  const acyclicAdjacencyList = removeCycles(
    adjacencyList,
    incomingAdjacencyList
  );

  const layers = coffmanGraham(acyclicAdjacencyList, W);

  const {
    layersWithDummyVertices,
    dummyVertices,
    adjacencyListWithDummyVertices,
  } = addDummyVertices(layers, acyclicAdjacencyList);

  const sortedLayers = sortLayers(
    layersWithDummyVertices,
    adjacencyListWithDummyVertices
  );

  const coordinates = assignCoordinates(
    sortedLayers,
    adjacencyListWithDummyVertices
  );

  const dataset = mapToDataset(
    coordinates,
    graph,
    acyclicAdjacencyList,
    dummyVertices
  );

  return restoreCycles(dataset, adjacencyList);
}

function createAdjacencyList(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>
): {
  adjacencyList: Record<number, Array<number>>;
  incomingAdjacencyList: Record<number, Array<number>>;
} {
  const adjacencyList = {};
  const incomingAdjacencyList = {};
  graph.map((node) => {
    adjacencyList[node.id] = [...new Set(node.outgoing.flat())];
  });
  graph.map((node) => {
    incomingAdjacencyList[node.id] = [...new Set(node.incoming.flat())];
  });
  return { adjacencyList, incomingAdjacencyList };
}

function mapToDataset(
  coordinates: Record<number, { x: number; y: number }>,
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>,
  adjacencyList: Record<number, Array<number>>,
  dummyVertices: Record<number, Record<number, Array<number>>>
): {
  nodes: Array<Node>;
  links: Array<Link>;
  dots: Array<Dot>;
  dotsLinks: Array<Link>;
} {
  const dataset: {
    nodes: Array<Node>;
    links: Array<Link>;
    dots: Array<Dot>;
    dotsLinks: Array<Link>;
  } = {
    nodes: [],
    links: [],
    dots: [],
    dotsLinks: [],
  };
  let linkId = 1;
  let dotId = 1;

  graph.map((vertex) => {
    dataset.nodes.push({
      id: vertex.id,
      x: coordinates[vertex.id].x,
      y: coordinates[vertex.id].y,
      text: vertex.name,
    });
    adjacencyList[vertex.id].map((item) => {
      dataset.links.push({
        id: linkId,
        source: vertex.id,
        target: item,
        bendPoints:
          dummyVertices[vertex.id] && dummyVertices[vertex.id][item]
            ? dummyVertices[vertex.id][item].map((e) => [
                coordinates[e].x,
                coordinates[e].y,
              ])
            : [],
      });
      linkId += 1;
    });

    let row = 1;
    vertex.outgoing.map((target) => {
      target.map((targetVertex) => {
        dataset.dots.push({
          id: dotId,
          source: vertex.id,
          target: targetVertex,
          row: row,
        });
        dotId += 1;
      });
      row += 1;
    });

    row = 1;
    vertex.incoming.map((target) => {
      target.map((targetVertex) => {
        dataset.dots.push({
          id: dotId,
          source: vertex.id,
          target: targetVertex,
          row: row,
        });
        dotId += 1;
      });
      row += 1;
    });
  });
  return dataset;
}
