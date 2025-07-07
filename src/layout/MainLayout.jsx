import React from 'react'
import { Outlet } from 'react-router'
import Navber from '../page/shared/navbar/Navber'
import Footer from '../page/footer/Footer'
const MainLayout = () => {
  return (
    <div>
      <Navber></Navber>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}

export default MainLayout