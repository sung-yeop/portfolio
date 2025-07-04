'use client'

import { CreateObject } from '@/CreateObject'
import { useThreeSetting } from '@/useThreeSetting'
import { useEffect } from 'react'

export default function Home() {
  const { canvasRef, init, start, addMeshToScene, addMainCharacterToScene } =
    useThreeSetting()

  useEffect(() => {
    init({
      fov: 75,
      aspectRatio: window.innerWidth / window.innerHeight,
      nearClippingPlane: 0.1,
      farClippingPlane: 1000,
    })
    addMainCharacterToScene(CreateObject.createMainCharacter())
    addMeshToScene(CreateObject.createGround())
    start()
  }, [])

  return (
    <div className='min-h-screen'>
      <canvas ref={canvasRef} className='w-full h-screen' />
    </div>
  )
}
