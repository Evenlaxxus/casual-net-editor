<template>
  <div class="load-button">
    <input
      ref="file"
      class="load-button__input"
      @change="onFileChange($event)"
      type="file"
    />
    <button class="load-button__button" @click="$refs.file.click()">
      Load model
    </button>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LoadButton',
  computed: {
    ...mapGetters(['graphFile']),
  },
  methods: {
    ...mapActions(['setGraphFile']),
    onFileChange(e: any) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.readFile(files[0]);
    },
    readFile(file: Blob) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.setGraphFile(JSON.parse(e.target.result));
      };
      reader.readAsText(file);
    },
  },
};
</script>

<style scoped lang="scss">
@import 'src/style/colors';

.load-button {
  &__input {
    display: none;
  }

  &__button {
    background-color: $light;
    color: $text-color;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>
