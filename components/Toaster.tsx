import React, { useContext, useEffect, useState } from 'react'
import ApplicationContext from './ApplicationContext'
import { DynamicToaster } from './dynamicComponents'
import { dynamicToast } from './dynamicModules'
import { ToastPosition } from 'react-hot-toast'

export const toastSuccess = (message: string) => {
  dynamicToast().then(mod => mod.success(message))
}

export const toastError = (message: string) => {
  dynamicToast().then(mod => mod.error(message))
}

export const toastDismiss = () => {
  dynamicToast().then(mod => mod.dismiss())
}

export const customToast = (
  message: string,
  {
    duration,
    icon,
    position,
  }: {
    duration?: number
    icon?: JSX.Element
    position?: ToastPosition
  }
) => {
  dynamicToast().then(mod =>
    mod(message, {
      duration,
      icon,
      position,
    })
  )
}

interface IToasterProps {}

const Toaster: React.FC<IToasterProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isSm },
  } = applicationContext

  const [loadToaster, setLoadToaster] = useState(false)

  useEffect(() => {
    setLoadToaster(true)
  }, [])

  if (loadToaster) {
    return (
      <DynamicToaster
        position={isSm ? 'bottom-center' : 'bottom-left'}
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '16px 16px',
            maxWidth: 'none',
          },
          success: {
            duration: isSm ? 2500 : 4000,
          },
          error: {
            duration: isSm ? 2000 : 3000,
          },
        }}
      />
    )
  }

  return null
}

export default Toaster
