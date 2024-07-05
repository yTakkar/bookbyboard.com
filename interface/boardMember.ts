export interface IBoardMemberInfo {
  id: string
  email: string
  username: string
  name: string
  createdAt: number // date mills
  avatarUrl: string
  bio: string | null
  websiteUrl: string | null
  socialUsernames: {
    twitter: string | null
    instagram: string | null
    youtube: string | null
  }
}

export interface IListBoardMembersParams {
  limit?: number
}
