const PR = Math.round(window.devicePixelRatio || 1)

const WIDTH = 80 * PR
const HEIGHT = 48 * PR
const TEXT_X = 3 * PR
const TEXT_Y = 2 * PR
const GRAPH_X = 3 * PR
const GRAPH_Y = 15 * PR
const GRAPH_WIDTH = 74 * PR
const GRAPH_HEIGHT = 30 * PR

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

  constructor (options: PanelOptions) {
    this.name = options.name

    let canvas = document.createElement('canvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.cssText = 'width:80px;height:48px'

    let context = canvas.getContext('2d')
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

  public update (value: number, maxValue: number) {
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

  public getElement () {
    return this.canvas
  }

  public getName () {
    return this.name
  }
}
