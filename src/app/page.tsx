'use client'

import { useThreeSetting } from '@/useThreeSetting'
import { useEffect } from 'react'

export default function Home() {
  const { canvasRef, createSetting } = useThreeSetting()

  useEffect(() => {
    createSetting({
      fov: 75,
      aspectRatio: window.innerWidth / window.innerHeight,
      nearClippingPlane: 0.1,
      farClippingPlane: 1000,
    })
  }, [])

  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        <canvas ref={canvasRef} className='w-full h-screen' />
      </div>
    </div>
  )
}
