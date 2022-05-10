<template>
  <TheMenu />
  <DirectedGraph />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DirectedGraph from './components/DirectedGraph.vue';
import TheMenu from '@/components/TheMenu.vue';

export default defineComponent({
  name: 'App',
  components: {
    TheMenu,
    DirectedGraph,
  },
});
</script>

<style lang="scss">
@import 'src/style/colors';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

.base-button {
  background-color: $primary;
  color: $text-color;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  height: max-content;
  &:hover,
  &:focus {
    background-color: $light;
  }
  &:disabled {
    background-color: #e1e2e1;
    cursor: auto;
  }
}
</style>
