import { requestIsSuccess } from '../../_utils/utils';
import ApiEntity from '../../sm-api/sm-namespace/Entity';
let apiEntity = new ApiEntity();

export default {
  name: 'SmNamespaceModule',
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
      <div class="SmNamespaceModule">
        SmNamespaceModule
      </div>
    );
  },
};
