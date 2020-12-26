import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vP, vIf } from '../../_utils/utils';
import ComponentCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-component-category-tree-select';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
import './style/index.less';
import * as utils from '../../_utils/utils';
import ApiFault from '../../sm-api/sm-emerg/Fault';
import ApiEmergPlanRecord from '../../sm-api/sm-emerg/EmergPlanRecord';
import ApiEmergPlan from '../../sm-api/sm-emerg/EmergPlan';
import { State } from '../../_utils/enum';
import permissionsSmEmerg from '../../_permissions/sm-emerg';


let apiEmergPlan = new ApiEmergPlan();
let apiEmergPlanRecord = new ApiEmergPlanRecord();
let apiFault = new ApiFault();
const EmergPlanRouterPath = '/components/sm-emerg-plan-cn';

export default {
  name: 'SmEmergPlans',
  props: {
    permissions: { type: Array, default: () => [] },
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    isApply: { type: Boolean, default: false }, //是否启用调用功能,默认值为False
    value: { type: Object, default: null }, //故障数据
  },
  data() {
    return {
      loading: false,
      emergPlanData: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        keywords: null, // 名称搜索
        compoentCategoryIds: [], //构件分类
        maxResultCount: paginationConfig.defaultPageSize,
        levelId: undefined, //预案等级
      },
      iValue: null,
    };
  },

  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 90,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '预案名称',
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '预案摘要',
          dataIndex: 'summary',
          ellipsis: true,
        },
        {
          title: '构件分类',
          dataIndex: 'emergPlanRltComponentCategories',
          scopedSlots: { customRender: 'compoentCategories' },
          ellipsis: true,
        },
        {
          title: '主要附件',
          dataIndex: 'emergPlanRltFiles',
          scopedSlots: { customRender: 'files' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: '140px',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {
    isApply: {
      handler(nVal, oVal) {
        this.iValue = this.value;
        if (nVal) {
          this.queryParams.compoentCategoryIds = this.iValue.faultRltComponentCategories.map(
            item => item.componentCategoryId,
          );
          this.refresh();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.refresh();
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiEmergPlan = new ApiEmergPlan(this.axios);
      apiEmergPlanRecord = new ApiEmergPlanRecord(this.axios);
      apiFault = new ApiFault(this.axios);
    },
    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let queryParams = {
        keywords: this.queryParams.keywords, // 名称搜索
        componentCategoryIds: this.queryParams.compoentCategoryIds.map(item => item), //构件分类
        levelId: this.queryParams.levelId, //预案等级
        maxResultCount: paginationConfig.defaultPageSize,
        maxResultCount: this.queryParams.maxResultCount,
      };

      let response = await apiEmergPlan.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });
      if (requestIsSuccess(response) && response.data.items) {
        this.emergPlanData = response.data.items;
        this.totalCount = response.data.totalCount;
        if (page && this.totalCount && this.queryParams.maxResultCount) {
          let currentPage = parseInt(this.totalCount / this.queryParams.maxResultCount);
          if (this.totalCount % this.queryParams.maxResultCount !== 0) {
            currentPage = page + 1;
          }
          if (page > currentPage) {
            this.pageIndex = currentPage;
            this.refresh(false, this.pageIndex);
          }
        }
      }
      this.loading = false;
    },
    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
    //添加
    add() {
      this.$emit('add');
    },
    //详情
    view(record) {
      this.$emit('view', record.id);
      // let text= this.$router.resolve({
      //   path:EmergPlanRouterPath,
      //   query: {
      //     isVisible: 'true',
      //   },
      // });
      // window.open(text.href, '_blank');
    },
    //编辑
    edit(record) {
      this.$emit('edit', record.id);
    },
    //删除
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiEmergPlan.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.refresh(false, _this.pageIndex);
              _this.$message.success('删除成功');
              setTimeout(resolve, 100);
            } else {
              setTimeout(reject, 100);
            }
          });
        },
        onCancel() { },
      });
    },
    //引用预案
    async apply(record) {
      let data = { emergPlanId: record.id, faultId: this.iValue.id };
      let _this = this;
      this.$confirm({
        title: '预案调用',
        content: h => <div style="color:red;">{'是否确定调用'}</div>,
        okType: 'info',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiFault.applyEmergPlan(data);
            if (requestIsSuccess(response)) {
              _this.refresh(false);
              _this.$message.success('调用成功');
              setTimeout(resolve, 1000);
              _this.$emit('input', false);
            } else {
              setTimeout(reject, 1000);
            }
          });
        },
        onCancel() { },
      });
    },
  },
  render() {
    return (
      <div class="SmEmergPlans">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              keywords: null,
              compoentCategoryIds: [],
              levelId: undefined,
            };
            this.refresh();
          }}
        >
          <a-form-item label="关键字">
            <a-input
              placeholder="请输入预案名称/预案摘要"
              value={this.queryParams.keywords}
              onInput={value => {
                this.queryParams.keywords = value.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="构件分类">
            <ComponentCategoryTreeSelect
              axios={this.axios}
              placeholder="请选择"
              treeCheckable={true}
              treeCheckStrictly={true}
              value={this.queryParams.compoentCategoryIds}
              onChange={value => {
                this.queryParams.compoentCategoryIds = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="预案等级">
            <DataDictionaryTreeSelect
              axios={this.axios}
              groupCode={'EmergPlanLevel'}
              value={this.queryParams.levelId}
              onInput={value => {
                this.queryParams.levelId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          {this.isApply ? null : (

            <template slot="buttons">
              {vIf(
                <a-button type="primary" onClick={this.add}>
                  添加
                </a-button>,
                vP(this.permissions, permissionsSmEmerg.Plans.Create),
              )}
            </template>)}

        </sc-table-operator>
        {/* 表格展示 */}
        <a-table
          columns={this.columns}
          dataSource={this.emergPlanData}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          pagination={false}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              compoentCategories: (text, record, index) => {
                let result = '';
                record.emergPlanRltComponentCategories.map(
                  (item, index) =>
                    (result += `${index == 0 ? '' : '，'}${item.componentCategory.name}`),
                );
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },
              files: (text, record, index) => {
                return record.emergPlanRltFiles.length !== 0 ? (
                  <SmFileManageSelect
                    axios={this.axios}
                    enableDownload={true}
                    disabled={true}
                    bordered={false}
                    value={record.emergPlanRltFiles.map(item => item.file)}
                  />
                ) : (
                  ''
                );
              },
              operations: (text, record, index) => {
                return [
                  this.isApply ? (
                    <span>
                      {vIf(
                        <a
                          onClick={() => {
                            this.view(record);
                          }}
                        >
                          详情
                        </a>,
                        vP(this.permissions, permissionsSmEmerg.Plans.Detail),
                      )}
                      {vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions, permissionsSmEmerg.Plans.Detail) &&
                        vP(this.permissions, permissionsSmEmerg.Plans.Apply),

                      )}
                      {vIf(
                        <a
                          onClick={() => {
                            this.apply(record);
                          }}
                        >
                          调用
                        </a>,
                        vP(this.permissions, permissionsSmEmerg.Plans.Apply),
                      )}
                    </span>
                  ) : (
                    <span>
                      {vIf(
                        <a
                          onClick={() => {
                            this.view(record);
                          }}
                        >
                            详情
                        </a>,
                        vP(this.permissions, permissionsSmEmerg.Plans.Detail),
                      )}
                      {vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions, permissionsSmEmerg.Plans.Detail) &&
                          vP(this.permissions, permissionsSmEmerg.Plans.Update, permissionsSmEmerg.Plans.Delete),
                      )}
                      {vIf(
                        <span>
                          <a-dropdown trigger={['click']} hidden={this.isApply}>
                            <a class="ant-dropdown-link" onClick={''}>
                                更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                              {vIf(
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      this.edit(record);
                                    }}
                                  >
                                      编辑
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions, permissionsSmEmerg.Plans.Update),
                              )}
                              {vIf(
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      this.remove(record);
                                    }}
                                  >
                                      删除
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions, permissionsSmEmerg.Plans.Delete),
                              )}
                            </a-menu>
                          </a-dropdown>
                        </span>,
                        vP(this.permissions, permissionsSmEmerg.Plans.Update, permissionsSmEmerg.Plans.Delete),
                      )}
                    </span>
                  ),
                ];
              },
            },
          }}
        ></a-table>

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

      </div>
    );
  },
};
