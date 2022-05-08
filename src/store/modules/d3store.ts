import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';
import { HEIGHT, WIDTH } from '@/utils/consts';
import {
  D3DragEvent,
  Simulation,
  SimulationNodeDatum,
  SubjectPosition,
} from 'd3';
import { Link, Node } from '@/utils/types';

export const d3store = {
  state: () => ({
    svg: null,
    simulation: null,
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
  }),
  mutations: {
    SET_SVG(state, payload) {
      state.svg = payload;
    },
    SET_SIMULATION(state, payload) {
      state.simulation = payload;
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
  },
  actions: {
    setSvg({ commit }, selector) {
      commit('SET_SVG', d3.select(selector).append('g'));
    },

    initSimulation({ commit, state }) {
      commit(
        'SET_SIMULATION',
        forceSimulation(state.dataset.nodes)
          .force(
            'link',
            d3
              .forceLink()
              .links(state.dataset.links)
              .id((d: any) => d.id)
              .distance(50)
          )
          .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
      );
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
          .attr('width', 40)
          .attr('height', 40)
          .call(
            d3
              .drag()
              .on('start', dragStart(state.simulation))
              .on('drag', dragged)
              .on('end', dragEnd(state.simulation))
          )
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
      );
    },
  },
  getters: {
    svg: (state) => state.svg,
    simulation: (state) => state.simulation,
    dataset: (state) => state.dataset,
    link: (state) => state.link,
    node: (state) => state.node,
    dot: (state) => state.dot,
    nodeIdText: (state) => state.nodeIdText,
    dotLinks: (state) => state.dotLinks,
  },
};

function dragStart(simulation: Simulation<SimulationNodeDatum, Link>) {
  return (
    event: D3DragEvent<SVGRectElement, SimulationNodeDatum, SubjectPosition>,
    d: any
  ) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fy = d.y;
    d.fx = d.x;
  };
}

function dragged(
  event: D3DragEvent<SVGRectElement, SimulationNodeDatum, SubjectPosition>,
  d: any
) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnd(simulation: Simulation<SimulationNodeDatum, Link>) {
  return (
    event: D3DragEvent<SVGRectElement, SimulationNodeDatum, SubjectPosition>,
    d: any
  ) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };
}
