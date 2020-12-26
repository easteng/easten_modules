import SmStdBasicProductCategoryModel from './SmStdBasicProductCategoryModel';
import ApiProductCategory from '../../../sm-api/sm-std-basic/ProductCategory';
import { requestIsSuccess, vP, vIf } from '../../../_utils/utils';
import permissionsSmStdBasic from '../../../_permissions/sm-std-basic';

let apiProductCategory = new ApiProductCategory();

export default {
  name: 'SmStdBasicProductCategoryBasicInformation',
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
      apiProductCategory = new ApiProductCategory(this.axios);
    },
    //编辑
    edit() {
      this.$refs.SmStdBasicProductCategoryModel.edit(this.dataSource);
    },
    //刷新
    async refresh(data) {
      let response = await apiProductCategory.get(this.datas ? this.datas.id : '');
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
      <div class="sm-std-basic-product-category-basic-information">

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
          vP(this.permissions, permissionsSmStdBasic.ProductCategories.Update),
        )}
        <SmStdBasicProductCategoryModel
          ref="SmStdBasicProductCategoryModel"
          axios={this.axios}
          onSuccess={(item) => {
            this.refresh(item);
          }}
        />

      </div>
    );
  },
};