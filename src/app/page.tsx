'use client'

import { CreateObject } from '@/CreateObject'
import { useKeyboardListener } from '@/useKeyboardListener'
import { useThreeSetting } from '@/useThreeSetting'
import { useEffect } from 'react'

export default function Home() {
  const { canvasRef, init, start, addMeshToScene } = useThreeSetting()
  useKeyboardListener()

  useEffect(() => {
    init({
      fov: 75,
      aspectRatio: window.innerWidth / window.innerHeight,
      nearClippingPlane: 0.1,
      farClippingPlane: 1000,
    })
    const mesh = CreateObject.createMainCharacter()
    const ground = CreateObject.createGround()
    addMeshToScene(mesh)
    addMeshToScene(ground)
    start()
  }, [])

  return (
    <div className='min-h-screen'>
      <canvas ref={canvasRef} className='w-full h-screen' />
    </div>
  )
}
