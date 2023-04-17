import React from 'react'

const BinaryItem = ({value, id}) => {

  return (
    <div className='binaryItem' id={id}>
      <div className="binaryNode">
        {value}
      </div>
      <div className="itemIdx">
        {id + 1}
      </div>
      <div className="marker" id={`${id}-l`}>
        L
      </div>
      <div className="marker" id={`${id}-r`}>
        R
      </div>
      <div className="marker" id={`${id}-m`}>
        M
      </div>
    </div>
  )
}

export default BinaryItem