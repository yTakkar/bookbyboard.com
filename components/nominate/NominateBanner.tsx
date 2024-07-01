import React, { useContext } from 'react'
import { getMonthNameFromId, getMonthYearIndexFromId, hasMemberNominated, hasMemberVoted } from '../../utils/nomination'
import ApplicationContext from '../ApplicationContext'
import CoreLink from '../core/CoreLink'
import { getNominationPageUrl } from '../../utils/routes'
import { isEarlyMonth, isMidMonth } from '../../utils/date'

interface INominationBannerProps {}

function NominationBanner({}: INominationBannerProps) {
  const applicationContext = useContext(ApplicationContext)
  const { nomination, boardMember } = applicationContext

  if (!nomination || !boardMember) {
    return null
  }

  const hasNominated = hasMemberNominated(boardMember.email, nomination)
  const hasVoted = hasMemberVoted(boardMember.email, nomination)

  const monthName = getMonthNameFromId(nomination.id)
  const year = getMonthYearIndexFromId(nomination.id).year

  let label = null
  if (isEarlyMonth()) {
    label = hasNominated ? null : (
      <span>
        Click here to nominate for{' '}
        <span className="underline">
          {monthName} {year}
        </span>
      </span>
    )
  } else if (isMidMonth()) {
    label = hasVoted ? null : (
      <span>
        Click here to vote for{' '}
        <span className="underline">
          {monthName} {year}
        </span>{' '}
        nominations
      </span>
    )
  }

  if (!label) {
    return null
  }

  return (
    <CoreLink
      className="bg-brand-secondary text-white w-full shadow p-3 mb-4 text-sm flex justify-center cursor-pointer"
      url={getNominationPageUrl()}>
      <span className="">{label}</span>
      {/* <span
        className={classNames('bg-brand-primary font-semibold text-sm cursor-pointer py-1 px-2 rounded ml-2 inline')}>
        {hasNominated ? 'Vote' : 'Nominate'} <CheckIcon className="w-4 h-4 inline-block" />
      </span> */}
    </CoreLink>
  )
}

export default NominationBanner
