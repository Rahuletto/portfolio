import * as THREE from 'three'
import type { Point, Size } from './fluidPolicy.ts'
import {
  advectionFragmentShader,
  clearFragmentShader,
  curlFragmentShader,
  divergenceFragmentShader,
  fullscreenVertexShader,
  pressureFragmentShader,
  projectionFragmentShader,
  splatFragmentShader,
} from './fluidShaders.ts'

type PingPongTarget = {
  read: THREE.WebGLRenderTarget
  write: THREE.WebGLRenderTarget
  swap: () => void
  dispose: () => void
}

export type FluidStepInput = {
  pointer: Point
  pointerDelta: Point
  viewport: Size
  inject: boolean
}

const PRESSURE_ITERATIONS = 4

export function simulationSizeChanged(current: Size, next: Size): boolean {
  return current.width !== next.width || current.height !== next.height
}

function makeTarget(width: number, height: number): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
  })
}

function makePingPong(width: number, height: number): PingPongTarget {
  const target = {
    read: makeTarget(width, height),
    write: makeTarget(width, height),
    swap() {
      const previousRead = target.read
      target.read = target.write
      target.write = previousRead
    },
    dispose() {
      target.read.dispose()
      target.write.dispose()
    },
  }

  return target
}

function makeMaterial(
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform>,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: fullscreenVertexShader,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  })
}

export class FluidSimulation {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.Camera()
  private readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private readonly texelSize = new THREE.Vector2(0.5, 0.5)
  private size: Size = { width: 2, height: 2 }
  private velocity = makePingPong(2, 2)
  private pressure = makePingPong(2, 2)
  private curl = makeTarget(2, 2)
  private divergence = makeTarget(2, 2)

  private readonly curlMaterial = makeMaterial(curlFragmentShader, {
    uVelocity: { value: null },
    uTexelSize: { value: this.texelSize },
  })

  private readonly splatMaterial = makeMaterial(splatFragmentShader, {
    uVelocity: { value: null },
    uCurl: { value: null },
    uTexelSize: { value: this.texelSize },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uPointerDelta: { value: new THREE.Vector2() },
    uCurlStrength: { value: 0 },
    uSplatRadius: { value: 0.003 },
    uSplatForce: { value: 3000 },
    uInject: { value: 0 },
  })

  private readonly divergenceMaterial = makeMaterial(divergenceFragmentShader, {
    uVelocity: { value: null },
    uTexelSize: { value: this.texelSize },
  })

  private readonly clearMaterial = makeMaterial(clearFragmentShader, {})

  private readonly pressureMaterial = makeMaterial(pressureFragmentShader, {
    uPressure: { value: null },
    uDivergence: { value: null },
    uTexelSize: { value: this.texelSize },
  })

  private readonly projectionMaterial = makeMaterial(projectionFragmentShader, {
    uVelocity: { value: null },
    uPressure: { value: null },
    uTexelSize: { value: this.texelSize },
  })

  private readonly advectionMaterial = makeMaterial(advectionFragmentShader, {
    uProjectedVelocity: { value: null },
    uTexelSize: { value: this.texelSize },
    uDissipation: { value: 3 },
  })

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.curlMaterial)
    this.scene.add(this.mesh)
  }

  get velocityTexture(): THREE.Texture {
    return this.velocity.read.texture
  }

  get simulationSize(): Size {
    return this.size
  }

  resize(next: Size): void {
    if (!simulationSizeChanged(this.size, next)) return

    this.velocity.dispose()
    this.pressure.dispose()
    this.curl.dispose()
    this.divergence.dispose()

    this.size = next
    this.texelSize.set(1 / next.width, 1 / next.height)
    this.velocity = makePingPong(next.width, next.height)
    this.pressure = makePingPong(next.width, next.height)
    this.curl = makeTarget(next.width, next.height)
    this.divergence = makeTarget(next.width, next.height)
  }

  step(input: FluidStepInput): void {
    this.curlMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    this.render(this.curlMaterial, this.curl)

    this.splatMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    this.splatMaterial.uniforms.uCurl.value = this.curl.texture
    this.splatMaterial.uniforms.uResolution.value.set(
      input.viewport.width,
      input.viewport.height,
    )
    this.splatMaterial.uniforms.uPointer.value.set(
      input.pointer.x * input.viewport.width,
      input.pointer.y * input.viewport.height,
    )
    this.splatMaterial.uniforms.uPointerDelta.value.set(
      input.pointerDelta.x * input.viewport.width,
      input.pointerDelta.y * input.viewport.height,
    )
    this.splatMaterial.uniforms.uInject.value = input.inject ? 1 : 0
    this.render(this.splatMaterial, this.velocity.write)
    this.velocity.swap()

    this.divergenceMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    this.render(this.divergenceMaterial, this.divergence)

    this.render(this.clearMaterial, this.pressure.read)

    this.pressureMaterial.uniforms.uDivergence.value = this.divergence.texture
    for (let index = 0; index < PRESSURE_ITERATIONS; index += 1) {
      this.pressureMaterial.uniforms.uPressure.value = this.pressure.read.texture
      this.render(this.pressureMaterial, this.pressure.write)
      this.pressure.swap()
    }

    this.projectionMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    this.projectionMaterial.uniforms.uPressure.value = this.pressure.read.texture
    this.render(this.projectionMaterial, this.velocity.write)
    this.velocity.swap()

    this.advectionMaterial.uniforms.uProjectedVelocity.value = this.velocity.read.texture
    this.render(this.advectionMaterial, this.velocity.write)
    this.velocity.swap()
  }

  clearVelocity(): void {
    this.render(this.clearMaterial, this.velocity.read)
    this.render(this.clearMaterial, this.velocity.write)
  }

  dispose(): void {
    this.velocity.dispose()
    this.pressure.dispose()
    this.curl.dispose()
    this.divergence.dispose()
    this.mesh.geometry.dispose()
    this.curlMaterial.dispose()
    this.splatMaterial.dispose()
    this.divergenceMaterial.dispose()
    this.clearMaterial.dispose()
    this.pressureMaterial.dispose()
    this.projectionMaterial.dispose()
    this.advectionMaterial.dispose()
  }

  private render(
    material: THREE.ShaderMaterial,
    target: THREE.WebGLRenderTarget,
  ): void {
    this.mesh.material = material
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
  }
}
