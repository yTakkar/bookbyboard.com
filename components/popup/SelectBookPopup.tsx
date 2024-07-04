import React, { useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import Loader, { LoaderType } from '../loader/Loader'
import { toastError } from '../Toaster'
import { prepareBookInfo, searchGoogleBooksByName } from '../../utils/book'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import { PencilAltIcon } from '@heroicons/react/outline'
import { IBookInfo } from '../../interface/book'
import classNames from 'classnames'
import CoreImage from '../core/CoreImage'
import appConfig from '../../config/appConfig'
import CoreTextarea from '../core/CoreTextarea'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreDivider from '../core/CoreDivider'
import { APP_LOGO } from '../../constants/constants'

interface ISelectBookPopupProps {
  onClose: () => void
  onBookSelect: (book: IBookInfo, note: string) => void
}

const SelectBookPopup: React.FC<ISelectBookPopupProps> = props => {
  const { onClose, onBookSelect } = props

  const [searchValue, setSearchValue] = useState('')
  const [loading, toggleLoading] = useState(false)
  const [books, setBooks] = useState<IBookInfo[]>([])
  const [selectedBook, setSelectedBook] = useState<IBookInfo | null>(null)
  const [note, setNote] = useState('')

  const fetchBooksByName = (name: string) => {
    toggleLoading(true)

    searchGoogleBooksByName(name)
      .then(resp => {
        const books = resp?.items.map(item => prepareBookInfo(item))
        setBooks(books || [])
      })
      .catch(() => {
        toastError('Failed to fetch books')
      })
      .finally(() => {
        toggleLoading(false)
      })
  }

  const renderBook = (book: IBookInfo) => {
    return (
      <div key={book.id} className="cursor-pointer" onClick={() => setSelectedBook(book)}>
        <div className="flex items-center">
          <div>
            <CoreImage
              url={book.imageUrls.smallThumbnail}
              alt={`${book.title} on ${appConfig.global.app.name}`}
              className="w-6 mr-2"
            />
          </div>

          <div className="flex-1">
            <div className="font-semibold">{book.title}</div>
            <div className="text-sm text-gray-600">{book.authors.join(', ')}</div>
          </div>
        </div>
        <div className="border-b border-gray-200 my-2" />
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    if (selectedBook) {
      return (
        <div className="w-full h-full top-0 bg-white absolute p-4 rounded-lg">
          <div>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedBook(null)}>
              <div className="flex justify-center">
                <CoreImage
                  url={selectedBook.imageUrls.thumbnail}
                  alt={`${selectedBook.title} on ${appConfig.global.app.name}`}
                  className="w-16"
                />
              </div>

              <div className="mb-4 mt-2 underline">
                {selectedBook.title} <PencilAltIcon className="w-4 ml-1 inline" />
              </div>
            </div>

            <CoreDivider className="my-4" />

            <div className="mb-1">Want to add a note along with your nomination?</div>
            <CoreTextarea
              value={note}
              setValue={setNote}
              placeholder="A note/review you want to attach"
              className={classNames('user-input h-40', {})}
              sanitizeOnBlur
            />
            <div className="flex justify-end">
              <CoreButton
                type={CoreButtonType.SOLID_PRIMARY}
                size={CoreButtonSize.MEDIUM}
                label="Submit"
                onClick={() => {
                  onBookSelect(selectedBook, note)
                  onClose()
                }}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4">
        {books.length === 0 ? (
          <div className={classNames('p-5 flex flex-col items-center justify-center mt-16')}>
            <div className="w-20 h-20 bg-gray-300 mb-4"></div>
            <div className="text-center mt-2">{`No books found. Try searching.`}</div>
          </div>
        ) : (
          <div>
            {books.map(book => (
              <React.Fragment key={book.id}>{renderBook(book)}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: 'Select a book',
        disableOutsideClick: true,
      }}>
      <div className="">
        <div className="flex items-center sticky top-0 p-4 bg-white shadow">
          <div className="flex-grow relative">
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Search by book title or author name"
              autoFocus
              autoComplete="off"
              inputClassName={'!py-1 !pr-8 !pl-2'}
              showClearIcon
              value={searchValue}
              setValue={setSearchValue}
              onClearClick={() => {
                setSearchValue('')
              }}
              onEnter={() => {
                const validValue = searchValue.trim()
                if (validValue) {
                  fetchBooksByName(validValue)
                } else {
                  setBooks([])
                }
              }}
            />
          </div>
          <CoreButton
            type={CoreButtonType.SOLID_PRIMARY}
            label="Search"
            size={CoreButtonSize.SMALL}
            className="ml-1 py-[6px]"
            onClick={() => {
              const validValue = searchValue.trim()
              if (validValue) {
                fetchBooksByName(validValue)
              } else {
                setBooks([])
              }
            }}
          />
        </div>
        {renderContent()}
      </div>
    </FullWidthModal>
  )
}

export default SelectBookPopup
