import React from 'react'
import "./About.css"

function About() {
  return (
    <div className='about-container'>
        <div className='about-title'>
            {/* <h2> About</h2> */}
        </div>

        <div className='about-content'>
            <p><b>About Our App</b></p>

            <p><b>Why We Created the Split Bill Web-App</b></p>

            <p>Have you ever found yourself in a restaurant with friends, spending what feels like forever trying to 
                figure out who owes what? That's exactly where our story begins. 
            </p>
                
            <p>After a delightful dinner with friends,
                 we faced the daunting task of splitting the bill. With shared platters on the table and diverse dietary
                  needs in the mix – from vegan to lactose intolerant, and some avoiding alcohol – 
                  the challenge was real.
            </p>

            <p>That's when the idea struck us. Why not create a solution that makes life easier? And so, our Split Bill 
                Web-App was born. It's more than just an app; it's our way of turning a common social dilemma into a 
                quick, fair, and hassle-free experience.
            </p>

            <p>
            Now, everyone pays only for what they enjoy, and the joy of 
                dining together remains unspoiled by the bill that follows.
            </p>

            <p>
                Enjoy!😄
            </p>
        </div>
    </div>
  )
}

export default About
