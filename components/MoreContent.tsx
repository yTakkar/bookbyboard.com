import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { ReactNode, useState } from 'react'
import classnames from 'classnames'

interface IMoreContentProps {
  children: ReactNode
}

const MoreContent: React.FC<IMoreContentProps> = props => {
  const { children } = props

  const [showGradient, toggleGradient] = useState(true)

  return (
    <div>
      <div
        className={classnames({
          moreContent: showGradient,
        })}>
        {children}
      </div>
      <div
        className={classnames('flex justify-end', {
          'mt-2': !showGradient,
        })}>
        <div
          className="flex justify-center items-center text-sm cursor-pointer hover:underline text-brand-primary"
          onClick={() => toggleGradient(!showGradient)}>
          <span>{showGradient ? 'View More' : 'Hide'}</span>
          {showGradient ? <ChevronDownIcon className="w-4 ml-1" /> : <ChevronUpIcon className="w-4 ml-1" />}
        </div>
      </div>
    </div>
  )
}

export default MoreContent
