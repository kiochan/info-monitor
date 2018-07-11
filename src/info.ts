import { InfoProto } from './info-proto'
import { Panel } from './panel'

const __performance = performance as any

export class Info extends InfoProto {
  constructor() {
    super()

    this.addPanel(new Panel({
      name: 'FPS',
      fgColor: '#0ff',
      bgColor: '#022'
    }))

    this.initPanelData('frames', 0)

    this.addPanel(new Panel({
      name: 'MS',
      fgColor: '#ff0',
      bgColor: '#220'
    }))

    if (__performance && __performance.memory) {
      this.addPanel(new Panel({
        name: 'MB',
        fgColor: '#f0f',
        bgColor: '#202'
      }))
    }

    this.on('end', (event) => {
      const time = event.time
      const that = event.target

      let frames = that.getPanelData('frames')
      that.setPanelData('frames', ++frames)

      that.getPanelByName('MS').update(time - that.beginTime, 200)

      if (time >= that.prevTime + 1000) {

        that.getPanelByName('FPS').update((frames * 1000) / (time - that.prevTime), 100)
        that.prevTime = time
        that.setPanelData('frames', 0)
        let memPanel = that.getPanelByName('MB')
        if (memPanel) {
          var memory = __performance.memory
          memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576)
        }
      }
    })

  }
}
