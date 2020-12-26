export default {
  name: 'FlowProperty',
  inject: ['i18n', 'axios'],
  components: {
    // DefaultDetail,
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
  data() {
    return {
      iModel: null,
      iValue: null,
      showCondition: false,
      booleans:[{ value:"true", title:'是'},{value:"false",title:'否'}],
      ranges: [],
      options: [],
      conditionType: '',

      booleanSelected:'', // 选中值
      rangeSelected:null, // 选中值
      optionSelected:null, // 选中值

      booleanCheckValue:[],
      rangeCheckValues:[],
      optionCheckValues:[],
    };
  },
  watch: {
    model: {
      handler(nVal, oVal) {
        // console.log(nVal);
        this.iModel = nVal || {};
        if (nVal) {
          this.iValue = nVal.label;
        }
        // 根据数据进行判断当前edge 是否时有判定节点发出的
        this.nodeResolve();
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    nodeResolve() {
      if (this.iModel.node) {
        let model = this.iModel.node.getModel();
        this.showCondition = model.type === 'determine' ? true : false;
        if (model.condition) {
          this.conditionType = model.condition.type;
        }
        if (this.conditionType == 'range') {
          this.ranges = model.condition.items;
        } else if (this.conditionType == 'options') {
          this.options = model.condition.items;
        }
      }

      if(this.iModel.condition){
        if(this.conditionType==="boolean"){
          this.booleanSelected=this.iModel.condition.value;
        }else if(this.conditionType==="range"){
          this.rangeSelected=this.iModel.condition.value;
        }else if(this.conditionType==="options"){
          this.optionSelected=this.iModel.condition.value;
        }
      }
      this.checkData();
    },
    getSymbol(symbol) {
      switch (symbol) {
        case 'eq':
          return '=';
        case 'lt':
          return '<';
        case 'le':
          return '<=';
        case 'gt':
          return '>';
        case 'ge':
          return '>=';
        case 'ne':
          return '!=';
        default:
          break;
      }
    },
    radioChanage(evt) {
      if(this.conditionType==="boolean"){
        this.booleanSelected=evt.target.value;
      }else if(this.conditionType==="range"){
        this.rangeSelected=evt.target.value;
      }else if(this.conditionType==="options"){
        this.optionSelected=evt.target.value;
      }
      this.changeHandle('condition', { type: this.conditionType, value: evt.target.value });
    },

    // 校验数据,设置数据的不可用
    checkData(){
      // 拿到节点的所有出线
      if(this.iModel.node){
        let outEdges=this.iModel.node.getOutEdges();
        // 根据判断出线中的条件,来处理现有的数据的可用性
        if(outEdges){
          outEdges.forEach(item => {
            let model=item.getModel();
             if(model.condition){
              if(this.conditionType==="boolean"){
                this.booleanCheckValue=[];
                this.booleans.forEach(a=>{
                  if(a.value==model.condition.value){
                    this.booleanCheckValue.push(a.value);
                  }
                });
              }else if(this.conditionType==="range"){
                this.rangeCheckValues=[];
                this.ranges.forEach(a=>{
                  if(a.value==model.condition.value.value){
                    this.rangeCheckValues.push(a);
                  }
                });
              }else if(this.conditionType==="options"){
                this.optionCheckValues=[];
                this.options.forEach(a=>{
                  if(a.value==model.condition.value.value){
                     this.optionCheckValues.push(a);
                  }
                });
              }
             }
          });
        }
      }
    },
  },
  render() {
    let boolItem = (
      <a-radio-group value={this.booleanSelected} onChange={this.radioChanage}>
        {this.booleans.map(a=>{
         return <a-radio value={a.value} disabled={this.booleanCheckValue.includes(a.value)}>{a.title}</a-radio>;
        })}
      </a-radio-group>
    );
    let rangeItem = (
      <a-radio-group value={this.rangeSelected} onChange={this.radioChanage}>
        {this.ranges.map((a, index) => {
          return (
            <a-radio value={a} disabled={this.rangeCheckValues.includes(a)}>
              条件:{index + 1},值:{a.value},数学运算符:{this.getSymbol(a.operator)}
            </a-radio>
          );
        })}
      </a-radio-group>
    );
    let optionItems = (
      <a-radio-group value={this.optionSelected} onChange={this.radioChanage}>
        {this.options.map((a, index) => {
          return (
            <a-radio value={a} disabled={this.optionCheckValues.includes(a)}>
              条件{index + 1}:,值:{a.key},条件:{a.value}
            </a-radio>
          );
        })}
      </a-radio-group>
    );
    return (
      <div style="width:100%">
        <a-form size="small" data-type={this.model.type}>
          <a-form-item label={this.i18n['process.name']}>
            {this.iModel.type != 'flow' ? (
              '请选择流程'
            ) : (
              <a-input
                disabled={this.readOnly}
                value={this.iValue}
                onChange={$event => {
                  this.iValue = $event.target.value;
                  this.changeHandle('label', this.iValue);
                }}
              />
            )}
          </a-form-item>
          {this.showCondition ? (
            <a-form-item class="edge-condition" label={this.i18n['process.option']}>
              {this.conditionType === 'range' ? rangeItem : null}
              {this.conditionType === 'boolean' ? boolItem : null}
              {this.conditionType === 'options' ? optionItems : null}
            </a-form-item>
          ) : null}
        </a-form>
      </div>
    );
  },
};
