<template>
  <div class="relative" ref="selectorRef">
    <button
      @click.stop="isOpen = !isOpen"
      class="w-14 h-14 rounded-full bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl border border-slate-700/50 flex items-center justify-center group hover:scale-110"
      :title="'Theme: ' + currentThemeData?.name"
    >
      <span class="text-2xl group-hover:scale-110 transition-transform">🎨</span>
    </button>

    <!-- Theme Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        @click.stop
        class="absolute right-0 bottom-16 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[60]"
      >
        <div class="p-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 px-2">
            Choose Theme
          </div>
          <div class="space-y-1">
            <button
              v-for="theme in themeStore.themes"
              :key="theme.id"
              @click="selectTheme(theme.id)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                themeStore.currentTheme === theme.id
                  ? 'bg-slate-700 ring-2 ring-primary'
                  : 'hover:bg-slate-700/50'
              ]"
            >
              <span class="text-xl">{{ theme.emoji }}</span>
              <div class="flex-1 text-left">
                <div class="text-sm font-medium text-slate-200">{{ theme.name }}</div>
              </div>
              <div class="flex gap-1">
                <div
                  class="w-4 h-4 rounded-full border border-slate-600"
                  :style="{ backgroundColor: theme.primary }"
                ></div>
                <div
                  class="w-4 h-4 rounded-full border border-slate-600"
                  :style="{ backgroundColor: theme.secondary }"
                ></div>
              </div>
              <svg
                v-if="themeStore.currentTheme === theme.id"
                class="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore, type Theme } from '@/stores/theme'

const themeStore = useThemeStore()
const isOpen = ref(false)
const selectorRef = ref<HTMLElement>()

const currentThemeData = computed(() => {
  return themeStore.themes.find(t => t.id === themeStore.currentTheme)
})

const selectTheme = (theme: Theme) => {
  themeStore.setTheme(theme)
  isOpen.value = false
}

const closeDropdown = () => {
  isOpen.value = false
}

// Handle clicks outside
const handleClickOutside = (event: MouseEvent) => {
  if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
