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
  mounted() {
    this.setSvg('svg');
    this.generateGraph();
    console.log(
      graphPlacement(
        [
          {
            id: 0,
            name: 'Invite reviewers',
            incoming: [],
            outgoing: [
              [1, 2, 3],
              [2, 3, 4],
              [1, 3, 5],
              [1, 2, 6],
            ],
          },
          {
            id: 1,
            name: 'Get review 1',
            outgoing: [],
            incoming: [],
          },
          {
            id: 2,
            name: 'Get review 2',
            outgoing: [],
            incoming: [],
          },
          {
            id: 3,
            name: 'Get review 3',
            outgoing: [],
            incoming: [],
          },
          {
            id: 4,
            name: 'Time-out 1',
            outgoing: [],
            incoming: [],
          },
          {
            id: 5,
            name: 'Time-out 2',
            outgoing: [],
            incoming: [],
          },
          {
            id: 6,
            name: 'Time-out 3',
            outgoing: [],
            incoming: [],
          },
          {
            id: 7,
            name: 'Collect reviews',
            incoming: [
              [1, 2, 3],
              [2, 3, 4],
              [1, 3, 5],
              [1, 2, 6],
            ],
            outgoing: [[8]],
          },
          {
            id: 8,
            name: 'Decision',
            incoming: [],
            outgoing: [[9], [10], [11]],
          },
          {
            id: 9,
            name: 'Accept',
            incoming: [],
            outgoing: [[15]],
          },
          {
            id: 10,
            name: 'Reject',
            incoming: [],
            outgoing: [[15]],
          },
          {
            id: 11,
            name: 'Invite additional reviewer',
            incoming: [],
            outgoing: [[12], [13]],
          },
          {
            id: 12,
            name: 'Get review X',
            incoming: [],
            outgoing: [[8]],
          },
          {
            id: 13,
            name: 'Time-out X',
            incoming: [],
            outgoing: [[8]],
          },
          {
            id: 14,
            name: 'Start',
            incoming: [],
            outgoing: [[0]],
          },
          {
            id: 15,
            name: 'End',
            outgoing: [],
            incoming: [],
          },
        ],
        5
      )
    );
  },
  methods: {
    ...mapActions([
      'setSvg',
      'initLink',
      'initNode',
      'initDots',
      'initDotLinks',
      'initNodeIdText',
      'initNodeDescriptionText',
    ]),
    generateGraph() {
      this.initLink();

      this.initNode();

      this.initNodeIdText();

      this.initNodeDescriptionText();

      this.initDots();

      this.initDotLinks();
    },
  },
});
</script>

<style scoped></style>
