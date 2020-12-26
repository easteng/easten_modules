import * as signalR from '@aspnet/signalr';
const signalr = new signalR.HubConnectionBuilder().withUrl("http://localhost:8091/message/messageCenter/").build();
export default {
  name: 'SmMessage',
  components: {},
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      receiveContent: "",
    };
  },
  computed: {
    content() {
      return this.receiveContent;
    },
  },
  watch: {},
  created() {
    this.initSignalr();
    let _this = this;
    signalr.on("ReceiveMessage", function (type, message) {
      if (type === 'Real') {
        let data = JSON.parse(message);
        _this.receiveContent += `服务器：(${data.Time})-:${data.Content}\r\n`;
        _this.$notification.open({
          message: data.Title,
          description:
            data.Content,
          icon: <a-icon type="smile" style="color: #108ee9" />,
        });
      }
      if (type === 'Init') {
        // 当前用户消息的初始化  返回的是消息列表
      }
    });
  },
  methods: {
    initSignalr() {
      let _this = this;
      signalr.start().then(function () {
        _this.register();
      }).catch(function (err) {
        console.log(err);
      });
    },
    register() {
      signalr.invoke("Register", "group").then(() => {
      }).catch((err) => {
        console.log(err);
      });
    },
    test() {
      this.axios({
        url: `http://localhost:8091/api/app/sample/senTest`,
        method: 'post',
        data: null,
      }).then(res => {
      });
    },
  },
  render() {
    return( <div>
      <a-button onClick={() => this.test()}>测试</a-button>
      <a-textarea placeholder="等待接收服务端消息" rows={4} value={this.content} />
    </div>);
  },
};
