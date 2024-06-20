import React, { useContext, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import { MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import { prepareNominationPageSeo } from '../utils/seo/pages/vote'
import ApplicationContext from '../components/ApplicationContext'
import {
  getMemberVotedSuggestion,
  getMonthNameFromId,
  getMonthYearIndexFromId,
  hasMemberNominated,
} from '../utils/nomination'
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
import { LockClosedIcon, PencilIcon, ThumbUpIcon } from '@heroicons/react/solid'
import { enlargeBookImage } from '../utils/book'
import QuotesWrapper from '../components/QuotesWrapper'
import { toastError, toastSuccess } from '../components/Toaster'
import { isAdminUser, vibrate } from '../utils/common'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import { InformationCircleIcon } from '@heroicons/react/solid'
import CoreDivider from '../components/core/CoreDivider'
import { CheckCircleIcon } from '@heroicons/react/solid'
import Alert from '../components/modal/Alert'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const VotePage: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const {
    nomination,
    boardMember,
    methods,
    device: { isDesktop },
  } = applicationContext

  const hasNominated = hasMemberNominated(boardMember?.email || null, nomination)
  const votedSuggestion = getMemberVotedSuggestion(boardMember?.email || null, nomination)

  const [selectedSuggestion, setSelectedSuggestion] = useState<INominationSuggestion | null>(null)
  const [operationLoading, setOperationLoading] = useState(false)

  const handleNominate = () => {
    methods.togglePopup(PopupType.SELECT_BOOK, {
      onBookSelect: (book: IBookInfo, note: string) => {
        const alreadyNominated = nomination!.suggestions.find(
          suggestion => suggestion.boardMemberEmail === boardMember?.email
        )

        const suggestions = alreadyNominated
          ? nomination!.suggestions.map(suggestion =>
              suggestion.boardMemberEmail === boardMember?.email ? { ...suggestion, book, note } : suggestion
            )
          : [
              ...nomination!.suggestions,
              {
                boardMemberEmail: boardMember!.email,
                book,
                note,
                votes: null,
              },
            ]

        const newNomination: INominationDetail = {
          ...nomination!,
          suggestions,
        }

        updateNomination(nomination!.id, newNomination)
          .then(() => {
            methods.dispatch({
              type: 'UPDATE_NOMINATION',
              payload: newNomination,
            })
            toastSuccess(alreadyNominated ? 'Nomination updated successfully' : 'Nomination submitted successfully')
            vibrate()
            appAnalytics.sendEvent({
              action: alreadyNominated ? AnalyticsEventType.NOMINATION_UPDATE : AnalyticsEventType.NOMINATION_ADD,
            })
          })
          .catch(() => {
            toastError('Failed to submit nomination!')
          })
      },
    })
  }

  const handleSubmitVote = () => {
    setOperationLoading(true)

    const newSuggestions: INominationSuggestion[] = nomination!.suggestions.map(suggestion => {
      if (suggestion.boardMemberEmail === selectedSuggestion!.boardMemberEmail) {
        return {
          ...suggestion,
          votes: suggestion.votes ? [...suggestion.votes, boardMember!.email] : [boardMember!.email],
        }
      }
      return suggestion
    })

    const newNomination: INominationDetail = {
      ...nomination!,
      suggestions: newSuggestions,
    }

    updateNomination(nomination!.id, newNomination)
      .then(() => {
        methods.dispatch({
          type: 'UPDATE_NOMINATION',
          payload: newNomination,
        })
        toastSuccess('Vote submitted successfully!')
        vibrate()
        appAnalytics.sendEvent({
          action: AnalyticsEventType.VOTE,
        })
        setSelectedSuggestion(null)
      })
      .catch(() => {
        toastError('Failed to submit vote!')
      })
      .finally(() => {
        setOperationLoading(false)
      })
  }

  const handleBookSelect = () => {
    const suggestionWithHighestVotes = nomination!.suggestions.reduce((prev, current) =>
      prev.votes ? (prev.votes.length > (current.votes || [])!.length ? prev : current) : prev
    )

    const newNomination: INominationDetail = {
      ...nomination!,
      selectedBook: {
        boardMemberEmail: suggestionWithHighestVotes.boardMemberEmail,
      },
      live: false,
    }

    setOperationLoading(true)

    updateNomination(nomination!.id, newNomination)
      .then(() => {
        methods.dispatch({
          type: 'UPDATE_NOMINATION',
          payload: newNomination,
        })
        toastSuccess('Book selected successfully!')
        vibrate()
        appAnalytics.sendEvent({
          action: AnalyticsEventType.BOOK_SELECT,
        })
      })
      .catch(() => {
        toastError('Failed to select book!')
      })
      .finally(() => {
        setOperationLoading(false)
      })
  }

  const renderSuggestion = (suggestion: INominationSuggestion) => {
    const { book, note } = suggestion

    return (
      <div key={book.id} className="relative">
        <div className="flex items-start max-w-[90%] md:max-w-none">
          <div>
            <CoreImage
              url={enlargeBookImage(book.imageUrls.thumbnail, BookZoomType.SMALL)}
              alt={`${book.title} on ${appConfig.global.app.name}`}
              className="w-10 mr-2 mt-1"
            />
          </div>

          <div className="flex-1">
            <div className="font-semibold">{book.title}</div>
            <div className="text-sm text-gray-600">{book.authors.join(', ')}</div>
            {note ? (
              <div className="text-sm mt-2">
                <QuotesWrapper text={note} />
              </div>
            ) : (
              <span className="text-sm text-gray-600 italic">No note provided</span>
            )}
          </div>
        </div>
        <div
          className={classNames('flex items-center justify-end mt-2', {
            'mt-0 absolute right-1 top-2': isDesktop,
          })}>
          <CoreButton
            size={CoreButtonSize.SMALL}
            type={CoreButtonType.SOLID_PRIMARY}
            label="Select"
            icon={ThumbUpIcon}
            onClick={() => setSelectedSuggestion(suggestion)}
          />
        </div>
        <div className="border-b border-gray-200 my-3" />
      </div>
    )
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
            <div className="flex flex-col items-center md:w-[500px] m-auto">
              <div className="flex items-center text-lg lg:text-xl mt-5 mb-4">
                <span>
                  Your nomination for{' '}
                  <span className="underline">
                    {getMonthNameFromId(nomination!.id)} {getMonthYearIndexFromId(nomination.id).year}
                  </span>
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
                  url={enlargeBookImage(book.imageUrls.thumbnail, BookZoomType.MEDIUM)}
                  alt={`${book.title} on ${appConfig.global.app.name}`}
                  className="w-60"
                />
              </div>

              <div className="mt-3 text-lg text-center">{book.title}</div>
              <div className="text-sm text-gray-600">{book.authors.join(', ')}</div>

              {note && <QuotesWrapper className="mt-4 text-center" text={note} />}

              <div className="mt-6 text-center">
                Thank you for nominating! Voting for next month's selected book will open after the 15th of this month,
                once 50% of the current month has passed.
              </div>
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
          />
          <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto">
            Submit your nomination for
            <span className="underline">
              {' '}
              {getMonthNameFromId(nomination!.id)} {getMonthYearIndexFromId(nomination.id).year}
            </span>{' '}
            now!
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
      if (votedSuggestion) {
        const { book } = votedSuggestion

        return (
          <div className="flex flex-col items-center md:w-[500px] m-auto">
            <div className="flex items-center text-lg lg:text-xl mt-5 mb-4">
              Your vote was submitted for
              <span className="underline ml-1">
                {getMonthNameFromId(nomination!.id)} {getMonthYearIndexFromId(nomination.id).year}
              </span>
            </div>

            <div className="flex justify-center">
              <CoreImage
                url={enlargeBookImage(book.imageUrls.thumbnail, BookZoomType.MEDIUM)}
                alt={`${book.title} on ${appConfig.global.app.name}`}
                className="w-60"
              />
            </div>

            <div className="mt-3 text-lg text-center">{book.title}</div>
            <div className="text-sm text-gray-600">{book.authors.join(', ')}</div>

            <div className="mt-6 text-center">
              Thank you for voting! The selected book will be announced at the start of next month. Stay tuned!
            </div>
          </div>
        )
      }

      return (
        <div>
          <div>
            <div className="text-lg lg:text-xl mt-5 mb-1 w-[320px] md:w-auto">
              Vote for the next book for{' '}
              <span className="underline">
                {getMonthNameFromId(nomination!.id)} {getMonthYearIndexFromId(nomination.id).year}
              </span>
            </div>
            <div className="text-gray-600 text-sm mt-1">
              <InformationCircleIcon className="w-4 mr-1 inline -mt-[2px]" />
              <span className="inline">{'You can vote for only one book per month. Choose wisely!'}</span>
            </div>
          </div>

          <CoreDivider className="my-6" />

          <div className="mt-4">
            {nomination.suggestions.map(suggestion => (
              <React.Fragment key={suggestion.boardMemberEmail}>{renderSuggestion(suggestion)}</React.Fragment>
            ))}
          </div>

          {selectedSuggestion ? (
            <Alert
              dismissModal={() => setSelectedSuggestion(null)}
              title="Submit your vote"
              subTitle="Are you sure you about this? You can vote for only one book per month. Choose wisely!"
              cta={{
                primary: {
                  show: true,
                  label: 'Submit',
                  icon: CheckCircleIcon,
                  onClick: handleSubmitVote,
                  loading: operationLoading,
                },
                secondary: {
                  show: true,
                  label: 'Cancel',
                  onClick: () => setSelectedSuggestion(null),
                },
              }}
            />
          ) : null}
        </div>
      )
    }

    if (isLateMonth()) {
      const adminMember = isAdminUser(boardMember.email)

      if (adminMember && nomination.live) {
        return (
          <div className="flex flex-col items-center justify-center mt-20  md:w-[500px] m-auto">
            <CoreImage
              url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
              className={classNames('w-80 min-h-52')}
              alt="No content found"
            />
            <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto">
              Looks like you are an admin. You can now pick the selected book for{' '}
              <span className="underline">
                {' '}
                {getMonthNameFromId(nomination!.id)} {getMonthYearIndexFromId(nomination.id).year}
              </span>
              . The book with the most votes will be selected automatically.
            </div>
            <div className="text-center mt-2 lg:mt-3">
              <CoreButton
                label="Select now"
                size={CoreButtonSize.MEDIUM}
                type={CoreButtonType.SOLID_PRIMARY}
                onClick={handleBookSelect}
                icon={LockClosedIcon}
                loading={operationLoading}
              />
            </div>
          </div>
        )
      }

      return (
        <div className="flex flex-col items-center justify-center mt-20  md:w-[500px] m-auto">
          <CoreImage
            url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
            className={classNames('w-80 min-h-52')}
            alt="No content found"
          />
          <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto">
            Voting is locked for{' '}
            <span className="underline">
              {' '}
              {getMonthNameFromId(nomination!.id)} {getMonthYearIndexFromId(nomination.id).year}
            </span>
            . The selected book will be announced at the start of next month. Stay tuned!
          </div>
        </div>
      )
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
