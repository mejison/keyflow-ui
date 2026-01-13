<template>
  <DefaultLayout>
    <h1 class="text-2xl font-semibold mb-6">Keyflow</h1>

    <TypingArea />
    <StatsBar class="mt-6" />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TypingArea from '@/components/TypingArea.vue'
import StatsBar from '@/components/StatsBar.vue'
</script>
