import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateItems, updateLeft, updateRight, updateMid, updateItemToFind, updateTotalItems } from '../features/binarySearch/binarySearchSlice'
import Header from './Header'
import BinaryItem from './BinaryItem'

const BinarySearch = () => {

  const items = useSelector((state) => state.binarySearch.items);
  const left = useSelector((state) => state.binarySearch.left);
  const right = useSelector((state) => state.binarySearch.right);
  const mid = useSelector((state) => state.binarySearch.mid);
  const itemToFind = useSelector((state) => state.binarySearch.itemToFind);
  const totalItems = useSelector((state) => state.binarySearch.totalItems)

  const dispatch = useDispatch();

  function createItems (e) {
    e.preventDefault();
    const newItems = Array(totalItems).fill(0);
    for (let i = 0; i < totalItems; i++) newItems[i] = i + 1;
    dispatch(updateItems(newItems));
  }

  function binarySearch (e) {
    e.preventDefault();
    
    dispatch(updateLeft(1));
    dispatch(updateRight(items.length));

    let found = false;
    let called = 0;

    // function binarySearchLoop () {
    //   setTimeout(() => {
    //     called++;
    //     if (called > 10) return;
    //     const midNow = Math.floor((left + right) / 2);
    //     dispatch(updateMid(midNow));
    //     if (mid === itemToFind) {
    //       console.log('found')
    //       found = true;
    //     } else if (itemToFind > mid) {
    //       dispatch(updateLeft(mid + 1));
    //     } else {
    //       dispatch(updateRight(mid - 1));
    //     }

    //     if (!found) {
    //       binarySearchLoop();
    //     }
    //   }, 5000);
    // }

    // binarySearchLoop();
    while(left <= right) {
      dispatch(updateMid(Math.floor(left + right) / 2));
      if (itemToFind === mid) {
        console.log('found');
        break;
      } else if (itemToFind > mid) {
        dispatch(updateLeft(mid + 1));
      } else {
        dispatch(updateRight(mid - 1));
      }
    }
    console.log('finished');

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
            <input type="number" placeholder='Item Count' min='1' max='30' onChange={(e) => dispatch(updateTotalItems(parseInt(e.target.value, 10)))}/>
            <button type='submit' className='button'>Create List</button>
          </form>
          <form action="" className='findNumberForm' onSubmit={binarySearch}>
            <label className='formlabel'>Number to find</label>
            <input type="number" placeholder='Number to find'  onChange={(e) => dispatch(updateItemToFind(parseInt(e.target.value, 10)))}/>
            <button type='submit' className='button'>Start Searching</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BinarySearch