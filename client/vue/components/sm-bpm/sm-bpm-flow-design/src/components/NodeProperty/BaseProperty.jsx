export default {
  name: 'BaseProperty',
  inject: ['i18n'],
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
      <div>
        <a-form-item label={this.i18n['label']}>
          <a-input
            disabled={this.readOnly}
            value={this.model.label}
            onInput={$event => {
              this.changeHandle('label', $event.target.value);
            }}
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox
            disabled={this.readOnly}
            checked={this.model.hideIcon}
            onChange={$event => {
              this.changeHandle('hideIcon', $event.target.checked);
            }}
          >
            {this.i18n['hideIcon']}
          </a-checkbox>
        </a-form-item>
      </div>
    );
  },
};
