export default {
  group: [
    {
      id: '390aa39e748c40b4a63bea08b3e4ca21_NORMAL_NODE_node_3DFQBDK7KXH',
      index: 0,
      flowId: '390aa39e748c40b4a63bea08b3e4ca21',
      nodeName: '1-1开场白',
      root: true,
      position: {x: 514, y: 16},
      robotTextList: [
        '喂，您好，（停顿2S），您好这里是绍兴福通客户回访中心，本次来电，主要是想跟您确认一下：您的爱车已经买好了吗？',
        '嗯，您好，这里是绍兴福通客户回访中心，请问您的爱车已经买好了吗？',
      ],
      branches: ['不需要', '特殊', '买好了', '没买', '默认'],
      nodeType: 'NORMAL_NODE',
      action: {
        actionType: 'NEXT_MAIN_FLOW',
        mainFlowId: '',
      },
      acceptBreak: false,
      nodeRepeatCount: 1,
    },
  ],
  edges: [
    {
      id: 'NORMAL_NODE_branch_FMK0B1XT2ZU',
      index: 0,
      text: '肯定',
      source: '390aa39e748c40b4a63bea08b3e4ca21_NORMAL_NODE_node_3DFQBDK7KXH',
      target: 'NORMAL_NODE_node_GKSYGAF0K4',
      sourcePosition: {x: 638, y: 405},
      targetPosition: {x: 110, y: 120},
    },
  ],
}
