import React from 'react'
import appConfig from '../config/appConfig'

interface IProps {}

function ProductInfoBanner(props: IProps) {
  return (
    <div className="bg-gray-300 shadow rounded px-4 py-6 flex flex-col lg:flex-row">
      <div className="">
        <div className="font-semibold">What is {appConfig.global.app.name}?</div>
        <div className="mt-2 html-body">
          <ol type="1">
            <li>Every month, our board members, who are book enthusiasts nominate their favorite books.</li>
            <li>These nominations are then put to a vote.</li>
            <li>
              The book with the most votes becomes our "Book of the Month," which we feature prominently on our
              platform.
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default ProductInfoBanner
