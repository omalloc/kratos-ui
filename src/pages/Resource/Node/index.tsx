import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormCheckbox,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProTable,
  TableDropdown,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Divider, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { pick } from 'lodash-es';
import { useState } from 'react';
import { envEnum } from '../enum';
const { Text } = Typography;
const { NodeList, NodeCreate, NodeUpdate } = services.Node;
const { ZoneSimpleList } = services.Zone;

const statusMap: Record<string, { label: string; color: string }> = {
  UNKNOWN: {
    label: '离线',
    color: 'default',
  },
  NORMAL: {
    label: '心跳正常',
    color: 'success',
  },
  ABNORMAL: {
    label: '心跳异常',
    color: 'error',
  },
};

const NodePage: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<{
    id: number;
    name?: string;
    ip?: string;
    auto_detect?: boolean;
    env?: string;
    zone_id?: number;
  }>({ id: 0 });

  const columns: ProColumns[] = [
    {
      dataIndex: 'name',
      title: '节点名称',
      render: (dom, { ip }) => (
        <Space direction="vertical">
          <Text strong>{dom}</Text>
          <Text type="secondary">{ip}</Text>
        </Space>
      ),
    },
    {
      dataIndex: 'zone_name',
      title: '可用区/地区',
      width: 200,
      render: (_, { zone_id, zone_name, region_name }) => (
        <Space direction="vertical">
          <Text strong>
            {zone_name} ({zone_id})
          </Text>
          <Text type="secondary">{region_name}</Text>
        </Space>
      ),
    },
    { dataIndex: 'env', title: '环境', width: 70, hideInSearch: true },
    {
      dataIndex: 'agent_status',
      title: 'Agent 状态',
      width: 180,
      hideInSearch: true,
      render: (_, { agent }) => (
        <Space direction="vertical">
          <Tag color={statusMap[agent.type].color}>
            {statusMap[agent.type].label}
          </Tag>
          <Tag>
            {dayjs(agent.heartbeat_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </Tag>
        </Space>
      ),
    },
    {
      dataIndex: 'updated_at',
      title: '更新时间',
      width: 160,
      valueType: 'fromNow',
      hideInSearch: true,
      renderText: (value) => value * 1000,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 110,
      render: (_, record) => [
        <a
          key="editable"
          onClick={() => {
            console.log('edit', record);
            setFormData(record);
            setFormVisible(true);
          }}
        >
          编辑
        </a>,
        <Divider key="split" type="vertical" />,
        <TableDropdown
          key="more"
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' },
          ]}
          onSelect={(key) => {
            console.log(key, record);
            if (key === 'copy') {
              setFormData({
                id: 0,
                ...pick(record, [
                  'name',
                  'ip',
                  'auto_detect',
                  'env',
                  'zone_id',
                ]),
              });
              setFormVisible(true);
              return;
            }
          }}
        />,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { data, pagination } = await NodeList(mergeData(params));
          return {
            data,
            success: true,
            total: pagination?.total,
          };
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setFormData({ id: 0 });
              setFormVisible(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <ModalForm
        title="节点操作"
        open={formVisible}
        modalProps={{
          width: '700px',
          destroyOnClose: true,
          bodyStyle: {
            padding: '32px 0',
          },
          onCancel: () => setFormVisible(false),
        }}
        request={async () => {
          return {
            ...formData,
          };
        }}
        onFinish={async (values) => {
          console.log('onFinish', values);
          const res =
            values.id > 0
              ? await NodeUpdate({ id: values.id }, values)
              : await NodeCreate(values);
          if (res.data) {
            return true;
          }
          return false;
        }}
        autoFocusFirstInput
      >
        <ProFormText name="id" hidden />
        <ProFormText name="name" label="节点名称" />

        <ProFormGroup>
          <ProFormGroup>
            <ProFormSelect
              width="sm"
              name="env"
              label="环境变量"
              valueEnum={envEnum}
            />
            <ProFormDependency name={['auto_detect']}>
              {({ auto_detect }) => (
                <ProFormText
                  width="sm"
                  name="ip"
                  label="IP"
                  disabled={auto_detect}
                  placeholder={auto_detect ? '等待Agent上报' : '请填写'}
                />
              )}
            </ProFormDependency>
            <ProFormCheckbox name="auto_detect" label="自动上报" />
          </ProFormGroup>
        </ProFormGroup>

        <Divider />

        <ProFormGroup>
          <ProFormSelect
            width="md"
            name="zone_id"
            label="绑定到可用区"
            request={async () => {
              const { data = [] } = await ZoneSimpleList();
              return data.map(({ id, name }) => ({
                label: name,
                value: id,
              }));
            }}
          />
        </ProFormGroup>
      </ModalForm>
    </PageContainer>
  );
};

export default NodePage;
