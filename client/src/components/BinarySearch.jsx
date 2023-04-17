import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateItems, updateItemToFind, updateTotalItems } from '../features/binarySearch/binarySearchSlice'
import Header from './Header'
import BinaryItem from './BinaryItem'

const BinarySearch = () => {

  const items = useSelector((state) => state.binarySearch.items);
  const itemToFind = useSelector((state) => state.binarySearch.itemToFind);
  const totalItems = useSelector((state) => state.binarySearch.totalItems)
  
  const dispatch = useDispatch();
  
  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function compareFn (a, b) {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  function createItems (e) {
    e.preventDefault();
    removeMarkerDivs();
    const newItems = Array(totalItems).fill(0);
    for (let i = 0; i < totalItems; i++) newItems[i] = getRandomArbitrary(1, 101);
    newItems.sort(compareFn);
    dispatch(updateItems(newItems));
  }

  function removeMarkerDivs () {
    let markerDivs = document.querySelectorAll('.marker');
    console.log(markerDivs);
    markerDivs.forEach(markerDiv => {
      console.log(markerDiv);
      markerDiv.remove();
    })
  }

  function showMarkerToNode (nodeId, markerType) {
    let nodeToMark = document.getElementById(`${nodeId}-${markerType}`);
    nodeToMark.classList.add('showMarker');
  }

  function removeShowMarkerFromNodes () {
    let markedDivs = document.querySelectorAll('.showMarker');
    console.log(markedDivs);
    markedDivs.forEach(markedDiv => {
      console.log(markedDiv);
      markedDiv.classList.remove('showMarker');
    })
  }

  function binarySearch (e) {
    e.preventDefault();
    removeShowMarkerFromNodes();
    
    let l = 0;
    let r = totalItems-1;
    let midIdx = -1;
    
    let found = false;
    
    function binarySearchLoop () {
      setTimeout(() => {
        removeShowMarkerFromNodes();
        
        midIdx = Math.floor((l + r) / 2);
        const midValue = items[midIdx];
        
        showMarkerToNode(l.toString(), 'l');
        showMarkerToNode(r.toString(), 'r');
        showMarkerToNode(midIdx.toString(), 'm');
        
        if (midValue === itemToFind) {
          console.log('found at index', midIdx)
          found = true;
        } else if (itemToFind > midValue) {
          l = midIdx + 1;
        } else {
          r = midIdx - 1;
        }

        if (l > r) {
          console.log('Item not found');
        } else if (!found) {
          binarySearchLoop();
        }
      }, 5000);
    }

    binarySearchLoop();
  }

  return (
    <div className="binarySearch">
      <Header />
      <div className="visualize">
        <div className="binarySearchStage">
          {
            items &&
            items.map((item, idx) => <BinaryItem key={idx} id={idx} value={item}/>)
          }
        </div>
        <div className="configurator">
          <form className="createListForm" onSubmit={createItems}>
            <label className='formlabel'>Item Count</label>
            <input type="number" placeholder='Item Count' min='1' max='40' onChange={(e) => dispatch(updateTotalItems(parseInt(e.target.value, 10)))}/>
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