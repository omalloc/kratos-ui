import { type ProtocolSelectValue } from '@/components/ProtocolSelect';
import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
  type FormListActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';

const { AppList } = services.App;

const AppPage: React.FC = () => {
  const listActionRef = useRef<FormListActionType<ProtocolSelectValue>>();
  const [formVisible, setFormVisible] = useState(false);
  const columns: ProColumns<API.AppInfo>[] = [
    {
      dataIndex: 'name',
      title: '应用名称',
      width: 260,
      ellipsis: true,
      render: (dom) => <strong>{dom}</strong>,
    },
    {
      dataIndex: 'description',
      title: '应用描述',
      width: 400,
      ellipsis: true,
    },
    {
      dataIndex: 'ports',
      title: '服务端口(预期)',
      hideInSearch: true,
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
            }}
          >
            新建
          </Button>,
        ]}
      />
      <ModalForm
        title="应用配置"
        open={formVisible}
        autoFocusFirstInput
        initialValues={{
          ports: [
            {
              port: 8000,
              protocol: 1,
              remark: 'HTTP',
            },
            {
              port: 9000,
              protocol: 2,
              remark: 'gRPC',
            },
          ],
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setFormVisible(false);
          },
        }}
        onFinish={async (values) => {
          console.log('onFinish', values);
        }}
      >
        <ProFormText label="应用唯一名(英文)" name="name" required />
        <ProFormText label="应用名称" name="alias" />
        <ProFormTextArea label="应用描述" name="description" />
        <ProFormList
          required
          label="服务端口(预期)"
          style={{ width: '500px' }}
          name="ports"
          creatorButtonProps={{ position: 'bottom' }}
          actionRef={listActionRef}
        >
          <ProFormGroup size="small">
            <ProFormSelect
              required
              name="protocol"
              style={{ width: 80 }}
              options={[
                { label: 'HTTP', value: 1 },
                { label: 'gRPC', value: 2 },
              ]}
              placeholder="协议"
            />
            <ProFormDigit width={80} name="port" placeholder="端口" />
            <ProFormText name="remark" placeholder="协议,端口 备注信息" />
          </ProFormGroup>
        </ProFormList>
      </ModalForm>
    </PageContainer>
  );
};

export default AppPage;
