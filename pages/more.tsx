import {
  UserIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LogoutIcon,
  LoginIcon,
  HomeIcon,
  InformationCircleIcon,
  StatusOnlineIcon,
  CalendarIcon,
} from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { GetStaticProps, NextPage } from 'next'
import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import classnames from 'classnames'
import PageContainer from '../components/PageContainer'
import CoreLink from '../components/core/CoreLink'
import { toastSuccess } from '../components/Toaster'
import {
  getAboutPageUrl,
  getHomePageUrl,
  getPrivacyPageUrl,
  getMemberPageUrl,
  getTnCPageUrl,
  getNominationPageUrl,
  getSelectedBookPageUrl,
} from '../utils/routes'
import { MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import ApplicationContext from '../components/ApplicationContext'
import { useRouter } from 'next/router'
import { prepareMorePageSeo } from '../utils/seo/pages/more'
import CoreImage from '../components/core/CoreImage'
import { APP_LOGO } from '../constants/constants'
import { getPreviousNominationId } from '../utils/nomination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const MorePage: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const { boardMember: user, methods } = applicationContext

  const router = useRouter()

  const LINKS = [
    {
      label: 'Home',
      url: getHomePageUrl(),
      icon: HomeIcon,
      show: true,
    },
    {
      label: 'Profile',
      subTitle: 'Manage your profile',
      url: getHomePageUrl(),
      icon: UserIcon,
      show: !!user,
    },
    {
      label: 'Live nomination',
      subTitle: `Nominate & vote for this month`,
      url: getNominationPageUrl(),
      icon: StatusOnlineIcon,
      show: !!user,
    },
    {
      label: 'Login',
      subTitle: 'Login to sync your data',
      url: null,
      icon: LoginIcon,
      show: !user,
      onClick: () => {
        methods.login(userInfo => {
          router.push(getMemberPageUrl(userInfo.username))
        })
      },
    },
    {
      label: 'Past selections',
      subTitle: `Check out past book selections`,
      url: getSelectedBookPageUrl(getPreviousNominationId()),
      icon: CalendarIcon,
      show: true,
    },
    {
      label: `About Us`,
      url: getAboutPageUrl(),
      icon: InformationCircleIcon,
      show: true,
    },
    {
      label: 'Privacy Policy',
      url: getPrivacyPageUrl(),
      icon: DocumentTextIcon,
      show: true,
    },
    {
      label: 'Terms & Conditions',
      url: getTnCPageUrl(),
      icon: ShieldCheckIcon,
      show: true,
    },
    {
      label: 'Logout',
      url: null,
      icon: LogoutIcon,
      show: !!user,
      onClick: () => {
        methods.logout()
        toastSuccess('Logged out')
        router.push(getHomePageUrl())
      },
    },
  ]

  return (
    <div>
      <MobileView>
        <Snackbar title="Menu" showMenuIcon={false} />
      </MobileView>

      <PageContainer>
        <div className="pb-8">
          {LINKS.map((link, index) => {
            const IconComponent = link.icon

            if (!link.show) {
              return null
            }

            return (
              <CoreLink
                key={index}
                url={link.url}
                onClick={() => {
                  if (link.onClick) {
                    link.onClick()
                  }
                }}
                className={classnames(
                  'flex items-center w-full p-4 lg:px-2 lg:py-5 transition-all bg-white hover:bg-gray-100 group',
                  {
                    'border-b border-gray-400': index + 1 !== LINKS.length,
                  }
                )}>
                <div className="mr-3">
                  <IconComponent className="w-6 text-typo-paragraphLight group-hover:text-typo-paragraph" />
                </div>

                <div className="flex flex-grow justify-between items-center">
                  <div>
                    <div className="text-gray-900 font-bold">{link.label}</div>
                    <div className="text-sm text-gray-700">{link.subTitle}</div>
                  </div>
                  <div>
                    <ChevronRightIcon className="w-5 text-gray-700 transform transition-transform group-hover:scale-125" />
                  </div>
                </div>
              </CoreLink>
            )
          })}
        </div>

        <MobileView>
          <div className="absolute left-[50%] transform translate-x-[-50%] bottom-5">
            <CoreImage url={APP_LOGO.DEFAULT_LABEL_INLINE} alt="Login promt" className="h-6" disableLazyload />
          </div>
        </MobileView>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareMorePageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: false,
        },
      },
      analytics: null,
      ads: {
        stickyBanner: {
          show: {
            desktop: false,
            mobile: false,
          },
        },
      },
    },
  }
}

export default MorePage
