import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import "../App.css"



import CTAButtom from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import HilightText from '../components/core/HomePage/HilightText'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import RatingSlider from "../components/core/Ratings/RatingSlider"


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
                    <CTAButtom active={false} linkTo={"/login"}>
                        Book a Demo
                    </CTAButtom>
                </div>

                <div className='custom-shadow mx-3 my-12 shadow-blue-200  w-[90%] relative'>

                    <video muted loop autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>

                </div>

                {/* {codesection 1} */}

                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                unlock your <HilightText text={"coding potential"} /> with our online courses
                            </div>

                        }
                        subheading={"Our courses are Designed and taught by industry experts who have years of experience in coding "}
                        ctabtn1={

                            {
                                btnText: " try it yourself",
                                linkTo: "/signup",
                                active: true
                            }
                        }
                        ctabtn2={

                            {
                                btnText: " learn more",
                                linkTo: "/login",
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
                                <HilightText text={" in seconds"} />
                            </div>

                        }
                        subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                        ctabtn1={

                            {
                                btnText: " try it yourself",
                                linkTo: "/signup",
                                active: true
                            }
                        }
                        ctabtn2={

                            {
                                btnText: " learn more",
                                linkTo: "/login",
                                active: false
                            }
                        }
                        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
                        codeColor={"text-yellow-25"}
                        backgroundGradient={"grad2"}


                    />
                </div>

                <ExploreMore />

            </div>


            {/* //section 2*/}
            <div className='bg-pure-greys-5 text-richblack-700'>

                <div className='homepage_bg h-[333px]'>

                    <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto'>
                        <div className='h-[150px]'></div>
                        <div className='flex flex-row gap-7 text-white '>

                            <CTAButtom active={true} linkTo={"/signup"}>
                                <div className='flex items-center gap-3'>
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButtom>
                            <CTAButtom active={false} linkTo={"/signup"}>
                                <div>
                                    Learn More
                                </div>

                            </CTAButtom>

                        </div>

                    </div>
                </div>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>

                    <div className='flex flex-row gap-5 mb-10 mt-[90px]'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the skills you need for
                            <HilightText text={"job that is in demand."} />

                        </div>
                        <div className='flex flex-col gap-10 w-[40%] items-start'>

                            <div className='text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButtom active={true} linkTo={"/signup"}>
                                <div>
                                    Learn more
                                </div>
                            </CTAButtom>

                        </div>

                    </div>

                    <TimelineSection />
                    <LearningLanguageSection />

                </div>



            </div>


            {/* {section 3} */}
            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

                <InstructorSection />

                {/* Review Slider here */}
            </div>
            
            <div className=' mb-16 mt-3'>
                <h2 className='text-center text-2xl md:text-4xl font-semibold mt-8 text-richblack-5 mb-5'>Reviews from other learners</h2>
                <RatingSlider />
            </div>

            <Footer />

        </div>
    )
}

export default Home
