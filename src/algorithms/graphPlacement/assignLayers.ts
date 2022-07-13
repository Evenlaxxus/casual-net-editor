export function coffmanGraham(
  adjacencyList: Record<number, Array<number>>,
  W: number
): Array<Array<number>> {
  const adjMatrix = adjacencyMatrix(adjacencyList);

  const closureMatrix = pathMatrix(adjMatrix);

  const reducedMatrix = transitiveReduction(closureMatrix);

  const reducedAdjacencyList = adjacencyListFromMatrix(reducedMatrix);

  const sortedGraph = topologicalSort(reducedAdjacencyList);

  return assignLayers(sortedGraph, W, reducedAdjacencyList);
}

function adjacencyListFromMatrix(
  adjacencyMatrix: Array<Array<number>>
): Record<number, Array<number>> {
  const adjacencyList = {};

  for (let i = 0; i < adjacencyMatrix.length; i++) {
    const indexes: number[] = [];
    for (let j = 0; j < adjacencyMatrix.length; j++) {
      if (adjacencyMatrix[i][j] === 1) indexes.push(j);
    }
    adjacencyList[i] = indexes;
  }
  return adjacencyList;
}

function adjacencyMatrix(
  adjacencyList: Record<number, Array<number>>
): Array<Array<number>> {
  const adjacencyMatrix: Array<Array<number>> = Object.keys(adjacencyList).map(
    () => Object.keys(adjacencyList).map(() => 0)
  );
  Object.keys(adjacencyList).map((vertex1) => {
    adjacencyList[vertex1].map((vertex2) => {
      adjacencyMatrix[vertex1][vertex2] = 1;
    });
  });
  return adjacencyMatrix;
}

function pathMatrix(
  adjacencyMatrix: Array<Array<number>>
): Array<Array<number>> {
  const pathMatrix: Array<Array<number>> = adjacencyMatrix;
  for (let k = 0; k < adjacencyMatrix.length; k++) {
    for (let i = 0; i < adjacencyMatrix.length; i++) {
      for (let j = 0; j < adjacencyMatrix.length; j++) {
        pathMatrix[i][j] |= pathMatrix[i][k] && pathMatrix[k][j];
      }
    }
  }
  return pathMatrix;
}

function transitiveReduction(
  adjacencyMatrix: Array<Array<number>>
): Array<Array<number>> {
  const reducedMatrix = adjacencyMatrix;
  for (let j = 0; j < adjacencyMatrix.length; ++j) {
    for (let i = 0; i < adjacencyMatrix.length; ++i) {
      if (adjacencyMatrix[i][j]) {
        for (let k = 0; k < adjacencyMatrix.length; ++k) {
          if (adjacencyMatrix[j][k]) adjacencyMatrix[i][k] = 0;
        }
      }
    }
  }
  return reducedMatrix;
}

function topologicalSort(
  graph: Record<number, Array<number>>
): Record<number, number> {
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
  sortedGraph: Record<number, number>,
  W: number,
  adjacencyList: Record<number, Array<number>>
): Array<Array<number>> {
  const layers: Array<Array<number>> = [[]];
  const used: Array<number> = [];
  const numberOfVertices = Object.keys(sortedGraph).length;

  while (used.length < numberOfVertices) {
    const u: number = Object.keys(sortedGraph)
      .map((e) => parseInt(e))
      .reduce((max, val) =>
        !used.includes(val) && sortedGraph[max] > sortedGraph[val] ? max : val
      );
    if (
      layers[layers.length - 1].length < W &&
      adjacencyList[u].every((node) =>
        [...layers]
          .splice(0, layers.length - 1)
          .some((layer) => layer.includes(node))
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
