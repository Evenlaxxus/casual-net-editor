<template>
  <div class="menu">
    <div class="menu__control-buttons" v-if="isControlPanelVisible">
      <input
        v-if="actionType === 'add_node' || actionType === 'edit_node'"
        type="text"
        v-model="nodeText"
        @input="(event) => (nodeText = event.target.value)"
      />
      <button class="base-button menu__apply" @click="apply">Apply</button>
      <button class="base-button menu__cancel" @click="clearAll">Cancel</button>
    </div>
    <div class="menu__action-buttons">
      <LoadButton />
      <button class="base-button" @click="addNode">Add node</button>
      <button class="base-button" :disabled="!selectedNode" @click="addLink">
        Add link
      </button>
      <button class="base-button" :disabled="!selectedNode" @click="addBinding">
        Add binding
      </button>
      <button class="base-button" :disabled="!selectedNode" @click="deleteNode">
        Delete node
      </button>
      <button
        class="base-button"
        :disabled="!selectedNode"
        @click="editNodeText"
      >
        Edit text
      </button>
      <button class="base-button" :disabled="!selectedLink" @click="deleteLink">
        Delete link
      </button>
      <button
        class="base-button"
        :disabled="!selectedDot"
        @click="deleteBinding"
      >
        Delete binding
      </button>
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
      'selectedLink',
      'selectedDot',
      'selectedTargetNodes',
      'getNodeById',
    ]),
  },
  data: () => ({
    isControlPanelVisible: false,
    actionType: '',
    nodeText: '',
  }),
  methods: {
    ...mapActions([
      'insertNode',
      'insertLink',
      'insertBinding',
      'setSelectedNode',
      'setSelectedLink',
      'setSelectedDot',
      'setSelectedTargetNodes',
      'removeNode',
      'removeLink',
      'removeBinding',
      'changeOnClickToTargetNodes',
      'changeOnClickToDefault',
      'editNodeDescription',
    ]),
    addNode() {
      this.isControlPanelVisible = true;
      this.actionType = 'add_node';
    },
    addLink() {
      this.isControlPanelVisible = true;
      this.changeOnClickToTargetNodes();
      this.actionType = 'add_link';
      this.openToast('Select target node.', 'info', 5000, true);
    },
    addBinding() {
      this.isControlPanelVisible = true;
      this.changeOnClickToTargetNodes();
      this.actionType = 'add_binding';
      this.openToast('Select target nodes.', 'info', 5000, true);
    },
    editNodeText() {
      this.nodeText = this.dataset.nodes.find(
        (e) => e.id === this.selectedNode
      ).text;
      this.isControlPanelVisible = true;
      this.actionType = 'edit_node';
    },
    deleteNode() {
      this.removeNode(this.selectedNode);
      this.clearAll();
    },
    deleteLink() {
      this.removeLink(this.selectedLink);
      this.clearAll();
    },
    deleteBinding() {
      this.removeBinding(this.selectedDot);
      this.clearAll();
    },
    clearAll() {
      this.getNodeById('#node' + this.selectedNode).style('fill', 'lightblue');
      this.selectedTargetNodes.map((e) =>
        this.getNodeById('#node' + e).style('fill', 'lightblue')
      );
      this.setSelectedNode(null);
      this.setSelectedLink(null);
      this.setSelectedDot(null);
      this.setSelectedTargetNodes([]);
      this.isControlPanelVisible = false;
      this.changeOnClickToDefault();
    },
    apply() {
      if (this.actionType === 'add_node') {
        if (this.nodeText) {
          const nextId = Math.max(...this.dataset.nodes.map((e) => e.id)) + 1;
          this.insertNode({
            id: nextId,
            x: Math.random() * 600,
            y: Math.random() * 600,
            text: this.nodeText,
          });
          this.openToast('New node added.', 'success', 5000, true);
        } else {
          this.openToast('Define node text.', 'success', 5000, true);
        }
      }
      if (this.actionType === 'add_link') {
        if (this.selectedTargetNodes.length === 1) {
          const nextId = Math.max(...this.dataset.links.map((e) => e.id)) + 1;

          this.insertLink({
            id: nextId,
            source: this.selectedNode,
            target: this.selectedTargetNodes[0],
          });

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
        } else {
          this.openToast('Selected too many nodes.', 'error', 5000, true);
        }
      }
      if (this.actionType === 'add_binding') {
        if (this.selectedTargetNodes.length > 0) {
          this.insertBinding({
            source: this.selectedNode,
            target: this.selectedTargetNodes,
          });
        }
      }
      if (this.actionType === 'edit_node') {
        this.editNodeDescription({
          id: this.selectedNode,
          text: this.nodeText,
        });
        this.openToast('Node text updated.', 'success', 5000, true);
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
