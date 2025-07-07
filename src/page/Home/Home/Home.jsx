import React from 'react'
import Banner from '../banner/Banner'
import Services from '../service/service'
import ClientLogos from '../clientLogos/ClientLogos'

const Home = () => {
  return (
    <div>
        <Banner></Banner>
        <Services></Services>
        <ClientLogos></ClientLogos>
    </div>
  )
}

export default Home