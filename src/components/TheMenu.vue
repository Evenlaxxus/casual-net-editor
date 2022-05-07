<template>
  <div class="menu">
    <LoadButton />
  </div>
</template>

<script>
import LoadButton from '@/components/LoadButton';

export default {
  name: 'TheMenu',
  components: { LoadButton },
};
</script>

<style scoped lang="scss">
@import 'src/style/colors.scss';

.menu {
  height: 5vh;
  width: 100%;
  background-color: $primary;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 10px;
}
</style>
