import firebaseStore from '.'
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { IBoardMemberInfo, IListBoardMembersParams } from '../../interface/boardMember'

// Document reference: email
export const boardMemberCollection = collection(firebaseStore, 'boardMembers')

export const getBoardMemberByEmail = async (email: string): Promise<IBoardMemberInfo | null> => {
  const docRef = doc(boardMemberCollection, email)
  const docSnap = await getDoc(docRef)
  return (docSnap.data() as IBoardMemberInfo) || null
}

export const addBoardMember = async (
  memberInfo: IBoardMemberInfo
): Promise<{ boardMemberInfo: IBoardMemberInfo; newUser: boolean }> => {
  const memberWithSameEmail = await getBoardMemberByEmail(memberInfo.email)
  if (memberWithSameEmail) {
    return {
      boardMemberInfo: memberWithSameEmail,
      newUser: false,
    }
  }
  await setDoc(doc(boardMemberCollection, memberInfo.email), memberInfo)
  return {
    boardMemberInfo: memberInfo,
    newUser: true,
  }
}

export const getBoardMemberByUsername = async (username: string): Promise<IBoardMemberInfo | null> => {
  const q = query(boardMemberCollection, where('username', '==', username))
  const querySnapshot = (await getDocs(q)).docs
  if (querySnapshot.length === 0) {
    return null
  }
  return querySnapshot[0].data() as IBoardMemberInfo
}

export const listBoardMembers = async (params: IListBoardMembersParams): Promise<IBoardMemberInfo[]> => {
  const q = query(boardMemberCollection, limit(params.limit))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IBoardMemberInfo)
}

export const usernameExists = async (username: string): Promise<boolean> => {
  const user = await getBoardMemberByUsername(username)
  return !!user
}

export const updateBoardMember = async (email: string, partialMemberInfo: Partial<IBoardMemberInfo>): Promise<null> => {
  await updateDoc(doc(boardMemberCollection, email), partialMemberInfo as any)
  return null
}
