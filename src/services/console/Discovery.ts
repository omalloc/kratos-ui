// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/console/discovery/services/-/online */
export async function DiscoveryOnlineServices(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DiscoveryOnlineServicesParams,
  options?: { [key: string]: any },
) {
  return request<API.OnlineServiceReply>('/api/console/discovery/services/-/online', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
