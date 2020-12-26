import * as utils from '../../../_utils/utils';
import { ModalStatus } from '../../../_utils/enum';
import ApiEquipmentGroup from '../../../sm-api/sm-resource/EquipmentGroup';
import { pagination as paginationConfig, tips as tipsConfig } from '../../../_utils/config';
import { requestIsSuccess, vP, vIf } from '../../../_utils/utils';
import permissionsSmResource from '../../../_permissions/sm-resource';
let apiEquipmentGroup = new ApiEquipmentGroup();
import SmResourceEquipmentGroupModel from './SmResourceEquipmentGroupModel';
import SmSystemOrganizationTreeSelect from '../../../sm-system/sm-system-organization-tree-select';


// 定义表单字段常量
const formFields = [
  'parentId',
  'name',
  'order',
  'organizationId',
];
export default {
  name: 'SmResourceEquipmentGroupClassification',
  props: {
    axios: { type: Function, default: null },
    datas: { type: Object, default: null },//父级记录
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      dataSource: [],
      loading: false,

      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        maxResultCount: paginationConfig.defaultPageSize,
      },

      parentId: null,
      form: {}, // 表单
      code: null,//自动生成的编码

    };
  },

  computed: {
    columns() {
      return [
        {
          title: '#',
          dataIndex: 'index',
          width: '50px',
          scopedSlots: { customRender: 'index' },

        },
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          ellipsis: true,

        },
        {
          title: '排序',
          dataIndex: 'order',
          ellipsis: true,
          scopedSlots: { customRender: 'code' },
        },
        {
          title: '所属机构',
          dataIndex: 'organizationId',
          ellipsis: true,
          scopedSlots: { customRender: 'organizationId' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: '120px',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {
    datas: {
      handler: function (val, oldVal) {
        if (this.datas != null) {
          this.parentId = this.datas.id;
          this.form = this.$form.createForm(this, {});
          this.initAxios();
          this.refresh();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    this.form = this.$form.createForm(this, {});
    this.initAxios();
    this.refresh();

  },

  methods: {
    initAxios() {
      apiEquipmentGroup = new ApiEquipmentGroup(this.axios);
    },
    // 页面刷新
    async refresh(resetPage = true) {

      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiEquipmentGroup.getList({
        parentId: this.parentId,
        isAll: false,
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        maxResultCount: this.queryParams.maxResultCount,
      });
      if (requestIsSuccess(response) && response.data && response.data.items) {
        this.dataSource = response.data.items;
        this.totalCount = response.data.totalCount;
        this.dataSource.map(item => {
          item.children = null;
        });
        this.loading = false;
      }
    },

    //保存
    save() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let response = null;
          let data = {
            parentId: this.parentId,
            ...values,
            order: values ? values.order ? values.order : 0 : 0,
          };
          response = await apiEquipmentGroup.create(data);
          if (utils.requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.$emit('success');

            await this.refresh(false);
            this.getParentId();
            this.form.resetFields();
          }
        }
      });
    },
    //取消
    cancel() {
      this.form.resetFields();
    },
    //编辑
    edit(record) {
      this.$refs.SmResourceEquipmentGroupModel.edit(record);
    },
    // 删除
    remove(record) {
      this.$emit('record', record);
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiEquipmentGroup.delete(record.id);
            if (requestIsSuccess(response)) {
              setTimeout(resolve, 100);
              await _this.refresh(false);
              _this.getParentId();
            } else {
              setTimeout(reject, 100);
            }
          });
        },
        onCancel() { },
      });
    },
    //向父级传递数据
    getParentId() {
      let data = {
        parentId: this.parentId,
        length: this.dataSource.length,
      };
      this.$emit('dataValue', data);
    },
    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
  },
  render() {
    return (
      <div class="sm-resouce-equipment-group-classification">
        <a-table
          // size="middle"
          columns={this.columns}
          dataSource={this.dataSource}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                let result = index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                return <a-tooltip title={result} >{result}</a-tooltip>;
              },
              name: (text, record, index) => {

                let result = record ? record.name : '';
                return result ? <a-tooltip title={result} placement="topLeft">{result}</a-tooltip> : '';
              },
              order: (text, record, index) => {
                let result = record ? record.order : '';
                return result ? <a-tooltip title={result} placement="topLeft"> {result}</a-tooltip> : '';
              },
              organizationId: (text, record, index) => {
                let result = null;
                if (record && record.organization) {
                  result = record.organization.name;
                }
                return result ? <a-tooltip title={result} placement="topLeft">{result}</a-tooltip> : '';
              },
              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.edit(record);
                        }}
                      >
                        编辑</a>,
                      vP(this.permissions, permissionsSmResource.EquipmentGroups.Update),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmResource.EquipmentGroups.Update) &&
                      vP(this.permissions, permissionsSmResource.EquipmentGroups.Delete),
                    )}

                    {vIf(
                      <a
                        onClick={() => {
                          this.remove(record);
                        }}
                      >
                        删除
                      </a>,
                      vP(this.permissions, permissionsSmResource.EquipmentGroups.Delete),
                    )}

                  </span>,
                ];
              },
            },
          }}
        >
        </a-table>

        {vIf(
          <a-form form={this.form}>
            <a-row gutter={24}>
              <a-col sm={1} md={1}>
                <a-form-item wrapper-col={{ offset: 24 }}>
                  {this.totalCount + 1}
                </a-form-item>
              </a-col>
              <a-col sm={6} md={6}>
                <a-form-item wrapper-col={{ span: 24 }} >
                  <a-input
                    placeholder="请输入分组名称"
                    v-decorator={[
                      'name',
                      {
                        initialValue: null,
                        rules: [
                          {
                            message: '请输入分组名称',
                            required: true,
                            whitespace: true,
                          },
                        ],
                      },
                    ]}
                  />
                </a-form-item>
              </a-col>
              <a-col sm={5} md={5}>
                <a-form-item wrapper-col={{ span: 24 }} >
                  <a-input-number
                    min={0}
                    precision={0}
                    style="width:100%"
                    disabled={this.status == ModalStatus.View}
                    placeholder="请输入顺序"
                    v-decorator={[
                      'order',
                      {
                        initialValue: null,
                      },
                    ]}
                  />
                </a-form-item>
              </a-col>
              <a-col sm={8} md={8}>
                <a-form-item wrapper-col={{ span: 24 }} >
                  <SmSystemOrganizationTreeSelect
                    axios={this.axios}
                    disabled={this.status == ModalStatus.View}
                    placeholder='请选择组织机构'
                    v-decorator={[
                      'organizationId',
                      {
                        initialValue: null,
                        rules: [
                          {
                            required: true,
                            message: '请选择组织机构',
                            whitespace: true,
                          },
                        ],
                      },
                    ]}
                  />
                </a-form-item>
              </a-col>
              <a-col sm={4} md={4}>
                <a-form-item wrapper-col={{ span: 24 }} >
                  <span>
                    <a
                      onClick={() => {
                        this.save();
                      }}
                    >
                      保存</a>
                    <a-divider type="vertical" />
                    <a
                      onClick={() => {
                        this.cancel();
                      }}
                    >
                      取消
                    </a>
                  </span>,
                </a-form-item>
              </a-col>
            </a-row>

          </a-form>,
          vP(this.permissions, permissionsSmResource.EquipmentGroups.Create),
        )}

        {/* 分页器 */}

        <a-pagination
          style="float:right; margin-top:10px"
          total={this.totalCount}
          pageSize={this.queryParams.maxResultCount}
          current={this.pageIndex}
          onChange={this.onPageChange}
          onShowSizeChange={this.onPageChange}
          showSizeChanger
          showQuickJumper
          showTotal={paginationConfig.showTotal}
        />

        {/* 添加/编辑模板 */}
        <SmResourceEquipmentGroupModel
          ref="SmResourceEquipmentGroupModel"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
          onGetParent={() => {
            this.getParentId();
          }}
        />

      </div>
    );
  },
};