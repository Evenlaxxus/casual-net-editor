import dijkstra from 'dijkstrajs';
import agglo from 'agglo';

export function getAllPossibleAggregations(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>
) {
  const adjacencyList = {};
  const ids = graph.map((e) => [e.id]);
  graph.map((node) => {
    adjacencyList[node.id] = [
      ...new Set([...node.incoming.flat(), ...node.outgoing.flat()]),
    ].reduce(
      (obj, item) => ({
        ...obj,
        [item]: 1,
      }),
      {}
    );
  });

  const nodeDistance = (a: number, b: number): number =>
    dijkstra.find_path(adjacencyList, a, b).length;

  const linkage = ['single', 'average', 'complete'];
  const result = linkage
    .map((link) =>
      agglo(ids, {
        distance: nodeDistance,
        linkage: link,
      })
    )
    .flat();

  return result
    .map((res) =>
      res.clusters
        .filter((e) => e.length > 1)
        .map((e) => e.flat())
        .flat()
    )
    .reduce(
      (rest, val) =>
        rest.some(
          (e) =>
            e.length === val.length && e.every((item) => val.includes(item))
        )
          ? rest
          : [...rest, val.sort()],
      []
    );
}
