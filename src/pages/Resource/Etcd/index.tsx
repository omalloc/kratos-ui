import type { DataNode } from 'antd/es/tree';

import services from '@/services/console';
import { PageContainer } from '@ant-design/pro-components';
import { json } from '@codemirror/lang-json';
import { githubLightInit } from '@uiw/codemirror-theme-github';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { Col, Row, Select, Tree, theme } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const { getDesignToken } = theme;
const globalToken = getDesignToken();

const styleTheme = EditorView.baseTheme({
  '&.cm-editor.cm-focused': {
    outline: `1px solid ${globalToken.colorPrimaryBorder}`,
  },
  '&.cm-editor': {
    'border-radius': '6px',
    overflow: 'hidden',
  },
});

type Data = {
  title: string;
  key: string;
  children?: Data[];
};

const buildTreeData = (rawData: string[]): Data[] => {
  const data: Data[] = [];

  for (const path of rawData) {
    const parts = path.split('/');
    let currentLevel = data;

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];

      let existingPath: Data | undefined = currentLevel.find(
        (d) => d.title === part,
      );

      if (!existingPath) {
        const newPart: Data = {
          title: part,
          key: parts.slice(0, i + 1).join('/'),
          children: [],
        };
        currentLevel.push(newPart);
        existingPath = newPart;
      }

      currentLevel = existingPath.children!;
    }
  }

  return data;
};

const { DiscoveryKVListClusters, DiscoveryKVListKeys, DiscoveryKVGetValue } =
  services.Discovery;

const EtcdPage: React.FC = () => {
  const [value, setValue] = useState<string | undefined>();
  const [clusters, setClusters] = useState<string[]>([]); // ['xm-01', 'xm-02']
  const [currentCluster, setCurrentCluster] = useState<string | undefined>(); // 'xm-01'
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

  const loadClusters = async () => {
    const { clusters = [] } = await DiscoveryKVListClusters();
    setClusters(clusters);
  };

  const loadData = async (cluster: string) => {
    const { keys = [] } = await DiscoveryKVListKeys({ cluster });
    setTreeData(buildTreeData(keys));
  };

  const loadValue = async (key: string) => {
    const res = await DiscoveryKVGetValue({
      cluster: 'xm-01',
      key: key,
    });

    try {
      setValue(JSON.stringify(JSON.parse(res.value || ''), null, 2));
    } catch {}
  };

  useEffect(() => {
    loadData(currentCluster!);
  }, [currentCluster]);

  useEffect(() => {
    loadClusters();
  }, []);

  return (
    <PageContainer>
      <Row style={{ margin: '12px 0' }}>
        <Col span={24}>
          <Select
            style={{ width: '100%' }}
            placeholder="选择集群"
            options={clusters.map((item) => ({
              label: `集群: ${item}`,
              value: item,
            }))}
            onChange={(value) => {
              setCurrentCluster(value);
            }}
          />
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          <Tree
            treeData={treeData}
            onSelect={(selectedKeys) => {
              console.log('selectedKeys', selectedKeys);
              if (selectedKeys.length === 0) return;
              loadValue(selectedKeys[0].toString());
            }}
            blockNode
            style={{ height: 600, overflow: 'auto' }}
          />
        </Col>
        <Col span={16}>
          <CodeMirror
            theme={githubLightInit({
              settings: {
                fontFamily: 'Menlo, Consolas, monospace',
              },
            })}
            value={value}
            height="600px"
            extensions={[styleTheme, json()]}
            onChange={onChange}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default EtcdPage;
