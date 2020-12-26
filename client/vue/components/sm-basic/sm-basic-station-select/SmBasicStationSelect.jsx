import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiStation from '../../sm-api/sm-basic/Station';
let apiStation = new ApiStation();

export default {
  name: 'SmBasicStationSelect',
  props: {
    axios: { type: Function, default: null },
    value: { type: String || Number, default: undefined },
    disabled: { type: Boolean, default: false },
    treeCheckable: { type: Boolean, default: false },
    organizationId: { type: String, default: null },
    placeholder: { type: String, default: '请选择' },
  },
  data() {
    return {
      stations: [], // 列表数据源
      iValue: undefined,
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function (val, oldVal) {
        this.iValue = val;
      },
      immediate: true,
    },
    organizationId: {
      handler: function (val, oldVal) {
        this.refresh();
      },
      // immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiStation = new ApiStation(this.axios);
    },
    async refresh() {
      let response = await apiStation.getList({ isAll: true, orgId: this.organizationId });
      if (requestIsSuccess(response) && response.data.items) {
        let _stations = response.data.items.map(item => {
          return {
            ...item,
            title: item.name,
            value: item.id,
            key: item.id,
          };
        });

        this.stations = _stations;
        if (this.stations.length === 0) {
          this.iValue = null;
          this.$emit('input', this.iValue);
          this.$emit('change', this.iValue);
        }
      }
    },
  },
  render() {
    return (
      <a-select
        disabled={this.disabled}
        allowClear
        options={this.stations}
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
        value={this.iValue}
        onChange={value => {
          this.iValue = value;
          this.$emit('input', value);
          this.$emit('change', value);
        }}
      />
    );
  },
};
