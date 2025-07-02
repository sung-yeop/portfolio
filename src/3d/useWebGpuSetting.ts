import { useState } from 'react'

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
    if (!device) {
      setMessage('Device를 불러올 수 없습니다.')
    }
    setMessage('WebGPU 초기화 완료')
    return device
  }

  return {
    _message,
    requestAdapter,
    requestDevice,
  }
}
