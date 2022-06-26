import * as d3 from 'd3';
import { Dot, Link, Node } from '@/utils/types';
import {
  DOT_SIZE,
  NODE_SIZE,
  RADIUS_CONST,
  STROKE_WIDTH,
} from '@/utils/consts';
import {
  onClickDot,
  onClickLink,
  onClickNode,
  onClickNodeAlternative,
} from '@/utils/eventCallbacks';
import { setDotPosition, setDotsArc } from '@/utils/helpers';

export default {
  SET_DATASET(state, payload) {
    state.dataset = payload;
  },
  SET_SVG(state, payload) {
    state.svg = payload;
    state.svg.append('g').attr('class', 'links');
    state.svg.append('g').attr('class', 'nodes');
    state.svg.append('g').attr('class', 'dots');
    state.svg.append('g').attr('class', 'node-id');
    state.svg.append('g').attr('class', 'dot-links');
    state.svg.append('g').attr('class', 'text');

    state.svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('refX', 5)
      .attr('refY', 2)
      .attr('markerWidth', 6)
      .attr('markerHeight', 4)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0,0 V 4 L6,2 Z')
      .attr('stroke', 'black');
  },
  SET_LINK(state) {
    const curve = d3.line().curve(d3.curveNatural);
    state.link = state.svg
      .select('g.links')
      .selectAll('path')
      .data(state.dataset.links)
      .enter()
      .append('path')
      .style('cursor', 'pointer')
      .attr('id', (d: Link) => 'link' + d.id)
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('marker-end', 'url(#arrow)')
      .attr('d', (d: Link) =>
        curve([
          calculateOffsetPosition(
            state.dataset.nodes.find((e) => e.id === d.target).x,
            state.dataset.nodes.find((e) => e.id === d.target).y,
            state.dataset.nodes.find((e) => e.id === d.source).x,
            state.dataset.nodes.find((e) => e.id === d.source).y,
            NODE_SIZE
          ),
          ...d.bendPoints,
          calculateOffsetPosition(
            state.dataset.nodes.find((e) => e.id === d.source).x,
            state.dataset.nodes.find((e) => e.id === d.source).y,
            state.dataset.nodes.find((e) => e.id === d.target).x,
            state.dataset.nodes.find((e) => e.id === d.target).y,
            NODE_SIZE
          ),
        ])
      )
      .on('click', onClickLink(state));
  },
  SET_NODE(state) {
    state.node = state.svg
      .select('g.nodes')
      .selectAll('circle')
      .data(state.dataset.nodes)
      .enter()
      .append('circle')
      .style('cursor', 'pointer')
      .style('fill', 'transparent')
      .attr('id', (d: Node) => 'node' + d.id)
      .attr('r', NODE_SIZE)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('cx', (d: Node) => d.x as number)
      .attr('cy', (d: Node) => d.y as number)
      .on('click', onClickNode(state));
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
      .style('cursor', 'pointer')
      .attr('cx', (d: Dot) =>
        setDotPosition(d, 'X', RADIUS_CONST, state.dataset.links, state.svg)
      )
      .attr('cy', (d: Dot) =>
        setDotPosition(d, 'Y', RADIUS_CONST, state.dataset.links, state.svg)
      )
      .on('click', onClickDot(state));
  },
  SET_NODE_TEXT(state) {
    state.nodeIdText = state.svg
      .select('g.text')
      .selectAll('text')
      .data(state.dataset.nodes)
      .enter()
      .append('text')
      .text((d: Node) => d.text)
      .style('font-size', '.875rem')
      .attr('id', (d: Node) => 'text' + d.id)
      .attr('x', (d: Node) => (d.x as number) - NODE_SIZE)
      .attr('y', (d: Node) => d.y as number);
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
  SET_SELECTED_LINK(state, payload) {
    state.selectedLink = payload;
  },
  SET_SELECTED_DOT(state, payload) {
    state.selectedDot = payload;
  },
  CHANGE_ON_CLICK_TO_TARGET_NODES(state) {
    state.svg
      .select('g.nodes')
      .selectAll('rect')
      .on('click', onClickNodeAlternative(state));
  },
  CHANGE_ON_CLICK_TO_DEFAULT(state) {
    state.svg
      .select('g.nodes')
      .selectAll('rect')
      .on('click', onClickNode(state));
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
  EDIT_NODE_TEXT(state, payload) {
    state.dataset.nodes = state.dataset.nodes.map((e) =>
      e.id === payload.id
        ? {
            ...e,
            text: payload.text,
          }
        : e
    );
    // state.svg.selectAll('#text' + payload.id).remove();
    state.svg.selectAll('g.text text').remove();
  },
  ADD_LINK(state, payload) {
    state.dataset.links.push(payload);
  },
  ADD_BINDING(state, payload) {
    // Wiersz wiązania będzie obliczany przez algorytm
    const row =
      Math.max(
        ...state.dataset.dots.map((e) =>
          e.source === payload.source ? e.row : 0
        )
      ) + 1;

    payload.target.map((tar) => {
      const nextDotId = Math.max(...state.dataset.dots.map((e) => e.id)) + 1;
      state.dataset.dots.push({
        id: nextDotId,
        source: payload.source,
        target: tar,
        row: row,
      });
    });
  },
  REMOVE_NODE(state, payload) {
    state.dataset.nodes = state.dataset.nodes.filter((e) => e.id !== payload);
    state.svg.selectAll('#node' + payload).remove();
    state.svg.selectAll('#node-id' + payload).remove();
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
        dotsToRemoveIds.includes(e.source) || dotsToRemoveIds.includes(e.target)
    );

    state.dataset.dotsLinks = state.dataset.dotsLinks.filter(
      (e) => !dotLinksToRemove.includes(e.id)
    );
    dotLinksToRemove.map((e) =>
      state.svg.selectAll('#dot-link' + e.id).remove()
    );
  },
  REMOVE_LINK(state, payload) {
    const link = state.dataset.links.find((e) => e.id === payload);

    state.dataset.links = state.dataset.links.filter((e) => e.id !== payload);
    state.svg.select('#link' + payload).remove();

    const dotsToRemove = state.dataset.dots.filter(
      (e) => e.source === link.source && e.target === link.target
    );

    const dotsToRemoveIds = dotsToRemove.map((e) => e.id);

    const remainingDots = state.dataset.dots.filter(
      (e) => !dotsToRemoveIds.includes(e.id)
    );

    dotsToRemove.map((e) => state.svg.selectAll('#dot' + e.id).remove());

    state.dataset.dots = remainingDots;

    const dotLinksToRemove = state.dataset.dotsLinks.filter(
      (e) =>
        dotsToRemoveIds.includes(e.source) || dotsToRemoveIds.includes(e.target)
    );

    state.dataset.dotsLinks = state.dataset.dotsLinks.filter(
      (e) => !dotLinksToRemove.includes(e.id)
    );
    dotLinksToRemove.map((e) =>
      state.svg.selectAll('#dot-link' + e.id).remove()
    );
  },

  REMOVE_BINDING(state, payload) {
    state.dataset.dots = state.dataset.dots.filter((e) => e.id !== payload);
    state.svg.select('#dot' + payload).remove();

    const dotLinksToRemove = state.dataset.dotsLinks.filter(
      (e) => e.source === payload || e.target === payload
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
};

function calculateOffsetPosition(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset: number
): [newX2: number, newY2: number] {
  const a = x1 - x2;
  const b = y1 - y2;
  const c = Math.hypot(a, b);

  const angleSine = a / c;
  const angleCosine = b / c;

  return [x2 + offset * angleSine, y2 + offset * angleCosine];
}
