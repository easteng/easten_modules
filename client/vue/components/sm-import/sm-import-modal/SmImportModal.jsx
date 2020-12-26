// 文件导入公共组件
import { ModalStatus } from '../../_utils/enum';
import SmImportButton from '../sm-import-basic';
export default {
  name: 'SmImportModal',
  components: {},
  props: {
    axios:{type:Function,default:null},
    title: { type: String, default: "文件导入" },
    btnType:{type:String,default:'primary'},
    size:{type:String,default:"default"},
    width:{ type:String,default:"auto" },
    subComponents:{type:Array,default:()=>[]},//文件导入按钮集合
    icon:{type:String,default:"inbox"},
  },
  data() {
    return {
      status: ModalStatus.Hide,
    };
  },
  computed: {
    visible() {
      return this.status != ModalStatus.Hide;
    },
  },
  watch: {},
  created() {
  },
  methods: {
    ok() {
      this.status=ModalStatus.Hide;
    },
    close() {
      this.status=ModalStatus.Hide;
    },
    openModal(){
      this.status=ModalStatus.View;
      // 判断当前有误正在导入的文件
      this.subComponents.forEach((a,i)=> {
        if(this.$refs[`SmImportButton_${a.importKey}`]!=undefined){
          this.$refs[`SmImportButton_${a.importKey}`].check();
        }
      });
    },
    fileSelected(record,file){
      let data=record.parameters;
      if(data["file.file"]==null){
        data["file.file"]=file;
      }
      if(data["file"]==null){
        data["file"]=file;
      }
      console.log(data);
      this.$refs[`SmImportButton_${record.importKey}`].exect(data);
    },
  },
  render() {
    return (
      <div style="display:inline">
        <a-button icon={this.icon} type={this.btnType} size={this.size} onClick={()=>{
          this.openModal();
        }}>
          {this.title}
        </a-button>
        <a-modal
          title={this.title}
          onOk={this.ok}
          class="sm-import-modal"
          visible={this.visible}
          onCancel={this.close}
          width={600}
        >
          <div>
            {this.subComponents.map((a,index)=>{
              let ref=`SmImportButton_${a.importKey}`;
              return <SmImportButton
                axios={this.axios}
                ref={ref}
                size={this.size}
                width={this.width}
                url={a.url}
                importKey={a.importKey}
                defaultTitle={a.title}
                downloadErrorFile={a.downloadErrorFile}
                onSelected={(file)=>this.fileSelected(a,file)}
              />;
            })}
          </div>
        </a-modal>
      </div>
    );
  },
};