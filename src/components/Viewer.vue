<template>
  <div>
    <div class="container">
      <GraphComponent :data="state.graphData" @select="select($event)"/>
    </div>
    <ModalDialog v-if="state.selectedNode" :node="state.selectedNode" @close="select"/>
  </div>
</template>

<script lang="ts">
import {
  createComponent,
  reactive, computed,
  onMounted,
} from '@vue/composition-api';

import GraphComponent from '@/components/GraphComponent.vue';
import ModalDialog from '@/components/ModalDialog.vue';

export default createComponent({
  components: {
    GraphComponent,
    ModalDialog,
  },
  setup(props, { root }) {
    const state = reactive({
      selectedNode: undefined as Graph.Node | undefined,
      graphData: computed(() => root.$store.state),
    });

    function select(node: Graph.Node | undefined) {
      state.selectedNode = node;
    }

    onMounted(() => {
      root.$store.dispatch('load');
    });

    return {
      state,
      select,
    };
  },
});
</script>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    overflow: scroll;
  }
</style>
