/**
 * h: 后退
 * l: 前进
 * j: 减小音量
 * k: 增加音量
 * z: 重置播放倍速
 * x: 减小播放倍速
 * c: 增加播放倍速
 */
const TOAST_TEXT_COLOR = '#ff5159'
const TOAST_BACKGROUND = 'rgba(0,0,0,0.9)'
const TOAST_TEXT_SIZE = '20px'

// 音量调节步长：0.1 = 10%
const VOLUME_STEP = 0.1
const MIN_VOLUME = 0
const MAX_VOLUME = 1

// 前进/后退的步长：3s
const TIME_STEP = 3

const DEFAULT_RATE = 1
// 播放倍速的调节步长：0.2 = 20%
const RATE_STEP = 0.2
const MIN_RATE = 0.1

let video = null
let toast = null
window.addEventListener('load', () => {
  mapKey()
  toast = new Toast()
})

// 映射按键
function mapKey() {
  // 操作storage的示例代码
  // chrome.storage.sync.get('color', ({ color }) => {
  //   document.body.style.backgroundColor = color
  // })
  document.addEventListener('keydown', event => {
    if (!video && !(video = document.querySelector('video'))) {
      return
    }
    mapVolume(event.key, video)
    mapTime(event.key, video)
    mapSpeed(event.key, video)
  })
}

// 控制播放倍速
// todo:
function mapSpeed(keyName, video) {
  const exceptKeys = ['z', 'x', 'c']
  if (exceptKeys.indexOf(keyName) === -1) {
    return
  }

  let playbackRate = video.playbackRate
  switch (keyName) {
    case 'z':
      video.playbackRate = DEFAULT_RATE
      break
    case 'x':
      playbackRate -= RATE_STEP
      video.playbackRate = Math.max(playbackRate.toFixed(2), MIN_RATE)
      break
    case 'c':
      playbackRate += RATE_STEP
      video.playbackRate = playbackRate.toFixed(2)
      break
  }
  toast.show(`速度：${video.playbackRate.toFixed(2)}x`)
}

// 控制播放进度
function mapTime(keyName, video) {
  const exceptKeys = ['h', 'l']
  if (exceptKeys.indexOf(keyName) === -1) {
    return
  }

  switch (keyName) {
    case 'h':
      video.currentTime -= TIME_STEP
      toast.show(`后退：${TIME_STEP}s`)
      break
    case 'l':
      video.currentTime += TIME_STEP
      toast.show(`前进：${TIME_STEP}s`)
      break
  }
}

// 控制音量
function mapVolume(keyName, video) {
  const exceptKeys = ['j', 'k']
  if (exceptKeys.indexOf(keyName) === -1) {
    return
  }

  let volume = video.volume
  switch (keyName) {
    case 'j':
      volume -= VOLUME_STEP
      video.volume = Math.max(volume, MIN_VOLUME)
      break
    case 'k':
      volume += VOLUME_STEP
      video.volume = Math.min(volume, MAX_VOLUME)
      break
  }
  toast.show(`音量：${(video.volume * 100).toFixed(0)}%`)
}

// 信息提示弹框
class Toast {
  constructor() {
    // 1. 创建 toast 标签
    this.divEl = document.createElement('div')
    // 2. 初始化样式
    const style = {
      position: 'absolute',
      left: 0,
      top: 0,
      fontSize: TOAST_TEXT_SIZE,
      fontWeight: '700',
      color: TOAST_TEXT_COLOR,
      padding: '20px',
      margin: '20px',
      zIndex: '999999999',
      backgroundColor: TOAST_BACKGROUND,
      borderRadius: '99999px',
    }
    Object.assign(this.divEl.style, style)
  }

  // 展示toast
  show(text = '未设置文字', duration = 1000) {
    this.divEl.textContent = text
    this._setVisible(true)
    this.timer = setTimeout(() => {
      this._setVisible(false)
    }, duration)
  }

  // 设置toast是否可见
  _setVisible(visible) {
    if (!visible) {
      const duration = 1000
      if (document.body.contains(this.divEl)) {
        this.divEl.style.transition = `${duration}ms`
        this.divEl.style.opacity = 0
        this.transitionTimer = setTimeout(() => {
          this.divEl.remove()
        }, duration)
      }
    } else {
      // 重置样式
      this._resetOpacity()
      if (document.body.contains(this.divEl)) {
        // 如果是要显示toast，而且toast已经在dom中
        // 重置计时器
        clearTimeout(this.timer)
        clearTimeout(this.transitionTimer)
        return
      }
      document.body.append(this.divEl)
    }
  }

  // 重置样式
  _resetOpacity() {
    const style = {
      opacity: 1,
      transition: 'none',
    }
    Object.assign(this.divEl.style, style)
  }
}
