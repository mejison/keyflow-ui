<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <Header />

    <!-- Main Content -->
    <main class="py-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-auto py-8 border-t border-slate-800">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <div class="flex items-center gap-4">
            <button 
              @click="showContactModal = true"
              class="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Contact
            </button>
          </div>
          <div class="flex items-center gap-6">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Header from '@/components/Header.vue'
import ContactModal from '@/components/ContactModal.vue'

const showContactModal = ref(false)
</script>

