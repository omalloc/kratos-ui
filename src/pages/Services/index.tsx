import AppModal from '@/pages/Resource/App/AppModal';
import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import {
  ActionType,
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
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
  notification,
  type ColumnType,
} from 'antd';
import { useRef, useState } from 'react';
import { useStyles } from './styles';

const { Text } = Typography;

const { DiscoveryOnlineServices, DiscoveryKVUpdateHang } = services.Discovery;

const statusMap = {
  1: 'UP',
  2: 'HANG',
  3: 'DOWN',
};

type ServiceType = Required<API.ServiceGroup & API.Service & { count: number }>;

type Namespace = {
  record: ServiceType;
  nameMap: Record<string, string>;
};

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
          <Tooltip title={cluster} placement="topLeft">
            {key}
          </Tooltip>
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

const hangActionRender = (
  callback: (id: string, hang: boolean) => Promise<void>,
  entity: ServiceType,
) => {
  const { id, hang, metadata, count = 1 } = entity;

  const hangState = hang || metadata['hang'] === 'true';
  const desc = hangState
    ? '恢复服务后，该服务会在 5 秒内被集群中的服务消费方加入到后端服务列表中，恢复对外提供服务'
    : count > 1
    ? '请注意，熔断后，服务依赖方将无法调用到该服务'
    : '请注意，服务仅一个实例，熔断发现后将无法访问该服务提供的功能';

  return (
    <Popconfirm
      key={id}
      overlayStyle={{ width: 300 }}
      placement="topRight"
      title="变更发现状态"
      description={desc}
      onConfirm={async () => callback(id, !(metadata['hang'] === 'true'))}
    >
      <Switch
        key="disable_service"
        checkedChildren="正常"
        unCheckedChildren="熔断"
        checked={!hangState}
      />
    </Popconfirm>
  );
};

const OnlineService: React.FC = () => {
  const { styles } = useStyles();

  const { nameMap, dataMap } = useModel('namespace');
  const { hasAppExist } = useModel('app');

  const actionRef = useRef<ActionType>();
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<API.AppInfo | undefined>({});

  const createApp = (record: Required<API.Service>) => {
    setFormVisible(true);
    setFormData({
      id: '0',
      name: record.name,
      namespace_id: dataMap[record.namespace]?.id,
    });
  };

  const updateHang = async (id: string, hang: boolean) => {
    try {
      await DiscoveryKVUpdateHang({ id }, { id, hang });
      message.success('集群服务状态变更成功');
      actionRef.current?.reload();
    } catch (e: any) {
      if (e.response) {
        const { message } = e.response?.data || {};
        notification.error({
          message: message,
        });
        return;
      }
      notification.error({
        message: '集群服务状态变更失败',
      });
    }
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
      width: 350,
      ellipsis: true,
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
      initialValue: 'microservices',
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
      render: (_, entity) => {
        return !entity.is_group && [hangActionRender(updateHang, entity)];
      },
    },
  ];
  const serviceColumns: ColumnType<API.Service>[] = [
    {
      dataIndex: 'status',
      width: 178,
      align: 'center',
      render: (_, record: API.Service) => (
        <Tag color={record.last_healthy_sec > 30 ? 'red' : 'green'}>
          {record.last_healthy_sec}
        </Tag>
      ),
    },
    {
      dataIndex: 'name',
      title: '服务名称',
      width: 350,
      ellipsis: true,
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
      initialValue: 'microservices',
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
      render: (_, entity) => {
        return !entity.is_group && [hangActionRender(updateHang, entity)];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="key"
        size="small"
        indentSize={0}
        className={styles.serviceRow}
        actionRef={actionRef}
        columns={columns}
        polling={true}
        request={async (params) => {
          const { data } = await DiscoveryOnlineServices(mergeData(params));
          return {
            data,
            success: true,
          };
        }}
        expandable={{
          childrenColumnName: 'un-used',
          indentSize: 0,
          expandRowByClick: true,
          expandedRowRender: ({ children = [] }) => {
            return (
              <Table
                size="small"
                rowKey="key"
                columns={serviceColumns}
                dataSource={children.map((item) => ({
                  ...item,
                  count: children.length,
                }))}
                pagination={false}
                showHeader={false}
              />
            );
          },
        }}
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
