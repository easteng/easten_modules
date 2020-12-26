// 图片预览组件
import { ImageReady } from '../common';
import { getFileUrl } from '../../../../_utils/utils';
export default {
  name: 'SmFileImageView',
  props: {},
  data() {
    return {
      iTitle:'',//标题
      iVisible:false,// 可见性
      data:{
        url:'',
      },
    };
  },
  computed: {
    visible() {
      return this.iVisible;
    },
    title(){
      return this.iTitle;
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
    },
  },
  render() {
    return (
      <a-modal
      visible={this.visible}
      title={this.title}
      closable
      footer={false}
      width={600}
      onCancel={this.close}
      >
       <div>
          <img width="100%" src={getFileUrl(this.data.url)} alt={`${this.data.name}${this.data.type}`}/>
       </div>
      </a-modal>
    );
  },
};
