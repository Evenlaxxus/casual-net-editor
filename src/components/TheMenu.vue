<template>
  <div class="menu">
    <div class="menu__control-buttons" v-if="isControlPanelVisible">
      <button class="base-button menu__apply" @click="apply">Apply</button>
      <button class="base-button menu__cancel" @click="clearAll">Cancel</button>
    </div>
    <div class="menu__action-buttons">
      <LoadButton />
      <button class="base-button" @click="addNode">Add node</button>
      <button class="base-button" :disabled="!selectedNode" @click="addLink">
        Add link
      </button>
      <button class="base-button" @click="addBinding">Add binding</button>
      <button class="base-button" :disabled="!selectedNode" @click="deleteNode">
        Delete node
      </button>
      <button class="base-button" @click="deleteLink">Delete link</button>
      <button class="base-button" @click="deleteBinding">Delete binding</button>
    </div>
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
    ...mapGetters([
      'node',
      'svg',
      'dataset',
      'selectedNode',
      'selectedTargetNodes',
      'getNodeById',
    ]),
  },
  data: () => ({
    isControlPanelVisible: false,
    applyType: '',
  }),
  methods: {
    ...mapActions([
      'insertNode',
      'insertLink',
      'setSelectedNode',
      'setSelectedTargetNodes',
      'removeNode',
      'removeLink',
      'changeOnClickToTargetNodes',
      'changeOnClickToDefault',
    ]),
    addNode() {
      const nextId = Math.max(...this.dataset.nodes.map((e) => e.id)) + 1;
      this.insertNode({
        id: nextId,
        x: Math.random() * 600,
        y: Math.random() * 600,
      });
      this.openToast('New node added.', 'success', 5000, true);
    },
    addLink() {
      this.isControlPanelVisible = true;
      this.changeOnClickToTargetNodes();
      this.applyType = 'add_link';
      this.openToast('Select target node.', 'info', 5000, true);
    },
    addBinding() {
      console.log('add binding');
    },
    deleteNode() {
      console.log('delete node');
      this.removeNode(this.selectedNode);
    },
    deleteLink() {
      console.log('delete link');
      this.removeLink(1);
    },
    deleteBinding() {
      console.log('delete binding');
    },
    clearAll() {
      this.getNodeById('#node' + this.selectedNode).style('fill', 'lightblue');
      this.selectedTargetNodes.map((e) =>
        this.getNodeById('#node' + e).style('fill', 'lightblue')
      );
      this.setSelectedNode(null);
      this.setSelectedTargetNodes([]);
      this.isControlPanelVisible = false;
    },
    apply() {
      if (this.applyType === 'add_link') {
        if (this.selectedTargetNodes.length === 1) {
          this.insertLink({
            source: this.selectedNode,
            target: this.selectedTargetNodes[0],
          });
          this.changeOnClickToDefault();

          this.openToast(
            'Link between nodes ' +
              this.selectedNode +
              ' and ' +
              this.selectedTargetNodes[0] +
              ' added.',
            'success',
            5000,
            true
          );
        }
      }
      this.clearAll();
    },
    openToast(
      message: string,
      type: string,
      duration: number,
      isDismissible: boolean
    ) {
      this.$toast.open({
        message: message,
        type: type,
        duration: duration,
        dismissible: isDismissible,
        position: 'top-left',
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import 'src/style/colors.scss';

.menu {
  width: 100%;
  position: fixed;
  bottom: 0;
  justify-content: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px 0;

  &__action-buttons,
  &__control-buttons {
    gap: 0 10px;
    display: flex;
  }

  &__apply {
    background-color: #2e7d32;
  }

  &__cancel {
    background-color: #c62828;
  }
}
</style>
