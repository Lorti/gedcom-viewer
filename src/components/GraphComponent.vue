<template>
  <svg v-draw="data"/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import graph, { Data } from './graph';

export default Vue.extend({
  props: {
    data: Object as PropType<Data>,
  },
  directives: {
    draw(el, binding, vnode) {
      if (binding.value) {
        graph(binding.value, (node: Graph.Node) => {
          if (vnode.context) {
            vnode.context.$emit('select', node);
          }
        });
      }
    },
  },
});
</script>

<style>
  g.cluster > rect {
    fill: none;
  }

  text {
    font-weight: lighter;
    font-size: 0.75rem;
  }

  .node {
    cursor: pointer;
  }
  .node rect {
    stroke: #999;
    fill: #fff;
  }

  .edgePath path {
    stroke: #333;
    fill: none;
  }

  .highlight path,
  .highlight rect {
    stroke: crimson !important;
    stroke-width: 2 !important;
  }
  .highlight text {
    fill: crimson !important;
  }

  .highlight--strong path,
  .highlight--strong rect {
    stroke: crimson !important;
    stroke-width: 4 !important;
  }
  .highlight--strong text {
    fill: crimson !important;
  }
</style>
