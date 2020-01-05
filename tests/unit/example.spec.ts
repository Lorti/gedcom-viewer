import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/Graph.vue';

describe('Graph.vue', () => {
  it('renders props.msg when passed', () => {
    const $store = {
      dispatch: jest.fn(),
      state: {
        nodes: [{ id: 1, settings: { label: 'Manuel Wieser' } }],
      },
    };
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      mocks: { $store },
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
