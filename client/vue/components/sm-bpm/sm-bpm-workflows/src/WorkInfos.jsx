import './style/Workinfos.less';
import ApiWorkflow from '../../../sm-api/sm-bpm/Workflow';
import moment from 'moment';
import { getWorkflowStepState } from '../../../_utils/utils';
import { getDeltaTime } from '../../sm-bpm-flow-design/src/util/time';
import SmFileTag from '../../../sm-file/sm-file-tag';

let apiWorkflow = new ApiWorkflow();
export default {
  name: 'WorkInfos',
  props: {
    axios: { type: Function, default: null },
    workflowId: { type: String, default: null },
  },
  data() {
    return {
      woroflowList: [],//节点信息
      pendingUserInfos: [],//带待处理节点成员信息
      startTime: 0,//简报发起时间
      endTime: 0,//简报最后一个节点处理时间
      dealTime: 0,
      initeval: false,
    };
  },
  computed: {
    // dealTime() {
    //   let startTime = this.startTime;
    //   let endTime = this.endTime;
    //   let dealTime = endTime -startTime ;
    //   let sum = getDeltaTime(dealTime);
    //   return `${sum.d ? sum.d + ' 天 ' : ''}${sum.h + ' 小时 '}${sum.m + ' 分钟 '}`;
    // },
  },
  watch: {
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  destroyed() {
    clearInterval(this.initeval);
  },
  mounted() {
    this.initStep();
  },
  methods: {
    initAxios() {
      apiWorkflow = new ApiWorkflow(this.axios);
    },
    initStep(endTime) {
      clearInterval(this.initeval);
      if (endTime) {
        let delta = endTime - this.startTime;
        let sum = getDeltaTime(delta);
        this.dealTime = `${sum.h + ' 小时 '}${sum.m + ' 分钟 '}${sum.s + ' 秒'}`;
      } else {
        this.loopNow();
        this.initeval = setInterval(() => {
          this.loopNow();
        }, 1000);
      }
    },
    isJson(jsonStr) {
      try {
        if (typeof JSON.parse(jsonStr) === 'object') {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    loopNow() {
      let endTime = new Date().getTime();
      let delta = endTime - this.startTime;
      let sum = getDeltaTime(delta);
      this.dealTime = `${sum.d ? sum.d + '天' : ''}${sum.h + ' 小时 '}${sum.m + ' 分钟 '}${sum.s + ' 秒'}`;
    },
    async refresh() {
      let response = await apiWorkflow.getWorkflowData(this.workflowId);
      if (response) {
        let woroflowList = response.data;
        // this.woroflowList = woroflowList|[];
        // if (this.woroflowList != 0) return;
        this.woroflowList = woroflowList.filter(item => item.nodeType!==null);
        this.startTime = new Date(woroflowList[0].time).getTime();

        woroflowList.forEach(element => {
          if (element.pendingUserInfos !== null) {
            // console.log(element.pendingUserInfos+'-*-*-');
            this.pendingUserInfos = element.pendingUserInfos;
          }
        });

        if (woroflowList.length > 1) {
          if (woroflowList[woroflowList.length - 1].isBpmEnd == true) {
            let endTime = new Date(woroflowList[woroflowList.length - 2].time).getTime();
            this.initStep(endTime);
          } else if (woroflowList[woroflowList.length - 1].state == 3) {
            let endTime = new Date(woroflowList[woroflowList.length - 1].time).getTime();
            this.initStep(endTime);
          }
        }
      }
    },

  },
  render() {
    return (
      <div style="overflow-y: auto; height:432px; overflow-x: hidden;">
        <h3>流程简报: 共耗时 {this.dealTime}</h3>
        <div style="margin-top:15px" >
          <a-steps direction="vertical" size="small" style="font-size:2px" current={this.woroflowList.length}>
            {(this.woroflowList instanceof Array) ? this.woroflowList.map((item, index) => {
              return (
                <a-step>
                  <div slot="title" class="item-title"
                    title={`${item.userName == null ? item.pendingUserInfos == null ? ''
                      : `${(this.woroflowList instanceof Array)?this.pendingUserInfos.map(info => { return info.name; }):null}`
                      : `${item.userName}`}`}>
                    {index + 1 + "." + item.nodeLabel + `${item.userName == null ? item.pendingUserInfos == null || item.pendingUserInfos.length == 0  ? ''
                      : `(${this.pendingUserInfos.map(info => { return info.name; })})`
                      : `(${item.userName})`}`}
                  </div>
                  {item.nodeType === "bpmStart" ? [<si-bpm-start-fill slot="icon" class="icon " size={20} />]
                    : item.nodeType === "bpmEnd" ? [<si-bpm-end-fill slot="icon" class="icon" size={20} />]
                      : [<si-bpm-approve-fill slot="icon" class="icon" size={20} />]}

                  {item.isBpmEnd ?
                    [<div slot="subTitle" class="slot-status"><span class="slot-status-font">已完成</span></div>]
                    : [<div slot="subTitle" class="slot-status"><span class="slot-status-font" >{item.isBpmApprove ? "等待" : getWorkflowStepState(item.state)}</span></div>]}
                  {item.isBpmApprove || item.isBpmEnd ? '' :
                    [
                      <div slot="description" class="slot">时 间<span class="slot-font">{moment(item.time).format('YYYY-MM-DD HH:mm:ss')}</span></div>,
                      <div slot="description" class="slot">意 见<span class="slot-font">{item.comments === "" ? "无" : item.comments}</span></div>,
                      <div slot="description" class="slot">简 报
                        <div style="margin-top: -20.35px;">
                          {item.infos.map(info => {
                            if (this.isJson(info.info)) {
                              let files = JSON.parse(info.info);
                              return (<div class="slot-font-sub"> {info.label}: <span class="slot-font"> {(files instanceof Array) ? files.map(file => {
                                return <SmFileTag url={file.url} fileType={file.type} fileName={file.name} />;
                              }) : null}</span></div>);
                            } else {
                              return (<div class="slot-font-sub"> {info.label}: <span class="slot-font">{info.info}</span></div>);
                            }
                          })}
                        </div>
                      </div>,
                    ]
                  }

                </a-step>
              );
            }) : null}
          </a-steps>
        </div>
      </div>
    );
  },
};