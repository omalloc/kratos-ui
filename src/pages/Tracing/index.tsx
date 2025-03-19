import {
  getServiceOperations,
  getServices,
  getTraces,
  type Service,
} from '@/services/tracing';
import { formatDate, formatTime } from '@/utils/format';
import {
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, Col, Row, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import SearchResults from './SearchResults';
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

export function lookbackToTimestamp(lookback: string, from: Date) {
  const unit = lookback.substr(-1);
  return dayjs(from).subtract(parseInt(lookback, 10), unit).valueOf() * 1000;
}

export function getUnixTimeStampInMSFromForm({
  startDate,
  startDateTime,
  endDate,
  endDateTime,
}: {
  [key: string]: string;
}) {
  const start = `${startDate} ${startDateTime}`;
  const end = `${endDate} ${endDateTime}`;
  return {
    start: `${dayjs(start, 'YYYY-MM-DD HH:mm').valueOf()}000`,
    end: `${dayjs(end, 'YYYY-MM-DD HH:mm').valueOf()}000`,
  };
}

export function convertQueryParamsToFormDates({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  let queryStartDate;
  let queryStartDateTime;
  let queryEndDate;
  let queryEndDateTime;
  if (end) {
    const endUnixNs = parseInt(end, 10);
    queryEndDate = formatDate(endUnixNs);
    queryEndDateTime = formatTime(endUnixNs);
  }
  if (start) {
    const startUnixNs = parseInt(start, 10);
    queryStartDate = formatDate(startUnixNs);
    queryStartDateTime = formatTime(startUnixNs);
  }

  return {
    queryStartDate,
    queryStartDateTime,
    queryEndDate,
    queryEndDateTime,
  };
}

type SearchFormProps = {
  onFinish: (formData: any) => Promise<boolean | void>;
  onReset: (e: any) => Promise<void>;
  invalid?: boolean;
  submitting?: boolean;
  searchMaxLookback?: { label: string; value: string };
  services: Array<{ label: string; value: string }>;
  selectedService?: string;
  selectedLookback?: string;
};

const SearchForm: React.FC<SearchFormProps> = ({
  onFinish,
  onReset,
  invalid,
  searchMaxLookback,
  selectedLookback,
  selectedService = '-',
  services,
  submitting: disabled,
}) => {
  const now = new Date();
  const minTimestamp = lookbackToTimestamp('2w', now);
  const options = lookbackOptions.filter(({ value }) => {
    const lookbackTimestamp = lookbackToTimestamp(value, now);
    return lookbackTimestamp >= minTimestamp;
  });
  const tz =
    selectedLookback === 'custom'
      ? new Date().toTimeString().replace(/^.*?GMT/, 'UTC')
      : null;

  return (
    <ProForm
      onFinish={onFinish}
      onReset={onReset}
      initialValues={{
        lookback: '1h',
        operation: '',
      }}
      submitter={{
        searchConfig: {
          resetText: 'Reset',
          submitText: 'Find Traces',
        },
      }}
    >
      <ProFormSelect
        name="service"
        label={
          <span>
            Service <span>({services.length})</span>
          </span>
        }
        options={services}
      />
      <ProFormDependency name={['service']}>
        {({ service }) => {
          return (
            <ProFormSelect
              name="operation"
              label="Operation"
              params={{ service }}
              request={async (params) => {
                console.log('params', params);
                return getServiceOperations(params.service);
              }}
            />
          );
        }}
      </ProFormDependency>
      <ProFormSelect name="lookback" label="Lookback" options={options} />
      <ProFormText name="tags" label="Tags" />
    </ProForm>
  );
};

const TracingPage: React.FC = () => {
  const { styles } = useStyles();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((res) => {
      console.log('res', res);
      setServices(res);
    });
  }, []);

  return (
    <PageContainer>
      <Card style={{ minHeight: '700px' }}>
        <Row gutter={24} className={styles.searchTracePageRow}>
          <Col span={6} className={styles.searchTracePageColumn}>
            <div className={styles.searchTracePageFind}>
              <Tabs
                size="large"
                items={[
                  {
                    label: 'Search',
                    key: 'searchForm',
                    children: (
                      <SearchForm
                        services={services}
                        onFinish={async (values) => {
                          console.log('onFinish.values', values);

                          const now = new Date();
                          const start = lookbackToTimestamp(
                            values.lookback,
                            now,
                          );
                          const end = now * 1000;

                          const formData = {
                            start: start,
                            end: end,
                            limit: 20,
                            lookback: values.lookback,
                            service: values.service,
                            minDuration: '',
                            maxDuration: '',
                          };
                          console.log('onFinish.formData', formData);

                          const res = await getTraces(formData);
                          console.log('res', res);
                        }}
                      />
                    ),
                  },
                  {
                    label: 'Upload',
                    key: 'fileLoader',
                  },
                ]}
              />
            </div>
          </Col>

          <Col span={18}>
            <SearchResults />
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default TracingPage;
