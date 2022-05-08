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
import { mapGetters, mapActions } from 'vuex';
import { HTMLInputEvent } from '@/utils/types';

export default {
  name: 'LoadButton',
  computed: {
    ...mapGetters(['graphFile']),
  },
  methods: {
    ...mapActions(['setGraphFile']),
    onFileChange(e: HTMLInputEvent) {
      let files = e?.target?.files || e?.dataTransfer?.files;
      if (!files?.length) return;
      this.readFile(files[0]);
    },
    readFile(file: Blob) {
      let reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.setGraphFile(JSON.parse(e?.target?.result as string));
      };
      reader.readAsText(file);
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/colors';

.load-button {
  &__input {
    display: none;
  }
}
</style>
