<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { HEIGHT, WIDTH } from '@/utils/consts';
import { graphPlacement } from '@/algorithms/graphPlacement/graphPlacement';
import { graph1, graph2, graph3 } from '@/assets/testGraphDefinitions';
import { getAllPossibleAggregations } from '@/algorithms/graphPlacement/nodeAggregation';

export default defineComponent({
  name: 'DirectedGraph',
  data: () => ({
    windowWidth: WIDTH,
    windowHeight: HEIGHT,
  }),
  computed: {
    ...mapGetters([
      'svg',
      'dataset',
      'link',
      'node',
      'dot',
      'dotLinks',
      'nodeIdText',
    ]),
  },
  async created() {
    await this.setDataset(graphPlacement(graph1, 5));
    this.setAggregations([
      [0, 1],
      [0, 2],
      [0, 1, 3],
    ]);
  },
  mounted() {
    this.setSvg('svg');
    this.generateGraph();
  },
  methods: {
    ...mapActions([
      'setSvg',
      'initLink',
      'initNode',
      'initDots',
      'initDotLinks',
      'initNodeIdText',
      'initNodeText',
      'setDataset',
      'setAggregations',
      'drawAggregations',
    ]),
    generateGraph() {
      this.initLink();

      this.initNode();

      this.initNodeText();

      this.initDots();

      this.initDotLinks();
    },
  },
});
</script>

<style scoped></style>
