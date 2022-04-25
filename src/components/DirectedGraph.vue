<template>
  <svg width="900" height="900"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';

export default defineComponent({
  name: 'DirectedGraph',
  data: () => ({
    dataset: {
      nodes: [
        { id: 1, x: 433, y: 413 },
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
    generateGraph(dataset: {
      nodes: Array<{ id: number; x: number; y: number }>;
      links: Array<{ source: number; target: number }>;
    }) {
      const svg = d3.select('svg').append('g');

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
        .selectAll('circle')
        .data(dataset.nodes)
        .enter()
        .append('circle')
        .style('fill', 'lightblue')
        .attr('r', 20)
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

        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

        text.attr('x', (d: any) => d.x - 5).attr('y', (d: any) => d.y + 5);
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
