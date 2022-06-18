import { MARGIN, NODE_SIZE } from '@/utils/consts';
export function assignCoordinates(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>
): Record<number, { x: number; y: number }> {
  const coordinates = getInitialCoordinates(layers);
  Object.keys(coordinates).map((vertex) => {
    console.log(
      vertex,
      numberOfEdgesIntersectedWithNodes(
        parseInt(vertex),
        adjacencyList,
        coordinates
      )
    );
  });
  return coordinates;
}

function getInitialCoordinates(
  layers: Array<Array<number>>
): Record<number, { x: number; y: number }> {
  const initialCoordinates = {};
  layers.map((layer, layerIndex) => {
    layer.map((vertex, vertexIndex) => {
      initialCoordinates[vertex] = {
        x: (vertexIndex + 1) * MARGIN,
        y: (layerIndex + 1) * MARGIN,
      };
    });
  });
  return initialCoordinates;
}

function numberOfEdgesIntersectedWithNodes(
  vertex: number,
  adjacencyList: Record<number, Array<number>>,
  coordinates: Record<number, { x: number; y: number }>
): number {
  let counter = 0;
  adjacencyList[vertex].map((vertex2) => {
    Object.keys(coordinates).map((center) => {
      if (
        parseInt(center) !== vertex &&
        parseInt(center) !== vertex2 &&
        isLineIntersectedWithCircle(
          coordinates[vertex],
          coordinates[vertex2],
          coordinates[center]
        )
      ) {
        counter += 1;
      }
    });
  });
  return counter;
}

function isLineIntersectedWithCircle(
  point1: { x: number; y: number },
  point2: { x: number; y: number },
  center: { x: number; y: number }
): boolean {
  const distanceVectorFromPoint1ToPoint2 = {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  };

  const distanceVectorFromPoint1ToCenter = {
    x: point1.x - center.x,
    y: point1.y - center.y,
  };

  const line = {
    a:
      distanceVectorFromPoint1ToPoint2.x * distanceVectorFromPoint1ToPoint2.x +
      distanceVectorFromPoint1ToPoint2.y * distanceVectorFromPoint1ToPoint2.y,
    b:
      distanceVectorFromPoint1ToPoint2.x * distanceVectorFromPoint1ToCenter.x +
      distanceVectorFromPoint1ToPoint2.y * distanceVectorFromPoint1ToCenter.y,
    c:
      distanceVectorFromPoint1ToCenter.x * distanceVectorFromPoint1ToCenter.x +
      distanceVectorFromPoint1ToCenter.y * distanceVectorFromPoint1ToCenter.y -
      NODE_SIZE * NODE_SIZE,
  };
  return (
    line.b * line.b >= line.a * line.c &&
    (-line.b <= line.a || line.c + line.b + line.b + line.a <= 0) &&
    (line.b <= 0 || line.c <= 0)
  );
}
