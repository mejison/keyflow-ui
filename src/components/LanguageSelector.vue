<template>
  <div>
    <select
      v-model="store.currentLanguage"
      @change="handleChange"
    >
      <option value="en">🇬🇧 English</option>
      <option value="ua">🇺🇦 Українська</option>
      <option value="es">🇪🇸 Español</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore, type Language } from '@/stores/language'

const store = useLanguageStore()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  store.setLanguage(target.value as Language)
}
</script>
