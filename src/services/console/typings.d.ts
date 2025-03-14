declare namespace API {
  type Agent = {
    /** 部署状态 */
    type?: number;
    /** 上次心跳时间 */
    heartbeat_time?: string;
    /** Agent版本 */
    version?: string;
  };

  type AppCreateReply = {
    data?: AppInfo;
  };

  type AppDeleteParams = {
    id: string;
  };

  type AppDeleteReply = {};

  type AppGetParams = {
    id: string;
  };

  type AppGetReply = {
    data?: AppInfo;
  };

  type AppInfo = {
    /** 唯一键 */
    id?: string;
    /** 应用名称 */
    name?: string;
    /** 应用别名 */
    alias?: string;
    /** 应用描述 */
    description?: string;
    /** 应用图标 */
    icon?: string;
    /** 应用端口 */
    ports?: AppInfoAppPort[];
    /** 应用类型 */
    type?: number;
    /** 命名空间id */
    namespace_id?: string;
    /** 应用负责人 */
    users?: string[];
    /** 应用仓库 */
    repos?: string[];
    /** 创建时间 */
    created_at?: string;
    /** 修改时间 */
    updated_at?: string;
  };

  type AppInfoAppPort = {
    /** 端口 0代表随机端口 */
    port?: number;
    /** 协议 */
    protocol?: number;
    /** 备注 */
    remark?: string;
  };

  type AppListParams = {
    'pagination.current'?: number;
    'pagination.page_size'?: number;
    'pagination.total'?: number;
    'pagination.raw_total'?: string;
    /** 命名空间ID */
    namespace_id?: string;
    /** 应用名称 */
    name?: string;
  };

  type AppListReply = {
    pagination?: Pagination;
    data?: AppInfo[];
  };

  type AppNamespaceAppListParams = {
    name?: string;
  };

  type AppUpdateParams = {
    id: string;
  };

  type AppUpdateReply = {
    data?: AppInfo;
  };

  type AppUpdateRequest = {
    id?: string;
  };

  type CreateNodeReply = {
    data?: NodeInfo;
  };

  type CreateNodeRequest = {
    /** 节点名称 */
    name?: string;
    /** 节点IP */
    ip?: string;
    /** Agent自动上报开关 */
    auto_detect?: boolean;
    /** 可用区ID */
    zone_id?: number;
    /** 环境变量 */
    env?: string;
  };

  type CreateZoneReply = {
    /** 可用区 */
    data?: ZoneInfo;
  };

  type CreateZoneRequest = {
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

  type DeleteZoneReply = {};

  type DisableZoneReply = {};

  type DisableZoneRequest = {
    /** 可用区ID */
    id?: number;
    /** 备注 */
    remark?: string;
  };

  type DiscoveryKVGetValueParams = {
    key?: string;
    cluster?: string;
  };

  type DiscoveryKVListKeysParams = {
    cluster?: string;
  };

  type DiscoveryKVUpdateHangParams = {
    id: string;
  };

  type DiscoveryOnlineServicesParams = {
    'pagination.current'?: number;
    'pagination.page_size'?: number;
    'pagination.total'?: number;
    'pagination.raw_total'?: string;
    /** service name */
    name?: string;
  };

  type GetZoneListReply = {
    pagination?: Pagination;
    /** 可用区列表 */
    data?: ZoneInfo[];
  };

  type GetZoneReply = {
    /** 可用区 */
    data?: ZoneInfo;
  };

  type KVGetValueReply = {
    value?: string;
  };

  type KVListClustersReply = {
    clusters?: string[];
  };

  type KVListKeysReply = {
    keys?: string[];
  };

  type KVUpdateHangReply = {};

  type KVUpdateHangRequest = {
    id?: string;
    hang?: boolean;
  };

  type NamespaceApp = {
    id?: string;
    name?: string;
    alias?: string;
    type?: number;
    namespace_id?: string;
    namespace_name?: string;
    namespace_alias?: string;
  };

  type NamespaceAppListReply = {
    data?: NamespaceApp[];
  };

  type NamespaceCreateReply = {
    data?: NamespaceInfo;
  };

  type NamespaceCreateRequest = {
    name?: string;
    alias?: string;
    description?: string;
  };

  type NamespaceDeleteParams = {
    id: string;
  };

  type NamespaceDeleteReply = {};

  type NamespaceGetParams = {
    id: string;
  };

  type NamespaceGetReply = {
    data?: NamespaceInfo;
  };

  type NamespaceInfo = {
    id?: string;
    name?: string;
    alias?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    running?: number;
  };

  type NamespaceListParams = {
    'pagination.current'?: number;
    'pagination.page_size'?: number;
    'pagination.total'?: number;
    'pagination.raw_total'?: string;
    name?: string;
  };

  type NamespaceListReply = {
    pagination?: Pagination;
    data?: NamespaceInfo[];
  };

  type NamespaceSimple = {
    id?: string;
    name?: string;
    alias?: string;
  };

  type NamespaceSimpleListReply = {
    data?: NamespaceSimple[];
  };

  type NamespaceUpdateParams = {
    id: string;
  };

  type NamespaceUpdateReply = {
    data?: NamespaceInfo;
  };

  type NamespaceUpdateRequest = {
    id?: string;
    name?: string;
    alias?: string;
    description?: string;
  };

  type NodeInfo = {
    /** 节点ID */
    id?: number;
    /** 节点名称 */
    name?: string;
    /** 节点IP */
    ip?: string;
    /** Agent状态 */
    agent?: Agent;
    /** 节点创建时间 */
    created_at?: string;
    /** 节点更新时间 */
    updated_at?: string;
    /** 可用区ID */
    zone_id?: number;
    /** 可用区编码 */
    zone_code?: string;
    /** 可用区名称 */
    zone_name?: string;
    /** 地区 */
    region_code?: string;
    /** 地区名称 */
    region_name?: string;
    /** 环境变量 */
    env?: string;
    /** 自动上报信息 */
    auto_detect?: boolean;
  };

  type NodeListParams = {
    'pagination.current'?: number;
    'pagination.page_size'?: number;
    'pagination.total'?: number;
    'pagination.raw_total'?: string;
  };

  type NodeListReply = {
    pagination?: Pagination;
    data?: NodeInfo[];
  };

  type NodeUpdateParams = {
    /** 节点ID */
    id: number;
  };

  type OnlineServiceReply = {
    pagination?: Pagination;
    data?: ServiceGroup[];
  };

  type Pagination = {
    current?: number;
    page_size?: number;
    total?: number;
    raw_total?: string;
  };

  type Service = {
    id?: string;
    /** 唯一标识 */
    key?: string;
    /** 主机名 */
    hostname?: string;
    /** 服务名称 */
    name?: string;
    /** 版本 */
    version?: string;
    /** 服务地址 */
    endpoints?: string[];
    /** 集群 */
    cluster?: string;
    /** 挂起状态 true 为挂起 */
    hang?: boolean;
    /** 元信息 */
    metadata?: Record<string, any>;
    /** 命名空间 */
    namespace?: string;
  };

  type ServiceGroup = {
    /** 唯一标识 */
    key?: string;
    /** 主机名 */
    hostname?: string;
    /** 服务名称 */
    name?: string;
    /** 版本 */
    version?: string;
    /** 服务地址 */
    endpoints?: string[];
    /** 集群 */
    clusters?: string[];
    /** 同服务，不同实例的数组信息 */
    children?: Service[];
    /** 命名空间 */
    namespace?: string;
    /** 数据类型 */
    is_group?: boolean;
  };

  type SimpleListReply = {
    data?: SimpleZoneInfo[];
  };

  type SimpleZoneInfo = {
    /** 可用区ID */
    id?: number;
    /** 可用区名称 */
    name?: string;
    /** 可用区代码 */
    code?: string;
  };

  type UpdateNodeReply = {
    data?: NodeInfo;
  };

  type UpdateNodeRequest = {
    /** 节点名称 */
    name?: string;
    /** 节点IP */
    ip?: string;
    /** Agent自动上报开关 */
    auto_detect?: boolean;
    /** 可用区ID */
    zone_id?: number;
    /** 环境变量 */
    env?: string;
    /** 节点ID */
    id?: number;
  };

  type UpdateZoneReply = {};

  type UpdateZoneRequest = {
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
  };

  type ZoneDeleteParams = {
    id: number;
  };

  type ZoneDisableParams = {
    /** 可用区ID */
    id: number;
  };

  type ZoneGetParams = {
    /** 可用区ID */
    id: number;
  };

  type ZoneInfo = {
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
    /** 状态 */
    status?: number;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
  };

  type ZoneListParams = {
    'pagination.current'?: number;
    'pagination.page_size'?: number;
    'pagination.total'?: number;
    'pagination.raw_total'?: string;
    /** 查询条件 env 环境变量 */
    env?: string;
    /** 查询条件 status 状态 1=正常，2=禁用 */
    status?: number;
  };

  type ZoneUpdateParams = {
    id: number;
  };
}
