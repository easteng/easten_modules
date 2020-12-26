import * as utils from '../../_utils/utils';
import { State, PageState } from '../../_utils/enum';
import ApiFault from '../../sm-api/sm-emerg/Fault';
import ApiStation from '../../sm-api/sm-basic/Station';
import ComponentCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-component-category-tree-select';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import FaultEquipmentSelete from '../../sm-resource/sm-resource-equipment-select';
import RailwayTreeSelect from '../../sm-basic/sm-basic-railway-tree-select';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import moment from 'moment';

import './style/index.less';

let apiFault = new ApiFault();
let apiStation = new ApiStation();

const FaultsRouterPath = '/components/sm-emerg-faults-cn';
// 定义表单字段常量
const formFields = [
  'organizationId', //车间工区organizationId
  'railwayId',  //所属路线
  'stationId',  //车站区间
  'faultRltComponentCategories',  //关联构件
  'faultRltEquipments', //关联设备
  'equipmentNames', //设备名称
  'summary',  //故障概述
  'levelId',  //故障等级ID
  'content', //故障详情
  'abnormal', //监测异常
  'reasonTypeId', //原因分类id
  'reason', //原因分析
  'weatherDetail', //天气详情
  'temperatureGap', //温差-存最低和最高
  'disposeProcess', //处理过程
  'disposePersons', //处理人
  'remark', //备注
  'checkInTime',  //故障时间
  'checkOutTime', //销记时间

];

export default {
  name: 'SmEmergFault',
  props: {
    axios: { type: Function, default: null },
    faultId: { type: String, defaut: '' },//故障id
    pageState: { type: String, default: PageState.Add }, // 页面状态
    append: { type: String, defaut: 'new' },//添加故障的类型，默认为老的故障
    state: { type: Number, default: State.UnSubmitted },//保存时的状态,默认为未提交的状态
    isD3: { type: String, defaut: 'D3' },//取消时路由跳转问题（暂时这么解决）
  },
  data() {
    return {
      stationOption: [],//线路关联站点
      selectEquipments: [],  //已选设备
      faults: null,
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      loading: false, //确定按钮加载状态
      editor: null,
      forceRender: false,
      isSubmit: false,
      // faultId: null,
      // pageState: 'add',  //默认为添加模式
      // state: State.UnSubmitted,  //默认为未提交状态
      // append: 'old', //  默认添加的时是老故障
    };
  },

  watch: {
    
    faultId: {
      handler: function (value, oldValue) {
        if (value) {
          this.initAxios();
          this.faultId = value;
          this.refresh();
        }
      },
      immediate: true,
    },
    pageState: {
      handler: function (value, oldValue) {
        if (value !== PageState.Add) {
          this.initAxios();
          this.pageState = value;
          this.refresh();
        }
      },
      immediate: true,
    },
    state: {
      handler: function (value, oldValue) {
        this.initAxios();
        this.state = value;
      },
      immediate: true,
    },
  },

  async created() {
    this.initAxios();
    this.refresh();
    this.form = this.$form.createForm(this, {});
  },

  methods: {
    initAxios() {
      apiFault = new ApiFault(this.axios);
      apiStation = new ApiStation(this.axios);
    },

    //初始化计划列表
    async refresh() {
      if (this.pageState !== PageState.Add) {
        let response = await apiFault.get(this.faultId);
        if (utils.requestIsSuccess(response)) {
          let _faults = response.data;

          if (_faults.railwayId) {  //回显对应id的车站
            this.getListByRailwayId(_faults.railwayId);
          }
          this.faults = {
            ..._faults,
            checkInTime: _faults.checkInTime ? moment(_faults.checkInTime) : null,
            checkOutTime: _faults.checkOutTime ? moment(_faults.checkOutTime) : null,
            faultRltComponentCategories: _faults.faultRltComponentCategories.map(item =>
              item.componentCategoryId,
            ),
            faultRltEquipments: _faults.faultRltEquipments.map(item =>
              item.equipmentId,
            ),
            temperatureGap: _faults.temperatureMin ? _faults.temperatureMin + '，' + _faults.temperatureMax : '',
          };

          this.$nextTick(() => {
            let values = utils.objFilterProps(this.faults, formFields);
            this.form.setFieldsValue(values);
          });
        }
      }
    },

    //获取设备同步更新到input
    async getEquipment(value) {
      this.selectEquipments = value.map(item => item.name);
      this.form.setFieldsValue({
        equipmentNames: this.selectEquipments.join(','),
      });
    },

    //根据线路获取站点
    async getListByRailwayId(railwayId) {
      let response = await apiStation.getListByRailwayId(railwayId);
      if (utils.requestIsSuccess(response)) {
        this.stationOption = [];
        for (let item of response.data) {
          this.stationOption.push(<a-select-option key={item.id}>
            {item.name}
          </a-select-option>);
        }
      }
    },

    //关闭单页
    close() {
      this.$emit('cancel',this.isD3);
    },

    //提交
    present() {
      let _this = this;
      this.$confirm({
        content: h => <div style="color:red;">{'您确认提交吗，提交后将不可更改！'}</div>,
        okType: 'danger',
        onOk() {
          _this.isSubmit = true;
          _this.ok();
          //this.$emit('present');
        },
        onCancel() { },
      });
    },

    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },

    disabledDate(current) {
      let zero = new Date().setHours(24, 60, 60, 1000);
      if (current <= zero) {
        return false;
      }
      return true;
    },

    // 数据提交
    ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let _values = JSON.parse(JSON.stringify(values));
          let data = {
            ..._values,
            faultRltComponentCategories: _values.faultRltComponentCategories
              ? _values.faultRltComponentCategories.map(item => {
                return { id: item };
              })
              : [],
            faultRltEquipments: _values.faultRltEquipments
              ? _values.faultRltEquipments.map(item => {
                return { id: item };
              })
              : [],
            temperatureMin: _values.temperatureGap ? _values.temperatureGap.split('，')[0] : '',
            temperatureMax: _values.temperatureGap ? _values.temperatureGap.split('，')[1] : '',
            equipmentNames: _values.equipmentNames.split(/[,，]/).join(','),
            state: this.isSubmit ? State.Submitted : (this.append == 'new' ? State.Pending : State.UnSubmitted),
          };
          this.loading = true;

          if (this.pageState === PageState.Add) {
            let response = await apiFault.create(data);
            if (utils.requestIsSuccess(response)) {
              this.$message.success('添加成功');
              this.$emit('success');
              this.close();
            }
          } else if (this.pageState === PageState.Edit) {
            let _data = { id: this.faultId, ...data };
            let response = await apiFault.update(_data);
            if (utils.requestIsSuccess(response)) {
              this.$message.success(this.isSubmit ? '提交成功' : '编辑成功');
              this.$emit('success');
              this.close();
            }
          }
          this.loading = false;
        }
      });

    },

  },

  render() {
    //故障状态枚举
    let Options = [];
    for (let item in State) {
      Options.push(
        <a-select-option key={State[item]} value={State[item]}>
          {utils.getQuestionType(State[item])}
        </a-select-option>,
      );
    }

    return (
      <div class='SmEmergFault'>
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={12} md={12}>
              <a-form-item label="车间工区" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <OrganizationTreeSelect
                  axios={this.axios}
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请选择车间工区'}
                  v-decorator={[
                    'organizationId',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择车间工区',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="所属线别" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <RailwayTreeSelect
                  axios={this.axios}
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请选择所属线别'}
                  v-decorator={[
                    'railwayId',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择所属线别' }],
                    },
                  ]}
                  onChange={(value, data) => {
                    if (this.record) {
                      this.record.stationId = undefined;
                      let values = utils.objFilterProps(this.record, formFields);
                      this.form.setFieldsValue({ stationId: values.stationId });
                    }
                    this.getListByRailwayId(value);
                  }}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="车站区间" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-select
                  placeholder={this.pageState == PageState.View ? '' : '请选择车站区间'}
                  disabled={this.pageState == PageState.View}
                  v-decorator={[
                    'stationId',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择车站区间' }],
                    },
                  ]}
                >
                  {this.stationOption}
                </a-select>
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="设备类型" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <ComponentCategoryTreeSelect
                  axios={this.axios}
                  treeCheckable={true}
                  treeCheckStrictly={true}
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请选择设备类型'}
                  v-decorator={[
                    'faultRltComponentCategories',
                    {
                      initialValue: [],
                      rules: [
                        {
                          required: true,
                          message: '请选择设备类型',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="设备" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <FaultEquipmentSelete
                  placeholder={this.pageState == PageState.View ? '' : '请选择设备'}
                  //class='ant-input'
                  pageState={this.pageState}
                  style={'top: 4px;'}
                  height={32}
                  axios={this.axios}
                  multiple={true}
                  disabled={this.pageState == PageState.View}
                  onInput={value => this.getEquipment(value)}
                  v-decorator={[
                    'faultRltEquipments',
                    {
                      initialValue: [],
                    },
                  ]}
                />

              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="设备名称" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  allowClear={true}
                  disabled={this.pageState == PageState.View}
                  placeholder='请输入设备名称，设备名称之间以逗号隔开！'
                  v-decorator={[
                    'equipmentNames',
                    {
                      rules: [
                        {
                          required: true,
                          //pattern: /-?[0-9]*[.，]?[0-9]*/,
                          message: '请输入设备名称',
                        },
                        {
                          whitespace: true,
                          message: '请输入设备名称',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="故障时间" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-date-picker
                  placeholder='请选择故障时间，并在当前时间之前！'
                  disabled={this.pageState == PageState.View}
                  style="width:100%"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={current => this.disabledDate(current)}
                  v-decorator={[
                    'checkInTime',
                    {
                      initialValue: null,
                      rules: [{
                        required: true,
                        message: '请选择故障时间',
                      },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="销记时间" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-date-picker
                  placeholder={this.pageState == PageState.View ? '' : '请选择销记时间，并在故障发生之后，当前时间之前！'}
                  disabled={this.pageState == PageState.View || this.append == 'new'}
                  showTime
                  style="width:100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={current => this.disabledDate(current)}
                  v-decorator={[
                    'checkOutTime',
                    {
                      initialValue: null,
                    },
                  ]}
                />
              </a-form-item>
            </a-col>


            <a-col sm={12} md={12}>
              <a-form-item label="原因分类" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <DataDictionaryTreeSelect
                  axios={this.axios}
                  disabled={this.pageState == PageState.View}
                  groupCode={'EmergFaultReasonType'}//EmergFaultReasonType
                  placeholder={this.pageState == PageState.View ? '' : '请选择原因分类'}
                  v-decorator={[
                    'reasonTypeId',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择原因分类',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="监测异常" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入监测异常'}
                  v-decorator={[
                    'abnormal',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="故障等级" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <DataDictionaryTreeSelect
                  axios={this.axios}
                  groupCode={'EmergPlanLevel'}
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请选择故障等级'}
                  v-decorator={[
                    'levelId',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择故障等级',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="天气情况" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入天气情况'}
                  v-decorator={[
                    'weatherDetail',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="温差情况" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入温差，最低、最高温度用中文逗号（，）隔开'}
                  v-decorator={[
                    'temperatureGap',
                    {
                      initialValue: '',
                      rules: [
                        {
                          pattern: /^(\-|\+)?\d+(\.\d+)?(，(\-|\+)?\d+(\.\d+)?)$/,
                          message: '请输入正确的温差，并用逗号隔开',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="故障概况" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  rows="3"
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入故障概况'}
                  v-decorator={[
                    'summary',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="故障现象" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  rows="3"
                  disabled={this.pageState == PageState.View}
                  placeholder='请输入故障现象'
                  v-decorator={[
                    'content',
                    {
                      initialValue: '',
                      rules: [{
                        required: true,
                        message: '请输入故障现象',
                      },
                      {
                        whitespace: true,
                        message: "请输入故障现象",
                      },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="处理过程" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  rows="3"
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入处理过程'}
                  v-decorator={[
                    'disposeProcess',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="原因分析" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  rows="3"
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入原因分析'}
                  v-decorator={[
                    'reason',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="故障处理人" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入故障处理人'}
                  v-decorator={[
                    'disposePersons',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="备注信息" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  rows="3"
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入备注信息'}
                  v-decorator={[
                    'remark',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={12}>
              <a-col span={4}></a-col>
              {this.pageState !== PageState.View ? (
                [
                  <a-button
                    type="primary"
                    loading={this.loading}
                    style="margin-right: 20px"
                    onClick={() => this.ok()}
                  >
                    保存
                  </a-button>,
                  <a-button onClick={() => this.close()} style="margin-right: 20px">取消</a-button>,
                  this.pageState == PageState.Edit && this.state == State.UnSubmitted ? (<a-button onClick={() => this.present()} type="primary">提交</a-button>) : undefined,
                ]
              ) : (
                <a-button onClick={() => this.close()}>取消</a-button>
              )}
            </a-col>
          </a-row>
        </a-form>
      </div>
    );
  },
};
