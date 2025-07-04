'use client'

import { useRef } from 'react'
import * as THREE from 'three'

export const useThreeSetting = () => {
  const threeRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
  } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const createScene = () => {
    return new THREE.Scene()
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

  const init = ({
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
    const scene = createScene()
    const camera = createCamera({
      fov,
      aspectRatio,
      nearClippingPlane,
      farClippingPlane,
    })
    camera.position.z = 30
    const renderer = createRenderer()
    threeRef.current = {
      scene,
      camera,
      renderer,
    }
  }

  const start = () => {
    threeRef.current?.renderer.render(
      threeRef.current.scene,
      threeRef.current.camera
    )
  }

  const addMeshToScene = (
    mesh: THREE.Mesh<
      THREE.SphereGeometry | THREE.PlaneGeometry,
      THREE.MeshBasicMaterial,
      THREE.Object3DEventMap
    >
  ) => {
    threeRef.current?.scene.add(mesh)
  }

  return {
    canvasRef,
    init,
    start,
    addMeshToScene,
  }
}
