<template>
  <div>
    <div class="container">
      <svg/>
    </div>
    <ModalDialog v-if="selectedNode" :node="selectedNode" @close="selectedNode = undefined"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import graph from './graph';
import ModalDialog from '@/components/ModalDialog.vue';

export default Vue.extend({
  components: {
    ModalDialog,
  },
  data() {
    return {
      selectedNode: undefined as Graph.Node | undefined,
    };
  },
  async mounted() {
    await this.$store.dispatch('load');
    const events = graph(this.$store.state);
    events.$on('select', (node: Graph.Node) => {
      this.selectedNode = node;
    });
  },
});
</script>

<style>
  .container {
    width: 100vw;
    height: 100vh;
    overflow: scroll;
  }

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
