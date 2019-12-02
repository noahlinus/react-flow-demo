import React, {useState, useEffect, useCallback, useRef} from 'react'
import uuid from 'uuid/v1'
import {message} from 'antd'
import FlowNode from './components/flowNode/index'
import FlowLine from './components/flowLine/index'
import FlowTool from './components/flowTool/index'
import './index.less'

function onAllowDrop(ev) {
  ev.preventDefault()
}

const buildLine = ({
  nodeId,
  branchName,
  fromLocation,
  toLocation,
  toNodeId,
}) => ({
  id: uuid(),
  nodeId,
  branchName,
  toNodeId,
  fromLocation,
  toLocation,
})

export function throttle(fun, delay) {
  let last
  let deferTimer
  return e => {
    e.preventDefault()
    // 获取x和y
    const nx = e.clientX
    const ny = e.clientY
    const now = Date.now()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fun(nx, ny)
      }, delay)
    } else {
      last = now
      fun(nx, ny)
    }
  }
}

function FlowPanel({data, onSave}) {
  const flowPanelRf = useRef()

  // 节点选中的位置
  const [matrix, setMatrix] = useState({
    x: 0,
    y: 0,
    l: 0,
    t: 0,
    w: 0,
    h: 0,
    nodeId: undefined,
  })

  // 分支选中的位置
  const [branchMatrix, setBranchMatrix] = useState({
    x: 0,
    y: 0,
    l: 0,
    t: 0,
    w: 0,
    h: 0,
    branchName: undefined,
    nodeId: undefined,
  })

  const [nodes, setNodes] = useState([])

  const [edges, setEdges] = useState([])

  const [nodeSelectId, setNodeSelectId] = useState()

  const [lineSelectId, setLineSelectId] = useState()

  useEffect(() => {
    setNodes(data.nodes)
    setEdges(data.edges)
  }, [data])

  useEffect(() => {
    const onKeyDown = e => {
      if (e.keyCode === 8 && (nodeSelectId || lineSelectId)) {
        const nodesTemp = nodes.filter(item => item.nodeId !== nodeSelectId)
        const edgesTemp = edges.filter(
          item =>
            item.id !== lineSelectId &&
            item.nodeId !== nodeSelectId &&
            item.toNodeId !== nodeSelectId,
        )
        setNodes(nodesTemp)
        setEdges(edgesTemp)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [nodes, edges, nodeSelectId, lineSelectId])

  const onMouseMove = useCallback(
    // 40毫秒的节流
    throttle((nx, ny) => {
      // 节点变化计算
      if (matrix.nodeId) {
        // 计算移动后的左偏移量和顶部的偏移量
        let nl = nx - (matrix.x - matrix.l)
        let nt = ny - (matrix.y - matrix.t)

        if (nl < 0) {
          nl = 0
        }

        if (nt < 0) {
          nt = 0
        }

        const flowPanelDom = flowPanelRf.current

        if (nl > flowPanelDom.offsetWidth - matrix.w) {
          nl = flowPanelDom.offsetWidth - matrix.w
        }

        if (nt > flowPanelDom.offsetHeight - matrix.h) {
          nt = flowPanelDom.offsetHeight - matrix.h
        }

        const branchMap = {}

        const nodesTemp = nodes.map(item => {
          if (item.nodeId === matrix.nodeId) {
            item.branchList.forEach(branchName => {
              const branchDom = document.getElementById(
                `${item.nodeId}-${branchName}`,
              )
              if (branchDom) {
                branchMap[branchName] = {
                  x: nl + branchDom.offsetLeft + branchDom.offsetWidth / 2,
                  y: nt + branchDom.offsetTop + branchDom.offsetHeight,
                }
              }
            })
            return {...item, location: {x: nl, y: nt}}
          } else {
            return item
          }
        })
        const edgesTemp = edges.map(item => {
          if (matrix.nodeId === item.nodeId && branchMap[item.branchName]) {
            return {
              ...item,
              fromLocation: {
                x: branchMap[item.branchName].x,
                y: branchMap[item.branchName].y,
              },
            }
          } else if (matrix.nodeId === item.toNodeId) {
            return {...item, toLocation: {x: nl + matrix.w / 2, y: nt - 10}}
          } else {
            return item
          }
        })

        setNodes(nodesTemp)

        setEdges(edgesTemp)
        return
      }

      // 分支线变化计算
      if (branchMatrix.branchName) {
        const nl = nx - (branchMatrix.x - branchMatrix.l)
        const nt = ny - (branchMatrix.y - branchMatrix.t)
        const newEdge = buildLine({
          nodeId: branchMatrix.nodeId,
          branchName: branchMatrix.branchName,
          fromLocation: {
            x: branchMatrix.l + branchMatrix.w / 2,
            y: branchMatrix.t + branchMatrix.h,
          },
          toLocation: {x: nl + branchMatrix.ox, y: nt + branchMatrix.oy - 12},
        })
        const edgesTemp = [...edges, newEdge]
        setEdges(edgesTemp)
      }
    }, 30),
    [matrix.nodeId, branchMatrix.branchName],
  )

  // 鼠标放掉
  const onMouseUp = e => {
    e.preventDefault()
    // 开关关闭
    setMatrix({...matrix, nodeId: undefined})
    setBranchMatrix({
      ...branchMatrix,
      nodeId: undefined,
      branchName: undefined,
    })
    const edgesTemp = edges.filter(item => !!item.toNodeId)
    setEdges(edgesTemp)
  }

  // 新增拖拽节点
  const onDrop = e => {
    const nodeData = JSON.parse(e.dataTransfer.getData('nodeData'))
    let x = e.clientX - flowPanelRf.current.offsetLeft - 100
    let y = e.clientY - flowPanelRf.current.offsetTop - 30

    if (x < 0) {
      x = 0
    }
    if (y < 0) {
      y = 0
    }

    if (x > flowPanelRf.current.offsetWidth - 200) {
      x = flowPanelRf.current.offsetWidth - 200
    }

    if (y > flowPanelRf.current.offsetHeight - 86) {
      y = flowPanelRf.current.offsetHeight - 86
    }

    nodeData.location = {x, y}
    const nodesTemp = [...nodes, nodeData]
    setNodes(nodesTemp)
  }

  const onNodeMouseDown = nodeMatrix => setMatrix(nodeMatrix)

  const onBranchMouseDown = branchValue => {
    const branch = edges.find(
      item =>
        item.nodeId === branchValue.nodeId &&
        item.branchName === branchValue.branchName,
    )
    if (!branch) {
      setBranchMatrix(branchValue)
    }
  }

  const onTouchNodeMouseUp = (nodeValue, e) => {
    if (!branchMatrix.branchName || nodeValue.nodeId === branchMatrix.nodeId) {
      return
    }
    e.stopPropagation()
    const edgesTemp = edges.map(item => {
      if (
        item.branchName === branchMatrix.branchName &&
        item.nodeId === branchMatrix.nodeId
      ) {
        return {
          ...item,
          toNodeId: nodeValue.nodeId,
          toLocation: {x: nodeValue.l + nodeValue.w / 2, y: nodeValue.t - 10},
        }
      }
      return item
    })
    setEdges(edgesTemp)
    setBranchMatrix({
      ...branchMatrix,
      nodeId: undefined,
      branchName: undefined,
    })
  }

  const onNodeClick = nodeClickId => {
    setLineSelectId(undefined)
    setNodeSelectId(nodeClickId)
  }

  const onFlowLineClick = lineClickId => {
    setNodeSelectId(undefined)
    setLineSelectId(lineClickId)
  }

  const onFlowPanelClick = () => {
    if (nodeSelectId || lineSelectId) {
      setNodeSelectId(undefined)
      setLineSelectId(undefined)
    }
  }

  const onNodeDoubleClick = nodeId => {
    message.success(`双击了：${nodeId}`)
  }

  return (
    <>
      <FlowTool onSave={() => onSave({nodes, edges})} />
      <div
        className="flow-panel"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDragOver={onAllowDrop}
        onDrop={onDrop}
        onClick={onFlowPanelClick}
        ref={flowPanelRf}
      >
        {nodes.map(item => (
          <FlowNode
            key={item.nodeId}
            moved={item.nodeId === matrix.nodeId}
            data={item}
            onNodeMouseDown={onNodeMouseDown}
            onBranchMouseDown={onBranchMouseDown}
            onTouchNodeMouseUp={onTouchNodeMouseUp}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            selected={item.nodeId === nodeSelectId}
          />
        ))}
        <svg className="topology-graph">
          {edges.map(item => (
            <FlowLine
              key={item.id}
              data={item}
              onFlowLineClick={onFlowLineClick}
              selected={lineSelectId === item.id}
            />
          ))}
        </svg>
      </div>
    </>
  )
}

export default FlowPanel
