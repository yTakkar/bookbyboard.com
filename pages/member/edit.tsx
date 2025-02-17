import React, { useContext, useEffect, useRef, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../../components/PageContainer'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import Snackbar from '../../components/header/Snackbar'
import BackTitle from '../../components/BackTitle'
import ApplicationContext from '../../components/ApplicationContext'
import CoreImage from '../../components/core/CoreImage'
import NotFound from '../../components/NotFound'
import appConfig from '../../config/appConfig'
import { PencilIcon } from '@heroicons/react/solid'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import CoreTextInput, { CoreTextInputType } from '../../components/core/CoreInput'
import classNames from 'classnames'
import CoreTextarea from '../../components/core/CoreTextarea'
import CoreDivider from '../../components/core/CoreDivider'
import { PopupType } from '../../interface/popup'
import { REGEX_MAP } from '../../constants/constants'
import { toastError, toastSuccess } from '../../components/Toaster'
import { handleValidation } from '../../utils/form'
import { revalidateUrls } from '../../utils/revalidate'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { updateBoardMember, usernameExists } from '../../firebase/store/boardMember'
import { IBoardMemberInfo } from '../../interface/boardMember'
import { getMemberPageUrl } from '../../utils/routes'
import { prepareMemberEditPageSeo } from '../../utils/seo/pages/member'
import { AnalyticsEventType } from '../../constants/analytics'

enum FieldKeyType {
  EMAIL = 'EMAIL',
  USERNAME = 'USERNAME',
  NAME = 'NAME',
  BIO = 'BIO',
  WEBSITE = 'WEBSITE',
  INSTAGRAM_USERNAME = 'INSTAGRAM_USERNAME',
  TWITTER_USERNAME = 'TWITTER_USERNAME',
  YOUTUBE_USERNAME = 'YOUTUBE_USERNAME',
}

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ProfileEdit: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const { boardMember, methods } = applicationContext

  const defaultFields = Object.keys(FieldKeyType).reduce((acc: any, key: any) => {
    acc[key] = ''
    return acc
  }, {})

  const defaultFieldsWithError = Object.keys(FieldKeyType).reduce((acc: any, key: any) => {
    acc[key] = false
    return acc
  }, {})

  const [fields, setFields] = useState<Record<FieldKeyType, string>>(defaultFields)
  const [fieldsWithError, setFieldsWithError] = useState<Record<FieldKeyType, boolean>>(defaultFieldsWithError)
  const [loading, toggleLoading] = useState(false)

  useEffect(() => {
    if (boardMember) {
      setFields({
        [FieldKeyType.EMAIL]: boardMember.email,
        [FieldKeyType.USERNAME]: boardMember.username,
        [FieldKeyType.NAME]: boardMember.name,
        [FieldKeyType.BIO]: boardMember.bio || '',
        [FieldKeyType.WEBSITE]: boardMember.websiteUrl || '',
        [FieldKeyType.INSTAGRAM_USERNAME]: boardMember.socialUsernames.instagram || '',
        [FieldKeyType.TWITTER_USERNAME]: boardMember.socialUsernames.twitter || '',
        [FieldKeyType.YOUTUBE_USERNAME]: boardMember.socialUsernames.youtube || '',
      })
    }
  }, [boardMember])

  const updateField = (field: keyof typeof fields) => (value: string) => {
    setFields({
      ...fields,
      [field]: value,
    })
  }

  const formRef = useRef<HTMLDivElement>(null)

  const FIELD_VALIDATION_MAPPING = {
    [FieldKeyType.NAME]: {
      regex: REGEX_MAP.NAME,
      error: 'Invalid Name (must be between 3-50 letters)',
      value: fields.NAME,
      key: FieldKeyType.NAME,
      optional: false,
    },
    [FieldKeyType.USERNAME]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Username',
      value: fields.USERNAME,
      key: FieldKeyType.USERNAME,
      optional: false,
    },
    [FieldKeyType.EMAIL]: {
      regex: REGEX_MAP.EMAIL,
      error: 'Invalid Email',
      value: fields.EMAIL,
      key: FieldKeyType.EMAIL,
      optional: false,
    },
    [FieldKeyType.BIO]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Bio',
      value: fields.BIO,
      key: FieldKeyType.BIO,
      optional: true,
    },
    [FieldKeyType.WEBSITE]: {
      regex: REGEX_MAP.URL,
      error: 'Invalid Website',
      value: fields.WEBSITE,
      key: FieldKeyType.WEBSITE,
      optional: true,
    },
    [FieldKeyType.INSTAGRAM_USERNAME]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Instagram username',
      value: fields.INSTAGRAM_USERNAME,
      key: FieldKeyType.INSTAGRAM_USERNAME,
      optional: true,
    },
    [FieldKeyType.TWITTER_USERNAME]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Twitter username',
      value: fields.TWITTER_USERNAME,
      key: FieldKeyType.TWITTER_USERNAME,
      optional: true,
    },
    [FieldKeyType.YOUTUBE_USERNAME]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid YouTube username',
      value: fields.YOUTUBE_USERNAME,
      key: FieldKeyType.YOUTUBE_USERNAME,
      optional: true,
    },
  }

  const sendAnalyticsEvents = () => {
    if (boardMember?.username !== fields.USERNAME) {
      appAnalytics.sendEvent({
        action: AnalyticsEventType.EDIT_PROFILE_USERNAME,
        extra: {
          username: fields.USERNAME,
        },
      })
    }
    appAnalytics.sendEvent({
      action: AnalyticsEventType.EDIT_PROFILE,
      extra: {
        name: fields.NAME,
        username: fields.USERNAME,
        email: fields.EMAIL,
        bio: fields.BIO,
        websiteUrl: fields.WEBSITE,
        instagram: fields.INSTAGRAM_USERNAME,
        twitter: fields.TWITTER_USERNAME,
        youtube: fields.YOUTUBE_USERNAME,
      },
    })
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const onSuccess = async () => {
      try {
        toggleLoading(true)

        if (boardMember!.username !== fields.USERNAME) {
          const exists = await usernameExists(fields.USERNAME)
          if (exists) {
            toastError('Username already exists')
            toggleLoading(false)
            return
          }
        }

        const partialMemberInfo: Partial<IBoardMemberInfo> = {
          name: fields.NAME,
          username: fields.USERNAME,
          email: fields.EMAIL,
          bio: fields.BIO,
          websiteUrl: fields.WEBSITE,
          socialUsernames: {
            instagram: fields.INSTAGRAM_USERNAME,
            twitter: fields.TWITTER_USERNAME,
            youtube: fields.YOUTUBE_USERNAME,
          },
        }

        await updateBoardMember(boardMember!.email, partialMemberInfo)
        await revalidateUrls([getMemberPageUrl(boardMember!.username)])
        methods.updateBoardMember({
          ...boardMember!,
          ...partialMemberInfo,
          socialUsernames: {
            ...boardMember!.socialUsernames,
            ...partialMemberInfo.socialUsernames,
          },
        })
        toastSuccess('Profile updated!')
        sendAnalyticsEvents()
        toggleLoading(false)
      } catch (e) {
        appAnalytics.captureException(e)
        toastError('Something went wrong')
      }
    }

    handleValidation(FIELD_VALIDATION_MAPPING, fieldsWithError, setFieldsWithError, onSuccess)
  }

  const renderContent = () => {
    if (!boardMember) {
      return <NotFound />
    }

    return (
      <div className="px-3 py-6">
        <div className="flex flex-col items-center justify-center">
          <CoreImage
            url={boardMember.avatarUrl}
            alt={`${boardMember.name}'s profile on ${appConfig.global.app.name}`}
            className="h-28 w-28 rounded-full"
          />
          <div
            className="mt-2 flex items-center border-b border-typo-paragraph text-sm text-typo-paragraph cursor-pointer"
            onClick={() => methods.togglePopup(PopupType.CHANGE_AVATAR, {})}>
            Change <PencilIcon className="ml-1 w-4" />
          </div>
        </div>

        <CoreDivider className="my-8" />

        <div ref={formRef}>
          <div className="user-input-group">
            <div className="user-input-label">Display Name</div>
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Name"
              value={fields.NAME}
              setValue={updateField(FieldKeyType.NAME)}
              autoComplete="name"
              autoFocus
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.NAME,
              })}
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <div className="user-input-label">Username</div>
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Username"
              value={fields.USERNAME}
              setValue={updateField(FieldKeyType.USERNAME)}
              autoComplete="username"
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.USERNAME,
              })}
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <div className="user-input-label">Email Address</div>
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Email"
              value={fields.EMAIL}
              setValue={updateField(FieldKeyType.EMAIL)}
              autoComplete="email"
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.EMAIL,
              })}
              disabled
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <div className="user-input-label">Bio</div>
            <CoreTextarea
              value={fields.BIO}
              setValue={updateField(FieldKeyType.BIO)}
              placeholder="Brief description for your profile"
              className={classNames('user-input h-24', {
                'user-input-error': fieldsWithError.EMAIL,
              })}
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <div className="user-input-label">Website</div>
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Eg. anything.com"
              value={fields.WEBSITE}
              setValue={updateField(FieldKeyType.WEBSITE)}
              autoComplete="name"
              showClearIcon
              onClearClick={() => updateField(FieldKeyType.WEBSITE)('')}
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.WEBSITE,
              })}
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <div className="user-input-label">Instagram Username</div>
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Eg. faiyaztakkarrr"
              value={fields.INSTAGRAM_USERNAME}
              setValue={updateField(FieldKeyType.INSTAGRAM_USERNAME)}
              autoComplete="username"
              showClearIcon
              onClearClick={() => updateField(FieldKeyType.INSTAGRAM_USERNAME)('')}
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.INSTAGRAM_USERNAME,
              })}
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <div className="user-input-label">X Username</div>
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Eg. naval"
              value={fields.TWITTER_USERNAME}
              setValue={updateField(FieldKeyType.TWITTER_USERNAME)}
              autoComplete="username"
              showClearIcon
              onClearClick={() => updateField(FieldKeyType.TWITTER_USERNAME)('')}
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.TWITTER_USERNAME,
              })}
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <div className="user-input-label">YouTube Username</div>
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Eg. TEDEd"
              value={fields.YOUTUBE_USERNAME}
              setValue={updateField(FieldKeyType.YOUTUBE_USERNAME)}
              autoComplete="username"
              showClearIcon
              onClearClick={() => updateField(FieldKeyType.YOUTUBE_USERNAME)('')}
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.YOUTUBE_USERNAME,
              })}
              sanitizeOnBlur
            />
          </div>

          <div className="user-input-group">
            <CoreButton
              label="Save Details"
              size={CoreButtonSize.MEDIUM}
              type={CoreButtonType.SOLID_PRIMARY}
              loading={loading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <MobileView>
        <Snackbar title={'Account'} />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title={'Account'} />
        </DesktopView>

        {renderContent()}
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareMemberEditPageSeo(),
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
            desktop: false,
            mobile: false,
          },
        },
      },
    },
  }
}

export default ProfileEdit
