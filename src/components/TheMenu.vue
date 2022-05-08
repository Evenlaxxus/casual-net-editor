<template>
  <div class="menu">
    <LoadButton />
    <button class="base-button" @click="setIsToolbarVisible(true)">test</button>
  </div>
</template>

<script>
import LoadButton from '@/components/buttons/LoadButton';
import { mapActions } from 'vuex';

export default {
  name: 'TheMenu',
  components: { LoadButton },
  methods: {
    ...mapActions(['setIsToolbarVisible']),
  },
};
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
