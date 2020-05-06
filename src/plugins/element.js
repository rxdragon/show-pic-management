import Vue from 'vue'
import Element from 'element-ui'
import { newMessage } from '@/utils/message'

Vue.use(Element)
// 重制顶部量
Vue.prototype.$newMessage = newMessage
