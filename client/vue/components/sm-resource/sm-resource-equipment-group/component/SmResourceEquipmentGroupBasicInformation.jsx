import SmResourceEquipmentGroupModel from './SmResourceEquipmentGroupModel';
import ApiEquipmentGroup from '../../../sm-api/sm-resource/EquipmentGroup';
import { requestIsSuccess, vIf, vP } from '../../../_utils/utils';
import permissionsSmResource from '../../../_permissions/sm-resource';

let apiEquipmentGroup = new ApiEquipmentGroup();

export default {
  name: 'SmResourceEquipmentGroupBasicInformation',
  props: {
    datas: { type: Object, default: null },//数据源
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
  },

  data() {
    return {
      dataSource: {},
    };
  },
  computed: {
    getOrganization() {
      let organizationName = null;
      if (this.dataSource && this.dataSource.organization) {
        organizationName = this.dataSource.organization.name;
      }
      return organizationName;
    },
  },
  watch: {
    datas: {
      handler: function (val, oldVal) {
        if (this.datas != null) {
          this.initAxios();
          this.refresh();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiEquipmentGroup = new ApiEquipmentGroup(this.axios);
    },
    //编辑
    edit() {
      this.$refs.SmResourceEquipmentGroupModel.edit(this.dataSource);
    },
    //刷新
    async refresh(data) {
      let response = await apiEquipmentGroup.get(this.datas ? this.datas.id : '');
      if (requestIsSuccess(response) && response.data) {
        this.dataSource = response.data;
        if (data) {
          this.$emit('editData', data);
        }
      }
    },
  },
  render() {
    return (
      <div class="sm-resouce-equipment-group-basic-information">

        <a-descriptions bordered column={1}>
          <a-descriptions-item label="父级">
            {
              this.dataSource.parent ? this.dataSource.parent.name : ''
            }
          </a-descriptions-item>
          <a-descriptions-item label="名称">
            {this.dataSource.name}
          </a-descriptions-item>
          <a-descriptions-item label="排序">
            {this.dataSource.order}
          </a-descriptions-item>
          <a-descriptions-item label="所属机构">
            {this.getOrganization ? this.getOrganization : ''}
          </a-descriptions-item>
        </a-descriptions>
        {vIf(
          <div class="info-button">
            <a-button
              style="margin-right:20px"
              type="primary"
              onClick={() => {
                this.edit();
              }}>
              编辑
            </a-button>
          </div>,
          vP(this.permissions, permissionsSmResource.EquipmentGroups.Update),
        )}


        <SmResourceEquipmentGroupModel
          ref="SmResourceEquipmentGroupModel"
          axios={this.axios}
          onSuccess={(item) => {
            this.refresh(item);
          }}
        />

      </div>
    );
  },
};