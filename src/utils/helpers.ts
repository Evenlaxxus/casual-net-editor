import { Dot, Link, Node } from '@/utils/types';
import * as d3 from 'd3';

export function setDotsArc(d: Link, dot: any, node: any, baseRadius: number) {
  const sourceDot = dot._groups[0].find((e: any) => e.__data__.id === d.source);
  const targetDot = dot._groups[0].find((e: any) => e.__data__.id === d.target);
  const sourceNode = node
    .data()
    .find((e: Node) => e.id === sourceDot.__data__.source);
  const curve = d3.line().curve(d3.curveNatural);
  const sourceX = parseFloat(sourceDot.getAttribute('cx'));
  const sourceY = parseFloat(sourceDot.getAttribute('cy'));
  const targetX = parseFloat(targetDot.getAttribute('cx'));
  const targetY = parseFloat(targetDot.getAttribute('cy'));

  const radius = baseRadius + sourceDot.__data__.row * 20;

  const a: [number, number] = [sourceX - sourceNode.x, sourceY - sourceNode.y];
  const b: [number, number] = [targetX - sourceNode.x, targetY - sourceNode.y];
  let m: [number, number] = [a[0] + b[0], a[1] + b[1]];
  const mLen = Math.hypot(m[0], m[1]);
  m = [m[0] / mLen, m[1] / mLen];
  const middlePoint: [number, number] = [
    sourceNode.x + m[0] * radius,
    sourceNode.y + m[1] * radius,
  ];
  return curve([[sourceX, sourceY], middlePoint, [targetX, targetY]]);
}

export function getDotPosition(
  d: Dot,
  baseRadius: number,
  links: Array<Link>,
  svg: any
) {
  let isIncoming = false;
  let linkData = links.find(
    (e: Link) => e.source === d.source && e.target === d.target
  );
  if (!linkData) {
    linkData = links.find(
      (e: Link) => e.source === d.target && e.target === d.source
    );
    isIncoming = true;
  }

  const link = svg.select('path#link' + linkData?.id || '').node();

  if (isIncoming) {
    return (link as SVGGeometryElement).getPointAtLength(
      (link as SVGGeometryElement).getTotalLength() - baseRadius * d.row
    );
  } else {
    return (link as SVGGeometryElement).getPointAtLength(baseRadius * d.row);
  }
}

export function getDotXPosition(
  d: Dot,
  baseRadius: number,
  links: Array<Link>,
  svg: any
) {
  return getDotPosition(d, baseRadius, links, svg).x;
}

export function getDotYPosition(
  d: Dot,
  baseRadius: number,
  links: Array<Link>,
  svg: any
) {
  return getDotPosition(d, baseRadius, links, svg).y;
}

export const permutations = (arr: Array<any>): Array<any> => {
  if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((val) => [
          item,
          ...val,
        ])
      ),
    []
  );
};

export function getAggregationRectCoords(
  d: {
    id: number;
    nodes: Array<number>;
  },
  nodes: Array<Node>,
  nodeSize: number
): { x: number; y: number } {
  const includedNodes = nodes.filter((e) => d.nodes.includes(e.id));
  const minNode = includedNodes.reduce(
    (min, node) => (min.x >= node.x && min.y >= node.y ? node : min),
    includedNodes[0]
  );

  return { x: minNode.x - nodeSize * 1.5, y: minNode.y - nodeSize * 1.5 };
}

export function getAggregationRectSize(
  d: {
    id: number;
    nodes: Array<number>;
  },
  nodes: Array<Node>,
  nodeSize: number
): { w: number; h: number } {
  const includedNodes = nodes.filter((e) => d.nodes.includes(e.id));
  const minNode = includedNodes.reduce(
    (min, node) => (min.x >= node.x && min.y >= node.y ? node : min),
    includedNodes[0]
  );
  const maxNode = includedNodes.reduce(
    (max, node) => (max.x <= node.x && max.y <= node.y ? node : max),
    includedNodes[0]
  );

  return {
    w: maxNode.x - minNode.x + nodeSize * 3,
    h: maxNode.y - minNode.y + nodeSize * 3,
  };
}

export function createAdjacencyList(
  graph: Array<{
    id: number;
    name: string;
    incoming: Array<Array<number>>;
    outgoing: Array<Array<number>>;
  }>
): {
  adjacencyList: Record<number, Array<number>>;
  incomingAdjacencyList: Record<number, Array<number>>;
} {
  const adjacencyList = {};
  const incomingAdjacencyList = {};
  graph.map((node) => {
    adjacencyList[node.id] = [...new Set(node.outgoing.flat())];
  });
  graph.map((node) => {
    incomingAdjacencyList[node.id] = [...new Set(node.incoming.flat())];
  });
  return { adjacencyList, incomingAdjacencyList };
}
