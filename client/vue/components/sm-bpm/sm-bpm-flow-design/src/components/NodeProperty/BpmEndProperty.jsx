import BaseProperty from './BaseProperty';

export default {
  name: 'BpmEndProperty',
  inject: ['i18n'],
  components: {
    BaseProperty,
  },
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    changeHandle: {
      type: Function,
      default: () => {},
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    return (
      <a-form data-type={this.model.type}>
        <div class="detail-title">{this.i18n['bpm.cc']}节点</div>
        <BaseProperty
          model={this.model}
          change-handle={this.changeHandle}
          read-only={this.readOnly}
        />
        {/* <div class="panelRow">
          <div>{this.i18n['userTask.assignType']}：</div>
          <a-select
            style="width:90%; font-size: 12px"
            placeholder="i18n['userTask.assignType.placeholder']"
            value="model.assignType"
            disabled="readOnly"
            onChange={e => {
              this.onChange('assignValue', []);
              this.onChange('assignType', e);
            }}
          >
            <a-select-option
              key="person"
              value="person"
              label={this.i18n['userTask.assignType.person']}
            />
            <a-select-option
              key="persongroup"
              value="persongroup"
              label={this.i18n['userTask.assignType.persongroup']}
            />
            <a-select-option
              key="custom"
              value="custom"
              label={this.i18n['userTask.assignType.custom']}
            />
          </a-select>
        </div>
        <div v-if="model.assignType === 'person'" class="panelRow">
          <div>{this.i18n['userTask.assignType.person.title']}：</div>
          <a-select
            style="width:90%; font-size:12px"
            placeholder={this.i18n['userTask.assignType.person.placeholder']}
            disabled={this.readOnly}
            value={this.model.assignValue}
            multiple={true}
            filterable={true}
            filter-method={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={e => this.onChange('assignValue', e)}
          >
            {this.users.map(user => {
              return <a-select-option key={user.id} label={user.name} value={user.id} />;
            })}
          </a-select>
        </div>
        <div v-else-if="model.assignType === 'persongroup'" class="panelRow">
          <div>{this.i18n['userTask.assignType.persongroup.title']}：</div>
          <a-select
            style="width:90%; font-size:12px"
            placeholder={this.i18n['userTask.assignType.persongroup.placeholder']}
            value={this.model.assignValue}
            disabled={this.eadOnly}
            multiple={this.true}
            filterable={this.true}
            filter-method={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={e => onChange('assignValue', e)}
          >
            {this.groups.map(group => {
              return <a-select-option key={group.id} label={group.name} value={group.id} />;
            })}
          </a-select>
        </div>
        <div v-else-if="model.assignType === 'custom'" class="panelRow">
          <div>{this.i18n['userTask.assignType.custom.title']}：</div>
          <a-input
            style="width:90%; font-size:12px"
            alue={this.model.javaClass}
            disabled={this.readOnly}
            onInput={e => this.onChange('javaClass', e.target.value)}
          />
        </div>
        <div class="panelRow">
          <div style="display:inline">{i18n['userTask.dueDate']}：</div>
          <a-date-picker
            type="datetime"
            style="width:90%; min-width:null"
            placeholder={this.i18n['userTask.dueDate.placeholder']}
            disabled={this.readOnly}
            value={this.model.dueDate}
            value-format="yyyy-MM-dd HH:mm:ss"
            onInput={value => this.onChange('dueDate', value)}
          />
        </div>
        <div class="panelRow">
          <a-checkbox
            disabled={this.readOnly}
            value={!!this.model.isSequential}
            onChange={value => this.onChange('isSequential', value)}
          >
            {this.i18n['userTask.counterSign']}
          </a-checkbox>
        </div> */}
      </a-form>
    );
  },
};
