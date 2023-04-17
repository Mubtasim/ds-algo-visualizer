import React from 'react'
import Header from './Header'

const SignIn = ({toggleSignUp}) => {
  return (
    <div className="signInPage">
      <Header />
      <div className="signIn">
        <form action="#" className="signIn__form form">
          <label htmlFor="email">Email</label>
          <input type="email" />
          <label htmlFor="password">Password</label>
          <input type="password" />
          <button type='submit' className='button'>Sign In</button>
        </form>
        <div className="toggler">
          Don't have an account? <button className='button button-toggler' onClick={toggleSignUp}>Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default SignIn