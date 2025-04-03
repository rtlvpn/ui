import { defineStore } from 'pinia'
import { push } from 'notivue'
import { i18n } from '@/locales'
import { Inbound } from '@/types/inbounds'
import { Client } from '@/types/clients'

// Default empty sing-box configuration
const DEFAULT_CONFIG = {
  log: {
    level: "info",
    timestamp: true
  },
  inbounds: [],
  outbounds: [],
  route: {
    rules: []
  }
}

interface DataState {
  lastLoad: number;
  reloadItems: string[];
  subURI: string;
  onlines: {
    inbound: string[];
    outbound: string[];
    user: string[];
  };
  config: any;
  inbounds: any[];
  outbounds: any[];
  endpoints: any[];
  clients: any[];
  tlsConfigs: any[];
}

const Data = defineStore('Data', {
  state: (): DataState => ({ 
    lastLoad: 0,
    reloadItems: localStorage.getItem("reloadItems")?.split(',')?? <string[]>[],
    subURI: "",
    onlines: {inbound: <string[]>[], outbound: <string[]>[], user: <string[]>[]},
    config: <any>JSON.parse(localStorage.getItem("singbox_config") || JSON.stringify(DEFAULT_CONFIG)),
    inbounds: <any[]>[],
    outbounds: <any[]>[],
    endpoints: <any[]>[],
    clients: <any>[],
    tlsConfigs: <any[]>[],
  }),
  actions: {
    async loadData() {
      // Load data from localStorage if available
      const storedConfig = localStorage.getItem("singbox_config")
      if (storedConfig) {
        try {
          const parsedConfig = JSON.parse(storedConfig)
          this.setNewData({ config: parsedConfig })
        } catch (error) {
          push.error({
            title: i18n.global.t('error.core'),
            duration: 5000,
            message: "Failed to parse saved configuration"
          })
        }
      }
    },
    setNewData(data: any) {
      this.lastLoad = Math.floor((new Date()).getTime()/1000)
      if (data.subURI) this.subURI = data.subURI
      if (data.config) {
        this.config = data.config
        // Save config to localStorage
        localStorage.setItem("singbox_config", JSON.stringify(data.config))
      }
      if (Object.hasOwn(data, 'clients')) this.clients = data.clients ?? []
      if (Object.hasOwn(data, 'inbounds')) this.inbounds = data.inbounds ?? []
      if (Object.hasOwn(data, 'outbounds')) this.outbounds = data.outbounds ?? []
      if (Object.hasOwn(data, 'endpoints')) this.endpoints = data.endpoints ?? []
      if (Object.hasOwn(data, 'tls')) this.tlsConfigs = data.tls ?? []
    },
    async loadInbounds(ids: number[]): Promise<Inbound[]> {
      // Return inbounds from local config
      if (ids && ids.length > 0) {
        return this.inbounds.filter((inbound: any) => ids.includes(inbound.id))
      }
      return this.inbounds
    },
    async loadClients(id: number): Promise<Client> {
      // Return client from local config
      if (id > 0) {
        return <Client>this.clients.find((client: any) => client.id === id) ?? {}
      }
      return <Client>{}
    },
    async save (object: string, action: string, data: any, initUsers?: number[]): Promise<boolean> {
      try {
        // Handle local data management
        const currentConfig = JSON.parse(localStorage.getItem("singbox_config") || JSON.stringify(DEFAULT_CONFIG))
        
        if (object === 'inbounds') {
          if (action === 'new') {
            // Add new inbound with generated ID
            const newId = Math.max(0, ...this.inbounds.map((i: any) => i.id)) + 1
            data.id = newId
            this.inbounds.push(data)
            currentConfig.inbounds = this.inbounds
          } else if (action === 'edit') {
            // Edit existing inbound
            const index = this.inbounds.findIndex((i: any) => i.id === data.id)
            if (index >= 0) {
              this.inbounds[index] = data
              currentConfig.inbounds = this.inbounds
            }
          } else if (action === 'del') {
            // Delete inbound by tag
            this.inbounds = this.inbounds.filter((i: any) => i.tag !== data)
            currentConfig.inbounds = this.inbounds
          }
        } else if (object === 'outbounds') {
          if (action === 'new') {
            const newId = Math.max(0, ...this.outbounds.map((o: any) => o.id)) + 1
            data.id = newId
            this.outbounds.push(data)
            currentConfig.outbounds = this.outbounds
          } else if (action === 'edit') {
            const index = this.outbounds.findIndex((o: any) => o.id === data.id)
            if (index >= 0) {
              this.outbounds[index] = data
              currentConfig.outbounds = this.outbounds
            }
          } else if (action === 'del') {
            this.outbounds = this.outbounds.filter((o: any) => o.tag !== data)
            currentConfig.outbounds = this.outbounds
          }
        } else if (object === 'rules') {
          currentConfig.route = currentConfig.route || {}
          currentConfig.route.rules = data
        } else if (object === 'tls') {
          if (action === 'new') {
            const newId = Math.max(0, ...this.tlsConfigs.map((t: any) => t.id)) + 1
            data.id = newId
            this.tlsConfigs.push(data)
            currentConfig.tls = this.tlsConfigs
          } else if (action === 'edit') {
            const index = this.tlsConfigs.findIndex((t: any) => t.id === data.id)
            if (index >= 0) {
              this.tlsConfigs[index] = data
              currentConfig.tls = this.tlsConfigs
            }
          } else if (action === 'del') {
            this.tlsConfigs = this.tlsConfigs.filter((t: any) => t.tag !== data)
            currentConfig.tls = this.tlsConfigs
          }
        } else if (object === 'config') {
          // Update entire config
          Object.assign(currentConfig, data)
        }
        
        // Save updated config to localStorage
        localStorage.setItem("singbox_config", JSON.stringify(currentConfig))
        
        // Update store data
        this.config = currentConfig
        
        push.success({
          title: i18n.global.t('success'),
          duration: 5000,
          message: i18n.global.t('actions.' + action) + " " + i18n.global.t('objects.' + (object === 'tls' || object === 'config' ? object : object.substring(0, object.length - 1)))
        })
        
        return true
      } catch (error) {
        push.error({
          title: i18n.global.t('failed'),
          duration: 5000,
          message: error instanceof Error ? error.message : "Unknown error"
        })
        return false
      }
    },
    
    // New methods for importing/exporting configs
    exportConfig(): string {
      try {
        // Create a sanitized version of the config for sing-box
        const exportConfig = { ...this.config }
        
        // Format the configuration as needed for sing-box
        return JSON.stringify(exportConfig, null, 2)
      } catch (error) {
        push.error({
          title: i18n.global.t('failed'),
          duration: 5000,
          message: "Failed to export configuration"
        })
        return ""
      }
    },
    
    importConfig(jsonConfig: string): boolean {
      try {
        const parsedConfig = JSON.parse(jsonConfig)
        this.setNewData({ config: parsedConfig })
        push.success({
          title: i18n.global.t('success'),
          duration: 5000,
          message: "Configuration imported successfully"
        })
        return true
      } catch (error) {
        push.error({
          title: i18n.global.t('failed'),
          duration: 5000,
          message: "Failed to import configuration. Invalid JSON format."
        })
        return false
      }
    }
  }
})

export default Data