import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import firebaseStore from '.'
import { IListNominationsParams, INominationDetail } from '../../interface/nomination'
import { getBulkUsers } from './boardMember'
import { getFreshNomination } from '../../utils/nomination'

// Document reference: email
export const nominationCollection = collection(firebaseStore, 'nomination')

export const addNomination = async (data: INominationDetail) => {
  await setDoc(doc(nominationCollection, data.id), data)
}

export const getNominationById = async (
  id: string,
  options: { createIfNotFound: boolean }
): Promise<INominationDetail> => {
  const docRef = doc(nominationCollection, id)
  const docSnap = await getDoc(docRef)

  const freshNomination = getFreshNomination(id)

  // If the document does not exist, create a new one
  if (!docSnap.exists() && options.createIfNotFound) {
    await addNomination(freshNomination)
    return freshNomination
  }

  const data = docSnap.data() as INominationDetail

  return data
}

export const updateNomination = async (id: string, nomination: Partial<INominationDetail>) => {
  await updateDoc(doc(nominationCollection, id), nomination as any)
  return null
}

export const getNominationProfileInfoMap = async (nomination: INominationDetail | undefined) => {
  if (!nomination) {
    return {}
  }

  const uniqueUserEmails = new Set<string>()
  nomination.suggestions.forEach(suggestion => {
    uniqueUserEmails.add(suggestion.boardMemberEmail)
  })
  return getBulkUsers(Array.from(uniqueUserEmails))
}

export const listNominations = async (params: IListNominationsParams): Promise<INominationDetail[]> => {
  const q = query(nominationCollection, limit(params.limit), where('live', '==', false))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as INominationDetail)
}
