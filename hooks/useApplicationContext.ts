import { useEffect } from 'react'
import { getDeviceInfo } from '../utils/applicationContext'
import useApplicationContextReducer from './useApplicationContextReducer'
import useOrientation from './useOrientation'
import { IContextMethods } from '../interface/applicationContext'
import {
  deleteLocalBoardMemberInfo,
  getLocalBoardMemberInfo,
  prepareBoardMemberInfo,
  setLocalBoardMemberInfo,
} from '../utils/boardMember'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import { signInWithGoogle } from '../firebase/auth/auth'
import { vibrate } from '../utils/common'
import { toastError, toastSuccess } from '../components/Toaster'
import { addBoardMember } from '../firebase/store/boardMember'

const useApplicationContext = () => {
  const { applicationContext, dispatchApplicationContext } = useApplicationContextReducer()
  const { isLandscapeMode } = useOrientation()

  useEffect(() => {
    dispatchApplicationContext({
      type: 'UPDATE_DEVICE',
      payload: getDeviceInfo(),
    })
  }, [isLandscapeMode, dispatchApplicationContext])

  const togglePopup: IContextMethods['togglePopup'] = (popup, params) => {
    dispatchApplicationContext({
      type: 'TOGGLE_POPUP',
      payload: {
        popup,
        params,
      },
    })
  }

  const updateBoardMember: IContextMethods['updateBoardMember'] = _boardMemberInfo => {
    const userInfo = _boardMemberInfo
    dispatchApplicationContext({
      type: 'UPDATE_BOARD_MEMBER',
      payload: userInfo,
    })
    deleteLocalBoardMemberInfo()
    if (userInfo !== null) {
      setLocalBoardMemberInfo(userInfo!)
    }
  }

  const login: IContextMethods['login'] = async onSuccess => {
    try {
      const user = await signInWithGoogle()
      const preparedUserInfo = await prepareBoardMemberInfo(user)
      const { boardMemberInfo, newUser } = await addBoardMember(preparedUserInfo)
      vibrate()
      updateBoardMember(boardMemberInfo)
      appAnalytics.setUser(boardMemberInfo)
      appAnalytics.sendEvent({
        action: newUser ? AnalyticsEventType.SIGNUP : AnalyticsEventType.LOGIN,
        extra: {
          method: 'Google',
        },
      })
      toastSuccess(newUser ? 'Signup successful!' : 'Login successful!')
      onSuccess?.(boardMemberInfo)
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') {
        appAnalytics.captureException(e)
        toastError('Failed to login!')
      }
    }
  }

  const logout: IContextMethods['logout'] = () => {
    updateBoardMember(null)
    deleteLocalBoardMemberInfo()
    appAnalytics.removeUser()
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LOGOUT,
    })
  }

  useEffect(() => {
    const localUserInfo = getLocalBoardMemberInfo()
    if (localUserInfo) {
      updateBoardMember(localUserInfo)
      appAnalytics.setUser(localUserInfo)
    }
  }, [])

  applicationContext.methods = {
    togglePopup,
    updateBoardMember: updateBoardMember,
    login,
    logout,
    dispatch: dispatchApplicationContext,
  }

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContext
