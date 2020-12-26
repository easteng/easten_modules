import { ModalStatus, ServiceLifeUnit } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiStandardEquipment from '../../sm-api/sm-std-basic/StandardEquipment';
import SmStdBasicProductCategoryTreeSelect from '../sm-std-basic-product-category-tree-select';
import SmStdBasicManufacturerSelect from '../sm-std-basic-manufacturer-select';
import './style/index.less';

let apiStandardEquipment = new ApiStandardEquipment();

const formFields = ['code', 'productCategoryId', 'manufacturerId', 'serviceLife'];

export default {
  name: 'SmStdBasicStandardEquipmentModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      serviceLifeUnit: ServiceLifeUnit.Year,//使用寿命单位
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
      apiStandardEquipment = new ApiStandardEquipment(this.axios);
    },
    add() {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },

    //编辑设备信息
    async edit(record) {
      let response = await apiStandardEquipment.get(record.id);
      if (utils.requestIsSuccess(response)) {
        this.record = response.data;
        this.serviceLifeUnit = this.record.serviceLifeUnit ? this.record.serviceLifeUnit : ServiceLifeUnit.Year;
        this.status = ModalStatus.Edit;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          this.form.setFieldsValue(values);
        });
      }
    },


    // 查看设备信息
    async view(record) {
      let response = await apiStandardEquipment.get(record.id);
      if (utils.requestIsSuccess(response)) {
        this.status = ModalStatus.View;
        this.record = response.data;
        this.serviceLifeUnit = this.record.serviceLifeUnit ? this.record.serviceLifeUnit : ServiceLifeUnit.Year;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          this.form.setFieldsValue(values);
        });
      }
    },

    //关闭模态框
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
            if (this.status === ModalStatus.Add) {
              response = await apiStandardEquipment.create({ ...values, serviceLifeUnit: this.serviceLifeUnit });
            } else if (this.status === ModalStatus.Edit) {
              response = await apiStandardEquipment.get(this.record.id);
              if (utils.requestIsSuccess(response)) {
                let data = {
                  id: this.record.id,
                  serviceLifeUnit: this.serviceLifeUnit,
                  ...values,
                };
                response = await apiStandardEquipment.update(data);
              }
            }
            if (utils.requestIsSuccess(response)) {
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
    return (
      <a-modal
        class="sm-basic-standard-equipment-modal"
        title={`${this.title}产品`}
        visible={this.visible}
        forceRender={true}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          {/* <a-form-item
            label="产品名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status === ModalStatus.View}
              placeholder={this.status === ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'name',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入设备名称！', max: 120 }],
                },
              ]}
            />
          </a-form-item> */}

          <a-form-item
            label="产品型号"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmStdBasicProductCategoryTreeSelect
              axios={this.axios}
              showSearch={true}
              parentDisabled={true}
              ref="SmStdBasicProductCategoryTreeSelect"
              placeholder={this.status === ModalStatus.View ? '' : '请选择产品型号'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'productCategoryId',
                {
                  initialValue: null,
                  rules: [{ required: true, message: '请选择产品型号！' }],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="产品厂商"
            style="display: flex; align-items: center;"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >

            <SmStdBasicManufacturerSelect
              axios={this.axios}
              placeholder={this.status == ModalStatus.View ? '' : '请选择产品厂商'}
              disabled={this.status == ModalStatus.View}
              height={32}
              v-decorator={[
                'manufacturerId',
                {
                  initialValue: null,
                  rules: [{ required: true, message: '请选择产品厂商！' }],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="Code编码"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入Code编码'}
              v-decorator={[
                'code',
                {
                  initialValue: '',
                  rules: [
                    { max: 100, message: '描述最多输入100字符', whitespace: true },
                    // { pattern: /^\d+$/, message: '请输入正确的编码' },
                  ],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="使用寿命"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input-group
              compact={true}
              style="width:100%"
            >
              <a-input-number
                min={0}
                style="width: 79%"
                placeholder={this.status == ModalStatus.View ? '' : '请输入产品使用寿命'}
                disabled={this.status === ModalStatus.View}
                v-decorator={[
                  'serviceLife',
                  {
                    initialValue: null,
                  },
                ]}
              />
              <a-select
                disabled={this.status === ModalStatus.View}
                value={this.serviceLifeUnit}
                onChange={value => this.serviceLifeUnit = value}
              >
                <a-select-option value={ServiceLifeUnit.Year}>{utils.getServiceLifeUnit(ServiceLifeUnit.Year)}</a-select-option>
                <a-select-option value={ServiceLifeUnit.Month}>{utils.getServiceLifeUnit(ServiceLifeUnit.Month)}</a-select-option>
                <a-select-option value={ServiceLifeUnit.Day}>{utils.getServiceLifeUnit(ServiceLifeUnit.Day)}</a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
