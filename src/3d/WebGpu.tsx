'use client'

import { useEffect, useRef } from 'react'
import { useWebGpuSetting } from './useWebGpuSetting'

export default function WebGpu() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const {
    message,
    requestAdapter,
    requestDevice,
    createContext,
    contextConfig,
  } = useWebGpuSetting()

  const handleSetting = async () => {
    try {
      const adapter = await requestAdapter()
      const device = await requestDevice(adapter)
      const context = createContext({ ref: canvasRef })
      contextConfig({ context, device })
    } catch (error) {
      console.error('WebGPU 초기화 실패 : ', error)
    }
  }

  useEffect(() => {
    handleSetting()
  }, [])

  const vertexShader = () => {
    return `
    @vertex
    fn vs_main(@location(0) position: vec2f) -> @builtin(position) vec4f {
      return vec4f(position, 0.0, 1.0); 
    }`
  }

  const fragmentShader = () => {
    return `
      @fragment
      fn fs_main() -> @location(0) vec4f {
        return vec4f(1.0, 0.0, 0.0, 1.0);
      }
    `
  }

  const triangleVertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5])

  const createVertexBuffer = (device: GPUDevice) => {
    const buffer = device.createBuffer({
      size: triangleVertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(buffer, 0, triangleVertices)
    return buffer
  }

  const createRenderPipeline = (device: GPUDevice, buffer: GPUBuffer) => {
    const vertexModule = device.createShaderModule({
      code: vertexShader(),
    })
    const fragmentModule = device.createShaderModule({
      code: fragmentShader(),
    })

    return device.createRenderPipeline({
      vertex: {
        module: vertexModule,
        entryPoint: 'vs_main',
      },
      fragment: {
        module: fragmentModule,
        entryPoint: 'fs_main',
        targets: [{ format: 'bgra8unorm' }],
      },
      primitive: {
        topology: 'triangle-list',
      },
      layout: 'auto',
    })
  }

  return (
    <div className='border-amber-200 border rounded-md'>
      <canvas className='w-[1000px]' ref={canvasRef} width={800} height={600} />
      {message}
    </div>
  )
}
