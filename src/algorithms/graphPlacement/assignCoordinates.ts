import { MARGIN_HORIZONTAL, MARGIN_VERTICAL, NODE_SIZE } from '@/utils/consts';
import _ from 'lodash';
export function assignCoordinates(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>,
  reversedAdjacencyList: Record<number, Array<number>>,
  dummyVerticesArray: Array<number>,
  pathsWithDummyVertices: Record<number, Array<number>>
): Record<number, { x: number; y: number }> {
  const coordinates = getInitialCoordinates(layers, dummyVerticesArray);

  const vertexList: Array<number> = Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .sort((a, b) => a - b);

  const alignment = getCoordinates(
    layers,
    vertexList,
    reversedAdjacencyList,
    adjacencyList,
    dummyVerticesArray
  );
  alignment.map((x, i) => (coordinates[i].x = x));

  return coordinates;
}

function preprocessing(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>,
  reversedAdjacencyList: Record<number, Array<number>>,
  dummyVerticesArray: Array<number>
): Array<Array<number>> {
  const markedSegments: Array<Array<number>> = [];
  for (let i = 1; i < layers.length - 1; i++) {
    let k0 = 0;
    let l = 1;
    for (let l1 = 0; l1 < layers[i + 1].length; l1++) {
      const v_i1_l1 = layers[i + 1][l1];
      let isIncidentToInnerSegment = false;
      if (dummyVerticesArray.includes(v_i1_l1)) {
        const innerVertex = layers[i].find((e) =>
          adjacencyList[v_i1_l1].includes(e)
        );
        if (innerVertex && dummyVerticesArray.includes(innerVertex)) {
          isIncidentToInnerSegment = true;
        }
      }
      if (l1 === layers[i + 1].length || isIncidentToInnerSegment) {
        let k1: number = layers[i].length;
        if (isIncidentToInnerSegment) {
          k1 = layers[i].indexOf(adjacencyList[v_i1_l1][0]);
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
  reversedAdjacencyList: Record<number, Array<number>>,
  directions: Array<string>
): { root: Array<number>; align: Array<number> } {
  const root: Array<number> = _.cloneDeep(vertexList);
  const align: Array<number> = _.cloneDeep(vertexList);

  const innerFunction = (i: number, k: number, r: number): number => {
    const vik = layers[i][k];
    if (reversedAdjacencyList[vik].length) {
      const upperNeighbours = reversedAdjacencyList[vik];
      for (
        let m = Math.floor((upperNeighbours.length - 1) / 2);
        m <= Math.ceil((upperNeighbours.length - 1) / 2);
        m++
      ) {
        if (align[vik] === vik) {
          const um = upperNeighbours[m];
          const umEdge = [um, vik];
          const umPos = layers[i + 1].indexOf(um);
          if (
            !markedSegments.some((a) => a.every((v, i) => v === umEdge[i])) &&
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
    return r;
  };

  if (directions[0] === 'up' && directions[1] === 'left') {
    for (let i = 0; i < layers.length; i++) {
      let r = 0;
      for (let k = 0; k < layers[i].length; k++) {
        r = innerFunction(i, k, r);
      }
    }
  } else if (directions[0] === 'up' && directions[1] === 'right') {
    for (let i = 0; i < layers.length; i++) {
      let r = 0;
      for (let k = layers[i].length - 1; k >= 0; k--) {
        r = innerFunction(i, k, r);
      }
    }
  } else if (directions[0] === 'down' && directions[1] === 'left') {
    for (let i = layers.length - 1; i >= 0; i--) {
      let r = 0;
      for (let k = 0; k < layers[i].length; k++) {
        r = innerFunction(i, k, r);
      }
    }
  } else {
    for (let i = layers.length - 1; i >= 0; i--) {
      let r = 0;
      for (let k = layers[i].length - 1; k >= 0; k--) {
        r = innerFunction(i, k, r);
      }
    }
  }

  return { root, align };
}

function horizontalCompaction(
  vertexList: Array<number>,
  root: Array<number>,
  align: Array<number>,
  layers: Array<Array<number>>
): Array<any> {
  const minSeparation = MARGIN_HORIZONTAL;
  const sink: Array<any> = _.cloneDeep(vertexList);
  const shift: Array<number> = vertexList.map((e) => Infinity);
  const x: Array<any> = vertexList.map((e) => undefined);

  const pos = (v: number) =>
    layers.find((layer) => layer.includes(v))?.indexOf(v) || -1;

  const pred = (v: number) => {
    const layer = layers.find((layer) => layer.includes(v));
    if (layer) {
      return layer[pos(v) - 1];
    }
    return -1;
  };

  const placeBlock = (v: number) => {
    if (x[v] == undefined) {
      x[v] = 0;
      let w = v;
      do {
        if (pos(w) > 0) {
          const u = root[pred(w)];
          placeBlock(u);
          if (sink[v] == v) sink[v] = sink[u];
          if (sink[v] != sink[u]) {
            shift[sink[u]] = Math.min(
              shift[sink[u]],
              x[v] - x[u] - minSeparation
            );
          } else x[v] = Math.max(x[v], x[u] + minSeparation);
        }
        w = align[w];
      } while (w != v);
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
  layers: Array<Array<number>>,
  vertexList: Array<number>,
  reversedAdjacencyList: Record<number, Array<number>>,
  adjacencyList: Record<number, Array<number>>,
  dummyVerticesArray: Array<number>
) {
  const preprocessed = preprocessing(
    layers,
    adjacencyList,
    reversedAdjacencyList,
    dummyVerticesArray
  );
  let xCoordinates: Array<Array<any>> = [];
  for (const vertical of ['up', 'down']) {
    for (const horizontal of ['left', 'right']) {
      const { root, align } = verticalAlignment(
        layers,
        preprocessed,
        vertexList,
        reversedAdjacencyList,
        [vertical, horizontal]
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // const xMin = Math.abs(Math.min(...x.filter((e) => !isNaN(e))));
      // xCoordinates.push(x.map((e) => (e ? e + xMin : e)));
      xCoordinates.push(horizontalCompaction(vertexList, root, align, layers));
    }
  }
  const xMin = Math.abs(
    Math.min(...xCoordinates.flat().filter((e) => !isNaN(e)))
  );
  xCoordinates = xCoordinates.map((xList) =>
    xList.map((e) => (e ? e + xMin : e))
  );

  const result: Array<number> = [];
  for (let i = 0; i < vertexList.length; i++) {
    const candidates = xCoordinates
      .map((list) => list[i])
      .filter((e) => !isNaN(e))
      .sort((a, b) => a - b);
    const k = candidates.length - 1;
    result.push(
      (candidates[Math.floor((k + 1) / 2)] +
        candidates[Math.ceil((k + 1) / 2)]) /
        2
    );
  }

  return result.map((e) => e + (NODE_SIZE + 10));
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
