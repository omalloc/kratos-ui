import services from '@/services/console';
import { PageContainer } from '@ant-design/pro-components';
import { json } from '@codemirror/lang-json';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import { Col, Row, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useCallback, useEffect, useState } from 'react';

const { DiscoveryKVListKeys, DiscoveryKVGetValue } = services.Discovery;

const EtcdPage: React.FC = () => {
  const [value, setValue] = useState('{"name":"codemirror"}');
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

  const loadData = async () => {
    const res = await DiscoveryKVListKeys({ cluster: 'xm-01' });
    setTreeData(res.keys!.map((item) => ({ title: item, key: item })));
  };

  const loadValue = async (key: string) => {
    const res = await DiscoveryKVGetValue({
      cluster: 'xm-01',
      key: key,
    });

    setValue(res.value || '');
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer>
      <Row gutter={12}>
        <Col span={8}>
          <Tree
            treeData={treeData}
            onSelect={(selectedKeys) => {
              console.log('selectedKeys:', selectedKeys);
              loadValue(selectedKeys[0]);
            }}
            blockNode
            style={{ height: 600, overflow: 'auto' }}
          />
        </Col>
        <Col span={16}>
          <CodeMirror
            theme={githubLight}
            value={value}
            height="600px"
            extensions={[json()]}
            onChange={onChange}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default EtcdPage;
