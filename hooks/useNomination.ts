import { useContext, useEffect, useState } from 'react'
import appAnalytics from '../lib/analytics/appAnalytics'
import ApplicationContext from '../components/ApplicationContext'
import { INominationDetail } from '../interface/nomination'
import { getNominationById } from '../firebase/store/nomination'
import { getNextNominationId } from '../utils/nomination'

function useNomination() {
  const applicationContext = useContext(ApplicationContext)
  const {
    methods: { dispatch },
    boardMember,
  } = applicationContext

  const [nomination, setNomination] = useState<INominationDetail | null>(null)

  const fetchNominationDetails = async () => {
    try {
      const data = await getNominationById(getNextNominationId(), {
        createIfNotFound: true,
      })
      setNomination(data)
    } catch (e) {
      console.error('Error fetching nomination details', e)
      appAnalytics.captureException(e)
    }
  }

  useEffect(() => {
    if (boardMember) {
      fetchNominationDetails()
    }
  }, [boardMember])

  useEffect(() => {
    if (nomination) {
      dispatch({
        type: 'UPDATE_NOMINATION',
        payload: nomination,
      })
    }
  }, [nomination])
}

export default useNomination
