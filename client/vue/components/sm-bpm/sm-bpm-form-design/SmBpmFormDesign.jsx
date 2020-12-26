/*
 * author kcz
 * date 2019-11-20
 * description 表单设计器
 */
import operatingArea from './src/components/KFormDesign/module/operatingArea';

import './style';

// import kFooter from "./src/components/KFormDesign/module/footer";
import kFormComponentPanel from './src/components/KFormDesign/module/formComponentPanel';
import kJsonModal from './src/components/KFormDesign/module/jsonModal';
import kCodeModal from './src/components/KFormDesign/module/codeModal';
import collapseItem from './src/components/KFormDesign/module/collapseItem';
// import importJsonModal from './src/components/KFormDesign/module/importJsonModal/importJsonModal';
import previewModal from './src/components/KFormPreview';
// import draggable from "vuedraggable";
import {
  basicsList,
  // highList,
  layoutList,
  customComponents,
} from './src/config/formItemsConfig';
import FormItemProperties from './src/components/KFormDesign/module/formItemProperties/formItemProperties';
import formProperties from './src/components/KFormDesign/module/formProperties/formProperties';
export default {
  name: 'SmBpmFormDesign',
  components: {
    operatingArea,
    collapseItem,
    kJsonModal,
    kCodeModal,
    // importJsonModal,
    previewModal,
    kFormComponentPanel,
    FormItemProperties,
    formProperties,
    // draggable
  },
  props: {
    axios:{type:Function,default:null},
    title: { type: String, default: '自定义表单' },
    showHead: { type: Boolean, default: true },
    toolbarsTop: { type: Boolean, default: true },
    toolbars: {
      type: Array,
      default: () => [
        'save',
        'preview',
        'importJson',
        'exportJson',
        'exportCode',
        'reset',
        'close',
      ],
    },
    showToolbarsText: { type: Boolean, default: false },
    fields: {
      type: Array,
      default: () => [
        'input',
        'textarea',
        'number',
        'select',
        'checkbox',
        'radio',
        'date',
        'time',
        'rate',
        'slider',
        'uploadFile',
        'uploadImg',
        'batch',
        'editor',
        'switch',
        'button',
        'alert',
        'text',
        'html',
        'divider',
        'card',
        'grid',
        'table',
      ],
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      customComponents,
      updateTime: 0,
      updateRecordTime: 0,
      showPropertie: false,
      startType: '',
      noModel: ['button', 'divider', 'card', 'grid', 'table', 'alert', 'text', 'html'],
      data: {
        list: [],
        config: {
          layout: 'horizontal',
          labelCol: { span: 4 },
          wrapperCol: { span: 18 },
          hideRequiredMark: false,
          customStyle: '',
        },
      },
      previewOptions: {
        width: 850,
      },
      selectItem: {
        key: '',
      },
      propertyActiveKey: 1,
    };
  },
  computed: {
    basicsArray() {
      // 计算需要显示的基础字段
      return basicsList.filter(item => this.fields.includes(item.type));
    },
    layoutArray() {
      // 计算需要显示的布局字段
      return layoutList.filter(item => this.fields.includes(item.type));
    },
    collapseDefaultActiveKey() {
      // 计算当前展开的控件列表
      let defaultActiveKey = window.localStorage.getItem('collapseDefaultActiveKey');
      if (defaultActiveKey) {
        return defaultActiveKey.split(',');
      } else {
        return ['1'];
      }
    },
  },
  watch: {
    selectItem: {
      handler: function(value, oldValue) {
        this.propertyActiveKey = value.key === '' ? '1' : '2';
      },
      immediate: true,
    },
  },
  methods: {
    generateKey(list, index) {
      // 生成key值
      const key = list[index].type + '_' + new Date().getTime();
      this.$set(list, index, {
        ...list[index],
        key,
        model: key,
      });
      if (this.noModel.includes(list[index].type)) {
        // 删除不需要的model属性
        delete list[index].model;
      }
    },
    handleListPush(item) {
      // 双击控件按钮push到list
      // 生成key值
      if (!this.selectItem.key) {
        // 在没有选择表单时，将数据push到this.data.list
        const key = item.type + '_' + new Date().getTime();
        item = {
          ...item,
          key,
          model: key,
        };
        if (this.noModel.includes(item.type)) {
          // 删除不需要的model属性
          delete item.model;
        }
        const itemString = JSON.stringify(item);
        const record = JSON.parse(itemString);
        // 删除icon及compoent属性
        delete record.icon;
        delete record.component;
        this.data.list.push(record);
        this.handleSetSelectItem(record);
        return false;
      }
      this.$refs.KFCP.handleCopy(false, item);
    },
    handleOpenJsonModal() {
      // 打开json预览模态框
      this.$refs.jsonModal.jsonData = this.data;
      this.$refs.jsonModal.visible = true;
    },
    handleOpenCodeModal() {
      // 打开代码预览模态框
      this.$refs.codeModal.jsonData = this.data;
      this.$refs.codeModal.visible = true;
    },
    handleOpenImportJsonModal() {
      // 打开json预览模态框
      // this.$refs.importJsonModal.jsonData = this.data;
      // this.$refs.importJsonModal.visible = true;
    },
    handlePreview() {
      // 打开预览模态框
      this.$refs.previewModal.jsonData = this.data;
      this.$refs.previewModal.previewWidth = this.previewOptions.width;
      this.$refs.previewModal.visible = true;
    },
    handleReset() {
      // 清空
      try {
        this.data.list = [];
        this.handleSetSelectItem({ key: '' });
        this.$message.success('已清空');
        return true;
      } catch (e) {
        return false;
      }
    },
    handleSetSelectItem(record) {
      // 操作间隔不能低于100毫秒
      let newTime = new Date().getTime();
      if (newTime - this.updateTime < 100) {
        return false;
      }

      this.updateTime = newTime;

      // 设置selectItem的值
      this.selectItem = record;

      // 判断是否选中控件，如果选中则弹出属性面板，否则关闭属性面板
      if (record.key) {
        this.startType = record.type;
        this.showPropertie = true;
      } else {
        this.showPropertie = false;
      }
    },
    handleSetData(data) {
      // 用于父组件赋值
      try {
        if (typeof data !== 'object') {
          return false;
        } else {
          this.data = data;
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    collapseChange(val) {
      // 点击collapse时，保存当前collapse状态
      window.localStorage.setItem('collapseDefaultActiveKey', val);
    },
    handleStart(type) {
      this.startType = type;
    },
    handleSave() {
      // 保存函数
      this.$emit('save', JSON.stringify(this.data));
    },
    handleClose() {
      this.$emit('close');
    },
  },
  render() {
    return (
      <div
        class={{
          'sm-bpm-form-design': true,
          bordered: this.bordered,
          // content: true,
          // 'show-head': this.showHead,
          // 'toolbars-top': this.toolbarsTop,
          // 'show-head-and-toolbars-top': this.toolbarsTop && this.showHead,
        }}
      >
        {/* 左侧控件区域 start */}
        <div class="left panel">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="表单控件" force-render>
              <div class="panel-body">
                <a-collapse
                  bordered={false}
                  default-active-key={this.collapseDefaultActiveKey}
                  onChange={this.collapseChange}
                >
                  {/* 基础控件 start */}
                  {this.basicsArray.length > 0 ? (
                    <a-collapse-panel key="1" header="基础控件">
                      <collapseItem
                        list={this.basicsArray}
                        onGenerateKey={this.generateKey}
                        onHandleListPush={this.handleListPush}
                        onStart={this.handleStart}
                      />
                    </a-collapse-panel>
                  ) : null}
                  {/* 基础控件 end */}

                  {/* 自定义控件 start */}
                  {this.customComponents.list.length > 0 ? (
                    <a-collapse-panel key="3" header={this.customComponents.title}>
                      <collapseItem
                        list={this.customComponents.list}
                        onGenerateKey={this.generateKey}
                        onHandleListPush={this.handleListPush}
                        onStart={this.handleStart}
                      />
                    </a-collapse-panel>
                  ) : null}
                  {/* 自定义控件 end */}

                  {/* 布局控件 start */}
                  {this.layoutArray.length > 0 ? (
                    <a-collapse-panel key="4" header="布局控件">
                      <collapseItem
                        list={this.layoutArray}
                        onGenerateKey={this.generateKey}
                        onHandleListPush={this.handleListPush}
                        onStart={this.handleStart}
                      />
                    </a-collapse-panel>
                  ) : null}
                  {/* 布局控件 end */}
                </a-collapse>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        {/* 左侧控件区域 end */}

        <div class="center panel">
          {/* 操作区域 start */}
          {this.toolbarsTop ? (
            <operatingArea
              class="panel-header"
              show-toolbars-text={this.showToolbarsText}
              toolbars={this.toolbars}
              onHandleSave={this.handleSave}
              onHandlePreview={this.handlePreview}
              // onHandleOpenImportJsonModal={this.handleOpenImportJsonModal}
              onHandleOpenCodeModal={this.handleOpenCodeModal}
              onHandleOpenJsonModal={this.handleOpenJsonModal}
              onHandleReset={this.handleReset}
              onHandleClose={this.handleClose}
            >
              <template slot="left-action">
                <slot name="left-action" />
              </template>

              <template slot="right-action">
                <slot name="right-action" />
              </template>
            </operatingArea>
          ) : null}
          <div class="panel-body">
            <kFormComponentPanel
              ref="KFCP"
              class={{ 'no-toolbars-top': !this.toolbarsTop }}
              data={this.data}
              select-item={this.selectItem}
              no-model={this.noModel}
              start-type={this.startType}
              onHandleSetSelectItem={this.handleSetSelectItem}
            />
            <k-json-modal ref="jsonModal" />
            <k-code-modal ref="codeModal" />
            {/* <importJsonModal ref="importJsonModal" /> */}
            <previewModal ref="previewModal" axios={this.axios} />
          </div>
        </div>

        <div class="right panel">
          <a-tabs
            default-active-key="1"
            activeKey={this.propertyActiveKey}
            onChange={value => {
              this.propertyActiveKey = value;
            }}
            animated={true}
          >
            <a-tab-pane key="1" tab="表单属性" force-render>
              <div class="panel-body">
                <formProperties config={this.data.config} preview-options={this.previewOptions} />
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="表单项属性" force-render>
              <div class="panel-body">
                <FormItemProperties
                  class={{ 'form-item-properties': true, 'show-properties': this.showPropertie }}
                  select-item={this.selectItem}
                  onHandleHide={() => {
                    this.showPropertie = false;
                  }}
                />
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    );
  },
};
