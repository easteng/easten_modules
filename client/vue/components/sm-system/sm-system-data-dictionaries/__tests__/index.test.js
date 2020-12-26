import SmSystemDataDictionaries from '../index';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';

describe('SmSystemDataDictionaries', () => {
  const wrapper = mount(SmSystemDataDictionaries);
  expect(wrapper.contains('.sc-table-operator-buttons')).toBe(true);
  // wrapper.find('.sc-table-operator-buttons .ant-btn ant-btn-primary').trigger('click');
  // wrapper.vm.$nextTick(()=>{
  //   expect()
  // })
});
