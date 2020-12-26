// 资源标签选择组件
export default {
  name: 'SmFileTagSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    dataSource:{type:Array,default:null},// 数据源
    value:{type:Array,default:null},// 数据源
  },
  data() {
    return {
      selectItems: [],
      inputState: false, // 输入框的状态，用于新增内容
      inputTagValue: '', // 输入框中的数据值
      open: false, // select 组件的打开属性
      iValue: null, //当前选中的tags
      showEditIcon: false, // 是否显示编辑图标
      editTagId:"",// 选中编辑的标签的id
    };
  },
  computed: {
  },
  watch: {
    value:{
      handler:function(n,o){
        this.value=n;
        this.iValue=n;
      },
    },
    dataSource:{
       handler:function(n,o){
         this.selectItems=n;
       },
    },
  },
  created() {
    this.selectItems=this.dataSource;
    this.iValue=this.value;    
  },
  methods: {
    // 保存新增的标签
    saveTag() {
      let val = this.inputTagValue;
      if(val===''){
        this.$message.error("标签名称不能为空");
        return;
      }
      if(this.selectItems.find(a=>a.name===val)!=null){
        this.$message.error("标签名已存在");
        return;
      }
      this.inputState = false;
      this.$emit('submit',val,this.editTagId);// 提交保存
    },
    // 编辑标签
    editTag(id, name) {
      this.editTagId=id;
      this.inputState = true;
      this.inputTagValue=name;
    },
    opationSelect(v) {
      this.value = this.value.includes(v) ? this.value.filter(a => a != v) : [...this.value, v];
    },
    // 过滤数据
    filterData(input,vNode){
      let text=vNode.componentOptions.children[0].children[0].children[0].text;
      return (
        text.indexOf(input) >= 0
      );
    },
  },
  render() {
    return (
      <div class="f-select-content" ref="root" onMouseleave={() => {
          this.open = false;
          this.showEditIcon=false;
        }}>
        <a-select
          show-search
          open={this.open}
          ref="tagSelect"
          style="width: 300px"
          allowClear
          dropdownMatchSelectWidth
          maxTagCount={10}
          mode="multiple"
          notFoundContent="暂无数据"
          placeholder="请选择需要配置的标签"
          maxTagTextLength={6}
          onFocus={() => {
            this.open = true;
          }}
          value={this.iValue}
          onChange={v => {
            this.iValue = v;
            this.$emit('change', v);
          }}
          onMouseleave={(e)=>{this.$refs.tagSelect.blur()}}
          getPopupContainer={() => this.$refs.root}
          dropdownRender={(vnode, props) => {
            return (
              <div class="f-select-content-dropdown">
                {vnode}
                <a-divider style={{ margin: '4px 0' }} />
                <div style={{ padding: '8px', cursor: 'pointer', textAlign: 'center' }}>
                  {this.inputState ? (
                    <div class="f-tag-add">
                      {/* 新增标签 */}
                      <a-input
                        value={this.inputTagValue}
                        placeholder="输入新标签.."
                        style="width: 60%"
                        size="small"
                        onChange={e=>this.inputTagValue=e.target.value}
                      />
                      <a-button type="primary" size="small" onClick={this.saveTag}>
                        保存
                      </a-button>
                      <a-button size="small" onClick={() => (this.inputState = false)}>
                        {' '}
                        取消
                      </a-button>
                    </div>
                  ) : (
                    <a-icon
                      type="plus"
                      onClick={() => {
                        this.editTagId="";
                        this.inputState = true;
                        this.open = true;
                      }}
                    />
                  )}
                </div>
              </div>
            );
          }}
          filterOption={this.filterData}
        >
          {/* //TODO 标签编辑需要处理 */}
          {this.selectItems.map(a => {
            return (
              <a-select-option  value={a.id}>
                <div class="f-select-option-item">                  
                  <span class="item-title" >{a.name}</span>
                 {/* 编辑操作 */}
                 <div class="f-select-edit">
                   <a-icon class="f-select-edit-icon" type="edit" onClick={(e)=>{
                     e.stopPropagation();
                     this.editTag(a.id,a.name);
                   }} />
                 </div>
                </div>               
              </a-select-option>
            );
          })}
        </a-select>
      </div>
    );
  },
};
