import _ from 'lodash';

export function sortLayers(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>
): Array<Array<number>> {
  const sortedLayers = _.cloneDeep(layers);
  for (let i = 0; i < layers.length - 1; i++) {
    sortedLayers[i + 1] = layersQuicksort(
      sortedLayers[i],
      sortedLayers[i + 1],
      adjacencyList
    );
  }
  for (let i = layers.length - 1; i > 0; i--) {
    sortedLayers[i - 1] = layersQuicksort(
      sortedLayers[i],
      sortedLayers[i - 1],
      adjacencyList
    );
  }
  for (let i = 0; i < layers.length - 1; i++) {
    sortedLayers[i + 1] = layersQuicksort(
      sortedLayers[i],
      sortedLayers[i + 1],
      adjacencyList
    );
  }
  return sortedLayers;
}

function layersQuicksort(
  layer1: Array<number>,
  layer2: Array<number>,
  adjacencyList: Record<number, Array<number>>
): Array<number> {
  const a = [...layer2];
  if (a.length < 2) return a;
  const pivotIndex = Math.floor(layer2.length / 2);
  const pivot = a[pivotIndex];
  const [left, right] = a.reduce(
    (acc, vertexIndex, i) => {
      const valLeft = numberOfCrossings(
        layer1,
        layer2,
        adjacencyList,
        vertexIndex,
        pivot
      );
      const valRight = numberOfCrossings(
        layer1,
        layer2,
        adjacencyList,
        pivot,
        vertexIndex
      );
      if (valLeft <= valRight && i != pivotIndex) {
        acc[0].push(vertexIndex);
      } else if (valLeft > valRight) {
        acc[1].push(vertexIndex);
      }
      return acc;
    },
    [[], []] as [number[], number[]]
  );
  return [
    ...layersQuicksort(layer1, left, adjacencyList),
    pivot,
    ...layersQuicksort(layer1, right, adjacencyList),
  ];
}

function numberOfCrossings(
  layer1: Array<number>,
  layer2: Array<number>,
  adjacencyList: Record<number, Array<number>>,
  u: number,
  v: number
): number {
  let sum = 0;
  for (const k of adjacencyList[u]) {
    for (const l of adjacencyList[v]) {
      if (layer1.includes(l) && layer1.includes(k) && k !== l) {
        sum += onYourLeft(l, k, layer1);
      }
    }
  }
  return sum;
}

function onYourLeft(v1: number, v2: number, layer: Array<number>): number {
  return layer.indexOf(v1) < layer.indexOf(v2) ? 1 : 0;
}
