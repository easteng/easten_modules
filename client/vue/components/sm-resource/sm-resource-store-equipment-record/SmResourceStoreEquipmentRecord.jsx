import { requestIsSuccess, getStoreEquipmentTestPassed, getStoreEquipmentTransferTypeEnable, getEquipmentServiceRecordType } from '../../_utils/utils';
import { StoreEquipmentTestState, StoreEquipmentTransferTypeEnable, EquipmentServiceRecordType } from '../../_utils/enum';
import moment from 'moment';
import ApiUser from '../../sm-api/sm-system/User';
import ApiStoreEquipment from '../../sm-api/sm-resource/StoreEquipments';
import ApiEquipments from '../../sm-api/sm-resource/EquipmentProperty';
import { data } from 'autoprefixer';
import './style/index.less';

let apiStoreEquipment = new ApiStoreEquipment();
let apiUser = new ApiUser();
let apiEquipments = new ApiEquipments();

// 履历分组
const HistoryGroup = {
  init: 10,
  service: 20,
  test: 30,
  transform: 40,
};

export default {
  name: 'SmResourceStoreEquipmentRecord',
  props: {
    width: { type: [Number, String], default: '100%' },
    axios: { type: Function, default: null },
    value: { type: String, default: null },//返回值
    iconParameter: { type: Number, default: 1 },//图标显示参数(1|2),第一套图标|第二套图标
    showPerson: { type: Boolean, default: false },//是否显示人员信息
    showInfo: { type: Boolean, default: false },//是否显示详情
    size: { type: String, default: 'default' },
  },
  data() {
    return {
      storeEquipmentRecords: [],
      loading: false,
      iValue: null,
      disabledPerson: false,
      histories: [],
    };
  },
  computed: {

  },
  watch: {
    value: {
      handler: function (value) {
        this.iValue = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    showPerson: {
      handler: function (value) {
        this.disabledPerson = value;
      },
      immediate: true,
    },

  },
  async created() {
    // this.initAxios();
    // this.refresh();
  },

  methods: {

    initAxios() {
      apiUser = new ApiUser(this.axios);
      apiStoreEquipment = new ApiStoreEquipment(this.axios);
      apiEquipments = new ApiEquipments(this.axios);

    },
    async refresh() {
      this.loading = true;
      let response = null;
      if (this.iValue) {
        response = await apiStoreEquipment.getStoreEquipmentRecords({ id: this.iValue });
        if (requestIsSuccess(response) && response.data) {
          this.storeEquipmentsRecord = response.data;
          this.getStepsData();
          this.sortStepsData();
        }
        this.loading = false;
      }


    },

    //按照时间前后重新排序数据
    sortStepsData() {
      let _storeEquipmentRecords = this.storeEquipmentRecords;
      let temp = null;
      for (let i = 0; i < _storeEquipmentRecords.length; i++) {
        for (let j = 0; j < _storeEquipmentRecords.length - i - 1; j++) {
          if (_storeEquipmentRecords[j].createdDate > _storeEquipmentRecords[j + 1].createdDate) {
            temp = _storeEquipmentRecords[j];
            _storeEquipmentRecords[j] = _storeEquipmentRecords[j + 1];
            _storeEquipmentRecords[j + 1] = temp;
          }
        }
      }
      this.storeEquipmentRecords = _storeEquipmentRecords;
    },

    //数据整合
    getStepsData() {

      let stepsData = [];

      let data = this.storeEquipmentsRecord;
      if (data) {
        //编码
        stepsData.push({
          createdDate: data.creationTime,
          creatorId: data.creatorId,
          creatorName: data.creator && data.creator.name ? data.creator.name : '',
          name: '编码',
          showInfo: '首次编码',
          info: '详情',
          type: HistoryGroup.init,
        });

        //出入库信息
        if (data.storeEquipmentTransfer) {
          data.storeEquipmentTransfer.map(item => {
            stepsData.push({
              createdDate: item.creationTime,
              creatorId: item.userId,
              creatorName: item.userName ? item.userName : item.user? item.user.name:'',
              name: getStoreEquipmentTransferTypeEnable(item.type),
              showInfo: '(' + item.storeHouse.name + ')',
              info: '详情',
              type: HistoryGroup.transform + item.type,
            });
          });
        }

        //上下道信息
        if (data.equipmentServiceRecords) {
          data.equipmentServiceRecords.map(item => {
            stepsData.push({
              createdDate: item.date,
              creatorId: item.userId,
              creatorName: item.userName !== null ? item.userName : item.user ? item.user.name : '',
              name: getEquipmentServiceRecordType(item.type),
              showInfo: data.name,
              info: '详情',
              type: HistoryGroup.service + item.type,
            });
          });
        }

        //检测单信息
        if (data.storeEquipmentTest) {
          data.storeEquipmentTest.map(item => {
            item.passed == StoreEquipmentTestState.Qualified ?

              //备品信息
              stepsData.push({
                createdDate: item.date,
                creatorId: item.testerId,
                creatorName: item.testerName ? item.testerName : item.tester?item.tester.name:'',
                name: '检测',
                showInfo: '(' + getStoreEquipmentTestPassed(StoreEquipmentTestState.Qualified) + ')',
                info: '详情',
                type: HistoryGroup.test + StoreEquipmentTestState.Qualified,
              }) :

              //报废信息
              stepsData.push({
                createdDate: item.date,
                creatorId: item.testerId,
                creatorName: item.testerName? item.testerName : item.tester?item.tester.name:'',
                name: '报废',
                showInfo: '(报废)',
                info: '详情',
                type: HistoryGroup.test + StoreEquipmentTestState.Unqualified,
              });
          });
        }
      }
      this.storeEquipmentRecords = stepsData;
    },

    getIconByName(type) {
      let icon = null;
      switch (type) {
      case HistoryGroup.init:
        icon = <a-icon style={{ color: '#858585' }} type="qrcode" />;
        break;
      case (HistoryGroup.test + StoreEquipmentTestState.Qualified):
        icon = <a-icon style={{ color: 'rgb(68 199 111/1)' }} type="check-circle" />;
        break;
      case (HistoryGroup.test + StoreEquipmentTestState.Unqualified):
        icon = <a-icon style={{ color: '#cb4949' }} type="stop" />;
        break;
      case (HistoryGroup.transform + StoreEquipmentTransferTypeEnable.Import):
        icon = <a-icon style={{ color: '#61ccd0' }} type="import" />;
        break;
      case (HistoryGroup.transform + StoreEquipmentTransferTypeEnable.Export):
        icon = <a-icon style={{ color: '#b7ae39' }} type="export" />;
        break;
      case (HistoryGroup.service + EquipmentServiceRecordType.Install):
        icon = <a-icon style={{ color: '#52ad26' }} type="up-square" />;
        break;
      case (HistoryGroup.service + EquipmentServiceRecordType.UnInstall):
        icon = <a-icon style={{ color: '#aeaeae' }} type="down-square" />;
        break;
      default:
        icon = <a-icon style={{ color: '#555555' }} type="question" />;
        break;
      }
      return icon;
    },
  },
  render() {
    return (
      <div
        class={{ "sm-resource-store-equipment-record": true, 'sm-resource-store-equipment-record-mini': this.size === 'small' }}
        style={{ width: this.width instanceof String ? this.width + 'px' : this.width }}
      >
        <a-steps direction="vertical" size={this.size} class={{ 'title-icon': this.size === 'small' }}>
          {
            this.storeEquipmentRecords.map(item => {
              let title = item.name + '  ' + moment(item.createdDate).format('YYYY-MM-DD') + '   ' + item.showInfo;
              return (
                <a-step title={
                  <div class="title">
                    <a-tooltip placement="bottomLeft" title={title}>
                      <div class="title-left" >{title}</div>
                    </a-tooltip>
                    {this.disabledPerson == false && this.showInfo == false ? undefined : <div>
                      <div class="title-middle"></div>
                      <div class="title-right">
                        {this.disabledPerson ? <span class="title-right-personInfo">{('人员：' + item.creatorName)}</span> : null}
                        {this.showInfo ? <span class="title-right-showInfo">{('人员：' + item.creatorName)}</span> : null}
                      </div>
                    </div>}

                  </div>
                }>
                  <template slot="icon">{this.getIconByName(item.type)}</template>
                </a-step>
              );
            })
          }
        </a-steps>
      </div>
    );
  },
};
