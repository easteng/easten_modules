import SmNamespaceModule from './SmNamespaceModule';

SmNamespaceModule.install = function(Vue) {
  Vue.component(SmNamespaceModule.name, SmNamespaceModule);
};

export default SmNamespaceModule;
