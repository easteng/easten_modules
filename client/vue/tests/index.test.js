import pkg from '../package.json';

const testDist = process.env.LIB_DIR === 'dist';

describe('snweb-module dist files', () => {
  // https://github.com/ant-design/ant-design/issues/1638
  // https://github.com/ant-design/ant-design/issues/1968
  it('exports modules correctly', () => {
    const snwebModule = testDist ? require('../dist/snweb-module') : require('../components'); // eslint-disable-line global-require
    expect(Object.keys(snwebModule)).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/1970
  // https://github.com/ant-design/ant-design/issues/1804
  if (testDist) {
    it('should have snweb-module.version', () => {
      const snwebModule = require('../dist/snweb-module'); // eslint-disable-line global-require
      expect(snwebModule.version).toBe(pkg.version);
    });
  }
});
