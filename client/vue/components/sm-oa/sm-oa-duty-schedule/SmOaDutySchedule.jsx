import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import moment from 'moment';
import SmOaCalendar from './src/SmOaCalendar';
import SmOaDescriptions from './src/SmOaDescriptions';
import ApiDutySchedule from '../../sm-api/sm-oa/DutySchedule';
import { requestIsSuccess, vPermission, vP, vIf } from '../../_utils/utils';
import permissionsSmOa from '../../_permissions/sm-oa';
import { ModalStatus } from '../../_utils/enum';

let apiDutySchedule = new ApiDutySchedule();
export default {
  name: 'SmOaDutySchedule',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
    isOaDutySchedule:{ type: Boolean, default: false }, //人员信息，是否是人员信息下的值班管理
  },
  data() {
    return {
      queryParams: {
        organizationId: undefined,
        date: new Date(),
        name: null,
        loading: false, //确定按钮是否处于加载状态
      },
      record: null,//选择的当前记录
      dutySchedule: [],
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  watch: {

  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiDutySchedule = new ApiDutySchedule(this.axios);
    },
    async refresh() {

      let data = {
        organizationId: this.queryParams.organizationId,
        name: this.queryParams.name,
        date: moment(this.queryParams.date).startOf('month').format('YYYY-MM'),
      };
      let response = await apiDutySchedule.getList(data);
      if (requestIsSuccess(response) && response.data) {
        this.dutySchedule = response.data;
      }
    },
    getData(item, date) {
      this.queryParams.date = new Date(date);
    },

    //人员信息下，打开值班人员详细modal：
    descriptionsOa(item){
      if(item){
        this.$refs.oaDescriptions.clickOpen();
      }
    },
    //人员信息结束
  },
  render() {
    return (
      <div class="sm-oa-duty-schedule">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              iOrganizationId: undefined,
              date: new Date(),
              userName: null,
            };
            this.record = null;
            this.refresh();
          }}
        >
          <a-form-item label="组织机构">
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              value={this.queryParams.organizationId}
              onInput={value => {
                this.queryParams.organizationId = value;
                this.$emit('orgInput', value);
                this.$emit('orgChange', value);
                this.record = null;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="日期范围">
            <a-month-picker
              allowClear={false}
              style="width: 100%"
              value={moment(this.queryParams.date, 'YYYY-MM')}
              onChange={val => {
                this.record = null;
                this.queryParams.date = val;
                this.refresh();
              }}

            />
          </a-form-item>
          <a-form-item label="值班人">
            <a-input
              allowClear
              placeholder="请输入值班人名字"
              value={this.queryParams.name}
              onInput={event => {
                this.record = null;
                this.queryParams.name = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
        </sc-table-operator>
        {/* 展示区 */}
        <div class="oa-calendar-descriptions">
          {/* 日期展示 */}
          <div class="oa-calendar"  >
            <SmOaCalendar
              isOaDutySchedule={this.isOaDutySchedule}
              monthPickerDate={moment(this.queryParams.date)}
              organizationId={this.queryParams.organizationId}
              axios={this.axios}
              permissions={this.permissions}
              dutySchedule={this.dutySchedule}
              onSuccess={() => {
                this.refresh();
              }}
              onView={(item) => { this.record = item; {this.isOaDutySchedule ? this.descriptionsOa(this.record) : undefined ;}}}
              onDate={(item) => { this.queryParams.date = item; this.refresh();}}
            />
          </div>
          {/* 详情展示 */}
          {vIf(
            !this.isOaDutySchedule ? 
              <div class="oa-description-m">
                <SmOaDescriptions record={this.record} ref="smOaDescriptions" isOaDutySchedule = {this.isOaDutySchedule}/>
              </div>
              : undefined,
            vP(this.permissions, permissionsSmOa.DutySchedule.Detail),
          )}
        </div>
        {
          this.isOaDutySchedule ? 
            <SmOaDescriptions record={this.record} ref="oaDescriptions" isOaDutySchedule = {this.isOaDutySchedule}/>
            : undefined
        }
      </div>
    );
    
  },
};