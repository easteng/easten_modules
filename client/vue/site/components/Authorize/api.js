import axios from '@/utils/axios';
import config from '@/config';
import qs from 'qs';

export async function getToken(params) {
  // grant_type: password
  // scope: SystemModule
  // username: admin
  // password: 1q2w3E*
  // client_id: SystemModule_App
  // client_secret: 1q2w3e*

  let _data = {
    grant_type: 'password',
    scope: config.oAuthConfig.scope,
    ...params,
    client_id: config.oAuthConfig.clientId,
    client_secret: config.oAuthConfig.dummyClientSecret,
  };
  let _params = qs.stringify(_data);

  console.log(_data);

  console.log(_params);

  let res = await axios({
    url: config.oAuthConfig.issuer + '/connect/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: _params,
  });

  return res;
}

export async function getAppConfig() {
  let res = await axios({
    url: '/api/abp/application-configuration',
    methods: 'Get',
  });
  return res;
}

export async function getFileServerEndPoint() {
  let res = await axios({
    url: '/api/app/fileFileManager/getEndPoint',
    methods: 'Get',
  });
  return res;
}

export async function getOpenIdConfig() {
  let res = await axios({
    url: '/.well-known/openid-configuration',
    methods: 'Get',
  });
  return res;
}

export async function getJwks(url) {
  let res = await axios({
    url,
    methods: 'Get',
  });
  return res;
}

export async function getUserPermissions() {
  let res = await axios({
    url: '/api/app/appUser/getUserPermissions',
    methods: 'Get',
  });
  return res;
}
