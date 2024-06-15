export interface IBookInfo {
  id: string
  name: string
  url: string
  imageUrl: string
}

export interface IBookDetail extends IBookInfo {
  summary: string
  author: string
  releasedDate: string
  // genre
  // noOfPages
  // rating
}
