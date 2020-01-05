<template>
  <svg/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import graph from './graph';

@Component
export default class HelloWorld extends Vue {
  async mounted() {
    await this.$store.dispatch('load');
    graph(this.$store.state);
  }
}
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
