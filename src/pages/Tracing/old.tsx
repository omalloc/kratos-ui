import { getOperations, getServices } from '@/services/tracing';
import {
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useStyles } from './style';

const lookbackOptions = [
  {
    label: '5 Minutes',
    value: '5m',
  },
  {
    label: '15 Minutes',
    value: '15m',
  },
  {
    label: '30 Minutes',
    value: '30m',
  },
  {
    label: 'Hour',
    value: '1h',
  },
  {
    label: '2 Hours',
    value: '2h',
  },
  {
    label: '3 Hours',
    value: '3h',
  },
  {
    label: '6 Hours',
    value: '6h',
  },
  {
    label: '12 Hours',
    value: '12h',
  },
  {
    label: '24 Hours',
    value: '24h',
  },
  {
    label: '2 Days',
    value: '2d',
  },
  {
    label: '3 Days',
    value: '3d',
  },
  {
    label: '5 Days',
    value: '5d',
  },
  {
    label: '7 Days',
    value: '7d',
  },
  {
    label: '2 Weeks',
    value: '2w',
  },
  {
    label: '3 Weeks',
    value: '3w',
  },
  {
    label: '4 Weeks',
    value: '4w',
  },
];

const SearchPlan: React.FC<{
  onFinish: (formData: any) => Promise<boolean | void>;
  onReset: (e: any) => Promise<void>;
}> = ({ onFinish, onReset }) => {
  return (
    <ProForm
      onFinish={onFinish}
      initialValues={{
        lookback: '1h',
        operation: '',
      }}
      onReset={onReset}
      submitter={{
        searchConfig: {
          resetText: 'Reset',
          submitText: 'Find Traces',
        },
      }}
    >
      <ProFormSelect name="service" label="Service" request={getServices} />
      <ProFormDependency name={['service']}>
        {({ service }) => {
          return (
            <ProFormSelect
              name="operation"
              label="Operation"
              params={{ serviceName: service }}
              request={async () => {
                return getOperations({ serviceName: service, allowAll: true });
              }}
            />
          );
        }}
      </ProFormDependency>
      <ProFormSelect
        name="lookback"
        label="Lookback"
        options={lookbackOptions}
      />
      <ProFormText name="tags" label="Tags" />
    </ProForm>
  );
};

const TracingPage: React.FC = () => {
  const { styles } = useStyles();
  const [searchParams, setSearchParams] = useState('');
  const [showTrace, setShowTrace] = useState(false);

  return (
    <PageContainer>
      <Card style={{ minHeight: '700px' }}>
        <Row gutter={24} className={styles.searchTracePageRow}>
          <Col span={5}>
            <SearchPlan
              onFinish={async (values) => {
                const formData = {
                  start: dayjs().subtract(1, 'hour').valueOf() * 1000,
                  end: dayjs().valueOf() * 1000,
                  limit: 20,
                  lookback: '1h',
                  service: values.service,
                  minDuration: '',
                  maxDuration: '',
                };
                console.log('formData', formData);

                const url = new URL(
                  `${window.location.protocol}//${window.location.host}/aio/tracer/search`,
                );
                url.searchParams.append('uiEmbed', 'v0');
                if (values.operation) {
                  url.searchParams.append('operation', values.operation);
                }
                Object.entries(formData).forEach(([key, value]) => {
                  url.searchParams.append(key, value);
                });

                setSearchParams(url.toString());
                setShowTrace(true);
              }}
              onReset={async () => {
                setShowTrace(false);
              }}
            />
          </Col>

          <Col span={19}>
            {showTrace ? (
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  paddingTop: '56.25%',
                }}
              >
                <iframe
                  style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  src={searchParams}
                ></iframe>
              </div>
            ) : (
              <img
                style={{ marginLeft: '100px' }}
                src="http://127.0.0.1:16686/static/jaeger-logo-ab11f618.svg"
              />
            )}
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default TracingPage;
