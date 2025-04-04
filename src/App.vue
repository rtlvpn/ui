<template>
  <v-overlay
    :model-value="loading"
    persistent
    content-class="text-center"
    class="align-center justify-center y2k-overlay"
  >
    <v-progress-circular
      indeterminate
      size="64"
      color="#FF00FF"
    ></v-progress-circular>
    <br />
    <span class="y2k-loading">{{ $t('loading') }}</span>
  </v-overlay>
  <Message />
  <router-view />
</template>

<script lang="ts" setup>
import Message from '@/components/message.vue'
import { inject, ref, Ref, onMounted } from 'vue'

const loading:Ref = inject('loading')?? ref(false)

// Change page title
document.title = "Y2K SING-BOX UI " + document.location.hostname

// Set default theme to y2k and play startup sound
onMounted(() => {
  localStorage.setItem('theme', 'y2k')
  
  // Play Windows 98 startup sound
  setTimeout(() => {
    const audio = new Audio('data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAeAAAdBgAICAgMDAwQEBAUFBQYGBgcHBwgICAlJSUpKSkuLi4yMjI3Nzc7Ozs/Pz9ERERIXV1dYWFhZWVlaWlpbW1tcXFxdXV1enp6fn5+goKChoaGioqKjo6OkpKSl5eXm5ubpKSkqKiotra2urq6vr6+wsLCxsbGysrKzs7O09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7////AAAAUExBTUUzLjk5cgEWAAAAAC4DAAA1ICQFlQADgAAAAAAdBnaTZzUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZB8P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZDYP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
    audio.play();
  }, 1000);
  
  // Add y2k effect to show we're running on a retro system
  const appRoot = document.querySelector('.v-application') as HTMLElement;
  if (appRoot) {
    setTimeout(() => {
      // Add scanline flicker effect
      const flickerEffect = () => {
        appRoot.style.opacity = (Math.random() * 0.05 + 0.95).toString();
        setTimeout(() => {
          appRoot.style.opacity = '1';
        }, 100);
      };
      
      // Randomly flicker
      setInterval(flickerEffect, 5000);
    }, 2000);
  }
})
</script>

<style>
.v-overlay .v-list-item,
.v-field__input {
  direction: ltr;
}

.y2k-overlay .v-progress-circular {
  box-shadow: 0 0 15px #FF00FF, 0 0 25px #00FFFF;
}

.y2k-loading {
  font-family: 'Press Start 2P', cursive !important;
  color: #FF00FF;
  text-shadow: 2px 2px #00FFFF;
  font-size: 16px;
}
</style>