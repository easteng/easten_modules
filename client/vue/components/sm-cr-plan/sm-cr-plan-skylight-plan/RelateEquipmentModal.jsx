import ApiEquipment from '../../sm-api/sm-resource/Equipments';
import { ModalStatus } from '../../_utils/enum';
import SmResourceEquipments from '../../sm-resource/sm-resource-equipments';

import './style/index.less';

let apiEquipment = new ApiEquipment();

export default {
  name: 'RelateEquipmentModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    installationSiteId: { type: String, default: null },
    organizationId: { type: String, default: null },
  },
  data() {
    return {
      selectedEquipmentIds: [], //已选Id设备
      selected: [],
      equipments: [],
      status: ModalStatus.Hide,
      totalCount: 0,
      pageIndex: 1,
      maxWorkCount: 0,
      iFDCodes: [],
      iInstallationSiteId: null,
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  watch: {
    status: {
      handler: function(value, oldVal) {
        if (value !== ModalStatus.Hide) {
        }
      },
      immediate: true,
    },
    installationSiteId: {
      handler: function(value, oldVal) {
        this.iInstallationSiteId = value;
      },
      immediate: true,
    },
  },
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiEquipment = new ApiEquipment(this.axios);
    },

    relate(record, ifdCodes, unFinishCount) {
      this.maxWorkCount = unFinishCount;
      this.iFDCodes = ifdCodes;
      this.selected = record.relateEquipments.map(item => {
        return {
          id: item.id,
          name: item.name,
          workCount: item.workCount,
        };
      });
      this.status = ModalStatus.Add;
    },

    close() {
      this.status = ModalStatus.Hide;
    },

    async ok() {
      // 数据提交
      if (this.selected.length > 0) {
        this.selected = this.selected.filter(item => {
          return item.workCount > 0;
        });
        let selectedSum = 0;
        this.selected.map(item => {
          selectedSum += item.workCount;
        });
        if (selectedSum <= this.maxWorkCount) {
          this.$emit('success', JSON.parse(JSON.stringify(this.selected)));
          this.close();
        } else {
          this.$message.warning('所选设备数量超过未完成量，请重新选择！');
        }
      } else {
        this.$emit('success', JSON.parse(JSON.stringify(this.selected)));
        this.close();
      }
    },

    //删除当前设备
    remove(item) {
      let selected = [...this.selected];
      selected.splice(this.selected.indexOf(item), 1);
      this.selected = [...selected];
    },
  },
  render() {
    return (
      <a-modal
        class="relate-equipment-modal"
        title={`关联设备（未完成量：${this.maxWorkCount}）`}
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        onOk={this.ok}
        width={800}
      >
        <div class="selected">
          {this.selected.length <= 0 ? (
            <span class="empty">请选择设备</span>
          ) : (
            <div>
              {this.selected.map(item => {
                return (
                  <div class="selected-item">
                    <a-icon style={{ color: '#f4222d' }} type={'printer'} />
                    <span> {`${item.name}(${item.workCount})`} </span>
                    <span
                      class="btn-close"
                      onClick={() => {
                        this.remove(item);
                      }}
                    >
                      <a-icon type="close" />
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SmResourceEquipments
          ref="SmResourceEquipments"
          axios={this.axios}
          isSimple={true}
          multiple={true}
          organizationId={this.organizationId}
          iFDCodes={this.iFDCodes}
          installationSiteId={this.iInstallationSiteId}
          selected={this.selected}
          onChange={selected => {
            this.selected = selected;
          }}
        />
      </a-modal>
    );
  },
};
