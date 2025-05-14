<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card rounded="xl" elevation="5">
          <v-card-title>{{ $t('exportConfig.title') }}</v-card-title>
          <v-card-text>
            <p>{{ $t('exportConfig.description') }}</p>
            <v-textarea
              v-model="configJson"
              :label="$t('exportConfig.configContent')"
              outlined
              readonly
              rows="20"
              class="mt-4"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn 
              color="error"
              @click="resetConfig"
              prepend-icon="mdi-trash-can"
              class="mr-auto"
            >
              {{ $t('exportConfig.resetConfig') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary"
              @click="copyConfig"
              prepend-icon="mdi-content-copy"
            >
              {{ $t('exportConfig.copyConfig') }}
            </v-btn>
            <v-btn 
              color="success"
              @click="downloadConfig"
              prepend-icon="mdi-download"
            >
              {{ $t('exportConfig.downloadConfig') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="5">
          <v-card-title>{{ $t('serverImport.title') }}</v-card-title>
          <v-card-text>
            <p>{{ $t('serverImport.description') }}</p>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="serverIp"
                  :label="$t('serverImport.serverIp')"
                  outlined
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="serverPort"
                  :label="$t('serverImport.serverPort')"
                  outlined
                  hide-details="auto"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="configPath"
                  :label="$t('serverImport.configPath')"
                  outlined
                  hide-details="auto"
                  placeholder="/path/to/config.json"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-3">
              <v-col cols="12">
                <v-btn
                  color="primary"
                  block
                  @click="fetchServerConfig"
                  :loading="isLoading"
                  prepend-icon="mdi-server-network"
                >
                  {{ $t('serverImport.fetchConfig') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="5">
          <v-card-title>{{ $t('importConfig.title') }}</v-card-title>
          <v-card-text>
            <p>{{ $t('importConfig.description') }}</p>
            <v-textarea
              v-model="importJson"
              :label="$t('importConfig.configContent')"
              outlined
              rows="10"
              class="mt-4"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-file-input
              v-model="importFile"
              :label="$t('importConfig.selectFile')"
              accept=".json"
              @update:model-value="handleFileUpload"
              prepend-icon="mdi-file-upload"
              class="mx-2"
            ></v-file-input>
            <v-btn 
              color="primary"
              @click="importConfig"
              prepend-icon="mdi-import"
              :disabled="!importJson"
            >
              {{ $t('importConfig.import') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Data from '@/store/modules/data'
import { ref, computed, onMounted } from 'vue'
import { push } from 'notivue'
import { i18n } from '@/locales'

const configJson = ref('')
const importJson = ref('')
const importFile = ref<File | null>(null)

// Server import fields
const serverIp = ref('127.0.0.1')
const serverPort = ref('8081')
const configPath = ref('')
const isLoading = ref(false)

// Get the configuration in JSON format
const updateConfigJson = () => {
  configJson.value = Data().exportConfig()
}

// Initial data load
onMounted(() => {
  updateConfigJson()
})

// Copy config to clipboard
const copyConfig = () => {
  navigator.clipboard.writeText(configJson.value)
    .then(() => {
      push.success({
        title: i18n.global.t('success'),
        message: i18n.global.t('exportConfig.copiedToClipboard')
      })
    })
    .catch(() => {
      push.error({
        title: i18n.global.t('failed'),
        message: i18n.global.t('exportConfig.copyFailed')
      })
    })
}

// Download config as a file
const downloadConfig = () => {
  const blob = new Blob([configJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sing-box-config.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  push.success({
    title: i18n.global.t('success'),
    message: i18n.global.t('exportConfig.downloadStarted')
  })
}

// Fetch config from server using the correct endpoint
const fetchServerConfig = async () => {
  if (!serverIp.value) {
    push.warning({
      title: i18n.global.t('warning'),
      message: i18n.global.t('serverImport.noServerIp')
    })
    return
  }
  
  if (!serverPort.value) {
    push.warning({
      title: i18n.global.t('warning'),
      message: i18n.global.t('serverImport.noServerPort')
    })
    return
  }
  
  isLoading.value = true
  
  try {
    // Construct the URL with the exact endpoint from the documentation
    let url = `http://${serverIp.value}:${serverPort.value}/config/get`
    
    // Add path parameter if provided
    if (configPath.value) {
      url += `?path=${encodeURIComponent(configPath.value)}`
    }
    
    // Fetch the config from the server using the documented endpoint
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.text()
    
    // Set the fetched config to the import textarea
    importJson.value = data
    
    push.success({
      title: i18n.global.t('success'),
      message: i18n.global.t('serverImport.fetchSuccess')
    })
  } catch (error) {
    console.error('Error fetching server config:', error)
    push.error({
      title: i18n.global.t('failed'),
      duration: 5000,
      message: i18n.global.t('serverImport.fetchError', { error: error instanceof Error ? error.message : String(error) })
    })
  } finally {
    isLoading.value = false
  }
}

// Handle file upload
const handleFileUpload = (files: File | File[]) => {
  if (!files) return
  
  // If files is an array, use the first file
  const file = Array.isArray(files) ? files[0] : files
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    try {
      const result = e.target?.result
      if (typeof result === 'string') {
        importJson.value = result
      } else {
        throw new Error('Invalid file content')
      }
    } catch (error) {
      push.error({
        title: i18n.global.t('failed'),
        message: i18n.global.t('importConfig.invalidFile')
      })
    }
  }
  reader.readAsText(file)
}

// Import configuration
const importConfig = () => {
  if (!importJson.value) {
    push.warning({
      title: i18n.global.t('warning'),
      message: i18n.global.t('importConfig.noData')
    })
    return
  }
  
  const success = Data().importConfig(importJson.value)
  if (success) {
    updateConfigJson()
    importJson.value = ''
    importFile.value = null
  }
}

// Reset configuration and clear localStorage
const resetConfig = () => {
  if (confirm(i18n.global.t('exportConfig.resetConfirm'))) {
    localStorage.clear()
    window.location.reload()
  }
}
</script> 