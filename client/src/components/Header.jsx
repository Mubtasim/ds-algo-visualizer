import React from 'react'
import logo from '../assets/logo.svg'

const Header = () => {
  return (
    <div className='header container'>
      <a className="header__logo" href="/">
        <img src={logo} alt="logo" className='header__logoImage'/>
        <span className="header__logoText">DAV</span>
      </a>
      <ul className='header__pages'>
        <li><a href="/dslist" className='header__page'>Ds list</a></li>
      </ul>
      <div className="header__user">
        <a href="/userauth" className='header__auth'>Login/Register</a>
      </div>
    </div>
  )
}

export default Header