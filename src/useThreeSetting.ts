'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useKeyboardListener } from './useKeyboardListener'

export const useThreeSetting = () => {
  const threeRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
  } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const keyRefs = useKeyboardListener()
  const mainCharacterRef = useRef<THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  > | null>(null)

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

      if (!mainCharacterRef.current) {
        throw new Error('메인 캐릭터가 설정되지 않았습니다!')
      }

      if (keyRefs.current['ArrowUp'] || keyRefs.current['KeyW']) {
        mainCharacterRef.current.position.z -= 1
      }
      if (keyRefs.current['ArrowDown'] || keyRefs.current['KeyS']) {
        mainCharacterRef.current.position.z += 1
      }
      if (keyRefs.current['ArrowLeft'] || keyRefs.current['KeyA']) {
        mainCharacterRef.current.position.x -= 1
      }
      if (keyRefs.current['ArrowRight'] || keyRefs.current['KeyD']) {
        mainCharacterRef.current.position.x += 1
      }

      threeRef.current?.controls.update()
      threeRef.current?.renderer.render(
        threeRef.current.scene,
        threeRef.current.camera
      )
    }
    animate()
  }

  const addMainCharacterToScene = (
    mesh: THREE.Mesh<
      THREE.SphereGeometry,
      THREE.MeshBasicMaterial,
      THREE.Object3DEventMap
    >
  ) => {
    mainCharacterRef.current = mesh
    threeRef.current?.scene.add(mesh)
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
    addMainCharacterToScene,
  }
}
