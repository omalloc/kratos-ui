import ResultItem from './ResultItem';
import { useResultStyles } from './style';

const UnconnectedSearchResults: React.FC<any> = (props) => {
  const { styles } = useResultStyles();

  return (
    <div className="SearchResults">
      <div></div>
      <ul className={styles.reset}>
        <li className={styles.mr3}>
          <ResultItem />
        </li>
      </ul>
    </div>
  );
};

export default UnconnectedSearchResults;
