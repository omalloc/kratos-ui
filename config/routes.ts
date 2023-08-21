export default [
  {
    path: '/',
    name: '仪表盘',
    component: './Home',
  },
  {
    path: '/app',
    name: '应用管理',
    routes: [
      {
        path: '/app/:id',
        name: '应用详情',
        component: './App',
      },
      {
        path: '/app/:id/configs',
        name: '应用配置',
        component: './App/Configs',
      },
    ],
  },
  {
    name: '系统管理',
    path: '/admin',
    routes: [
      {
        name: '可用区管理',
        path: '/admin/datacenter',
        component: './Admin/DataCenter',
      },
    ],
  },
];
