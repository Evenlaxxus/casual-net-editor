<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from 'd3';
import { Node, Link, Dot } from '@/utils/types';
import { mapActions, mapGetters } from 'vuex';
import { HEIGHT, WIDTH } from '@/utils/consts';
import { Simulation, SimulationNodeDatum } from 'd3';

export default defineComponent({
  name: 'DirectedGraph',
  data: () => ({
    windowWidth: WIDTH,
    windowHeight: HEIGHT,
    RADIUS_CONST: 30,
  }),
  computed: {
    ...mapGetters([
      'svg',
      'simulation',
      'dataset',
      'link',
      'node',
      'dot',
      'dotLinks',
      'nodeIdText',
    ]),
  },
  mounted() {
    this.setSvg('svg');
    this.generateGraph();
  },
  methods: {
    ...mapActions([
      'setSvg',
      'initSimulation',
      'initLink',
      'initNode',
      'initDots',
      'initDotLinks',
      'initNodeIdText',
    ]),
    generateGraph() {
      this.initSimulation();

      this.initLink();

      this.initNode();

      this.initNodeIdText();

      this.initDots();

      this.initDotLinks();

      this.simulateNodes(
        this.simulation,
        this.dataset.nodes,
        this.simulationTick
      );

      this.simulation.force('link').links(this.link);
    },
    simulateNodes(
      simulation: Simulation<SimulationNodeDatum, Link>,
      nodes: Array<Node>,
      ticked: () => void
    ) {
      simulation
        .nodes(nodes)
        .force('charge', d3.forceManyBody().strength(0))
        .force(
          'collision',
          d3.forceCollide().radius((d: any) => d.radius)
        )
        .on('tick', ticked);
    },
    simulationTick() {
      this.link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      this.node
        .attr('x', (d: SimulationNodeDatum) => (d.x as number) - 20)
        .attr('y', (d: SimulationNodeDatum) => (d.y as number) - 20);

      this.nodeIdText
        .attr('x', (d: SimulationNodeDatum) => (d.x as number) - 5)
        .attr('y', (d: SimulationNodeDatum) => (d.y as number) + 5);

      this.dot
        .attr('cx', (d: Dot) => this.setDotPosition(d, 'X', this.RADIUS_CONST))
        .attr('cy', (d: Dot) => this.setDotPosition(d, 'Y', this.RADIUS_CONST));

      this.dotLinks.attr('d', (d: Link) =>
        this.setDotsArc(d, this.dot, this.node, this.RADIUS_CONST)
      );
    },
    setDotPosition(d: Dot, axis: string, baseRadius: number) {
      const sourceNode = this.node.data().find((e: Node) => e.id === d.source);
      const targetNode = this.node.data().find((e: Node) => e.id === d.target);
      const center = [sourceNode.x, sourceNode.y];
      const radius = baseRadius + d.row * 10;
      const target = [targetNode.x, targetNode.y];

      let v = [target[0] - center[0], target[1] - center[1]];
      const vLen = Math.hypot(v[0], v[1]);
      v = [v[0] / vLen, v[1] / vLen];
      const point = [center[0] + v[0] * radius, center[1] + v[1] * radius];
      if (axis === 'X') return point[0];
      return point[1];
    },
    setDotsArc(d: Link, dot: any, node: any, baseRadius: number) {
      const sourceDot = dot._groups[0].find(
        (e: any) => e.__data__.id === d.source
      );
      const targetDot = dot._groups[0].find(
        (e: any) => e.__data__.id === d.target
      );
      const sourceNode = node
        .data()
        .find((e: Node) => e.id === sourceDot.__data__.source);
      const curve = d3.line().curve(d3.curveNatural);
      const sourceX = parseFloat(sourceDot.getAttribute('cx'));
      const sourceY = parseFloat(sourceDot.getAttribute('cy'));
      const targetX = parseFloat(targetDot.getAttribute('cx'));
      const targetY = parseFloat(targetDot.getAttribute('cy'));

      const radius = baseRadius + sourceDot.__data__.row * 10;

      const a: [number, number] = [
        sourceX - sourceNode.x,
        sourceY - sourceNode.y,
      ];
      const b: [number, number] = [
        targetX - sourceNode.x,
        targetY - sourceNode.y,
      ];
      let m: [number, number] = [a[0] + b[0], a[1] + b[1]];
      const mLen = Math.hypot(m[0], m[1]);
      m = [m[0] / mLen, m[1] / mLen];
      const middlePoint: [number, number] = [
        sourceNode.x + m[0] * radius,
        sourceNode.y + m[1] * radius,
      ];
      return curve([[sourceX, sourceY], middlePoint, [targetX, targetY]]);
    },
  },
});
</script>

<style scoped></style>
