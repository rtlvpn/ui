import { dnsRule } from './dnsrules'
import { Inbound } from './inbounds'
import { Dial, Outbound } from './outbounds'

interface Log {
  disabled?: boolean
  level?: string
  output?: string
  timestamp?: boolean
}

interface Dns {
  servers: DnsServer[]
  rules: dnsRule[]
  final?: string
  strategy?: string
  disable_cache?: boolean,
  disable_expire?: boolean,
  independent_cache?: boolean,
  cache_capacity?: number,
  reverse_mapping?: boolean,
  client_subnet?: string,
}

interface DnsServer{
  tag?: string,
  address: string,
  address_resolver?: string,
  address_strategy?: string,
  strategy?: string,
  detour?: string
}

export interface Ntp extends Dial{
  enabled?: boolean
  server: string
  server_port?: number
  interval?: string
}

interface Route {
  rules: RouteRule[] | RouteRuleLogical[]
  rule_set: RouteRuleSet[]
  final?: string,
  auto_detect_interface?: boolean
  default_interface?: string
  default_mark?: number
}

interface RouteRule       {
  inbound?: string[] | string
  ip_version?: 4 | 6,
  network?: "tcp" | "udp"
  auth_user?: string[]
  protocol?: string[] | string
  domain?: string[] | string
  domain_suffix?: string[] | string
  domain_keyword?: string[] | string
  domain_regex?: string[] | string
  source_ip_cidr?: string[] | string
  source_ip_is_private?: boolean
  ip_cidr?: string[] | string
  ip_is_private?: boolean
  source_port?: number[] | number
  source_port_range?: string[] | string
  port?: number[] | number
  port_range?: string[] | string
  clash_mode?: string
  rule_set?: string[] | string
  invert?: boolean
  outbound: string
}

interface RouteRuleLogical {
  type: "logical"
  mode: "and" | "or"
  rules: RouteRule[]
  invert?: boolean
  outbound: string
}

interface RouteRuleSet {
  type: string
  tag: string
  format: string
  path?: string
  url?: string
  download_detour?: string
  update_interval?: string
}

interface Experimental {
  cache_file?: CacheFile
  v2ray_api?: V2RayAPI
}

interface CacheFile {
  enabled?: boolean
  path?: string
  cache_id?: string
  store_fakeip?: boolean
}

interface V2RayAPI {
  enabled?: boolean
  listen?: string
  stats?: Stats
}

interface Stats {
  enabled?: boolean
  inbounds?: string[]
  outbounds?: string[]
  users?: string[]
}

export interface Config {
  log: Log
  dns: Dns
  ntp?: Ntp
  inbounds: Inbound[]
  outbounds: Outbound[]
  route: Route
  experimental: Experimental
}