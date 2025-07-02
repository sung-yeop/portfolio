'use client'

import { RefObject, useState } from 'react'

type Props = {
  ref: RefObject<HTMLCanvasElement | null>
}

export const useWebGpuSetting = () => {
  const [message, setMessage] = useState<string>(
    'WebGPU를 사용할 수 있는 환경인지 확인하는 중입니다.'
  )

  const requestAdapter = async () => {
    const adapter = await window.navigator.gpu.requestAdapter()
    if (!adapter) {
      setMessage('WebGPU를 사용할 수 없는 환경입니다.')
      throw Error('어뎁더 로딩 실패')
    }
    setMessage('Adapter 불러오기 완료')
    return adapter
  }

  const requestDevice = async (adapter: GPUAdapter) => {
    const device = await adapter.requestDevice()
    setMessage('WebGPU 초기화 완료')
    return device
  }

  const createContext = ({ ref }: Props) => {
    if (!ref.current) {
      setMessage('Canvas 요소를 찾을 수 없습니다.')
      throw new Error('캔버스 요소 찾기 실패')
    }
    return ref.current.getContext('webgpu') as GPUCanvasContext
  }

  const contextConfig = ({
    context,
    device,
  }: {
    context: GPUCanvasContext
    device: GPUDevice
  }) => {
    const format = navigator.gpu.getPreferredCanvasFormat() // 브라우저에서 최적화된 포맷 가져오기
    context.configure({ device, format, alphaMode: 'opaque' })
  }

  return {
    message,
    requestAdapter,
    requestDevice,
    createContext,
    contextConfig,
  }
}
