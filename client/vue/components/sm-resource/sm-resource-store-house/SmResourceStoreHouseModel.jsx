import ApiStoreHouse from '../../sm-api/sm-resource/StoreHouse';
import { form as formConfig, tips } from '../../_utils/config';
import { ModalStatus, StoreHouseEnable } from '../../_utils/enum';
import * as utils from '../../_utils/utils';
import StoreHouseTreeSelect from '../sm-resource-store-house-tree-select';
import AreaModule from "../../sm-common/sm-area-module";
import { requestIsSuccess, getStoreHouseEnableOption } from '../../_utils/utils';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import './style';

let apiStoreHouse = new ApiStoreHouse();

// 定义表单字段常量
const formFields = [
  'parentId',
  'organizationId',
  'name',
  'order',
  'enabled',
  'areaId',
  'address',
  'longitude',
  'latitude',
];
export default {
  name: 'SmResourceStoreHouseModel',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: null, // 表单绑的对象,
      confirmLoading: false,//确定按钮加载状态
      checkEnable: true,
      areaId: [],
      parentId: null,
      organizationId: null,
    };
  },


  computed: {
    title() {
      // 计算模态框的标题变量
      return utils.getModalTitle(this.status);
    },
    visible() {
      // 计算模态框的显示变量k
      return this.status !== ModalStatus.Hide;
    },
  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});

  },

  methods: {
    initAxios() {
      apiStoreHouse = new ApiStoreHouse(this.axios);
    },


    add(record) {
      this.status = ModalStatus.Add;
      let areaId = null;
      if (record) {
        this.parentId = record.id; //根节点编码;
        this.organizationId = record.organizationId; //根节点组织机构;
        this.record = record;
        areaId = [String(record.areaId)];
      }
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({
          parentId: this.parentId,
          organizationId: this.organizationId,
          areaId: areaId,
        });
      });
    },
    //编辑
    edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.parentId = record.parentId;
      record.areaId = [String(record.areaId)];
      let position = JSON.parse(record.position);
      record.longitude = position.longitude;
      record.latitude = position.latitude;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
      });
    },

    // 详情
    view(record) {
      this.status = ModalStatus.View;
      this.record = record;
      this.parentId = record.parentId;
      record.areaId = [String(record.areaId)];
      let position = JSON.parse(record.position);
      record.longitude = position.longitude;
      record.latitude = position.latitude;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
      });
    },
    // 关闭模态框
    close() {
      this.parentId = null;
      this.record = null;
      this.form.resetFields();
      this.status = ModalStatus.Hide;
      this.confirmLoading = false;
      this.organizationId=null;
    },
    //地址的同父级
    addressSearch() {
      if (this.record) {
        let address = this.record.address;
        this.form.setFieldsValue({ address: address });
      }
    },
    //经纬度的同父级
    positionSearch() {
      if (this.record) {
        let position = JSON.parse(this.record.position);
        let longitude = position.longitude;
        let latitude = position.latitude;
        this.form.setFieldsValue({ longitude: longitude, latitude: latitude });
      }
    },

    // 数据提交
    ok() {
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let response = null;
            for (let item in values.areaId) {
              this.areaId = values.areaId[item];
            }
            let data = {
              ...values,
              areaId: parseInt(this.areaId),
              position: JSON.stringify({ longitude: values.longitude, latitude: values.latitude }),
              order: values.order === null ? 0 : values.order,
            };
            this.confirmLoading = true;
            if (this.status === ModalStatus.Add) {
              response = await apiStoreHouse.create(data);
              if (utils.requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('success', "Add", response.data);
                //  this.$emit('success', "Add");
                this.close();
              }
            } else if (this.status === ModalStatus.Edit) {
              // 编辑
              response = await apiStoreHouse.update({ id: this.record.id, ...data });
              if (utils.requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('success', "Edit", response.data);
                // this.$emit('success', "Edit");
                this.close();
              }
            }

          }
        });
        this.confirmLoading = false;
      }

    },
  },

  render() {
    //仓库状态
    let stateTypeOption = [];
    for (let item in StoreHouseEnable) {
      stateTypeOption.push(
        <a-radio key={StoreHouseEnable[item]} value={StoreHouseEnable[item]}>
          {getStoreHouseEnableOption(StoreHouseEnable[item])}
        </a-radio>,
      );
    }
    return (
      <a-modal
        class="sm-resource-store-house-model"
        title={`${this.title}仓库`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.confirmLoading}
        destroyOnClose={true}
        okText="保存"
        onOk={
          this.ok
        }
        width={700}
      >
        <a-form form={this.form}>
          <a-form-item
            label="组织机构"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              disabled={this.status == ModalStatus.View  }
              placeholder={this.status === ModalStatus.View ? '' : '请选择组织机构'}
              v-decorator={[
                'organizationId',
                {
                  initialValue: null,
                  rules: [{ required: true, message: '请选择组织机构！' }],
                },
              ]}
              onChange={value => {
              }}
            />
          </a-form-item>
          {((this.status == ModalStatus.Add && this.parentId != null) ||
            this.status == ModalStatus.Edit && this.parentId != null ||
            this.status == ModalStatus.View && this.parentId != null) ?
            <a-form-item
              label="父级"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <StoreHouseTreeSelect
                disabled
                childrenIsDisabled={this.status !== ModalStatus.Add}
                placeholder="请选择"
                enabled={false}
                axios={this.axios}
                disabledIds={this.status !== ModalStatus.Add ? [this.record.id] : []}
                v-decorator={[
                  'parentId',
                  {
                    initialValue: null,
                  },
                ]}
              />
            </a-form-item>
            : ''}
          <a-form-item
            label="名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'name',
                {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入标题',
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="排序"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input-number
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              style="width:100%"
              min={0}
              precision={0}
              v-decorator={[
                'order',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="状态"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-radio-group
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'enabled',
                {
                  initialValue: true,
                },
              ]}
            >
              {/* {stateTypeOption}  */}
              <a-radio key='true' value={true}>启用</a-radio>
              <a-radio key='false' value={false}>停用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="区域"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <AreaModule
              axios={this.axios}
              deep={2}
              disabled={this.status == ModalStatus.View}
              placeholder="请选择"
              v-decorator={[
                'areaId',
                {

                  initialValue: [],
                  rules: [{ required: true, message: '请选择区域！' }],
                },

              ]}
            >
            </AreaModule>
          </a-form-item>


          <a-form-item
            label="详细地址"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input-search
              onSearch={() => this.addressSearch()}
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'address',
                {
                  initialValue: "",
                  rules: [
                    {
                      whitespace: true,
                      required: true,
                      message: '请输入详细地址',
                    },
                  ],
                },
              ]}
            >
              <a-button slot="enterButton" class="addressButton" >
                同父级
              </a-button>
            </a-input-search>
          </a-form-item>
          <a-form-item
            label="坐标"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-form-item style="display:inline-block">
              <a-input
                disabled={this.status == ModalStatus.View}
                style="width:190px"
                placeholder="经度"
                v-decorator={[
                  'longitude',
                  {
                    initialValue: "",
                    rules: [
                      {
                        whitespace: true,
                      },
                      {
                        pattern: /^-?(((\d|[1-9]\d|1[0-7]\d|0)\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/i,
                        message: "经度格式错误",
                      },
                    ],
                  },
                ]}
              />
            </a-form-item>
            <a-form-item style="display: inline-block;width:60px;text-align:center">
              <span >—</span>
            </a-form-item>
            <a-form-item style="display: inline-block">
              <a-input-search
                onSearch={() => this.positionSearch()}
                style="width:210px"
                disabled={this.status == ModalStatus.View}
                placeholder="纬度"
                v-decorator={[
                  'latitude',
                  {
                    initialValue: '',
                    rules: [
                      {
                        whitespace: true,
                      },
                      {
                        pattern: /^-?([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/i,
                        message: "纬度格式错误",
                      },
                    ],
                  },
                ]}
              >
                <a-button slot="enterButton" class="positionButton" >
                  同父级
                </a-button>
              </a-input-search>
            </a-form-item>

          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
