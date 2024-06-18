import { IBookInfo } from './book'

export interface INominationSuggestion {
  boardMemberEmail: string
  book: IBookInfo
  note: string | null
  voteCount: number | null
}

export interface INominationSelectedBook {
  id: string
  book: IBookInfo
}

export interface INominationDetail {
  id: string // month-year
  date: number // date mills
  suggestions: INominationSuggestion[]
  selectedBook: INominationSelectedBook | null
}
