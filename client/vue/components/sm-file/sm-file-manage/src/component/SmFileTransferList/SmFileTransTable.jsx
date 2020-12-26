/**
 * 说明：文件传输表格组件
 * 作者：easten
 */
import {
  pagination as paginationConfig,
  tips as tipsConfig,
} from '../../../../../_utils/config';
import { TransType, FileSizeTrans } from '../../common';
export default {
  name: 'SmFileTransTable',
  props: {
    type: { type: Number, default: 0 }, // 表格类型，分为下载上传一种形态，已经完成一种形态 runing,complete
    dataSource: { type: Array, default: null }, // 数据源，由父组件负责计算并传递
  },
  data() {
    return {
      datas: [],
      totalCount: 0,
      pageIndex: 1,
      tableType: TransType.DownLoad,
      queryParams: {
        maxResultCount: paginationConfig.defaultPageSize,
      },
      tableColumns: [
        {
          title: '#',
          dataIndex: 'index',
          width: 50,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '名称',
          dataIndex: 'name',
          // width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 100,
          ellipsis: true,
        },
        {
          title: '大小',
          width: 100,
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          // width: {data.tableType=='runing'?300,100},
          scopedSlots: { customRender: 'operations' },
        },
      ],
      bordered: false,
      loading: false,
      operationColumnsWidth: 300,
    };
  },
  computed: {
    columns() {
      return this.tableColumns;
    },
    tableMaxHeight() {
      // TODO 给表格给定高度值，控制滚动条
      return 500;
    },
  },
  watch: {
    type: {
      handler(nVal, oVal) {
        this.tableType = nVal;
      },
      immediate: true,
    },
    dataSource: {
      handler(nVal, oVal) {
        this.datas = nVal||[]   ;
      },
      immediate: true,
    },
  },
  created() {
    this.tableType = this.type;
  },
  methods: {
    cancle() {
      let _this = this;
      this.$confirm({
        title: '温馨提示',
        content: '确定要取消此项吗',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          // 执行api 操作
          _this.$message.success('文件传输已取消！');
        },
      });
    },
  },
  render() {
    // 文件表格
    let tableContent = (
      <div class="f-table">
        <a-table
          columns={this.columns}
          dataSource={this.datas}
          rowKey={a => a.id}
          bordered={this.bordered}
          loading={this.loading}
          scroll={{ y: this.tableMaxHeight }}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              name: (text, row, index) => {
                return row.type == '文件夹' ? (
                  <div>
                    <a-icon type="folder-open" />
                    &nbsp;&nbsp;{text}
                  </div>
                ) : (
                  <div>
                    <a-icon type="file-image" />
                    &nbsp;&nbsp;{text}
                  </div>
                );
              },
              size: (text, record, index) => {
                return FileSizeTrans(record.size);
              },
              // 操作
              operations: (t, row) => {
                return this.tableType != TransType.Complete ? (
                  <div class="f-progress">
                    <a-progress percent={row.progress} size="small" status="active" />
                    <a-button type="link" onClick={this.cancle}>
                      <a-icon type="close" />
                    </a-button>
                    <a-button type="link">
                      <a-icon type="folder-open" />
                    </a-button>
                  </div>
                ) : (
                  <div class="f-progress">
                    {row.upload? (
                      <span>
                        <a-icon type="arrow-up" /> &nbsp;&nbsp;上传完成
                      </span>
                    ) : (
                      <span>
                        <a-icon type="arrow-down" /> &nbsp;&nbsp;下载完成
                      </span>
                    )}
{/* 
                    <a-button type="link" onClick={this.cancle}>
                      <a-icon type="delete" />
                    </a-button> */}
                  </div>
                );
              },
            },
          }}
        ></a-table>
      </div>
    );
    return tableContent;
  },
};
