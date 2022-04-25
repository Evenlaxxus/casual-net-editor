<template>
  <DirectedGraph />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DirectedGraph from './components/DirectedGraph.vue';

export default defineComponent({
  name: 'App',
  components: {
    DirectedGraph,
  },
});
</script>

<style>
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
</style>
