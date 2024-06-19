import { IBookInfo } from './book'

export interface INominationSuggestion {
  boardMemberEmail: string
  book: IBookInfo
  note: string | null
  votes: string[] | null // member emails
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
  live: boolean
}
