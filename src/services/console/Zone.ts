// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** GetZoneList returns a list of zones. The list is sorted by zone id. GET /api/console/zone */
export async function ZoneGetZoneList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ZoneGetZoneListParams,
  options?: { [key: string]: any },
) {
  return request<API.rpcStatus>('/api/console/zone', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** CreateZone creates a new zone. ... POST /api/console/zone */
export async function ZoneCreateZone(
  body: API.resourceCreateZoneRequest,
  options?: { [key: string]: any },
) {
  return request<API.rpcStatus>('/api/console/zone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** GetZone returns the zone. Query parameter "id" is required.
Example: /api/console/zone/1 GET /api/console/zone/${param0} */
export async function ZoneGetZone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ZoneGetZoneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.rpcStatus>(`/api/console/zone/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** UpdateZone updates the zone. ... PUT /api/console/zone/${param0} */
export async function ZoneUpdateZone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ZoneUpdateZoneParams,
  body: {
    name?: string;
    code?: string;
    region_name?: string;
    region_code?: string;
    env?: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.rpcStatus>(`/api/console/zone/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** DeleteZone deletes the zone. ... DELETE /api/console/zone/${param0} */
export async function ZoneDeleteZone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ZoneDeleteZoneParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.rpcStatus>(`/api/console/zone/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** DisableZone disables the zone. ... POST /api/console/zone/${param0}/disable */
export async function ZoneDisableZone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ZoneDisableZoneParams,
  body: {
    remark?: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.rpcStatus>(`/api/console/zone/${param0}/disable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
