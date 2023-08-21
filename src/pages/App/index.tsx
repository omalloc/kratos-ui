import {
  PageContainer,
  ProTable,
  type ProColumns,
} from '@ant-design/pro-components';
import { Tag } from 'antd';

const columns: ProColumns<{
  key: number;
  name: string;
  dataCenter?: string[];
}>[] = [
  {
    dataIndex: 'key',
    title: 'ID',
    copyable: true,
  },
  {
    dataIndex: 'name',
    title: '应用名称',
  },
  {
    dataIndex: 'dataCenter',
    title: '可用区',
    render: (_, { dataCenter }) =>
      dataCenter?.map((item) => <Tag key={item}>{item}</Tag>),
  },
];

const HomePage: React.FC = () => {
  const dataSource = [
    {
      key: 10001,
      name: 'Service-Agent',
      dataCenter: ['杭州', '上海', '北京'],
    },
    {
      key: 10002,
      name: 'Open-Api',
      dataCenter: ['上海', '北京'],
    },
  ];

  return (
    <PageContainer>
      <ProTable columns={columns} dataSource={dataSource}></ProTable>
    </PageContainer>
  );
};

export default HomePage;
