// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/console/namespace */
export async function NamespaceList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.NamespaceListParams,
  options?: { [key: string]: any },
) {
  return request<API.ListReply>('/api/console/namespace', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/console/namespace */
export async function NamespaceCreate(body: API.CreateRequest, options?: { [key: string]: any }) {
  return request<API.CreateReply>('/api/console/namespace', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/console/namespace/${param0} */
export async function NamespaceGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.NamespaceGetParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.GetReply>(`/api/console/namespace/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/console/namespace/${param0} */
export async function NamespaceUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.NamespaceUpdateParams,
  body: API.UpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.UpdateReply>(`/api/console/namespace/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/console/namespace/${param0} */
export async function NamespaceDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.NamespaceDeleteParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DeleteReply>(`/api/console/namespace/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
