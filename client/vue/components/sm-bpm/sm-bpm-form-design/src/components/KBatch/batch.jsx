/*
 * @Description: 动态表格 用于批量填入数据
 * @Author: kcz
 * @Date: 2020-03-27 18:36:56
 * @LastEditors: kcz
 * @LastEditTime: 2020-04-02 20:39:54
 *
 */

import './index.less';
import KFormModelItem from './module/KFormModelItem';
export default {
  name: 'KBatch',
  components: {
    KFormModelItem,
  },
  props: ['record', 'value', 'dynamicData', 'parentDisabled'],
  data() {
    return {
      dynamicValidateForm: {
        domains: [],
      },
    };
  },
  computed: {
    columns() {
      let columns = [];
      if (!this.record.options.hideSequence) {
        // columns.push({
        //   title: '序号',
        //   dataIndex: 'sequence_index_number',
        //   width: '60px',
        //   align: 'center',
        //   customRender: (text, record, index) => {
        //     return index + 1;
        //   },
        // });
      }     
      columns.push(
        ...this.record.list.map((item, index) => {
          return {
            title: item.label,
            dataIndex: item.key,
            width: index === this.record.list.length - 1 ? '' : '190px',
            scopedSlots: { customRender: item.key },
          };
        }),
      );

      columns.push({
        title: '操作',
        dataIndex: 'dynamic-delete-button',
        fixed: 'right',
        width: '80px',
        align: 'center',
        scopedSlots: { customRender: 'dynamic-delete-button' },
      });

      return columns;
    },
    disabled() {
      return this.record.options.disabled || this.parentDisabled;
    },
  },
  watch: {
    value: {
      // value 需要深度监听及默认先执行handler函数
      handler(val) {
        if(val!=undefined){
          val=Array.from(val).sort(this.sortBy('number'));
        }
        this.dynamicValidateForm.domains = val || [];
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    validationSubform() {
      let verification;
      this.$refs.dynamicValidateForm.validate(valid => {
        verification = valid;
      });
      return verification;
    },
    resetForm() {
      this.$refs.dynamicValidateForm.resetFields();
    },
    removeDomain(item) {
      const index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      let data = {};
      this.record.list.forEach(item => {
        data[item.model] = item.options.defaultValue;
      });

      this.dynamicValidateForm.domains.push({
        ...data,
        key: Date.now(),
      });
      this.handleInput();
    },
    handleInput() {
      this.$emit('change', this.dynamicValidateForm.domains);
    },
    // 自定义一个排序方法
    sortBy(attr,rev){
      //第二个参数没有传递 默认升序排列
      if(rev ==  undefined){
        rev = 1;
      }else{
        rev = (rev) ? 1 : -1;
      }
      
      return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
          return rev * -1;
        }
        if(a > b){
          return rev * 1;
        }
        return 0;
      };
    },
  },
  render() {
    let scopedSlots = {
      'dynamic-delete-button': (text, record) => {
        return !this.disabled ? (
          <a-icon
            class="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => {
              this.removeDomain(record);
            }}
          />
        ) : (
          undefined
        );
      },
    };

    {
      this.record.list.map((item, index) => {
        return (scopedSlots[item.key] = (text, record, index) => {
          return (
            <KFormModelItem
              key={item.key + '1'}
              value={record[item.model]}
              onInput={value => {
                record[item.model] = value;
                this.handleInput();
              }}
              record={item}
              parent-disabled={this.disabled}
              index={index}
              domains={this.dynamicValidateForm.domains}
              dynamic-data={this.dynamicData}
            />
          );
        });
      });
    }

    return (
      <a-form-model ref="dynamicValidateForm" layout="inline" model={this.dynamicValidateForm}>
        <a-table
          class="batch-table"
          pagination={true}
          row-key={record => record.key}
          columns={this.columns}
          data-source={this.dynamicValidateForm.domains}
          bordered
          scroll={{
            x: this.record.list.length * 190 + 80 + (!this.record.options.hideSequence ? 60 : 0),
            // y: this.record.options.scrollY,
          }}
          {...{
            scopedSlots,
          }}
        ></a-table>
        <a-button type="dashed" disabled={this.disabled} onClick={this.addDomain} style="margin-top: 10px">
          <a-icon type="plus" />
          增加
        </a-button>
      </a-form-model>
    );
  },
};
