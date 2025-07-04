'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const useThreeSetting = () => {
  const threeRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
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
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    threeRef.current = {
      scene,
      camera,
      renderer,
      controls,
    }
  }

  const start = () => {
    const animate = () => {
      requestAnimationFrame(animate)
      threeRef.current?.controls.update()
      threeRef.current?.renderer.render(
        threeRef.current.scene,
        threeRef.current.camera
      )
    }
    animate()
  }

  const addMeshToScene = (
    mesh:
      | THREE.Mesh<
          THREE.SphereGeometry | THREE.PlaneGeometry,
          THREE.MeshBasicMaterial,
          THREE.Object3DEventMap
        >
      | THREE.GridHelper
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
