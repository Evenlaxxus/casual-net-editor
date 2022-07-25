import { MARGIN_HORIZONTAL, MARGIN_VERTICAL, NODE_SIZE } from '@/utils/consts';
import _ from 'lodash';
import { max, min } from 'd3';
export function assignCoordinates(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>,
  reversedAdjacencyList: Record<number, Array<number>>,
  dummyVerticesArray: Array<number>,
  pathsWithDummyVertices: Record<number, Array<number>>
): Record<number, { x: number; y: number }> {
  const coordinates = getInitialCoordinates(layers, dummyVerticesArray);

  const iterationCounter = 1000;

  const vertexList: Array<number> = Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .sort();

  console.log(pathsWithDummyVertices);
  const preprocessed = preprocessing(
    layers,
    adjacencyList,
    reversedAdjacencyList
  );
  console.log('middle dupa', preprocessed);
  const step2 = verticalAlignment(
    layers,
    preprocessed,
    vertexList,
    reversedAdjacencyList
  );
  console.log(step2);
  //
  const step3 = horizontalCompaction(
    vertexList,
    step2.root,
    step2.align,
    layers
  );
  console.log('step3', step3);
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

function preprocessing(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>,
  reversedAdjacencyList: Record<number, Array<number>>
): Array<Array<number>> {
  const markedSegments: Array<Array<number>> = [];
  for (let i = 2; i < layers.length - 2; i++) {
    let k0 = 0;
    let l = 1;
    for (let l1 = 1; l1 < layers[i + 1].length; l1++) {
      if (
        l1 === layers[i + 1].length ||
        (adjacencyList[layers[i + 1][l1]].some((e) => layers[i].includes(e)) &&
          layers[i].some((e) => adjacencyList[e].includes(layers[i + 1][l1])))
      ) {
        let k1: number = layers[i].length;
        if (
          adjacencyList[layers[i + 1][l1]].some((e) => layers[i].includes(e)) &&
          layers[i].some((e) => adjacencyList[e].includes(layers[i + 1][l1]))
        ) {
          //TODO fix
          k1 = layers[i].indexOf(reversedAdjacencyList[layers[i + 1][l1]]);
        }
        while (l <= l1) {
          reversedAdjacencyList[layers[i + 1][l]].map((item) => {
            if (layers[i].indexOf(item) < k0 || layers[i].indexOf(item) > k1) {
              markedSegments.push([item, layers[i + 1][l]]);
            }
          });
          l += 1;
        }
        k0 = k1;
      }
    }
  }
  return markedSegments;
}

function verticalAlignment(
  layers: Array<Array<number>>,
  markedSegments: Array<Array<number>>,
  vertexList: Array<number>,
  reversedAdjacencyList: Record<number, Array<number>>
): { root: Array<number>; align: Array<number> } {
  const root: Array<number> = _.cloneDeep(vertexList);
  const align: Array<number> = _.cloneDeep(vertexList);

  for (let i = 1; i < layers.length; i++) {
    let r = 0;
    for (let k = 1; k < layers[i].length; k++) {
      const vik = layers[i][k];
      if (reversedAdjacencyList[vik].length) {
        const upperNeighbours = reversedAdjacencyList[vik];
        for (
          let m = Math.floor((upperNeighbours.length + 1) / 2);
          m < Math.ceil((upperNeighbours.length + 1) / 2);
          m++
        ) {
          if (align[vik] === vik) {
            const um = reversedAdjacencyList[vik][m];
            const umEdge = [um, vik];
            const umPos = layers[i - 1].indexOf(um);
            if (
              markedSegments.some((a) => a.every((v, i) => v === umEdge[i])) &&
              r < umPos
            ) {
              align[um] = vik;
              root[vik] = root[um];
              align[vik] = root[vik];
              r = umPos;
            }
          }
        }
      }
    }
  }
  return { root: root, align: align };
}

function horizontalCompaction(
  vertexList: Array<number>,
  root: Array<number>,
  align: Array<number>,
  layers: Array<Array<number>>
) {
  const minSeparation = 10;
  const sink: Array<any> = _.cloneDeep(vertexList);
  const shift: Array<number> = vertexList.map((e) => Infinity);
  const x: Array<any> = vertexList.map((e) => undefined);

  const pos = (v: number) =>
    layers.find((layer) => layer.includes(v))?.indexOf(v) || 0;

  const pred = (v: number) => {
    const layer = layers.find((layer) => layer.includes(v));
    if (layer) {
      return layer[pos(v) - 1];
    }
    return 0;
  };

  const placeBlock = (v: number) => {
    if (x[v] == undefined) {
      x[v] = 0;
      let w = v;
      while (w == v) {
        if (pos(w) > 1) {
          const u = root[pred(w)];
          placeBlock(u);
          if (sink[v] == v) sink[v] = sink[u];
          if (sink[v] != sink[u]) {
            shift[sink[u]] = Math.min(
              shift[sink[u]],
              x[v] - x[u] - minSeparation
            );
          } else x[v] = Math.max(x[v], x[u] + minSeparation);
          w = align[w];
        }
      }
    }
  };

  vertexList.map((v) => {
    if (root[v] == v) placeBlock(v);
  });

  vertexList.map((v) => {
    x[v] = x[root[v]];
    if (shift[sink[root[v]]] < Infinity) x[v] += shift[sink[root[v]]];
  });
  return x;
}

function getCoordinates(
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
