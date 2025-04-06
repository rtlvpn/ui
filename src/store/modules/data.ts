import { defineStore } from 'pinia'
import { push } from 'notivue'
import { i18n } from '@/locales'
import { Inbound, inboundWithUsers } from '@/types/inbounds'
import { Client } from '@/types/clients'

// Default empty sing-box configuration
const DEFAULT_CONFIG = {
  log: {
    level: "info",
    timestamp: true
  },
  dns: {
    servers: [],
    rules: []
  },
  inbounds: [],
  outbounds: [],
  route: {
    rules: [],
    rule_set: []
  },
  experimental: {}
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
        
        // Extract sections from config into local state
        // This ensures the individual state arrays are synchronized with the config
        if (data.config.inbounds) this.inbounds = data.config.inbounds
        if (data.config.outbounds) this.outbounds = data.config.outbounds
        if (data.config.clients) this.clients = data.config.clients
        if (data.config.tls) this.tlsConfigs = data.config.tls
        
        // Save config to localStorage
        localStorage.setItem("singbox_config", JSON.stringify(data.config))
      }
      if (Object.hasOwn(data, 'clients')) this.clients = data.clients ?? []
      if (Object.hasOwn(data, 'inbounds')) this.inbounds = data.inbounds ?? []
      if (Object.hasOwn(data, 'outbounds')) this.outbounds = data.outbounds ?? []
      if (Object.hasOwn(data, 'endpoints')) this.endpoints = data.endpoints ?? []
      if (Object.hasOwn(data, 'tls')) this.tlsConfigs = data.tls ?? []
      
      // After setting individual arrays, synchronize the full config with all sections
      this.syncFullConfig()
    },
    
    // New method to ensure all data is properly synced to config object
    syncFullConfig() {
      // Create a full config with all sections synchronized
      const fullConfig = { ...this.config }
      
      // Make sure we have all required sections
      if (!fullConfig.log) fullConfig.log = DEFAULT_CONFIG.log
      if (!fullConfig.dns) fullConfig.dns = DEFAULT_CONFIG.dns
      if (!fullConfig.route) fullConfig.route = DEFAULT_CONFIG.route
      
      // Update each section with current state
      fullConfig.inbounds = this.inbounds
      fullConfig.outbounds = this.outbounds
      fullConfig.clients = this.clients
      fullConfig.tls = this.tlsConfigs
      
      // Save the complete config
      this.config = fullConfig
      localStorage.setItem("singbox_config", JSON.stringify(fullConfig))
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
        // Instead of re-parsing from localStorage, use current config state to avoid losing data
        const currentConfig = { ...this.config }
        
        if (object === 'inbounds') {
          if (action === 'new') {
            // Add new inbound with generated ID
            const newId = Math.max(0, ...this.inbounds.map((i: any) => i.id)) + 1
            data.id = newId
            this.inbounds.push(data)
            currentConfig.inbounds = this.inbounds

            // Handle client associations for new inbound
            if (initUsers && initUsers.length > 0) {
              const usersToAssign = this.clients.filter((c: any) => initUsers.includes(c.id))
              
              // Assign inbound to clients
              for (const client of usersToAssign) {
                if (!client.inbounds.includes(newId)) {
                  client.inbounds.push(newId)
                }
              }
              
              // Store user names in inbound
              data.users = usersToAssign.map((c: any) => c.name)
            }
          } else if (action === 'edit') {
            // Edit existing inbound
            const index = this.inbounds.findIndex((i: any) => i.id === data.id)
            if (index >= 0) {
              // Handle client associations for existing inbound
              if (initUsers) {
                // Find which clients to add and which to remove
                const inboundId = data.id
                
                // Remove this inbound from all clients that currently have it
                for (const client of this.clients) {
                  const idx = client.inbounds.indexOf(inboundId)
                  if (idx !== -1) {
                    client.inbounds.splice(idx, 1)
                  }
                }
                
                // Add this inbound to selected clients
                if (initUsers.length > 0) {
                  const usersToAssign = this.clients.filter((c: any) => initUsers.includes(c.id))
                  
                  for (const client of usersToAssign) {
                    if (!client.inbounds.includes(inboundId)) {
                      client.inbounds.push(inboundId)
                    }
                  }
                  
                  // Store user names in inbound
                  data.users = usersToAssign.map((c: any) => c.name)
                } else {
                  // No users selected, remove users array
                  delete data.users
                }
              }
              
              this.inbounds[index] = data
              currentConfig.inbounds = this.inbounds
            }
          } else if (action === 'del') {
            // Delete inbound by tag
            const inboundToDelete = this.inbounds.find((i: any) => i.tag === data)
            
            if (inboundToDelete) {
              // Remove inbound from all clients that have it
              const inboundId = inboundToDelete.id
              for (const client of this.clients) {
                const idx = client.inbounds.indexOf(inboundId)
                if (idx !== -1) {
                  client.inbounds.splice(idx, 1)
                }
              }
            }
            
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
        } else if (object === 'clients') {
          if (action === 'new') {
            const newId = Math.max(0, ...this.clients.map((c: any) => c.id || 0)) + 1
            data.id = newId
            this.clients.push(data)
            currentConfig.clients = this.clients
            
            // Update inbounds user list if this client is associated with any inbounds
            if (data.inbounds && data.inbounds.length > 0) {
              for (const inboundId of data.inbounds) {
                const inbound = this.inbounds.find((i: any) => i.id === inboundId)
                if (inbound) {
                  inbound.users = inbound.users || []
                  if (!inbound.users.includes(data.name)) {
                    inbound.users.push(data.name)
                  }
                }
              }
              currentConfig.inbounds = this.inbounds
            }
          } else if (action === 'edit') {
            const index = this.clients.findIndex((c: any) => c.id === data.id)
            if (index >= 0) {
              const oldClient = this.clients[index]
              const oldName = oldClient.name
              
              // Handle renamed clients in inbounds
              if (oldName !== data.name) {
                for (const inbound of this.inbounds) {
                  if (inbound.users && inbound.users.includes(oldName)) {
                    const idx = inbound.users.indexOf(oldName)
                    inbound.users[idx] = data.name
                  }
                }
                currentConfig.inbounds = this.inbounds
              }
              
              // Handle changed inbound associations
              const removedInbounds = oldClient.inbounds.filter((id: number) => !data.inbounds.includes(id))
              const addedInbounds = data.inbounds.filter((id: number) => !oldClient.inbounds.includes(id))
              
              // Remove client from inbounds that are no longer associated
              for (const inboundId of removedInbounds) {
                const inbound = this.inbounds.find((i: any) => i.id === inboundId)
                if (inbound && inbound.users) {
                  inbound.users = inbound.users.filter((u: string) => u !== oldName)
                }
              }
              
              // Add client to newly associated inbounds
              for (const inboundId of addedInbounds) {
                const inbound = this.inbounds.find((i: any) => i.id === inboundId)
                if (inbound) {
                  inbound.users = inbound.users || []
                  if (!inbound.users.includes(data.name)) {
                    inbound.users.push(data.name)
                  }
                }
              }
              
              this.clients[index] = data
              currentConfig.clients = this.clients
            }
          } else if (action === 'del') {
            const clientToDelete = this.clients.find((c: any) => c.id === data)
            
            if (clientToDelete) {
              // Remove client from all inbounds
              for (const inbound of this.inbounds) {
                if (inbound.users && inbound.users.includes(clientToDelete.name)) {
                  inbound.users = inbound.users.filter((u: string) => u !== clientToDelete.name)
                }
              }
              currentConfig.inbounds = this.inbounds
            }
            
            this.clients = this.clients.filter((c: any) => c.id !== data)
            currentConfig.clients = this.clients
          } else if (action === 'addbulk') {
            // Generate IDs for new clients
            const maxId = Math.max(0, ...this.clients.map((c: any) => c.id || 0))
            let newId = maxId + 1
            
            for (const client of data) {
              client.id = newId++
              this.clients.push(client)
              
              // Update inbounds user list for each client
              if (client.inbounds && client.inbounds.length > 0) {
                for (const inboundId of client.inbounds) {
                  const inbound = this.inbounds.find((i: any) => i.id === inboundId)
                  if (inbound) {
                    inbound.users = inbound.users || []
                    if (!inbound.users.includes(client.name)) {
                      inbound.users.push(client.name)
                    }
                  }
                }
              }
            }
            
            currentConfig.clients = this.clients
            currentConfig.inbounds = this.inbounds
          }
        }
        
        // Save updated config to localStorage
        localStorage.setItem("singbox_config", JSON.stringify(currentConfig))
        
        // Update store data
        this.config = currentConfig
        
        // Make sure all sections are properly synced
        this.syncFullConfig()
        
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
        // Make sure everything is synced before we export
        this.syncFullConfig()
        
        // Create the base structure for the export config
        const exportConfig: any = {
          log: this.config.log || DEFAULT_CONFIG.log,
          dns: this.config.dns || DEFAULT_CONFIG.dns,
          inbounds: [],
          outbounds: this.config.outbounds || [],
          route: this.config.route || { rules: [] }
        };
        
        // Add experimental config if it exists
        if (this.config.experimental) {
          exportConfig.experimental = { ...this.config.experimental };
        }
        
        // Process inbounds while keeping internal data intact
        if (this.inbounds && this.inbounds.length > 0) {
          for (const originalInbound of this.inbounds) {
            // Create a clean copy of the inbound for export
            const exportInbound = { ...originalInbound };
            
            // Remove internal fields from the export version
            delete exportInbound.id;
            delete exportInbound.addrs;
            delete exportInbound.out_json;
            
            // Handle TLS config reference
            if (originalInbound.tls_id && originalInbound.tls_id > 0) {
              const tlsConfig = this.tlsConfigs.find(t => t.id === originalInbound.tls_id);
              if (tlsConfig) {
                const cleanTlsConfig = { ...tlsConfig };
                delete cleanTlsConfig.id;
                delete cleanTlsConfig.tag;
                exportInbound.tls = cleanTlsConfig;
              }
            }
            // Remove the internal tls_id field from export
            delete exportInbound.tls_id;
            
            // Process users if this inbound type supports them
            if (inboundWithUsers.includes(originalInbound.type)) {
              // Find clients associated with this inbound using the original ID
              const associatedClients = this.clients.filter(client => 
                client.inbounds.includes(originalInbound.id) && client.enable
              );
              
              if (associatedClients.length > 0) {
                // Transform client data into appropriate user format based on inbound type
                switch (originalInbound.type) {
                  case 'socks':
                  case 'http':
                    exportInbound.users = associatedClients.map(client => ({
                      username: client.name,
                      password: client.config?.[originalInbound.type]?.password || ''
                    }));
                    break;
                  
                  case 'shadowsocks':
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name,
                      password: client.config?.shadowsocks?.password || ''
                    }));
                    break;
                    
                  case 'vmess':
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name,
                      uuid: client.config?.vmess?.uuid || '',
                      alterId: client.config?.vmess?.alterId || 0
                    }));
                    break;
                    
                  case 'trojan':
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name,
                      password: client.config?.trojan?.password || ''
                    }));
                    break;
                    
                  case 'vless':
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name,
                      uuid: client.config?.vless?.uuid || '',
                      flow: client.config?.vless?.flow || ''
                    }));
                    break;
                    
                  case 'tuic':
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name,
                      uuid: client.config?.tuic?.uuid || '',
                      password: client.config?.tuic?.password || ''
                    }));
                    break;
                    
                  case 'hysteria':
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name,
                      auth: client.config?.hysteria?.auth || ''
                    }));
                    break;
                    
                  case 'hysteria2':
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name,
                      password: client.config?.hysteria2?.password || ''
                    }));
                    break;
                    
                  case 'naive':
                    exportInbound.users = associatedClients.map(client => ({
                      username: client.name,
                      password: client.config?.naive?.password || ''
                    }));
                    break;
                    
                  case 'shadowtls':
                    if (originalInbound.version >= 3) {
                      exportInbound.users = associatedClients.map(client => ({
                        name: client.name,
                        password: client.config?.shadowtls?.password || ''
                      }));
                    }
                    break;
                    
                  default:
                    exportInbound.users = associatedClients.map(client => ({
                      name: client.name
                    }));
                }
              } else {
                // No users for this inbound
                delete exportInbound.users;
              }
            } else {
              // Inbound type doesn't support users
              delete exportInbound.users;
            }
            
            // Clean up empty objects
            if (exportInbound.multiplex && Object.keys(exportInbound.multiplex).length === 0) {
              delete exportInbound.multiplex;
            }
            
            if (exportInbound.transport && Object.keys(exportInbound.transport).length === 0) {
              delete exportInbound.transport;
            }
            
            // Add the cleaned up inbound to the export config
            exportConfig.inbounds.push(exportInbound);
          }
        }
        
        // Format the configuration as needed for sing-box
        return JSON.stringify(exportConfig, null, 2);
      } catch (error) {
        push.error({
          title: i18n.global.t('failed'),
          duration: 5000,
          message: "Failed to export configuration"
        });
        return "";
      }
    },
    
    importConfig(jsonConfig: string): boolean {
      try {
        const parsedConfig = JSON.parse(jsonConfig)
        
        // Process the imported configuration to maintain relationships between inbounds and clients
        const processedData: any = { config: parsedConfig }
        
        // Process inbounds from imported config
        if (parsedConfig.inbounds && parsedConfig.inbounds.length > 0) {
          const processedInbounds = parsedConfig.inbounds.map((inbound: any, index: number) => {
            // Create internal inbound structure with ID
            const inboundId = index + 1 // Generate sequential IDs
            const processedInbound = {
              ...inbound,
              id: inboundId
            }
            
            // Store users property if it exists
            if (inbound.users && inbound.users.length > 0) {
              // For each inbound type, extract user names from the appropriate field
              if (['socks', 'http'].includes(inbound.type)) {
                processedInbound.users = inbound.users.map((user: any) => user.username)
              } else if (['shadowsocks', 'vmess', 'trojan', 'hysteria', 'hysteria2', 'tuic', 'shadowtls'].includes(inbound.type)) {
                processedInbound.users = inbound.users.map((user: any) => user.name)
              }
            }
            
            // Process any TLS config embedded in the inbound
            if (inbound.tls) {
              // Store the TLS config separately
              if (!processedData.tls) {
                processedData.tls = []
              }
              
              const tlsId = processedData.tls.length + 1
              const tlsConfig = {
                ...inbound.tls,
                id: tlsId,
                tag: `tls-${inbound.tag}-${tlsId}`
              }
              
              processedData.tls.push(tlsConfig)
              processedInbound.tls_id = tlsId
              
              // Remove the embedded tls config to avoid duplication
              delete processedInbound.tls
            }
            
            return processedInbound
          })
          
          processedData.inbounds = processedInbounds
          
          // Process or create clients based on inbound users
          const usernames = new Set<string>()
          processedInbounds.forEach((inbound: { users?: string[], id?: number }) => {
            if (inbound.users && inbound.users.length > 0) {
              inbound.users.forEach((username: string) => usernames.add(username))
            }
          })
          
          // Create or update clients for each username
          if (usernames.size > 0) {
            const existingClients = this.clients || []
            const updatedClients = [...existingClients]
            
            // For each username found in inbounds
            Array.from(usernames).forEach((username) => {
              // Check if client already exists
              const existingClient = existingClients.find(c => c.name === username)
              
              if (existingClient) {
                // Update existing client's inbounds
                const clientInbounds = processedInbounds
                  .filter((inbound: { users?: string[] }) => inbound.users && inbound.users.includes(username))
                  .map((inbound: { id: number }) => inbound.id)
                
                existingClient.inbounds = Array.from(new Set([...existingClient.inbounds || [], ...clientInbounds]))
              } else {
                // Create new client
                const newId = Math.max(0, ...updatedClients.map((c: any) => c.id || 0)) + 1
                const clientInbounds = processedInbounds
                  .filter((inbound: { users?: string[] }) => inbound.users && inbound.users.includes(username))
                  .map((inbound: { id: number }) => inbound.id)
                
                const newClient = {
                  id: newId,
                  name: username,
                  enable: true,
                  config: {}, // This will be populated with random configs if needed
                  inbounds: clientInbounds,
                  links: [],
                  volume: 0,
                  expiry: 0,
                  up: 0,
                  down: 0,
                  desc: `Imported client for ${username}`,
                  group: 'imported'
                }
                
                updatedClients.push(newClient)
              }
            })
            
            processedData.clients = updatedClients
          }
        }
        
        // Preserve other important sections from the imported config
        if (parsedConfig.dns) {
          processedData.config.dns = parsedConfig.dns
        }
        
        if (parsedConfig.route) {
          processedData.config.route = parsedConfig.route
        }
        
        if (parsedConfig.log) {
          processedData.config.log = parsedConfig.log
        }
        
        // Set the processed data
        this.setNewData(processedData)
        
        // Make sure all parts of the config are synced
        this.syncFullConfig()
        
        push.success({
          title: i18n.global.t('success'),
          duration: 5000,
          message: "Configuration imported successfully"
        })
        return true
      } catch (error) {
        console.error("Import error:", error)
        push.error({
          title: i18n.global.t('failed'),
          duration: 5000,
          message: "Failed to import configuration. Invalid JSON format or structure."
        })
        return false
      }
    }
  }
})

export default Data