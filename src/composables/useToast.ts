import { reactive, computed } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
  duration: number
}

interface ToastState {
  toasts: Toast[]
}

const state = reactive<ToastState>({
  toasts: []
})

let nextId = 1

export function useToast() {
  const show = (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = nextId++
    
    state.toasts.push({
      id,
      type,
      message,
      duration
    })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: number) => {
    const index = state.toasts.findIndex(t => t.id === id)
    if (index > -1) {
      state.toasts.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => show(message, 'success', duration)
  const error = (message: string, duration?: number) => show(message, 'error', duration)
  const warning = (message: string, duration?: number) => show(message, 'warning', duration)
  const info = (message: string, duration?: number) => show(message, 'info', duration)

  const clear = () => {
    state.toasts = []
  }

  return {
    toasts: computed(() => state.toasts),
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear
  }
}
