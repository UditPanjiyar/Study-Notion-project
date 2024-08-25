import React, { useEffect, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { useDispatch, useSelector } from 'react-redux'
import { TiShoppingCart } from 'react-icons/ti'
import ProfileDropdown from '../core/Auth/ProfileDropDown'
import { categories } from '../../services/apis'
import { apiConnector } from '../../services/apiConnector'


const Navbar = () => {

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [sublinks, setsublinks] = useState([]);
  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      console.log("Result->  ",result);
      if (result?.data?.data?.length > 0) {
        setsublinks(result?.data?.data);
      }
      localStorage.setItem("sublinks", JSON.stringify(result.data.data));

    } catch (error) {
      // setsublinks(JSON.parse(localStorage.getItem("sublinks")));
      // console.log("could not fetch sublinks",localStorage.getItem("sublinks"));
      console.log(error);
    }
  }
  useEffect(() => {
    fetchSublinks();
  }, [])



  const matchRoutes = (routes) => {
    return matchPath({ path: routes }, location.pathname)
  }


  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
      <div className='flex w-9/12 max-w-maxContent items-center justify-between'>

        {/* images */}
        <Link to="/" >
          <img src={logo} alt="" width={160} height={42} loading='lazy' />
        </Link>

        {/* navlinks */}
        <nav>
          <ul className='flex-row gap-x-6 text-richblack-25 gap-5 hidden md:flex'>

            {
              NavbarLinks?.map((link, index) => (

                <li key={index}>

                  {
                    link.title === "Catalog"
                      ? (
                        <div className=' flex items-center group relative cursor-pointer'>
                          <p>{link.title}</p>
                          <svg width="25px" height="20px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.384"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#ffffff"></path> </g></svg>

                          <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]'>
                            <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'></div>
                            {
                              sublinks?.length < 0
                                ? (<div></div>)
                                : (
                                  sublinks?.map((element, index) => (

                                    <Link to={`/catalog/${element?.name}`} key={index} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" >
                                      <p >  {element?.name}  </p>
                                    </Link>

                                  ))
                                )

                            }

                          </div>



                        </div>
                      )
                      : (

                        <Link to={link?.path}  >
                          <p className={`${matchRoutes(link?.path) ? " text-yellow-25" : " text-richblack-25 hidden md:block"}`} >
                            {link?.title}
                          </p>
                        </Link>
                      )
                  }

                </li>

              ))

            }



          </ul>
        </nav>

        {/* login/signup/dashboard */}
        <div className='flex-row gap-5 hidden md:flex items-cente'>
          {
            user && user?.accountType !== "Instructor" && (
              <Link to='/dashboard/cart' className=' relative px-4  '  >
                <div className=' 50 '>
                  <TiShoppingCart className=' fill-richblack-25 w-7 h-7 mt-2 ' />
                </div>

                {
                  totalItems > 0 && (
                    <span className=' shadow-sm shadow-black text-[10px] font-bold bg-yellow-100 text-richblack-900 rounded-full px-1 absolute -top-[2px] right-[8px]'>
                      {totalItems}
                    </span>
                  )
                }

              </Link>
            )
          }
          {
            token == null && (
              <Link to='/login' className='text-richblack-25'>
                <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[7px] text-richblack-100'>
                  Login
                </button>
              </Link>
            )
          }

          {
            token == null && (
              <Link to='/signup' className='text-richblack-25' >
                <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[7px] text-richblack-100' >
                  Signup
                </button>
              </Link>
            )
          }
          {
            token !== null && (
              <div className=' pt-2' >
                <ProfileDropdown />
              </div>
            )
          }

        </div>




      </div>
    </div>
  )
}

export default Navbar
