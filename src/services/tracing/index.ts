// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function getServices() {
  return request('/api/traces/services').then((res) => {
    return res?.data.map((k: any) => ({ label: k, value: k }));
  });
}

export async function getOperations({
  serviceName = 'default',
  allowAll = false,
}) {
  return request(`/api/traces/services/${serviceName}/operations`).then(
    (res) => {
      const data = res?.data.map((k: any) => ({ label: k, value: k })) || [];
      if (allowAll) {
        return [{ label: 'All', value: '' }, ...data];
      }
      return data;
    },
  );
}

export async function getTraces(params: {
  start: number;
  end: number;
  service: string;
  operation?: string;
  tags?: string;
  lookback: string;
  limit: number;
}) {
  return request('/api/traces/traces', {
    params,
  }).then((res) => {
    return res?.data;
  });
}
