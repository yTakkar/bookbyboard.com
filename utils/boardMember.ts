import { User } from 'firebase/auth'
import { IBoardMemberInfo } from '../interface/boardMember'
import appConfig from '../config/appConfig'
import { decode, encode } from './storage'
import { getRandomAvatar } from './avatars'
import { dynamicUniqueNamesGenerator } from '../components/dynamicModules'

const key = `${appConfig.global.app.key}-BOARD-MEMBER-INFO`

export const getLocalBoardMemberInfo = (): IBoardMemberInfo | null => {
  const data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(decode(data))
  }
  return null
}

export const setLocalBoardMemberInfo = (userInfo: IBoardMemberInfo) => {
  localStorage.setItem(key, encode(JSON.stringify(userInfo)))
}

export const deleteLocalBoardMemberInfo = () => {
  localStorage.removeItem(key)
}

export const prepareBoardMemberInfo = async (user: User): Promise<IBoardMemberInfo> => {
  const uniqueNamesGenerator = await dynamicUniqueNamesGenerator()

  const numberDictionary = uniqueNamesGenerator.NumberDictionary.generate({ min: 100, max: 1e10 })
  const username = uniqueNamesGenerator.uniqueNamesGenerator({
    dictionaries: [uniqueNamesGenerator.adjectives, uniqueNamesGenerator.names, numberDictionary],
    separator: '_',
    style: 'lowerCase',
  })

  const avatar = await getRandomAvatar()

  return {
    id: user.uid,
    username,
    name: user.displayName!,
    email: user.email!,
    createdAt: new Date().getTime(),
    bio: null,
    websiteUrl: null,
    avatarUrl: avatar,
    socialUsernames: {
      instagram: null,
      twitter: null,
      youtube: null,
    },
  }
}

export const isSessionUser = (user: IBoardMemberInfo | null, profileInfo: IBoardMemberInfo | null) => {
  return user?.email === profileInfo?.email
}
