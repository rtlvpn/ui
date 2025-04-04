<template>
  <v-navigation-drawer
    v-model="showDrawer"
    :temporary="isMobile"
    :expand-on-hover="!isMobile"
    :rail="!isMobile"
    :permanent="!isMobile"
    @click="isMobile ? $emit('toggleDrawer') : null"
    class="y2k-drawer"
  >
    <v-list-item
      height="63"
      prepend-avatar="@/assets/y2k-logo.svg"
      title="SING-BOX UI"
      class="drawer-title"
    >
      <template v-slot:append v-if="isMobile">
        <v-icon icon="mdi-close" class="close-btn" />
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav class="win98-list">
      <v-list-item link
        v-for="item in menu"
        :key="item.title"
        :to="item.path"
        :active="router.currentRoute.value.path == item.path"
        class="win98-item">
        <template v-slot:prepend>
          <v-icon :icon="item.icon" class="win98-icon"></v-icon>
        </template>
        <v-list-item-title v-text="$t(item.title)" class="win98-item-text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import router from '@/router'

const props = defineProps(['isMobile','displayDrawer'])

const showDrawer = computed((): boolean => {
  return props.displayDrawer
})

const menu = [
  { title: 'pages.home', icon: 'mdi-home',  path: '/' },
  { title: 'pages.inbounds', icon: 'mdi-cloud-download',  path: '/inbounds' },
  { title: 'pages.clients', icon: 'mdi-account-multiple',  path: '/clients' },
  { title: 'pages.outbounds', icon: 'mdi-cloud-upload',  path: '/outbounds' },
  { title: 'pages.endpoints', icon: 'mdi-cloud-tags',  path: '/endpoints' },
  { title: 'pages.rules', icon: 'mdi-routes',  path: '/rules' },
  { title: 'pages.tls', icon: 'mdi-certificate',  path: '/tls' },
  { title: 'pages.basics', icon: 'mdi-application-cog',  path: '/basics' },
  { title: 'pages.settings', icon: 'mdi-cog',  path: '/settings' },
  { title: 'pages.exportconfig', icon: 'mdi-file-export',  path: '/exportconfig' },
]
</script>

<style scoped>
.y2k-drawer {
  background: linear-gradient(to bottom, #C0C0C0, #9E9E9E) !important;
}

.drawer-title {
  background: linear-gradient(90deg, #000080, #1084d0) !important;
  color: white !important;
  font-family: 'Press Start 2P', cursive !important;
  font-size: 0.8rem !important;
}

.win98-list {
  padding: 4px !important;
}

.win98-item {
  margin-bottom: 4px !important;
  transition: none !important;
}

.win98-icon {
  margin-right: 8px !important;
}

.win98-item-text {
  font-family: 'VT323', monospace !important;
  font-size: 1.2rem !important;
}

.close-btn {
  background: #C0C0C0 !important;
  border: 1px solid #000 !important;
  border-radius: 0 !important;
  color: #000 !important;
}
</style>