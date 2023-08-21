import { getApps } from '@/services/app';
import { RunTimeLayoutConfig, type RequestConfig } from '@umijs/max';
// 运行时配置

export const request: RequestConfig = {
  timeout: 6000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  responseInterceptors: [
    (response: any) => {
      const { data } = response;
      if (response.status <= 206) {
        return data;
      }
      return response;
    },
  ],
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  apps?: any[];
  currentApp: string;
}> {
  const data = await getApps();
  return { name: 'Admin', apps: data.apps, currentApp: 'app1' };
}

const transfrom = (apps: any[]) => {
  return apps.map((app) => {
    return {
      key: app.key,
      title: app.name,
      icon: app.icon,
    };
  });
};

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  console.log('initialState', initialState);
  return {
    logo: '/logo.svg',
    title: '',
    layout: 'mix',
    navTheme: 'light',
    splitMenus: true,
    fixedHeader: true,
    fixSiderbar: true,
    menu: {
      locale: false,
    },
    appList: transfrom(initialState?.apps || []),
    siderWidth: 208,
  };
};
