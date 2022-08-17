<template>
  <div class="load-button">
    <input
      ref="file"
      class="load-button__input"
      @change="onFileChange($event)"
      type="file"
      accept="application/json"
    />
    <button class="base-button" @click="$refs.file.click()">Load model</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { HTMLInputEvent } from '@/utils/types';
import { getAllPossibleAggregations } from '@/algorithms/nodeAggregation/nodeAggregation';
import { graphPlacement } from '@/algorithms/graphPlacement/graphPlacement';

export default defineComponent({
  name: 'LoadButton',
  computed: {
    ...mapGetters(['graphFile']),
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
    onFileChange(e: HTMLInputEvent) {
      let files = e?.target?.files || e?.dataTransfer?.files;
      if (!files?.length) return;
      this.readFile(files[0]);
    },
    readFile(file: Blob) {
      let reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const model = JSON.parse(e?.target?.result as string);
        console.log(model);
        await this.setDataset(graphPlacement(model, 5));
        this.setPossibleAggregations(getAllPossibleAggregations(model));
        this.setSvg('svg');
        this.generateGraph();
      };
      reader.readAsText(file);
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
@import '../../style/colors';

.load-button {
  &__input {
    display: none;
  }
}
</style>
