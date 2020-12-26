/**
 * 说明：文件服务配置模态组件
 * 作者：easten
 */
import { ModalStatus, OssServerType } from '../../../../_utils/enum';
import { form as formConfig } from '../../../../_utils/config';
import ApiOss from '../../../../sm-api/sm-file/oss';
import * as utils from '../../../../_utils/utils';
import { requestIsSuccess} from '../../../../_utils/utils';
let apiOss = new ApiOss();
const formFields = ['name', 'type', 'endPoint', 'accessKey', 'accessSecret'];
export default {
  name: 'SmFileOssModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态状态
      form: {},
      record: {},
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  watch: {},
  async created() {
    this.form = this.$form.createForm(this, {});
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiOss = new ApiOss(this.axios);
    },
    async add() {
      this.status = ModalStatus.Add;
    },
    async edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.$nextTick(() => {
        // 格式化记录
        let values = utils.objFilterProps(this.record, formFields);
        values = {
          ...values,
          name: this.record.name,
          type: this.record.type,
          endPoint: this.record.endPoint,
          accessKey: this.record.accessKey,
          accessSecret: this.record.accessSecret,
        };
        this.form.setFieldsValue(values);
      });
    },
   async ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let _values = values;
          console.log(values);
          if (this.status == ModalStatus.Add) {
            let response=await apiOss.create(values);
            if(requestIsSuccess(response)){
              this.$message.success('添加成功');
              this.close();
              this.$emit('success');
            }
          } else if (this.status == ModalStatus.Edit) {
            values={
              ...values,
              id:this.record.id,
            };
            let response=await apiOss.update(values);
            if(requestIsSuccess(response)){
              this.$message.success('更新成功');
              this.close();
              this.$emit('success');
            }
          }
        }
      });
    },
    close() {
      this.form.resetFields();
      this.unfold = false;
      this.status = ModalStatus.Hide;
    },
  },
  render() {
    return (
      <a-modal
        title={this.status == ModalStatus.Edit ? '编辑' : '添加'}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="OSS 类型"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-select
              style="width: 100%"
              v-decorator={[
                'type',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择Oss类型' }],
                },
              ]}
            >
              {Object.keys(OssServerType).map((item, index) => {
                return (
                  <a-select-option value={Object.values(OssServerType)[index]}>
                    {item}
                  </a-select-option>
                );
              })}
            </a-select>
          </a-form-item>

          <a-form-item
            label="服务名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status === ModalStatus.View ? '' : '服务名称'}
              disabled={this.status === ModalStatus.Edit}
              v-decorator={[
                'name',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入服务名称！' }],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="EndPoint"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status === ModalStatus.View ? '' : 'EndPoint'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'endPoint',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入服务EndPoint！' }],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="AppKey"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status === ModalStatus.View ? '' : 'AppKey'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'accessKey',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入服务AppKey！' },{ pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: 'AppKey输入有误' }],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="AppSecret"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder={this.status === ModalStatus.View ? '' : 'AppSecret'}
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'accessSecret',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入服务AppSecret！' },{ pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: 'AppSecret输入有误' }],

                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
