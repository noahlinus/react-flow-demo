import React from 'react'

function computeAbs(y1, y2) {
  const abs = (Math.abs(y2 - y1) * 9) / 16
  return abs > 25 ? abs : 25
}

function FlowLine({data, onFlowLineClick, selected}) {
  const {id, fromLocation, toLocation} = data
  const {x: x1, y: y1} = fromLocation
  const {x: x2, y: y2} = toLocation

  const onLineClick = e => {
    e.stopPropagation()
    onFlowLineClick(id)
  }

  const abs = computeAbs(y1, y2)

  return (
    <g>
      <path
        className={`topology-path ${selected ? 'selected' : ''}`}
        onClick={onLineClick}
        d={`M ${x1},${y1} C ${x1},${y1 + abs} ${x2},${y2 - abs} ${x2},${y2}`}
      />
      <path
        className="path-arrow"
        onClick={onLineClick}
        d={`M ${x2},${y2} l 5 0 l -5 10 l -5 -10 Z`}
      />
    </g>
  )
}

export default FlowLine
