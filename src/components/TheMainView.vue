<template>
  <TheMenu />
  <DirectedGraph />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DirectedGraph from '@/components/DirectedGraph.vue';
import TheMenu from '@/components/TheMenu.vue';

export default defineComponent({
  name: 'TheMainView',
  components: {
    TheMenu,
    DirectedGraph,
  },
});
</script>

<style scoped></style>
