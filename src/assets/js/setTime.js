/**
 *
 *
 * @export
 * @param {*} date 秒数或毫秒数
 * @param {number} [number=0] date参数是毫秒不用传number，如果是秒则number传入1000
 * @returns string HH:MM:SS
 */
export default function time ({ date = new Date(), number = 1, type = 1 }) {
  let now = new Date(date * number)
  let y = now.getFullYear()
  let m = now.getMonth() + 1
  let d = now.getDate()
  switch (type) {
    case 1:
      return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d} ${now.toTimeString().substr(0, 8)}`
    case 2:
      return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
    case 3:
      return `${y}-${m < 10 ? '0' + m : m}`
    case 4:
      return `${y}年${m < 10 ? '0' + m : m}月${d < 10 ? '0' + d : d}日 ${now.toTimeString().substr(0, 8)}`
  }
}
