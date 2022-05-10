<template>
  <div class="menu">
    <LoadButton />
    <button class="base-button" @click="addNode">Add node</button>
    <button class="base-button" @click="addLink">Add link</button>
    <button class="base-button" @click="addBinding">Add binding</button>
    <button class="base-button" @click="deleteNode">Delete node</button>
    <button class="base-button" @click="deleteLink">Delete link</button>
    <button class="base-button" @click="deleteBinding">Delete binding</button>
  </div>
</template>

<script lang="ts">
import LoadButton from '@/components/buttons/LoadButton';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'TheMenu',
  components: { LoadButton },
  computed: {
    ...mapGetters(['node', 'svg', 'dataset']),
  },
  methods: {
    ...mapActions(['insertNode']),
    addNode() {
      this.insertNode({ id: 7, x: 645, y: 565 });

      // this.svg
      //   .select('g.nodes')
      //   .selectAll('rect')
      //   .data(this.dataset.nodes)
      //   .enter()
      //   .on('click', (e, d) => {
      //     console.log('test');
      //   });

      // console.log(this.node.data(d => d))
      // this.node.each((d) => {
      //   console.log(d);
      // });
      // this.node.select('node1').style('fill', 'red');
      // this.node.on('click', (e, d) => console.log(e.target));
      // this.node.style('fill', (d) => (d.id === 1 ? 'red' : 'lightblue'));
    },
    addLink() {
      console.log('add link');
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
