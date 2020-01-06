<template>
  <div id="app">
    <Viewer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Viewer from './components/Viewer.vue';

export default Vue.extend({
  components: {
    Viewer,
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
