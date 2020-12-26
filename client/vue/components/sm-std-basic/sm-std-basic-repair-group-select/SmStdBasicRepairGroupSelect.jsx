import { requestIsSuccess, vIf, vP } from '../../_utils/utils';
import ApiRepairGroup from '../../sm-api/sm-std-basic/RepairGroup';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import permissionsSmStdBasic from '../../_permissions/sm-std-basic';
import './style/index.less';

let apiRepairGroup = new ApiRepairGroup();
let regular = /^([1-9][0-9]*)$/;

export default {
  name: 'SmStdBasicRepairGroupSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    parentId: { type: String, default: null }, //父级id
    value: { type: [Array, String], default: undefined }, //返回值
    disabled: { type: Boolean, default: false }, //是否禁用
    allowClear: { type: Boolean, default: true }, //是否清除
    showSearch: { type: Boolean, default: false }, //是否显示搜索
    placeholder: { type: String, default: '请选择' }, //是否显示搜索
    isTop: { type: Boolean, default: false }, //是否是顶级
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      showEditIcon: false, // 是否显示编辑图标
      selectItems: [],
      iValue: undefined,
      open: false, // select 组件的打开属性
      inputState: false, // 输入框的状态，用于新增内容
      iParentId: null,
      inputValue: '', // 输入框中的值
      inputOrder: '', //输入框中的序号
      isEdit: false, // 是否编辑
      editId: null, // 编辑状态的id
    };
  },

  computed: {},
  watch: {
    value: {
      handler: function (n, o) {
        this.iValue = n;
      },
      immediate: true,
    },
    dataSource: {
      handler(nVal, oVal) {
        this.selectItems = nVal || [];
      },
      immediate: true,
    },
    parentId: {
      handler: function (v, o) {
        this.selectItems = [];
        this.iParentId = v;
        if (v) {
          this.getData();
        }
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    if (this.isTop) {
      await this.getData();
    }
  },
  methods: {
    // 初始化axios
    initAxios() {
      apiRepairGroup = new ApiRepairGroup(this.axios);
    },
    async getData() {
      let response = await apiRepairGroup.getTreeList({ parentId: this.iParentId });
      if (requestIsSuccess(response)) {
        let _selectItems = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'order', targetProp: 'order' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.selectItems = _selectItems;
      }
    },
    // 保存分组信息
    async saveTag() {
      if (this.isEdit) {
        this.editGroup(this.editId);
      } else {
        // 保存数据
        if (this.inputOrder == '' || !regular.test(this.inputOrder)) {
          this.$message.error('请输入正确的正整数序号');
        } else {
          let param = {
            parentId: this.iParentId,
            name: this.inputValue,
            order: this.inputOrder,
          };
          let response = await apiRepairGroup.create(param);
          if (requestIsSuccess(response)) {
            if (response.data) {
              this.getData();
              this.inputState = false;
            }
          }
        }
      }
    },
    // 编辑分组信息
    async editGroup(id) {
      if (this.inputOrder == '' || !regular.test(this.inputOrder)) {
        this.$message.error('请输入正确的正整数序号');
      } else {
        let param = {
          id,
          parentId: this.iParentId,
          name: this.inputValue,
          Order: this.inputOrder,
        };
        let response = await apiRepairGroup.update(param);
        if (requestIsSuccess(response)) {
          if (response.data) {
            //刷新数据
            this.getData();
            this.inputState = false;
          }
        }
      }
    },
    // 数据搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  render() {
    return (
      <div class="f-select-content" ref="root">
        <a-select
          disabled={this.disabled}
          ref="groupSelect"
          open={this.open}
          allowClear={this.allowClear}
          placeholder={this.placeholder}
          option-filter-prop="children"
          style="width: 100%"
          // filterOption={this.filterOption}
          dropdownMatchSelectWidth
          notFoundContent="暂无数据"
          onFocus={() => {
            this.open = true;
          }}
          onBlur={() => {
            if (!this.inputState) {
              this.open = false;
            }
          }}
          value={this.iValue}
          onChange={v => {
            this.open = false;
            this.iValue = v;
            this.$emit('change', v);
            this.$refs.groupSelect.blur();
          }}
          onSelect={() => {
            if (!this.inputState) {
              this.open = false;
            }
          }}
          getPopupContainer={() => this.$refs.root}
          // 下拉扩展
          dropdownRender={(vnode, props) => {
            return (
              <div>
                {vnode}
                <a-divider style={{ margin: '4px 0' }} />
                <div style={{ padding: '8px', cursor: 'pointer', textAlign: 'center' }}>
                  {this.inputState ? (
                    <div class="f-tag-add">
                      {/* 新增标签 */}
                      <a-input
                        value={this.inputValue}
                        placeholder="类型或名称..."
                        size="small"
                        onChange={e => (this.inputValue = e.target.value)}
                      />
                      <a-input
                        value={this.inputOrder}
                        placeholder="序号..."
                        size="small"
                        style='width:60px;margin-left: 8px;'
                        onChange={e => (this.inputOrder = e.target.value)}
                      />
                      <a-button type="primary" size="small" onClick={() => this.saveTag()}>
                        保存
                      </a-button>
                      <a-button
                        size="small"
                        onClick={() => {
                          this.inputState = false;
                          // 点击取消时下拉框需要重新获取焦点
                          this.$refs.groupSelect.focus();
                          this.isEdit = false;
                          this.editId = null;
                        }}
                      >
                        {' '}
                        取消
                      </a-button>
                    </div>
                  ) : this.parentId !== null || this.isTop ?
                    vIf(
                      <a-icon
                        type="plus"
                        onClick={() => {
                          this.inputState = true;
                          this.open = true;
                          this.isEdit = false;
                        }}
                      />,
                      vP(this.permissions, permissionsSmStdBasic.RepairGroup.Update),
                    )
                    : (
                      undefined
                    )}
                </div>
              </div>
            );
          }}
        >
          {this.selectItems.map(a => {
            return (
              <a-select-option value={a.id}>
                <div class="f-select-option-item">
                  <span class="item-title">{a.order + '.' + a.title}</span>
                  {/* 编辑操作 */}
                  {vIf(
                    <div class="f-select-edit">
                      <a-icon
                        class="f-select-edit-icon"
                        type="edit"
                        onClick={e => {
                          e.stopPropagation();
                          // 准备编辑
                          this.inputState = true;
                          this.isEdit = true;
                          this.inputValue = a.title;
                          this.inputOrder = a.order;
                          this.editId = a.id;
                        }}
                      />
                    </div>,
                    vP(this.permissions, permissionsSmStdBasic.RepairGroup.Update),
                  )}

                </div>
              </a-select-option>
            );
          })}
        </a-select>
      </div>
    );
  },
};
