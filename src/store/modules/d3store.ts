import * as d3 from 'd3';
import { D3DragEvent, SubjectPosition } from 'd3';
import { Dot, Link, Node } from '@/utils/types';
const RADIUS_CONST = 30;
export const d3store = {
  state: () => ({
    svg: null,
    dataset: {
      nodes: [
        { id: 1, x: 233, y: 514 },
        { id: 2, x: 321, y: 386 },
        { id: 3, x: 543, y: 393 },
        { id: 4, x: 452, y: 561 },
        { id: 5, x: 373, y: 510 },
        { id: 6, x: 545, y: 465 },
      ],
      links: [
        { source: 1, target: 5 },
        { source: 4, target: 5 },
        { source: 4, target: 6 },
        { source: 3, target: 2 },
        { source: 5, target: 2 },
        { source: 1, target: 2 },
        { source: 3, target: 4 },
      ],
      dots: [
        { id: 1, source: 1, target: 2, row: 1 },
        { id: 2, source: 1, target: 5, row: 1 },
        { id: 3, source: 1, target: 5, row: 2 },
      ],
      dotsLinks: [{ source: 1, target: 2 }],
    },
    link: null,
    node: null,
    dot: null,
    nodeIdText: null,
    dotLinks: null,
    selectedNode: null,
  }),
  mutations: {
    SET_SVG(state, payload) {
      state.svg = payload;
    },
    SET_LINK(state, payload) {
      state.link = payload;
    },
    SET_NODE(state, payload) {
      state.node = payload;
    },
    SET_DOT(state, payload) {
      state.dot = payload;
    },
    SET_NODE_ID_TEXT(state, payload) {
      state.nodeIdText = payload;
    },
    SET_DOT_LINKS(state, payload) {
      state.dotLinks = payload;
    },
    SET_SELECTED_NODE(state, payload) {
      state.selectedNode = payload;
    },
    ADD_NODE(state, payload) {
      state.dataset.nodes = [
        ...state.dataset.nodes.flat().map((e) => ({
          id: e.id,
          x: e.x,
          y: e.y,
        })),
        payload,
      ];
    },
  },
  actions: {
    setSvg({ commit }, selector) {
      commit('SET_SVG', d3.select(selector));
    },

    initLink({ commit, state }) {
      commit(
        'SET_LINK',
        state.svg
          .append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(state.dataset.links)
          .enter()
          .append('line')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr(
            'x1',
            (d: any) => state.dataset.nodes.find((e) => e.id === d.source).x
          )
          .attr(
            'y1',
            (d: any) => state.dataset.nodes.find((e) => e.id === d.source).y
          )
          .attr(
            'x2',
            (d: any) => state.dataset.nodes.find((e) => e.id === d.target).x
          )
          .attr(
            'y2',
            (d: any) => state.dataset.nodes.find((e) => e.id === d.target).y
          )
      );
    },

    initNode({ commit, state }) {
      commit(
        'SET_NODE',
        state.svg
          .append('g')
          .attr('class', 'nodes')
          .selectAll('rect')
          .data(state.dataset.nodes)
          .enter()
          .append('rect')
          .style('fill', 'lightblue')
          .style('cursor', 'pointer')
          .attr('width', 40)
          .attr('height', 40)
          .attr('x', (d: any) => (d.x as number) - 20)
          .attr('y', (d: any) => (d.y as number) - 20)
          .call(
            d3
              .drag()
              .on('start', dragStart)
              .on('drag', dragged)
              .on('end', dragEnd)
          )
          .on('click', function (this: any, e: PointerEvent, d: any) {
            state.node.style('fill', 'lightblue');
            if (state.selectedNode === d.id) {
              d3.select(this).style('fill', 'lightblue');
              commit('SET_SELECTED_NODE', null);
            } else {
              d3.select(this).style('fill', 'red');
              commit('SET_SELECTED_NODE', d.id);
            }
          })
      );
    },

    initDots({ commit, state }) {
      commit(
        'SET_DOT',
        state.svg
          .append('g')
          .attr('class', 'dots')
          .selectAll('circle')
          .data(state.dataset.dots)
          .enter()
          .append('circle')
          .attr('r', 3)
          .style('fill', 'black')
          .attr('cx', (d: Dot) =>
            setDotPosition(d, 'X', RADIUS_CONST, state.node)
          )
          .attr('cy', (d: Dot) =>
            setDotPosition(d, 'Y', RADIUS_CONST, state.node)
          )
      );
    },

    initNodeIdText({ commit, state }) {
      commit(
        'SET_NODE_ID_TEXT',
        state.svg
          .append('g')
          .attr('class', 'text')
          .selectAll('text')
          .data(state.dataset.nodes)
          .enter()
          .append('text')
          .text((d: Node) => d.id)
          .attr('x', (d: any) => (d.x as number) - 5)
          .attr('y', (d: any) => (d.y as number) + 5)
      );
    },

    initDotLinks({ commit, state }) {
      commit(
        'SET_DOT_LINKS',
        state.svg
          .append('g')
          .attr('class', 'dot-links')
          .selectAll('path')
          .data(state.dataset.dotsLinks)
          .enter()
          .append('path')
          .attr('stroke', 'black')
          .attr('fill', 'none')
          .attr('d', (d: Link) =>
            setDotsArc(d, state.dot, state.node, RADIUS_CONST)
          )
      );
    },

    setSelectedNode({ commit }, payload) {
      commit('SET_SELECTED_NODE', payload);
    },
    insertNode({ commit, state }, payload) {
      commit('ADD_NODE', payload);
      commit(
        'SET_NODE',
        state.svg
          .select('g.nodes')
          .selectAll('rect')
          .data(state.dataset.nodes)
          .enter()
          .append('rect')
          .attr('id', payload.id)
          .style('fill', 'lightblue')
          .style('cursor', 'pointer')
          .attr('width', 40)
          .attr('height', 40)
          .attr('x', payload.x - 20)
          .attr('y', payload.y - 20)
          .call(
            d3
              .drag()
              .on('start', dragStart)
              .on('drag', dragged)
              .on('end', dragEnd)
          )
          .on('click', function (this: any, e: PointerEvent, d: any) {
            state.node.style('fill', 'lightblue');
            if (state.selectedNode === d.id) {
              d3.select(this).style('fill', 'lightblue');
              commit('SET_SELECTED_NODE', null);
            } else {
              d3.select(this).style('fill', 'red');
              commit('SET_SELECTED_NODE', d.id);
            }
          })
      );
      commit(
        'SET_NODE_ID_TEXT',
        state.svg
          .select('g.text')
          .selectAll('text')
          .data(state.dataset.nodes)
          .enter()
          .append('text')
          .text((d: Node) => d.id)
          .attr('x', (d: any) => (d.x as number) - 5)
          .attr('y', (d: any) => (d.y as number) + 5)
      );
    },
  },
  getters: {
    svg: (state) => state.svg,
    dataset: (state) => state.dataset,
    link: (state) => state.link,
    node: (state) => state.node,
    dot: (state) => state.dot,
    nodeIdText: (state) => state.nodeIdText,
    dotLinks: (state) => state.dotLinks,
    selectedNode: (state) => state.selectedNode,
  },
};

function dragStart(
  event: D3DragEvent<SVGRectElement, any, SubjectPosition>,
  d: any
) {
  d.fy = d.y;
  d.fx = d.x;
}

function dragged(
  event: D3DragEvent<SVGRectElement, any, SubjectPosition>,
  d: any
) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnd(
  event: D3DragEvent<SVGRectElement, any, SubjectPosition>,
  d: any
) {
  d.fx = null;
  d.fy = null;
}

function setDotsArc(d: Link, dot: any, node: any, baseRadius: number) {
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

function setDotPosition(d: Dot, axis: string, baseRadius: number, node) {
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
