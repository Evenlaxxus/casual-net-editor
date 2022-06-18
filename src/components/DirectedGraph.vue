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
            incoming: [],
            outgoing: [[1, 2], [3], [4]],
          },
          {
            id: 1,
            name: 'start',
            incoming: [],
            outgoing: [[3]],
          },
          {
            id: 2,
            name: 'start',
            incoming: [],
            outgoing: [[3]],
          },
          {
            id: 3,
            name: 'start',
            incoming: [],
            outgoing: [[4]],
          },
          {
            id: 4,
            name: 'start',
            incoming: [],
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

    console.log(this.dataset);
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
