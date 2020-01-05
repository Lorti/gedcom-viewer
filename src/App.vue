<template>
  <div id="app">
    <Graph/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Graph from './components/Graph.vue';

export default Vue.extend({
  components: {
    Graph,
  },
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  cursor: default;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
