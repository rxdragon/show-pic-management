import Vue from 'vue'

Vue.directive('discountOnly', {
  inserted: (el, bind) => {
    el.addEventListener('keyup', () => {
      const reg = /^d+\.?\d{0,1}$/g
      const reg2 = /\d+\.?\d{0,1}/g
      const val = event.target.value
      const has = !reg.test(val)
      if (has) {
        const regArr = reg2.exec(val)
        const trueText = regArr ? regArr[0] : ''
        event.target.value = trueText
        getMinMaxNumer(event.target)
        el.__vue__.isComposing = false
        event.target.dispatchEvent(new Event('input'))
      }
    })
  }
})

function getMinMaxNumer (dom) {
  const min = Number(dom.min)
  const max = Number(dom.max)
  if (!dom.value) return false
  if (min && dom.value < min) {
    dom.value = min
    return true
  }
  if (max && dom.value > max) {
    dom.value = max
    return true
  }
}
