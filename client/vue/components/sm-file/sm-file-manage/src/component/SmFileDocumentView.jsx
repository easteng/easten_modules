// 文档预览组件  pdf  word   ppt  等

import pdf from 'vue-pdf';
import { getFileUrl } from '../../../../_utils/utils';
export default {
  name: 'SmFileDocumentView',
  components:{
    pdf,
  },
  props: {
    docType:{type:String,default:''},// 文档类型
  },
  data() {
    return {
      iTitle:'',//标题
      iVisible:false,// 可见性
      data:{},
      pdfSrc:null,
      numPages:0,
    };
  },
  computed: {
    visible() {
      return this.iVisible;
    },
    title(){
      return this.iTitle;
    },
    pages(){
      let arr=[];
      for (let index = 1; index <=this.numPages; index++) {
        arr.push(index);
      }
      return arr;
    },
    src(){
      return this.pdfSrc;
    },
  },
  watch: {},
  created() {},
  methods: {
    close(){
      this.iVisible=false;
    },
    view(obj){
      this.iVisible=true;
      this.data=obj;
      this.iTitle=`${this.data.name}${this.data.type}`;
      if(obj.type==='.pdf'){
        this.pdfTask(getFileUrl(obj.url));
      }
    },
    pdfTask(url){
      let loadTask=pdf.createLoadingTask(url);
      this.pdfSrc=loadTask;
      loadTask.promise.then(pdf=>{
        this.numPages=pdf.numPages;
      });
    },
  },
  render() {
    return (
      <a-modal
        visible={this.visible}
        title={this.title}
        closable
        footer={false}
        width={1000}
        onCancel={this.close}
      >
        <div>
          {this.pages.map(item=>{
            return <pdf 
              src={this.src}
              key={item}
              page={item}
              style="display: inline-block; width: 100%"
            > </pdf>;
          })}
        </div>
      </a-modal>
    );
  },
};
