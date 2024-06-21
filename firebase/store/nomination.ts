import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import firebaseStore from '.'
import { INominationDetail } from '../../interface/nomination'
import { getBulkUsers } from './boardMember'

// Document reference: email
export const nominationCollection = collection(firebaseStore, 'nomination')

export const addNomination = async (data: INominationDetail) => {
  await setDoc(doc(nominationCollection, data.id), data)
}

export const getNominationById = async (
  id: string,
  options: { createIfNotFound: boolean }
): Promise<INominationDetail> => {
  const freshNomination: INominationDetail = {
    id: id,
    date: new Date().getTime(),
    suggestions: [],
    selectedBook: null,
    live: true,
  }

  const docRef = doc(nominationCollection, id)
  const docSnap = await getDoc(docRef)

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

export const getNominationProfileInfoMap = async (nomination: INominationDetail) => {
  const uniqueUserEmails = new Set<string>()
  nomination.suggestions.forEach(suggestion => {
    uniqueUserEmails.add(suggestion.boardMemberEmail)
  })
  return getBulkUsers(Array.from(uniqueUserEmails))
}
