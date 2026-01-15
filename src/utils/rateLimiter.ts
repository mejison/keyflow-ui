// Throttle function to limit API call frequency
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0

  return function (this: any, ...args: Parameters<T>) {
    const currentTime = Date.now()
    const timeSinceLastExec = currentTime - lastExecTime

    const execute = () => {
      lastExecTime = Date.now()
      func.apply(this, args)
    }

    if (timeSinceLastExec >= delay) {
      execute()
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(execute, delay - timeSinceLastExec)
    }
  }
}

// Debounce function to delay execution until after wait time
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

// Rate limiter class for more complex rate limiting
export class RateLimiter {
  private queue: Array<() => void> = []
  private processing = false
  private lastCallTime = 0
  private minInterval: number
  private maxQueueSize: number

  constructor(minInterval: number = 1000, maxQueueSize: number = 10) {
    this.minInterval = minInterval
    this.maxQueueSize = maxQueueSize
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.queue.length >= this.maxQueueSize) {
        reject(new Error('Rate limit queue is full. Please try again later.'))
        return
      }

      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastCall = now - this.lastCallTime

      if (timeSinceLastCall < this.minInterval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minInterval - timeSinceLastCall)
        )
      }

      const fn = this.queue.shift()
      if (fn) {
        this.lastCallTime = Date.now()
        await fn()
      }
    }

    this.processing = false
  }
}
