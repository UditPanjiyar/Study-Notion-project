import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HilightText from './HilightText';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {

    const [currentTab , setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses)
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCards = (value)=>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((course)=>course.tag === value);
        setCourses(result[0].courses) 
        setCurrentCard(result[0].courses[0].heading);
        // console.log(value)
    }

  return (
    <div>

        <div className='text-3xl lg:text-4xl font-semibold text-center'>
            Unlock the 
            <HilightText text={"power of code"}/>
        </div>

        <p className='text-center text-richblack-300 text-[20px]  mt-3'>
            Learn to build anything you can imagine
        </p>
        
        <div className='flex flex-row rounded-full bg-richblack-800 mb-5 mt-5 border-richblack-100 px-1 py-1'>
            {
                tabsName.map((element,index)=>{
                    return(
                        <div
                            className={`text-[13px] lg:text-[16px] flex flex-row items-center gap-2
                                        ${currentTab === element 
                                            ? "bg-richblack-900 text-richblack-5 font-medium" 
                                            : "text-richblack-200"
                                        }
                                         rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 
                                        hover:text-richblack-5 px-3 py-1 lg:px-7 lg:py-2`
                                    } 
                                    key={index}
                                    onClick={()=>setMyCards(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>

        {/* <div className='lg:h-[150px]'> */}

            {/* course card kaa group  */}

        <div className='lg:h-[150px]'>
        {/* absolute flex flex-row gap-10 justify-between w-full */}
            <div className='flex gap-9 w-full justify-between mt-5  lg:absolute right-0   '>
                {
                    courses.map((element, index)=>{
                        return (
                            <div>
                                <CourseCard 
                                            key={index}
                                            cardData={element} // course array
                                            currentCard={currentCard} // heading
                                            setCurrentCard = {setCurrentCard}
                                />
                            </div>
                        )
                    })
                }
            </div>

        </div>


    </div>
  )
}

export default ExploreMore
