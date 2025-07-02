import { useState } from 'react'

export const useWebGpuSetting = () => {
  const [_message, setMessage] = useState<string>(
    'WebGPU를 사용할 수 있는 환경인지 확인하는 중입니다.'
  )
  let adapter: GPUAdapter | null = null

  const requestAdapter = async () => {
    const response = await window.navigator.gpu.requestAdapter()
    if (!response) {
      setMessage('WebGPU를 사용할 수 없는 환경입니다.')
      return
    }
    adapter = response
  }

  return {
    _message,
    adapter,
    requestAdapter,
  }
}
