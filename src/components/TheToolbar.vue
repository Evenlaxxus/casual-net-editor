<template>
  <div v-if="isToolbarVisible" class="toolbar">
    <div class="toolbar__header">Toolbar</div>
    <div class="toolbar__fields">
      <div class="toolbar__field">
        <input name="source" />
      </div>
    </div>
    <div class="toolbar__actions"></div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';

export default {
  name: 'TheToolbar',
  computed: {
    ...mapGetters(['isToolbarVisible']),
  },
};
</script>

<style scoped lang="scss">
.toolbar {
  border: 1px solid black;
  width: 30%;
  position: absolute;
  bottom: 5vh;
}
</style>
