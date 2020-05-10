/* eslint-disable new-cap */
import { Message } from 'element-ui'

export const newMessage = (params) => {
  const newParams = { ...params }
  Message(newParams)
}

['success', 'warning', 'info', 'error'].forEach(type => {
  newMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return newMessage(options)
  }
})
