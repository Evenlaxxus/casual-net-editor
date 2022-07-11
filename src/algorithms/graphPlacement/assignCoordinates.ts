import { MARGIN_HORIZONTAL, MARGIN_VERTICAL, NODE_SIZE } from '@/utils/consts';
export function assignCoordinates(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>,
  dummyVerticesArray: Array<number>,
  pathsWithDummyVertices: Record<number, Array<number>>
): Record<number, { x: number; y: number }> {
  const coordinates = getInitialCoordinates(layers, dummyVerticesArray);

  const iterationCounter = 1000;

  console.log(pathsWithDummyVertices);

  // while (minimalIntersections < intersections || iterationCounter !== 0) {
  //   coordinates = getNextCoordinates(coordinates);
  //
  //   Object.keys(coordinates)
  //     .map((e) => parseInt(e))
  //     .map((coord) => {});
  //
  //   iterationCounter -= 1;
  // }

  return coordinates;
}

function getNextCoordinates(
  coordinates: Record<number, { x: number; y: number }>
): Record<number, { x: number; y: number }> {
  //TODO calculate coordinates
  return coordinates;
}

function getInitialCoordinates(
  layers: Array<Array<number>>,
  dummyVerticesArray: Array<number>
): Record<number, { x: number; y: number }> {
  const initialCoordinates = {};
  layers.map((layer, layerIndex) => {
    let distance = 0;
    layer.map((vertex) => {
      if (dummyVerticesArray.includes(vertex)) {
        distance += (1 / 4) * MARGIN_HORIZONTAL + NODE_SIZE / 2;
      } else {
        distance += MARGIN_HORIZONTAL;
      }
      initialCoordinates[vertex] = {
        x: distance,
        y: (layerIndex + 1) * MARGIN_VERTICAL,
      };
    });
  });
  return initialCoordinates;
}

function mse(a, b) {
  let error = 0;
  for (let i = 0; i < a.length; i++) {
    error += Math.pow(b[i] - a[i], 2);
  }
  return error / a.length;
}

// function numberOfEdgesIntersectedWithNodes(
//   vertex: number,
//   adjacencyList: Record<number, Array<number>>,
//   coordinates: Record<number, { x: number; y: number }>
// ): number {
//   let counter = 0;
//   adjacencyList[vertex].map((vertex2) => {
//     Object.keys(coordinates).map((center) => {
//       if (
//         parseInt(center) !== vertex &&
//         parseInt(center) !== vertex2 &&
//         isLineIntersectedWithCircle(
//           coordinates[vertex],
//           coordinates[vertex2],
//           coordinates[center]
//         )
//       ) {
//         counter += 1;
//       }
//     });
//   });
//   return counter;
// }
//
// function isLineIntersectedWithCircle(
//   point1: { x: number; y: number },
//   point2: { x: number; y: number },
//   center: { x: number; y: number }
// ): boolean {
//   const distanceVectorFromPoint1ToPoint2 = {
//     x: point2.x - point1.x,
//     y: point2.y - point1.y,
//   };
//
//   const distanceVectorFromPoint1ToCenter = {
//     x: point1.x - center.x,
//     y: point1.y - center.y,
//   };
//
//   const line = {
//     a:
//       distanceVectorFromPoint1ToPoint2.x * distanceVectorFromPoint1ToPoint2.x +
//       distanceVectorFromPoint1ToPoint2.y * distanceVectorFromPoint1ToPoint2.y,
//     b:
//       distanceVectorFromPoint1ToPoint2.x * distanceVectorFromPoint1ToCenter.x +
//       distanceVectorFromPoint1ToPoint2.y * distanceVectorFromPoint1ToCenter.y,
//     c:
//       distanceVectorFromPoint1ToCenter.x * distanceVectorFromPoint1ToCenter.x +
//       distanceVectorFromPoint1ToCenter.y * distanceVectorFromPoint1ToCenter.y -
//       NODE_SIZE * NODE_SIZE,
//   };
//   return (
//     line.b * line.b >= line.a * line.c &&
//     (-line.b <= line.a || line.c + line.b + line.b + line.a <= 0) &&
//     (line.b <= 0 || line.c <= 0)
//   );
// }
