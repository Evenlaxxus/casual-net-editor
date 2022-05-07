<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from 'd3';
import { Node, Link, Dot } from '@/utils/types';
import { mapActions, mapGetters } from 'vuex';
import { HEIGHT, WIDTH } from '@/utils/consts';

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

      const simulationTick = () => {
        const setDotPosition = (d: Dot, axis: string, baseRadius: number) => {
          const sourceNode = this.node
            .data()
            .find((e: any) => e.id === d.source);
          const targetNode = this.node
            .data()
            .find((e: any) => e.id === d.target);
          const center = [sourceNode.x, sourceNode.y];
          const radius = baseRadius + d.row * 10;
          const target = [targetNode.x, targetNode.y];

          let v = [target[0] - center[0], target[1] - center[1]];
          const vLen = Math.hypot(v[0], v[1]);
          v = [v[0] / vLen, v[1] / vLen];
          const point = [center[0] + v[0] * radius, center[1] + v[1] * radius];
          if (axis === 'X') return point[0];
          return point[1];
        };
        const setDotsArc = (
          d: Link,
          dot: any,
          node: any,
          baseRadius: number
        ) => {
          const sourceDot = dot._groups[0].find(
            (e: any) => e.__data__.id === d.source
          );
          const targetDot = dot._groups[0].find(
            (e: any) => e.__data__.id === d.target
          );
          const sourceNode = node
            .data()
            .find((e: any) => e.id === sourceDot.__data__.source);
          const curve = d3.line().curve(d3.curveNatural);
          const sourceX = parseFloat(sourceDot.getAttribute('cx'));
          const sourceY = parseFloat(sourceDot.getAttribute('cy'));
          const targetX = parseFloat(targetDot.getAttribute('cx'));
          const targetY = parseFloat(targetDot.getAttribute('cy'));

          const radius = baseRadius + sourceDot.__data__.row * 10;

          const a = [sourceX - sourceNode.x, sourceY - sourceNode.y];
          const b = [targetX - sourceNode.x, targetY - sourceNode.y];
          let m = [a[0] + b[0], a[1] + b[1]];
          const mLen = Math.hypot(m[0], m[1]);
          m = [m[0] / mLen, m[1] / mLen];
          const middlePoint = [
            sourceNode.x + m[0] * radius,
            sourceNode.y + m[1] * radius,
          ];
          return curve([[sourceX, sourceY], middlePoint, [targetX, targetY]]);
        };

        this.link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        this.node
          .attr('x', (d: any) => d.x - 20)
          .attr('y', (d: any) => d.y - 20);

        this.nodeIdText
          .attr('x', (d: any) => d.x - 5)
          .attr('y', (d: any) => d.y + 5);

        this.dot
          .attr('cx', (d: Dot) => setDotPosition(d, 'X', this.RADIUS_CONST))
          .attr('cy', (d: Dot) => setDotPosition(d, 'Y', this.RADIUS_CONST));

        this.dotLinks.attr('d', (d: Link) =>
          setDotsArc(d, this.dot, this.node, this.RADIUS_CONST)
        );
      };
      this.simulateNodes(this.simulation, this.dataset.nodes, simulationTick);

      this.simulation.force('link').links(this.link);
    },
    simulateNodes(simulation: any, nodes: Array<Node>, ticked: () => void) {
      simulation
        .nodes(nodes)
        .force('charge', d3.forceManyBody().strength(0))
        .force(
          'collision',
          d3.forceCollide().radius((d: any) => d.radius)
        )
        .on('tick', ticked);
    },
  },
});
</script>

<style scoped></style>
