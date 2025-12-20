import React from 'react'
import Achievement from './compoents/Achievement'
import Hero from './compoents/Hero'
import Content from './compoents/Content'
import CourseSelection from './compoents/CourseSelection'
import Placement from './compoents/Placement'
const page = () => {
  return (
    <div>
      <Hero />
      <CourseSelection />
      <Content />
      <Placement />
      <Achievement />

    </div>
  )
}

export default page