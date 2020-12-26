import { ModalStatus, DateReportType, RepairType, RepairValType } from '../../_utils/enum';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import { form as formConfig } from '../../_utils/config';
import {
  requestIsSuccess,
} from '../../_utils/utils';
import ApiOrganization from '../../sm-api/sm-system/Organization';

let apiOrganization = new ApiOrganization();

export default {
  name: 'SmSyatemOrganizationBatchUpdateTypeModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      checkOrgIds: [],
      checkOrgNames: [],
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
      apiOrganization = new ApiOrganization(this.axios);
    },

    show(checkOrgs) {
      console.log(checkOrgs);
      this.checkOrgIds = [];
      this.checkOrgNames = '';
      this.status = ModalStatus.Edit;
      for (let i = 0; i < checkOrgs.length; i++) {
        const item = checkOrgs[i];
        this.checkOrgIds.push(item.id);
        this.checkOrgNames += item.name;
        if (i < checkOrgs.length - 1) this.checkOrgNames += "，";
      }
    },

    close() {
      this.status = ModalStatus.Hide;
    },

    async ok() {
      this.form.validateFields(async (err, values) => {
        this.confirmLoading = true;
        if (!err) {
          let params = {
            organizationIds: this.checkOrgIds,
            typeId: values.typeId,
          };
          let response = await apiOrganization.batchUpdateType(params);
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
        title={"批量更新类型 数量（" + this.checkOrgIds.length + "）"}
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        onOk={this.ok}
        confirmLoading={this.confirmLoading}
      >
        <a-form form={this.form}>
          <a-form-item
            label="已选组织机构"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              disabled={true}
              value={this.checkOrgNames}
            ></a-textarea>
          </a-form-item>

          <a-form-item
            label="组织机构类型"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <DataDictionaryTreeSelect
              axios={this.axios}
              placeholder={this.status == ModalStatus.View ? '' : '请选择组织机构类型'}
              disabled={this.status == ModalStatus.View}
              groupCode={'OrganizationType'}
              v-decorator={[
                'typeId',
                {
                  initialValue: '',
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
