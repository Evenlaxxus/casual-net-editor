import { coffmanGraham } from '@/algorithms/graphPlacement/assignLayers';
import { sortLayers } from '@/algorithms/graphPlacement/sortLayers';
import { assignCoordinates } from '@/algorithms/graphPlacement/assignCoordinates';
import { Dot, Link, Node } from '@/utils/types';

export function graphPlacement(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>,
  W: number
) {
  //TODO remove cycles
  const adjacencyList = createAdjacencyList(graph);

  const layers = coffmanGraham(adjacencyList, W);

  const sortedLayers = sortLayers(layers, adjacencyList);

  const coordinates = assignCoordinates(sortedLayers, adjacencyList);

  return mapToDataset(coordinates, graph, adjacencyList);
}

function createAdjacencyList(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>
): Record<number, Array<number>> {
  const adjacencyList = {};
  graph.map((node) => {
    adjacencyList[node.id] = [...new Set(node.outgoing.flat())];
  });
  return adjacencyList;
}

function mapToDataset(
  coordinates: Record<number, { x: number; y: number }>,
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>,
  adjacencyList: Record<number, Array<number>>
): {
  nodes: Array<Node>;
  links: Array<Link>;
  dots: Array<Dot>;
  dotLinks: Array<Link>;
} {
  const dataset: {
    nodes: Array<Node>;
    links: Array<Link>;
    dots: Array<Dot>;
    dotLinks: Array<Link>;
  } = {
    nodes: [],
    links: [],
    dots: [],
    dotLinks: [],
  };
  let linkId = 1;

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
      });
      linkId += 1;
    });
  });
  return dataset;
}
