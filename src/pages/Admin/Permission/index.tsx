import {
  ModalForm,
  PageContainer,
  ProFormCheckbox,
  ProFormGroup,
  ProFormList,
  ProFormText,
  ProFormTextArea,
  ProTable,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { useState } from 'react';

interface Action {
  name: string;
  describe?: string;
  checked: boolean;
}

interface Permission {
  id: number;
  name: string;
  describe: string;
  actions: Action[];
}

const defActions: Action[] = [
  {
    name: 'GET',
    describe: '查询',
    checked: false,
  },
  {
    name: 'ADD',
    describe: '新增',
    checked: false,
  },
  {
    name: 'UPDATE',
    describe: '更新',
    checked: false,
  },
  {
    name: 'DELETE',
    describe: '删除',
    checked: false,
  },
];

const initialPermissions: Permission[] = [
  {
    id: 1,
    name: 'user',
    describe: 'Allows managing users',
    actions: [
      {
        name: 'GET',
        describe: '查询',
        checked: true,
      },
      {
        name: 'ADD',
        describe: '新增',
        checked: false,
      },
      {
        name: 'UPDATE',
        describe: '更新',
        checked: false,
      },
      {
        name: 'DELETE',
        describe: '删除',
        checked: false,
      },
    ],
  },
  {
    id: 2,
    name: 'role',
    describe: 'Allows managing roles',
    actions: [
      {
        name: 'GET',
        describe: '查询',
        checked: true,
      },
      {
        name: 'ADD',
        describe: '新增',
        checked: false,
      },
      {
        name: 'UPDATE',
        describe: '更新',
        checked: false,
      },
      {
        name: 'DELETE',
        describe: '删除',
        checked: false,
      },
    ],
  },
];

const PermissionPage: React.FC = () => {
  const [editing, setEditing] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<Permission | undefined>();

  const handleAdd = () => {
    setEditing(false);
    setVisible(true);
    setFormData(undefined);
  };
  const handleEdit = (record: Permission) => {
    setEditing(true);
    setVisible(true);
    setFormData(record);
  };
  const handleCancel = () => {
    setVisible(false);
    setEditing(false);
    setFormData(undefined);
  };
  const columns: ProColumns<Permission>[] = [
    { dataIndex: 'name', title: '权限模块名称', width: 150 },
    { dataIndex: 'describe', title: '描述', width: 300 },
    {
      dataIndex: 'actions',
      title: '操作权限',
      hideInSearch: true,
      render: (_, { actions }) => (
        <div>
          {actions.map((item) => (
            <Tag key={item.name}>{item.name}</Tag>
          ))}
        </div>
      ),
    },
    {
      key: 'option',
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Permission>
        columns={columns}
        dataSource={initialPermissions}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={handleAdd}>
            新增权限
          </Button>,
        ]}
      />

      <ModalForm
        title={editing ? '编辑权限' : '新增权限'}
        open={visible}
        modalProps={{
          destroyOnClose: true,
          onCancel: handleCancel,
        }}
        request={async () => {
          return {
            ...formData,
            actions: formData?.actions || [...defActions],
          };
        }}
        onFinish={async (values) => {
          console.log('form values', values);
        }}
      >
        <ProFormText name="id" hidden />
        <ProFormText name="name" label="权限名称" />
        <ProFormTextArea name="describe" label="描述" />
        <ProFormList name="actions" label="授权动作">
          <ProFormGroup>
            <ProFormText name="name" label="动作" width={120} />
            <ProFormText name="describe" label="描述" width={150} />
            <ProFormCheckbox name="checked" label="默认选中" width={70} />
          </ProFormGroup>
        </ProFormList>
      </ModalForm>
    </PageContainer>
  );
};

export default PermissionPage;
