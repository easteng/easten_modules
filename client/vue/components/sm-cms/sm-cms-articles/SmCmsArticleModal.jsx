import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiArticle from '../../sm-api/sm-cms/Article';
import CategoryTreeSelect from '../sm-cms-category-tree-select';
import FileModal from '../../sm-file/sm-file-manage-modal';
import { upload } from './src/icon/upload.svg';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
let apiArticle = new ApiArticle();
import moment from 'moment';

// 定义表单字段常量
const formFields = [
  'title',
  'categories',
  'summary',
  'thumb',
  'date',
  'accessories',
  'carousels',
  'author',
];
export default {
  name: 'SmCmsArticleModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      loading: false, //确定按钮加载状态
      content: '',
      editor: null,
      extraButtons: [], // 富文本自定义上传按钮
      fileModalIsShow: false, // 文件管理弹框是否弹出
      fileServerEndPoint: '', //文件服务请求头
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
    this.fileServerEndPoint = localStorage.getItem('fileServerEndPoint');
  },

  mounted() {
    this.extraButtons = [
      {
        name: 'insertFile',
        iconURL: upload,
        tooltip: '上传文件',
        exec: editor => {
          this.uploadFile(editor);
        },
      },
    ];
  },

  methods: {
    initAxios() {
      apiArticle = new ApiArticle(this.axios);
    },

    uploadFile(editor) {
      this.editor = editor;
      this.fileModalIsShow = true;
    },

    add() {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue();
      });
    },

    async edit(record) {
      this.status = ModalStatus.Edit;
      let response = await apiArticle.get(record.id);
      if (utils.requestIsSuccess(response) && response.data) {
        let _record = response.data;
        this.content = _record.content.replace(
          new RegExp(`src="`, 'g'),
          `src="${this.fileServerEndPoint}`,
        );
        this.record = {
          ..._record,
          date: _record.date ? moment(_record.date) : null,
          thumb: _record.thumb,
          accessories: _record.accessories ? _record.accessories.map(item => item.file) : [],
          carousels: _record.carousels ? _record.carousels.map(item => item.file) : [],
          categories: _record.categories
            ? _record.categories.map(item => {
              return {
                label: item.categoryTitle,
                value: item.categoryId,
              };
            })
            : [],
        };
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    // 详情
    async view(record) {
      this.status = ModalStatus.View;
      let response = await apiArticle.get(record.id);
      if (utils.requestIsSuccess(response) && response.data) {
        let _record = response.data;
        this.content = _record.content.replace(
          new RegExp(`src="`, 'g'),
          `src="${this.fileServerEndPoint}`,
        );
        this.record = {
          ..._record,
          date: _record.date ? moment(_record.date) : null,
          thumb: _record.thumb,
          accessories: _record.accessories ? _record.accessories.map(item => item.file) : [],
          carousels: _record.carousels ? _record.carousels.map(item => item.file) : [],
          categories: _record.categories
            ? _record.categories.map(item => {
              return {
                label: item.categoryTitle,
                value: item.categoryId,
              };
            })
            : [],
        };
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    //富文本文件上传内容处理
    onSelected(file) {
      if (['.jpg', '.jpeg', '.png', 'bmp', 'gif', 'psd', 'dxf'].indexOf(file.type) > -1) {
        this.editor.selection.insertHTML(
          `<img
            src="${utils.getFileUrl(file.url)}"
            alt="${file.name}"
          ></img>`,
        );
      } else if (['.WAV', '.wav', '.MP3', '.mp3', '.WMA', '.wma'].indexOf(file.type) > -1) {
        this.editor.selection.insertHTML(`<embed src="${file.url}"/>`);
      } else if (['.MP4', '.mp4', '.WebM', '.Ogg', '.webm', '.ogg'].indexOf(file.type) > -1) {
        this.editor.selection.insertHTML(`<video controls src="${utils.getFileUrl(file.url)}"/>`);
      } else {
        this.editor.selection.insertHTML(
          `<a-tooltip placement="topLeft" title="请点击下载">
              <a href="${utils.getFileUrl(file.url)}" download=${file.name}>${file.name}</a>
        </a-tooltip>`,
        );
      }
    },

    // 关闭模态框
    close() {
      this.form.resetFields();
      this.record = null;
      this.status = ModalStatus.Hide;
      this.content = '';
      this.loading = false;
    },

    // 数据提交
    ok() {
      let _content = this.$refs['sc-rich-text-editor'].editor.value;
      let reg = new RegExp(`${this.fileServerEndPoint}`, 'g');
      if (_content === '') {
        this.$message.error('文章内容不能为空');
        return;
      } else if (_content.length > 0) {
        let contentTrim = _content.replace(new RegExp('&nbsp; ', 'g'), '').replace(new RegExp('&nbsp;', 'g'), '');
        //当去掉空格之后长度为0，说明之前的都是空格
        if (contentTrim.length === 0) {
          this.$message.error('文章内容不能为空');
          return;
        }
      }

      this.form.validateFields(async (err, values) => {
        if (!err) {

          let _values = JSON.parse(JSON.stringify(values));
          let data = {
            ..._values,
            categories: _values.categories
              ? _values.categories.map(item => {
                return { id: item.value };
              })
              : [],
            date: _values.date ? moment(_values.date).format('YYYY-MM-DD') : '',
            thumbId: _values.thumb ? _values.thumb.id : null,
            accessories: _values.accessories
              ? _values.accessories.map(item => {
                return { fileId: item.id };
              })
              : [],
            carousels: _values.carousels
              ? _values.carousels.map((item, index) => {
                return {
                  fileId: item.id,
                  order: index + 1,
                };
              })
              : [],
            content: _content.replace(reg, ''),
          };
          this.loading = true;
          let response = null;
          if (this.status === ModalStatus.Add) {
            //添加
            response = await apiArticle.create(data);
          } else if (this.status === ModalStatus.Edit) {
            // 编辑
            response = await apiArticle.update({ id: this.record.id, ...data });
          } else {
            this.close();
          }

          if (utils.requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.close();
            this.$emit('success');
          }
        }
      });
      this.loading = false;
    },
  },
  render() {
    return (
      <a-modal
        title={`${this.title}文章`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.loading}
        destroyOnClose={true}
        okText={this.status !== ModalStatus.View ? "保存" : '确定'}
        onOk={this.ok}
        width={800}
      >
        <a-form form={this.form}>
          <a-tabs>
            <a-tab-pane key={1} tab="基本信息" forceRender={true}>
              <a-row gutter={24}>
                <a-col sm={24} md={24}>
                  <a-form-item label="标题" label-col={{ span: 3 }} wrapper-col={{ span: 20 }}>
                    <a-input
                      disabled={this.status == ModalStatus.View}
                      placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                      v-decorator={[
                        'title',
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
                </a-col>

                <a-col sm={24} md={24}>
                  <a-form-item label="栏目" label-col={{ span: 3 }} wrapper-col={{ span: 20 }}>
                    <CategoryTreeSelect
                      axios={this.axios}
                      disabled={this.status == ModalStatus.View}
                      treeCheckStrictly={true}
                      treeCheckable={true}
                      placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                      v-decorator={[
                        'categories',
                        {
                          initialValue: null,
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>

                <a-col sm={24} md={24}>
                  <a-form-item label="概要" label-col={{ span: 3 }} wrapper-col={{ span: 20 }}>
                    <a-textarea
                      rows="3"
                      disabled={this.status == ModalStatus.View}
                      placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                      v-decorator={[
                        'summary',
                        {
                          initialValue: '',
                          rules: [
                            {
                              max: 100,
                              message: '概要最多可输入100字',
                            },
                            {
                              required: true,
                              message: '请输入概要',
                              whitespace: true,
                            },
                          ],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>

                <a-col sm={24} md={24}>
                  <a-form-item label="缩略图" label-col={{ span: 3 }} wrapper-col={{ span: 20 }}>
                    <SmFileManageSelect
                      disabled={this.status == ModalStatus.View}
                      axios={this.axios}
                      multiple={false}
                      height={73}
                      placeholder={this.status == ModalStatus.View ? '' : '请选择'}
                      enableDownload={true}
                      v-decorator={[
                        'thumb',
                        {
                          initialValue: {},
                          // rules: [{ required: true, message: '请添加缩略图' }],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>

                <a-col sm={24} md={24}>
                  <a-form-item label="轮播图" label-col={{ span: 3 }} wrapper-col={{ span: 20 }}>
                    <SmFileManageSelect
                      disabled={this.status == ModalStatus.View}
                      axios={this.axios}
                      height={73}
                      multiple={true}
                      placeholder={this.status == ModalStatus.View ? '' : '请选择'}
                      enableDownload={true}
                      v-decorator={[
                        'carousels',
                        {
                          initialValue: [],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>

                <a-col sm={24} md={24}>
                  <a-form-item label="附件列表" label-col={{ span: 3 }} wrapper-col={{ span: 20 }}>
                    <SmFileManageSelect
                      disabled={this.status == ModalStatus.View}
                      axios={this.axios}
                      height={73}
                      multiple={true}
                      placeholder={this.status == ModalStatus.View ? '' : '请选择'}
                      enableDownload={true}
                      v-decorator={[
                        'accessories',
                        {
                          initialValue: [],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>

                <a-col sm={24} md={12}>
                  <a-form-item label="作者" label-col={{ span: 6 }} wrapper-col={{ span: 16 }}>
                    <a-input
                      disabled={this.status == ModalStatus.View}
                      placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                      v-decorator={[
                        'author',
                        {
                          initialValue: '',
                          rules: [
                            {
                              max: 50,
                              message: '最多可输入50字',
                            },
                            {
                              required: true,
                              message: '请输入作者',
                              whitespace: true,
                            },
                          ],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>

                <a-col sm={24} md={12}>
                  <a-form-item label="发布时间" label-col={{ span: 6 }} wrapper-col={{ span: 16 }}>
                    <a-date-picker
                      disabled={this.status == ModalStatus.View}
                      style="width:100%"
                      v-decorator={[
                        'date',
                        {
                          initialValue: moment(),
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key={2} tab="内容" forceRender={true}>
              <a-form-item>
                <sc-rich-text-editor
                  ref="sc-rich-text-editor"
                  value={this.content}
                  disabled={this.status == ModalStatus.View}
                  height={450}
                  extraButtons={this.extraButtons}
                />
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
        </a-form>
        {/* 文件上传 */}
        <FileModal
          ref="FileModal"
          axios={this.axios}
          visible={this.fileModalIsShow}
          multiple={false}
          onChange={visible => {
            this.fileModalIsShow = visible;
          }}
          onOk={value => {
            this.onSelected(value);
          }}
        />
      </a-modal>
    );
  },
};
