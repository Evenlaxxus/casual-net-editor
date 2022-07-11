import _ from 'lodash';

export function addDummyVertices(
  layers: Array<Array<number>>,
  adjacencyList: Record<number, Array<number>>
): {
  layersWithDummyVertices: Array<Array<number>>;
  dummyVertices: Record<number, Record<number, Array<number>>>;
  adjacencyListWithDummyVertices: Record<number, Array<number>>;
  pathsWithDummyVertices: Record<number, Array<number>>;
  dummyVerticesArray: Array<number>;
} {
  const dummyVertices: Record<number, Record<number, Array<number>>> = {
    ...Object.keys(adjacencyList).map(() => ({})),
  };
  const dummyVerticesArray: Array<number> = [];
  const layersWithDummyVertices: Array<Array<number>> = _.cloneDeep(layers);
  const pathsWithDummyVertices: Array<Array<number>> = [];
  const adjacencyListWithDummyVertices: Record<
    number,
    Array<number>
  > = _.cloneDeep(adjacencyList);

  let newVertexId: number =
    Object.keys(adjacencyList)
      .map((e) => parseInt(e))
      .reduce((max, val) => (max > val ? max : val), 0) + 1;
  Object.keys(adjacencyList)
    .map((e) => parseInt(e))
    .map((vertex) => {
      adjacencyList[vertex].map((childVertex) => {
        const childVertexLayer = layers
          .map((layer) => layer.some((e) => e === childVertex))
          .indexOf(true);
        const vertexLayer = layers
          .map((layer) => layer.some((e) => e === vertex))
          .indexOf(true);
        if (vertexLayer - childVertexLayer > 1) {
          pathsWithDummyVertices.push([vertex]);
          for (let i = vertexLayer - 1; i > childVertexLayer; i--) {
            layersWithDummyVertices[i].push(newVertexId);

            if (i > childVertexLayer + 1) {
              adjacencyListWithDummyVertices[newVertexId] = [newVertexId + 1];
            } else {
              adjacencyListWithDummyVertices[newVertexId] = [childVertex];
            }

            if (i === vertexLayer - 1) {
              adjacencyListWithDummyVertices[vertex].push(newVertexId);
              dummyVertices[vertex][childVertex] = [newVertexId];
            } else {
              dummyVertices[vertex][childVertex] = [
                ...dummyVertices[vertex][childVertex],
                newVertexId,
              ];
            }
            dummyVerticesArray.push(newVertexId);
            pathsWithDummyVertices[pathsWithDummyVertices.length - 1].push(
              newVertexId
            );
            newVertexId += 1;
          }
          pathsWithDummyVertices[pathsWithDummyVertices.length - 1].push(
            childVertex
          );
          adjacencyListWithDummyVertices[vertex].splice(
            adjacencyListWithDummyVertices[vertex].indexOf(childVertex),
            1
          );
        }
      });
    });

  return {
    layersWithDummyVertices,
    dummyVertices,
    adjacencyListWithDummyVertices,
    pathsWithDummyVertices,
    dummyVerticesArray,
  };
}
