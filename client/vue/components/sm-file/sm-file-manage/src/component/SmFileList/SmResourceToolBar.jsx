// 资源管理的工具条
import SmFileUpload from '../SmFileUpload';
export default {
  name: 'SmResourceToolBar',
  props: {
    rolers: { type: Object, default: null }, // 权限组
    menus: { type: Array, default: null },
  },
  data() {
    return {
      iMenus: [],
    };
  },
  computed: {
    menuList() {
      return this.iMenus;
    },
  },
  watch: {
    menus: {
      handler(nVal, oVal) {
        this.iMenus = nVal;
      },
      immediate: true,
    },
  },
  async created() {},
  methods: {
    beforeUpload(e, fileList) {},
  },
  render() {
    return (
      <div class="f-top-menu">
        {this.menuList.map(item => {
          if (item.name === 'upload')
            return (
              <SmFileUpload
                showIcon
                icon="vertical-align-top"
                multiple
                title={item.title}
                onBeforeUpload={(e, v) => {
                  console.log(v);
                  this.$emit('fileUpload', v);
                }}
              />
            );
          else if (item.name === 'uploadD')
            return (
              <SmFileUpload
                showIcon
                icon="folder"
                multiple
                directory
                title={item.title}
                onBeforeUpload={(e, v) => {
                  this.$emit('folderUpload', v);
                }}
              />
            );
          else if (item.tip !== '') {
            return (
              <a-tooltip placement="top" defaultVisible={false}>
                <template slot="title">
                  <span>{item.tip}</span>
                </template>
                <a-button
                  onClick={() => this.$emit('menuClick', item)}
                  type="link"
                  disabled={!item.enable}
                >
                  <a-icon type={item.icon} />
                  {item.title}
                </a-button>
              </a-tooltip>
            );
          } else {
            return (
              <a-button
                onClick={() => this.$emit('menuClick', item)}
                type="link"
                disabled={!item.enable}
              >
                <a-icon type={item.icon} />
                {item.title}
              </a-button>
            );
          }
        })}
      </div>
    );
  },
};
