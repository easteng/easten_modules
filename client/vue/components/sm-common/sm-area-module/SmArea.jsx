import ApiArea from '../../sm-api/sm-common/Area';
import { requestIsSuccess } from '../../_utils/utils';

let apiArea = new ApiArea();

export default {
  name: 'SmArea',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String] }, //返回值
    allowClear: { type: Boolean, default: true }, //是否允许清除
    disabled: { type: Boolean, default: false }, //是否禁用
    deep: { type: Number, default: 3 },//限制显示层级
    placeholder: { type: String, default: '请选择' },
  },
  data() {
    return {
      options: [],
      iValue: null,
    };
  },
  computed: {},
  watch: {
    value: {
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
      apiArea = new ApiArea(this.axios);
    },
    //根据上一级的id来获取该级的下属节点
    async getCities(id, deep) {
      let response = id ? await apiArea.getList(id, deep) : await apiArea.getList(null, 0);
      let areaOptions = [];
      if (requestIsSuccess(response) && response.data) {
        response.data.items.forEach((item) => {
          areaOptions.push({
            label: item.fullName,
            value: item.code,
            isLeaf: deep == this.deep ? true : false,
          });
        });
      }
      return areaOptions;
    },

    //初始化级联数据
    async refresh() {
      let response;
      if (this.value == null || this.value.length == 0) {
        response = await apiArea.getList(null, 0);
        if (requestIsSuccess(response) && response.data) {
          this.options = this.getTree(response.data.items);
          this.iValue = this.value;
        }
      } else {
        response = await apiArea.getListByIds(this.value && this.value.length > 0 ? this.value : [this.value]);
        if (requestIsSuccess(response) && response.data) {
          this.options = this.getTree(response.data);
          let area = this.value;
          if (area.length == 1) {
            if (area[0].length == 9) {
              area[0].length == this.deep * 3 ? this.iValue = [area[0].slice(0, 2), area[0].slice(0, 4), area[0].slice(0, 6), area[0]] :
                this.iValue = [area[0].slice(0, 2), area[0].slice(0, 4), area[0]];;
            } else if (area[0].length == 6) {
              this.iValue = [area[0].slice(0, 2), area[0].slice(0, 4), area[0]];
            } else if (area[0].length == 4) {
              this.iValue = [area[0].slice(0, 2), area[0]];
            } else {
              this.iValue = this.value;
            }
          } else if (typeof (area) != typeof ([])) {
            area = [this.value];
            if (area[0].length == 9) {
              this.iValue = [area[0].slice(0, 2), area[0].slice(0, 4), area[0].slice(0, 6), area[0]];
            } else if (area[0].length == 6) {
              this.iValue = [area[0].slice(0, 2), area[0].slice(0, 4), area[0]];
            } else if (area[0].length == 4) {
              this.iValue = [area[0].slice(0, 2), area[0]];
            } else {
              this.iValue = this.value;
            }
          } else {
            this.iValue = this.value;
          }
        }
      }

    },



    //将数据转化为所需的树状结构
    getTree(data) {
      let areaOptions = [];
      data.forEach(item => {
        item.children.length > 0 && item.deep != this.deep ?
          areaOptions.push({
            label: item.fullName,
            value: item.code,
            isLeaf: item.deep == this.deep ? true : false,
            children: item.children != null ? this.getTree(item.children) : null,
          }) :
          areaOptions.push({
            label: item.fullName,
            value: item.code,
            isLeaf: item.deep == this.deep ? true : false,
          });
      });
      return areaOptions;
    },


    //动态加载数据
    async getareaLoadData(selectedOptions) {
      if (selectedOptions != undefined) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        let area = [];
        area = (await this.getCities(this.iValue[this.iValue.length - 1], this.iValue.length)).map(item => item);
        // load options lazily
        setTimeout(() => {
          targetOption.loading = false;
          targetOption.children = area;
          this.options = [...this.options];
        }, 500);
      }

    },

  },
  render() {
    return (
      <a-cascader
        options={this.options}
        placeholder={this.placeholder}
        disabled={this.disabled}
        allowClear={this.allowClear}
        style="width: 100%"
        loadData={this.getareaLoadData}
        value={this.iValue}
        change-on-select
        onChange={(value, selectedOptions) => {
          this.iValue = value;
          // this.getareaLoadData(selectedOptions);
          this.$emit('input', value);
          this.$emit('change', value);
        }}
      />
    );
  },
};
