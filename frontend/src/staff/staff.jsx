import React from 'react'
import Footer from '../components/footer'
import UserNavbar from '../components/userNavbar'
import StaffSidebar from './staffSidebar'
function Staff() {
  return (<div>
    <UserNavbar/>
    <StaffSidebar/>
    <Footer></Footer>
  </div>
  )
}

export default Staff