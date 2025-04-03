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
const importFile = ref(null)

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

// Handle file upload
const handleFileUpload = (file) => {
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      importJson.value = e.target.result
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
</script> 