import React from 'react'
import FlowPanel from '@/components/flowPanel/index'

import mockData from './mock'

import mock3 from './mock3'

function Flow() {
  const onSave = value => {
    console.log(value)
  }

  console.log(mock3)

  return (
    <div style={{width: 2000, height: 1000, padding: '50px 50px'}}>
      <FlowPanel data={mockData} onSave={onSave} />
    </div>
  )
}

export default Flow
