import { ModalStatus, DateReportType, RepairType, RepairValType } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiRepairTestItem from '../../sm-api/sm-std-basic/RepairTestItem';
import StdFileManageSelect from '../../sm-file/sm-file-manage-select';
import SmStdBasicPresetValueForRepairTestItem from './src/SmStdBasicPresetValueForRepairTestItem';
import {
  requestIsSuccess,
  getDateReportTypeTitle,
  getRepairTypeTitle,
  getRepairValTypeTitle,
} from '../../_utils/utils';

let apiRepairTestItem = new ApiRepairTestItem();

const formFields = ['name', 'type', 'file', 'unit', 'defaultValue', 'maxRated', 'minRated'];

export default {
  name: 'SmStdBasicRepairTestItemModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      repairItemId: null, //维修项主键
      isShowUpload: false, //是否选择上传文件
      isShowModal: false, //文件管理弹框是否弹出
      queryParams: {
        treeCheckable: true,
        typeVal: RepairValType.Number,
        uploadFile: {
          fileName: null,
          fileId: null,
        },
      },
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
      apiRepairTestItem = new ApiRepairTestItem(this.axios);
    },
    add(record) {
      this.repairItemId = record.id;
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },

    //编辑按钮
    async edit(record) {
      this.status = ModalStatus.Edit;
      this.repairItemId = record.repairItemId;
      let response = await apiRepairTestItem.get({ id: record.id });
      if (requestIsSuccess(response)) {
        let data = response.data;
        this.record = data;

        this.isShowUpload = false;
        if (data.type == RepairValType.Table) {
          this.isShowUpload = true;
        }
        this.record.file = this.record.file ? this.record.file : [];
        this.record.defaultValue = this.record.defaultValue ? this.record.defaultValue.split(',').map((item, index) => {
          return {
            index: index,
            value: item,
          };
        }) : [];
        let values = utils.objFilterProps(this.record, formFields);
        this.$nextTick(() => {
          this.form.setFieldsValue(values);
        });
      }
    },
    close() {
      this.record = null;
      this.form.resetFields();
      this.isShowUpload = false;
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
              repairItemId: this.repairItemId,
              fileId: values.file ? values.file.id : null,
            };
            if (values.type != RepairValType.Table)
              data.defaultValue = values.defaultValue.map(item => item.value).join(',');

            let response = null;
            if (this.status === ModalStatus.Add) {
              response = await apiRepairTestItem.create(data);
            } else if (this.status === ModalStatus.Edit) {
              let params = {
                id: this.record.id,
                ...data,
              };
              response = await apiRepairTestItem.update(params);
            }

            if (requestIsSuccess(response)) {
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
    //值类型
    let repairValTypeOption = [];
    for (let item in RepairValType) {
      repairValTypeOption.push(
        <a-select-option key={RepairValType[item]}>
          {getRepairValTypeTitle(RepairValType[item])}
        </a-select-option>,
      );
    }

    let form = (
      <a-form form={this.form}>
        <a-form-item
          label="测试项目"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-input
            disabled={this.status === ModalStatus.View}
            placeholder={this.status == ModalStatus.View ? '' : '请输入测试项目'}
            v-decorator={[
              'name',
              {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入测试项目！', whitespace: true },
                ],
              },
            ]}
          />
        </a-form-item>

        <a-form-item
          label="值类型"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-select
            placeholder={this.status == ModalStatus.View ? '' : '请选择值类型！'}
            disabled={this.status === ModalStatus.View}
            onChange={value => {
              this.isShowUpload = false;
              if (value == RepairValType.Table) {
                this.isShowUpload = true;
              }
            }}
            v-decorator={[
              'type',
              {
                initialValue: RepairValType.Number,
                rules: [{ required: true, message: '请选择值类型！' }],
              },
            ]}
          >
            {repairValTypeOption}
          </a-select>
        </a-form-item>

        {!this.isShowUpload ? (
          <a-form-item
            label="单位"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status === ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入单位'}
              v-decorator={[
                'unit',
                {
                  initialValue: '',
                },
              ]}
            />
          </a-form-item>
        ) : null}

        {!this.isShowUpload ? (
          <a-form-item
            label="预设结果"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmStdBasicPresetValueForRepairTestItem
              disabled={this.status === ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入预设结果'}
              v-decorator={[
                'defaultValue',
                {
                  initialValue: [],
                },
              ]}
            />
          </a-form-item>
        ) : null}
        {!this.isShowUpload ? (
          <a-form-item
            label="阈值预设"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input-group compact>
              <a-input-number
                style="width:calc((100% - 20px)*0.5)"
                step="0.1"
                placeholder={this.status == ModalStatus.View ? '' : '最大值'}
                disabled={this.status === ModalStatus.View}
                v-decorator={[
                  'maxRated',
                  {
                    initialValue: '',
                    rules: [{ required: false, message: '最大值' }],
                  },
                ]}
              />

              <span style="width:20px;text-align: center;">~</span>

              <a-input-number
                style="width:calc((100% - 20px)*0.5)"
                step="0.1"
                placeholder={this.status == ModalStatus.View ? '' : '最小值'}
                disabled={this.status === ModalStatus.View}
                v-decorator={[
                  'minRated',
                  {
                    initialValue: '',
                    rules: [{ required: false, message: '最小值' }],
                  },
                ]}
              />
            </a-input-group>
          </a-form-item>
        ) : null}
        {this.isShowUpload == true ? (
          <a-form-item
            label="文件名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <StdFileManageSelect
              disabled={this.status == ModalStatus.View}
              axios={this.axios}
              multiple={false}
              height={50}
              placeholder={this.status == ModalStatus.View ? '' : '请选择'}
              enableDownload={true}
              v-decorator={[
                'file',
                {
                  initialValue: [],
                  rules: [{ required: true, message: '请添加文件' }],
                },
              ]}
            />
          </a-form-item>
        ) : null}
      </a-form>
    );
    return (
      <div>
        <a-modal
          title={`${this.title}测试项`}
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
