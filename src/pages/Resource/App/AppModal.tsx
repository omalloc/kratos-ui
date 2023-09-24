import { type ProtocolSelectValue } from '@/components/ProtocolSelect';
import services from '@/services/console';
import {
  ModalForm,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  type FormListActionType,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { App } from 'antd';
import { useRef } from 'react';

const { AppCreate, AppUpdate } = services.App;

// 应用类型(1-系统应用,2-WEB应用,3-API应用,4-子服务,0,5-未定义)
const appType = {
  '1': '系统应用',
  '2': 'WEB应用',
  '3': 'API应用',
  '4': '子服务',
  '5': '未定义',
};

const AppModal: React.FC<{
  open: boolean;
  formData?: API.AppInfo;
  onCancel?: () => void;
  onOk?: () => void;
}> = ({
  open = false,
  formData = {},
  onCancel = () => {},
  onOk = () => {},
}) => {
  const listActionRef = useRef<FormListActionType<ProtocolSelectValue>>();
  const { message } = App.useApp();
  const { data: namespaceData } = useModel('namespace');

  return (
    <ModalForm
      grid={true}
      rowProps={{
        gutter: [16, 0],
      }}
      title="应用配置"
      open={open}
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
      request={async () => {
        return {
          ...formData,
        };
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      onFinish={async (values) => {
        console.log('onFinish', values);

        const res =
          values.id > 0
            ? await AppUpdate({ id: values.id }, values)
            : await AppCreate(values);
        if (res.data) {
          message.success('操作成功');
          onOk();
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
  );
};

export { AppModal, appType, AppModal as default };
