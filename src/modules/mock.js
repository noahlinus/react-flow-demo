// 模拟数据
const mockData = {
  nodes: [
    {
      type: 'normal',
      nodeId: '0',
      parentId: '0',
      nodeName: '来抓我啊~0',
      nodeContent:
        '嗯，您好，这里是绍兴福通客户回访中心，请问您的爱车已经买好了吗',
      branchList: ['默认', '肯定', '否定', '拒绝', '哈哈哈哈哈'],
      location: {x: 655, y: 100},
      action: '',
    },
    {
      type: 'normal',
      nodeId: '1',
      parentId: '0',
      nodeName: '来抓我啊~1',
      nodeContent:
        '是这样的，双十二当天，会有一场别克厂家举办的大型团购活动，到时会有最新最全的别克车型展出，现场购买还会有优惠。不知道您那天是否有时间来参加活动呢？',
      branchList: [
        '默认',
        '肯定',
        '否定',
        '拒绝',
        '哈哈哈哈哈',
        '我不听',
        '拉拉啦啦',
      ],
      location: {x: 42, y: 300},
      action: '',
    },
    {
      type: 'normal',
      nodeId: '2',
      parentId: '0',
      nodeName: '来抓我啊~2',
      nodeContent:
        '好的，那具体事宜让我们销售人员给您联系，您可以带上驾照到店试乘试驾体验一下，请您注意查收短信和接听电话，祝您生活愉快，再见！',
      branchList: ['默认', '肯定', '否定', '拒绝'],
      location: {x: 439, y: 435},
      action: '',
    },
    {
      type: 'normal',
      nodeId: '3',
      parentId: '0',
      nodeName: '来抓我啊~3',
      nodeContent:
        '好的，您后期有买车的需求可以随时联系我，祝您生活愉快，再见！',
      branchList: ['默认', '肯定', '否定', '拒绝', '哈哈哈哈哈'],
      location: {x: 635, y: 390},
      action: '',
    },
    {
      type: 'normal',
      nodeId: '4',
      parentId: '0',
      nodeName: '来抓我啊~4',
      nodeContent: '哼！',
      branchList: [
        '默认',
        '肯定',
        '否定',
        '拒绝',
        '哈哈哈哈哈',
        '哟哟哟哟哟哟',
      ],
      location: {x: 969, y: 449},
      action: '',
    },
    {
      type: 'normal',
      nodeId: '5',
      parentId: '0',
      nodeName: '来抓我啊~5',
      nodeContent:
        '那恭喜您，如果以后您家人或者朋友想要购别克车也可以联系我们，这边就祝您用车愉快，打扰您了，再见！',
      branchList: ['默认', '肯定', '否定', '拒绝', '哈哈哈哈哈'],
      location: {x: 1256, y: 299},
      action: '',
    },
  ],
  edges: [
    {
      id: 1,
      nodeId: '0',
      branchName: '默认',
      toNodeId: '1',
      fromLocation: {x: 682, y: 210},
      toLocation: {x: 238, y: 290},
    },
    {
      id: 2,
      nodeId: '0',
      branchName: '肯定',
      toNodeId: '2',
      fromLocation: {x: 726, y: 210},
      toLocation: {x: 539, y: 425},
    },
    {
      id: 3,
      nodeId: '0',
      branchName: '否定',
      toNodeId: '3',
      fromLocation: {x: 770, y: 210},
      toLocation: {x: 769, y: 380},
    },
    {
      id: 4,
      nodeId: '0',
      branchName: '拒绝',
      toNodeId: '4',
      fromLocation: {x: 814, y: 210},
      toLocation: {x: 1149, y: 439},
    },
    {
      id: 5,
      nodeId: '0',
      branchName: '哈哈哈哈哈',
      toNodeId: '5',
      fromLocation: {x: 876, y: 210},
      toLocation: {x: 1390, y: 289},
    },
  ],
}

export default mockData
