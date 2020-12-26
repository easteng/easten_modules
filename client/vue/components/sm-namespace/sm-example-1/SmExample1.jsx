
import './style';
import { requestIsSuccess } from '../../_utils/utils';
import ApiEntity from '../../sm-api/sm-namespace/Entity';
let apiEntity = new ApiEntity();

export default {
  name: 'SmExample1',
  props: {
    axios: { type: Function, default: null },
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
      <div class="sm-example-1">
        SmExample1
      </div>
    );
  },
};
    