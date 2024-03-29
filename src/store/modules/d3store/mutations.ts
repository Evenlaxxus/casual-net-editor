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
import { getDotXPosition, getDotYPosition, setDotsArc } from '@/utils/helpers';

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
    state.svg.append('g').attr('class', 'aggregations');

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
      .attr('d', (d: Link) => {
        if (d.bendPoints?.length) {
          return curve([
            calculateOffsetPosition(
              state.dataset.nodes.find((e) => e.id === d.source).x,
              state.dataset.nodes.find((e) => e.id === d.source).y,
              d.bendPoints[0][0],
              d.bendPoints[0][1],
              NODE_SIZE
            ),
            ...d.bendPoints,
            calculateOffsetPosition(
              state.dataset.nodes.find((e) => e.id === d.target).x,
              state.dataset.nodes.find((e) => e.id === d.target).y,
              d.bendPoints[d.bendPoints.length - 1][0],
              d.bendPoints[d.bendPoints.length - 1][1],
              NODE_SIZE
            ),
          ]);
        } else {
          return curve([
            calculateOffsetPosition(
              state.dataset.nodes.find((e) => e.id === d.source).x,
              state.dataset.nodes.find((e) => e.id === d.source).y,
              state.dataset.nodes.find((e) => e.id === d.target).x,
              state.dataset.nodes.find((e) => e.id === d.target).y,
              NODE_SIZE
            ),
            calculateOffsetPosition(
              state.dataset.nodes.find((e) => e.id === d.target).x,
              state.dataset.nodes.find((e) => e.id === d.target).y,
              state.dataset.nodes.find((e) => e.id === d.source).x,
              state.dataset.nodes.find((e) => e.id === d.source).y,
              NODE_SIZE
            ),
          ]);
        }
      })
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
      .attr('class', 'node')
      .attr('r', NODE_SIZE)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
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
        getDotXPosition(d, RADIUS_CONST, state.dataset.links, state.svg)
      )
      .attr('cy', (d: Dot) =>
        getDotYPosition(d, RADIUS_CONST, state.dataset.links, state.svg)
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
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style(
        'font-size',
        (d) =>
          Math.round(
            (NODE_SIZE / 3) * (10 / (d.text.length === 1 ? 5 : d.text.length))
          ) + 'px'
      )
      .attr('id', (d: Node) => 'text' + d.id)
      .attr('x', (d: Node) => d.x as number)
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
  CHANGE_ON_CLICK_TO_TARGET_NODES(state, payload) {
    state.svg
      .select('g.nodes')
      .selectAll('.node')
      .on('click', onClickNodeAlternative(state, payload));
  },
  CHANGE_ON_CLICK_TO_DEFAULT(state) {
    state.svg
      .select('g.nodes')
      .selectAll('.node')
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
      .selectAll('.node')
      .data(state.dataset.nodes)
      .enter();
  },

  SET_POSSIBLE_AGGREGATIONS(state, payload) {
    state.aggregations = payload;
  },

  DRAW_AGGREGATIONS(state, payload) {
    state.svg.selectAll('.node').style('fill', 'transparent');
    if (payload.length > 1) {
      payload.slice(1).map((node) => {
        state.svg.select('#node' + node).style('fill', 'green');
      });
    }
    state.svg.selectAll('#node' + payload[0]).style('fill', 'red');

    const aggregations: Array<number> = state.aggregations.filter(
      (aggregation) => payload.every((e) => aggregation.includes(e))
    );
    const uniqueNodes: Array<number> = [...new Set(aggregations.flat())].filter(
      (e) => !payload.includes(e)
    );

    const nodesOneStepAhead: Array<number> = uniqueNodes.filter((e) =>
      payload.some(
        (key) =>
          state.adjacencyList[key].includes(e) ||
          state.adjacencyList[e].includes(key)
      )
    );

    nodesOneStepAhead.map((node) => {
      state.svg.select('#node' + node).style('fill', 'lightblue');
    });
  },

  SET_ADJACENCY_LIST(state, payload) {
    state.adjacencyList = payload;
  },

  SET_ACTIVE_AGGREGATIONS(state, { id, aggregated }) {
    state.activeAggregations[id] = aggregated;
  },
};

function calculateOffsetPosition(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset: number
): [newX2: number, newY2: number] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const newX = x1 + (dx * offset) / dist;
  const newY = y1 + (dy * offset) / dist;

  return [newX, newY];
}
