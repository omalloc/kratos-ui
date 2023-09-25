import AppModal from '@/pages/Resource/App/AppModal';
import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import {
  PageContainer,
  ProTable,
  type ProColumns,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Badge,
  Popconfirm,
  Popover,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useState } from 'react';

const { Text } = Typography;

const { DiscoveryOnlineServices } = services.Discovery;

const statusMap = {
  1: 'UP',
  2: 'HANG',
  3: 'DOWN',
};

type ServiceType = Required<API.ServiceGroup & API.Service>;

const statusRender = ({ is_group, children = [] }: ServiceType) => {
  if (!is_group) {
    return null;
  }
  return (
    <Badge
      status="success"
      text={
        <span>
          UP
          {children.length > 0 && (
            <Tooltip title="服务在线实例数">
              <Tag style={{ marginLeft: 4 }} color="#87d068">
                {children.length}
              </Tag>
            </Tooltip>
          )}
        </span>
      }
    />
  );
};

const serviceNameRender = ({
  record: { is_group, key, name, namespace, cluster, clusters = [] },
  nameMap,
  hasAppExist,
  createApp,
}: any) => {
  // 服务是否在集群应用信息中存在
  // 必要条件， 应用名称_命名空间
  const exist = hasAppExist(name, namespace);

  const dom = (
    <>
      <Badge dot={nameMap[namespace] === undefined} offset={[6, 0]}>
        <strong style={exist ? {} : { color: 'red' }}>{name}</strong>
      </Badge>
      <br />
      <span style={{ color: '#999' }}>
        {!is_group ? (
          <span>
            [{cluster}] {key}
          </span>
        ) : (
          <span>[{clusters.join(',')}] </span>
        )}
      </span>
    </>
  );

  return (
    <span>
      {exist ? (
        dom
      ) : (
        <Popconfirm
          title="服务信息不完整"
          description="是否为该服务创建应用信息到命名空间下？"
          trigger="hover"
          okText="创建"
          onConfirm={() => {
            createApp({ name, namespace });
          }}
        >
          {dom}
        </Popconfirm>
      )}
    </span>
  );
};

type Namespace = {
  record: ServiceType;
  nameMap: Record<string, string>;
  // hasAppExist: (name: string, namespace: string) => boolean;
  // createApp: (record: ServiceType) => void;
};

const namespaceRender = ({ record, nameMap }: Namespace) => {
  if (!record.is_group) {
    return null;
  }
  if (!nameMap[record.namespace]) {
    return (
      <Popover
        placement="topRight"
        content={
          <Space direction="vertical">
            <span>
              无法找到命名空间：<strong>{record.namespace}</strong>
            </span>
            <span>已有命名空间：</span>
            {Object.keys(nameMap).map((item) => (
              <span style={{ paddingLeft: 12 }} key={item}>
                {item}
              </span>
            ))}
          </Space>
        }
      >
        <Tag color="red">命名空间异常</Tag>
      </Popover>
    );
  }

  const color = nameMap[record.namespace] ? 'green' : 'red';

  return (
    <Space direction="vertical">
      <Tag color={color}>{nameMap[record.namespace]}</Tag>
      <Text type="secondary">{record.namespace}</Text>
    </Space>
  );
};

const OnlineService: React.FC = () => {
  const { nameMap, dataMap } = useModel('namespace');
  const { hasAppExist } = useModel('app');

  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<API.AppInfo | undefined>({});

  const createApp = (record: Required<API.Service>) => {
    setFormVisible(true);
    setFormData({
      id: 0,
      name: record.name,
      namespace_id: dataMap[record.namespace]?.id,
    });
  };

  const columns: ProColumns[] = [
    {
      dataIndex: 'status',
      title: '状态',
      valueEnum: statusMap,
      width: 130,
      render: (_, entity) => statusRender(entity),
    },
    {
      dataIndex: 'name',
      title: '服务名称',
      width: 300,
      render: (_, record) =>
        serviceNameRender({
          record,
          nameMap,
          hasAppExist,
          createApp,
        }),
    },
    {
      dataIndex: 'namespace',
      title: '命名空间',
      width: 150,
      valueEnum: nameMap,
      render: (_, record) => namespaceRender({ record, nameMap }),
    },
    {
      dataIndex: 'hostname',
      title: '主机',
      render: (_, { hostname }) =>
        hostname ? <Text copyable>{hostname}</Text> : null,
    },
    {
      dataIndex: 'endpoints',
      title: 'Endpoints',
      width: 260,
      hideInSearch: true,
      render: (_, { is_group, endpoints }) =>
        !is_group && (
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
      render: (_, { is_group, metadata }) =>
        !is_group && [
          <Switch
            key="disable_service"
            checkedChildren="正常服务"
            unCheckedChildren="屏蔽服务"
            checked={metadata['hang'] !== 'true'}
            onChange={(checked) => {
              console.log('checked', checked);
            }}
          />,
        ],
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
        expandable={{}}
      />

      <AppModal
        open={formVisible}
        formData={formData}
        onCancel={() => setFormVisible(false)}
        onOk={() => {
          setFormVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default OnlineService;
