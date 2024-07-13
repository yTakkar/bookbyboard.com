/* eslint-disable react/no-unescaped-entities */
import React from 'react'
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
import { prepareSelectedBookPageSeo } from '../../utils/seo/pages/selectedBook'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    nomination: INominationDetail | null
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

  return (
    <div>
      <PageContainer>
        <div>
          <NominationBanner />

          <SelectedBook
            source={SelectedBookSourceType.MONTHLY}
            nominationId={router.query.nominationId as string}
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
  const _nominationId = params.nominationId

  // remove 0 from month (if it exists)
  const month = _nominationId.split('-')[0].replace(/^0+/, '')
  const year = _nominationId.split('-')[1]

  const nominationId = `${month}-${year}`

  const nomination = await getNominationById(nominationId, {
    createIfNotFound: false,
  })

  const profileInfoMap = await getNominationProfileInfoMap(nomination)

  return {
    props: {
      pageData: {
        nomination: nomination || null,
        profileInfoMap,
      },
      seo: prepareSelectedBookPageSeo(nominationId, nomination),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: false,
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
