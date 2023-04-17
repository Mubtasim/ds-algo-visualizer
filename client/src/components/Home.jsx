import React from 'react'

const Home = () => {
  return (
    <div className='hero container'>
      <div className="hero__tagline">
        <h1 className='hero__title'>DS & Algo Visualizer</h1>
        <div className="hero__subtitle">
          An interactive platform to visualize data structures & algorithms!
        </div>
      </div>
      <a className="hero__cta button" href='/dslist' type='button'>Start Visualizing</a>
    </div>
  )
}

export default Home