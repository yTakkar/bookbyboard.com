import { qs } from 'url-parse'
import appConfig from '../config/appConfig'
import { GoogleBookItem, GoogleBookResponse } from '../interface/googleBook'
import { BookZoomType, IBookInfo } from '../interface/book'

export const searchGoogleBooksByName = async (name: string): Promise<GoogleBookResponse | null> => {
  const params = {
    q: name,
    key: appConfig.integrations.googleBooks.apiKey,
  }

  const url = `${appConfig.integrations.googleBooks.baseUrl}volumes?${qs.stringify(params)}`

  const res = await fetch(url)
  const json = await res.json()
  return json
}

export const prepareBookInfo = (googleBookItem: GoogleBookItem): IBookInfo => {
  const { volumeInfo } = googleBookItem
  return {
    id: googleBookItem.id,
    title: volumeInfo.title,
    subTitle: volumeInfo.subtitle || '',
    description: volumeInfo.description || '',
    authors: volumeInfo.authors || [],
    url: volumeInfo.previewLink,
    imageUrls: {
      smallThumbnail: volumeInfo.imageLinks?.smallThumbnail || '',
      thumbnail: volumeInfo.imageLinks?.thumbnail || '',
    },
    pageCount: volumeInfo.pageCount || 0,
    publisher: volumeInfo.publisher || '',
    publishedDate: volumeInfo.publishedDate || '',
    language: volumeInfo.language || '',
  }
}

export const enlargeImage = (url: string, zoomType: BookZoomType) => {
  const zoomedUrl = url.replace(/zoom=\d/, `zoom=${zoomType}`)
  return zoomedUrl
}
