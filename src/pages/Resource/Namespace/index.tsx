import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProList,
} from '@ant-design/pro-components';
import { App, Badge, Button, Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';

const { NamespaceList, NamespaceDelete, NamespaceCreate, NamespaceUpdate } =
  services.Namespace;

const NamespacePage: React.FC = () => {
  const { message } = App.useApp();
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<API.NamespaceInfo>({});

  const handleDelete = async (id?: number) => {
    if (!id) {
      return;
    }
    return await NamespaceDelete({ id });
  };
  const handleEdit = (record: API.NamespaceInfo) => {
    if (!record.id) {
      message.error('请求的ID不存在，请刷新后重试');
      return;
    }
    setFormData(record);
    setFormVisible(true);
  };

  return (
    <PageContainer>
      <ProList<API.NamespaceInfo>
        headerTitle="命名空间列表"
        showActions="hover"
        grid={{ gutter: 16, column: 3 }}
        itemCardProps={{
          ghost: true,
        }}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setFormData({ id: 0 });
              setFormVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
        metas={{
          title: {
            dataIndex: 'alias',
          },
          subTitle: {
            dataIndex: 'name',
            render: (dom) => <Tag color="#5BD8A6">{dom}</Tag>,
          },
          actions: {
            render: (_, record) => [
              <a key="run" onClick={() => handleEdit(record)}>
                查看
              </a>,
              <Popconfirm
                key="delete"
                placement="topRight"
                title="删除命名空间"
                description="删除命令空间会导致命名空间下的所有服务无法被发现"
                onConfirm={() => handleDelete(record.id)}
              >
                <a>删除</a>
              </Popconfirm>,
            ],
          },
          content: {
            render: (_, record) => (
              <Space>
                <Badge status="processing" text="正常" />
                <span>
                  在线服务:{' '}
                  <Badge count={record.service_count || 25} color="#faad14" />
                </span>
              </Space>
            ),
          },
          avatar: {},
        }}
        request={async (params) => {
          const { data, pagination } = await NamespaceList(mergeData(params));
          return {
            data: data?.map((item) => ({
              id: item.id,
              alias: item.alias,
              name: item.name,
              avatar:
                'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
            })),
            success: true,
            total: pagination?.total,
          };
        }}
      />
      <ModalForm
        title="命名空间操作"
        open={formVisible}
        modalProps={{
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
        onFinish={async ({ id = 0, ...values }) => {
          const res =
            id > 0
              ? await NamespaceUpdate({ id }, values)
              : await NamespaceCreate(values);

          if (res.data) {
            message.success('操作成功');
            setFormVisible(false);
            return true;
          }

          message.error(`操作失败: ${res?.message || ''}`);
          return false;
        }}
      >
        <ProFormText label="ID" name="id" hidden />
        <ProFormText
          label="唯一名称"
          name="name"
          rules={[{ required: true }]}
        />
        <ProFormText label="展示名称" name="alias" />
        <ProFormTextArea label="描述" name="description" />
      </ModalForm>
    </PageContainer>
  );
};

export default NamespacePage;
