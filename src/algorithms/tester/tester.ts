import { Dataset, Link } from '@/utils/types';
import { NODE_SIZE } from '@/utils/consts';

export function test(
  dataset: Dataset,
  svg
): {
  edgeCrossings: number;
  graphSize: number;
  totalEdgeLength: number;
  maxEdgeLength: number;
  proportions: number;
} {
  const edgeCrossings = getEdgeCrossings(dataset);
  const graphSize = getGraphSize(dataset);
  const totalEdgeLength = getTotalEdgeLength(dataset, svg);
  const maxEdgeLength = getMaxEdgeLength(dataset, svg);
  const proportions = getProportions(dataset);

  return {
    edgeCrossings,
    graphSize,
    totalEdgeLength,
    maxEdgeLength,
    proportions,
  };
}

function getEdgeCrossings(dataset: Dataset) {
  const allLines: Array<Array<Array<number>>> = [];

  dataset.links.map((link) => {
    const source = dataset.nodes.find((node) => node.id === link.source) || {
      x: 0,
      y: 0,
    };
    const target = dataset.nodes.find((node) => node.id === link.target) || {
      x: 0,
      y: 0,
    };
    if (link.bendPoints.length) {
      allLines.push(
        ...link.bendPoints.reduce(
          (lines, bendPoint, currentIndex, bendPoints) => {
            if (currentIndex < bendPoints.length - 1) {
              lines.push([bendPoint, bendPoints[currentIndex + 1]]);
            } else {
              lines.push([bendPoint, [target.x, target.y]]);
            }
            return lines;
          },
          [[[source.x, source.y], link.bendPoints[0]]]
        )
      );
    } else {
      allLines.push([
        [source.x, source.y],
        [target.x, target.y],
      ]);
    }
  });
  let crossings = 0;

  for (let i = 0; i < allLines.length; i++) {
    for (let j = 0; j < allLines.length; j++) {
      if (i !== j) crossings += linesIntersection(allLines[i], allLines[j]);
    }
  }

  return crossings / 2;
}

function getGraphSize(dataset: Dataset) {
  const { maxY, maxX, minX, minY } = getBoundingCoordinates(dataset);

  return (maxX - minX + NODE_SIZE) * (maxY - minY + NODE_SIZE);
}

function getTotalEdgeLength(dataset: Dataset, svg) {
  return dataset.links.reduce(
    (total, link) => total + getEdgeLength(link, svg),
    0
  );
}

function getMaxEdgeLength(dataset: Dataset, svg) {
  return dataset.links.reduce((max, link) => {
    const length = getEdgeLength(link, svg);
    return length > max ? length : max;
  }, 0);
}

function getProportions(dataset: Dataset) {
  const { maxY, maxX, minX, minY } = getBoundingCoordinates(dataset);

  const xFace = maxX - minX + NODE_SIZE;
  const yFace = maxY - minY + NODE_SIZE;

  if (xFace > yFace) {
    return xFace / yFace;
  } else {
    return yFace / xFace;
  }
}

function getBoundingCoordinates(dataset: Dataset): {
  maxY: number;
  maxX: number;
  minX: number;
  minY: number;
} {
  const maxY = dataset.nodes.reduce(
    (max, val) => (val.y > max ? val.y : max),
    0
  );
  const minY = dataset.nodes.reduce(
    (min, val) => (val.y < min ? val.y : min),
    maxY
  );
  const maxX = dataset.nodes.reduce(
    (max, val) => (val.x > max ? val.x : max),
    0
  );
  const minX = dataset.nodes.reduce(
    (min, val) => (val.x < min ? val.x : min),
    maxY
  );
  return {
    maxY,
    maxX,
    minX,
    minY,
  };
}

function getEdgeLength(edge: Link, svg): number {
  const link = svg.select('path#link' + edge.id || '').node();

  return (link as SVGGeometryElement).getTotalLength();
}

function linesIntersection(line1, line2): number {
  const det =
    (line1[1][0] - line1[0][0]) * (line2[1][1] - line2[0][1]) -
    (line2[1][0] - line2[0][0]) * (line1[1][1] - line1[0][1]);
  if (det === 0) {
    return 0;
  } else {
    const lambda =
      ((line2[1][1] - line2[0][1]) * (line2[1][0] - line1[0][0]) +
        (line2[0][0] - line2[1][0]) * (line2[1][1] - line1[0][1])) /
      det;
    const gamma =
      ((line1[0][1] - line1[1][1]) * (line2[1][0] - line1[0][0]) +
        (line1[1][0] - line1[0][0]) * (line2[1][1] - line1[0][1])) /
      det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1 ? 1 : 0;
  }
}
