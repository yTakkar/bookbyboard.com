/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import PageContainer from '../../components/PageContainer'
import { useRouter } from 'next/router'
import NominationBanner from '../../components/nominate/NominateBanner'
import SelectedBook, { SelectedBookSourceType } from '../../components/SelectedBook'
import { getNominationById, getNominationProfileInfoMap, listNominations } from '../../firebase/store/nomination'
import { INominationDetail } from '../../interface/nomination'
import PageLoader from '../../components/loader/PageLoader'
import { IBoardMemberInfo } from '../../interface/boardMember'
import { INITIAL_PAGE_BUILD_COUNT, PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { get404PageUrl, getSelectedBookPageUrl } from '../../utils/routes'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import Snackbar from '../../components/header/Snackbar'
import { prepareSelectedBookPageSeo } from '../../utils/seo/pages/selectedBook'
import BackTitle from '../../components/BackTitle'
import Calendar from 'react-calendar'
import { getMonthNameFromId, getMonthYearIndexFromId } from '../../utils/nomination'
import { MonthInput } from '../../components/month-picker/MonthInput'
import { MonthPicker } from '../../components/month-picker/MonthPicker'
import useOutsideClick from '../../hooks/useOutsideClick'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    nomination: INominationDetail
    profileInfoMap: Record<string, IBoardMemberInfo>
  }
}

const SelectedBookPage: NextPage<IProps> = props => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  const {
    pageData: { nomination, profileInfoMap },
  } = props

  const { month: _month, year } = getMonthYearIndexFromId(nomination.id)

  // month picker starts from 1
  const month = _month + 1

  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const ref = useRef(null)

  useOutsideClick({
    ref,
    onOutsideClick: () => {
      setIsPickerOpen(false)
    },
  })

  return (
    <div>
      <MobileView>
        <Snackbar title={'Back'} />
      </MobileView>

      <PageContainer>
        {/* <DesktopView>
          <BackTitle title={'Back'} />
        </DesktopView> */}

        <div className="mt-4">
          <div className="flex justify-start relative px-3">
            <div ref={ref}>
              <MonthInput
                selected={{
                  month,
                  year,
                  monthName: getMonthNameFromId(nomination.id),
                }}
                setShowMonthPicker={setIsPickerOpen}
                showMonthPicker={isPickerOpen}
                size="small"
              />
              {isPickerOpen ? (
                <MonthPicker
                  setIsOpen={setIsPickerOpen}
                  selected={{
                    month,
                    year,
                  }}
                  onChange={(s: any) => {
                    // s.month is 1-indexed
                    const monthIndex = s.month - 1
                    router.push(getSelectedBookPageUrl(monthIndex, s.year))
                  }}
                  size="small"
                />
              ) : null}
            </div>
          </div>

          <NominationBanner />
          <SelectedBook
            source={SelectedBookSourceType.MONTHLY}
            nomination={nomination}
            profileInfoMap={profileInfoMap}
          />
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const nominations = await listNominations({
    limit: INITIAL_PAGE_BUILD_COUNT.SELECTED_BOOK,
  })

  const paths: any = nominations.map(nomination => ({
    params: {
      nominationId: nomination.id,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  // month-year
  const nominationId = params.nominationId

  // remove 0 from month (if it exists)
  const month = nominationId.split('-')[0].replace(/^0+/, '')
  const year = nominationId.split('-')[1]

  const nomination = await getNominationById(`${month}-${year}`, {
    createIfNotFound: false,
  })

  if (!nomination) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  const profileInfoMap = await getNominationProfileInfoMap(nomination)

  return {
    props: {
      pageData: {
        nomination: nomination,
        profileInfoMap,
      },
      seo: prepareSelectedBookPageSeo(nomination),
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
    revalidate: PAGE_REVALIDATE_TIME.SELECTED_BOOK,
  }
}

export default SelectedBookPage
