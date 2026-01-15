<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
    <Header />

    <!-- Main Content -->
    <main class="py-16 flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center text-slate-500 text-sm">
          <div class="grid grid-cols-2 md:flex md:flex-row items-center gap-4 md:gap-6">
            <button @click="showContactModal = true"  class="hover:text-slate-300 transition-colors">
              Contact
            </button>
            <RouterLink to="/terms-of-service" class="hover:text-slate-300 transition-colors">
              Terms of Service
            </RouterLink>
            <RouterLink to="/privacy-policy" class="hover:text-slate-300 transition-colors">
              Privacy Policy
            </RouterLink>
            <RouterLink to="/security-policy" class="hover:text-slate-300 transition-colors">
              Security Policy
            </RouterLink>
          </div>
        </div>
      </div>
    </footer>

    <ContactModal :is-open="showContactModal" @close="showContactModal = false" />
    
    <!-- Theme Selector - Fixed Bottom Right -->
    <div class="fixed bottom-6 right-6 z-50">
      <ThemeSelector />
    </div>
    
    <!-- Ko-fi Support - Fixed Bottom Right (above theme selector) -->
    <div class="fixed bottom-24 right-6 z-40 flex items-center gap-3">
      <!-- Hint text -->
      <div class="text-slate-400 text-lg tracking-tight hidden lg:flex items-center gap-1.5" style="font-family: 'Caveat', cursive; font-weight: 600;">
        <span>Buy me a coffee</span>
      </div>
      <!-- Ko-fi Icon -->
      <a
        href="https://ko-fi.com/mejison"
        target="_blank"
        rel="noopener noreferrer"
        class="w-14 h-14 rounded-full bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl border border-slate-700/50 flex items-center justify-center group hover:scale-110"
        title="Support on Ko-fi"
      >
        <span class="text-2xl group-hover:scale-110 transition-transform">☕</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Header from '@/components/Header.vue'
import ContactModal from '@/components/ContactModal.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'

const showContactModal = ref(false)
</script>

