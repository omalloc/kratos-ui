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
    path: '/tracing',
    name: '链路跟踪',
    icon: 'icon-service',
    component: './Tracing',
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
        type: 'group',
        name: '资源',
        key: 'resource-data',
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
        type: 'group',
        name: '集群',
        key: 'cluster-data',
        routes: [
          {
            path: '/resource/etcd',
            name: 'KV-管理',
            icon: 'icon-code-tag',
            component: './Resource/Etcd',
          },
          {
            path: '/resource/conf',
            name: '配置管理',
            icon: 'icon-config',
            component: './Resource/Conf',
          },
        ],
      },
    ],
  },

  {
    path: '/admin',
    name: '系统管理',
    icon: 'icon-config',
    routes: [
      {
        path: '',
        redirect: '/admin/user',
      },
      {
        path: '/admin/user',
        name: '用户',
        icon: 'user',
        component: './Admin/User',
      },
      {
        path: '/admin/role',
        name: '角色',
        icon: 'team',
        component: './Admin/Role',
      },
      {
        path: '/admin/permission',
        name: '权限',
        icon: 'verified',
        component: './Admin/Permission',
      },
    ],
  },
];
