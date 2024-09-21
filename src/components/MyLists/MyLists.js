import React from 'react'
import SavedFilterList  from "./SavedFilterList.js"
import BookmarkedList  from "./BookmarkedList.js"
import ApplyList  from "./ApplyList.js"

const MyLists = () => {
  return (
    <div className='p-4'>
        <h2 className="text-2xl  p-2 my-2"//text-white bg-blue-700
      >My Lists</h2>
      <SavedFilterList/>
      <BookmarkedList/>
      <ApplyList/>
    </div>
  )
}

export default MyLists