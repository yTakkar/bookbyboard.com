import { NextApiRequest, NextApiResponse } from 'next'
import { listBoardMembers } from '../../firebase/store/boardMember'
import { getCurrentNominationId, getMonthNameFromId, getMonthYearIndexFromId } from '../../utils/nomination'
import { getNotificationTrackerById, updateNotificationTracker } from '../../firebase/store/notificationTracker'
import { isEarlyMonth, isMidMonth } from '../../utils/date'
import { IBoardMemberInfo } from '../../interface/boardMember'
import { renderFile } from 'pug'
import { getAbsPath } from '../../scripts/fileSystem'
import { Resend } from 'resend'
import appConfig from '../../config/appConfig'

const sendEmail = async (type: 'nomination' | 'voting', members: IBoardMemberInfo[]) => {
  try {
    const id = getCurrentNominationId()
    const monthName = getMonthNameFromId(id)
    const { year } = getMonthYearIndexFromId(id)

    const file =
      type === 'nomination'
        ? getAbsPath('templates/nomination.template.pug')
        : getAbsPath('templates/voting.template.pug')

    const emailHTML = renderFile(file, {
      dateString: `${monthName} ${year}`,
      pretty: false,
    })

    const resend = new Resend(appConfig.integrations.resend.apiKey)

    const mails = members.map(member => ({
      from: 'BookByBoard <onboarding@resend.dev>',
      to: member.email,
      subject:
        type === 'nomination'
          ? `BookByBoard - Nominate for ${monthName} ${year}`
          : `BookByBoard - Vote for ${monthName} ${year}`,
      html: emailHTML,
    }))

    const d = await resend.batch.send(mails)

    if (d.error) {
      console.log('Error sending email', d.error)
    }

    console.log(
      'Emails sent to',
      members.map(member => member.email)
    )
  } catch (e) {
    console.log('e', e)
  }
}

const sendEmailToMembers = async (type: 'nomination' | 'voting') => {
  const members = await listBoardMembers({})
  await sendEmail(type, members)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = getCurrentNominationId()
  const currentNotificationTracker = await getNotificationTrackerById(id)

  if (isEarlyMonth() && !currentNotificationTracker.nomination) {
    await sendEmailToMembers('nomination')
    await updateNotificationTracker(id, {
      nomination: true,
    })
    return res.status(200).json({ message: 'Email sent to nominate' })
  }

  if (isMidMonth() && !currentNotificationTracker.voting) {
    await sendEmailToMembers('voting')
    await updateNotificationTracker(id, {
      voting: true,
    })
    return res.status(200).json({ message: 'Email sent to vote' })
  }

  return res.status(200).json({ message: 'No email sent' })
}
