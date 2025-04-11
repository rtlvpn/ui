<template>
  <div class="win98-toggle-container">
    <label class="win98-toggle-label" v-if="label">{{ label }}</label>
    <div 
      class="win98-toggle" 
      :class="{ 'win98-toggle-active': modelValue }"
      @click="toggle"
      tabindex="0"
      @keydown.space.prevent="toggle"
      role="switch"
      :aria-checked="modelValue ? 'true' : 'false'"
    >
      <div class="win98-toggle-track">
        <span class="win98-toggle-text">{{ modelValue ? 'ON' : 'OFF' }}</span>
      </div>
      <div class="win98-toggle-thumb"></div>
    </div>
    <div class="win98-toggle-details" v-if="!hideDetails && helperText">
      {{ helperText }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Win98Toggle',
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      required: false,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    helperText: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  emits: ['update:modelValue'],
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue)
      
      // Add Win98 sound effect (optional)
      try {
        const audio = new Audio('/assets/win98-click.mp3')
        audio.volume = 0.5
        audio.play()
      } catch (e) {
        // Silent fail if sound can't be played
      }
    }
  }
}
</script>

<style scoped>
.win98-toggle-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  min-height: 24px;
  user-select: none;
}

.win98-toggle-label {
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
  margin-right: 12px;
  color: #000;
  min-width: 100px;
  display: inline-block;
}

.win98-toggle {
  position: relative;
  width: 64px;
  height: 24px;
  cursor: pointer;
  outline: none;
}

.win98-toggle:focus {
  outline: 1px dotted #000;
}

.win98-toggle-track {
  position: absolute;
  width: 64px;
  height: 24px;
  background-color: #C0C0C0;
  border: 2px solid #000000;
  box-sizing: border-box;
  box-shadow: 
    inset 1px 1px #0a0a0a,
    inset -1px -1px #dfdfdf,
    inset 2px 2px grey,
    inset -2px -2px white;
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.win98-toggle-text {
  font-family: 'VT323', monospace;
  font-size: 12px;
  font-weight: bold;
  color: #000080;
  position: absolute;
  transition: left 0.1s ease;
}

.win98-toggle:not(.win98-toggle-active) .win98-toggle-text {
  right: 6px;
}

.win98-toggle.win98-toggle-active .win98-toggle-text {
  left: 6px;
}

.win98-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: #C0C0C0;
  border: 2px solid #000000;
  box-sizing: border-box;
  box-shadow: 
    inset -1px -1px #0a0a0a,
    inset 1px 1px #dfdfdf,
    inset -2px -2px grey,
    inset 2px 2px white;
  transition: transform 0.1s ease;
}

.win98-toggle.win98-toggle-active .win98-toggle-thumb {
  transform: translateX(40px);
}

.win98-toggle-details {
  font-family: 'VT323', monospace;
  font-size: 0.9rem;
  color: #666;
  margin-left: 12px;
}

/* Makes it flash when clicked for Y2K effect */
.win98-toggle:active .win98-toggle-thumb {
  filter: brightness(1.2);
}

/* Gives a subtle hint when hovering */
.win98-toggle:hover .win98-toggle-track {
  background-color: #d0d0d0;
}
</style> 