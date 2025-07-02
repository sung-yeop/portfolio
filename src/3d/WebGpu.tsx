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

  return (
    <div className='border-amber-200 border rounded-md'>
      <canvas className='w-[1000px]' ref={canvasRef} width={800} height={600} />
      {message}
    </div>
  )
}
