import { ModalStatus, RepairLevel } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiInfluenceRange from '../../sm-api/sm-std-basic/InfluenceRange';
import { requestIsSuccess, getRepairLevelTitle } from '../../_utils/utils';

let apiInfluenceRange = new ApiInfluenceRange();

const formFields = ['repairLevel', 'content'];

export default {
  name: 'SmStdBasicInfluenceRangeModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: null,
      defaultLevel: RepairLevel.LevelI,
    };
  },
  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiInfluenceRange = new ApiInfluenceRange(this.axios);
    },

    add(record) {
      this.form.resetFields();
      this.status = ModalStatus.Add;
      this.record = record;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    async edit(record) {
      this.status = ModalStatus.Edit;
      let response = await apiInfluenceRange.get(record.id, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },

    async view(record) {
      this.status = ModalStatus.View;
      let response = await apiInfluenceRange.get(record.id, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },

    // 关闭模态框
    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
      this.record = null;
    },

    async ok() {
      // 数据提交
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let response = null;
            if (this.status === ModalStatus.Add) {
              // 添加
              response = await apiInfluenceRange.create({
                ...values,
              }, this.repairTagKey);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.close();
                this.$emit('success', "Add", response.data);
              }
            } else if (this.status === ModalStatus.Edit) {
              // 编辑
              response = await apiInfluenceRange.update({ id: this.record.id, ...values }, this.repairTagKey);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.close();
                this.$emit('success', "Edit", response.data);
              }
            }
          }
        });
      }
    },
  },
  render() {
    let options = [];
    for (let item in RepairLevel) {
      options.push(
        <a-select-option key={RepairLevel[item]}>
          {getRepairLevelTitle(RepairLevel[item])}
        </a-select-option>,
      );
    }
    return (
      <a-modal
        class="sm-std-basic-influence-range-modal"
        title={`${this.title}影响范围`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item label="维修级别"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}>
            <a-select
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'repairLevel',
                {
                  initialValue: this.defaultLevel,
                },
              ]}
            >
              {options}
            </a-select>
          </a-form-item>
          <a-form-item
            label="影响范围"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              placeholder={this.status == ModalStatus.View ? '' : '请输入影响范围'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'content',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入影响范围！' }, { max: 500, message: '简介最多输入500字符', whitespace: true }],
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
