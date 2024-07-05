import { collection, getDocs, query } from 'firebase/firestore'
import firebaseStore from '.'

// Document reference: email
export const boardMemberCollection = collection(firebaseStore, 'allowedBoardMembers')

const listAllAllowedBoardMembers = async (): Promise<string[]> => {
  const q = query(boardMemberCollection)
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    return doc.id
  })
}

export const isBoardMemberAllowed = async (email: string): Promise<boolean> => {
  const members = await listAllAllowedBoardMembers()
  return members.includes(email)
}
