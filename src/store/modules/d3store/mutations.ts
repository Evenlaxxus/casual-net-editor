import { Dot, Link, Node } from '@/utils/types';
import {
  DOT_SIZE,
  NODE_HEIGHT,
  NODE_WIDTH,
  RADIUS_CONST,
  STROKE_WIDTH,
} from '@/utils/consts';
import {
  dragEnd,
  dragged,
  dragStart,
  onClickDot,
  onClickLink,
  onClickNode,
  onClickNodeAlternative,
} from '@/utils/eventCallbacks';
import * as d3 from 'd3';
import { setDotPosition, setDotsArc } from '@/utils/helpers';

export default {
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
      .style('cursor', 'pointer')
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
      )
      .on('click', onClickLink(state));
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
        d3.drag().on('start', dragStart).on('drag', dragged).on('end', dragEnd)
      )
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
      .attr('cx', (d: Dot) => setDotPosition(d, 'X', RADIUS_CONST, state.node))
      .attr('cy', (d: Dot) => setDotPosition(d, 'Y', RADIUS_CONST, state.node))
      .on('click', onClickDot(state));
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

    if (payload.target.length > 1) {
      for (let i = 0; i < payload.target.length; i++) {
        console.log(i);
      }
    }
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
