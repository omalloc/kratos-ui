import services from '@/services/console';
import { mergeData } from '@/utils/pagination';
import {
  ModalForm,
  PageContainer,
  ProList,
  type ProColumns,
} from '@ant-design/pro-components';
import { Popconfirm, Tag } from 'antd';
import { useState } from 'react';

const { NamespaceList } = services.Namespace;

const NamespacePage: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<API.NamespaceInfo>({});
  const columns: ProColumns<any>[] = [{ dataIndex: 'name', title: '命名空间' }];

  return (
    <PageContainer>
      <ProList<API.NamespaceInfo>
        showActions="hover"
        grid={{ gutter: 16, column: 3 }}
        itemCardProps={{
          ghost: true,
        }}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
        metas={{
          title: {
            dataIndex: 'alias',
          },
          subTitle: {
            dataIndex: 'name',
            render: (dom) => <Tag color="#5BD8A6">{dom}</Tag>,
          },
          actions: {
            render: (_, entity) => [
              <a key="run">查看</a>,
              <Popconfirm
                key="delete"
                placement="topRight"
                title="删除命名空间"
                description="删除命令空间会导致命名空间下的所有服务无法被发现"
              >
                <a>删除</a>
              </Popconfirm>,
            ],
          },
          avatar: {},
        }}
        request={async (params) => {
          const { data, pagination } = await NamespaceList(mergeData(params));
          return {
            data: data?.map((item) => ({
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
        request={async () => {
          return {
            ...formData,
          };
        }}
      />
    </PageContainer>
  );
};

export default NamespacePage;
