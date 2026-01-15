<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-5xl px-4">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-50 mb-2">⚙️ Settings</h1>
        <p class="text-slate-400">
          Customize your typing experience
          <span v-if="!authStore.isAuthenticated" class="text-slate-500 text-sm ml-2">
            (💾 Saved locally)
          </span>
        </p>
      </div>

      <div class="space-y-6">
        <!-- Test Duration -->
        <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/30 p-6">
          <h2 class="text-xl font-bold text-slate-50 mb-4">Test Duration</h2>
          <p class="text-slate-400 text-sm mb-4">Choose how long your typing tests should last</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="duration in [15, 30, 60, 120]"
              :key="duration"
              @click="settingsStore.updateSetting('testDuration', duration as any)"
              :class="[
                'px-6 py-4 rounded-xl font-medium transition-all',
                settingsStore.settings.testDuration === duration
                  ? 'bg-primary text-white ring-2 ring-primary'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              ]"
            >
              {{ duration }}s
            </button>
          </div>
        </div>

        <!-- Font Size -->
        <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/30 p-6">
          <h2 class="text-xl font-bold text-slate-50 mb-4">Font Size</h2>
          <p class="text-slate-400 text-sm mb-4">Adjust the text size for better readability</p>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="size in [
                { value: 'small', label: 'Small', example: 'text-xl' },
                { value: 'medium', label: 'Medium', example: 'text-2xl' },
                { value: 'large', label: 'Large', example: 'text-3xl' }
              ]"
              :key="size.value"
              @click="settingsStore.updateSetting('fontSize', size.value as any)"
              :class="[
                'px-6 py-4 rounded-xl font-medium transition-all',
                settingsStore.settings.fontSize === size.value
                  ? 'bg-primary text-white ring-2 ring-primary'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              ]"
            >
              <div>{{ size.label }}</div>
              <div :class="['mt-2', size.example]">Aa</div>
            </button>
          </div>
        </div>

        <!-- Sound -->
        <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/30 p-6">
          <h2 class="text-xl font-bold text-slate-50 mb-4">Sound</h2>
          
          <div class="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl">
            <div>
              <h3 class="font-semibold text-slate-200 mb-1">Keyboard Sounds</h3>
              <p class="text-sm text-slate-400">Play sound on each keystroke</p>
            </div>
            <button
              @click="settingsStore.updateSetting('soundEnabled', !settingsStore.settings.soundEnabled)"
              :class="[
                'relative w-14 h-8 rounded-full transition-colors',
                settingsStore.settings.soundEnabled ? 'bg-primary' : 'bg-slate-600'
              ]"
            >
              <div
                :class="[
                  'absolute top-1 w-6 h-6 bg-white rounded-full transition-transform',
                  settingsStore.settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>

        <!-- Account Settings -->
        <div v-if="authStore.isAuthenticated" class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/30 p-6">
          <h2 class="text-xl font-bold text-slate-50 mb-4">Account</h2>
          
          <div class="space-y-4">
            <div class="p-4 bg-slate-900/40 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-slate-200 mb-1">{{ authStore.user?.name }}</h3>
                  <p class="text-sm text-slate-400">{{ authStore.user?.email }}</p>
                </div>
                <RouterLink 
                  to="/profile"
                  class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-200 transition-colors"
                >
                  View Profile
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-red-500/5 backdrop-blur-md rounded-2xl border border-red-500/20 p-6">
          <h2 class="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-red-500/10">
              <div>
                <h3 class="font-semibold text-slate-200 mb-1">Reset Settings</h3>
                <p class="text-sm text-slate-400">Restore all settings to defaults</p>
              </div>
              <button
                @click="handleReset"
                class="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useMeta } from '@/composables/useMeta'

const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const { setMeta } = useMeta()

// Reload settings when page is mounted
onMounted(async () => {
  setMeta({
    title: 'Settings - KeyFlow',
    description: 'Customize your KeyFlow typing experience. Adjust test duration, font size, and sound preferences.',
    keywords: 'typing settings, typing preferences, customize typing test'
  })
  
  const token = localStorage.getItem('auth_token')
  if (token) {
    await settingsStore.loadSettings()
  }
})

const handleReset = async () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    await settingsStore.resetSettings()
  }
}
</script>
