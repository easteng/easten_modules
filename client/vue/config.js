window.snEarthProjectUrl =
  'http://172.16.1.22:8041/project/sn_earth_project/project.json';

const config = {
  tokenKey: 'access_token',
  application: {
    name: 'MyProjectName',
    logoUrl: '',
  },
  oAuthConfig: {
    // issuer: 'http://localhost:8091',
    issuer: 'http://172.16.1.22:8010',
    clientId: 'MyProjectName_App',
    dummyClientSecret: '1q2w3e*',
    scope: 'MyProjectName',
    showDebugInformation: true,
    oidc: false,
    requireHttps: false,
  },
  signalR:{
    url:"http://localhost:8091/message",
  },
  apis: {
    default: {
      // url: 'http://localhost:8091',
      url: 'http://172.16.1.22:8010',
    },
  },
  localization: {
    defaultResourceName: 'MyProjectName',
  },
};

export default config;
