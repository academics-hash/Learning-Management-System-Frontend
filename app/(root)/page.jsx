import React from 'react'
import Achievement from './compoents/Achievement'
import Hero from './compoents/Hero'
import Content from './compoents/Content'
import CourseSelection from './compoents/CourseSelection'
const page = () => {
  return (
    <div>
      <Hero />
      <CourseSelection />
      <Content />
      <Achievement />

    </div>
  )
}

export default page