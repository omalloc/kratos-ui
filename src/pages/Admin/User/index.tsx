import {
  PageContainer,
  ProTable,
  type ProColumns,
} from '@ant-design/pro-components';

const UserPage: React.FC = () => {
  const columns: ProColumns[] = [];
  return (
    <PageContainer>
      <ProTable />
    </PageContainer>
  );
};

export default UserPage;
