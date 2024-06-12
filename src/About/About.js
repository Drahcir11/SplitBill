import React from 'react'
import "./About.css"

function About() {
  return (
    <div className='about-container' style={{marginTop: "32px"}}>
        <div className='about-title'>
            {/* <h2> About</h2> */}
        </div>

        <div className='about-content'>

            <p style={{fontSize: "16px"}}><b>Why?</b></p>

            <p>When there's too many people going out for dinner or too many dietary requirements.</p>

            <p style={{
                marginTop: "32px"
            }}>Frankly the bill gets <b>messy...</b></p>

            <p
            style={{
                marginTop: "8px"
            }}>This App serves to make it easier to keep friends accountable on what they ate.</p>


            <p>
            Now everyone pays only for what they enjoy!
            </p>

            <p style={{
                marginTop: "56px"
            }}>
                Happy hunting!😄
            </p>
        </div>
    </div>
  )
}

export default About
