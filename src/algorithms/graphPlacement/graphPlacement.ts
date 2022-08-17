import { coffmanGraham } from '@/algorithms/graphPlacement/assignLayers';
import { sortLayers } from '@/algorithms/graphPlacement/sortLayers';
import { assignCoordinates } from '@/algorithms/graphPlacement/assignCoordinates';
import { Dot, Link, Node } from '@/utils/types';
import { addDummyVertices } from '@/algorithms/graphPlacement/dummyVertices';
import {
  removeCycles,
  restoreCycles,
} from '@/algorithms/graphPlacement/removeCycles';
import { createAdjacencyList, permutations } from '@/utils/helpers';

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
    pathsWithDummyVertices,
    dummyVerticesArray,
  } = addDummyVertices(layers, acyclicAdjacencyList);

  const reversedAdjacencyListWithDummyVertices: Record<
    number,
    Array<number>
  > = {};

  Object.keys(adjacencyListWithDummyVertices)
    .map((e) => parseInt(e))
    .map((u) => {
      adjacencyListWithDummyVertices[u].map((v) => {
        if (reversedAdjacencyListWithDummyVertices[v]) {
          reversedAdjacencyListWithDummyVertices[v] = [
            ...reversedAdjacencyListWithDummyVertices[v],
            u,
          ];
        } else {
          reversedAdjacencyListWithDummyVertices[v] = [u];
        }
      });
    });
  Object.keys(adjacencyListWithDummyVertices)
    .map((e) => parseInt(e))
    .map((u) => {
      if (!reversedAdjacencyListWithDummyVertices[u])
        reversedAdjacencyListWithDummyVertices[u] = [];
    });

  const sortedLayers = sortLayers(
    layersWithDummyVertices,
    adjacencyListWithDummyVertices
  );

  const coordinates = assignCoordinates(
    sortedLayers,
    adjacencyListWithDummyVertices,
    reversedAdjacencyListWithDummyVertices,
    dummyVerticesArray,
    pathsWithDummyVertices
  );

  const dataset = mapToDataset(
    coordinates,
    graph,
    acyclicAdjacencyList,
    dummyVertices
  );

  return {
    dataset: restoreCycles(dataset, adjacencyList),
    adjacencyList: adjacencyList,
  };
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
  let dotLinkId = 1;

  const dotArcs: Record<number, Array<Array<Dot>>> = {};

  graph.map((vertex) => {
    dotArcs[vertex.id] = [];

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
    vertex.outgoing.map(setDotsCallback);

    row = 1;
    vertex.incoming.map(setDotsCallback);

    function setDotsCallback(target) {
      const dotArc: Array<Dot> = [];
      target.map((targetVertex) => {
        const dot = {
          id: dotId,
          source: vertex.id,
          target: targetVertex,
          row: row,
        };
        dataset.dots.push(dot);
        dotArc.push(dot);
        dotId += 1;
      });
      dotArcs[vertex.id] = [...dotArcs[vertex.id], dotArc];
      row += 1;
    }
  });

  graph.map((vertex) => {
    dotArcs[vertex.id].map((dotArc) => {
      if (dotArc.length > 1) {
        const arcLinks: Array<Dot> = dotArcLocalSearch(
          dotArc,
          coordinates,
          dataset.links
        );
        for (let i = 0; i < arcLinks.length - 1; i += 1) {
          dataset.dotsLinks.push({
            id: dotLinkId,
            source: arcLinks[i].id,
            target: arcLinks[i + 1].id,
            bendPoints: [],
          });
          dotLinkId += 1;
        }
      }
    });
  });
  return dataset;
}

function dotArcLocalSearch(
  dotArc: Array<Dot>,
  coordinates: Record<number, { x: number; y: number }>,
  links: Array<Link>
): Array<Dot> {
  const arcPermutations = permutations(dotArc);
  let bestArc: Array<Dot> = arcPermutations[0];
  let bestDelta: number = calculateDelta(bestArc, coordinates, links);
  arcPermutations.map((permutation) => {
    const delta = calculateDelta(permutation, coordinates, links);

    if (delta < bestDelta) {
      bestArc = permutation;
      bestDelta = delta;
    }
  });
  return bestArc;
}

function calculateDelta(
  dotArc: Array<Dot>,
  coordinates: Record<number, { x: number; y: number }>,
  links: Array<Link>
): number {
  const targets: Array<{ x: number; y: number }> = dotArc.map((dot) => {
    let linkData = links.find(
      (e: Link) => e.source === dot.source && e.target === dot.target
    );
    if (!linkData) {
      linkData = links.find(
        (e: Link) => e.source === dot.target && e.target === dot.source
      );
    }
    if (linkData?.bendPoints.length)
      return { x: linkData.bendPoints[0][0], y: linkData.bendPoints[0][1] };
    // TODO fix later
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return coordinates[linkData.target];
  });

  let totalLength = 0;
  for (let i = 0; i < targets.length - 1; i++) {
    const xDiff: number = targets[i].x - targets[i + 1].x;
    const yDiff: number = targets[i].y - targets[i + 1].y;

    totalLength += Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }

  return totalLength;
}
