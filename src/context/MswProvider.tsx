'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const initMSW = async () => {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('../mocks/browser')
        await worker.start()
      }
      setMswReady(true)
    }

    initMSW()
  }, [])

  if (!mswReady) {
    return null
  }

  return <>{children}</>
}