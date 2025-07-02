import { RefObject, useState } from 'react'

type Props = {
  ref: RefObject<HTMLCanvasElement>
}

export const useWebGpuSetting = () => {
  const [_message, setMessage] = useState<string>(
    'WebGPU를 사용할 수 있는 환경인지 확인하는 중입니다.'
  )

  const requestAdapter = async () => {
    const adapter = await window.navigator.gpu.requestAdapter()
    if (!adapter) {
      setMessage('WebGPU를 사용할 수 없는 환경입니다.')
      return
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
      return null
    }
    return ref.current.getContext('webgpu') as GPUCanvasContext
  }

  return {
    _message,
    requestAdapter,
    requestDevice,
    createContext,
  }
}
