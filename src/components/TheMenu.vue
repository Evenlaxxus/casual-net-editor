<template>
  <div class="menu">
    <LoadButton />
    <button class="base-button" @click="addNode">Add node</button>
    <button class="base-button" :disabled="!selectedNode" @click="addLink">
      Add link
    </button>
    <button class="base-button" @click="addBinding">Add binding</button>
    <button class="base-button" @click="deleteNode">Delete node</button>
    <button class="base-button" @click="deleteLink">Delete link</button>
    <button class="base-button" @click="deleteBinding">Delete binding</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadButton from '@/components/buttons/LoadButton.vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'TheMenu',
  components: { LoadButton },
  computed: {
    ...mapGetters(['node', 'svg', 'dataset', 'selectedNode']),
  },
  methods: {
    ...mapActions(['insertNode', 'setSelectedNode']),
    addNode() {
      const nextId = Math.max(...this.dataset.nodes.map((e) => e.id)) + 1;
      this.insertNode({
        id: nextId,
        x: Math.random() * 600,
        y: Math.random() * 600,
      });
    },
    addLink() {
      console.log('add link');
      console.log(this.selectedNode);
    },
    addBinding() {
      console.log('add binding');
    },
    deleteNode() {
      console.log('delete node');
    },
    deleteLink() {
      console.log('delete link');
    },
    deleteBinding() {
      console.log('delete binding');
    },
  },
});
</script>

<style scoped lang="scss">
@import 'src/style/colors.scss';

.menu {
  height: 5vh;
  width: 100%;
  position: fixed;
  bottom: 0;
  justify-content: center;
  padding: 10px;
  display: flex;
  gap: 0 10px;
}
</style>
