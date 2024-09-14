/**
 * Mount an iframe to the document body.
 */
export function mountIframe() {
  // @ts-expect-error global
  const port = window.__MOCKERY__.client.port
  const iframe = document.createElement('iframe')
  iframe.src = `http://localhost:${port}/`
  iframe.style.display = 'none'
  iframe.style.position = 'fixed'
  iframe.style.top = '0'
  iframe.style.right = '0'
  iframe.style.width = '300px'
  iframe.style.height = '100%'
  iframe.style.border = 'none'
  iframe.style.zIndex = '999999'
  document.body.appendChild(iframe)

  const toggleBtn = document.createElement('button')
  toggleBtn.textContent = '🤡'
  toggleBtn.style.position = 'fixed'
  toggleBtn.style.bottom = '32px'
  toggleBtn.style.right = '32px'
  toggleBtn.style.zIndex = '999999'
  toggleBtn.style.border = 'none'
  toggleBtn.style.padding = '0'
  toggleBtn.style.width = '32px'
  toggleBtn.style.height = '32px'
  toggleBtn.style.background = 'rgba(0, 0, 0, 0.5)'
  toggleBtn.style.borderRadius = '50%'
  toggleBtn.style.color = '#fff'
  toggleBtn.style.fontSize = '20px'
  toggleBtn.style.cursor = 'pointer'
  toggleBtn.onclick = () => {
    iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none'
  }
}

// mount iframe
mountIframe()
