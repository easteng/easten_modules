import {
  ModalStatus,
  InstallationSiteLocationType,
  InstallationSiteUseType,
  InstallationSiteState,
  RailwayDirection,
} from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiInstallationSite from '../../sm-api/sm-basic/InstallationSite';
import { requestIsSuccess } from '../../_utils/utils';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmSystemDataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import SmBasicRailwaySelect from '../sm-basic-railway-tree-select';
import SmBasicStationSelectByRailway from '../sm-basic-station-select-by-railway';
import SmBasicInstallationSiteSelect from '../sm-basic-installation-site-select';
import moment from 'moment';

let apiInstallationSite = new ApiInstallationSite();

export default {
  name: 'SmBasicInstallationSiteModal',

  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },

  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      stationOption: [], //线路关联站点
      locationTypeOption: [], //位置分类集合
      selectedRows: [],
      isRailwayOuter: false, //是否是沿线
      railwayId: null, //当前所选线路
      organizationId: null,
    };
  },

  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },

    formFields() {
      return this.isRailwayOuter
        ? [
          'parentId',
          'name',
          'code',
          'codeName',
          'organizationId',
          'useType',
          'typeId',
          'locationType',
          'railwayDirection',
          'location',
          'longitude',
          'latitude',
          'state',
          'useDate',
        ]
        : [
          'parentId',
          'name',
          'code',
          'codeName',
          'organizationId',
          'useType',
          'typeId',
          'locationType',
          'railwayDirection',
          'location',
          'longitude',
          'latitude',
          'state',
          'useDate',
          'railwayId',
          'stationId',
          'kmMark',
        ];
    },
  },

  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },

  methods: {
    initAxios() {
      apiInstallationSite = new ApiInstallationSite(this.axios);
    },

    add(record) {
      this.form.resetFields();
      this.status = ModalStatus.Add;
      this.record = record;
      this.$nextTick(() => {
        this.form.setFieldsValue({ parentId: record ? record.id : null });
      });
    },

    //编辑按钮
    async edit(record) {
      let response = await apiInstallationSite.get(record.id);
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.status = ModalStatus.Edit;
        this.railwayId = this.record.railwayId;

        if (this.record.locationType === InstallationSiteLocationType.RailwayOuter) {
          this.isRailwayOuter = true;
        }
        this.organizationId = this.record.organizationId;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, this.formFields);
          values = {
            ...values,
            useDate: this.record.useDate ? moment(this.record.useDate, 'YYYY-MM-DD') : null,
          };
          this.form.setFieldsValue(values);
        });
      }
    },

    //查看
    async view(record) {
      let response = await apiInstallationSite.get(record.id);
      if (requestIsSuccess(response)) {
        this.status = ModalStatus.View;
        this.record = response.data;
        this.railwayId = this.record.railwayId;

        if (this.record.locationType === InstallationSiteLocationType.RailwayOuter) {
          this.isRailwayOuter = true;
        }
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, this.formFields);
          values = {
            ...values,
            useDate: this.record.useDate ? moment(this.record.useDate, 'YYYY-MM-DD') : null,
          };
          this.form.setFieldsValue(values);
        });
      }
    },

    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
      this.isRailwayOuter = false;
    },

    async ok() {
      // 数据提交
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let _values = values;
            _values.useDate = values.useDate ? moment(values.useDate).format() : '';
            _values.kmMark = values.kmMark ? values.kmMark : 0;
            _values.codeName = values.codeName ? values.codeName : null;
            let response = null;
            if (this.status === ModalStatus.Add) {
              response = await apiInstallationSite.create(_values);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.close();
                this.$emit('success', 'Add', _values);
              }
            } else if (this.status === ModalStatus.Edit) {
              response = await apiInstallationSite.get(this.record.id);
              let params = {
                id: this.record.id,
                ..._values,
              };
              response = await apiInstallationSite.update(params);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.close();
                this.$emit('success', 'Edit', params);
              }
            }

          }
        });
      }
    },
  },
  render() {
    //位置类别
    let locationTypeOption = [];
    for (let item in InstallationSiteLocationType) {
      locationTypeOption.push(
        <a-select-option key={InstallationSiteLocationType[item]}>
          {utils.getInstallationSiteLocationTypeTitle(InstallationSiteLocationType[item])}
        </a-select-option>,
      );
    }
    //使用类别
    let useTypeOption = [];
    for (let item in InstallationSiteUseType) {
      useTypeOption.push(
        <a-select-option key={InstallationSiteUseType[item]}>
          {utils.getInstallationSiteUseTypeTitle(InstallationSiteUseType[item])}
        </a-select-option>,
      );
    }
    //机房状态
    let stateOption = [];
    for (let item in InstallationSiteState) {
      stateOption.push(
        <a-select-option key={InstallationSiteState[item]}>
          {utils.getInstallationSiteStateTitle(InstallationSiteState[item])}
        </a-select-option>,
      );
    }
    //线路方向
    let railwayDirectionOption = [];
    for (let item in RailwayDirection) {
      railwayDirectionOption.push(
        <a-select-option key={RailwayDirection[item]}>
          {utils.getRailwayDirectionTitle(RailwayDirection[item])}
        </a-select-option>,
      );
    }
    return (
      <a-modal
        title={`${this.title}机房`}
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        onOk={this.ok}
        width={800}
      >
        <a-form form={this.form}>
          <a-row>
            <a-col span={12}>
              <a-form-item
                style="display: flex; align-items: center;"
                label="父级"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <SmBasicInstallationSiteSelect
                  placeholder={this.status === ModalStatus.View || (this.record && this.record.parentId == null) ? '' : '请选择父级'}
                  disabled={this.record !== null}
                  axios={this.axios}
                  height={32}
                  v-decorator={[
                    'parentId',
                    {
                      initialValue: null,
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={12}>
              <a-form-item
                label="机房名称"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-input
                  placeholder={this.status === ModalStatus.View ? '' : '请输入机房名称'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'name',
                    {
                      initialValue: null,
                      rules: [
                        { required: true, message: '请输入机房名称！' },
                        { max: 100, message: '机房名称最多输入100字符', whitespace: true },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item
                label="编码"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-input
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请输入机房编码'}
                  v-decorator={[
                    'code',
                    {
                      initialValue: null,
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={12}>
              <a-form-item
                label="机房类别"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <SmSystemDataDictionaryTreeSelect
                  axios={this.axios}
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择机房类别'}
                  groupCode={'InstallationSiteType'}
                  v-decorator={[
                    'typeId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择机房类别！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item
                label="使用单位"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <SmSystemOrganizationTreeSelect
                  axios={this.axios}
                  disabled={this.status === ModalStatus.View}
                  placeholder={this.status === ModalStatus.View ? '' : '请选择使用单位'}
                  treeCheckable={false}
                  // value={this.record ? this.record.organizationId : null}
                  // onChange={value => this.record.organizationId = value}
                  v-decorator={[
                    'organizationId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择使用单位！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col span={12}>
              <a-form-item
                label="位置类别"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-select
                  placeholder={this.status == ModalStatus.View ? '' : '请选择位置类别'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'locationType',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择位置类别！' }],
                    },
                  ]}
                  onChange={value => {
                    if (value === InstallationSiteLocationType.RailwayOuter) {
                      this.isRailwayOuter = true;
                    } else {
                      this.isRailwayOuter = false;
                    }
                  }}
                >
                  {locationTypeOption}
                </a-select>
              </a-form-item>
            </a-col>
            {!this.isRailwayOuter
              ? [
                <a-col span={12}>
                  <a-form-item
                    label="线别"
                    label-col={formConfig.labelCol}
                    wrapper-col={formConfig.wrapperCol}
                  >
                    <SmBasicRailwaySelect
                      axios={this.axios}
                      disabled={this.status === ModalStatus.View}
                      placeholder={this.status === ModalStatus.View ? '' : '请选择线别'}
                      showSearch={true}
                      v-decorator={[
                        'railwayId',
                        {
                          initialValue: undefined,
                        },
                      ]}
                      onChange={value => {
                        this.railwayId = value;
                        this.form.setFieldsValue({ stationId: undefined });
                      }}
                    />
                  </a-form-item>
                </a-col>,
                <a-col span={12}>
                  <a-form-item
                    label="车站区间"
                    label-col={formConfig.labelCol}
                    wrapper-col={formConfig.wrapperCol}
                  >
                    <SmBasicStationSelectByRailway
                      axios={this.axios}
                      railwayId={this.railwayId}
                      placeholder={this.status == ModalStatus.View ? '' : '请选择站区'}
                      disabled={this.status === ModalStatus.View}
                      v-decorator={[
                        'stationId',
                        {
                          initialValue: undefined,
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>,

                <a-col span={12}>
                  <a-form-item
                    label="公里标"
                    label-col={formConfig.labelCol}
                    wrapper-col={formConfig.wrapperCol}
                  >
                    <a-input-number
                      placeholder={this.status === ModalStatus.View ? '' : '请输入公里标'}
                      disabled={this.status === ModalStatus.View}
                      min={0}
                      precision={0}
                      style="width: 100%"
                      v-decorator={[
                        'kmMark',
                        {
                          initialValue: null,
                          rules: [
                            { pattern: /^(?:0|[1-9]\d{0,8})?$/, message: '不能超过十位数' },
                          ],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>,
                <a-col span={12}>
                  <a-form-item
                    label="线路类别"
                    label-col={formConfig.labelCol}
                    wrapper-col={formConfig.wrapperCol}
                  >
                    <a-select
                      placeholder={this.status == ModalStatus.View ? '' : '请选择线路类别'}
                      disabled={this.status === ModalStatus.View}
                      v-decorator={[
                        'railwayDirection',
                        {
                          initialValue: undefined,
                        },
                      ]}
                    >
                      {railwayDirectionOption}
                    </a-select>
                  </a-form-item>
                </a-col>,
              ]
              : undefined}

            <a-col span={12}>
              <a-form-item
                label="使用类别"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-select
                  placeholder={this.status == ModalStatus.View ? '' : '请选择使用类别'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'useType',
                    {
                      initialValue: undefined,
                      // rules: () => { return [{ required: true, message: '请选择使用类别！' }]; },
                    },
                  ]}
                >
                  {useTypeOption}
                </a-select>
              </a-form-item>
            </a-col>

            <a-col span={12}>
              <a-form-item
                label="机房位置"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-input
                  placeholder={this.status === ModalStatus.View ? '' : '请输入位置'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'location',
                    {
                      initialValue: '',
                      rules: [
                        { max: 100, message: '机房位置最多输入100字符', whitespace: true },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item
                label="经纬度"
                style="margin-bottom:0;"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-form-item style="display:inline-block;width: 45%;">
                  <a-input-number
                    style="width:100%;"
                    disabled={this.status === ModalStatus.View}
                    placeholder={this.status === ModalStatus.View ? '' : '请输入经度'}
                    v-decorator={[
                      'longitude',
                      {
                        initialValue: '',
                      },
                    ]}
                  />
                </a-form-item>

                <span style="display:inline-block; width: '24px'; textAlign:center; margin: 0 10px;">
                  -
                </span>
                <a-form-item style="display:inline-block;width: 45%;">
                  <a-input-number
                    style="width:100%;"
                    disabled={this.status === ModalStatus.View}
                    placeholder={this.status === ModalStatus.View ? '' : '请输入纬度'}
                    v-decorator={[
                      'latitude',
                      {
                        initialValue: '',
                      },
                    ]}
                  />
                </a-form-item>
              </a-form-item>
            </a-col>

            <a-col span={12}>
              <a-form-item
                label="状态"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-select
                  placeholder={this.status == ModalStatus.View ? '' : '请选择状态'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'state',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择状态！' }],
                    },
                  ]}
                >
                  {stateOption}
                </a-select>
              </a-form-item>
            </a-col>

            <a-col span={12}>
              <a-form-item
                label="投产日期"
                label-col={formConfig.labelCol}
                wrapper-col={formConfig.wrapperCol}
              >
                <a-date-picker
                  placeholder={this.status === ModalStatus.View ? '' : '请选择投产日期'}
                  disabled={this.status === ModalStatus.View}
                  style="width: 100%"
                  v-decorator={[
                    'useDate',
                    {
                      initialValue: null,
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    );
  },
};
