class WaterPipe {
  constructor ({ left, top, fater, height, borderLeft = 'none', borderTop = 'none', borderBottom = 'none', borderRight = 'none', width, direction, className }) {
    this.left = left
    this.top = top
    this.fater = fater
    this.height = height
    this.borderLeft = borderLeft
    this.borderTop = borderTop
    this.borderBottom = borderBottom
    this.borderRight = borderRight
    this.width = width
    this.direction = direction
    this.pipeDom = null
    this.direction = direction
    this.sonList = []
  }
  init () {
    this.pipeDom = document.createElement('div')
    this.pipeDom.style.position = 'relative'
    this.pipeDom.style.width = this.width
    this.pipeDom.style.height = this.height
    this.pipeDom.style.position = 'absolute'
    this.pipeDom.style.left = this.left
    this.pipeDom.style.top = this.top
    this.pipeDom.style.borderLeft = this.borderLeft
    this.pipeDom.style.borderRight = this.borderRight
    this.pipeDom.style.borderBottom = this.borderBottom
    this.pipeDom.style.borderTop = this.borderTop
    this.fater.appendChild(this.pipeDom)
  }
  waterGo (animationName) {
    let waterDom = document.createElement('div')
    if (this.direction) {
      waterDom.style.width = '6px'
      waterDom.style.height = '16px'
    } else {
      waterDom.style.width = '16px'
      waterDom.style.height = '6px'
    }
    waterDom.style.position = 'absolute'
    waterDom.style.borderRadius = '4px'
    waterDom.style.background = '#4292ff'
    waterDom.className = animationName
    this.pipeDom.appendChild(waterDom)
    this.sonList.push(waterDom)
  }
  delWater () {
    this.sonList.forEach(item => {
      this.pipeDom.removeChild(item)
      item = null
    })
    this.sonList = []
  }
}

export default WaterPipe
