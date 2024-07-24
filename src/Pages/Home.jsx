import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import "../App.css"
// import "../Style/HomePage_video_shaddow.css"


import CTAButtom from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import HilightText from '../components/core/HilightText'

const Home = () => {
    return (
        <div>

        {/* { section 1} */}
            <div className='relative  mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between '>

                <Link to="/signup">
                    <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                transition-all  delay-150 hover:-translate-y-1 hover:scale-95  duration-200'>
                        <div className='flex flex-row items-center gap-2  rounded-full px-10 py-[10px]
                group-hover:bg-richblack-900'>
                            <p>Become an instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>

                </Link>

                <div className='text-center mt-12 text-4xl font-semibold'>
                    Empower Your Future With <span className='text-blue-50 font-bold'>Coding Skills</span>
                </div>

                <div className='w-[90%] mt-10 text-center text-richblue-300 text-xl font-bold'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButtom active={true} linkTo={"/signup"}>
                        Learn More
                    </CTAButtom>
                    <CTAButtom  active={false} linkTo={"/login"}>
                        Book a Demo
                    </CTAButtom>
                </div>

                <div className='custom-shadow mx-3 my-12 shadow-blue-200  w-[90%] relative'>
                    
                    <video muted loop autoPlay>
                        <source src={Banner} type="video/mp4"/>
                    </video>
                    
                </div>

                {/* {codesection 1} */}

                <div>
                    <CodeBlocks 
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                unlock your <HilightText text={"coding potential"}/> with our online courses
                            </div>

                        }
                        subheading={"Our courses are Designed and taught by industry experts who have years of experience in coding "}
                        ctabtn1={

                            {
                                btnText: " try it yourself",
                                linkTo : "/signup",
                                active: true
                            }
                        }
                        ctabtn2={

                            {
                                btnText: " learn more",
                                linkTo : "/login",
                                active: false
                            }
                        }
                        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
                        codeColor={"text-yellow-25"}
                        backgroundGradient={"grad"}
                        
                     />
                </div>

                {/* {codesection 2} */}
                <div>
                    <CodeBlocks 
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className='text-4xl font-semibold'>
                               Start <span className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-bold">coding</span>
                               <HilightText text={" in seconds"}/>
                            </div>

                        }
                        subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                        ctabtn1={

                            {
                                btnText: " try it yourself",
                                linkTo : "/signup",
                                active: true
                            }
                        }
                        ctabtn2={

                            {
                                btnText: " learn more",
                                linkTo : "/login",
                                active: false
                            }
                        }
                        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
                        codeColor={"text-yellow-25"}
                        backgroundGradient={"grad2"}

                        
                     />
                </div>

            </div>


        {/* //section 2*/}
       






        </div>
    )
}

export default Home
