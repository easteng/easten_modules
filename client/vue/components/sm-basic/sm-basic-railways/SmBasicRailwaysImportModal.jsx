import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import OrganizationTree from '../../sm-system/sm-system-organization-tree';
import ApiRailway from '../../sm-api/sm-basic/Railway';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import SmImport from '../../sm-import/sm-import-basic';
import './style/index.less';

let apiRailway = new ApiRailway();
let apiOrganization = new ApiOrganization();

export default {
  name: 'SmBasicRailwaysImportModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      code: '', //所选组织机构code编码
      isLoading: false,
      fileList: [],
      orgData: [],
    };
  },
  computed: {
    visible() {
      // 计算模态框的显示变量
      return this.status !== ModalStatus.Hide;
    },
  },

  watch: {},

  async created() {
    this.initAxios();
    let resp = await apiOrganization.getList();
    if (utils.requestIsSuccess(resp)) {
      this.orgData = resp.data.items;
    }
  },

  methods: {
    initAxios() {
      apiRailway = new ApiRailway(this.axios);
      apiOrganization = new ApiOrganization(this.axios);
    },

    //弹出模态框
    upload() {
      this.status = ModalStatus.Add;
    },

    // 关闭模态框
    close() {
      this.status = ModalStatus.Hide;
      this.code = '';
      this.$emit('success');
    },

    async fileSelected(file) {
      let hasExist = this.fileList.some(item => item.name === file.name);
      if (!hasExist) {
        this.fileList = [...this.fileList, file];
      }

      if (this.code == null || this.code == undefined || this.code == '') {
        this.$message.error('请选择组织机构');
        return;
      }
      
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': this.fileList[0],
        'importKey': 'railways',
        'BelongOrgCode': this.code,
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
      this.fileList = [];
    },
  },
  render() {
    return (
      <a-modal
        title="请选择组织机构"
        visible={this.visible}
        confirmLoading={this.loading}
        onCancel={this.close}
        destroyOnClose={true}
        class="import-modal"
      >
        <template slot="footer">
          <div style='display:flex;justify-content:flex-end'>
            <a-button type="primary" style="margin-right:10px;" onClick={this.close}>
              取消
            </a-button>
            <SmImport
              ref="smImport"
              url='api/app/basicRailway/upload'
              axios={this.axios}
              downloadErrorFile={true}
              importKey="railways"
              onSelected={file => this.fileSelected(file)}
              onIsSuccess={() => this.close()}
            />
          </div>
        </template>

        <OrganizationTree
          axios={this.axios}
          placeholder="请选择组织机构"
          value={this.code}
          onSelect={(value, code) => {
            this.code = code;
          }}
          treeData={this.orgData}
        />
        {this.isLoading ? (
          <div style="position:fixed;left:0;right:0;top:0;bottom:0;z-index:9999;">
            <div style="position: relative;;top:45%;left:50%">
              <a-spin tip="Loading..." size="large"></a-spin>
            </div>
          </div>
        ) : null}
      </a-modal>
    );
  },
};
