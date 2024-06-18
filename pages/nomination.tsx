import React, { useContext } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import { prepareNominationPageSeo } from '../utils/seo/pages/vote'
import ApplicationContext from '../components/ApplicationContext'
import { getMonthNameFromId, getMonthYearIndexFromId, hasMemberNominated, hasMemberVoted } from '../utils/nomination'
import Loader, { LoaderType } from '../components/loader/Loader'
import CoreImage, { ImageSourceType } from '../components/core/CoreImage'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import { prepareImageUrl } from '../utils/image'
import classNames from 'classnames'
import { PopupType } from '../interface/popup'
import { BookZoomType, IBookInfo } from '../interface/book'
import { updateNomination } from '../firebase/store/nomination'
import { INominationDetail, INominationSuggestion } from '../interface/nomination'
import { isEarlyMonth, isLateMonth, isMidMonth } from '../utils/date'
import NotFound from '../components/NotFound'
import appConfig from '../config/appConfig'
import { PencilIcon } from '@heroicons/react/solid'
import { enlargeImage } from '../utils/book'
import QuotesWrapper from '../components/QuotesWrapper'
import { toastSuccess } from '../components/Toaster'
import { vibrate } from '../utils/common'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const VotePage: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const { nomination, boardMember, methods } = applicationContext

  const hasNominated = hasMemberNominated(boardMember?.email || null, nomination)
  const hasVoted = hasMemberVoted()

  const handleNominate = () => {
    methods.togglePopup(PopupType.SELECT_BOOK, {
      onBookSelect: (book: IBookInfo, note: string) => {
        const alreadyNominated = nomination!.suggestions.find(
          suggestion => suggestion.boardMemberEmail === boardMember?.email
        )

        const memberSuggestion: INominationSuggestion = {
          book,
          note,
          boardMemberEmail: boardMember!.email,
          voteCount: null,
        }

        const suggestions = alreadyNominated
          ? nomination!.suggestions.map(suggestion =>
              suggestion.boardMemberEmail === boardMember?.email ? memberSuggestion : suggestion
            )
          : [...nomination!.suggestions, memberSuggestion]

        const newNomination: INominationDetail = {
          ...nomination!,
          suggestions,
        }

        updateNomination(nomination!.id, newNomination)
        methods.dispatch({
          type: 'UPDATE_NOMINATION',
          payload: newNomination,
        })

        toastSuccess(alreadyNominated ? 'Nomination updated successfully' : 'Nomination submitted successfully')
        vibrate()
        appAnalytics.sendEvent({
          action: alreadyNominated ? AnalyticsEventType.NOMINATION_UPDATE : AnalyticsEventType.NOMINATION_ADD,
        })
      },
    })
  }

  const renderContent = () => {
    if (!boardMember) {
      return <NotFound />
    }

    if (!nomination) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    if (isEarlyMonth()) {
      if (hasNominated) {
        const { book, note } = nomination.suggestions.find(
          suggestion => suggestion.boardMemberEmail === boardMember.email
        )!

        return (
          <div>
            <div className="flex flex-col items-center">
              <div className="flex items-center text-lg lg:text-xl mt-5 mb-2 w-[320px] md:w-auto">
                <span>
                  Your nomination for {getMonthNameFromId(nomination!.id)} {getMonthYearIndexFromId(nomination.id).year}
                </span>
                <span
                  className="flex items-center text-xs bg-brand-secondary text-white px-[6px] py-[2px] rounded-sm ml-2 cursor-pointer font-semibold"
                  onClick={() => {
                    handleNominate()
                  }}>
                  <PencilIcon className="w-3 mr-1" />
                  <span>Change</span>
                </span>
              </div>

              <div className="flex justify-center">
                <CoreImage
                  url={enlargeImage(book.imageUrls.thumbnail, BookZoomType.MEDIUM)}
                  alt={`${book.title} on ${appConfig.global.app.name}`}
                  className="w-52"
                />
              </div>

              <div className="mt-3 mb-1 text-lg text-center">{book.title}</div>
              <div className="text-sm text-gray-600">{book.authors.join(', ')}</div>

              {note && (
                <QuotesWrapper
                  className="mt-4 text-center"
                  text={`This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.`}
                />
              )}
            </div>
          </div>
        )
      }

      return (
        <div className="flex flex-col items-center justify-center mt-20">
          <CoreImage
            url={prepareImageUrl('/images/empty/empty-art.png', ImageSourceType.ASSET)}
            className={classNames('w-80 min-h-52')}
            alt="No content found"
            disableLazyload
          />
          <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto">
            Submit your nomination for {getMonthNameFromId(nomination!.id)}
            {getMonthYearIndexFromId(nomination.id).year} now!
          </div>
          <div className="text-center mt-2 lg:mt-3">
            <CoreButton
              label="Nominate now"
              size={CoreButtonSize.MEDIUM}
              type={CoreButtonType.SOLID_PRIMARY}
              onClick={handleNominate}
            />
          </div>
        </div>
      )
    }

    if (isMidMonth()) {
      return 'mid month'
    }

    if (isLateMonth()) {
      return 'late month'
    }

    return null
  }

  return (
    <div>
      <MobileView>
        <Snackbar title={'Back'} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={'Back'} />
          </DesktopView>

          <div className="mt-4">{renderContent()}</div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareNominationPageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
      ads: {
        stickyBanner: {
          show: {
            desktop: true,
            mobile: true,
          },
        },
      },
    },
  }
}

export default VotePage
