import services from '@/services/console';
import { ZoneList } from '@/services/console/Zone';
import { mergeData } from '@/utils/pagination';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProTable,
  type ActionType,
  type ProColumns,
  type ProFormInstance,
} from '@ant-design/pro-components';
import { App, Button, Divider, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { envEnum } from '../enum';

const { ZoneCreate, ZoneUpdate, ZoneDelete } = services.Zone;

type ZoneItem = {
  id?: number;
  name: string;
  code: string;
  regionName: string;
  regionCode: string;
  env: string;
};

const DataCenterPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();

  const { message } = App.useApp();
  const [formData, setFormData] = useState<ZoneItem>();
  const [formVisible, setFormVisible] = useState(false);

  const columns: ProColumns[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: '80px',
      editable: false,
      hideInSearch: true,
    },
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
    { dataIndex: 'region_name', title: '地区', hideInSearch: true },
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
      width: '140px',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            console.log('option', record);
            setFormVisible(true);
            setFormData({ ...record });
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
            await ZoneDelete({ id: record.id });
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

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={async (params) => {
          const { data = [], pagination } = await ZoneList(mergeData(params));
          return {
            success: true,
            data: data,
            total: pagination?.total,
          };
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setFormData(undefined);
              setFormVisible(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <ModalForm
        title="可用区操作"
        formRef={restFormRef}
        open={formVisible}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setFormVisible(false);
          },
        }}
        request={async () => {
          return {
            ...formData,
          };
        }}
        onFinish={async ({ id, ...values }) => {
          // Updated
          if (id > 0) {
            await ZoneUpdate({ id }, values);
            setFormVisible(false);
            actionRef.current?.reload();
            message.success('更新成功');
            return true;
          }

          // Created
          const res = await ZoneCreate(values);
          console.log('new', res);
          if (res) {
            setFormVisible(false);
            actionRef.current?.reload();
            message.success('创建成功');
            return true;
          }
          return false;
        }}
      >
        <ProFormText name="id" hidden />
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true }]}
            width="md"
            name="name"
            label="可用区"
          />
          <ProFormText
            rules={[{ required: true }]}
            width="md"
            name="code"
            label="可用区码"
          />
          <ProFormSelect
            rules={[{ required: true, message: '请选择一个环境模式' }]}
            width="md"
            name="env"
            label="环境"
            valueEnum={envEnum}
          />
        </ProForm.Group>
        <Divider />
        <ProForm.Group>
          <ProFormText width="md" name="region_name" label="地区" />
          <ProFormText width="md" name="region_code" label="地区代码" />
        </ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
};

export default DataCenterPage;
