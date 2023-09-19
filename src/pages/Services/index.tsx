import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import {
  PageContainer,
  ProTable,
  type ProColumns,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Badge, Popover, Space, Switch, Tag } from 'antd';

const { DiscoveryOnlineServices } = services.Discovery;

const statusMap = {
  1: 'UP',
  2: 'HANG',
  3: 'DOWN',
};

type ServiceType = Required<API.ServiceGroup & API.Service>;

const serviceNameRender = (
  { name, namespace, key, hostname, cluster, clusters = [] }: ServiceType,
  namespaceMap: Record<string, string>,
) => (
  <span>
    <Badge dot={namespaceMap[namespace] === undefined} offset={[6, 0]}>
      <strong>{name || key}</strong>
    </Badge>
    <br />
    <span style={{ color: '#999' }}>
      {hostname ? (
        <span>
          [{cluster}] {key}
        </span>
      ) : (
        <span>[{clusters.join(',')}] </span>
      )}
    </span>
  </span>
);

const namespaceRender = ({ namespace, hostname }, namespaceMap) => {
  if (hostname) {
    return null;
  }
  if (!namespaceMap[namespace]) {
    return (
      <Popover
        placement="topRight"
        content={
          <Space direction="vertical">
            <span>
              无法找到命名空间：<strong>{namespace}</strong>
            </span>
            <span>已有命名空间：</span>
            {Object.keys(namespaceMap).map((item) => (
              <span style={{ paddingLeft: 12 }} key="item">
                {item}
              </span>
            ))}
          </Space>
        }
      >
        <Tag color="red">命名空间绑定异常</Tag>
      </Popover>
    );
  }

  const color = namespaceMap[namespace] ? 'green' : 'red';

  return <Tag color={color}>{namespaceMap[namespace]}</Tag>;
};

const OnlineService: React.FC = () => {
  const { nameMap: namespaceMap } = useModel('namespace');

  const columns: ProColumns[] = [
    {
      dataIndex: 'status',
      title: '状态',
      valueEnum: statusMap,
      width: 100,
      render: (_, { hostname }) =>
        hostname === '' && <Badge status="success" text={'UP'} />,
    },
    {
      dataIndex: 'name',
      title: '服务名称',
      width: 400,
      render: (_, entity) => serviceNameRender(entity, namespaceMap),
    },
    {
      dataIndex: 'namespace',
      title: '命名空间',
      width: 220,
      render: (_, entity) => namespaceRender(entity, namespaceMap),
    },
    {
      dataIndex: 'count',
      title: '在线实例',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, { children = [] }) =>
        children.length > 0 && <Tag color="#87d068">{children.length}</Tag>,
    },
    { dataIndex: 'hostname', title: '主机', width: 400 },
    {
      dataIndex: 'endpoints',
      title: 'Endpoints',
      hideInSearch: true,
      render: (_, { hostname, endpoints }) =>
        hostname !== '' && (
          <Space.Compact direction="vertical">
            {endpoints.map((item: any) => (
              <div key={item}>{item}</div>
            ))}
          </Space.Compact>
        ),
    },
    {
      key: 'action',
      title: '操作',
      width: 120,
      valueType: 'option',
      render: (_, { hostname, metadata }) =>
        hostname !== ''
          ? [
              <Switch
                key="disable_service"
                checkedChildren="正常服务"
                unCheckedChildren="屏蔽服务"
                checked={metadata['hang'] !== 'true'}
                onChange={(checked) => {
                  console.log('checked', checked);
                }}
              />,
            ]
          : null,
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="key"
        columns={columns}
        request={async (params) => {
          const { data } = await DiscoveryOnlineServices(mergeData(params));
          return {
            data,
            success: true,
          };
        }}
        expandable={{
          expandRowByClick: true,
        }}
      />
    </PageContainer>
  );
};

export default OnlineService;
