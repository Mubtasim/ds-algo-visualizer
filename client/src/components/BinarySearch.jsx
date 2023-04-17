import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateItems, updateItemToFind, updateTotalItems } from '../features/binarySearch/binarySearchSlice'
import Header from './Header'
import BinaryItem from './BinaryItem'

const BinarySearch = () => {

  const [screenSize, setScreenSize] = useState(getCurrenDimension());


  const items = useSelector((state) => state.binarySearch.items);
  const itemToFind = useSelector((state) => state.binarySearch.itemToFind);
  const totalItems = useSelector((state) => state.binarySearch.totalItems);
  
  const dispatch = useDispatch();

  function getCurrenDimension () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrenDimension());
    }

    window.addEventListener('resize', updateDimension);

    return (() => {
      window.removeEventListener('resize', updateDimension);
    })
  }, [screenSize])
  
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
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const itemCount = parseInt(formJson.itemCount, 10);
    const newItems = Array(itemCount).fill(0);
    for (let i = 0; i < itemCount; i++) newItems[i] = getRandomArbitrary(1, 10001);
    newItems.sort(compareFn);
    dispatch(updateTotalItems(itemCount));
    dispatch(updateItems(newItems));
  }

  function includeBarInBoundary (nodeId) {
    const barToMark = document.getElementById(`${nodeId}`);
    console.log('bartomark, nodeId',barToMark, nodeId);
    barToMark.children[0].classList.add('inBoundary');
  }

  function excludeFromBoundary(nodeId) {
    const barToMark = document.getElementById(`${nodeId}`);
    barToMark.children[0].classList.remove('inBoundary', 'midBar');
  }

  function markBarAsMid (nodeId) {
    const barToMark = document.getElementById(`${nodeId}`);
    barToMark.children[0].classList.add('midBar');
  }

  function binarySearch (e) {
    e.preventDefault();
    
    let l = 0;
    let r = totalItems-1;
    let midIdx = -1;
    let prevL = 0;
    let prevR = 0;
    
    let found = false;
    let firstIteration = true;

    
    function binarySearchLoop () {
      setTimeout(() => {
        // removeShowMarkerFromNodes();

        if (firstIteration) {
          for (let i = 0; i < totalItems; i++) {
            includeBarInBoundary(i.toString());
          }
          firstIteration = false;
        }
        
        midIdx = Math.floor((l + r) / 2);
        for (let i = prevL; i < l; i++) {
          excludeFromBoundary(i.toString());
        }
        for (let i = r + 1; i <= prevR; i++) {
          excludeFromBoundary(i.toString());
        }
        markBarAsMid(midIdx.toString());
        const midValue = items[midIdx];
        
        // showMarkerToNode(l.toString(), 'l');
        // showMarkerToNode(r.toString(), 'r');
        // showMarkerToNode(midIdx.toString(), 'm');
        
        if (midValue === itemToFind) {
          console.log('found at index', midIdx)
          found = true;
        } else if (itemToFind > midValue) {
          prevL = l;
          l = midIdx + 1;
        } else {
          prevR = r;
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

  function getRelativeHeight (maxItem, currentItem, offset, highest) {
    const factor = currentItem / maxItem;
    const height = highest * factor + offset;
    return height;
  }

  function getRelativeWidth (currentScreenWidth, currentTotalItems) {
    const canTakeWidth = currentScreenWidth - 300;
    return canTakeWidth/(2*currentTotalItems);
  }

  return (
    <div className="binarySearch">
      <Header />
      <div className="visualize">
        <div id="hoverValue"></div>
        <div className="binarySearchStage">
          <div className="binaryBars" >
            {
              items &&
              items.map((item, idx) => {
                const height = getRelativeHeight(items[totalItems-1], item, 3, 300);
                const width = getRelativeWidth(screenSize.width, totalItems);
                return (
                  <BinaryItem key={idx} id={idx} value={item} width={width} height={height}/>
                )
              })
            }
          </div>
          <div className="info"></div>
        </div>
        <div className="configurator">
          <form className="createListForm" onSubmit={createItems}>
            <label className='formlabel'>Item Count</label>
            <input type="number" name='itemCount' placeholder='Item Count' min='1' max='5000'/>
            <button type='submit' className='button'>Create List</button>
          </form>
          <form action="" className='findNumberForm' onSubmit={binarySearch}>
            <label className='formlabel'>Number to find</label>
            <input type="number" name='numberToFind' placeholder='Number to find'  onChange={(e) => dispatch(updateItemToFind(parseInt(e.target.value, 10)))}/>
            <button type='submit' className='button'>Start Searching</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BinarySearch