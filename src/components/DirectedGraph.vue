<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { HEIGHT, WIDTH } from '@/utils/consts';
import { graphPlacement } from '@/algorithms/graphPlacement/graphPlacement';

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
    this.setDataset(
      graphPlacement(
        [
          {
            id: 0,
            name: 'start',
            incoming: [[3]],
            outgoing: [[1, 2], [4]],
          },
          {
            id: 1,
            name: 'begin',
            incoming: [[0]],
            outgoing: [[3]],
          },
          {
            id: 2,
            name: 'begin 2',
            incoming: [[0]],
            outgoing: [[3]],
          },
          {
            id: 3,
            name: 'finalize',
            incoming: [[1], [2]],
            outgoing: [[0], [4]],
          },
          {
            id: 4,
            name: 'end',
            incoming: [[0], [3]],
            outgoing: [],
          },
        ],
        5
      )
    );
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
