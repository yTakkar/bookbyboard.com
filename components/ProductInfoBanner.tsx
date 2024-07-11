import React from 'react'
import appConfig from '../config/appConfig'

interface IProps {}

function ProductInfoBanner(props: IProps) {
  return (
    <div className="bg-gray-300 shadow rounded px-4 py-6 flex flex-col lg:flex-row">
      <div className="">
        <div className="font-semibold">What is {appConfig.global.app.name}?</div>
        <div className="mt-1">
          {`Every month, our board members, who are passionate readers from various backgrounds, propose their favorite books. These suggestions are then put to a vote. The book with the most votes becomes our "Book of the Month," which we feature prominently on our platform.`}
        </div>
      </div>
    </div>
  )
}

export default ProductInfoBanner
