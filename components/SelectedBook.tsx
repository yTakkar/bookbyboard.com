import classNames from 'classnames'
import React from 'react'
import { INominationDetail, INominationSuggestion } from '../interface/nomination'
import CoreImage from './core/CoreImage'
import { enlargeBookImage } from '../utils/book'
import { BookZoomType } from '../interface/book'
import appConfig from '../config/appConfig'
import { getMonthNameFromId, getMonthYearIndexFromId } from '../utils/nomination'
import MoreContent from './MoreContent'
import { InformationCircleIcon, SpeakerphoneIcon, StarIcon } from '@heroicons/react/solid'
import dayjs from 'dayjs'
import { DesktopView, MobileView } from './ResponsiveViews'
import CoreDivider from './core/CoreDivider'
import QuotesWrapper from './QuotesWrapper'
import CoreLink from './core/CoreLink'
import { getHomePageUrl, getMemberPageUrl, getSelectedBookPageUrl } from '../utils/routes'
import { copyToClipboard, pluralize } from '../utils/common'
import Collapsible from './Collapsible'
import { ChevronDownIcon, LinkIcon, ShareIcon } from '@heroicons/react/outline'
import { IBoardMemberInfo } from '../interface/boardMember'
import useNativeShare from '../hooks/useNativeShare'
import { AnalyticsEventType } from '../constants/analytics'
import appAnalytics from '../lib/analytics/appAnalytics'
import { toastSuccess } from './Toaster'
import Tooltip from './Tooltip'

const localizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(localizedFormat)

export enum SelectedBookSourceType {
  HOME = 'HOME',
  MONTHLY = 'MONTHLY',
}

interface ISelectedBookProps {
  source: SelectedBookSourceType
  nomination: INominationDetail
  profileInfoMap: Record<string, IBoardMemberInfo>
}

const SelectedBook: React.FC<ISelectedBookProps> = props => {
  const { source, nomination, profileInfoMap } = props

  const selectedSuggestion = nomination?.suggestions.find(
    s => s.boardMemberEmail === nomination.selectedBook?.boardMemberEmail
  ) as INominationSuggestion

  const { book, note } = selectedSuggestion
  const selectedBoardMember = profileInfoMap[selectedSuggestion.boardMemberEmail]

  const monthName = getMonthNameFromId(nomination!.id)
  const { month, year } = getMonthYearIndexFromId(nomination.id)

  const shareUrl =
    source === SelectedBookSourceType.HOME
      ? `${appConfig.global.baseUrl}${getHomePageUrl()}`
      : `${appConfig.global.baseUrl}${getSelectedBookPageUrl(month, year)}`

  const shareText = `${book.title} - Book of the Month | ${appConfig.global.app.name}`

  const handleURLCopy = () => {
    copyToClipboard(shareUrl)
    appAnalytics.sendEvent({
      action: AnalyticsEventType.SELECTED_BOOK_COPY_URL,
      extra: {
        shareText,
        shareUrl,
      },
    })
    toastSuccess('Link copied to clipboard!')
  }

  const { shouldShowNativeShare, handleNativeShare } = useNativeShare({
    onShareFail: handleURLCopy,
  })

  const renderSuggestion = (suggestion: INominationSuggestion) => {
    const boardMember = profileInfoMap[suggestion.boardMemberEmail]

    return (
      <div key={suggestion.boardMemberEmail} className="relative">
        <div className="flex items-start">
          <div>
            <CoreImage
              url={enlargeBookImage(suggestion.book.imageUrls.thumbnail, BookZoomType.SMALL)}
              alt={`${suggestion.book.title} on ${appConfig.global.app.name}`}
              className="w-10 mr-2 mt-1"
            />
          </div>

          <div className="flex-1">
            <div className="font-semibold">{suggestion.book.title}</div>
            <div className="text-sm text-gray-600">{suggestion.book.authors.join(', ')}</div>
            {suggestion.note ? (
              <div className="text-sm mt-2">
                <QuotesWrapper text={suggestion.note} />
              </div>
            ) : (
              <span className="text-sm text-gray-600 italic">No note provided</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm">
          Nomination by
          <CoreLink url={getMemberPageUrl(boardMember?.username || '')} className="underline flex items-center mx-1">
            <CoreImage
              url={boardMember?.avatarUrl || ''}
              className={classNames('rounded-full mr-1 w-4')}
              alt={boardMember?.name || ''}
            />
            {boardMember?.name}
          </CoreLink>
          {`received ${pluralize('vote', suggestion.votes?.length || 0)}`}
        </div>

        <div className="border-b border-gray-200 my-4" />
      </div>
    )
  }

  const renderShareIcon = () => {
    return (
      <div className="cursor-pointer">
        {shouldShowNativeShare ? (
          <Tooltip content={'Share'} disableOnMobile>
            <ShareIcon
              className="w-4 md:w-5"
              onClick={() => {
                handleNativeShare({
                  text: shareText,
                  url: shareUrl,
                })
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip content={'Copy link'} disableOnMobile>
            <LinkIcon
              className="w-4 md:w-5"
              onClick={() => {
                handleURLCopy()
              }}
            />
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <div className="px-3">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <StarIcon className="w-5 md:w-6 text-yellow-500 mr-1" />
          <div className="text-brand-primary md:text-lg">
            <span className="underline">
              {monthName} {year}'s
            </span>{' '}
            <span>selected book</span>
          </div>
        </div>
        <div className="ml-2">{renderShareIcon()}</div>
      </div>

      <div className="md:my-8 ">
        <div
          className={classNames('font-domaine-bold font-bold mb-1', [
            book.title?.length >= 100 ? 'text-2xl' : 'text-3xl',
          ])}>
          {book.title}
        </div>
        {book.subTitle && <div className="my-2 text-gray-800">{book.description}</div>}
        <div className="text-typo-paragraphLight flex items-center">
          <div className="">{book.authors.join(', ')}</div>
        </div>
      </div>

      <div className="md:flex">
        <div className="mt-8 md:mt-0" />
        {/* <div className="flex justify-end">{renderShareIcon()}</div> */}
        <div className="flex justify-center">
          <CoreImage
            url={enlargeBookImage(book.imageUrls.thumbnail, BookZoomType.MEDIUM)}
            alt={`${book.title} is the selected book of ${monthName} ${year} on ${appConfig.global.app.name}`}
            className="w-60 max-w-60 self-start"
          />
        </div>

        <div className="mt-8 md:mt-0 md:ml-6">
          <DesktopView>
            <div className="moreContent-text text-gray-800">{book.description}</div>
          </DesktopView>

          <MobileView>
            <MoreContent>
              <div className="moreContent-text ">{book.description}</div>
            </MoreContent>
          </MobileView>

          <div className="font-semibold text-typo-paragraph mt-6 flex items-center">
            <InformationCircleIcon className="w-4 mr-1" /> More information
          </div>

          <dl className="table text-gray-800 text-sm mt-2">
            {book.pageCount && (
              <div className="table-row">
                <dt className="table-cell py-1 pr-5 w-28 text-typo-paragraphLight">Pages</dt>
                <dd className="table-cell py-1">{book.pageCount}</dd>
              </div>
            )}
            {book.publishedDate && (
              <div className="table-row">
                <dt className="table-cell py-1 pr-5 w-28 text-typo-paragraphLight">Published</dt>
                <dd className="table-cell py-1">
                  {dayjs(book.publishedDate).format('ll')}
                  {book.publisher ? ` by ${book.publisher}` : ''}
                </dd>
              </div>
            )}
            {book.categories?.length && (
              <div className="table-row">
                <dt className="table-cell py-1 pr-5 w-28 text-typo-paragraphLight">Categories</dt>
                <dd className="table-cell py-1">{book.categories.join(', ')}</dd>
              </div>
            )}
            {/* <div className="table-row">
              <dt className="table-cell py-1 pr-5 w-28 text-typo-paragraphLight">Votes received</dt>
              <dd className="table-cell py-1">{numeral(votes?.length).format()}</dd>
            </div> */}
          </dl>
        </div>
      </div>

      <CoreDivider className="my-6 md:my-8" />

      <div className="">
        {note && <QuotesWrapper text={note || ''} />}
        <div className="mt-4 flex items-center">
          Nominated by:{' '}
          <CoreLink
            url={getMemberPageUrl(selectedBoardMember?.username || '')}
            className="underline flex items-center ml-2">
            <CoreImage
              url={selectedBoardMember?.avatarUrl || ''}
              className={classNames('rounded-full mr-1 w-4')}
              alt={selectedBoardMember?.name || ''}
            />{' '}
            {selectedBoardMember?.name}
          </CoreLink>
        </div>
      </div>

      <CoreDivider className="my-6 md:my-8" />

      <div className={'mt-10'}>
        <Collapsible
          trigger={
            <div className={'flex items-start w-full transition-all bg-white cursor-pointer justify-center'}>
              <div className="text-gray-900 font-normal font-primary-medium pr-2">View all nominations</div>
              <ChevronDownIcon className="min-w-5 w-5 lg:min-w-6 lg:w-6 text-gray-700 collapsible-chevron-icon" />
            </div>
          }
          transitionTime={200}>
          <div className="pt-6 pb-4">
            <div>{nomination.suggestions.map(suggestion => renderSuggestion(suggestion))}</div>
          </div>
        </Collapsible>
      </div>
    </div>
  )
}

export default SelectedBook
