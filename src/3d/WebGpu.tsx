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
    const adapter = await requestAdapter()
    const device = await requestDevice(adapter)
    const context = createContext({ ref: canvasRef })
    contextConfig({ context, device })
  }

  useEffect(() => {
    handleSetting()
  }, [])

  return (
    <div className='border-amber-200 border rounded-md'>
      <canvas className='w-[1000px]' ref={canvasRef} />
      {message}
    </div>
  )
}
