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
  type ActionType,
  type FormListActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { App, Button, Space, Typography } from 'antd';
import { useRef, useState } from 'react';

const { Text, Paragraph } = Typography;

const { AppList, AppCreate, AppUpdate } = services.App;

// 应用类型(1-系统应用,2-WEB应用,3-API应用,4-子服务,0,5-未定义)
const appType = {
  '1': '系统应用',
  '2': 'WEB应用',
  '3': 'API应用',
  '4': '子服务',
  '5': '未定义',
};

const AppPage: React.FC = () => {
  const { message } = App.useApp();
  const { data: namespaceData, idMap: namespaceMap } = useModel('namespace');
  const actionRef = useRef<ActionType>();
  const listActionRef = useRef<FormListActionType<ProtocolSelectValue>>();
  const [formVisible, setFormVisible] = useState(false);
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
    { dataIndex: 'namespace_id', title: '命名空间', valueEnum: namespaceMap },
    {
      dataIndex: 'description',
      title: '应用描述',
      width: 300,
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
            }}
          >
            新建
          </Button>,
        ]}
      />
      <ModalForm
        grid={true}
        rowProps={{
          gutter: [16, 0],
        }}
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

          const res =
            values.id > 0
              ? await AppUpdate({ id: values.id }, values)
              : await AppCreate(values);
          if (res.data) {
            message.success('操作成功');
            actionRef.current?.reload();
            return true;
          }

          message.error('操作失败');
          return false;
        }}
      >
        <ProFormText label="应用ID" name="id" hidden />
        <ProFormText
          label="应用唯一名(英文)"
          name="name"
          required
          colProps={{ md: 12, xl: 12 }}
        />
        <ProFormText
          label="应用名称"
          name="alias"
          colProps={{ md: 12, xl: 12 }}
        />
        <ProFormSelect
          label="命名空间"
          name="namespace_id"
          options={namespaceData.map((item) => ({
            label: `${item.alias} (${item.name})`,
            value: item.name,
          }))}
          rules={[{ required: true }]}
        />
        <ProFormTextArea label="应用描述" name="description" />
        <ProFormGroup>
          <ProFormSelect
            label="应用类型"
            name="type"
            valueEnum={appType}
            colProps={{ md: 8, xl: 8 }}
            required
            transform={(value, name) => ({ [name]: Number.parseInt(value) })}
          />
          <ProFormSelect
            label="应用负责人"
            mode="multiple"
            name="users"
            valueEnum={{ '0': '管理员' }}
            colProps={{ md: 16, xl: 16 }}
          />
          <ProFormText
            label="应用仓库 Git"
            name="repos"
            transform={(value, name) => ({ [name]: value.split(',') })}
          />
        </ProFormGroup>
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
              options={[
                { label: 'HTTP', value: 1 },
                { label: 'gRPC', value: 2 },
              ]}
              placeholder="协议"
              colProps={{ md: 6 }}
            />
            <ProFormDigit colProps={{ md: 6 }} name="port" placeholder="端口" />
            <ProFormText
              colProps={{ md: 12 }}
              name="remark"
              placeholder="协议,端口 备注信息"
            />
          </ProFormGroup>
        </ProFormList>
      </ModalForm>
    </PageContainer>
  );
};

export default AppPage;
