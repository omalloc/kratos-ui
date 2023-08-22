import services from '@/services/console';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';

const { ZoneGetZoneList, ZoneCreateZone, ZoneDeleteZone } = services.Zone;

const envEnum: Record<string, string> = {
  dev: '开发',
  test: '测试',
  qa: 'QA',
  prod: '生产',
};

const columns: ProColumns[] = [
  { dataIndex: 'id', title: 'ID', hideInSearch: true },
  {
    dataIndex: 'code',
    title: '可用区',
    hideInSearch: true,
    renderText: (_, record) => (
      <span>
        {record.code}({record.name})
      </span>
    ),
  },
  { dataIndex: 'regionName', title: '地区', hideInSearch: true },
  {
    dataIndex: 'env',
    title: '环境',
    valueEnum: envEnum,
    render: (dom) => <Tag color="gold">{dom}</Tag>,
  },
  {
    dataIndex: 'status',
    title: '状态',
    render: () => <Tag color="green">正常</Tag>,
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
      <Popconfirm
        key="del"
        placement="topRight"
        title="可用区删除(操作不可逆)"
        description={`要删除 ${record.name} 可用区吗?`}
        onConfirm={async () => {
          await ZoneDeleteZone({ id: record.id });
          action?.reload();
        }}
      >
        <a style={{ color: 'red' }} rel="noopener noreferrer">
          删除
        </a>
      </Popconfirm>,
    ],
  },
];

const DataCenterPage: React.FC = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={async (params) => {
          const { data = [], total = 0 } = await ZoneGetZoneList(params);
          return {
            success: true,
            data: data,
            total: total,
          };
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setFormVisible(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <ModalForm<{
        name: string;
        code: string;
        regionName: string;
        regionCode: string;
        env: string;
      }>
        title="新建可用区"
        open={formVisible}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setFormVisible(false);
          },
        }}
        onFinish={async (values) => {
          const { data } = await ZoneCreateZone(values);
          if (data?.id > 0) {
            setFormVisible(false);
            actionRef.current?.reload();
          }
        }}
      >
        <ProFormText name="name" label="可用区" />
        <ProFormText name="code" label="可用区码" />
        <ProFormText name="regionName" label="地区" />
        <ProFormText name="regionCode" label="地区代码" />
        <ProFormSelect
          name="env"
          label="环境"
          valueEnum={{
            dev: '开发',
            test: '测试',
            qa: 'QA',
            prod: '生产',
          }}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default DataCenterPage;
