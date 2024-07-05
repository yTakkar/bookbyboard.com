import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import firebaseStore from '.'
import { INotificationTracker } from '../../interface/notificationTracker'

// Document reference: id = month-year
export const nominationCollection = collection(firebaseStore, 'notificationTracker')

const getFreshTracker = (id: string): INotificationTracker => {
  return {
    id: id,
    nomination: false,
    voting: false,
    results: false,
  }
}

export const addNomination = async (data: INotificationTracker) => {
  await setDoc(doc(nominationCollection, data.id), data)
}

export const getNotificationTrackerById = async (id: string): Promise<INotificationTracker> => {
  const docRef = doc(nominationCollection, id)
  const docSnap = await getDoc(docRef)

  const freshTracker = getFreshTracker(id)

  if (!docSnap.exists()) {
    await addNomination(freshTracker)
    return freshTracker
  }

  const data = docSnap.data() as INotificationTracker

  return data
}

export const updateNotificationTracker = async (id: string, tracker: Partial<INotificationTracker>) => {
  await updateDoc(doc(nominationCollection, id), tracker as any)
  return null
}
