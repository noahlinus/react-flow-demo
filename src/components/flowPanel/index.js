import React, {Component} from 'react'
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

/** 专用函数防抖 */
export function throttle(fun, delay, enable) {
  let last
  let deferTimer
  return e => {
    e.preventDefault()
    if (!enable) {
      return
    }
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

const getDefaultMatrix = () => ({
  x: 0,
  y: 0,
  l: 0,
  t: 0,
  w: 0,
  h: 0,
  nodeId: undefined,
})

const getDefaultBranchMatrix = () => ({
  x: 0,
  y: 0,
  l: 0,
  t: 0,
  w: 0,
  h: 0,
  branchName: undefined,
  nodeId: undefined,
})

class FlowPanel extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    matrix: getDefaultMatrix(), // 点击node时候的位置
    branchMatrix: getDefaultBranchMatrix(), // 点击分支时候的位置
    nodes: [], // 节点集
    edges: [], // 连线集
    nodeSelectId: undefined, // 选中线段ID
    lineSelectId: undefined, // 选中节点ID
  }

  flowPanelRf = React.createRef()

  componentDidMount() {
    const {data} = this.props
    this.init(data)
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentDidUpdate(prevProps) {
    const {data} = this.props
    if (prevProps.data !== data) {
      this.init(data)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  /** 初始化 */
  init(data) {
    const {nodes, edges} = data
    this.setState({
      nodes,
      edges,
    })
  }

  /** 触发节点移动计算 */
  computeNodeMove(nx, ny) {
    const {nodes, edges, matrix} = this.state
    let nl = nx - (matrix.x - matrix.l)
    let nt = ny - (matrix.y - matrix.t)

    if (nl < 0) {
      nl = 0
    }

    if (nt < 0) {
      nt = 0
    }

    const flowPanelDom = this.flowPanelRf.current

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

    this.setState({
      nodes: nodesTemp,
      edges: edgesTemp,
    })
  }

  // 触发连线时候变化
  computeEdgesMove(nx, ny) {
    const {edges, branchMatrix} = this.state

    const nl = nx - (branchMatrix.x - branchMatrix.l)
    const nt = ny - (branchMatrix.y - branchMatrix.t)
    const edgesTemp = edges.map(item => {
      if (
        item.nodeId === branchMatrix.nodeId &&
        item.branchName === branchMatrix.branchName
      ) {
        return {
          ...item,
          toLocation: {x: nl + branchMatrix.ox, y: nt + branchMatrix.oy - 12},
        }
      }
      return item
    })
    this.setState({edges: edgesTemp})
  }

  /** 监听键盘按下事件 */
  onKeyDown = e => {
    const {nodes, edges, nodeSelectId, lineSelectId} = this.state
    if (e.keyCode === 8 && (nodeSelectId || lineSelectId)) {
      const nodesTemp = nodes.filter(item => item.nodeId !== nodeSelectId)
      const edgesTemp = edges.filter(
        item =>
          item.id !== lineSelectId &&
          item.nodeId !== nodeSelectId &&
          item.toNodeId !== nodeSelectId,
      )
      this.setState({
        nodes: nodesTemp,
        edges: edgesTemp,
      })
    }
  }

  /** 鼠标移动监听 */
  onMouseMove = e => {
    e.preventDefault()

    const {matrix, branchMatrix} = this.state

    if (!matrix.nodeId && !branchMatrix.branchName) {
      return
    }
    const nx = e.clientX
    const ny = e.clientY
    if (matrix.nodeId) {
      this.computeNodeMove(nx, ny)
    } else if (branchMatrix.branchName) {
      this.computeEdgesMove(nx, ny)
    }
  }

  /** 鼠标松开监听 */
  onMouseUp = e => {
    const {edges} = this.state
    e.preventDefault()
    this.setState({
      matrix: getDefaultMatrix(),
      branchMatrix: getDefaultBranchMatrix(),
      edges: edges.filter(item => !!item.toNodeId), // 清除没有连接成功的线段
    })
  }

  /** 监听节点被点击 */
  onNodeMouseDown = matrix => {
    this.setState({matrix})
  }

  /** 监听分支被点击 */
  onBranchMouseDown = branchMatrix => {
    const {edges} = this.state
    const branch = edges.find(
      item =>
        item.nodeId === branchMatrix.nodeId &&
        item.branchName === branchMatrix.branchName,
    )
    // 如果节点不存在连线，创建分支
    if (!branch) {
      const newEdge = buildLine({
        nodeId: branchMatrix.nodeId,
        branchName: branchMatrix.branchName,
        fromLocation: {
          x: branchMatrix.l + branchMatrix.w / 2,
          y: branchMatrix.t + branchMatrix.h,
        },
        toLocation: {
          x: branchMatrix.l + branchMatrix.ox,
          y: branchMatrix.t + branchMatrix.oy - 12,
        },
      })
      this.setState({
        branchMatrix,
        edges: [...edges, newEdge],
      })
    }
  }

  /** 分支连线时候如果触碰到其他节点时候监听 */
  onTouchNodeMouseUp = (nodeValue, e) => {
    const {edges, branchMatrix} = this.state
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
    this.setState({
      edges: edgesTemp,
      branchMatrix: getDefaultBranchMatrix(),
    })
  }

  /** 拖拽操作 */
  onDrop = e => {
    const nodeData = JSON.parse(e.dataTransfer.getData('nodeData'))
    const {
      offsetWidth,
      offsetHeight,
      offsetTop,
      offsetLeft,
    } = this.flowPanelRf.current
    let x = e.clientX - offsetLeft - 100
    let y = e.clientY - offsetTop - 30

    if (x < 0) {
      x = 0
    }
    if (y < 0) {
      y = 0
    }

    if (x > offsetWidth - 200) {
      x = offsetWidth - 200
    }

    if (y > offsetHeight - 86) {
      y = offsetHeight - 86
    }

    nodeData.location = {x, y}

    const {nodes} = this.state

    this.setState({nodes: [...nodes, nodeData]})
  }

  /** 节点点击事件 */
  onNodeClick = nodeSelectId => {
    this.setState({
      lineSelectId: undefined,
      nodeSelectId,
    })
  }

  onFlowLineClick = lineSelectId => {
    this.setState({
      nodeSelectId: undefined,
      lineSelectId,
    })
  }

  onFlowPanelClick = () => {
    const {nodeSelectId, lineSelectId} = this.state
    if (nodeSelectId || lineSelectId) {
      this.setState({
        nodeSelectId: undefined,
        lineSelectId: undefined,
      })
    }
  }

  onNodeDoubleClick = nodeId => {
    message.success(`双击了：${nodeId}`)
  }

  render() {
    const {nodes, edges, matrix, nodeSelectId, lineSelectId} = this.state
    return (
      <>
        <FlowTool onSave={() => this.onSave({nodes, edges})} />
        <div
          className="flow-panel"
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseUp}
          onDragOver={onAllowDrop}
          onDrop={this.onDrop}
          onClick={this.onFlowPanelClick}
          ref={this.flowPanelRf}
        >
          {nodes.map(item => (
            <FlowNode
              key={item.nodeId}
              moved={item.nodeId === matrix.nodeId}
              data={item}
              onNodeMouseDown={this.onNodeMouseDown}
              onBranchMouseDown={this.onBranchMouseDown}
              onTouchNodeMouseUp={this.onTouchNodeMouseUp}
              onNodeClick={this.onNodeClick}
              onNodeDoubleClick={this.onNodeDoubleClick}
              selected={item.nodeId === nodeSelectId}
            />
          ))}
          <svg className="topology-graph">
            {edges.map(item => (
              <FlowLine
                key={item.id}
                data={item}
                onFlowLineClick={this.onFlowLineClick}
                selected={lineSelectId === item.id}
              />
            ))}
          </svg>
        </div>
      </>
    )
  }
}

export default FlowPanel
