import React from 'react'
import {Button} from 'antd'
import uuid from 'uuid/v1'

const NodeTemplate = {
  normal: () => ({
    type: 'normal',
    nodeId: uuid(),
    parentId: '0',
    nodeName: '普通节点',
    nodeContent: '',
    branchList: ['默认', '肯定', '否定', '拒绝'],
    location: {x: 0, y: 0},
    action: '',
  }),
  jump: () => ({
    type: 'jump',
    nodeId: uuid(),
    parentId: '0',
    nodeName: '跳转节点',
    nodeContent: '',
    branchList: [],
    location: {x: 0, y: 0},
    action: '',
  }),
}

function FlowTool({onSave}) {
  const ondragover = type => e => {
    e.dataTransfer.setData('nodeData', JSON.stringify(NodeTemplate[type]()))
  }

  return (
    <div className="flow-tool">
      <div className="node-template-wrapper">
        <Button draggable="true" onDragStart={ondragover('normal')}>
          普通节点
        </Button>
        <Button draggable="true" onDragStart={ondragover('jump')}>
          跳转节点
        </Button>
      </div>
      <Button onClick={onSave}>保存</Button>
    </div>
  )
}

export default FlowTool
