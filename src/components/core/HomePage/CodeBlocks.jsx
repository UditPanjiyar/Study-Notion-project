import react from 'react'
import CTAButton from './Button'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'



const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
    return (
        <div className={`flex ${position} my-20 justify-between gap-10`}>

            {/* {section 1} */}
            <div className='w-[40%] flex flex-col gap-8'>
                {heading}
                <div className='text-richblack-300  font-bold '>
                    {subheading}
                </div>
                <div className='flex gap-7 mt-7'>

                    <CTAButton active={ctabtn1.active} linkTo={ctabtn1.linkTo}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.btnText}
                            <FaArrowRight />
                        </div>

                    </CTAButton>

                    <CTAButton active={ctabtn2.active} linkTo={ctabtn2.linkTo}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn2.btnText}
                        </div>

                    </CTAButton>

                </div>

            </div>

            {/* {section 2} */}
            <div className=' glass h-fit flex flex-row  w-[100%] py-4 lg:w-[500px] '>

                <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold '>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                </div>

                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                    <div className={`${backgroundGradient}`}></div>
                    <TypeAnimation
                        sequence={[codeblock, 2000, ""]}
                        repeat={Infinity}
                        cursor={true}
                        style={
                            {
                                whiteSpace: "pre-line",
                                display: "block",
                                overflowX: "hidden",
                                fontSize: "16px",
                            }
                        }
                        omitDeletionAnimation={true}
                    />
                </div>

            </div>

        </div>
    )
}

export default CodeBlocks

