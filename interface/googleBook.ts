export interface GoogleBookResponse {
  kind: string
  totalItems: number
  items: GoogleBookItem[]
}

export interface GoogleBookItem {
  kind: 'books#volume'
  id: string
  etag: string
  selfLink: string
  volumeInfo: GoogleBookVolumeInfo
  saleInfo: GoogleBookSaleInfo
  accessInfo: GoogleBookAccessInfo
  searchInfo: GoogleBookSearchInfo
}

export interface GoogleBookAccessInfo {
  country: 'IN'
  viewability: GoogleBookViewability
  embeddable: boolean
  publicDomain: boolean
  textToSpeechPermission: 'ALLOWED'
  epub: GoogleBookEpub
  pdf: GoogleBookEpub
  webReaderLink: string
  accessViewStatus: GoogleBookAccessViewStatus
  quoteSharingAllowed: boolean
}

export enum GoogleBookAccessViewStatus {
  None = 'NONE',
  Sample = 'SAMPLE',
}

export interface GoogleBookEpub {
  isAvailable: boolean
  acsTokenLink?: string
}

export enum GoogleBookViewability {
  NoPages = 'NO_PAGES',
  Partial = 'PARTIAL',
}

export interface GoogleBookSaleInfo {
  country: 'IN'
  saleability: GoogleBookSaleability
  isEbook: boolean
  listPrice?: GoogleBookSaleInfoListPrice
  retailPrice?: GoogleBookSaleInfoListPrice
  buyLink?: string
  offers?: GoogleBookOffer[]
}

export interface GoogleBookSaleInfoListPrice {
  amount: number
  currencyCode: 'INR'
}

export interface GoogleBookOffer {
  finskyOfferType: number
  listPrice: GoogleBookOfferListPrice
  retailPrice: GoogleBookOfferListPrice
}

export interface GoogleBookOfferListPrice {
  amountInMicros: number
  currencyCode: 'INR'
}

export enum GoogleBookSaleability {
  ForSale = 'FOR_SALE',
  NotForSale = 'NOT_FOR_SALE',
}

export interface GoogleBookSearchInfo {
  textSnippet: string
}

export interface GoogleBookVolumeInfo {
  title: string
  authors: string[]
  publisher: string
  publishedDate: string
  description: string
  industryIdentifiers: GoogleBookIndustryIdentifier[]
  readingModes: GoogleBookReadingModes
  pageCount: number
  printType: 'BOOK'
  categories: GoogleBookCategory[]
  averageRating?: number
  ratingsCount?: number
  maturityRating: 'NOT_MATURE'
  allowAnonLogging: boolean
  contentVersion: string
  panelizationSummary: GoogleBookPanelizationSummary
  imageLinks: GoogleBookImageLinks
  language: 'en'
  previewLink: string
  infoLink: string
  canonicalVolumeLink: string
  subtitle?: string
}

export enum GoogleBookCategory {
  Fiction = 'Fiction',
  Humor = 'Humor',
}

export interface GoogleBookImageLinks {
  smallThumbnail: string
  thumbnail: string
}

export interface GoogleBookIndustryIdentifier {
  type: GoogleBookType
  identifier: string
}

export enum GoogleBookType {
  Isbn10 = 'ISBN_10',
  Isbn13 = 'ISBN_13',
}

export interface GoogleBookPanelizationSummary {
  containsEpubBubbles: boolean
  containsImageBubbles: boolean
}

export interface GoogleBookReadingModes {
  text: boolean
  image: boolean
}
