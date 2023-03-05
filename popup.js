let enableEl = document.querySelector('.enable input')
chrome.storage.local.get('enable').then(({ enable }) => {
  enableEl.checked = enable
})

enableEl.addEventListener('click', () => {
  chrome.storage.local.set({ enable: enableEl.checked }).then(() => {})
})
