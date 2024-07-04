import React, { useContext } from 'react'
import appConfig from '../../config/appConfig'
import CoreLink from '../core/CoreLink'
import CoreImage from '../core/CoreImage'
import { SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import classNames from 'classnames'
import ApplicationContext from '../ApplicationContext'

interface IFooterProps {}

const Footer: React.FC<IFooterProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isDesktop },
  } = applicationContext

  return (
    <footer>
      <div className="bg-white h-8 md:h-10"></div>

      {/* <div className="bg-aliceBlue px-4 py-6 lg:py-8 shadow-inner">
        <div className="container mx-auto">
          <div className="lg:flex justify-between items-start">
            <div className="">
              <div className="font-bold mb-2">{appConfig.global.app.name}</div>
              <div className="flex ">
                {appConfig.company.socialLinks.map((socialLink, index) => {
                  const socialIconSrc = SOCIAL_ICONS_SRC_MAP[socialLink.type] || SOCIAL_ICONS_SRC_MAP.GLOBE

                  return (
                    <CoreLink
                      key={index}
                      url={socialLink.url}
                      isExternal={socialLink.isExternal}
                      className="w-6 mr-5 transform transition-transform hover:scale-110"
                      title={`${socialLink.name}`}>
                      <CoreImage url={socialIconSrc} alt={socialLink.name} useTransparentPlaceholder />
                    </CoreLink>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-aliceBlue shadow-inner">
        <div className="container mx-auto">
          <div className="flex flex-row items-center justify-between py-4 px-4  text-gray-600">
            <div className="flex items-center">
              ~ {isDesktop ? 'A weekend project by' : 'By'}
              <CoreLink url={appConfig.author.website} className="flex items-center underline" isExternal>
                <CoreImage url={'/images/author.jpeg'} alt="Faiyaz" className="w-5 mr-1 ml-2 rounded-full" />
                <div className="font-bold leading-4">Faiyaz</div>
              </CoreLink>
            </div>

            <div className="flex items-center">
              {appConfig.company.socialLinks.map((socialLink, index) => {
                const socialIconSrc = SOCIAL_ICONS_SRC_MAP[socialLink.type]
                const isLast = index === appConfig.company.socialLinks.length - 1

                return (
                  <CoreLink
                    key={index}
                    url={socialLink.url}
                    isExternal={socialLink.isExternal}
                    className={classNames('w-5', {
                      'mr-3': !isLast,
                    })}
                    title={`${socialLink.name}`}>
                    <CoreImage url={socialIconSrc} alt={socialLink.name} useTransparentPlaceholder />
                  </CoreLink>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
