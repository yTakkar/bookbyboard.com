import { Dispatch, useReducer } from 'react'
import { defaultApplicationContext } from '../components/ApplicationContext'
import { IApplicationContextProps } from '../interface/applicationContext'
import { IDeviceInfo } from '../interface/device'
import { IBoardMemberInfo } from '../interface/boardMember'
import { PopupParams, PopupType } from '../interface/popup'
import { INominationDetail } from '../interface/nomination'

export type ApplicationContextAction =
  | {
      type: 'UPDATE_DEVICE'
      payload: IDeviceInfo
    }
  | {
      type: 'RESET'
    }
  | {
      type: 'UPDATE_BOARD_MEMBER'
      payload: IBoardMemberInfo | null
    }
  | {
      type: 'TOGGLE_POPUP'
      payload: {
        popup: PopupType
        params: PopupParams
      }
    }
  | {
      type: 'UPDATE_NOMINATION'
      payload: INominationDetail | null
    }

const applicationReducer = (
  state: IApplicationContextProps,
  action: ApplicationContextAction
): IApplicationContextProps => {
  switch (action.type) {
    case 'UPDATE_DEVICE': {
      return {
        ...state,
        device: action.payload,
      }
    }

    case 'UPDATE_BOARD_MEMBER': {
      return {
        ...state,
        boardMember: action.payload,
      }
    }

    case 'RESET': {
      const { device } = state
      return {
        ...defaultApplicationContext,
        device: device,
      }
    }

    case 'TOGGLE_POPUP': {
      const { popup, params } = action.payload
      return {
        ...state,
        popups: {
          [popup]: params,
        },
      }
    }

    case 'UPDATE_NOMINATION': {
      return {
        ...state,
        nomination: action.payload,
      }
    }

    default:
      return state
  }
}

const useApplicationContextReducer = (): {
  applicationContext: IApplicationContextProps
  dispatchApplicationContext: Dispatch<ApplicationContextAction>
} => {
  const [applicationContext, dispatchApplicationContext] = useReducer(applicationReducer, defaultApplicationContext)

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContextReducer
