import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiManufacturer from '../../sm-api/sm-std-basic/Manufacturer';
import ManufacturerSelect from '../sm-std-basic-manufacturer-select';
import { requestIsSuccess } from '../../_utils/utils';

let apiManufacturer = new ApiManufacturer();

const formFields = ['parentId', 'name', 'shortName', 'introduction', 'code', 'principal', 'telephone', 'address'];

export default {
  name: 'SmStdBasicManufacturerModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    type: { type: String, default: 'checkbox' },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: null,
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
      apiManufacturer = new ApiManufacturer(this.axios);
    },

    add(record) {
      this.form.resetFields();
      this.status = ModalStatus.Add;
      this.record = record;
      this.$nextTick(() => {
        this.form.setFieldsValue({ parentId: record ? record.id : null });
      });
    },

    async edit(record) {
      this.status = ModalStatus.Edit;
      let response = await apiManufacturer.get(record.id);
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },

    async view(record) {
      this.status = ModalStatus.View;
      let response = await apiManufacturer.get(record.id);
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
            let shortName = this.form.getFieldValue('shortName');
            let name = this.form.getFieldValue('name');
            values.shortName = shortName.replace(/[, ]/g, '');
            values.name = name.replace(/[, ]/g, '');
            let response = null;
            if (this.status === ModalStatus.Add) {
              // 添加
              response = await apiManufacturer.create({
                ...values,
              });
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.close();
                this.$emit('success', "Add", response.data);
              }
            } else if (this.status === ModalStatus.Edit) {
              // 编辑
              response = await apiManufacturer.update({ id: this.record.id, ...values });
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
    return (
      <a-modal
        class="sm-std-basic-manufacturer-model"
        title={`${this.title}厂家`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="上级"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <ManufacturerSelect
              axios={this.axios}
              placeholder={this.status === ModalStatus.View || (this.record && this.record.parentId == null) ? '' : '请选择上级厂家'}
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

          <a-form-item
            label="厂家名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status == ModalStatus.View ? '' : '请输入厂家名称'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'name',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入厂家名称！' }, { max: 100, message: "名称最多输入100字符" }],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="厂家简称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status == ModalStatus.View ? '' : '请输入厂家简称'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'shortName',
                {
                  initialValue: '',
                  rules: [{ max: 50, message: '简称最多输入50字符', whitespace: true }],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="厂家简介"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              placeholder={this.status == ModalStatus.View ? '' : '请输入厂家简介'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'introduction',
                {
                  initialValue: '',
                  rules: [{ max: 500, message: '简介最多输入500字符', whitespace: true }],
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
              placeholder={this.status == ModalStatus.View ? '' : '请输入编码'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'code',
                {
                  initialValue: '',
                  rules: [
                    { max: 50, message: '编码最多输入50字符', whitespace: true },
                    // { pattern: /^\d+$/, message: '请输入正确的编码' },
                  ],
                },
              ]}
            />
          </a-form-item>
          {/* <a-form-item
            label="类型"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status == ModalStatus.View ? '' : '请输入类型'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'type',
                {
                  initialValue: '',
                  rules: [{ max: 120, whitespace: true }],
                },
              ]}
            />
          </a-form-item> */}

          {/* <a-form-item
            label="连锁类型"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <EquipmentControlTypeSelect
              axios={this.axios}
              placeholder={this.status == ModalStatus.View ? '' : '请选择设备连锁类型'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'EquipmentControlTypes',
                {
                  initialValue: [],
                },
              ]}
            />
          </a-form-item> */}
          <a-form-item
            label="联系人"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status == ModalStatus.View ? '' : '请输入联系人'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'principal',
                {
                  initialValue: '',
                  rules: [{ max: 50, message: '联系人最多输入50字符', whitespace: true }],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="联系电话"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入联系电话'}
              v-decorator={[
                'telephone',
                {
                  initialValue: '',
                  rules: [
                    { max: 50, message: '联系电话最多输入50字符', whitespace: true },
                    { pattern: /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/, message: '请输入正确的电话号码' },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="地址"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              placeholder={this.status == ModalStatus.View ? '' : '请输入详细地址'}
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'address',
                {
                  initialValue: '',
                  rules: [{ max: 500, message: '地址最多输入500字符', whitespace: true }],
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
