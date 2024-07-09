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

interface IQuery {
  secret: string
}

enum NOTIFICATION_TYPE {
  NOMINATION = 'nomination',
  VOTING = 'voting',
  SELECTION = 'selection',
}

const localEmails = ['bookbyboard@gmail.com']

const sendEmailWithResend = async (type: NOTIFICATION_TYPE, members: IBoardMemberInfo[]) => {
  try {
    const id = getCurrentNominationId()
    const monthName = getMonthNameFromId(id)
    const { year } = getMonthYearIndexFromId(id)

    const FILES_MAP = {
      [NOTIFICATION_TYPE.NOMINATION]: getAbsPath('templates/nomination.template.pug'),
      [NOTIFICATION_TYPE.VOTING]: getAbsPath('templates/voting.template.pug'),
      [NOTIFICATION_TYPE.SELECTION]: getAbsPath('templates/selection.template.pug'),
    }

    const SUBJECT_MAP = {
      [NOTIFICATION_TYPE.NOMINATION]: `BookByBoard - Nominate for ${monthName} ${year}`,
      [NOTIFICATION_TYPE.VOTING]: `BookByBoard - Vote for ${monthName} ${year}`,
      [NOTIFICATION_TYPE.SELECTION]: `BookByBoard - Select Book of the month for ${monthName} ${year}`,
    }

    const file = FILES_MAP[type]
    const subject = SUBJECT_MAP[type]

    const emailHTML = renderFile(file, {
      dateString: `${monthName} ${year}`,
      pretty: false,
    })

    const resend = new Resend(appConfig.integrations.resend.apiKey)

    const prepareEmail = (email: string) => ({
      from: 'BookByBoard <notifier@bookbyboard.com>',
      to: email,
      subject: subject,
      html: emailHTML,
    })

    const mails = appConfig.isDev
      ? localEmails.map(prepareEmail)
      : members.map(member => {
          return prepareEmail(member.email)
        })
    const d = await resend.batch.send(mails)

    if (d.error) {
      console.log('Error sending email', d.error)
    }

    console.log(
      'Emails sent to',
      mails.map(main => main.to)
    )
  } catch (e) {
    console.log('e', e)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret } = req.query as unknown as IQuery

  if (secret !== appConfig.notification.secret_key) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const id = getCurrentNominationId()
  const currentNotificationTracker = await getNotificationTrackerById(id)

  if (isEarlyMonth() && !currentNotificationTracker.nomination) {
    const members = await listBoardMembers({})
    await sendEmailWithResend(NOTIFICATION_TYPE.NOMINATION, members)
    // TODO:
    // await updateNotificationTracker(id, {
    //   nomination: true,
    // })
    return res.status(200).json({ message: 'Email sent to nominate' })
  }

  if (isMidMonth() && !currentNotificationTracker.voting) {
    const members = await listBoardMembers({})
    await sendEmailWithResend(NOTIFICATION_TYPE.VOTING, members)
    // TODO:
    // await updateNotificationTracker(id, {
    //   voting: true,
    // })
    return res.status(200).json({ message: 'Email sent to vote' })
  }

  // TODO: add support for selecting book of the month

  return res.status(200).json({ message: 'No email sent' })
}
