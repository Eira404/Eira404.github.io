import { UseI18nFor, type MessageDictHTML } from '@/core/elfland-addon-message-manager/types'

type MSG = {
  html: MessageDictHTML
}

const res: MSG = {
  html: {
    mouseenter: [
      ['img', '', 'alt', UseI18nFor.B, (value: null | string | string[]) => {
        if (value === '艾拉') return '我和艾拉哪个更高性能呢？'
        else return false
      }]
    ]
  }
}

export default res
