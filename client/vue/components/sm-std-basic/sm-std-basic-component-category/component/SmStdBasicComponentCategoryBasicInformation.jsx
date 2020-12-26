import SmStdBasicComponentCategoryModel from './SmStdBasicComponentCategoryModel';
import ApiComponentCategory from '../../../sm-api/sm-std-basic/ComponentCategory';
import { requestIsSuccess, vP, vIf } from '../../../_utils/utils';
import permissionsSmStdBasic from '../../../_permissions/sm-std-basic';
import { conforms } from 'lodash';

let apiComponentCategory = new ApiComponentCategory();

export default {
  name: 'SmStdBasicComponentCategoryBasicInformation',
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
    productName() {
      let productName = null;
      if (this.dataSource && this.dataSource.componentCategoryRltProductCategories) {
        if (this.dataSource.componentCategoryRltProductCategories.length > 0) {
          let result = this.dataSource.componentCategoryRltProductCategories;
          for (let item of result) {
            let name = item.productionCategory.name;
            let code = item.productionCategory.code;
            productName = `${name}(${code})`;
          }
        }
      }
      return productName;
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
      apiComponentCategory = new ApiComponentCategory(this.axios);
    },
    //编辑
    edit() {
      this.$refs.SmStdBasicComponentCategoryModel.edit(this.dataSource);
    },
    //刷新
    async refresh(data) {
      let response = await apiComponentCategory.get(this.datas ? this.datas.id : '');
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
      <div class="sm-std-basic-component-category-basic-information">

        <a-descriptions bordered column={1}>
          <a-descriptions-item label="父级">
            {
              this.dataSource.parent ? this.dataSource.parent.name : ''
            }
          </a-descriptions-item>
          <a-descriptions-item label="名称">
            {this.dataSource.name}
          </a-descriptions-item>
          <a-descriptions-item label="编码">
            {this.dataSource.code}
          </a-descriptions-item>
          <a-descriptions-item label="扩展名称">
            {this.dataSource.extendName}
          </a-descriptions-item>
          <a-descriptions-item label="扩展编码" >
            {this.dataSource.extendCode}
          </a-descriptions-item>
          <a-descriptions-item label="关联产品" >
            {this.productName ? this.productName : ''}
          </a-descriptions-item>
          <a-descriptions-item label="单位" >
            {this.dataSource.unit}
          </a-descriptions-item>
          <a-descriptions-item label="备注" >
            {this.dataSource.remark}
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
          vP(this.permissions, permissionsSmStdBasic.ComponentCategories.Update),
        )}

        <SmStdBasicComponentCategoryModel
          ref="SmStdBasicComponentCategoryModel"
          axios={this.axios}
          onSuccess={(item) => {
            this.refresh(item);
          }}
        />

      </div>
    );
  },
};