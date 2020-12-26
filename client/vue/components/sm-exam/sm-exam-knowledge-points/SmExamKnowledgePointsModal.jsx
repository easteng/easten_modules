import * as utils from '../../_utils/utils';
import ApiKonwledgePoint from '../../sm-api/sm-exam/KonwledgePoint';
import { ModalStatus } from '../../_utils/enum';
import { form as formConfig, tips } from '../../_utils/config';
import CategoryTreeSelect from '../sm-exam-category-tree-select';
import KnowledgePointTreeSelect from '../sm-exam-knowledge-point-tree-select';

let apiKonwledgePoint = new ApiKonwledgePoint();
const formFields = ['parentId', 'name', 'description', 'order', 'categoryIds'];
export default {
  name: 'SmExamKnowledgePointsModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      loading: false, //确定按钮是否处于加载状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
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
      apiKonwledgePoint = new ApiKonwledgePoint(this.axios);
    },

    //查看详情
    async details(record) {
      this.status = ModalStatus.View;

      let response = await apiKonwledgePoint.get(record.id);
      if (utils.requestIsSuccess(response)) {
        let _record = response.data;
        this.record = {
          ..._record,
          categoryIds: _record.knowledgePointRltCategories.map((item, index) => item.categoryId),
        };
      }

      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    //编辑
    async edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      let response = await apiKonwledgePoint.get(record.id);
      if (utils.requestIsSuccess(response)) {
        console.log(response.data.knowledgePointRltCategories + 'response');
        let _record = response.data;
        this.record = {
          ..._record,
          categoryIds: _record.knowledgePointRltCategories.map((item, index) => item.categoryId),
        };
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    //添加
    add(record) {
      this.status = ModalStatus.Add;
      this.record = record;
      this.record.parentId = record.id;
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({ parentId: record.id });
      });
    },

    //关闭
    close() {
      this.status = ModalStatus.Hide;
      this.record = null;
      this.loading = false;
    },

    //数据保存

    async ok() {
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          console.log(values);
          console.log(this.record);
          let _values = values;
          if (!err) {
            let data = {
              ..._values,
              //   categoryIds: this.record.knowledgePointRltCategories
              //     ? this.record.knowledgePointRltCategories.map(item => {
              //         item.categoryId;
              //       })
              //     : [],
              id: this.record.id,
            };
            let response = null;
            console.log(data.categoryIds);
            this.loading = true;
            if (this.status === ModalStatus.Add) {
              // 添加
              response = await apiKonwledgePoint.create(data);
            } else if (this.status === ModalStatus.Edit) {
              this.confirmLoading = true;
              console.log(data + 'data');
              response = await apiKonwledgePoint.update(data);
            }

            if (utils.requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }
          }
        });
        this.loading = false;
      }
    },
  },

  render() {
    return (
      <a-modal
        title={`${this.title}知识点`}
        okText="保存"
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
        confirmLoading={this.loading}
        width={600}
      >
        {/* 分类树 */}
        <a-form form={this.form}>
          <a-form-item
            label="分类"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <CategoryTreeSelect
              disabled={this.status == ModalStatus.View}
              placeholder="请输入"
              treeCheckStrictly={true}
              axios={this.axios}
              treeCheckable={true}
              v-decorator={[
                'categoryIds',
                {
                  initialValue: [],
                  rules: [
                    {
                      required: true,
                      message: '请选择分类',
                      //   whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>

          {/*父级树*/}
          <a-form-item
            label="父级"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <KnowledgePointTreeSelect
              disabled={
                (this.status == ModalStatus.Add && this.record.parentId != null) ||
                this.status == ModalStatus.View
              }
              placeholder="请输入"
              axios={this.axios}
              v-decorator={[
                'parentId',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>
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
                      max: 100,
                      message: '标题最多可输入100字',
                    },
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
            label="描述"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'description',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 100,
                      message: '标题最多可输入200字',
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
            <a-input
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={['order']}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
