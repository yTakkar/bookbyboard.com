import React, { useContext } from 'react'
import { DynamicChangeAvatarPopup, DynamicBoardMemberRequestPopup, DynamicSelectBookPopup } from '../dynamicComponents'
import ApplicationContext from '../ApplicationContext'
import { PopupType } from '../../interface/popup'

function PopupRenderer() {
  const applicationContext = useContext(ApplicationContext)
  const { popups, methods } = applicationContext

  const popupComponentMap: Record<PopupType, any> = {
    [PopupType.BOARD_MEMBER_REQUEST]: DynamicBoardMemberRequestPopup,
    [PopupType.CHANGE_AVATAR]: DynamicChangeAvatarPopup,
    [PopupType.SELECT_BOOK]: DynamicSelectBookPopup,
  }

  const popupMemo = (
    <div>
      {Object.keys(popups).map(popupId => {
        const popup = popupId as PopupType
        const Komponent = popupComponentMap[popup]
        const params = popups[popup]

        if (!params) {
          return null
        }

        return (
          <Komponent
            key={popupId}
            {...params}
            onClose={() => {
              methods.togglePopup(popup, null)
            }}
          />
        )
      })}
    </div>
  )

  return popupMemo
}

export default PopupRenderer
