import React, { useEffect } from 'react'

const BinaryItem = ({value, id, width, height}) => {

  // const [domElem, setDomElem] = useState(null)

  useEffect(() => {
    const elem = document.getElementById(id);
    console.log(elem);
    function setHoverValue () {
      const hoverElem = document.getElementById('hoverValue');
      hoverElem.innerText = value;
    }

    function unsetHoverValue () {
      const hoverElem = document.getElementById('hoverValue');
      hoverElem.innerText = '';
    }

    elem.onmouseenter = setHoverValue;
    elem.onmouseleave = unsetHoverValue;
  }, [id, value]);

  return (
    <div className='binaryItem' id={id}>
      <div style={{width: width, height: height, marginRight: width}} className='binaryBar'>

      </div>
    </div>
  )
}

export default BinaryItem