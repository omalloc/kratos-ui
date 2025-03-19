export type TraceNameProps = {
  name?: string;
};

const TraceName: React.FC<TraceNameProps> = (props) => {
  return (
    <span className="traceName">
      {props.name || 'kratos-console: /cron/sync.agent.discovery/Services'}
    </span>
  );
};

export default TraceName;
