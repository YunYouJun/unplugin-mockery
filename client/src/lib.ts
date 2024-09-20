const mockeryCSS = `
#unplugin-mockery_iframe {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  height: 100%;
  border: none;
  z-index: 999999;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.2s;
}
#unplugin-mockery_btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 9999999;
  border: none;
  padding: 0;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
`

function injectCSS(css: string) {
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

/**
 * Mount an iframe to the document body.
 */
export function mountIframe() {
  injectCSS(mockeryCSS)

  // eslint-disable-next-line node/prefer-global/process
  const port = process.env.VUE_APP_MOCKERY_CLIENT_PORT
  if (!port) {
    console.error('VUE_APP_MOCKERY_CLIENT_PORT is not defined')
    return
  }

  // 遮罩
  const iframe = document.createElement('iframe')
  const mask = document.createElement('div')

  mask.style.position = 'fixed'
  mask.style.top = '0'
  mask.style.left = '0'
  mask.style.width = '100%'
  mask.style.height = '100%'
  mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  mask.style.zIndex = '999998'
  mask.style.display = 'none'
  mask.onclick = () => {
    mask.style.display = 'none'
    iframe.style.display = 'none'
  }

  iframe.id = 'unplugin-mockery_iframe'
  iframe.src = `http://localhost:${port}/`
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  document.body.appendChild(mask)

  const toggleBtn = document.createElement('button')
  toggleBtn.id = 'unplugin-mockery_btn'
  toggleBtn.textContent = '🤡'
  toggleBtn.onclick = () => {
    const show = iframe.style.display === 'none'

    iframe.style.display = 'translateX(100%)'
    iframe.style.display = show ? 'block' : 'none'
    mask.style.display = show ? 'block' : 'none'

    // translate transition
    iframe.style.transform = show ? 'translateX(0)' : 'translateX(100%)'
  }
  document.body.appendChild(toggleBtn)

  // toggleBtn can be dragged
  toggleBtn.draggable = true
}

function main() {
  // eslint-disable-next-line no-console
  console.log('DOMContentLoaded', 'Inject Mockery Client')
  mountIframe()
}

main()
