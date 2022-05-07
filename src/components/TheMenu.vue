<template>
  <div class="header">
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

.header {
  height: 5vh;
  width: 100%;
  background-color: $primary;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>
