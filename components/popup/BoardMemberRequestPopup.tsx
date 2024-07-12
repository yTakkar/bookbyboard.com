import React from 'react'
import CoreImage from '../core/CoreImage'
import Modal from '../modal/Modal'
import { APP_LOGO } from '../../constants/constants'
import appConfig from '../../config/appConfig'
import CoreLink from '../core/CoreLink'
import { ExternalLinkIcon } from '@heroicons/react/outline'

interface IBoardMemberRequestPopupProps {
  boardMemberEmail: string
  onClose: () => void
}

const BoardMemberRequestPopup: React.FC<IBoardMemberRequestPopupProps> = props => {
  const { boardMemberEmail, onClose } = props

  const label = `${appConfig.global.app.name} is a private group of book experts who nominate and vote on the best books monthly. If you are interested in becoming a board member, please fill out the form below.`

  return (
    <Modal dismissModal={() => onClose()} className="boardMemberRequestPopupOverrides">
      <div className="flex flex-col items-center px-4 pb-10">
        <CoreImage url={APP_LOGO.DEFAULT} alt={appConfig.global.app.name} className="w-24 mb-10 mt-4" disableLazyload />
        <div className="text-primaryText text-base mb-6 text-center">
          <div className="font-semibold mb-2">{boardMemberEmail} 👋</div>
          <div>{label}</div>
        </div>
        <div className="">
          <CoreLink
            url={appConfig.feedback.boardMemberRequestForm}
            isExternal
            className="bg-brand-primary text-white hover:bg-brand-primaryLight py-2 px-3 rounded font-semibold text-base flex items-center">
            Fill form <ExternalLinkIcon className="w-5 inline-block ml-1" />
          </CoreLink>
        </div>
      </div>
    </Modal>
  )
}

export default BoardMemberRequestPopup
