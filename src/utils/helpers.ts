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

  const radius = baseRadius + sourceDot.__data__.row * 10;

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

export function setDotPosition(d: Dot, axis: string, baseRadius: number, node) {
  const sourceNode = node.data().find((e: Node) => e.id === d.source);
  const targetNode = node.data().find((e: Node) => e.id === d.target);
  const center = [sourceNode.x, sourceNode.y];
  const radius = baseRadius + d.row * 10;
  const target = [targetNode.x, targetNode.y];

  let v = [target[0] - center[0], target[1] - center[1]];
  const vLen = Math.hypot(v[0], v[1]);
  v = [v[0] / vLen, v[1] / vLen];
  const point = [center[0] + v[0] * radius, center[1] + v[1] * radius];
  if (axis === 'X') return point[0];
  return point[1];
}
