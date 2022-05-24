import * as d3 from 'd3';
import { D3DragEvent, SubjectPosition } from 'd3';
import { Dot, Link, Node } from '@/utils/types';
import {
  RADIUS_CONST,
  STROKE_WIDTH,
  DOT_SIZE,
  NODE_WIDTH,
  NODE_HEIGHT,
} from '@/utils/consts';

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
        { id: 1, source: 1, target: 5 },
        { id: 2, source: 4, target: 5 },
        { id: 3, source: 4, target: 6 },
        { id: 4, source: 3, target: 2 },
        { id: 5, source: 5, target: 2 },
        { id: 6, source: 1, target: 2 },
        { id: 7, source: 3, target: 4 },
      ],
      dots: [
        { id: 1, source: 1, target: 2, row: 1 },
        { id: 2, source: 1, target: 5, row: 1 },
        { id: 3, source: 1, target: 5, row: 2 },
      ],
      dotsLinks: [{ id: 1, source: 1, target: 2 }],
    },
    link: null,
    node: null,
    dot: null,
    nodeIdText: null,
    dotLinks: null,
    selectedNode: null,
    selectedTargetNodes: [],
  }),
  mutations: {
    SET_SVG(state, payload) {
      state.svg = payload;
      state.svg.append('g').attr('class', 'links');
      state.svg.append('g').attr('class', 'nodes');
      state.svg.append('g').attr('class', 'dots');
      state.svg.append('g').attr('class', 'text');
      state.svg.append('g').attr('class', 'dot-links');
    },
    SET_LINK(state) {
      state.link = state.svg
        .select('g.links')
        .selectAll('line')
        .data(state.dataset.links)
        .enter()
        .append('line')
        .attr('id', (d: Link) => 'link' + d.id)
        .attr('stroke', 'black')
        .attr('stroke-width', STROKE_WIDTH)
        .attr(
          'x1',
          (d: Link) => state.dataset.nodes.find((e) => e.id === d.source).x
        )
        .attr(
          'y1',
          (d: Link) => state.dataset.nodes.find((e) => e.id === d.source).y
        )
        .attr(
          'x2',
          (d: Link) => state.dataset.nodes.find((e) => e.id === d.target).x
        )
        .attr(
          'y2',
          (d: Link) => state.dataset.nodes.find((e) => e.id === d.target).y
        );
    },
    SET_NODE(state) {
      state.node = state.svg
        .select('g.nodes')
        .selectAll('rect')
        .data(state.dataset.nodes)
        .enter()
        .append('rect')
        .style('fill', 'lightblue')
        .style('cursor', 'pointer')
        .attr('id', (d: Node) => 'node' + d.id)
        .attr('width', NODE_WIDTH)
        .attr('height', NODE_HEIGHT)
        .attr('x', (d: Node) => (d.x as number) - NODE_WIDTH / 2)
        .attr('y', (d: Node) => (d.y as number) - NODE_HEIGHT / 2)
        .call(
          d3
            .drag()
            .on('start', dragStart)
            .on('drag', dragged)
            .on('end', dragEnd)
        )
        .on('click', function (this: any, e: PointerEvent, d: Node) {
          state.svg
            .select('#node' + state.selectedNode)
            .style('fill', 'lightblue');
          if (state.selectedNode === d.id) {
            d3.select(this).style('fill', 'lightblue');
            state.selectedNode = null;
          } else {
            d3.select(this).style('fill', 'red');
            state.selectedNode = d.id;
          }
        });
    },
    SET_DOT(state) {
      state.dot = state.svg
        .select('g.dots')
        .selectAll('circle')
        .data(state.dataset.dots)
        .enter()
        .append('circle')
        .attr('id', (d: Dot) => 'dot' + d.id)
        .attr('r', DOT_SIZE)
        .style('fill', 'black')
        .attr('cx', (d: Dot) =>
          setDotPosition(d, 'X', RADIUS_CONST, state.node)
        )
        .attr('cy', (d: Dot) =>
          setDotPosition(d, 'Y', RADIUS_CONST, state.node)
        );
    },
    SET_NODE_ID_TEXT(state) {
      state.nodeIdText = state.svg
        .select('g.text')
        .selectAll('text')
        .data(state.dataset.nodes)
        .enter()
        .append('text')
        .text((d: Node) => d.id)
        .attr('id', (d: Node) => 'text' + d.id)
        .attr('x', (d: Node) => (d.x as number) - 5)
        .attr('y', (d: Node) => (d.y as number) + 5);
    },
    SET_DOT_LINKS(state) {
      state.dotLinks = state.svg
        .select('g.dot-links')
        .selectAll('path')
        .data(state.dataset.dotsLinks)
        .enter()
        .append('path')
        .attr('id', (d: Link) => 'dot-link' + d.id)
        .attr('stroke', 'black')
        .attr('stroke-width', STROKE_WIDTH)
        .attr('fill', 'none')
        .attr('d', (d: Link) =>
          setDotsArc(d, state.dot, state.node, RADIUS_CONST)
        );
    },
    SET_SELECTED_NODE(state, payload) {
      state.selectedNode = payload;
    },
    CHANGE_ON_CLICK_TO_TARGET_NODES(state) {
      state.svg
        .select('g.nodes')
        .selectAll('rect')
        .on('click', function (this: any, e: PointerEvent, d: Node) {
          if (state.selectedTargetNodes.includes(d.id)) {
            d3.select(this).style('fill', 'lightblue');
            state.selectedTargetNodes = state.selectedTargetNodes.filter(
              (element) => element !== d.id
            );
          } else {
            d3.select(this).style('fill', 'green');
            state.selectedTargetNodes.push(d.id);
          }
        });
    },
    CHANGE_ON_CLICK_TO_DEFAULT(state) {
      state.svg
        .select('g.nodes')
        .selectAll('rect')
        .on('click', function (this: any, e: PointerEvent, d: Node) {
          state.svg
            .select('#node' + state.selectedNode)
            .style('fill', 'lightblue');
          if (state.selectedNode === d.id) {
            d3.select(this).style('fill', 'lightblue');
            state.selectedNode = null;
          } else {
            d3.select(this).style('fill', 'red');
            state.selectedNode = d.id;
          }
        });
    },
    SET_SELECTED_TARGET_NODE(state, payload) {
      state.selectedTargetNodes = payload;
    },
    ADD_SELECTED_TARGET_NODE(state, payload) {
      state.selectedTargetNodes.push(payload);
    },
    ADD_NODE(state, payload) {
      state.dataset.nodes.push(payload);
    },
    ADD_LINK(state, payload) {
      state.dataset.links.push(payload);
    },
    REMOVE_NODE(state, payload) {
      state.dataset.nodes = state.dataset.nodes.filter((e) => e.id !== payload);
      state.svg.selectAll('#node' + payload).remove();
      state.svg.selectAll('#text' + payload).remove();

      const remainingLinks = state.dataset.links.filter(
        (e) => e.source !== payload && e.target !== payload
      );

      const linksToRemove = state.dataset.links.filter(
        (e) => !remainingLinks.includes(e.id)
      );

      state.dataset.links = remainingLinks;
      linksToRemove.map((e) => state.svg.selectAll('#link' + e.id).remove());

      const dotsToRemove = state.dataset.dots.filter(
        (e) => e.source === payload || e.target === payload
      );
      const dotsToRemoveIds = dotsToRemove.map((e) => e.id);

      const remainingDots = state.dataset.dots.filter(
        (e) => !dotsToRemoveIds.includes(e.id)
      );
      dotsToRemove.map((e) => state.svg.selectAll('#dot' + e.id).remove());

      state.dataset.dots = remainingDots;

      const dotLinksToRemove = state.dataset.dotsLinks.filter(
        (e) =>
          dotsToRemoveIds.includes(e.source) ||
          dotsToRemoveIds.includes(e.target)
      );

      state.dataset.dotsLinks = state.dataset.dotsLinks.filter(
        (e) => !dotLinksToRemove.includes(e.id)
      );
      dotLinksToRemove.map((e) =>
        state.svg.selectAll('#dot-link' + e.id).remove()
      );
    },
    REMOVE_LINK(state, payload) {
      const { source: sourceNode, target: targetNode } =
        state.dataset.links.find((e) => (e.id = payload));
      state.dataset.links = state.dataset.links.filter((e) => e.id !== payload);
      state.svg.select('#link' + payload).remove();

      const dotsToRemove = state.dataset.dots.filter(
        (e) => e.source === sourceNode && e.target === targetNode
      );
      const dotsToRemoveIds = dotsToRemove.map((e) => e.id);

      const remainingDots = state.dataset.dots.filter(
        (e) => !dotsToRemoveIds.includes(e.id)
      );

      dotsToRemove.map((e) => state.svg.selectAll('#dot' + e.id).remove());

      state.dataset.dots = remainingDots;

      const dotLinksToRemove = state.dataset.dotsLinks.filter(
        (e) =>
          dotsToRemoveIds.includes(e.source) ||
          dotsToRemoveIds.includes(e.target)
      );

      state.dataset.dotsLinks = state.dataset.dotsLinks.filter(
        (e) => !dotLinksToRemove.includes(e.id)
      );
      dotLinksToRemove.map((e) =>
        state.svg.selectAll('#dot-link' + e.id).remove()
      );
    },
    REFRESH_SELECTION(state) {
      state.node = state.svg
        .select('g.nodes')
        .selectAll('rect')
        .data(state.dataset.nodes)
        .enter();
    },
  },
  actions: {
    setSvg({ commit }, selector) {
      commit('SET_SVG', d3.select(selector));
    },

    initLink({ commit }) {
      commit('SET_LINK');
    },

    initNode({ commit }) {
      commit('SET_NODE');
    },

    initDots({ commit }) {
      commit('SET_DOT');
    },

    initNodeIdText({ commit }) {
      commit('SET_NODE_ID_TEXT');
    },

    initDotLinks({ commit }) {
      commit('SET_DOT_LINKS');
    },

    setSelectedNode({ commit }, payload) {
      commit('SET_SELECTED_NODE', payload);
    },

    setSelectedTargetNodes({ commit }, payload) {
      commit('SET_SELECTED_TARGET_NODE', payload);
    },

    changeOnClickToTargetNodes({ commit }) {
      commit('CHANGE_ON_CLICK_TO_TARGET_NODES');
    },

    changeOnClickToDefault({ commit }) {
      commit('CHANGE_ON_CLICK_TO_DEFAULT');
    },

    addSelectedTargetNodes({ commit }, payload) {
      commit('ADD_SELECTED_TARGET_NODE', payload);
    },

    insertNode({ commit }, payload) {
      commit('ADD_NODE', payload);
      commit('SET_NODE');
      commit('SET_NODE_ID_TEXT');
      commit('REFRESH_SELECTION');
    },

    insertLink({ commit }, payload) {
      commit('ADD_LINK', payload);
      commit('SET_LINK');
    },

    removeNode({ commit }, payload) {
      commit('REMOVE_NODE', payload);
      commit('SET_SELECTED_NODE', null);
      commit('SET_NODE');
      commit('SET_NODE_ID_TEXT');
      commit('SET_LINK');
      commit('SET_DOT');
      commit('SET_DOT_LINKS');
    },

    removeLink({ commit }, payload) {
      commit('REMOVE_LINK', payload);
      commit('SET_LINK');
      commit('SET_DOT');
      commit('SET_DOT_LINKS');
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
    selectedTargetNodes: (state) => state.selectedTargetNodes,
    getNodeById: (state) => (id) => state.svg.select(id),
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
