import { INominationDetail } from '../interface/nomination'

export const getNominationId = () => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear

  return `${nextMonth}-${nextYear}`
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

export const hasMemberVoted = () => false
