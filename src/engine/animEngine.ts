/**
 * Central Lightweight Animation Engine
 *
 * Provides a single shared requestAnimationFrame ticker that coordinates all JS/WebGL
 * animations across the application.
 *
 * Benefits:
 * 1. Single rAF loop for the entire app (prevents multiple independent rAF loops).
 * 2. Automatic Sleep: Automatically stops the rAF ticker when 0 tasks are running.
 * 3. Auto Tab Freeze: Pauses all active animations when page loses visibility/focus to free 100% CPU/GPU.
 * 4. Central Pause/Resume: Can freeze all active animations on demand.
 */

export type AnimTaskCallback = (dt: number, now: number) => boolean | void // return false to auto-deregister

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

  /**
   * Register a custom frame callback task.
   * Return `false` inside your callback to automatically remove the task when finished.
   */
  public addTask(id: string, callback: AnimTaskCallback): () => void {
    this.tasks.set(id, callback)
    this.ensureTickerRunning()
    return () => this.removeTask(id)
  }

  /**
   * Remove a registered task by ID.
   */
  public removeTask(id: string): void {
    this.tasks.delete(id)
    this.lerpTasks.delete(id)
    this.checkAutoSleep()
  }

  /**
   * Add a smooth lerp animation task.
   * Returns a control object with `setTarget(newTarget)` and `stop()`.
   */
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
        if (task) {
          task.target = nextTarget
          this.ensureTickerRunning()
        }
      },
      stop: () => this.removeTask(id),
    }
  }

  /**
   * Globally pause all animation tasks (e.g. when tab loses focus or during transitions).
   */
  public pause(): void {
    this.isPaused = true
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  /**
   * Resume animation tasks.
   */
  public resume(): void {
    if (this.isPaused) {
      this.isPaused = false
      this.ensureTickerRunning()
    }
  }

  /**
   * Stop and clear all active animation tasks.
   */
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

    const dt = Math.min((now - this.lastTime) / 1000, 0.1) // Clamp dt to prevent huge jumps
    this.lastTime = now

    // 1. Run custom tasks
    for (const [id, callback] of Array.from(this.tasks.entries())) {
      const keep = callback(dt, now)
      if (keep === false) {
        this.tasks.delete(id)
      }
    }

    // 2. Run lerp tasks
    for (const [id, task] of Array.from(this.lerpTasks.entries())) {
      const speed = task.speed ?? 0.14
      const precision = task.precision ?? 0.002
      task.current += (task.target - task.current) * speed

      task.onUpdate(task.current)

      if (Math.abs(task.target - task.current) < precision) {
        task.current = task.target
        task.onUpdate(task.current)
        task.onComplete?.()
        this.lerpTasks.delete(id)
      }
    }

    // Continue loop if active tasks remain, otherwise sleep
    if (this.tasks.size > 0 || this.lerpTasks.size > 0) {
      this.rafId = requestAnimationFrame(this.tick)
    }
  }
}

export const animEngine = new AnimEngine()
