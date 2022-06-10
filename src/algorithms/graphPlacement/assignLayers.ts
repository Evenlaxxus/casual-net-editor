export function coffmanGraham(
  adjacencyList: Record<number, Array<number>>,
  W: number
): Array<Array<string>> {
  //TODO Transitive reduction

  const sortedGraph = topologicalSort(adjacencyList);

  return assignLayers(sortedGraph, W, adjacencyList);
}

function transitiveReduction(graph: Record<number, Array<number>>) {
  console.log('transitiveReduction');
}

function topologicalSort(
  graph: Record<number, Array<number>>
): Record<string, number> {
  const vertices = Object.keys(graph);
  const visited = {};
  const order = {};
  let i = vertices.length - 1;
  vertices.map((v) => {
    if (!visited[v]) {
      i = dfsSort(v, i, visited, order, graph);
    }
  });
  return order;
}

function dfsSort(v, i, visited, order, graph): number {
  visited[v] = true;
  const neighbors = graph[v];
  neighbors.map((neighbor) => {
    if (!visited[neighbor]) {
      i = dfsSort(neighbor, i, visited, order, graph);
    }
  });
  order[v] = i;
  return i - 1;
}

function assignLayers(
  sortedGraph: Record<string, number>,
  W: number,
  adjacencyList: Record<number, Array<number>>
): Array<Array<string>> {
  const layers: Array<Array<string>> = [[]];
  const used: Array<string> = [];
  const numberOfVertices = Object.keys(sortedGraph).length;

  while (used.length < numberOfVertices) {
    const u = Object.keys(sortedGraph).reduce((max, val) =>
      !used.includes(val) && sortedGraph[max] > sortedGraph[val] ? max : val
    );
    if (
      layers[layers.length - 1].length < W &&
      adjacencyList[u].every((node) =>
        layers.some((layer) => layer.includes(node))
      )
    ) {
      layers[layers.length - 1].push(u);
    } else {
      layers.push([u]);
    }
    used.push(u);
    delete sortedGraph[u];
  }
  return layers;
}
