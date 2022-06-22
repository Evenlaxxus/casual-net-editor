import _ from 'lodash';

export function addDummyVertices(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>
): {
  layersWithDummyVertices: Array<Array<number>>;
  dummyVertices: Record<number, Record<number, Array<number>>>;
  adjacencyListWithDummyVertices: Record<number, Array<number>>;
} {
  const dummyVertices: Record<number, Record<number, Array<number>>> = {
    ...Object.keys(adjacencyList).map(() => ({})),
  };
  const layersWithDummyVertices: Array<Array<number>> = _.cloneDeep(layers);
  const adjacencyListWithDummyVertices: Record<
    number,
    Array<number>
  > = _.cloneDeep(adjacencyList);

  let newVertexId: number =
    Object.keys(adjacencyList).reduce(
      (max, val) => (max > parseInt(val) ? max : parseInt(val)),
      0
    ) + 1;
  Object.keys(adjacencyList).map((vertex) => {
    adjacencyList[parseInt(vertex)].map((childVertex) => {
      const childVertexLayer = layers
        .map((layer) => layer.some((e) => e === childVertex))
        .indexOf(true);
      const vertexLayer = layers
        .map((layer) => layer.some((e) => e === parseInt(vertex)))
        .indexOf(true);
      if (vertexLayer - childVertexLayer > 1) {
        for (let i = vertexLayer - 1; i > childVertexLayer; i--) {
          layersWithDummyVertices[i].push(newVertexId);

          if (i > childVertexLayer + 1) {
            adjacencyListWithDummyVertices[newVertexId] = [newVertexId + 1];
          } else {
            adjacencyListWithDummyVertices[newVertexId] = [childVertex];
          }

          if (i === vertexLayer - 1) {
            adjacencyListWithDummyVertices[parseInt(vertex)].push(newVertexId);
            dummyVertices[vertex][childVertex] = [newVertexId];
          } else {
            dummyVertices[vertex][childVertex] = [
              ...dummyVertices[vertex][childVertex],
              newVertexId,
            ];
          }
          newVertexId += 1;
        }
        adjacencyListWithDummyVertices[parseInt(vertex)].splice(
          adjacencyListWithDummyVertices[parseInt(vertex)].indexOf(childVertex),
          1
        );
      }
    });
  });

  return {
    layersWithDummyVertices,
    dummyVertices,
    adjacencyListWithDummyVertices,
  };
}
