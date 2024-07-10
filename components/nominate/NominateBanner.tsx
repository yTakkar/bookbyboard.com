import React, { useContext } from 'react'
import { getMonthNameFromId, getMonthYearIndexFromId, hasMemberNominated, hasMemberVoted } from '../../utils/nomination'
import ApplicationContext from '../ApplicationContext'
import CoreLink from '../core/CoreLink'
import { getNominationPageUrl } from '../../utils/routes'
import { isEarlyMonth, isLateMonth, isMidMonth } from '../../utils/date'
import { isAdminUser } from '../../utils/common'

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

  const adminMember = boardMember ? isAdminUser(boardMember.email) : false

  let label = null
  if (isEarlyMonth()) {
    if (hasNominated) {
      label = (
        <span>
          Click here to change your nomination for{' '}
          <span className="underline">
            {monthName} {year}
          </span>
        </span>
      )
    } else {
      label = (
        <span>
          Click here to nominate for{' '}
          <span className="underline">
            {monthName} {year}
          </span>
        </span>
      )
    }
  } else if (isMidMonth()) {
    if (hasVoted) {
      label = (
        <span>
          You have already voted for{' '}
          <span className="underline">
            {monthName} {year}
          </span>
        </span>
      )
    } else {
      label = (
        <span>
          Click here to vote for{' '}
          <span className="underline">
            {monthName} {year}
          </span>
        </span>
      )
    }
  } else if (isLateMonth()) {
    if (adminMember && nomination.live) {
      label = (
        <span>
          Click here to select book for{' '}
          <span className="underline">
            {monthName} {year}
          </span>
        </span>
      )
    } else {
      label = (
        <span>
          Voting is locked for{' '}
          <span className="underline">
            {monthName} {year}
          </span>
        </span>
      )
    }
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
