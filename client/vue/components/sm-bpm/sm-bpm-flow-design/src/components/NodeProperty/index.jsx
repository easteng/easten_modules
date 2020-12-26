import BaseProperty from './BaseProperty';
import BpmConditionProperty from './BpmConditionProperty';
import BpmStartProperty from './BpmStartProperty';
import BpmApproveProperty from './BpmApproveProperty';
import BpmCcProperty from './BpmCcProperty';
import BpmEndProperty from './BpmEndProperty';
import SmSystemMemberSelect from '../../../../../sm-system/sm-system-member-select';
import FormItemPermisstions from '../FormItemPermisstions';
import './index.less';
export default {
  name: 'NodeProperty',
  inject: ['i18n', 'axios'],
  components: {
    BpmStartProperty,
    BpmApproveProperty,
    BpmCcProperty,
    BpmEndProperty,
  },
  props: {
    height: { type: Number, default: 800 },
    model: { type: Object, default: () => ({}) },
    users: { type: Array, default: () => [] },
    groups: { type: Array, default: () => [] },
    signalDefs: { type: Array, default: () => [] },
    messageDefs: { type: Array, default: () => [] },
    changeHandle: { type: Function, default: () => { } },
    readOnly: { type: Boolean, default: false },
    formItems: { type: Array, default: () => [] },
    nodeConfig: { type: Array, default: () => [] }, // 节点配置
  },
  data() {
    return {
      activeKey: '1',
    };
  },
  render() {
    let item;
    // 节点属性逻辑修改：属性状态由配置初始配置读取
    let currentConfig = this.nodeConfig.find(a => a.type === this.model.type);
    if (currentConfig == undefined || currentConfig.nodeProps == undefined) {
      item = <div style="color: #c3c3c3">该节点未配置属性</div>;
    } else {
      // 基础属性
      let baseProperty = (
        <div>
          <div class="detail-title">{this.i18n['bpm.start']}节点</div>
          <BaseProperty
            model={this.model}
            change-handle={this.changeHandle}
            read-only={this.readOnly}
          />
        </div>
      );
      //添加建议
      let message = (
        <a-form-item label={'添加建议'}>
          <a-input
            disabled={this.readOnly}
            value={this.model.message}
            onInput={$event => {
              this.changeHandle('message', $event.target.value);
            }} />
        </a-form-item>
      );
      // 成员选择
      let memberSelect = (
        <a-form-item label={'审批人'}>
          <SmSystemMemberSelect
            axios={this.axios}
            showDynamicTab={true}
            disabled={this.readOnly}
            value={this.model.members}
            onChange={members => {
              this.changeHandle('members', members);
            }}
          />
        </a-form-item>
      );
      // 字段权限
      let fieldPermission = (
        <a-form-item label={'字段权限'}>
          <FormItemPermisstions
            disabled={this.readOnly}
            value={this.model.formItemPermisstions}
            onChange={value => {
              this.changeHandle('formItemPermisstions', value);
            }}
          />
        </a-form-item>
      );
      // 条件组件
      let condition = (
        <a-form-item label={'条件配置'}>
          <BpmConditionProperty
            disabled={this.readOnly}
            model={this.model}
            change-handle={this.changeHandle}
          />
        </a-form-item>
      );

      item = (
        <a-form data-type={this.model.type}>
          {currentConfig.nodeProps.indexOf('basic') > -1 ? baseProperty : null}
          {currentConfig.nodeProps.indexOf('message') > -1 ? message : null}
          {currentConfig.nodeProps.indexOf('member-select') > -1 ? memberSelect : null}
          {currentConfig.nodeProps.indexOf('field-permission') > -1 ? fieldPermission : null}
          {currentConfig.nodeProps.indexOf('condition') > -1 ? condition : null}
        </a-form>
      );


    }
    return <div class="panel-body">{item}</div>;

    // 旧代码-------------------------------------------------------------------

    // if (this.model.type === 'bpmStart') {
    //   item = (
    //     <BpmStartProperty
    //       model={this.model}
    //       change-handle={this.changeHandle}
    //       read-only={this.readOnly}
    //       groups={this.groups}
    //       formItems={this.formItems}
    //     />
    //   );
    // } else if (this.model.type === 'bpmApprove') {
    //   item = (
    //     <BpmApproveProperty
    //       model={this.model}
    //       change-handle={this.changeHandle}
    //       read-only={this.readOnly}
    //       groups={this.groups}
    //       formItems={this.formItems}
    //     />
    //   );
    // } else if (this.model.type === 'bpmCc') {
    //   item = (
    //     <BpmCcProperty
    //       model={this.model}
    //       change-handle={this.changeHandle}
    //       read-only={this.readOnly}
    //       groups={this.groups}
    //       formItems={this.formItems}
    //     />
    //   );
    // } else if (this.model.type === 'bpmEnd') {
    //   item = (
    //     <BpmEndProperty
    //       model={this.model}
    //       change-handle={this.changeHandle}
    //       read-only={this.readOnly}
    //       groups={this.groups}
    //       formItems={this.formItems}
    //     />
    //   );
    // } else {
    //   item = <div style="color: #c3c3c3">请选择节点</div>;
    // }

  },
};
