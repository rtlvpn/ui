<template>
  <v-app-bar :elevation="5" class="win98-appbar">
    <v-btn 
      v-if="isMobile" 
      @click="$emit('toggleDrawer')" 
      class="win98-start"
    >
      <v-icon icon="mdi-menu" class="win98-icon" />
      <span class="win98-start-text">Start</span>
    </v-btn>
    <span v-else style="width: 24px"></span>
    <v-app-bar-title :text="$t(<string>route.name)" class="align-center text-center win98-title" />
    <v-btn @click="toggleTheme()" class="win98-theme-btn">
      <v-icon icon="mdi-theme-light-dark" class="win98-icon" />
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'

defineProps(['isMobile'])

const route = useRoute()
const theme = useTheme()
const darkMode = ref(localStorage.getItem('theme') == "dark")

const toggleTheme = () => {
  darkMode.value = !darkMode.value
  theme.global.name.value = darkMode.value ? "dark" : "y2k"
  localStorage.setItem('theme', theme.global.name.value)
}
</script>

<style scoped>
.win98-appbar {
  background: linear-gradient(to bottom, #C0C0C0, #9E9E9E) !important;
  height: 40px !important;
}

.win98-start {
  background-color: #C0C0C0 !important;
  border: 2px solid #000 !important;
  border-radius: 0 !important;
  margin-right: 8px !important;
  padding: 0 8px !important;
  height: 32px !important;
  box-shadow: 
    inset -1px -1px #0a0a0a,
    inset 1px 1px #dfdfdf,
    inset -2px -2px grey,
    inset 2px 2px white !important;
}

.win98-start-text {
  font-family: 'VT323', monospace !important;
  font-size: 1.2rem !important;
  margin-left: 4px !important;
}

.win98-title {
  font-family: 'Press Start 2P', cursive !important;
  font-size: 0.8rem !important;
  color: #000080 !important;
  text-shadow: 1px 1px #FF00FF !important;
}

.win98-theme-btn {
  background-color: #C0C0C0 !important;
  border: 2px solid #000 !important;
  border-radius: 0 !important;
  margin-left: 8px !important;
  height: 32px !important;
  width: 32px !important;
  min-width: 32px !important;
  padding: 0 !important;
  box-shadow: 
    inset -1px -1px #0a0a0a,
    inset 1px 1px #dfdfdf,
    inset -2px -2px grey,
    inset 2px 2px white !important;
}

.win98-icon {
  color: #000080 !important;
}
</style>
