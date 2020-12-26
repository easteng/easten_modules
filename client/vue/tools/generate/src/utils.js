const fs = require('fs');
const _ = require('lodash');
const { Template } = require('webpack');
const colors = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red',
});

async function CreateSnModule(path, name) {
  let kebabCase = _.kebabCase(name);
  let CamelCase = _.upperFirst(_.camelCase(name));
  let cDir = `${path}\\${kebabCase}`;

  if (fs.existsSync(cDir)) {
    console.log(
      `Error: 当前模块已存在，路径：${cDir}`.red,
    );
    return;
  }

  // 创建目录
  await fs.mkdirSync(cDir, { recursive: true });

  // 创建组件文件
  await fs.writeFileSync(
    `${cDir}\\${CamelCase}.jsx`,
    `
      import './style';
      import { requestIsSuccess } from '../../_utils/utils';
      import ApiEntity from '../../sm-api/sm-namespace/Entity';
      let apiEntity = new ApiEntity();

      export default {
        name: '${CamelCase}',
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
            <div class="${kebabCase}">
              ${CamelCase}
            </div>
          );
        },
      };
    `.replace(/^      /gm, ''),
  );

  // 创建文档文件
  await fs.writeFileSync(
    `${cDir}\\index.en-US.md`,
    `
      ## API

      | Property | Description                                          | Type     | Default |
      | -------- | ---------------------------------------------------- | -------- | ------- |
      | axios    | the instance function that from project axios.create | function |

      `.replace(/^      /gm, ''),
  );
  await fs.writeFileSync(
    `${cDir}\\index.zh-CN.md`,
    `
      ## API

      | Property | Description                                          | Type     | Default |
      | -------- | ---------------------------------------------------- | -------- | ------- |
      | axios    | the instance function that from project axios.create | function |

      `.replace(/^      /gm, ''),
  );

  // 创建 index 文件
  await fs.writeFileSync(
    `${cDir}\\index.js`,
    `
      import ${CamelCase} from './${CamelCase}';

      ${CamelCase}.install = function(Vue) {
        Vue.component(${CamelCase}.name, ${CamelCase});
      };

      export default ${CamelCase};

    `.replace(/^      /gm, ''),
  );

  // 创建 style 目录及文件
  let styleDir = `${cDir}\\style`;
  await fs.mkdirSync(styleDir, { recursive: true });
  await fs.writeFileSync(`${styleDir}\\index.js`, `import './index.less'`.replace(/^      /gm, ''));
  await fs.writeFileSync(
    `${styleDir}\\index.less`,
    `
      .${kebabCase} {

      }
    `.replace(/^      /gm, ''),
  );

  // 创建 demo 目录及文件
  let demoDir = `${cDir}\\demo`;
  await fs.mkdirSync(demoDir, { recursive: true });

  await fs.writeFileSync(
    `${demoDir}\\basic.md`,
    `
      <cn>
      #### 基本用法
      </cn>

      <us>
      #### 基本用法
      </us>

      ***tpl
      <template>
        <div>
          <${kebabCase} :axios="axios"/>
        </div>

      </template>
      <script>
      import axios from '@/utils/axios.js'

      export default {
        data(){
          return {
            axios
          }
        },
        created(){
        },
        methods: {
        }
      }
      </script>
      *** `
      .replace(/^      /gm, '')
      .replace('***', '```'),
  );

  await fs.writeFileSync(
    `${demoDir}\\index.vue`,
    `
      <script>
      import Basic from './basic.md';

      import CN from './../index.zh-CN.md';
      import US from './../index.en-US.md';

      const md = {
        cn: ***Title*** ,
        us: ***Title*** ,
      };

      export default {
        title: '${CamelCase}',
        render() {
          return (
            <div id="components-${kebabCase}-demo">
              <md cn={md.cn} us={md.us} />
              <Basic />
              <api>
                <CN slot="cn" />
                <US />
              </api>
            </div>
          );
        },
      };
      </script>

      <style></style>
    `
      .replace(/^      /gm, '')
      .replace('***Title***', '`# ***Name***`')
      .replace('***Title***', '`# ***Name***`')
      .replace('***Name***', kebabCase)
      .replace('***Name***', kebabCase),
  );
  console.log(`模块 ${CamelCase}  创建成功，路径：${cDir}`.green);
}

module.exports = {
  CreateSnModule,
};
