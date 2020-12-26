import { ModalStatus, StationsType } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiStation from '../../sm-api/sm-basic/Station';
import { requestIsSuccess, getStationTypeTitle } from '../../_utils/utils';
import { pagination as paginationConfig } from '../../_utils/config';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmBasicRailwayTreeSelect from '../sm-basic-railway-tree-select';

let apiStation = new ApiStation();

const formFields = ['name', 'remark', 'repairTeam'];

export default {
  name: 'SmBasicStationsModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      isLoading: false,
      queryParams: {
        treeCheckable: true,
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
      },
      pageIndex: 1,
      selectedRows: [],
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
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 60,
          ellipsis: true,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '线路名称',
          dataIndex: 'railwayName',
          // width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'railwayName' },
        },
        {
          title: '公里标',
          dataIndex: 'kmMark',
          width: 90,
          ellipsis: true,
          scopedSlots: { customRender: 'kmMark' },
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
      apiStation = new ApiStation(this.axios);
    },
    add() {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },
    //编辑按钮
    async edit(record) {
      let response = await apiStation.get({ id: record.id });
      if (requestIsSuccess(response)) {
        let data = response.data;
        this.record = data;
        this.status = ModalStatus.Edit;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          values.repairTeam = [];
          values.belongRailway = [];
          for (const item of data.repairTeams) {
            values.repairTeam.push(item.id);
          }
          // for (const item of data.belongRailway) {
          //   values.belongRailway.push(item.id);
          // }
          this.form.setFieldsValue(values);
        });
      }
    },
    async view(record) {
      this.status = ModalStatus.View;
      this.activeKey = '1';
      let response = await apiStation.get({ id: record.id });
      if (requestIsSuccess(response)) {
        let data = response.data;
        this.record = data;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          values.repairTeam = [];
          values.belongRailway = [];
          for (const item of data.repairTeams) {
            values.repairTeam.push(item.id);
          }
          // for (const item of data.belongRailway) {
          //   values.belongRailway.push(item.id);
          // }
          this.form.setFieldsValue(values);
        });
      }
    },

    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
      this.queryParams.filter = '';
    },

    async ok() {
      // 数据提交
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            this.isLoading = true;
            let response = null;
            console.log(values);
            if (this.status === ModalStatus.Add) {
              response = await apiStation.create({
                ...values,
                kmMark: values.kmMark != null ? values.kmMark : 0,
              });
            } else if (this.status === ModalStatus.Edit) {
              response = await apiStation.get({
                id: this.record.id,
              });
              if (requestIsSuccess(response)) {
                let params = {
                  id: this.record.id,
                  ...values,
                  kmMark: values.kmMark != null ? values.kmMark : 0,
                };
                response = await apiStation.update(params);
              }
            }

            if (requestIsSuccess(response)) {
              this.queryParams.railwayId = [];
              this.queryParams.organizationId = [];
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }
            this.isLoading = false;
          }
        });
      }
    },
  },
  render() {
    //站点类型
    let stationTypeOption = [];
    for (let item in StationsType) {
      stationTypeOption.push(
        <a-select-option key={StationsType[item]}>
          {getStationTypeTitle(StationsType[item])}
        </a-select-option>,
      );
    }
    let userForm = (
      <a-form form={this.form}>
        <a-form-item
          label="站点名称"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-input
            disabled={this.status === ModalStatus.View}
            placeholder={this.status == ModalStatus.View ? '' : '请输入站点名称'}
            v-decorator={[
              'name',
              {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入站点名称！' },
                  { max: 50, message: '站点名称最多输入50字符', whitespace: true },
                ],
              },
            ]}
          />
        </a-form-item>

        <a-form-item
          label="维护班组"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <OrganizationTreeSelect
            axios={this.axios}
            disabled={this.status === ModalStatus.View}
            placeholder={this.status == ModalStatus.View ? '' : '请选择维护班组'}
            multiple={true}
            v-decorator={[
              'repairTeam',
              {
                initialValue: [],
              },
            ]}
          />
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
                rules: [{ max: 500, message: '备注最多输入500字符', whitespace: true }],
              },
            ]}
          />
        </a-form-item>
      </a-form>
    );
    let viewForm = (
      <a-tabs
        default-active-key="1"
        onChange={val => {
          this.activeKey = '1';
        }}
      >
        <a-tab-pane key="1" tab="基本信息">
          {userForm}
        </a-tab-pane>
        <a-tab-pane key="2" tab="所属线路" force-render>
          <a-table
            columns={this.columns}
            rowKey={record => record.railway.id}
            dataSource={this.record.belongRailways}
            bordered={this.bordered}
            pagination={false}
            scroll={{ y: 400 }}
            {...{
              scopedSlots: {
                index: (text, record, index) => {
                  let str = index + 1;
                  return <a-tooltip title={str}>{str}</a-tooltip>;
                },
                railwayName: (text, record) => {
                  let str = record.railway.name;
                  return <a-tooltip title={str}>{str}</a-tooltip>;
                },
                kmMark: (text, record) => {
                  let str = record.kmMark;
                  return <a-tooltip title={str}>{str}</a-tooltip>;
                },
              },
            }}
          ></a-table>
        </a-tab-pane>
      </a-tabs>
    );
    return (
      <a-modal
        title={`${this.title}站点`}
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        onOk={this.ok}
        width={this.status == ModalStatus.View ? 650 : 520}
      >
        {this.status == ModalStatus.View ? viewForm : userForm}
      </a-modal>
    );
  },
};
