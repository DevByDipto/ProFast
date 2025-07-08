import React from 'react'
import Banner from '../banner/Banner'
import Services from '../service/service'
import ClientLogos from '../clientLogos/ClientLogos'
import Features from '../features/Features'

const Home = () => {
  return (
    <div>
        <Banner></Banner>
        <Services></Services>
        <ClientLogos></ClientLogos>
        <Features></Features>
    </div>
  )
}

export default Home