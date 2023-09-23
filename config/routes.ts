export default [
  {
    path: '/',
    name: '仪表盘',
    icon: 'icon-dashboard',
    component: './Home',
  },
  {
    path: '/services',
    name: '服务在线',
    icon: 'icon-service',
    component: './Services',
  },
  {
    name: '资源管理',
    path: '/resource',
    icon: 'icon-resource',
    routes: [
      {
        path: '',
        redirect: '/resource/app',
      },
      {
        path: '/resource',
        name: '业务侧',
        routes: [
          {
            name: '应用',
            path: '/resource/app',
            icon: 'icon-app',
            component: './Resource/App',
          },
          {
            name: '命名空间',
            path: '/resource/namespace',
            icon: 'icon-namespace',
            component: './Resource/Namespace',
          },
          {
            name: '节点',
            path: '/resource/node',
            icon: 'icon-node2',
            component: './Resource/Node',
          },
          {
            name: '可用区',
            path: '/resource/zone',
            icon: 'icon-zone',
            component: './Resource/Zone',
          },
        ],
      },
      {
        path: '/resource/etcd',
        name: 'KV-管理',
        icon: 'icon-code-tag',
        component: './Resource/Etcd',
      },
    ],
  },

  {
    path: '/admin',
    name: '系统管理',
    icon: 'icon-config',
    routes: [
      {
        path: '/admin/user',
        name: '用户',
        icon: 'user',
      },
      {
        path: '/admin/role',
        name: '角色',
        icon: 'team',
      },
      {
        path: '/admin/permission',
        name: '权限',
        icon: 'verified',
      },
    ],
  },
];
