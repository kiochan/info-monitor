import { EventEmitter } from "events";
import Panel from "./Panel";
import now from "./now";

export default class InfoProto extends EventEmitter {
  private _htmlElement: HTMLDivElement = null;
  private _currentPanelId: number = 0;
  private panels: Array<Panel> = [];
  private panelData: {
    [key: string]: any;
  } = {};
  public beginTime: number = 0;
  public prevTime: number = 0;

  constructor() {
    super();

    const el = document.createElement("div");
    const styles = el.style;

    styles.position = "absolute";
    styles.top = "0";
    styles.left = "0";
    styles.opacity = "0.8";
    styles.zIndex = "65535";

    el.addEventListener("click", (event) => {
      event.preventDefault();
      this.switchPanel();
    });

    this._htmlElement = el;

    this.beginTime = now();
    this.prevTime = this.beginTime;
  }

  public addPanel(panel: Panel) {
    this._htmlElement.appendChild(panel.getElement());
    this.panels.push(panel);
    return panel;
  }

  public displayPanel(id: number) {
    const el = this._htmlElement;
    for (let i = 0; i < el.children.length; i++) {
      let canvas = el.children[i] as HTMLCanvasElement;
      if (i === id) {
        canvas.style.display = "block";
      } else {
        canvas.style.display = "none";
      }
    }
    this._currentPanelId = id;
  }

  public getPanelByName(name: string): Panel {
    for (let i = 0; i < this.panels.length; i++) {
      let panel = this.panels[i] as Panel;
      if (panel.getName() === name) return panel;
    }
    return null;
  }

  public getPanelById(id: number): Panel {
    let panel = this.panels[id];
    if (panel) return panel;
    return null;
  }

  public switchPanel() {
    this._currentPanelId += 1;
    this.displayPanel(this._currentPanelId % this.panels.length);
  }

  public getElement() {
    return this._htmlElement;
  }

  public initPanelData(name: string, value: any) {
    if (this.panelData[name] === undefined) {
      this.panelData[name] = value;
    } else {
      throw new ReferenceError("this data has been already inited");
    }
  }

  public setPanelData(name: string, value: any) {
    if (this.panelData[name] !== undefined) {
      this.panelData[name] = value;
    } else {
      throw new ReferenceError("panel data must init before set");
    }
  }

  public getPanelData(name: string) {
    if (this.panelData[name] !== undefined) {
      return this.panelData[name];
    } else {
      throw new ReferenceError("panel data must init before get");
    }
  }

  public begin() {
    let time = (this.beginTime = now());
    this.emit("begin", { target: this, time });
    return time;
  }

  public end() {
    const time = now();
    this.emit("end", { target: this, time });
    return time;
  }

  public update() {
    let time = (this.beginTime = this.end());
    this.emit("update", { target: this, time });
    return time;
  }
}
