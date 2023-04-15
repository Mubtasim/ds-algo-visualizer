import React from 'react'
import Header from './Header'

const DsList = () => {
  return (
    <div className="disListPage">
      <Header />
      <div className="dsList">
        <a href="/1" className='button'>Dijkstra</a>
        <a href="/2" className='button'>Binary Search</a>
      </div>
    </div>
  )
}

export default DsList