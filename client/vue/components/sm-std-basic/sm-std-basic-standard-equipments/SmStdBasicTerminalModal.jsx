import { ModalStatus } from '../../_utils/enum';
import ApiTerminal from '../../sm-api/sm-std-basic/Terminal';
import { requestIsSuccess } from '../../_utils/utils';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import SmStdBasicProductCategoryTreeSelec from '../sm-std-basic-product-category-tree-select';

let apiTerminal = new ApiTerminal();

export default {
  name: 'SmStdBasicTerminalModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      newName: '',
      editingKey: '', //当前编辑的key
      loading: false,
      status: ModalStatus.Hide, //模态框状态
      terminals: [], //设备关联的端子列表数据
      cacheTerminals: [],
      record: {},
      productCategoryId: null, //端子类型Id
      queryParams: {
        name: '',
        modelId: null,
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
      },
      pageIndex: 1,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '#',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '端子名称',
          dataIndex: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '端子类型',
          dataIndex: 'productCategory',
          scopedSlots: { customRender: 'productCategory' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 110,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },

  watch: {
    value: {
      handler: function() {
        this.iValue = this.value;
      },
      immediate: true,
    },
  },
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiTerminal = new ApiTerminal(this.axios);
    },

    //获取数据
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiTerminal.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response)) {
        this.terminals = response.data.items;
        this.cacheTerminals = this.terminals.map(item => ({ ...item }));
        this.totalCount = response.data.totalCount;
      }
      this.loading = false;
    },

    // 页码切换调用方法
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    // 添加端子
    async add() {
      this.status = ModalStatus.Add;
      if (this.productCategoryId === undefined || this.productCategoryId === null) {
        this.$message.error('请选择端子类型');
      } else {
        let response = await apiTerminal.create({
          name: this.queryParams.name,
          modelId: this.record.id,
          productCategoryId: this.productCategoryId,
          remark: '',
        });
        if (requestIsSuccess(response)) {
          this.queryParams.name = '';
          this.productCategoryId = null;
          this.$message.success('操作成功');
          this.refresh(true);
        }
      }
    },


    //编辑按钮
    edit(record) {
      const newData = [...this.terminals];
      const target = newData.filter(item => record.id === item.id)[0];
      this.editingKey = record.id;
      if (target) {
        target.editable = true;
        this.terminals = newData;
        this.newName = record.name;
        this.productCategoryId = record.productCategoryId;
      }
    },

    //模态框弹出
    async editConnection(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.queryParams.modelId = record.id;
      this.refresh();
    },

    async save(record) {
      const newData = [...this.terminals];
      const newCacheConnections = [...this.cacheTerminals];
      const target = newData.filter(item => record.id === item.id)[0];
      const targetCache = newCacheConnections.filter(item => record.id === item.id)[0];
      if (target && targetCache) {
        delete target.editable;
        this.terminals = newData;
        Object.assign(targetCache, target);
        this.cacheTerminals = newCacheConnections;
        let response = await apiTerminal.update({
          name: this.newName,
          modelId: record.modelId,
          productCategoryId: this.productCategoryId,
          remark: '',
          id: record.id,
        });
        if (requestIsSuccess(response)) {
          this.$message.success('操作成功');
          this.refresh(false);
        }
      }
      this.editingKey = '';
    },
    onChange(value, id, column) {
      const newData = [...this.terminals];
      const target = newData.filter(item => id === item.id)[0];
      if (target) {
        target[column] = value;
        this.terminals = newData;
        this.newName = value;
      }
    },
    cancel(id) {
      const newData = [...this.terminals];
      const target = newData.filter(item => id === item.id)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheTerminals.filter(item => id === item.id)[0]);
        delete target.editable;
        this.terminals = newData;
      }
    },
    delete(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiTerminal.delete(record.id);
            _this.refresh(true);
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },
    close() {
      this.status = ModalStatus.Hide;
      this.queryParams.name = '';
      this.newName = '';
      this.productCategoryId = null;
    },
  },
  render() {
    return (
      <a-modal
        class="connection"
        title="端子维护"
        visible={this.status !== ModalStatus.Hide}
        onCancel={this.close}
        onOk={this.close}
      >
        <div>
          {/* 操作区 */}
          <a-input-group compact style="margin-bottom: 24px; display:flex;">
            <a-input
              placeholder="请输入端子名称"
              value={this.queryParams.name}
              onInput={event => {
                this.queryParams.name = event.target.value;
                this.refresh(true);
              }}
            >
              <a-icon slot="prefix" type="search" />
            </a-input>
            {this.queryParams.name && this.terminals.length === 0
              ? [
                <SmStdBasicProductCategoryTreeSelec
                  axios={this.axios}
                  style="width: 50%"
                  value={this.productCategoryId}
                  onInput={value => {
                    if (value) {
                      this.productCategoryId = value;
                    } else {
                      this.productCategoryId = null;
                    }
                  }}
                />,
                <a-button onClick={this.add} type="primary">
                    添加
                </a-button>,
              ]
              : undefined}
          </a-input-group>

          {/* 展示区 */}
          <a-table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.terminals}
            bordered={this.bordered}
            pagination={false}
            loading={this.loading}
            scroll={{ y: 300 }}
            {...{
              scopedSlots: {
                index: (text, record, index) => {
                  return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                },
                name: (text, record, index) => {
                  return record.editable ? (
                    <a-input
                      style="margin: -10px 0"
                      value={text}
                      onChange={event => {
                        this.onChange(event.target.value, record.id, 'name');
                      }}
                    />
                  ) : (
                    text
                  );
                },
                productCategory: (text, record, index) => {
                  return record.editable ? (
                    <SmStdBasicProductCategoryTreeSelec
                      axios={this.axios}
                      value={record.productCategoryId}
                      onInput={value => {
                        record.productCategoryId = value;
                        this.productCategoryId = value;
                      }}
                    />
                  ) : (
                    record.productCategory.name
                  );
                },
                operations: (text, record) => {
                  let result;
                  if (record.editable) {
                    result = (
                      <span>
                        <a
                          onClick={() => {
                            this.save(record);
                          }}
                        >
                          保存
                        </a>
                        <a-divider type="vertical" />
                        <a-popconfirm
                          title="确定要取消编辑?"
                          onConfirm={() => this.cancel(record.id)}
                        >
                          <a>取消</a>
                        </a-popconfirm>
                      </span>
                    );
                  } else {
                    result = (
                      <span disabled={this.editingKey !== ''}>
                        <a
                          onClick={() => {
                            this.edit(record);
                          }}
                        >
                          编辑
                        </a>
                        <a-divider type="vertical" />
                        <a
                          onClick={() => {
                            this.delete(record);
                          }}
                        >
                          删除
                        </a>
                      </span>
                    );
                  }
                  return result;
                },
              },
            }}
          ></a-table>

          {/* 分页器 */}
        
          <a-pagination
            style="display:flex; justify-content: flex-end; margin-top:10px; width=100%"
            total={this.totalCount}
            pageSize={this.queryParams.maxResultCount}
            current={this.pageIndex}
            onChange={this.onPageChange}
            onShowSizeChange={this.onPageChange}
            showSizeChanger
            size="small"
            showTotal={paginationConfig.showTotal}
          />
         
        </div>
      </a-modal>
    );
  },
};
