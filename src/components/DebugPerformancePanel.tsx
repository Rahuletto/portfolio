import { useEffect, useRef, useState } from 'react'
import { animEngine } from '../engine/animEngine.ts'

type PerformanceEventLog = {
  timeMs: number
  type: 'FRAME_DROP' | 'SEVERE_JANK' | 'SCROLL' | 'POINTER_MOVE' | 'TASK_COUNT_CHANGE'
  details: string
  scrollY: number
  activeTasks: number
  activeCanvases: number
  frameDeltaMs?: number
}

type AuditReport = {
  timestamp: string
  durationSec: number
  totalFrames: number
  avgFps: number
  low1PercentFps: number
  minFps: number
  maxFps: number
  droppedFrames: number
  severeSpikes: number
  maxFrameMs: number
  grade: 'A+' | 'A' | 'B' | 'C' | 'D'
  gpuVendor?: string
  gpuRenderer?: string
  screenRes: string
  dpr: number
  eventsLog: PerformanceEventLog[]
  rawFramesMs: number[]
}

export function DebugPerformancePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fps, setFps] = useState(60)
  const [frameTime, setFrameTime] = useState(16.6)
  const [minFps, setMinFps] = useState(60)
  const [maxFps, setMaxFps] = useState(60)
  const [heapSize, setHeapSize] = useState<string | null>(null)
  const [activeTasks, setActiveTasks] = useState(0)
  const [tickerState, setTickerState] = useState<'SLEEPING' | 'RUNNING'>('SLEEPING')
  const [scrollPos, setScrollPos] = useState(0)
  const [webglInfo, setWebglInfo] = useState<{ vendor: string; renderer: string } | null>(null)
  const [webglContextCount, setWebglContextCount] = useState(0)
  const [domCount, setDomCount] = useState(0)
  const [isPausedAll, setIsPausedAll] = useState(false)
  const [lowGpuMode, setLowGpuMode] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [recordedTimeSec, setRecordedTimeSec] = useState(0)
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null)

  const recordingRef = useRef<{
    active: boolean
    startTime: number
    frames: number[]
    events: PerformanceEventLog[]
    lastTaskCount: number
    lastScrollTime: number
  }>({ active: false, startTime: 0, frames: [], events: [], lastTaskCount: 0, lastScrollTime: 0 })

  const graphCanvasRef = useRef<HTMLCanvasElement>(null)
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    try {
      const tempCanvas = document.createElement('canvas')
      const gl = tempCanvas.getContext('webgl')
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info')
        if (ext) {
          setWebglInfo({
            vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || 'Unknown Vendor',
            renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || 'Unknown GPU',
          })
        }
      }
    } catch {
    }
  }, [])

  useEffect(() => {
    let frameId = 0
    let lastTime = performance.now()
    let frameCount = 0
    let lastFpsUpdate = performance.now()
    let minF = 999
    let maxF = 0

    const measure = (now: number) => {
      frameCount++
      const delta = now - lastTime
      lastTime = now

      if (recordingRef.current.active && delta > 0) {
        const deltaFixed = Number(delta.toFixed(2))
        recordingRef.current.frames.push(deltaFixed)
        setRecordedTimeSec(Math.round((now - recordingRef.current.startTime) / 1000))

        const recTime = Math.round(now - recordingRef.current.startTime)
        const currentScroll = Math.round(window.scrollY)
        const currentCanvases = document.querySelectorAll('canvas').length

        const enginePrivate = animEngine as any
        const currentTaskCount = (enginePrivate.tasks?.size || 0) + (enginePrivate.lerpTasks?.size || 0)

        if (currentTaskCount !== recordingRef.current.lastTaskCount) {
          recordingRef.current.lastTaskCount = currentTaskCount
          recordingRef.current.events.push({
            timeMs: recTime,
            type: 'TASK_COUNT_CHANGE',
            details: `AnimEngine tasks changed to ${currentTaskCount}`,
            scrollY: currentScroll,
            activeTasks: currentTaskCount,
            activeCanvases: currentCanvases,
          })
        }

        if (delta > 16.7) {
          recordingRef.current.events.push({
            timeMs: recTime,
            type: delta > 33.3 ? 'SEVERE_JANK' : 'FRAME_DROP',
            details: `Frame took ${deltaFixed}ms (${Math.round(1000 / delta)} FPS)`,
            scrollY: currentScroll,
            activeTasks: currentTaskCount,
            activeCanvases: currentCanvases,
            frameDeltaMs: deltaFixed,
          })
        }
      }

      if (delta > 0) {
        const instantFps = Math.round(1000 / delta)
        const instantFrameTime = Number(delta.toFixed(1))
        setFrameTime(instantFrameTime)

        if (instantFps < minF && instantFps > 5) minF = instantFps
        if (instantFps > maxF && instantFps < 240) maxF = instantFps
      }

      if (now - lastFpsUpdate >= 500) {
        const currentFps = Math.round((frameCount * 1000) / (now - lastFpsUpdate))
        setFps(currentFps)
        setMinFps(minF === 999 ? currentFps : minF)
        setMaxFps(maxF === 0 ? currentFps : maxF)

        historyRef.current.push(currentFps)
        if (historyRef.current.length > 60) historyRef.current.shift()

        frameCount = 0
        lastFpsUpdate = now

        const perfMemory = (performance as any).memory
        if (perfMemory) {
          const usedMB = (perfMemory.usedJSHeapSize / (1024 * 1024)).toFixed(1)
          const totalMB = (perfMemory.totalJSHeapSize / (1024 * 1024)).toFixed(1)
          setHeapSize(`${usedMB} / ${totalMB} MB`)
        }

        setDomCount(document.querySelectorAll('*').length)
        setWebglContextCount(document.querySelectorAll('canvas').length)

        const enginePrivate = animEngine as any
        const taskCount = (enginePrivate.tasks?.size || 0) + (enginePrivate.lerpTasks?.size || 0)
        setActiveTasks(taskCount)
        setTickerState(enginePrivate.rafId !== 0 ? 'RUNNING' : 'SLEEPING')
      }

      frameId = requestAnimationFrame(measure)
    }

    frameId = requestAnimationFrame(measure)

    const onScroll = () => {
      const currentScroll = Math.round(window.scrollY)
      setScrollPos(currentScroll)

      if (recordingRef.current.active) {
        const now = performance.now()
        if (now - recordingRef.current.lastScrollTime > 200) {
          recordingRef.current.lastScrollTime = now
          const recTime = Math.round(now - recordingRef.current.startTime)

          const enginePrivate = animEngine as any
          const taskCount = (enginePrivate.tasks?.size || 0) + (enginePrivate.lerpTasks?.size || 0)

          recordingRef.current.events.push({
            timeMs: recTime,
            type: 'SCROLL',
            details: `Scrolled to ${currentScroll}px`,
            scrollY: currentScroll,
            activeTasks: taskCount,
            activeCanvases: document.querySelectorAll('canvas').length,
          })
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const canvas = graphCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const history = historyRef.current
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()

    if (history.length < 2) return

    ctx.beginPath()
    const step = w / 60
    history.forEach((val, i) => {
      const x = i * step
      const normalized = Math.min(1, Math.max(0, val / 120))
      const y = h - normalized * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    const latestFps = history[history.length - 1] || 60
    ctx.strokeStyle = latestFps >= 55 ? '#22c55e' : latestFps >= 30 ? '#eab308' : '#ef4444'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [isOpen, fps])

  const startRecording = () => {
    recordingRef.current = {
      active: true,
      startTime: performance.now(),
      frames: [],
      events: [],
      lastTaskCount: 0,
      lastScrollTime: 0,
    }
    setIsRecording(true)
    setRecordedTimeSec(0)
    setAuditReport(null)
  }

  const stopRecording = () => {
    recordingRef.current.active = false
    setIsRecording(false)

    const frames = recordingRef.current.frames
    if (frames.length === 0) return

    const durationSec = Math.round((performance.now() - recordingRef.current.startTime) / 1000)
    const totalFrames = frames.length
    const avgMs = frames.reduce((a, b) => a + b, 0) / totalFrames
    const avgFps = Math.round(1000 / avgMs)

    const sorted = [...frames].sort((a, b) => b - a)
    const low1Count = Math.max(1, Math.floor(sorted.length * 0.01))
    const low1Ms = sorted.slice(0, low1Count).reduce((a, b) => a + b, 0) / low1Count
    const low1PercentFps = Math.round(1000 / low1Ms)

    const droppedFrames = frames.filter((f) => f > 16.7).length
    const severeSpikes = frames.filter((f) => f > 33.3).length
    const maxFrameMs = Number(Math.max(...frames).toFixed(1))

    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'A+'
    if (avgFps < 45 || severeSpikes > 15) grade = 'D'
    else if (avgFps < 55 || severeSpikes > 8) grade = 'C'
    else if (droppedFrames > 20) grade = 'B'
    else if (droppedFrames > 5) grade = 'A'

    const report: AuditReport = {
      timestamp: new Date().toISOString(),
      durationSec,
      totalFrames,
      avgFps,
      low1PercentFps,
      minFps,
      maxFps,
      droppedFrames,
      severeSpikes,
      maxFrameMs,
      grade,
      gpuVendor: webglInfo?.vendor,
      gpuRenderer: webglInfo?.renderer,
      screenRes: `${window.innerWidth}x${window.innerHeight}`,
      dpr: window.devicePixelRatio,
      eventsLog: recordingRef.current.events,
      rawFramesMs: frames,
    }

    setAuditReport(report)
  }

  const downloadAuditJson = () => {
    if (!auditReport) return
    const jsonStr = JSON.stringify(auditReport, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `perf-audit-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const togglePauseAll = () => {
    if (isPausedAll) {
      animEngine.resume()
      setIsPausedAll(false)
    } else {
      animEngine.pause()
      setIsPausedAll(true)
    }
  }

  const triggerTestLerp = () => {
    animEngine.addLerp({
      current: 0,
      target: 100,
      speed: 0.05,
      onUpdate: () => {},
    })
  }

  const triggerCpuStressTest = () => {
    const start = performance.now()
    while (performance.now() - start < 150) {
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-full border border-white/20 bg-[#141314]/90 px-3.5 py-2 font-mono text-[11px] font-bold text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-white/40 active:scale-95"
        aria-label="Toggle Debug Performance Panel"
      >
        <span className={`inline-block size-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : fps >= 55 ? 'bg-green-400 animate-pulse' : fps >= 30 ? 'bg-yellow-400' : 'bg-red-500'}`} />
        <span>{isRecording ? `REC (${recordedTimeSec}s)` : `PERF ${fps} FPS`}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-16 left-4 z-[9999] w-[380px] max-w-[calc(100vw-32px)] rounded-2xl border border-white/15 bg-[#0c0d0e]/95 p-4 text-xs font-mono text-zinc-200 shadow-2xl backdrop-blur-xl max-[500px]:bottom-16 max-[500px]:left-2">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-white">⚡ DEBUG PROFILER</span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${tickerState === 'RUNNING' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                {tickerState}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex justify-between text-[10px] text-zinc-400">
              <span>FPS HISTORY (60s)</span>
              <span>MIN: {minFps} / MAX: {maxFps}</span>
            </div>
            <canvas
              ref={graphCanvasRef}
              width={348}
              height={44}
              className="w-full rounded-lg border border-white/10 bg-black/50"
            />
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl border border-white/5 bg-white/5 p-2.5">
              <div className="text-[10px] text-zinc-400">FRAME RATE</div>
              <div className={`text-base font-bold ${fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {fps} <span className="text-[10px] font-normal text-zinc-400">FPS</span>
              </div>
              <div className="text-[10px] text-zinc-400">{frameTime} ms / frame</div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/5 p-2.5">
              <div className="text-[10px] text-zinc-400">MEMORY (JS HEAP)</div>
              <div className="text-sm font-bold text-white">
                {heapSize || 'N/A'}
              </div>
              <div className="text-[10px] text-zinc-400">DOM: {domCount} elements</div>
            </div>
          </div>

          <div className="mb-3 space-y-1.5 rounded-xl border border-white/5 bg-white/5 p-2.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">ANIM ENGINE TASKS:</span>
              <span className="font-bold text-white">{activeTasks} active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">WEBGL CANVASES (AUTO GC):</span>
              <span className="font-bold text-white">{webglContextCount} active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">SCROLL POSITION:</span>
              <span className="font-bold text-white">{scrollPos} px</span>
            </div>
            {webglInfo && (
              <div className="mt-1.5 border-t border-white/10 pt-1.5">
                <div className="truncate text-zinc-400" title={webglInfo.renderer}>
                  GPU: <span className="text-zinc-200">{webglInfo.renderer}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-3 rounded-xl border border-red-500/20 bg-red-950/20 p-2.5 text-[10px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold text-red-300">🔴 RECORD & AUDIT JANK</span>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="rounded-lg bg-red-600 px-3 py-1 font-bold text-white shadow-md transition-all hover:bg-red-500 active:scale-95"
                >
                  START RECORDING
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="animate-pulse rounded-lg bg-yellow-500 px-3 py-1 font-bold text-black shadow-md transition-all hover:bg-yellow-400 active:scale-95"
                >
                  STOP & REPORT ({recordedTimeSec}s)
                </button>
              )}
            </div>

            {auditReport && (
              <div className="mt-2 space-y-1.5 rounded-lg border border-white/10 bg-black/60 p-2 text-[10px]">
                <div className="flex justify-between border-b border-white/10 pb-1 text-white">
                  <span>AUDIT RESULT ({auditReport.durationSec}s):</span>
                  <span className={`font-bold ${auditReport.grade.startsWith('A') ? 'text-green-400' : 'text-yellow-400'}`}>
                    GRADE {auditReport.grade}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>AVG FPS:</span>
                  <span className="font-bold text-white">{auditReport.avgFps} FPS</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>1% LOW FPS:</span>
                  <span className="font-bold text-yellow-300">{auditReport.low1PercentFps} FPS</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>DROPPED FRAMES (&gt;16.7ms):</span>
                  <span className={`font-bold ${auditReport.droppedFrames > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                    {auditReport.droppedFrames}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>JANK SPIKES (&gt;33.3ms):</span>
                  <span className={`font-bold ${auditReport.severeSpikes > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {auditReport.severeSpikes}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>EVENTS LOGGED:</span>
                  <span className="font-bold text-blue-300">{auditReport.eventsLog.length} events</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>LONGEST FRAME SPIKE:</span>
                  <span className="font-bold text-red-300">{auditReport.maxFrameMs} ms</span>
                </div>

                <button
                  onClick={downloadAuditJson}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-600/30 py-1.5 font-bold text-blue-200 transition-all hover:bg-blue-600/50 active:scale-95"
                >
                  📥 DOWNLOAD DETAILED AUDIT JSON
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                onClick={togglePauseAll}
                className={`rounded-lg px-2.5 py-1.5 font-bold transition-all ${isPausedAll ? 'bg-green-600 text-white' : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'}`}
              >
                {isPausedAll ? '▶ RESUME ENGINE' : '⏸ PAUSE ENGINE'}
              </button>
              <button
                onClick={triggerTestLerp}
                className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 font-bold text-white hover:bg-white/20"
              >
                ⚡ TEST LERP
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
              <button
                onClick={() => setLowGpuMode(!lowGpuMode)}
                className={`rounded-lg px-2.5 py-1.5 font-bold border transition-all ${lowGpuMode ? 'border-yellow-500/50 bg-yellow-500/20 text-yellow-300' : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'}`}
              >
                {lowGpuMode ? '⚡ LOW GPU: ON' : '⚡ LOW GPU: OFF'}
              </button>
              <button
                onClick={triggerCpuStressTest}
                className="rounded-lg border border-orange-500/30 bg-orange-500/20 px-2.5 py-1.5 font-bold text-orange-300 hover:bg-orange-500/30"
              >
                🔥 STRESS CPU (150ms)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
