// 条件属性框
export default {
  name: 'BpmConditionProperty',
  components: {},
  props: {
    changeHandle: { type: Function, default: () => {} },
    model: { type: Object, default: () => ({})},
  },
  data() {
    return {
      condition: {
        type: '',
        items: [],
      },
      currentType: '', // 当前的条件类型
      ranges: [], // 范围条件集合
      options: [], // 配置项集合
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initData();
  },
  methods: {

    // 初始化数据
    initData(){
      let data=this.model;
      if(data.condition){
        this.currentType=data.condition.type;
        if(this.currentType==="range"){
          this.ranges=data.condition.items;
        }else if(this.currentType==="options"){
          this.options=data.condition.items;
        }
      }
    },
    // 条件类型选择
    handleSelectChange(value) {
      this.currentType = value;
      this.condition.type = value;
      if (value === 'boolean') {
        this.condition.items = null;
        this.ranges = [];
      }
      this.commitData();
    },
    // 提交数据
    commitData() {
      // 构造数据
      if (this.currentType === 'range') {
        this.condition.items=[];
        
        this.ranges.map(a => {
          this.condition.items.push({
            value: a.value,
            operator: a.operator,
          });
        });
      } else if (this.currentType === 'options') {
        this.condition.items=[];
        this.options.map(a => {
          this.condition.items.push({
            key: a.key,
            value: a.value,
          });
        });
      } else {
        this.condition.items =null;
      }
      this.condition.type=this.currentType;
      this.changeHandle('condition', this.condition);
    },
    // 添加条件
    addCondition() {
      if (this.ranges.length === 9) {
        this.$message.warning('条件过多');
        return;
      }
      if (this.currentType === 'range') {
        this.ranges.push({
          value: 0,
          index: this.ranges.length + 1,
          operator: '',
        });
      } else if (this.currentType === 'options') {
        this.options.push({
          index: this.ranges.length + 1,
          key: '',
          value: '',
        });
      }
    },
    // 移除条件
    itemRemove(index) {
      if (this.currentType === 'range') {
        this.ranges = this.ranges.filter(a => a.index != index);
      } else if (this.currentType === 'options') {
        this.options = this.options.filter(a => a.index != index);
      }
      this.commitData();
    },
  },
  render() {
    // 选项
    let selectItem = (
      <a-row type="flex" justify="start">
        <a-col span={8}>
          <label htmlFor="">选择条件：</label>
        </a-col>
        <a-col span={16}>
          <a-select placeholder="请选择条件类型" size="small" value={this.currentType} onChange={this.handleSelectChange}>
            <a-select-option value="boolean">是否判断</a-select-option>
            <a-select-option value="range">数值范围</a-select-option>
            <a-select-option value="options">配置选项</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    );

    let rangeItems = this.ranges.map((a, index) => {
      return (
        <p>
          <a-badge count={index + 1} number-style={{ backgroundColor: '#52c41a' }} />
          <label htmlFor="">阈值</label>
          <span>
            <a-input-number
              id="inputNumber"
              value={a.value}
              min={0}
              max={1000000}
              onChange={v => {
                a.value = v;
                this.commitData();
              }}
              size="small"
              style="width:24%"
            />
          </span>
          <label htmlFor="">条件</label>
          <span>
            <a-select
              placeholder="选择"
              style="width:26%"
              size="small"
              value={a.operator}
              onChange={v => {
                a.operator = v;
                this.commitData();
              }}
            >
              <a-select-option value="eq">=</a-select-option>
              <a-select-option value="lt">{'<'}</a-select-option>
              <a-select-option value="le">{'<='}</a-select-option>
              <a-select-option value="gt">></a-select-option>
              <a-select-option value="ge">>=</a-select-option>
              <a-select-option value="ne">!=</a-select-option>
            </a-select>
          </span>
          <a-icon
            type="minus-circle"
            class="item-remove"
            onClick={() => {this.ranges=this.ranges.filter(b=>b!=a);this.commitData();}}
          />
        </p>
      );
    });

    // 配置项条件
    let optionItems = this.options.map((a, index) => {
      return (
        <div class="bpm-options-item">
          <p>
            {/* <a-badge count={index + 1} number-style={{ backgroundColor: '#52c41a' }} /> */}
            <label style="margin-left:9px">关键字:</label>
            <span>
              {' '}
              <a-input
                value={a.key}
                onChange={v => {
                  a.key = v.target.value;
                  this.commitData();
                }}
                size="small"
                style="width:65%"
              />
            </span>
          </p>
          <p>
            <label htmlFor="">成立条件:</label>
            <span>
              <a-input
                value={a.value}
                onChange={v => {
                  a.value = v.target.value;
                  this.commitData();
                }}
                size="small"
                style="width:65%"
              />
            </span>
            <a-icon
              type="minus-circle"
              class="item-remove"
              onClick={() => {this.options=this.options.filter(b=>b!=a);this.commitData();}}
            />
          </p>
          <a-divider />
        </div>
      );
    });

    // 表单添加区域
    let container = (
      <div class="bpm-form-container">
        <div class="bpm-from-item">
          {this.currentType === 'range'
            ? rangeItems
            : this.currentType === 'options'
            ? optionItems
            : null}
          <a-button type="primary" size="small" block onClick={this.addCondition}>
            点击添加条件
          </a-button>
        </div>
      </div>
    );

    return (
      <div>
        {selectItem}
        {this.currentType === 'range' || this.currentType === 'options' ? container : null}
      </div>
    );
  },
};
