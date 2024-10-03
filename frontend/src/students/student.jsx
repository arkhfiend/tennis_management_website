import React from 'react'
import UserNavbar from '../components/userNavbar'
import Footer from '../components/footer'
import StudentSidebar from './studentSidebar'
function Student() {
  return (
    <div>
      <UserNavbar/>
      <StudentSidebar/>
      <Footer />
    </div>
  )
}

export default Student