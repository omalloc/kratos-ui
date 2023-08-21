import services from '@/services/console';
import { PlusOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProTable,
  TableDropdown,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { useRef } from 'react';

const { ZoneGetZoneList, ZoneCreateZone } = services.Zone;

const columns: ProColumns[] = [
  {
    dataIndex: 'code',
    title: '可用区码',
    hideInSearch: true,
  },
  {
    dataIndex: 'name',
    title: '可用区',
    sorter: true,
  },
  {
    dataIndex: 'env',
    title: '环境',
    renderText: (text) => <Tag>{text}</Tag>,
  },
  {
    dataIndex: 'status',
    title: '状态',
    render: (_, record) => <Tag color={'gold'}>正常</Tag>,
  },
  {
    dataIndex: 'agent',
    title: '守护服务',
    render: (_, record) => <Tag color={'blue'}>在线 (v1.0.1)</Tag>,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: '120px',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

const DataCenterPage: React.FC = () => {
  const actionRef = useRef();

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={ZoneCreateZone}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              ZoneCreateZone({
                code: 'z-test',
                name: '可用区-test',
              });

              actionRef.current?.reload();
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default DataCenterPage;
