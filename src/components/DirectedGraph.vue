<template>
  <svg width="900" height="900"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';
import { Node, Link, Dot } from '@/utils/types';

export default defineComponent({
  name: 'DirectedGraph',
  data: () => ({
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
    },
  }),
  mounted() {
    this.generateGraph(this.dataset);
  },
  methods: {
    generateGraph(dataset: { nodes: Array<Node>; links: Array<Link> }) {
      const svg = d3.select('svg').append('g');

      const RADIUS_CONST = 30;

      const dots = [
        { id: 1, source: 1, target: 2, row: 1 },
        { id: 2, source: 1, target: 5, row: 1 },
        { id: 3, source: 1, target: 5, row: 2 },
      ];

      const dotsLinks = [{ source: 1, target: 2 }];

      const link = svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(dataset.links)
        .enter()
        .append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

      const node = svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('rect')
        .data(dataset.nodes)
        .enter()
        .append('rect')
        .style('fill', 'lightblue')
        .attr('width', 40)
        .attr('height', 40)
        .call(
          d3
            .drag()
            .on('start', dragStart)
            .on('drag', dragged)
            .on('end', dragEnd)
        );

      const text = svg
        .append('g')
        .attr('class', 'text')
        .selectAll('text')
        .data(dataset.nodes)
        .enter()
        .append('text')
        .text((d: any) => d.id);

      const dot = svg
        .append('g')
        .attr('class', 'dots')
        .selectAll('circle')
        .data(dots)
        .enter()
        .append('circle')
        .attr('r', 3)
        .style('fill', 'black');

      const dotLink = svg
        .append('g')
        .attr('class', 'dot-links')
        .selectAll('path')
        .data(dotsLinks)
        .enter()
        .append('path')
        .attr('stroke', 'black')
        .attr('fill', 'none');

      const simulation = forceSimulation(dataset.nodes)
        .force(
          'link',
          d3
            .forceLink()
            .links(dataset.links)
            .id((d: any) => d.id)
            .distance(50)
        )
        .force('center', d3.forceCenter(900 / 2, 900 / 2));

      simulation
        .nodes(dataset.nodes)
        .force('charge', d3.forceManyBody().strength(0))
        .force(
          'collision',
          d3.forceCollide().radius((d: any) => d.radius)
        )
        .on('tick', ticked);

      simulation.force('link').links(link);

      function ticked() {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node.attr('x', (d: any) => d.x - 20).attr('y', (d: any) => d.y - 20);

        text.attr('x', (d: any) => d.x - 5).attr('y', (d: any) => d.y + 5);

        dot
          .attr('cx', (d: Dot) => {
            const sourceNode = node.data().find((e: any) => e.id === d.source);
            const targetNode = node.data().find((e: any) => e.id === d.target);
            const center = [sourceNode.x, sourceNode.y];
            const radius = RADIUS_CONST + d.row * 10;
            const target = [targetNode.x, targetNode.y];

            let v = [target[0] - center[0], target[1] - center[1]];
            const vLen = Math.hypot(v[0], v[1]);
            v = [v[0] / vLen, v[1] / vLen];
            const point = [
              center[0] + v[0] * radius,
              center[1] + v[1] * radius,
            ];
            return point[0];
          })
          .attr('cy', (d: Dot) => {
            const sourceNode = node.data().find((e: any) => e.id === d.source);
            const targetNode = node.data().find((e: any) => e.id === d.target);
            const center = [sourceNode.x, sourceNode.y];
            const radius = RADIUS_CONST + d.row * 10;
            const target = [targetNode.x, targetNode.y];

            let v = [target[0] - center[0], target[1] - center[1]];
            const vLen = Math.hypot(v[0], v[1]);
            v = [v[0] / vLen, v[1] / vLen];
            const point = [
              center[0] + v[0] * radius,
              center[1] + v[1] * radius,
            ];
            return point[1];
          });

        dotLink.attr('d', (d: Link) => {
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

          const radius = RADIUS_CONST + sourceDot.__data__.row * 10;

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
        });
      }

      function dragStart(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fy = d.y;
        d.fx = d.x;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragEnd(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    },
  },
});
</script>

<style scoped></style>
