import React from 'react'
import Achievement from './compoents/Achievement'
import Hero from './compoents/Hero'
import Content from './compoents/Content'
import CourseSection from './compoents/CourseSection'
const page = () => {
  return (
    <div>
      <Hero />
      <CourseSection />
      <Content />
      <Achievement />
      
    </div>
  )
}

export default page