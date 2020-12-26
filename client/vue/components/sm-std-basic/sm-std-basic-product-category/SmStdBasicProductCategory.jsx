import SmStdBasicProductCategoryTree from './component/SmStdBasicProductCategoryTree';
import SmStdBasicProductCategoryClassification from './component/SmStdBasicProductCategoryClassification';
import SmStdBasicProductCategoryBasicInformation from './component/SmStdBasicProductCategoryBasicInformation';
import './style';

export default {
  name: 'SmStdBasicProductCategory',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      transferDatas: null,
      dataSource: null,
      editData: null,
      tabListTitle: [
        {
          key: 'infor',
          tab: '基本信息',
        },
        {
          key: 'class',
          tab: '下级分类',
        },
        {
          key: 'extend',
          tab: '扩展属性',
        },
        {
          key: 'relation',
          tab: '关联定额',
        },
      ],
      titleKey: 'infor',
    };
  },
  methods: {
    onTabChange(key, type) {
      this[type] = key;
    },
    //给树传递的值
    transferData(data) {
      this.transferDatas = data;
    },
    //获得树传过来的数据
    getRecord(record) {
      this.dataSource = record;
    },
    //获得基本信息表传递给树的数据
    getEditData(data) {
      this.editData = data;
    },
  },
  render() {
    // 定义基本框架
    return (
      <div class="sm-std-basic-product-category">
        {/* 左侧 */}
        <div class="std-left">
          <SmStdBasicProductCategoryTree
            axios={this.axios}
            onRecord={this.getRecord}
            transferData={this.transferDatas}
            permissions={this.permissions}
            editData={this.editData}
          />
        </div>
        {/* 右侧 */}
        <div class="std-right">
          <a-card
            class="std-right-card"
            tabList={this.tabListTitle}
            activeTabKey={this.titleKey}
            onTabChange={(key) => this.onTabChange(key, "titleKey")}
          >
            {this.titleKey === 'infor' ?
              <p>
                {this.dataSource ?
                  <SmStdBasicProductCategoryBasicInformation
                    axios={this.axios} datas={this.dataSource}
                    permissions={this.permissions}
                    onEditData={(item) => this.getEditData(item)} />
                  : <a-empty description={false} />}

              </p> : undefined}
            {this.titleKey === 'class' ?
              <p>
                {this.dataSource ?
                  <SmStdBasicProductCategoryClassification
                    axios={this.axios} datas={this.dataSource}
                    permissions={this.permissions}
                    onDataValue={(item) => this.transferData(item)}
                  />
                  : <a-table data-source={[]} />}
              </p> : undefined}
            {this.titleKey === 'extend' ?
              <p>
                <a-empty description={false} />
              </p> : undefined}
            {this.titleKey === 'relation' ?
              <p>
                <a-empty description={false} />
              </p> : undefined}
          </a-card>
        </div>
      </div>
    );
  },
};

