import { ApplicationContextAction } from '../hooks/useApplicationContextReducer'
import { IDeviceInfo } from './device'
import { PopupParams, PopupType } from './popup'
import { IBoardMemberInfo } from './boardMember'
import { INominationDetail } from './nomination'

export interface IContextMethods {
  togglePopup: (popup: PopupType, params: PopupParams) => void
  updateBoardMember: (userInfo: IBoardMemberInfo | null) => void
  login: (onSuccess?: (userInfo: IBoardMemberInfo) => void) => Promise<void>
  logout: () => void
  dispatch: (action: ApplicationContextAction) => void
}

export interface IApplicationContextProps {
  device: IDeviceInfo
  popups: Partial<Record<PopupType, PopupParams>>
  boardMember: IBoardMemberInfo | null
  methods: IContextMethods
  nomination: INominationDetail | null
}
