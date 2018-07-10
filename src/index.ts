import { EventEmitter } from 'events'

const PR = Math.round(window.devicePixelRatio || 1)

const WIDTH = 80 * PR, HEIGHT = 48 * PR,
  TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
  GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
  GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR

let now: () => number

if (performance) {
  now = () => performance.now()
} else {
  now = () => Date.now()
}

const __performance = performance as any

export interface PanelOptions {
  name: string
  fgColor: string
  bgColor: string
}

export class Panel {

  private canvas: HTMLCanvasElement = null
  private context: CanvasRenderingContext2D = null
  private max: number = 0
  private min: number = Infinity
  private name: string = ''
  private fgColor: string = '#fff'
  private bgColor: string = '#000'

  constructor(options: PanelOptions) {
    this.name = options.name

    let canvas = document.createElement('canvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.cssText = 'width:80px;height:48px'

    var context = canvas.getContext('2d')
    context.font = `bold ${9 * PR}px Helvetica,Arial,sans-serif`
    context.textBaseline = 'top'

    context.fillStyle = this.bgColor = options.bgColor
    context.fillRect(0, 0, WIDTH, HEIGHT)

    context.fillStyle = this.fgColor = options.fgColor
    context.fillText(name, TEXT_X, TEXT_Y)
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

    context.fillStyle = this.bgColor = options.bgColor
    context.globalAlpha = 0.9
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

    this.canvas = canvas
    this.context = context
  }

  public update(value: number, maxValue: number) {
    let min = this.min = Math.min(this.min, value)
    let max = this.max = Math.max(this.max, value)

    const canvas = this.canvas
    const context = this.context
    const round = Math.round

    context.fillStyle = this.bgColor
    context.globalAlpha = 1
    context.fillRect(0, 0, WIDTH, GRAPH_Y)
    context.fillStyle = this.fgColor
    context.fillText(`${round(value)} ${this.name} (${round(min)}-${round(max)})`, TEXT_X, TEXT_Y)
    context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT)
    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT)
    context.fillStyle = this.bgColor
    context.globalAlpha = 0.9
    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT))
  }

  public getElement() {
    return this.canvas
  }

  public getName() {
    return this.name
  }
}


export class InfoProto extends EventEmitter {

  private _htmlElement: HTMLDivElement = null
  private _currentPanelId: number = 0
  private panels: Array<Panel> = []
  private panelData: {
    [key: string]: any
  } = {}
  public beginTime: number = 0
  public prevTime: number = 0

  constructor() {
    super()

    const el = document.createElement('div')
    const styles = el.style

    styles.position = 'absolute'
    styles.top = '0'
    styles.left = '0'
    styles.opacity = '0.8'
    styles.zIndex = '65535'

    el.addEventListener('click', (event) => {
      event.preventDefault()
      this.switchPanel()
    })

    this._htmlElement = el

    this.beginTime = performance.now()
    this.prevTime = this.beginTime

  }

  public addPanel(panel: Panel) {
    this._htmlElement.appendChild(panel.getElement())
    this.panels.push(panel)
    return panel
  }

  public displayPanel(id: number) {
    const el = this._htmlElement
    for (var i = 0; i < el.children.length; i++) {
      let canvas = el.children[i] as HTMLCanvasElement
      if (i === id) {
        canvas.style.display = 'block'
      } else {
        canvas.style.display = 'none'
      }
    }
    this._currentPanelId = id
  }

  public getPanelByName(name: string): Panel {
    for (let i = 0; i < this.panels.length; i++) {
      let panel = this.panels[i] as Panel
      if (panel.getName() === name) return panel
    }
    return null
  }

  public getPanelById(id: number): Panel {
    let panel = this.panels[id]
    if (panel) return panel
    return null
  }

  public switchPanel() {
    this._currentPanelId += 1
    this.displayPanel(this._currentPanelId % this.panels.length)
  }

  public getElement() {
    return this._htmlElement
  }

  public initPanelData(name: string, value: any) {
    if (this.panelData[name] === undefined) {
      this.panelData[name] = value
    } else {
      throw new ReferenceError('this data has been already inited')
    }
  }

  public setPanelData(name: string, value: any) {
    if (this.panelData[name] !== undefined) {
      this.panelData[name] = value
    } else {
      throw new ReferenceError('panel data must init before set')
    }
  }

  public getPanelData(name: string) {
    if (this.panelData[name] !== undefined) {
      return this.panelData[name]
    } else {
      throw new ReferenceError('panel data must init before get')
    }
  }

  public begin() {
    let time = this.beginTime = now()
    this.emit('begin', {target:this, time})
    return time
  }

  public end() {
    var time = now()
    this.emit('end', {target:this, time })
    return time
  }

  public update() {
    let time = this.beginTime = this.end()
    this.emit('update', {target:this, time})
    return time
  }


}

export default class Info extends InfoProto {
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
