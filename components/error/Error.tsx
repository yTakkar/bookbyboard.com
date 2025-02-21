import React from 'react'
import { prepareImageUrl } from '../../utils/image'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'

interface IErrorProps {}

const Error: React.FC<IErrorProps> = () => {
  return (
    <div>
      <div>
        <div className="flex flex-col items-center justify-center mt-20">
          <CoreImage
            url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
            alt="Page not found"
            className="w-52 min-h-52 lg:w-60"
            useTransparentPlaceholder
          />
          <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto font-bold">
            Site under maintenance.
          </div>
          <div className="text-center mt-1 w-[320px] md:w-auto">{`We're working on a few fixes and updates. Sorry for the Inconvenience.`}</div>
        </div>
        <div className="text-center mt-2">
          <CoreButton
            label="Refresh"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={() => {
              window.location.reload()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Error
