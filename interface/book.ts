export interface IBookInfo {
  id: string
  title: string
  subTitle: string
  description: string
  authors: string[]
  url: string
  imageUrls: {
    smallThumbnail: string
    thumbnail: string
  }
  pageCount: number
  publisher: string
  publishedDate: string
  language: string
}

export enum BookZoomType {
  SMALL_THUMBNAIL = 1,
  THUMBNAIL = 2,
  SMALL = 3,
  MEDIUM = 4,
  LARGE = 5,
  EXTRA_LARGE = 6,
}
