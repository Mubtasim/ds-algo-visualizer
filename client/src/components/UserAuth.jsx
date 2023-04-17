import React, { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'

const UserAuth = () => {
  const [toSignUp, setToSignUp] = useState(false)

  function toggleSignUp () {
    setToSignUp(!toSignUp);
  }

  return (
    <div className="userAuth">
      {
        toSignUp ? <SignIn toggleSignUp={toggleSignUp}/> : <SignUp toggleSignUp={toggleSignUp}/>
      }
    </div>
  )
}

export default UserAuth