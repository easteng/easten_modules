import { requestIsSuccess } from '../../_utils/utils';
import { codeFlatArrayToTreeBySeperate, treeArrayLoop } from '../../_utils/tree_array_tools';
import { ModalStatus } from '../../_utils/enum';

import ApiRole from '../../sm-api/sm-system/Role';
let apiRole = new ApiRole();

export default {
  name: 'SmSystemRoleAuthoriseModal',
  props: {
    axios: { type: Function, default: null },
    permissionBlackList: { type: Array, default: () => [] },   //权限黑名单
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      expandedKeys: [], //默认需要展开的节点
      record: null,
      checkedKeys: [],
      halfCheckedKeys: [],
      flatData: [], // 平装数据
      treeData: [],
      confirmLoading: false,
    };
  },
  computed: {
    visible() {
      // 计算模态框的显示变量
      return this.status !== ModalStatus.Hide;
    },

  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
    this.refresh();
  },
  methods: {
    initAxios() {
      apiRole = new ApiRole(this.axios);
    },

    // 刷新角色权限树
    async refresh() {

      let flatData = [];
      let response = await apiRole.getRolePermission({
        providerName: 'R',
        providerGuid: this.record ? this.record.id : undefined,
      });
      if (requestIsSuccess(response)) {
        let _this = this;
        if (response.data && response.data.groups) {
          for (let j = 0; j < response.data.groups.length; j++) {
            const group = response.data.groups[j];
            if (this.permissionBlackList.find(s => s == group.name)) continue;
            flatData.push({
              id: group.name,
              key: group.name,
              title: group.displayName,
            });
            for (let i = 0; i < group.permissions.length; i++) {
              const permission = group.permissions[i];
              if (_this.permissionBlackList.find(s => s == permission.name) || _this.permissionBlackList.find(s => s == permission.parentName)) continue;
              flatData.push({
                id: permission.name,
                key: permission.name,
                title: permission.displayName,
                isGranted: permission.isGranted,
              });
            }
          }
        }
      }
      let treeData = codeFlatArrayToTreeBySeperate(flatData, 'key', '.');
      treeData.map(top => {
        treeArrayLoop(top.children, item => {
          if (item.children) {
            item.isGranted = item.children.find(x => !x.isGranted) == null;
          }
        });
        top.isGranted = top.children.find(x => !x.isGranted) == null;
      });

      this.flatData = flatData;
      this.treeData = treeData;
      this.checkedKeys = this.flatData.filter(x => x.isGranted).map(x => x.id);
    },
    authorized(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.refresh();
    },

    close() {
      this.status = ModalStatus.Hide;
      this.flatData = [];
      this.treeData = [];
      this.checkedKeys = [];
      this.confirmLoading = false;
    },

    async ok() {
      let permissions = [...this.checkedKeys, ...this.halfCheckedKeys]
        .filter(x => x.indexOf('.') > -1)
        .map(key => {
          return {
            name: key,
            isGranted: true,
          };
        });
      this.confirmLoading = true;
      let response = await apiRole.setRolePermission(
        {
          providerName: 'R',
          providerGuid: this.record.id,
        },
        { permissions },
      );

      if (requestIsSuccess(response)) {
        this.$message.success('操作成功');
        this.close();
        this.$emit('success');
      }
      this.confirmLoading = false;
    },

  },
  render() {
    return (
      <a-modal title="角色授权"
        visible={this.visible}
        confirmLoading={this.confirmLoading}
        destroyOnClose={true}
        onCancel={this.close}
        onOk={this.ok}>
        <a-tree
          style={'height:450px;overflow: auto'}
          checkable
          checkedKeys={this.checkedKeys}
          onCheck={(value, event) => {
            this.halfCheckedKeys = event.halfCheckedKeys;
            this.checkedKeys = value;
          }}
          treeData={this.treeData}
        >
        </a-tree>
      </a-modal>
    );
  },
};
