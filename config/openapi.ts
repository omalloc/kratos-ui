import { join } from 'path';

const openAPI = [
  {
    // requestLibPath: "import request from '@/utils/request'",
    requestLibPath: "import { request } from '@umijs/max'",
    // 或者使用在线的版本
    // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json",
    schemaPath: join(__dirname, 'zone.swagger.json'),
    mock: false,
    projectName: 'console',
  },
];

export default openAPI;
