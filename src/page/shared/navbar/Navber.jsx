import React from 'react'
import { NavLink } from 'react-router'
import ProFirstLogo from '../proFirstLogo/ProFirstLogo'
import useAuth from '../../../hooks/useAuth'
import Logout from '../../authentication/logout/logout'
const Navber = () => {
  const {user} = useAuth()
  const navItems = <>
    <li><NavLink to='/'>Home</NavLink></li>
    <li><NavLink to='/coverage'>Coverage</NavLink></li>
    <li><NavLink to='/sendParcel'>Send a parcel</NavLink></li>
    {
      user && <>
          <li><NavLink to='/dashboard'>Deshboard</NavLink></li>
      </>
    }
    <li><NavLink to='/about'>About Us</NavLink></li>
    <li><NavLink to='/beArider'>Be A Rider</NavLink></li>
  </>


  
  return (
   <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {navItems}
      </ul>
    </div>
    <div className="btn btn-ghost text-xl"><ProFirstLogo></ProFirstLogo></div>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
     {navItems}
    </ul>
  </div>
  <div className="navbar-end">
    <p className='mr-5'>{user?.email}</p>
{
    user ? <Logout></Logout>:<NavLink className='btn btn-primary text-black' to='/login'>login</NavLink>
    }
    
   
  </div>
</div>
  )
}

export default Navber