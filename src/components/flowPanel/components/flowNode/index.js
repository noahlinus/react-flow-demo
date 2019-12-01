import React, {useState, useRef} from 'react'
import NodeBranch from './NodeBranch'

function FlowNode({
  data,
  onNodeMouseDown,
  onBranchMouseDown,
  onTouchNodeMouseUp,
  selected,
  onNodeClick,
  onNodeDoubleClick,
  moved,
}) {
  const flowNodeRef = useRef()

  const [width, setWidth] = useState(200)

  const {
    type,
    nodeId,
    nodeName,
    nodeContent,
    branchList,
    location,
    action,
  } = data

  const {x, y} = location

  const onMouseDown = e => {
    e.preventDefault()
    onNodeMouseDown({
      nodeId,
      x: e.clientX,
      y: e.clientY,
      w: flowNodeRef.current.offsetWidth,
      h: flowNodeRef.current.offsetHeight,
      l: x,
      t: y,
    })
  }

  const onBranchDown = (e, branchName) => {
    e.stopPropagation()
    e.preventDefault()

    const branchDom = document.getElementById(`${nodeId}-${branchName}`)

    onBranchMouseDown({
      x: e.clientX,
      y: e.clientY,
      l: x + e.target.offsetLeft,
      t: y + e.target.offsetTop,
      w: branchDom.offsetWidth,
      h: branchDom.offsetHeight,
      ox: e.nativeEvent.offsetX,
      oy: e.nativeEvent.offsetY,
      nodeId,
      branchName,
    })
  }

  const onWidth = offsetWidth => {
    setWidth(offsetWidth)
  }

  const onTouchUp = e => {
    e.preventDefault()
    onTouchNodeMouseUp(
      {
        nodeId,
        x: e.clientX,
        y: e.clientY,
        w: flowNodeRef.current.offsetWidth,
        h: flowNodeRef.current.offsetHeight,
        l: x,
        t: y,
      },
      e,
    )
  }

  const onOneNodeClick = e => {
    e.stopPropagation()
    onNodeClick(nodeId)
  }

  return (
    <div
      ref={flowNodeRef}
      className={`node-panel ${selected ? 'node-panel-click' : ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onTouchUp}
      onClick={onOneNodeClick}
      onDoubleClick={() => onNodeDoubleClick(nodeId)}
      style={{
        left: x,
        top: y,
        cursor: moved ? 'move' : 'pointer',
        width,
      }}
    >
      <div>{nodeName}</div>
      <div className="node-content">{nodeContent}</div>
      {type === 'jump' && (
        <div className="node-action">{`下一步：${action}`}</div>
      )}
      {type === 'normal' && (
        <NodeBranch
          nodeId={nodeId}
          branchList={branchList}
          onWidth={onWidth}
          onBranchMouseDown={onBranchDown}
        />
      )}
    </div>
  )
}

export default FlowNode
