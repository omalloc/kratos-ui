declare namespace API {
  type protobufAny = {
    '@type'?: string;
  };

  type resourceCreateZoneReply = {
    data?: resourceZoneInfo;
  };

  type resourceCreateZoneRequest = {
    /** 可用区名称 */
    name?: string;
    /** 可用区代码 */
    code?: string;
    /** 地区名称 */
    region_name?: string;
    /** 地区代码 */
    region_code?: string;
    /** 环境 */
    env?: string;
  };

  type resourceDeleteZoneReply = true;

  type resourceDisableZoneReply = true;

  type resourceGetZoneListReply = {
    /** 可用区列表 */
    data?: resourceZoneInfo[];
    /** 总数 */
    total?: number;
  };

  type resourceGetZoneReply = {
    data?: resourceZoneInfo;
  };

  type resourceOrderBy = {
    /** 排序字段 */
    field?: string;
    /** 排序方式 asc: 升序 desc: 降序 */
    order?: string;
  };

  type resourceUpdateZoneReply = true;

  type resourceZoneInfo = {
    /** 可用区ID */
    id?: number;
    /** 可用区名称 */
    name?: string;
    /** 可用区代码 */
    code?: string;
    /** 地区名称 */
    region_name?: string;
    /** 地区代码 */
    region_code?: string;
    /** 环境 */
    env?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
  };

  type rpcStatus = {
    code?: number;
    message?: string;
    details?: protobufAny[];
  };

  type ZoneDeleteZoneParams = {
    id: number;
  };

  type ZoneDisableZoneParams = {
    /** 可用区ID */
    id: number;
  };

  type ZoneGetZoneListParams = {
    /** 页码 */
    current?: number;
    /** 每页数量 */
    page_size?: number;
  };

  type ZoneGetZoneParams = {
    /** 可用区ID */
    id: number;
  };

  type ZoneUpdateZoneParams = {
    id: number;
  };
}
