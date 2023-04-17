import React from 'react'
import Header from './Header'

const SignUp = ({toggleSignUp}) => {
  return (
    <div className="signUpPage">
      <Header />
      <div className="signUp">
        <h1 className='formTitle'>Create Account</h1>
        <form action="#" className="signUp__form form">
          <label htmlFor="name">Name</label>
          <input type="text" name='name' />
          <label htmlFor="email">Email</label>
          <input type="email" />
          <label htmlFor="password">Password</label>
          <input type="password" />
          <button type='submit' className='button'>Sign Up</button>
        </form>
        <div className="toggler">
          Already a user? <button className='button button-toggler' onClick={toggleSignUp}>Sign In</button>
        </div>
      </div>
    </div>
  )
}

export default SignUp