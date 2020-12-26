import { ModalStatus, DateReportType, RepairType, RepairValType } from '../../_utils/enum';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import { form as formConfig } from '../../_utils/config';
import {
  requestIsSuccess,
} from '../../_utils/utils';
import ApiRepairItem from '../../sm-api/sm-std-basic/RepairItem';

let apiRepairItem = new ApiRepairItem();

export default {
  name: 'SmStdBasicRepaiOrganizationTypeUpgradeModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      repairIds: [],
      confirmLoading: false,
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

    show(repairIds) {
      this.status = ModalStatus.Edit;
      this.repairIds = repairIds;
      console.log(this.repairIds);
    },

    close() {
      this.status = ModalStatus.Hide;
    },

    async ok() {
      this.form.validateFields(async (err, values) => {
        this.confirmLoading = true;
        if (!err) {
          let params = {
            RepairItemIds: this.repairIds,
            organizationTypeIds: values.organizationTypeIds,
            repairTagKey: this.repairTagKey,
          };
          let response = await apiRepairItem.updateOrganizationType(params);
          if (requestIsSuccess(response)) {
            this.$message.info("更新成功");
            this.status = ModalStatus.Hide;
            this.$emit('success');
          }
        }
      });
      this.confirmLoading = false;
    },
  },
  render() {
    return (
      <a-modal
        title="更新选择项执行单位"
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        onOk={this.ok}
        confirmLoading={this.confirmLoading}
      >
        <a-form form={this.form}>
          <a-form-item
            label="更新数量"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={true}
              value={this.repairIds.length}
            ></a-input>
          </a-form-item>

          <a-form-item
            label="执行单位"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <DataDictionaryTreeSelect
              axios={this.axios}
              groupCode={'OrganizationType'}
              placeholder="请选择执行单位"
              multiple={true}
              treeCheckStrictly={true}
              v-decorator={
                [
                  'organizationTypeIds',
                  {
                    initialValue: [],
                  },
                ]
              }
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
