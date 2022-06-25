<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { HEIGHT, WIDTH } from '@/utils/consts';
import { graphPlacement } from '@/algorithms/graphPlacement/graphPlacement';
import { graph1 } from '@/assets/testGraphDefinitions';

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
      'dataset',
      'link',
      'node',
      'dot',
      'dotLinks',
      'nodeIdText',
    ]),
  },
  created() {
    this.setDataset(graphPlacement(graph1, 5));
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
