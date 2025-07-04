import { useEffect, useRef } from 'react'

export const useKeyboardListener = () => {
  const keysRef = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      keysRef.current[event.code] = true
      console.log('Key pressed:', event.code)
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.code] = false
      console.log('Key released:', event.code)
    }
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keysRef
}
