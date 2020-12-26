import SmOaDutyScheduleModal from './SmOaDutyScheduleModal';
import ApiDutySchedule from '../../../sm-api/sm-oa/DutySchedule';
import { tips as tipsConfig } from '../../../_utils/config';
import { requestIsSuccess, vIf, vP, vPermission } from '../../../_utils/utils';
import permissionsSmOa from '../../../_permissions/sm-oa';

let apiDutySchedule = new ApiDutySchedule();
import moment from 'moment';
import '../style/index';
import { conforms, reject } from 'lodash';
export default {
  name: 'SmOaCalendar',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
    dutySchedule: { type: Array, default: () => [] },
    organizationId: { type: String, default: undefined },
    monthPickerDate: { type: Object, default: null },
    isOaDutySchedule:{ type: Boolean, default: false }, //人员信息，是否是人员信息下的值班管理
  },
  data() {
    return {
    };
  },
  watch: {
  },
  async created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiDutySchedule = new ApiDutySchedule(this.axios);
    },
    add(value) {
      this.$refs.SmOaDutyScheduleModal.add(value, this.organizationId);
    },
    view(record, date) {
      this.date = date;
      this.$emit('view', record, date);
    },
    edit(record) {
      this.$refs.SmOaDutyScheduleModal.edit(record);
    },
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = null;
            if (record) {
              response = await apiDutySchedule.delete(record.id);
              if (requestIsSuccess(response)) {
                _this.$emit('view', null);
                _this.$message.success('操作成功');
                _this.refresh();

                setTimeout(resolve, 100);
              } else {
                setTimeout(reject, 100);
              }
            }

          });
        },
        onCancel() { },
      });
    },

    //面板随着日期的变化
    headerRender({ value, type, onChange, onTypeChange }) {
      if (this.monthPickerDate) {
        value = this.monthPickerDate;
      }
      onChange(value);
    },

    refresh() {
      this.$emit('success');
    },
  },
  render() {
    return (
      <div class="oa-calendar">
        <a-card title="值班表" >
          <a-calendar
            headerRender={this.headerRender}
            onSelect={(item) => { this.$emit('date', item); }}
            {...{
              scopedSlots: {
                dateCellRender: (value) => {
                  let result = [];

                  let target = this.dutySchedule.find(item => moment(item.date).format('YYYY-MM-DD') === value.format('YYYY-MM-DD'));
                  if (!!target) {
                    result = <div class="item" onClick={() => { this.$emit('view', target); }}>
                      <div class="item-user">
                        {target.dutyScheduleRltUsers.map(_item => {
                          return <span> {_item.user.name} </span>;
                        })}
                      </div>
                      <div class="icon-divider">
                        <div class="user-icons">
                          <span class="sum-user">{`${target.dutyScheduleRltUsers.length} 人`}</span>
                          <span class="icons">

                            {vIf(
                              <span class="icon" onClick={() => { this.edit(target); }}><a-tooltip placement="top" title="修改"><si-editor />  </a-tooltip></span>,
                              vP(this.permissions, permissionsSmOa.DutySchedule.Update),
                            )}

                            {vIf(
                              <span class="icon" onClick={() => { this.remove(target); }}><a-tooltip placement="top" title="删除"><si-ashbin />  </a-tooltip></span>,
                              vP(this.permissions, permissionsSmOa.DutySchedule.Delete),
                            )}

                          </span>
                        </div>
                      </div>
                    </div>;
                  } else {
                    console.log(this.organizationId);
                    result = <div class="add-styles" onClick={() => { this.$emit('view', target); }}>
                      {this.organizationId ?

                        vIf(
                          <div class="add" >
                            <span class="addStyle" onClick={() => this.add(value)}>
                              <a-tooltip placement="top" title="添加" >
                                <si-add-select size={24} />
                              </a-tooltip>
                            </span>
                          </div>,
                          vP(this.permissions, permissionsSmOa.DutySchedule.Create),
                        )

                        : ''}

                    </div>;
                  }

                  return result;
                },
              },
            }}
          >
          </a-calendar>
        </a-card>
        {/* 添加/编辑模板 */}
        <SmOaDutyScheduleModal
          ref="SmOaDutyScheduleModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh();
          }}
        />
      </div >

    );
  },
};