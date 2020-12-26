/**
 * 说明：文件管理存储服务配置组件
 * 作者：easten
 */

import SmFileOssModal from './src/components/SmFileOssModal';
import ApiOss from '../../sm-api/sm-file/oss';
import { requestIsSuccess, vPermission, vP, vIf } from '../../_utils/utils';
import permissionsSmFile from '../../_permissions/sm-file';

let apiOss = new ApiOss();
export default {
  name: 'SmFileOss',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      ossList: [],
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '#',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 40,
          fixed: 'left',
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: 180,
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '当前启用',
          dataIndex: 'enable',
          width: 180,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'enable' },
        },
        {
          title: '端点',
          dataIndex: 'endPoint',
          width: 180,
          ellipsis: true,
          scopedSlots: { customRender: 'endPoint' },
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 180,
          ellipsis: true,
          scopedSlots: { customRender: 'state' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {},
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiOss = new ApiOss(this.axios);
    },
    async refresh() {
      this.loading = true;
      let response = await apiOss.getList();
      if (requestIsSuccess(response)) {
        console.log(response);
        this.ossList = response.data;
      }
      this.loading = false;
      this.getState();
    },
    // 添加
    add() {
      console.log('add method');
      this.$refs.SmFileOssModal.add();
    },
    //编辑
    edit(record) {
      let _this = this;
      _this.$confirm({
        title: '温馨提示',
        content: '对象存储服务信息请谨慎编辑！',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this.$refs.SmFileOssModal.edit(record);
        },
      });
    },
    // 清空
    remove(record) {
      let _this = this;
      this.$confirm({
        title: '温馨提示',
        content: `确定启用${record.name}OSS服务中的所有数据吗?`,
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          let response = await apiOss.clear(record.id);
          if (requestIsSuccess(response)) {
            _this.$message.success(`${record.name}服务中的资源已被清空，请知晓!`);
            _this.refresh();
          }
        },
      });
    },
    // 启动服务
    enable(record) {
      let _this = this;
      this.$confirm({
        title: '温馨提示',
        content: `确定启用${record.name}OSS服务吗?,启用之后之前的文件将无法使用,请考虑文件迁移!`,
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          let response = await apiOss.enable(record.id);
          if (requestIsSuccess(response)) {
            _this.$message.success('当前服务已启用！');
            _this.refresh();
          }
        },
      });
    },
    // 获取服务的状态
    async getState(id) {
      let _this = this;
      let response = await apiOss.getOssState(id);
      if (requestIsSuccess(response)) {
        var list = response.data;
        console.log(list)
        if (_this.ossList) {
          _this.ossList.forEach(a => {
            a.state = list.find(b => b.id == a.id).state;
          });
        }
      }
    }
  },
  render() {
    return (
      <div class="f-oss-container">
        {/* 操作区 */}
        <sc-table-operator>
          <template slot="buttons">

            {vIf(
              <a-button type="primary" icon="plus" onClick={this.add}>
                添加
            </a-button>,
              vP(this.permissions, permissionsSmFile.OssConfig.Create)
            )}

          </template>
        </sc-table-operator>
        {/* 表格 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.ossList}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                let str = index + 1;
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              name: (text, record, index) => {
                return (
                  <span>
                    <a-icon
                      type="database"
                      style={{ color: record.enable ? '#52C31A' : '#A5A5A5' }}
                    />
                    &nbsp;&nbsp;{text}
                  </span>
                );
              },
              enable: (text, record, index) => {
                return record.enable ? <a-icon type="check-circle" style="color:#52C31A" /> : '';
              },
              state: (text, record, index) => {
                return record.state == null ? "检测中..." : (record.state == '正常' ? (
                  record.enable ? <span style="color:rgb(82, 195, 26)">{record.state}</span> : record.state
                ) : (
                    <span style="color:red">{record.state}</span>
                  ));
              },
              endPoint: (text, record, index) => {
                return record.enable ? <span style="color:rgb(82, 195, 26)">{record.endPoint}</span> : record.endPoint;
              },
              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.enable(record);
                        }}
                        disabled={record.enable}
                      >
                        启用
                        </a>,
                      vP(this.permissions, permissionsSmFile.OssConfig.Enable)
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmFile.OssConfig.Enable) &&
                      vP(this.permissions, [permissionsSmFile.OssConfig.Update, permissionsSmFile.OssConfig.Delete])
                    )}
                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
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
                            vP(this.permissions, permissionsSmFile.OssConfig.Update,)
                          )}

                          {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.remove(record);
                                }}
                              >
                                清空
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmFile.OssConfig.Delete,)
                          )}

                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [permissionsSmFile.OssConfig.Update, permissionsSmFile.OssConfig.Delete])
                    )}
                  </span>,
                ];
              },
            },
          }}
        ></a-table>

        {/* 添加编辑模态框 */}
        <SmFileOssModal
          ref="SmFileOssModal"
          axios={this.axios}
          onSuccess={() => this.refresh()}
        />
      </div>
    );
  },
};
