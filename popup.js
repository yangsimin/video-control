let changeStep = document.querySelector('#changeStep')

// chrome.storage.sync.get('color', ({ color }) => {
//   changeColor.style.backgroundColor = color
// })

changeStep.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  // 在当前页面执行脚本
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: mapKey,
  })
})

function mapKey() {
  console.log('mapKey')
  // chrome.storage.sync.get('color', ({ color }) => {
  //   document.body.style.backgroundColor = color
  // })
  const video = document.querySelector('video')
  if (video) {
    video.playbackRate = 2
    document.addEventListener('keydown', event => {
      if (event.key === 'h') {
        video.currentTime -= 3
      } else if (event.key === 'l') {
        video.currentTime += 3
      }
    })
  }
}
