import { ModalStatus, DateReportType, RepairType, RepairPeriodUnit } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiRepairItem from '../../sm-api/sm-std-basic/RepairItem';
import SmStdBasicRepairGroupSelect from '../sm-std-basic-repair-group-select';
import SmStdBasicComponentCategorySelect from '../sm-std-basic-component-category-tree-select';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import {
  requestIsSuccess,
  getDateReportTypeTitle,
  getRepairTypeTitle,
} from '../../_utils/utils';

let apiRepairItem = new ApiRepairItem();

const formFields = [
  'isMonth',
  'topGroupId',
  'groupId',
  'componentCategoryIds',
  'type',
  'number',
  'content',
  'unit',
  'period',
  'remark',
  'tagId',
  'organizationTypeIds',
];

export default {
  name: 'SmStdBasicRepairItemModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      deviceTypeList: [],
      deviceNameList: [],
      status: ModalStatus.Hide,
      form: {},
      record: {},
      treeData: [],
      queryParams: {
        treeCheckable: true,
      },
      topGroupId: null, //设备类型Id
      periodUnit: '请选择',
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
    //初始化异步方法实例
    initAxios() {
      apiRepairItem = new ApiRepairItem(this.axios);
    },

    //添加实体
    add(initValue) {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        let values = utils.objFilterProps(initValue, formFields);
        this.topGroupId = initValue.topGroupId;
        values.isMonth = initValue.isMonth !== undefined ? initValue.isMonth ? DateReportType.Month : DateReportType.Year : undefined;
        this.periodUnit = initValue.isMonth !== undefined ? initValue.isMonth ? RepairPeriodUnit.Month : RepairPeriodUnit.Year : '请选择';
        this.form.setFieldsValue(values);
      });
    },
    //编辑实体
    async edit(record) {
      this.status = ModalStatus.Edit;
      let response = await apiRepairItem.get({ id: record.id });
      if (requestIsSuccess(response)) {
        let record = response.data;

        record.isMonth = record.isMonth ? DateReportType.Month : DateReportType.Year;
        record.topGroupId = record.group.parentId;
        record.componentCategoryIds = record.repairItemRltComponentCategories
          ? record.repairItemRltComponentCategories.map(item => item.componentCategoryId)
          : [];
        record.organizationTypeIds = record.repairItemRltOrganizationTypes ? record.repairItemRltOrganizationTypes.map(item => item.organizationTypeId) : [];
        this.record = record;
        this.topGroupId = record.group.parentId;
        this.periodUnit = record.periodUnit;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          this.form.setFieldsValue(values);
        });
      }
    },

    //查看详情
    async view(record) {
      this.status = ModalStatus.View;
      let response = await apiRepairItem.get({ id: record.id });
      if (requestIsSuccess(response)) {
        let record = response.data;
        record.isMonth = record.isMonth ? DateReportType.Month : DateReportType.Year;
        record.topGroupId = record.group.parentId;
        record.componentCategoryIds = record.repairItemRltComponentCategories
          ? record.repairItemRltComponentCategories.map(item => item.componentCategoryId)
          : [];
        record.organizationTypeIds = record.repairItemRltOrganizationTypes ? record.repairItemRltOrganizationTypes.map(item => item.organizationTypeId) : [];

        this.record = record;
        this.topGroupId = record.group.parentId;
        this.periodUnit = record.periodUnit;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          this.form.setFieldsValue(values);
        });
      }
    },

    //获取最大编号
    getMaxNumber() {
      this.$nextTick(async () => {
        let values = this.form.getFieldsValue();
        if (values.isMonth != undefined && values.groupId) {
          let response = await apiRepairItem.getMaxNumber({
            isMonth: values.isMonth === DateReportType.Year ? false : true,
            groupId: values.groupId,
            repairTagKey: this.repairTagKey,
          });
          if (requestIsSuccess(response)) {
            this.form.setFieldsValue({ number: response.data + 1 });
          }
        }
      });
    },

    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
    },
    async ok() {
      // 数据提交
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let response = null;
            values = {
              ...values,
              periodUnit: this.periodUnit,
              isMonth: values.isMonth == DateReportType.Month ? true : false,
              repairTagKey: this.repairTagKey,
            };

            if (this.status === ModalStatus.Add) {
              response = await apiRepairItem.create(values);
            } else if (this.status === ModalStatus.Edit) {
              // response = await apiRepairItem.get({
              //   id: this.record.id,
              // });
              // if (requestIsSuccess(response)) {
              let params = {
                id: this.record.id,
                ...values,
              };
              response = await apiRepairItem.update(params);
              // }
            }

            if (requestIsSuccess(response)) {
              this.queryParams.railwayId = [];
              this.queryParams.organizationId = [];
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }
          }
        });
      }
    },
  },
  render() {
    //年月表类型
    let dateReportTypeOption = [];
    for (let item in DateReportType) {
      dateReportTypeOption.push(
        <a-radio key={DateReportType[item]} value={DateReportType[item]}>
          {getDateReportTypeTitle(DateReportType[item])}
        </a-radio>,
      );
    }

    //维修类别
    let repairTypeOption = [];
    for (let item in RepairType) {
      repairTypeOption.push(
        <a-radio key={RepairType[item]} value={RepairType[item]}>
          {getRepairTypeTitle(RepairType[item])}
        </a-radio>,
      );
    }

    return (
      <a-modal
        title={`${this.title}维修项`}
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="维修类别"
            // mode={this.queryParams.stationTypeVal}
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-radio-group
              placeholder={this.status == ModalStatus.View ? '' : '请选择维修类别！'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'type',
                {
                  initialValue: undefined,
                  rules: [{ required: true, message: '请选择维修类别！' }],
                },
              ]}
            >
              {repairTypeOption}
            </a-radio-group>
          </a-form-item>


          <a-form-item
            label="年月表"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-radio-group
              placeholder={this.status == ModalStatus.View ? '' : '请选择年月表类型！'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'isMonth',
                {
                  initialValue: undefined,
                  rules: [{ required: true, message: '请选择年月表类型！' }],
                },
              ]}
              onChange={event => {
                if (event.target.value == DateReportType.Year) {
                  this.periodUnit = RepairPeriodUnit.Year;
                } else if (event.target.value == DateReportType.Month) {
                  this.periodUnit = RepairPeriodUnit.Month;
                }
                this.form.setFieldsValue({ period: null });
              }}
            >
              {dateReportTypeOption}
            </a-radio-group>
          </a-form-item>

          {
            <a-form-item
              label="设备类型"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <SmStdBasicRepairGroupSelect
                axios={this.axios}
                isTop={true}
                permissions={this.permissions}
                disabled={this.status === ModalStatus.View}
                placeholder={this.status == ModalStatus.View ? '' : '请选择设备类型！'}
                v-decorator={[
                  'topGroupId',
                  {
                    initialValue: undefined,
                    rules: [{ required: true, message: '请选择设备类型！' }],
                  },
                ]}
                onChange={value => {
                  this.form.setFieldsValue({ groupId: undefined });
                  this.topGroupId = value;
                }}
              />
            </a-form-item>
          }

          {
            <a-form-item
              label="设备名称"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <SmStdBasicRepairGroupSelect
                axios={this.axios}
                permissions={this.permissions}
                parentId={this.topGroupId}
                disabled={this.status === ModalStatus.View}
                placeholder={this.status == ModalStatus.View ? '' : '请选择设备名称！'}
                v-decorator={[
                  'groupId',
                  {
                    initialValue: undefined,
                    rules: [{ required: true, message: '请选择设备名称！' }],
                  },
                ]}
                onChange={value => {
                  this.getMaxNumber();
                }}
              />
            </a-form-item>
          }
          <a-form-item
            label='执行单位'
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <DataDictionaryTreeSelect
              axios={this.axios}
              groupCode={'OrganizationType'}
              disabled={this.status === ModalStatus.View}
              multiple={true}
              treeCheckStrictly={true}
              placeholder="请选择执行单位"
              v-decorator={[
                'organizationTypeIds',
                {
                  initialValue: [],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="构件分类"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmStdBasicComponentCategorySelect
              multiple={true}
              axios={this.axios}
              disabled={this.status === ModalStatus.View}
              treeCheckable={true}
              treeCheckStrictly={true}
              placeholder={this.status == ModalStatus.View ? '' : '请选择构件分类！'}
              v-decorator={[
                'componentCategoryIds',
                {
                  initialValue: [],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="单位"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status == ModalStatus.View ? '' : '请输入单位！'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'unit',
                {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入单位！' },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="周期"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status === ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入维修周期！'}
              v-decorator={[
                'period',
                {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入维修周期！' },
                    this.periodUnit != RepairPeriodUnit.Other
                      ? { pattern: /^[1-9]\d*$/, message: '请输入正确的数字' }
                      : {},
                  ],
                },
              ]}
            >
              <a-select
                disabled={this.status === ModalStatus.View}
                slot="addonAfter"
                value={this.periodUnit}
                onChange={value => {
                  this.periodUnit = value;
                }}
              >
                {this.form.getFieldsValue().isMonth !== DateReportType.Month ? (
                  <a-select-option value={RepairPeriodUnit.Year}>次/年</a-select-option>
                ) : (
                  undefined
                )}
                {this.form.getFieldsValue().isMonth !== DateReportType.Year ? (
                  <a-select-option value={RepairPeriodUnit.Month}>次/月</a-select-option>
                ) : (
                  undefined
                )}
                <a-select-option value={RepairPeriodUnit.Other}>其他</a-select-option>
              </a-select>
            </a-input>
          </a-form-item>
          <a-form-item
            label="编号"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input-group compact={true} style="width:100%">
              <a-input-number
                step="1"
                precision={0}
                min={1}
                style={this.status === ModalStatus.Add ? "width: 73%" : "width: 100%"}
                placeholder={this.status == ModalStatus.View ? '' : '请输入编号！'}
                disabled={this.status === ModalStatus.View}
                v-decorator={[
                  'number',
                  {
                    initialValue: null,
                    rules: [{ required: true, message: '请输入编号！' }],
                  },
                ]}
              />
              {this.status === ModalStatus.Add ?
                <a-button
                  disabled={this.status === ModalStatus.View}
                  type="primary"
                  onClick={() => {
                    this.getMaxNumber();
                  }}
                >
                  自动编号
                </a-button> : undefined}

            </a-input-group>
          </a-form-item>





          <a-form-item
            label="工作内容"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              placeholder={this.status == ModalStatus.View ? '' : '请输入工作内容！'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'content',
                {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入工作内容！' },
                    { max: 1000, message: '工作内容最多输入1000字符', whitespace: true },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="备注"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入备注！'}
              v-decorator={[
                'remark',
                {
                  initialValue: '',
                  rules: [{ max: 500, message: '备注最多输入500字符', whitespace: true }],
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
