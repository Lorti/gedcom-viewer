import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import Viewer from '@/components/Viewer.vue';

Vue.use(VueCompositionApi);

describe('Viewer.vue', () => {
  it('renders dialog when a node gets selected', () => {
    const nodes = [
      { id: '1', settings: { label: 'Manuel Wieser' } } as Graph.Node,
      { id: '2', settings: { label: 'Manuel Timelthaler' } } as Graph.Node,
    ];

    const $store = {
      dispatch: jest.fn(),
      state: {
        nodes,
      },
    };

    let index = 0;
    const GraphComponent = Vue.extend({
      template: '<svg @click="select"/>',
      methods: {
        select() {
          this.$emit('select', nodes[index]);
          index += 1;
        },
      },
    });

    const wrapper = mount(Viewer as any, {
      mocks: { $store },
      stubs: { GraphComponent },
    });

    wrapper.find('svg').trigger('click');
    expect(wrapper.text()).toMatch('Manuel Wieser');

    wrapper.find('svg').trigger('click');
    expect(wrapper.text()).toMatch('Manuel Timelthaler');
  });
});
