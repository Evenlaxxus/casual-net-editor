<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
      'initLink',
      'initNode',
      'initDots',
      'initDotLinks',
      'initNodeIdText',
    ]),
    generateGraph() {
      this.initLink();

      this.initNode();

      this.initNodeIdText();

      this.initDots();

      this.initDotLinks();
    },
  },
});
</script>

<style scoped></style>
