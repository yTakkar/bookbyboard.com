import { IBookDetail, IBookInfo } from './book'

export interface INominationSuggestion {
  boardMemberId: string
  bookInfo: IBookInfo
  note: string | null
}

export interface INominationSelectedBook {
  id: string
  bookDetail: IBookDetail
}

export interface INominationDetail {
  id: string // month-year
  date: string // date mills
  suggestions: INominationSuggestion[]
  selectedBook: INominationSelectedBook | null
}
