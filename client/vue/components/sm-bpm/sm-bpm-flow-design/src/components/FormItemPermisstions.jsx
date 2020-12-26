import './FormItemPermisstions.less';
import '../../../../_utils/enum';

export default {
  name: 'FormItemPermisstions',
  inject: ['i18n'],
  props: {
    value: { type: Array, default: () => [] },
    edit: { type: Boolean, default: true },
  },
  data() {
    return {
      iValue: [],
      allRow: {
        key: 'all',
        label: '全选',
        view: true,
        edit: false,
        info: false,
      },
    };
  },
  computed: {
    columns: function() {
      let _columns = [
        {
          title: '字段',
          dataIndex: 'label',
        },
        {
          title: '查看',
          dataIndex: 'view',
          width: 46,
          customRender: (text, record, index) => {
            return this.customRender(text, record, index, 'view');
          },
        },
      ];

      let eidt = {
        title: '编辑',
        dataIndex: 'edit',
        width: 46,
        customRender: (text, record, index) => {
          return this.customRender(text, record, index, 'edit');
        },
      };

      let info = {
        title: '简报',
        dataIndex: 'info',
        width: 46,
        customRender: (text, record, index) => {
          return this.customRender(text, record, index, 'info');
        },
      };

      return this.edit ? [..._columns, eidt, info] : [..._columns, info];
    },
  },
  watch: {
    value: {
      handler: function(value, oldValue) {
        this.iValue = value || [];
      },
      immediate: true,
    },
  },
  created(){
    console.log(this.formItems);
  },
  methods: {
    isAllChecked(dataIndex) {
      for (let item of this.iValue) {
        if (!item[dataIndex]) {
          return false;
        }
      }
      return true;
    },
    isAllUnChecked(dataIndex) {
      for (let item of this.iValue) {
        if (item[dataIndex]) {
          return false;
        }
      }
      return true;
    },
    indeterminate(dataIndex) {
      return !this.isAllChecked(dataIndex) && !this.isAllUnChecked(dataIndex);
    },
    customRender(text, record, index, dataIndex) {
      return (
        <a-checkbox
          indeterminate={record === this.allRow ? this.indeterminate(dataIndex) : false}
          checked={record === this.allRow ? this.isAllChecked(dataIndex) : record[dataIndex]}
          onChange={$event => {
            let checked = $event.target.checked;
            if (record === this.allRow) {
              let allChecked = this.indeterminate(dataIndex) || this.isAllUnChecked(dataIndex);
              this.iValue.map(item => {
                item[dataIndex] = allChecked;
              });
            } else {
              record[dataIndex] = checked;
            }
            this.onChange();
          }}
        ></a-checkbox>
      );
    },
    onChange() {
      this.$emit('change', this.iValue);
      this.$emit('input', this.iValue);
    },
  },
  render() {
    return (
      <a-table
        rowKey="key"
        size="small"
        dataSource={[this.allRow, ...this.iValue]}
        columns={this.columns}
        pagination={false}
        customRow={(record, index) => {
          return {
            class: {
              all: index === 0,
            },
          };
        }}
      ></a-table>
    );
  },
};
