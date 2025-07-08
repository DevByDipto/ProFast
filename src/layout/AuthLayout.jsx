import React from 'react'
import { Outlet } from 'react-router'
import authImage from '../assets/authImage.png'
import ProFirstLogo from '../page/shared/proFirstLogo/ProFirstLogo'
const AuthLayout = () => {
  return (
   <div className="p-6 bg-base-200 ">
    <div>
        <ProFirstLogo></ProFirstLogo>
    </div>
  <div className=" hero-content flex-col lg:flex-row-reverse">
    <div className='flex-1'>
 <img
      src={authImage}
      className="max-w-sm "
    />
    </div>
   
    <div className='flex-1'>
     <Outlet></Outlet>
    </div>
  </div>
</div>
  )
}

export default AuthLayout