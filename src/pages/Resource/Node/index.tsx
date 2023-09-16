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
import { Button, Divider, Tag } from 'antd';
import dayjs from 'dayjs';
import { pick } from 'lodash-es';
import { useState } from 'react';
import { envEnum } from '../enum';
const { NodeList, NodeCreate, NodeUpdate } = services.Node;
const { ZoneList } = services.Zone;

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
    autoDetect?: boolean;
    env?: string;
    zoneId?: number;
  }>({ id: 0 });

  const columns: ProColumns[] = [
    { dataIndex: 'id', title: '节点ID', width: '90px', hideInSearch: true },
    { dataIndex: 'name', title: '节点名称' },
    { dataIndex: 'ip', title: 'IP' },
    { dataIndex: 'region_name', title: '地区', hideInSearch: true },
    {
      dataIndex: 'zone_name',
      title: '可用区',
      render: (_, { zone_id, zone_name }) => `${zone_name}(${zone_id})`,
    },
    { dataIndex: 'env', title: '环境', width: '70px', hideInSearch: true },
    {
      dataIndex: 'agent_status',
      title: 'Agent情况',
      width: '260px',
      hideInSearch: true,
      render: (_, { agent }) => (
        <>
          <Tag color={statusMap[agent.type].color}>
            {statusMap[agent.type].label}
          </Tag>
          <Tag>
            {dayjs(agent.heartbeat_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </Tag>
        </>
      ),
    },
    {
      dataIndex: 'updated_at',
      title: '更新时间',
      width: '165px',
      valueType: 'dateTime',
      hideInSearch: true,
      renderText: (value) => value * 1000,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '110px',
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
          return NodeList(mergeData(params));
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
          if (res?.id > 0) {
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
            <ProFormDependency name={['autoDetect']}>
              {({ autoDetect }) => (
                <ProFormText
                  width="sm"
                  name="ip"
                  label="IP"
                  disabled={autoDetect}
                  placeholder={autoDetect ? '等待Agent上报' : '请填写'}
                />
              )}
            </ProFormDependency>
            <ProFormCheckbox name="autoDetect" label="自动上报" />
          </ProFormGroup>
        </ProFormGroup>

        <Divider />

        <ProFormGroup>
          <ProFormSelect
            width="md"
            name="zoneId"
            label="绑定到可用区"
            request={async () => {
              const { data = [] } = await ZoneGetZoneList({
                page_size: 100,
                current: 1,
              });
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
