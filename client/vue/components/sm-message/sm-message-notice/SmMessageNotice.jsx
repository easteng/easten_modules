
import './style';
export default {
  name: 'SmMessageNotice',
  components: {},
  props: {
    signalr: { type: Object, default: null },
  },
  data() {
    return {
      loading: false,
      visible: false,
      tooltip: false,
      message: [],
    };
  },
  computed: {
    messageCount() {
      return this.message.length;
    },
  },
  watch: {},
  created() {
    let _this = this;
    this.signalr
      .sub('notice')
      .invoke('ReceiveMessage',()=>{} ,(a, b) => {
        _this.message.push(b);
        _this.$notification.open({
          message: b.Title,
          description:
            b.Url,
          icon: <a-icon type="smile" style="color: #108ee9" />,
        });
        return false;
      });
  },
  methods: {
    fetchNotice() {
      if (!this.visible) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 100);
      } else {
        this.loading = false;
      }
      this.visible = !this.visible;
    },
    tooltipTaggle() {
      this.tooltip = true;
      setTimeout(() => {
        this.tooltip = false;
      }, 1000);
    },
  },
  render() {
    return <a-popover
      v-model={this.visible}
      trigger="click"
      overlay-class-name="sm-message-notice"
      get-popup-container={() => this.$refs.noticeRef.parentElement}
      auto-adjust-overflow={true}
      arrow-point-atCenter={true}
      overlay-style={{ width: '300px', top: '50px' }}
    >
      <template slot="content">
        <a-spin spinning={this.loading}>
          <a-tabs>
            <a-tab-pane key="1" tab="通知">
              <a-list>
                <a-list-item>
                  <a-list-item-meta title="你收到了 14 份新周报" description="一年前">
                    <a-avatar
                      slot="avatar"
                      class="a-avatar-custom"
                      style="background-color: white"
                      src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
                    />
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item>
                  <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">
                    <a-avatar
                      slot="avatar"
                      class="a-avatar-custom"
                      style="background-color: white"
                      src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"
                    />
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item>
                  <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                    <a-avatar
                      slot="avatar"
                      class="a-avatar-custom"
                      style="background-color: white"
                      src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"
                    />
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="2" tab="消息">暂无消息
            </a-tab-pane>
            <a-tab-pane key="3" tab="待办">暂无消息
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </template>
      <span ref="noticeRef" class="header-notice" style="padding: 0 18px" onClick={() => this.fetchNotice()}>
        <a-badge count={this.messageCount} title={`您有${this.messageCount}条未读消息`}>
          <a-tooltip placement="bottom" visible={this.tooltip}>
            <template slot="title">
              <span>您有新消息</span>
            </template>
            <a-icon style="font-size: 16px; padding: 4px" type="bell" />
          </a-tooltip>
        </a-badge>
      </span>
    </a-popover>;
  },
};
