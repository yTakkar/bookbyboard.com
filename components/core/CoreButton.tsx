import React, { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import { LoaderCustomIcon } from '../custom-icons'
import { useRouter } from 'next/router'

export enum CoreButtonType {
  SOLID_PRIMARY = 'SOLID_PRIMARY',
  SOLID_SECONDARY = 'SOLID_SECONDARY',
  OUTLINE_PRIMARY = 'OUTLINE_PRIMARY',
  OUTLINE_SECONDARY = 'OUTLINE_SECONDARY',
  NONE = 'NONE',
}

export enum CoreButtonSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export interface ICoreButtonProps {
  label: ReactNode
  type: CoreButtonType
  size: CoreButtonSize
  icon?: any
  className?: string
  style?: CSSProperties
  disabled?: boolean
  url?: string
  onClick?: (e: any) => void
  loading?: boolean
}

const CoreButton: React.FC<ICoreButtonProps> = props => {
  const { label, type, size, icon: IconComponent, className, style, disabled, url, onClick, loading } = props

  const router = useRouter()

  const renderChildren = () => (
    <React.Fragment>
      {label}
      {IconComponent ? (
        <IconComponent
          className={classnames({
            'w-4 ml-1': size === CoreButtonSize.SMALL,
            'w-5 ml-1': size === CoreButtonSize.MEDIUM || size === CoreButtonSize.LARGE,
          })}
        />
      ) : null}
      {loading ? <LoaderCustomIcon className="ml-2 h-5 w-5" /> : null}
    </React.Fragment>
  )

  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={classnames(
        'rounded-md font-semibold focus:outline-none focus:ring-2 transition duration-500 ease-in-out coreLink select-none',
        {
          'cursor-auto': isDisabled,

          // types
          'bg-brand-primary text-white hover:bg-brand-primaryLight focus:ring-brand-primary border':
            type === CoreButtonType.SOLID_PRIMARY && !isDisabled,
          'bg-gray-200 border-gray-200 text-blackLight': type === CoreButtonType.SOLID_PRIMARY && isDisabled,

          'bg-white text-brand-primary border-brand-primary hover:bg-denim focus:ring-brand-primary focus:ring-opacity-30 border':
            type === CoreButtonType.SOLID_SECONDARY && !isDisabled,
          'bg-white border text-blackLight border-gray-600 ': type === CoreButtonType.SOLID_SECONDARY && isDisabled,

          'hover:text-white hover:bg-brand-primary focus:ring-brand-primary':
            type === CoreButtonType.OUTLINE_PRIMARY && !isDisabled,
          'text-blackLight border border-white hover:border-brand-primary focus:ring-brand-primary':
            type === CoreButtonType.OUTLINE_PRIMARY && isDisabled,

          'hover:bg-denim text-brand-primary focus:ring-brand-primary focus:ring-opacity-50':
            type === CoreButtonType.OUTLINE_SECONDARY,

          // sizes
          'py-1 px-2.5 text-sm': size === CoreButtonSize.SMALL,
          'py-2 px-4 text-sm': size === CoreButtonSize.MEDIUM,
          'py-3 px-6 text-base': size === CoreButtonSize.LARGE,
        },
        className
      )}
      style={style}
      onClick={e => {
        if (url) {
          router.push(url)
        }
        if (onClick) {
          onClick(e)
        }
      }}>
      <span className="flex justify-center items-center ">{renderChildren()}</span>
    </button>
  )
}

export default CoreButton
