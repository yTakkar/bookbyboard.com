/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import { prepareBasePageSeo, prepareHomePageSeo } from '../utils/seo/pages/home'
import PageContainer from '../components/PageContainer'
import { useRouter } from 'next/router'
import NominationBanner from '../components/nominate/NominateBanner'
import SelectedBook, { SelectedBookSourceType } from '../components/SelectedBook'
import { getNominationById, getNominationProfileInfoMap } from '../firebase/store/nomination'
import { getCurrentNominationId } from '../utils/nomination'
import { INominationDetail } from '../interface/nomination'
import PageLoader from '../components/loader/PageLoader'
import { IBoardMemberInfo } from '../interface/boardMember'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    nomination: INominationDetail | null
    profileInfoMap: Record<string, IBoardMemberInfo>
  }
}

const Home: NextPage<IProps> = props => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  const {
    pageData: { nomination, profileInfoMap },
  } = props

  return (
    <PageContainer>
      <div className="">
        <NominationBanner />

        <SelectedBook
          source={SelectedBookSourceType.HOME}
          nominationId={getCurrentNominationId()}
          nomination={nomination}
          profileInfoMap={profileInfoMap}
        />
      </div>
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  const nomination = await getNominationById(getCurrentNominationId(), {
    createIfNotFound: false,
  })

  const profileInfoMap = await getNominationProfileInfoMap(nomination)

  return {
    props: {
      pageData: {
        nomination: nomination || null,
        profileInfoMap,
      },
      seo: nomination ? prepareHomePageSeo(nomination) : prepareBasePageSeo(),
      layoutData: {
        header: {},
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
    revalidate: PAGE_REVALIDATE_TIME.HOME,
  }
}

export default Home
