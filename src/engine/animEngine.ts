export type AnimTaskCallback = (dt: number, now: number) => boolean | void

export type LerpTaskConfig = {
  id?: string
  current: number
  target: number
  speed?: number
  precision?: number
  onUpdate: (val: number) => void
  onComplete?: () => void
}

class AnimEngine {
  private tasks = new Map<string, AnimTaskCallback>()
  private lerpTasks = new Map<string, LerpTaskConfig>()
  private rafId = 0
  private lastTime = 0
  private isPaused = false
  private autoIdCounter = 0

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause()
        } else {
          this.resume()
        }
      })
      window.addEventListener('blur', () => this.pause())
      window.addEventListener('focus', () => this.resume())
    }
  }

  public addTask(id: string, callback: AnimTaskCallback): () => void {
    this.tasks.set(id, callback)
    this.ensureTickerRunning()
    return () => {
      if (this.tasks.get(id) !== callback) return
      this.tasks.delete(id)
      this.checkAutoSleep()
    }
  }

  public removeTask(id: string): void {
    this.tasks.delete(id)
    this.checkAutoSleep()
  }

  public addLerp(config: LerpTaskConfig): {
    id: string
    setTarget: (nextTarget: number) => void
    stop: () => void
  } {
    const id = config.id || `lerp_${++this.autoIdCounter}`
    const taskConfig: LerpTaskConfig = {
      id,
      speed: 0.14,
      precision: 0.002,
      ...config,
    }

    this.lerpTasks.set(id, taskConfig)
    this.ensureTickerRunning()

    return {
      id,
      setTarget: (nextTarget: number) => {
        const task = this.lerpTasks.get(id)
        if (task === taskConfig) {
          task.target = nextTarget
          this.ensureTickerRunning()
        }
      },
      stop: () => {
        if (this.lerpTasks.get(id) !== taskConfig) return
        this.lerpTasks.delete(id)
        this.checkAutoSleep()
      },
    }
  }

  public pause(): void {
    this.isPaused = true
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  public resume(): void {
    if (this.isPaused) {
      this.isPaused = false
      this.ensureTickerRunning()
    }
  }

  public clearAll(): void {
    this.tasks.clear()
    this.lerpTasks.clear()
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  private ensureTickerRunning(): void {
    if (this.isPaused || this.rafId !== 0) return
    if (this.tasks.size === 0 && this.lerpTasks.size === 0) return
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.tick)
  }

  private checkAutoSleep(): void {
    if (this.tasks.size === 0 && this.lerpTasks.size === 0 && this.rafId !== 0) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  private tick = (now: number): void => {
    this.rafId = 0
    if (this.isPaused) return

    const dt = Math.min((now - this.lastTime) / 1000, 0.1)
    this.lastTime = now

    for (const [id, callback] of Array.from(this.tasks.entries())) {
      const keep = callback(dt, now)
      if (keep === false && this.tasks.get(id) === callback) {
        this.tasks.delete(id)
      }
    }

    for (const [id, task] of Array.from(this.lerpTasks.entries())) {
      const speed = task.speed ?? 0.14
      const precision = task.precision ?? 0.002
      task.current += (task.target - task.current) * speed

      task.onUpdate(task.current)

      if (Math.abs(task.target - task.current) < precision) {
        task.current = task.target
        task.onUpdate(task.current)
        task.onComplete?.()
        if (this.lerpTasks.get(id) === task) this.lerpTasks.delete(id)
      }
    }

    if (this.tasks.size > 0 || this.lerpTasks.size > 0) {
      this.rafId = requestAnimationFrame(this.tick)
    }
  }
}

export const animEngine = new AnimEngine()
