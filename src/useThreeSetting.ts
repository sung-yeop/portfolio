'use client'

import { useRef, useState } from 'react'
import * as THREE from 'three'

export const useThreeSetting = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const createScene = () => {
    setScene(new THREE.Scene())
  }

  const createCamera = ({
    fov,
    aspectRatio,
    nearClippingPlane,
    farClippingPlane,
  }: {
    fov: number
    aspectRatio: number
    nearClippingPlane: number
    farClippingPlane: number
  }) => {
    return new THREE.PerspectiveCamera(
      fov,
      aspectRatio,
      nearClippingPlane,
      farClippingPlane
    )
  }

  const createRenderer = () => {
    if (!canvasRef || !canvasRef.current) {
      throw new Error('CanvasRef가 먼저 설정되어야 합니다.')
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    return renderer
  }

  const createSetting = ({
    fov,
    aspectRatio,
    nearClippingPlane,
    farClippingPlane,
  }: {
    fov: number
    aspectRatio: number
    nearClippingPlane: number
    farClippingPlane: number
  }) => {
    createScene()
    createCamera({ fov, aspectRatio, nearClippingPlane, farClippingPlane })
    createRenderer()
  }

  return {
    scene,
    canvasRef,
    createSetting,
  }
}
