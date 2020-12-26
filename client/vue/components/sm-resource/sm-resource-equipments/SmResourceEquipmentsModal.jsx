import { ModalStatus, RunningState } from '../../_utils/enum';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { requestIsSuccess, getRunningState } from '../../_utils/utils';
import ApiEquipments from '../../sm-api/sm-resource/Equipments';
import ApiManufacture from '../../sm-api/sm-std-basic/Manufacturer';
import SmBasicInstallationSiteSelect from '../../sm-basic/sm-basic-installation-site-select';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import CrmCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-component-category-tree-select';
import ProductCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-product-category-tree-select';
import SmResourceEquipmentSelect from '../sm-resource-equipment-select';

let apiEquipments = new ApiEquipments();
let apiManufacture = new ApiManufacture();
const formFields = [
  'parentId',
  'equipmentRltOrganizations',
  'componentCategoryId',
  'name',
  'installationSiteId',
  'code',
  'state',
  'productCategoryId',
  'manufacturerId',
];

export default {
  name: 'SmResourceEquipmentsModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      manufacturerList: [], //厂家列表
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
      apiEquipments = new ApiEquipments(this.axios);
      apiManufacture = new ApiManufacture(this.axios);
    },

    //根据产品主键获取厂家列表
    async getManufacturerList(productId) {
      this.manufacturerOptions = [];
      let response = await apiManufacture.getListByProductId({ productId: productId });
      if (requestIsSuccess(response)) {
        let _manufacturerList = treeArrayItemAddProps(response.data, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.manufacturerList = _manufacturerList;
      }
    },

    add(record) {
      this.status = ModalStatus.Add;
      this.record = record;
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({ parentId: record ? record.id : null });
      });
    },

    //编辑按钮
    async edit(record) {
      this.status = ModalStatus.Edit;
      let response = await apiEquipments.get({ id: record.id });
      if (requestIsSuccess(response)) {
        this.record = response.data;

        //根据产品主键获取厂家列表
        if (this.record.productCategoryId) {
          this.getManufacturerList(this.record.productCategoryId);
        }
        this.record.equipmentRltOrganizations = response.data.equipmentRltOrganizations.map(
          item => item.organizationId,
        );
        this.$nextTick(() => {
          this.form.setFieldsValue(utils.objFilterProps(this.record, formFields));
        });
      }
    },
    
    async view(record) {
      this.status = ModalStatus.View;
      let response = await apiEquipments.get({ id: record.id });
      if (requestIsSuccess(response)) {
        this.record = response.data;

        //根据产品主键获取厂家列表
        if (this.record.productCategoryId) {
          this.getManufacturerList(this.record.productCategoryId);
        }

        this.record.equipmentRltOrganizations = response.data.equipmentRltOrganizations.map(
          item => item.organizationId,
        );

        this.$nextTick(() => {
          this.form.setFieldsValue(utils.objFilterProps(this.record, formFields));
        });
      }
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
            let data = {
              ...values,
              equipmentRltOrganizations: values.equipmentRltOrganizations.map(item => {
                return {
                  organizationId: item,
                };
              }),
            };
            let response = null;
            if (this.status === ModalStatus.Add) {
              response = await apiEquipments.create(data);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.close();
                this.$emit('success', 'Add', data);
              }
            } else if (this.status === ModalStatus.Edit) {
              data.id = this.record.id;
              response = await apiEquipments.update(data);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.close();
                this.$emit('success', 'Edit', data);
              }
            }
          }
        });
      }
    },
  },
  render() {
    //设备运行状态
    let runningStateOptions = [];
    for (let item in RunningState) {
      runningStateOptions.push(
        <a-select-option key={RunningState[item]}>
          {getRunningState(RunningState[item])}
        </a-select-option>,
      );
    }

    return (
      <a-modal
        title={`${this.title}设备`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
      // width={600}
      >
        <a-form form={this.form}>
          <a-row>
            <a-col span={24}>
              <a-form-item
                label="上级"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <SmResourceEquipmentSelect
                  axios={this.axios}
                  placeholder={this.status === ModalStatus.View || (this.record && this.record.parentId == null) ? '' : '请选择上级'}
                  placeholder='请选择上级'
                  disabled={this.record !== null}
                  height={32}
                  v-decorator={[
                    'parentId',
                    {
                      initialValue: null,
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col span={24}>
              <a-form-item
                label="维护单位"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <OrganizationTreeSelect
                  axios={this.axios}
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请选择维护单位'}
                  multiple={true}
                  v-decorator={[
                    'equipmentRltOrganizations',
                    {
                      initialValue: [],
                      rules: [{ required: true, message: '请选择维护单位' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={24}>
              <a-form-item
                label="设备分类"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <CrmCategoryTreeSelect
                  axios={this.axios}
                  treeCheckable={false}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择设备分类'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'componentCategoryId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择设备分类！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={24}>
              <a-form-item
                label="设备名称"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-input
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请输入设备名称'}
                  v-decorator={[
                    'name',
                    {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请输入设备名称！' },
                        { max: 100, message: '设备名称最多输入100字符', whitespace: true },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={24}>
              <a-form-item
                label="安装地点"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <SmBasicInstallationSiteSelect
                  axios={this.axios}
                  height={32}
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择安装地点'}
                  v-decorator={[
                    'installationSiteId',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择安装地点！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={24}>
              <a-form-item
                label="设备编码"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-input
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请输入设备编码'}
                  v-decorator={[
                    'code',
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '请输入设备编码！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            {/* 
            <a-col span={24}>
              <a-form-item
                label="安装位置"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-select
                  axios={this.axios}
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择安装位置'}
                  v-decorator={[
                    'installationSiteType',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择安装位置！' }],
                    },
                  ]}
                >
                  {installationSiteTypeOptions}
                </a-select>
              </a-form-item>
            </a-col> */}

            <a-col span={24}>
              <a-form-item
                style="margin-top:12px"
                label="设备型号"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <ProductCategoryTreeSelect
                  axios={this.axios}
                  treeCheckable={false}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择设备型号'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'productCategoryId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择设备型号！' }],
                    },
                  ]}
                  onChange={val => {
                    this.getManufacturerList(val);

                    this.$nextTick(async () => {
                      let values = {};
                      values.manufacturerId = '';
                      this.form.setFieldsValue(values);
                    });
                  }}
                />
              </a-form-item>
            </a-col>

            <a-col span={24}>
              <a-form-item
                label="设备厂家"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-select
                  axios={this.axios}
                  options={this.manufacturerList}
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择厂家'}
                  v-decorator={[
                    'manufacturerId',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择厂家' }],
                    },
                  ]}
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col span={24}>
              <a-form-item
                label="运行状态"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-select
                  axios={this.axios}
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择运行状态'}
                  v-decorator={[
                    'state',
                    {
                      initialValue: RunningState.PrimaryUse,
                      rules: [{ required: true, message: '请选择运行状态！' }],
                    },
                  ]}
                >
                  {runningStateOptions}
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    );
  },
};
