/**
 * 函数节流
 * @param {*} fun 执行函数
 * @param {*} delay 节流时间
 */
export function throttle(fun, delay) {
  let last
  let deferTimer
  return (...args) => {
    const now = Date.now()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fun(...args)
      }, delay)
    } else {
      last = now
      fun(...args)
    }
  }
}
