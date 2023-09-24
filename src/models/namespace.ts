import services from '@/services/console';
import { useLayoutEffect, useMemo, useState } from 'react';

const { NamespaceSimpleList } = services.Namespace;

const useNamespaceModel = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.NamespaceSimple[]>([]);
  const idMap = useMemo(() => {
    return data.reduce(
      (pre, cur) => {
        if (cur.id) {
          pre[cur?.id] = `${cur.alias} (${cur.name})`;
        }
        return pre;
      },
      {} as Record<number, string>,
    );
  }, [data]);
  const nameMap = useMemo(
    () =>
      data.reduce(
        (pre, cur) => {
          if (cur.name) {
            pre[cur.name] = cur.alias || '';
          }
          return pre;
        },
        {} as Record<string, string>,
      ),
    [data],
  );
  const namespaceMap = useMemo(
    () =>
      data.reduce(
        (agg, next) => {
          if (next.id) {
            agg[next.id] = next;
          }
          return agg;
        },
        {} as Record<string, API.NamespaceSimple>,
      ),
    [data],
  );

  const refresh = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { data = [] } = await NamespaceSimpleList();
      setData(data);
    } finally {
      setLoading(false);
    }
    return;
  };

  useLayoutEffect(() => {
    refresh();
  }, []);

  return {
    data,
    idMap,
    nameMap,
    namespaceMap,
    loading,
    refresh,
  };
};

export default useNamespaceModel;
