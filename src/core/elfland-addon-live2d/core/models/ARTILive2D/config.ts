import type { ModelConfig } from '@/core/elfland-addon-live2d/types'
import type { JSONObject, ModelSettings } from 'pixi-live2d-display'

export const config: ModelConfig = {
  name: 'atri',
  parameterGroups: [
    {
      groupId: '主题',
      parameterDatas: [
        {
          id: 'light',
          parameterId: 'NULL',
          value: 30,
          blend: 'Add'
        },
        {
          id: 'dark',
          parameterId: 'Param10',
          value: 30,
          blend: 'Add'
        }
      ]
    },
    {
      groupId: '着装',
      parameterDatas: [
        {
          id: '常服',
          parameterId: 'NULL',
          value: 0,
          blend: 'Add'
        },
        {
          id: '睡衣',
          parameterId: 'Param18',
          value: 30,
          blend: 'Add'
        },
        {
          id: 'bikini',
          parameterId: 'Param17',
          value: 30,
          blend: 'Add'
        },
        {
          id: '血衣',
          parameterId: 'Param36',
          value: 30,
          blend: 'Add'
        }
      ]
    },
    {
      groupId: '脸部表情',
      parameterDatas: [
        {
          id: '无表情',
          parameterId: 'NULL',
          value: 0,
          blend: 'Add'
        },
        {
          id: '脸红',
          parameterId: 'ParamCheek',
          value: 30,
          blend: 'Add'
        },
        {
          id: '高光消失',
          parameterId: 'Param21',
          value: 30,
          blend: 'Add'
        },
        {
          id: '白眼',
          parameterId: 'Param22',
          value: 30,
          blend: 'Add'
        },
        {
          id: 'No',
          parameterId: 'Param39',
          value: -30,
          blend: 'Add'
        },
        {
          id: 'Yes',
          parameterId: 'Param39',
          value: 30,
          blend: 'Add'
        }
      ]
    },
    {
      groupId: '待机',
      parameterDatas: [
        {
          id: '小鸟',
          parameterId: 'Param37',
          value: 30,
          blend: 'Add'
        },
        {
          id: '螃蟹',
          parameterId: 'Param38',
          value: 30,
          blend: 'Add'
        }
      ]
    }
  ],
  expressionDatas: [
    {
      id: 'light',
      parameterDatas: {
        '主题': 'light'
      }
    },
    {
      id: 'dark',
      parameterDatas: {
        '主题': 'dark'
      }
    },
    {
      id: '无表情',
      parameterDatas: {
        '脸部表情': '无表情'
      }
    },
    {
      id: '害羞',
      parameterDatas: {
        '脸部表情': '脸红'
      }
    },
    {
      id: '生气',
      parameterDatas: {
        '脸部表情': '高光消失'
      }
    },
    {
      id: '变傻',
      parameterDatas: {
        '脸部表情': '白眼'
      }
    },
    {
      id: '杀',
      parameterDatas: {
        '着装': '血衣',
        '脸部表情': '高光消失'
      }
    },
    {
      id: '好',
      parameterDatas: {
        '脸部表情': 'Yes'
      }
    },
    {
      id: '坏',
      parameterDatas: {
        '脸部表情': 'No'
      }
    }
  ]
}

export const live2DFrom: string | JSONObject | ModelSettings = {
  url: '/static/live2D/atri/',
  'Version': 3,
  'FileReferences': {
    'Moc': 'atri_8.moc3',
    'Textures': [
      'texture_00.png',
      'texture_01.png'
    ],
    'Physics': 'atri_8.physics3.json',
    'DisplayInfo': 'atri_8.cdi3.json',
    'Expressions': [
      {
        Name: 'test',
        File: 'expressions/expressionsdark-blood-birds.exp3.json'
      }
    ],
    'Motions': {}
  },
  'Groups': [
    {
      'Target': 'Parameter',
      'Name': 'EyeBlink',
      'Ids': [
        'ParamEyeLOpen',
        'ParamEyeROpen'
      ]
    },
    {
      'Target': 'Parameter',
      'Name': 'LipSync',
      'Ids': [
        'ParamMouthForm',
        'ParamMouthOpenY'
      ]
    }
  ],
  'HitAreas': [
    {
      'Id': 'HitArea',
      'Name': 'Body'
    },
    {
      'Id': 'HitArea2',
      'Name': 'Head'
    },
    {
      'Id': 'HitArea3',
      'Name': 'Face'
    }
  ]
}
