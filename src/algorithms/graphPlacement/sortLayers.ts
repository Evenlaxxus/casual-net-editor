export function sortLayers(
  layers: Array<Array<string>>,
  graph: Record<number, Array<number>>
) {
  const sortedLayers = layers;
  for (let i = 0; i < layers.length - 1; i++) {
    sortedLayers[i + 1] = layersQuicksort(
      sortedLayers[i],
      sortedLayers[i + 1],
      graph
    );
  }
  for (let i = layers.length - 1; i > 0; i--) {
    sortedLayers[i - 1] = layersQuicksort(
      sortedLayers[i],
      sortedLayers[i - 1],
      graph
    );
  }
}

function layersQuicksort(
  layer1: Array<string>,
  layer2: Array<string>,
  graph: Record<number, Array<number>>
): Array<string> {
  const output = layer2;
  const p = output[0];
  const q = output[1];
}

function numberOfCrossings(
  layer1: Array<string>,
  layer2: Array<string>,
  graph: Record<number, Array<number>>,
  v1: string,
  v2: string
): number {
  let sum = 0;
  for (const k of graph[v1]) {
    for (const l of graph[v2]) {
      if (layer1.includes(v1) && layer1.includes(v2) && k !== l) {
        sum += onYourLeft(l, k, layer2);
      }
    }
  }
  return sum;
}

function onYourLeft(v1: string, v2: string, layer: Array<string>): number {
  return layer.indexOf(v1) < layer.indexOf(v2) ? 1 : 0;
}
