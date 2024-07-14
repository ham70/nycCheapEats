import React from 'react'

const About = () => {
  return (
    <div className='long-text'>
      <h1>About NYC CHEAP EATS</h1>

      <div className='text-box'>
        <p>Hi everyone thank you for checking out my website. My name is Matthew and nyc cheap eats is a small passion project of mine
          mostly made for the purpose of helping me keep track of all the cheap restaurants I want to eat at or 
          have eatten at in nyc. As a student I want to stretch my dollar as much as possible when going out.
        </p>
        <p>
          I'm still learning the ins and outs of web-development and I plan on expanding on this sight in the future. Adding more restaurants
          and features to the site. I also plan on keeping all the source code for this project available on my github at https://github.com/ham70 if anyone is interested.
        </p>
        <p>
          When you open this site, your first search may take a while to process. This is because the backend of this website is hosted on Render for free
          which means the server hosting the backend will spindown with inactivity thus making your first search take longer as the server spins back up.
        </p>
        <p>
          Have a great day! :D
        </p>
      </div>
      <h1 className='abt-header'>How To Use</h1>
      <h2>Searching</h2>
      <p className='text-box'>Restaurants may be searched for by name, borough (or any other address details),
           cuisine, and or any other text that may be found in the description of the restuarant such as food items. </p>
      <h2>Social Media Links</h2>
      <p className='text-box'>
        At the buttom of each restaurant page there are 4 icons that link to the restaurant's website, Instagram,
        X, and FaceBook accounts in that order respectively from left to right. If there is no link the icon will 
        appear black.
      </p>
    </div>
  )
}

export default About