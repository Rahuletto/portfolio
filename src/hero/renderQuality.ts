export type RenderQuality = {
  name: 'high' | 'balanced' | 'low'
  pixelRatioCap: number
  postLongAxis: number
  simulationLongAxis: number
  samples: number
}

type DeviceProfile = {
  width: number
  height: number
  devicePixelRatio: number
  hardwareConcurrency: number
  deviceMemory?: number
  coarsePointer: boolean
}

const QUALITY_TIERS: readonly RenderQuality[] = [
  {
    name: 'high',
    pixelRatioCap: 2.0,
    postLongAxis: 720,
    simulationLongAxis: 200,
    samples: 4,
  },
  {
    name: 'balanced',
    pixelRatioCap: 1.5,
    postLongAxis: 600,
    simulationLongAxis: 180,
    samples: 2,
  },
  {
    name: 'low',
    pixelRatioCap: 1.25,
    postLongAxis: 480,
    simulationLongAxis: 144,
    samples: 0,
  },
]

export function getInitialRenderQuality(profile: DeviceProfile): RenderQuality {
  const viewportPixels = profile.width * profile.height
  const constrained = (
    profile.hardwareConcurrency <= 4
    || (profile.deviceMemory ?? 8) <= 4
  )

  if (constrained || viewportPixels > 4_000_000) {
    return QUALITY_TIERS[2]
  }

  if (profile.coarsePointer || viewportPixels > 2_200_000) {
    return QUALITY_TIERS[1]
  }

  return QUALITY_TIERS[0]
}

export class AdaptiveRenderQuality {
  private tierIndex: number
  private readonly bestTierIndex: number
  private averageFrameMs = 16.7
  private slowFrameCount = 0
  private stableFrameCount = 0
  private cooldownFrames = 0

  constructor(initial: RenderQuality) {
    this.tierIndex = QUALITY_TIERS.findIndex(
      (quality) => quality.name === initial.name,
    )
    this.bestTierIndex = this.tierIndex
  }

  get current(): RenderQuality {
    return QUALITY_TIERS[this.tierIndex]
  }

  sample(frameMs: number): RenderQuality | null {
    if (!Number.isFinite(frameMs) || frameMs <= 0 || frameMs > 80) return null

    this.averageFrameMs += (frameMs - this.averageFrameMs) * 0.08
    if (this.cooldownFrames > 0) {
      this.cooldownFrames -= 1
      this.slowFrameCount = 0
      this.stableFrameCount = 0
      return null
    }

    if (this.averageFrameMs > 20.5) {
      this.slowFrameCount += 1
      this.stableFrameCount = 0
    } else if (this.averageFrameMs < 16.2) {
      this.stableFrameCount += 1
      this.slowFrameCount = Math.max(0, this.slowFrameCount - 2)
    } else {
      this.slowFrameCount = Math.max(0, this.slowFrameCount - 1)
      this.stableFrameCount = Math.max(0, this.stableFrameCount - 1)
    }

    if (
      this.slowFrameCount >= 48
      && this.tierIndex < QUALITY_TIERS.length - 1
    ) {
      this.tierIndex += 1
      this.slowFrameCount = 0
      this.stableFrameCount = 0
      this.cooldownFrames = 120
      return this.current
    }

    if (
      this.stableFrameCount >= 420
      && this.tierIndex > this.bestTierIndex
    ) {
      this.tierIndex -= 1
      this.slowFrameCount = 0
      this.stableFrameCount = 0
      this.cooldownFrames = 120
      return this.current
    }

    return null
  }
}
