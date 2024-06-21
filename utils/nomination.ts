import { INominationDetail, INominationSuggestion } from '../interface/nomination'

export const getNextNominationId = () => {
  const currentMonth = new Date().getUTCMonth()
  const currentYear = new Date().getUTCFullYear()

  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear

  return `${nextMonth}-${nextYear}`
}

export const getCurrentNominationId = () => {
  const currentMonth = new Date().getUTCMonth()
  const currentYear = new Date().getUTCFullYear()
  return `${currentMonth}-${currentYear}`
}

export const getMonthYearIndexFromId = (id: string): { month: number; year: number } => {
  const [month, year] = id.split('-')
  return { month: parseInt(month), year: parseInt(year) }
}

export const getMonthNameFromId = (id: string) => {
  const { month, year } = getMonthYearIndexFromId(id)
  return new Date(year, month).toLocaleString('default', { month: 'long' })
}

export const hasMemberNominated = (email: string | null, nomination: INominationDetail | null): boolean => {
  if (email && nomination?.suggestions) {
    return nomination.suggestions.some(suggestion => suggestion.boardMemberEmail === email)
  }
  return false
}

export const hasMemberVoted = (email: string | null, nomination: INominationDetail | null): boolean => {
  if (!email || !nomination?.suggestions) return false
  const alLVotes = nomination.suggestions.map(suggestion => suggestion.votes || []).flat()
  return alLVotes.some(vote => vote === email)
}

export const getMemberVotedSuggestion = (
  email: string | null,
  nomination: INominationDetail | null
): INominationSuggestion | null => {
  if (!email || !nomination?.suggestions) return null

  const foundSuggestions = nomination.suggestions
    .map(s => {
      if ((s.votes || []).includes(email)) return s
      return null
    })
    .filter(s => s !== null) as INominationSuggestion[]

  return foundSuggestions[0] || null
}
