
import './style';
import { requestIsSuccess } from '../../_utils/utils';
import ApiEntity from '../../sm-api/sm-namespace/Entity';
let apiEntity = new ApiEntity();

export default {
  name: 'SmDashboardListCard',
  props: {
    axios: { type: Function, default: null },
    action: { type: [String, Function], default: null }, // 获取数据的地址或者执行方法
  },
  data() {
    return {
    };
  },
  computed: {},
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiEntity = new ApiEntity(this.axios);
    },
    async refresh() { },
  },
  render() {
    return (
      <div class="sm-dashboard-list-card">
        SmDashboardListCard
      </div>
    );
  },
};
