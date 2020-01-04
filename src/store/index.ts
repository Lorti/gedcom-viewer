import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface State {
  nodes: Array<Graph.Node>,
  families: Array<Graph.Family>,
  edges: Array<Graph.Edge>,
}

export default new Vuex.Store({
  state: {
    nodes: [],
    families: [],
    edges: [],
  } as State,
  mutations: {
    load(state, data: State) {
      state.nodes = data.nodes;
      state.families = data.families;
      state.edges = data.edges;
    },
  },
  actions: {
    async load({ commit }) {
      const response = await fetch('graph.json');
      const data = await response.json();
      commit('load', data);
    },
  },
  modules: {},
});
