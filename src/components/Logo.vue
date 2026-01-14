<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="minimal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Single minimal key with shadow -->
    <g transform="translate(25, 25)">
      <!-- Shadow -->
      <rect x="2" y="4" width="46" height="46" rx="8" fill="#000000" opacity="0.15"/>
      <!-- Key -->
      <rect x="0" y="0" width="46" height="46" rx="8" fill="url(#minimal-gradient)"/>
      <!-- Letter K -->
      <text x="23" y="32" font-family="Arial, sans-serif" font-size="24" font-weight="600" 
            fill="white" text-anchor="middle">K</text>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 100
})
</script>
