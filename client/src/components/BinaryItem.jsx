import React from 'react'

const BinaryItem = ({value, left, right, mid}) => {
  return (
    <div className='binaryItem'>
      <div className="binaryNode">
        {value}
      </div>
      {
        left === value &&
        <div className="marker">
          L
        </div>
      }
      {
        right === value &&
        <div className="marker">
          R
        </div>
      }
      {
        mid === value &&
        <div className="marker">
          M
        </div>
      }
    </div>
  )
}

export default BinaryItem