import { ModalStatus, RailwayType } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiRailway from '../../sm-api/sm-basic/Railway';
import { requestIsSuccess, getRailwayTypeTitle } from '../../_utils/utils';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select/index';

let apiRailway = new ApiRailway();

const formFields = ['name', 'type', 'remark'];

export default {
  name: 'SmBasicRailwayModal',
  props: {
    organizationId: { type: String, default: null },
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      pageIndex: 1,
      selectedRows: [],
      belongOrgInfos: [],
      activeKey: '1',
    };
  },
  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },
    innerColumns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '组织机构',
          dataIndex: 'org',
          scopedSlots: { customRender: 'org' },
        },
        {
          title: '下行区段开始',
          dataIndex: 'downStart',
          width: 120,
          scopedSlots: { customRender: 'downStart' },
        },
        {
          title: '下行区段终止',
          dataIndex: 'downEnd',
          width: 120,
          scopedSlots: { customRender: 'downEnd' },
        },
        {
          title: '上行区段开始',
          dataIndex: 'upStart',
          width: 120,
          scopedSlots: { customRender: 'upStart' },
        },
        {
          title: '上行区段终止',
          dataIndex: 'upEnd',
          width: 120,
          scopedSlots: { customRender: 'upEnd' },
        },
        {
          title: '操作',
          width: 80,
          dataIndex: 'operator',
          scopedSlots: { customRender: 'operator' },
        },
      ];
    },
    innerViewColumns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '组织机构',
          dataIndex: 'org',
          scopedSlots: { customRender: 'org' },
        },
        {
          title: '下行区段开始',
          dataIndex: 'downStart',
          width: 120,
          scopedSlots: { customRender: 'downStart' },
        },
        {
          title: '下行区段终止',
          dataIndex: 'downEnd',
          width: 120,
          scopedSlots: { customRender: 'downEnd' },
        },
        {
          title: '上行区段开始',
          dataIndex: 'upStart',
          width: 120,
          scopedSlots: { customRender: 'upStart' },
        },
        {
          title: '上行区段终止',
          dataIndex: 'upEnd',
          width: 120,
          scopedSlots: { customRender: 'upEnd' },
        },
      ];
    },
  },
  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiRailway = new ApiRailway(this.axios);
    },

    add() {
      this.form.resetFields();
      this.status = ModalStatus.Add;
      this.belongOrgInfos = [];
      this.activeKey = '1';
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },
    async edit(record) {
      this.activeKey = '1';
      let response = await apiRailway.get(record.id);
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.setBelongOrgInfo();
        this.status = ModalStatus.Edit;
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },

    async view(record) {
      this.activeKey = '1';
      let response = await apiRailway.get(record.id);
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.setBelongOrgInfo();
        this.status = ModalStatus.View;
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },

    setBelongOrgInfo() {
      this.belongOrgInfos = [];
      for (let i = 0; i < this.record.railwayRltOrganizations.length; i++) {
        const ele = this.record.railwayRltOrganizations[i];
        this.belongOrgInfos.push({
          id: this.getID(),
          orgId: ele.organizationId,
          upStart: ele.upLinkStartKM,
          upEnd: ele.upLinkEndKM,
          downStart: ele.downLinkStartKM,
          downEnd: ele.downLinkEndKM,
        });
      }
    },

    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
    },

    async ok() {
      //存在相同组织机构 提示
      for (let i = 0; i < this.belongOrgInfos.length; i++) {
        const ele1 = this.belongOrgInfos[i];
        if (ele1.orgId == null || ele1.orgId == undefined) {
          this.$message.error('存在不完整的组织机构关联，请检查');
          return;
        }
        for (let j = 0; j < this.belongOrgInfos.length; j++) {
          const ele2 = this.belongOrgInfos[j];
          if (ele1.orgId == ele2.orgId && i != j) {
            this.$message.error('存在多次相同组织机构关联，请检查');
            return;
          }
        }
      }

      // 数据提交
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let name = this.form.getFieldValue('name');
            values.name = name.replace(/[, ]/g, '');
            //组织关联数据
            let relateInfos = [];
            for (let i = 0; i < this.belongOrgInfos.length; i++) {
              const ele = this.belongOrgInfos[i];
              relateInfos.push({
                OrganizationId: ele.orgId,
                DownLinkStartKM: ele.downStart,
                DownLinkEndKM: ele.downEnd,
                UpLinkStartKM: ele.upStart,
                UpLinkEndKM: ele.upEnd,
              });
            }
            values.railwayOrgs = relateInfos;
            let response = null;
            if (this.status === ModalStatus.Add) {
              response = await apiRailway.create({ ...values });
            } else if (this.status === ModalStatus.Edit) {
              response = await apiRailway.update({ id: this.record.id, ...values });
            }

            if (requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }
          }
        });
      }
    },
    //添加须知机构关联
    addOrgRlt() {
      this.belongOrgInfos.push({
        id: this.getID(),
        orgId: null,
        upStart: 0,
        upEnd: 0,
        downStart: 0,
        downEnd: 0,
      });
    },
    //移除组织机构关联
    removeOrgRlt(id) {
      let arr = [id];
      this.belongOrgInfos = this.belongOrgInfos.filter(item => !arr.includes(item.id));
    },

    getID() {
      return Number(
        Math.random()
          .toString()
          .substr(3, 12) + Date.now(),
      ).toString(36);
    },
  },
  render() {
    //线路类型
    let railwayTypeOption = [];
    for (let item in RailwayType) {
      railwayTypeOption.push(
        <a-select-option key={RailwayType[item]}>
          {getRailwayTypeTitle(RailwayType[item])}
        </a-select-option>,
      );
    }

    return (
      <a-modal
        class="railway-modal"
        title={`${this.title}线路`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
        width={900}
      >
        <a-tabs
          activeKey={this.activeKey}
          onChange={val => {
            this.activeKey = val;
          }}
        >
          <a-tab-pane key="1" tab="基本信息">
            <a-form form={this.form}>
              <a-form-item
                label="线路名称"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-input
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请输入线路名称'}
                  v-decorator={[
                    'name',
                    {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请输入线路名称！', whitespace: true },
                        { max: 50, message: "线路名称最多输入50字符" },
                      ],
                    },
                  ]}
                />
              </a-form-item>

              <a-form-item
                label="线路类型"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-select
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请选择线路类型'}
                  v-decorator={[
                    'type',
                    {
                      initialValue: RailwayType.Uniline,
                      rules: [{ required: true, message: '请选择线路类型！' }],
                    },
                  ]}
                >
                  {railwayTypeOption}
                </a-select>
              </a-form-item>

              <a-form-item
                label="备注"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-textarea
                  rows="3"
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请输入备注'}
                  v-decorator={[
                    'remark',
                    {
                      initialValue: '',
                      rules: [{ max: 1000, message: '备注最多输入1000字符' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="2" tab="维护单位" force-render>
            {this.status != ModalStatus.View ? (
              <a-button
                type="primary"
                style="margin-bottom:10px;"
                onClick={() => {
                  this.addOrgRlt();
                }}
              >
                添加
              </a-button>
            ) : (
              undefined
            )}
            <a-table
              rowKey={record => record.id}
              columns={this.status == ModalStatus.View ? this.innerViewColumns : this.innerColumns}
              dataSource={this.belongOrgInfos}
              pagination={false}
              scroll={{ y: 300 }}
              {...{
                scopedSlots: {
                  index: (text, record, index) => {
                    return index + 1;
                  },
                  org: (text, record, index) => {
                    return (
                      <OrganizationTreeSelect
                        disabled={this.status == ModalStatus.View}
                        axios={this.axios}
                        value={record.orgId}
                        onChange={value => {
                          record.orgId = value;
                        }}
                      />
                    );
                  },
                  downStart: (text, record) => {
                    return (
                      <a-input-number
                        disabled={this.status == ModalStatus.View}
                        value={record.downStart}
                        precision={0}
                        onChange={val => {
                          record.downStart = val;
                        }}
                      ></a-input-number>
                    );
                  },
                  downEnd: (text, record) => {
                    return (
                      <a-input-number
                        disabled={this.status == ModalStatus.View}
                        value={record.downEnd}
                        precision={0}
                        onChange={val => {
                          record.downEnd = val;
                        }}
                      ></a-input-number>
                    );
                  },
                  upStart: (text, record) => {
                    return (
                      <a-input-number
                        disabled={this.status == ModalStatus.View}
                        value={record.upStart}
                        precision={0}
                        onChange={val => {
                          record.upStart = val;
                        }}
                      ></a-input-number>
                    );
                  },
                  upEnd: (text, record) => {
                    return (
                      <a-input-number
                        disabled={this.status == ModalStatus.View}
                        value={record.upEnd}
                        precision={0}
                        onChange={val => {
                          record.upEnd = val;
                        }}
                      ></a-input-number>
                    );
                  },
                  operator: (text, record) => {
                    return (
                      <span>
                        <a-button
                          size="small"
                          onClick={() => {
                            this.removeOrgRlt(record.id);
                          }}
                        >
                          删除
                        </a-button>
                      </span>
                    );
                  },
                },
              }}
            ></a-table>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    );
  },
};
