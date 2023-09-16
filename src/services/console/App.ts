// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/console/app */
export async function AppList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.AppListParams,
  options?: { [key: string]: any },
) {
  return request<API.AppListReply>('/api/console/app', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/console/app/${param0} */
export async function AppGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.AppGetParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.AppGetReply>(`/api/console/app/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
