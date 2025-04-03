interface generalDnsRule {
  invert: boolean
  action: 'route' | 'route-options' | 'reject'
  server?: string
  strategy: string
  disable_cache: boolean
  rewrite_ttl: number
  client_subnet: string
  method?: string
  no_drop?: boolean
}

export const actionDnsRuleKeys = [
  'invert',
  'action',
  'server',
  'strategy',
  'disable_cache',
  'rewrite_ttl',
  'client_subnet',
  'method',
  'no_drop',
]
export interface logicalDnsRule extends generalDnsRule {
  type: 'logical' | 'simple'
  mode: 'and' | 'or'
  rules: dnsRule[]
}

export interface dnsRule extends generalDnsRule {
  inbound?: string[]
  ip_version?: 4 | 6
  query_type?: string
  network?: string[]
  auth_user?: string[]
  protocol?: string[]
  domain?: string[]
  domain_suffix?: string[]
  domain_keyword?: string[]
  domain_regex?: string[]
  source_ip_cidr?: string[]
  source_ip_is_private?: boolean
  source_port?: number[]
  source_port_range?: string[]
  port?: number[]
  port_range?: string[]
  process_name?: string[]
  process_path?: string[]
  process_path_regex?: string[]
  package_name?: string[]
  user?: string[]
  user_id?: number[]
  clash_mode?: string
}
