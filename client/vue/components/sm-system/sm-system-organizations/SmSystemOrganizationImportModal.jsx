import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import FileSaver from 'file-saver';
import { template } from 'lodash';
let apiOrganization = null;

export default {
  name: 'SmSystemOrganizationImportModal',
  props: {
    axios: { type: Function, default: null },
    organizations: { type: Array, default: () => [] },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      iOrganizations: [],
      loading: false,
      CSRGCode: 'all', //选择的CSRGCode编码
      isShowImportRes: false,
    };
  },
  computed: {
    visible() {
      // 计算模态框的显示变量
      return this.status !== ModalStatus.Hide;
    },
  },

  watch: {
    organizations: {
      handler: function (value, oldValue) {
        this.iOrganizations = value;
      },
      immediate: true,
    },
  },

  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
    },

    upload() {
      this.status = ModalStatus.Add;
    },

    // 关闭模态框
    close() {
      this.status = ModalStatus.Hide;
      this.CSRGCode = 'all';
    },

    //输入框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },

    // 数据提交
    async ok() {
      let response = null;
      if (this.status === ModalStatus.Add) {
        // 导入
        this.loading = true;
        response = await apiOrganization.import({
          CSRGCode: this.CSRGCode,
        });
        this.loading = false;

        if (utils.requestIsSuccess(response)) {
          if (response.data && response.data.length > 0) {
            // this.$message.info('导入完成,请查看输出结果', 5);
            // FileSaver.saveAs(
            //   new Blob([response.data], { type: 'text/plain;charset=utf-8' }),
            //   `组织机构数据导入结果.txt`,
            // );
            this.$info({
              title: '组织单元数据导入结果',
              width: 600,
              content: (
                <a-row>
                  <a-col span="22">
                    <a-textarea readOnly rows="14" value={response.data} />
                  </a-col>
                  <a-col span="2"></a-col>
                </a-row>
              ),
              onOk: () => {
                this.close();
              },
            });
          } else {
            this.$message.success('导入成功');
            this.close();
            this.$emit('success');
          }
        }
      }
    },
  },
  render() {
    return (
      <a-modal
        title="导入组织机构"
        visible={this.visible}
        confirmLoading={this.loading}
        onCancel={this.close}
        onOk={this.ok}
      >
        {/* <div slot="footer">
          <SmImport
            ref="SmImport"
            axios={this.axios}
            downloadErrorFile={true}
            onmousedown={this.ok}
          />
        </div> */}
        <a-select
          style="width:100%;"
          showSearch
          filterOption={this.filterOption}
          options={this.iOrganizations}
          value={this.CSRGCode}
          onChange={value => {
            this.CSRGCode = value;
          }}
        />
      </a-modal>
    );
  },
};
