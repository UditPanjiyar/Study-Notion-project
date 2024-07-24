import React from 'react'

const HilightText = ({text}) => {
  return (
    <div>
      <span  className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-semibold' >
        {" "}
        {text}
      </span>
    </div>
  )
}

export default HilightText
