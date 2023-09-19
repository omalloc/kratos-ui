import { RunTimeLayoutConfig, type RequestConfig } from '@umijs/max';
import { App, message } from 'antd';
// 运行时配置

export const request: RequestConfig = {
  timeout: 6000,
  // other axios options you want
  errorConfig: {
    errorHandler(errs) {
      message.error(errs.message);
    },
    errorThrower() {},
  },
  responseInterceptors: [
    (response: any) => {
      // const { data } = response;
      // if (response.status <= 206) {
      //   return data;
      // }
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
  return { name: 'Admin', apps: [], currentApp: 'app1' };
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
  return {
    logo: '/logo.svg',
    title: '',
    layout: 'mix',
    navTheme: 'light',
    splitMenus: true,
    fixedHeader: true,
    fixSiderbar: true,
    collapsed: false,
    // collapsedWidth: 80,
    collapsedButtonRender: false,
    siderWidth: 180, // ignored prop.
    contentWidth: 'Fluid',
    iconfontUrl: '//at.alicdn.com/t/c/font_4221036_c2wl4klxsj.js',
    menu: {
      locale: false,
      type: 'group',
      collapsedShowTitle: true,
    },
    token: {
      sider: {
        colorMenuBackground: '#fff',
        colorMenuItemDivider: '#dfdfdf',
        colorBgMenuItemHover: '#f6f6f6',
        colorTextMenu: '#595959',
        colorTextMenuSelected: '#242424',
        colorTextMenuActive: '#242424',
      },
    },
    appList: transfrom(initialState?.apps || []),
    childrenRender(dom) {
      return <App>{dom}</App>;
    },
  };
};
