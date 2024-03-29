<template>
  <svg :width="windowWidth" :height="windowHeight"></svg>
  <div class="tester-buttons">
    <button class="base-button" @click="launchTests">Test</button>
  </div>
</template>

<script>
import { HEIGHT, WIDTH } from '@/utils/consts';
import { mapActions, mapGetters } from 'vuex';
import { defineComponent } from 'vue';
import { graphPlacement } from '@/algorithms/graphPlacement/graphPlacement';
import {
  ANDgraph,
  graph1,
  graph2,
  long,
  ORgraph,
  XORgraph,
  parallel,
  correctAggregations,
} from '@/assets/testGraphDefinitions';
import { test, testAggregations } from '@/algorithms/tester/tester';
import { getAllPossibleAggregations } from '@/algorithms/nodeAggregation/nodeAggregation';

export default defineComponent({
  name: 'TheTester',
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
  methods: {
    ...mapActions([
      'setSvg',
      'initLink',
      'initNode',
      'initDots',
      'initDotLinks',
      'initNodeText',
      'setDataset',
      'setPossibleAggregations',
    ]),

    async launchTests() {
      const W = 5;
      await this.setDataset(graphPlacement(parallel, W));
      this.setSvg('svg');
      this.generateGraph();
      const test2Result = testAggregations(
        getAllPossibleAggregations(parallel),
        correctAggregations['parallel']
      );
      console.log(
        `${test2Result.maxVertex};${test2Result.correct};${test2Result.missing};${test2Result.errors}`
      );
      const testResult = test(this.dataset, this.svg);
      console.log(
        `${W}; ${testResult.edgeCrossings}; ${
          testResult.graphSize
        }; ${testResult.totalEdgeLength
          .toString()
          .replace('.', ',')}; ${testResult.maxEdgeLength
          .toString()
          .replace('.', ',')}; ${testResult.proportions
          .toString()
          .replace('.', ',')}; ${testResult.numberOfBends}; ${
          testResult.maxNumberOfBends
        }`
      );
    },

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

<style scoped lang="scss">
.tester-buttons {
  width: 100%;
  position: fixed;
  bottom: 0;
  justify-content: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px 0;
}
</style>
