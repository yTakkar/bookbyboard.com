import appConfig from '../../config/appConfig'
import { IBoardMemberInfo } from '../../interface/boardMember'
import { getLocalBoardMemberInfo } from '../../utils/boardMember'
import { IGA, IGAEventParams, IGAPageViewParams } from './interface'

class GoogleAnalytics implements IGA {
  public async init(): Promise<void> {
    const localUserInfo = getLocalBoardMemberInfo()
    if (localUserInfo) {
      await ga('config', {
        user_id: localUserInfo.id,
      })
    }
  }

  public async pageView(params: IGAPageViewParams): Promise<void> {
    const options = {
      page_title: params.pageTitle,
      page_location: `${appConfig.global.baseUrl}${params.pagePath}`,
      page_path: params.pagePath,
    }

    ga('event', 'page_view', options)
    ga('set', options)
  }

  public setUser(userInfo: IBoardMemberInfo): void {
    ga('set', {
      user_id: userInfo.id,
    })
  }

  public removeUser(): void {
    ga('set', {
      user_id: '',
    })
  }

  public event(params: IGAEventParams): void {
    ga('event', params.action, {
      event_category: params.category || '',
      event_label: params.label || '',
      ...(params.extra || {}),
    })
  }
}

const googleAnalytics = new GoogleAnalytics()
export default googleAnalytics
