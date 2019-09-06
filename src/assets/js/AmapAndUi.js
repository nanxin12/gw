export default function MP () {
  const p1 = new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://webapi.amap.com/maps?v=1.4.13&key=f41b6443e7af1e0d81bc0a8d4e75f173&callback=inits'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.inits = () => {
      resolve(window.AMap)
    }
  })
  const p2 = new Promise((resolve, reject) => {
    if (window.initAMapUI) {
      resolve('success')
    } else {
      let script2 = document.createElement('script')
      script2.type = 'text/javascript'
      script2.src = 'https://webapi.amap.com/ui/1.0/main-async.js'
      script2.onerror = reject
      script2.onload = () => {
        resolve('success')
      }
      document.head.appendChild(script2)
    }
  })
  return Promise.all([p1, p2])
    .then((result) => {
      return result
    }).catch(e => '')
}
