import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import { PlusOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Space, Typography } from 'antd';
import { useRef, useState } from 'react';
import AppModal from './AppModal';

const { Text, Paragraph } = Typography;

const { AppList } = services.App;

const AppPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const { idMap: namespaceMap } = useModel('namespace');
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<API.AppInfo | undefined>({});

  const columns: ProColumns<API.AppInfo>[] = [
    {
      dataIndex: 'name',
      title: '应用名称',
      width: 260,
      render: (_, { name, alias }) => (
        <>
          <Paragraph copyable>{name}</Paragraph>
          <Text type="secondary">{alias}</Text>
        </>
      ),
    },
    {
      dataIndex: 'namespace_id',
      title: '命名空间',
      width: 180,
      valueEnum: namespaceMap,
    },
    {
      dataIndex: 'description',
      title: '应用描述',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'ports',
      title: '服务端口(预期)',
      hideInSearch: true,
      width: 240,
      renderText: (value) => (
        <Space>
          {value.map((item: API.AppInfoAppPort) => (
            <span key={`${item.port}_${item.protocol}`}>
              {item.protocol || item.remark}/{item.port}
            </span>
          ))}
        </Space>
      ),
    },
    {
      dataIndex: 'users',
      title: '应用负责人',
      renderText: (value) => value.join(', '),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const { data = [], pagination } = await AppList(mergeData(params));
          return {
            data,
            success: true,
            total: pagination!.total,
          };
        }}
        toolBarRender={() => [
          <Button
            key="newbtn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setFormVisible(true);
              setFormData({ id: 0 });
            }}
          >
            新建
          </Button>,
        ]}
      />
      <AppModal
        open={formVisible}
        formData={formData}
        onCancel={() => setFormVisible(false)}
        onOk={() => {
          setFormVisible(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default AppPage;
