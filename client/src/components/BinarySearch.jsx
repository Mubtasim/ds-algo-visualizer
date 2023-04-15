import React, { useState } from 'react'
import Header from './Header'
import BinaryItem from './BinaryItem'

const BinarySearch = () => {
  const [itemCount, setItemCount] = useState(-1)
  const [items, setItems] = useState(null)
  const [numberToFind, setNumberToFind] = useState(-1)
  const [left, setLeft] = useState(-1)
  const [right, setRight] = useState(-1)
  const [mid, setMid] = useState(-1)

  function createItems (e) {
    e.preventDefault();
    const newItems = Array(itemCount).fill(0);
    for (let i = 0; i < itemCount; i++) newItems[i] = i + 1;
    setItems(newItems);
  }

  function binarySearch (e) {
    e.preventDefault();
    let l = 1, r = itemCount;
    setLeft(1);
    setRight(r);
    console.log()
    while(l <= r) {
      const midNow = Math.floor((l + r) / 2);
      setMid(midNow);
      console.log('left, mid, right, numbertofind', l, midNow, r, numberToFind);
      if (midNow === numberToFind) {
        console.log('found')
        break;
      } else if (numberToFind > midNow) {
        l = midNow + 1;
        setLeft(l);
      } else {
        r = midNow - 1;
        setRight(r);
      }
    }
    console.log('finished')
  }

  return (
    <div className="binarySearch">
      <Header />
      <div className="visualize">
        <div className="binarySearchStage">
          {
            items &&
            items.map((item, idx) => <BinaryItem key={idx} value={item} left={left} right={right} mid={mid}/>)
          }
        </div>
        <div className="configurator">
          <form className="createListForm" onSubmit={createItems}>
            <label className='formlabel'>Item Count</label>
            <input type="number" placeholder='Item Count' min='1' max='30' onChange={(e) => setItemCount(parseInt(e.target.value, 10))}/>
            <button type='submit' className='button'>Create List</button>
          </form>
          <form action="" className='findNumberForm' onSubmit={binarySearch}>
            <label className='formlabel'>Number to find</label>
            <input type="number" placeholder='Number to find'  onChange={(e) => setNumberToFind(parseInt(e.target.value, 10))}/>
            <button type='submit' className='button'>Start Searching</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BinarySearch