// 编辑输入框组件，实现文字验证
import { resourceIcon } from '../common';
export default {
  name: 'SmEditInput',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: String, default: null },
    state: { type: Boolean, default: false }, // 是否是编辑状态，如果不是返回一个文字
    type: { type: String, default: 'folder' }, // 资源类型
    select: { type: Boolean, default: false }, // 选择模式
  },
  data() {
    return {
      isedit: false,
      iValue: '',
    };
  },

  watch: {
    value: {
      handler: function(n, o) {
        this.iValue = n || '';
      },
      immediate: true,
    },
    state: {
      handler: function() {
        this.isedit = this.state || false;
      },
      immediate: true,
    },
    iValue: function(newVaule) {
      this.iValue = newVaule;
      // TODO 改变值的状态
    },
  },
  methods: {
    checkFileName(fileName) {
      if(this.iValue==='')return false;
      let reg = new RegExp(
        "[`~!^*()=|{} |':',\\[\\].<>/?~*（）|\——|‘；：”“’。，、？]",
      );
      if (reg.test(fileName)) return true;
      return false;
    },
     isNull( str ){
      if(this.iValue==='')return false;
      if(str.indexOf(' ') >= 0) return true;
      let regu = "^[ ]+$";
      let re = new RegExp(regu);
      return re.test(str);
     },
  },
  render() {
    let inputVerification = (
      <div>
        {this.iValue === '' ? (
          <a-alert class="f-input-error" type="error" message="名称不能为空" banner />
        ) : (
          ''
        )}
        {this.iValue.length > 50 ? (
          <a-alert class="f-input-error" type="error" message="文件名称不能超过50个字符" banner />
        ) : (
          ''
        )}

        {this.checkFileName(this.iValue) ? (
          <a-alert
            class="f-input-error"
            type="error"
            message="名称不能包含特殊字符(/\%...)"
            banner
          />
        ) : (
          ''
        )}
        {this.isNull(this.iValue)?(  <a-alert
            class="f-input-error"
            type="error"
            message="名称不能包含空格"
            banner
          />):''}
        <a-input
          value={this.iValue}
          onChange={e => {
            this.iValue = e.target.value.replace(' ','');
            this.$emit('change', this.iValue);
            this.$emit('verify', !(this.iValue === '' || this.iValue.length > 50||this.checkFileName(this.iValue)||this.isNull(this.iValue)));
          }}
        />
      </div>
    );
    return this.isedit ? (
      inputVerification
    ) : (
      <div class="f-folder-item">
        {this.type === 'folder' ? (
          <div
            onClick={() => {
              this.$emit('select'); // 提交表格模式下文件夹的点击事件
            }}
          >
            <a-icon type={resourceIcon.folder} />
            &nbsp;&nbsp; {this.iValue}
          </div>
        ) : (
          <div>
            {' '}
            {resourceIcon[this.type] == null ? (
              <a-icon type={resourceIcon.unknown} />
            ) : (
              <a-icon type={resourceIcon[this.type]} />
            )}{' '}
            &nbsp;&nbsp;
            <a-tooltip
              placement="topLeft"
              title={this.iValue}
            >
              <span>{(this.select&&this.iValue.length>15)?`${this.iValue.substring(0,15)}...`:(this.iValue.length>20?`${this.iValue.substring(0,20)}...`:this.iValue)}</span>
            </a-tooltip>
          </div>
        )}
      </div>
    );
  },
};
