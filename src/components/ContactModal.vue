<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        
        <div class="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-50">Contact</h2>
            <button @click="close" class="text-slate-400 hover:text-slate-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <p class="text-slate-300 mb-6 leading-relaxed">
              Feel free to send an email to <a href="mailto:contact@keyflow.app" class="text-primary hover:text-primary">contact@keyflow.app</a>. 
              For business inquiries, email <a href="mailto:business@keyflow.app" class="text-primary hover:text-primary">business@keyflow.app</a> 
              (the buttons below will open the default mail client).
            </p>

            <p class="text-slate-400 text-sm mb-6">
              Please <span class="text-red-400">do not send</span> requests to delete account, update email, update name or clear 
              personal bests - you can do that in the settings page.
            </p>

            <!-- Contact Type Buttons -->
            <div class="grid grid-cols-2 gap-4">
              <a 
                href="mailto:contact@keyflow.app?subject=Question"
                class="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-900/70 rounded-xl border border-slate-700 transition-all group"
              >
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="font-medium text-slate-200">Question</span>
              </a>

              <a 
                href="mailto:contact@keyflow.app?subject=Feedback"
                class="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-900/70 rounded-xl border border-slate-700 transition-all group"
              >
                <div class="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span class="font-medium text-slate-200">Feedback</span>
              </a>

              <a 
                href="mailto:contact@keyflow.app?subject=Bug%20Report"
                class="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-900/70 rounded-xl border border-slate-700 transition-all group"
              >
                <div class="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <span class="font-medium text-slate-200">Bug Report</span>
              </a>

              <a 
                href="mailto:contact@keyflow.app?subject=Account%20Help"
                class="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-900/70 rounded-xl border border-slate-700 transition-all group"
              >
                <div class="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span class="font-medium text-slate-200">Account Help</span>
              </a>

              <a 
                href="mailto:business@keyflow.app?subject=Business%20Inquiry"
                class="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-900/70 rounded-xl border border-slate-700 transition-all group"
              >
                <div class="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="font-medium text-slate-200">Business Inquiry</span>
              </a>

              <a 
                href="mailto:contact@keyflow.app?subject=Other"
                class="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-900/70 rounded-xl border border-slate-700 transition-all group"
              >
                <div class="w-10 h-10 bg-slate-500/10 rounded-lg flex items-center justify-center group-hover:bg-slate-500/20 transition-colors">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
                <span class="font-medium text-slate-200">Other</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div:last-child {
  transform: scale(0.95);
}

.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
