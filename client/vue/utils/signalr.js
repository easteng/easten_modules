import * as signalR from '@aspnet/signalr';
import config from '@/config';
import Vue from 'vue';
let vm = new Vue({});
class SignalR {
  constructor(config) {
    this.config = config;
  }
  connection = null;
  topic = '';

  /**
   * @description 订阅主题
   * @author easten
   * @date 2020-12-02
   * @param {*} topic
   * @returns
   * @memberof SignalR
   */
  sub(topic) {
    let _this = this;
    this.topic = topic;
    let _url = `${_this.config.signalR.url}/${topic}`;
    _this.connection = new signalR.HubConnectionBuilder().withUrl(_url).build();
    return this;
  }

  /**
   * @description 启动并连接服务
   * @author easten
   * @date 2020-12-02
   * @returns
   * @memberof SignalR
   */
  start() {
    let _this = this;
    let promise = new Promise((res, err) => {
      if (_this.connection.state != signalR.HubConnectionState.Connected) {
        _this.connection
          .start()
          .then(() => {
            _this.register(_this.topic).then(list => {
              res(list);
            });
          })
          .catch(err => {
            vm.$message.error(err);
            res(null);
          });
      }
    });
    _this.connection.onclose(err => {
      console.assert(connection.state === signalR.HubConnectionState.Disconnected);
      vm.$message.error(err);
    });
    return promise;
  }

  /**
   * @description 向服务端发送注册请求，后端规定每次客户端注册前进行注册
   * @author easten
   * @date 2020-12-02
   * @param {*} topic 消息主题，由扶服务端规定
   * @returns
   * @memberof SignalR
   */
  register(topic) {
    let _this = this;
    return new Promise((res, err) => {
      _this.connection
        .invoke('Register', topic)
        .then(data => res(data))
        .catch(err => {
          // vm.$message.error('服务异常');
          res();
        });
    });
  }

  /**
   * @description 监听服务端方法
   * @author easten
   * @date 2020-12-02
   * @param {*} method 服务端提供的方法名称
   * @param {*} func 接收到消息的回调函数
   * @returns 初次登录会返回当当前用户的未读消息，具体内容根据需求来定
   * @memberof SignalR
   */
  invoke(method, list, func) {
    let _this = this;
    // return new Promise((res, err) => {

    // });
    _this
      .start()
      .then(data => {
        //res(data);
        list(data);
      })
      .catch(e => {});
    _this.connection.on(method, function(a, b, c, d, e, f, g, h, i) {
      let arr = [];
      Array.from(arguments).forEach(a => {
        if (_this.isJSON(a)) {
          arr.push(JSON.parse(a));
        } else {
          arr.push(a);
        }
      });
      func(...arr);
    });
  }
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        let obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }
}

const signalr = new SignalR(config);

export default signalr;
