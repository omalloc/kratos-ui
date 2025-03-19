import { formatDuration } from '@/utils/format';
import { AlertOutlined } from '@ant-design/icons';
import { Checkbox, Col, Divider, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import TraceName from './TraceName';
import { useItemStyles, useStyles } from './style';

const DEFAULT_DURATION_PERCENT = 0;

type Props = {
  duration?: number;
  durationPercent?: number;
  traceID: string;
  traceName?: string;
  disableComparision?: boolean;
};

const ResultItemTitle: React.FC<Props> = ({
  disableComparision = false,
  duration,
  durationPercent = DEFAULT_DURATION_PERCENT,
  traceID,
  traceName,
}) => {
  const { styles, cx } = useItemStyles();

  return (
    <div className={styles.container}>
      {!disableComparision && (
        <Checkbox className={cx(styles.item, styles.itemNone)} />
      )}
      <a className={cx(styles.item, styles.itemFlex)}>
        <span
          className={styles.durationBar}
          style={{ width: `${durationPercent || DEFAULT_DURATION_PERCENT}%` }}
        />
        {duration !== null && (
          <span className={styles.duration}>{formatDuration(duration!)}</span>
        )}
        <h3 className={styles.title}>
          <TraceName name={traceName} />
          <small className={styles.idExcerpt}>{traceID.slice(0, 7)}</small>
        </h3>
      </a>
    </div>
  );
};

const ResultItem: React.FC = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.resultItem}>
      <ResultItemTitle
        duration={19000}
        traceID={'83f85c617e3e15e1d193834c502a7db2'}
      />
      <a href="/tracing/trace/83f85c617e3e15e1d193834c502a7db2">
        <Row>
          <Col span={4} className={styles.p2}>
            <Tag>2 Spans</Tag> <Tag>1 Error</Tag>
          </Col>
          <Col span={16} className={styles.p2}>
            <Tag className={styles.serviceTag}>
              <AlertOutlined className={styles.errorIcon} />
              AppName 2
            </Tag>
          </Col>
          <Col span={4} className={styles.p3}>
            Today
            <Divider type="vertical" />
            {dayjs().format('HH:mm:ssZ')}
            <br />
            {dayjs().add(1).fromNow()}
          </Col>
        </Row>
      </a>
    </div>
  );
};

export default ResultItem;
