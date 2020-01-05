<template>
  <div class="dialog" @click="close">
    <div class="dialog__window">
      <h2>{{ node.settings.label }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    node: {
      type: Object as PropType<Graph.Node>,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
});
</script>

<style scoped>
  .dialog {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.25)
  }
  .dialog__window {
    padding: 1rem;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
  }
</style>
