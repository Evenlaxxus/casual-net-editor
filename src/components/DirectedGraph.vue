<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { HEIGHT, WIDTH } from '@/utils/consts';
import { graphPlacement } from '@/algorithms/graphPlacement/graphPlacement';
import { graph2 } from '@/assets/testGraphDefinitions';
import { getAllPossibleAggregations } from '@/algorithms/nodeAggregation/nodeAggregation';

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
    await this.setDataset(graphPlacement(graph2, 5));
    this.setPossibleAggregations(getAllPossibleAggregations(graph2));
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
      'setPossibleAggregations',
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
