import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import ApiRepairTestItem from '../../sm-api/sm-std-basic/RepairTestItem';
import { requestIsSuccess } from '../../_utils/utils';

let apiRepairTestItem = new ApiRepairTestItem();

export default {
  name: 'SmStdBasicRepairTestItemUpgradeModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      status: ModalStatus.Hide,
      queryParams: {
        year: new Date().getFullYear(),
        repairDetailIds: [],
        isUpgradeAll: false,
      },
      upgradeCount: '',
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiRepairTestItem = new ApiRepairTestItem(this.axios);
    },

    show(isAll, repairDetialIds) {
      this.status = ModalStatus.Edit;

      this.queryParams.year = new Date().getFullYear();
      this.queryParams.isUpgradeAll = isAll;
      if (repairDetialIds.length > 0)
        this.queryParams.repairDetailIds = repairDetialIds;
      this.upgradeCount = repairDetialIds.length;
      if (isAll) this.upgradeCount = "全部";
    },

    close() {
      this.queryParams.year = new Date().getFullYear();
      this.status = ModalStatus.Hide;
    },

    async ok() {
      let response = await apiRepairTestItem.upgradeTestItems({ ...this.queryParams, repairTagKey: this.repairTagKey });
      if (requestIsSuccess(response)) {
        this.$message.success('操作成功');
        this.close();
        this.$emit('success');
      }
    },
  },
  render() {
    let selectYearOptions = [];
    for (let i = this.queryParams.year - 5; i <= this.queryParams.year + 5; i++) {
      selectYearOptions.push(
        <a-select-option key={i}>
          {i}
        </a-select-option>);
    }

    let form = (
      <a-form form={null}>
        <a-form-item
          label="更新数量"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-input
            disabled={true}
            value={this.upgradeCount}
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="更新年份"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-select
            placeholder='请选择更新年份！'
            value={this.queryParams.year}
            onChange={value => {
              this.queryParams.year = value;
            }}
          >
            {selectYearOptions}
          </a-select>
        </a-form-item>
      </a-form>
    );
    return (
      <div>
        <a-modal
          title='选择更新年份'
          visible={this.visible}
          onCancel={this.close}
          onOk={this.ok}
        >
          {form}
        </a-modal>
      </div>
    );
  },
};
