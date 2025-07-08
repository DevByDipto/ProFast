import React from 'react'
import logo from '../../../assets/logo.png'
import { NavLink } from 'react-router'
const ProFirstLogo = () => {
  return (
   <NavLink to='/'>
     <div className='flex items-end'>
        <img className='mb-2' src={logo} alt="" />
        <p className='text-3xl -ml-4'> ProFirst</p>
    </div>
   </NavLink>
  )
}

export default ProFirstLogo