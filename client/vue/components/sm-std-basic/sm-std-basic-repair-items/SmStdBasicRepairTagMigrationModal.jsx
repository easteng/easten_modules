import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import SmSystemDataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import SmStdBasicRepairGroupTreeSelect from '../sm-std-basic-repair-group-tree-select';
import ApiRepairItem from '../../sm-api/sm-std-basic/RepairItem';
import sd from './style/index';
import * as utils from '../../_utils/utils';
import './style';
let apiRepairItem = new ApiRepairItem();

export default {
  name: "SmStdBasicRepairTagMigrationModal",
  props: {
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      repairGroup: [],//迁移数据选择的id
    };
  },
  computed: {
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
      apiRepairItem = new ApiRepairItem(this.axios);
    },
    migration() {
      this.status = ModalStatus.Add;
    },
    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
    },
    async ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let response = null;

          let data = {
            ...values,
            repairGroupIds: this.repairGroup,
            repairTagKey: this.repairTagKey,
          };
          response = await apiRepairItem.createTagMigration(data);
          if (utils.requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.$emit('success');
            this.close();
          }
        }
      });
    },
  },
  render() {
    return (
      <div>
        <a-modal
          class="sm-std-basic-repair-tag-migration-modal"
          title={`标签迁移`}
          visible={this.visible}
          onCancel={this.close}
          destroyOnClose={true}
          onOk={this.ok}
        >
          <a-form form={this.form}>
            {/* <a-form-item
              label="源"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <SmSystemDataDictionaryTreeSelect
                axios={this.axios}
                placeholder={this.status === ModalStatus.View ? '' : '请选择数据源'}
                groupCode={"RepairTag"}
                v-decorator={[
                  'rootTagId',
                  {
                    initialValue: null,
                    rules: [{ required: true, message: '请选择数据源！' }],
                  },
                ]}
              />
            </a-form-item> */}
            <a-form-item
              label="目标"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <SmSystemDataDictionaryTreeSelect
                axios={this.axios}
                placeholder={this.status === ModalStatus.View ? '' : '请选择目标'}
                groupCode={"RepairTag"}
                v-decorator={[
                  'targetTagId',
                  {
                    initialValue: null,
                    rules: [{ required: true, message: '请选择目标！' }],
                  },
                ]}
              />
            </a-form-item>
            <a-form-item
              label="设备类型"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-card class="sm-std-basic-repair-group-tree-select">
                <SmStdBasicRepairGroupTreeSelect
                  axios={this.axios}
                  onRepairGroup={(item) => {
                    this.repairGroup = item;
                  }}

                />
              </a-card>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    );
  },
};