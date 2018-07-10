/// <reference types="node" />
import { EventEmitter } from 'events';
export interface PanelOptions {
    name: string;
    fgColor: string;
    bgColor: string;
}
export declare class Panel {
    private canvas;
    private context;
    private max;
    private min;
    private name;
    private fgColor;
    private bgColor;
    constructor(options: PanelOptions);
    update(value: number, maxValue: number): void;
    getElement(): HTMLCanvasElement;
    getName(): string;
}
export declare class InfoProto extends EventEmitter {
    private _htmlElement;
    private _currentPanelId;
    private panels;
    private panelData;
    beginTime: number;
    prevTime: number;
    constructor();
    addPanel(panel: Panel): Panel;
    displayPanel(id: number): void;
    getPanelByName(name: string): Panel;
    getPanelById(id: number): Panel;
    switchPanel(): void;
    getElement(): HTMLDivElement;
    initPanelData(name: string, value: any): void;
    setPanelData(name: string, value: any): void;
    getPanelData(name: string): any;
    begin(): number;
    end(): number;
    update(): number;
}
export default class Info extends InfoProto {
    constructor();
}
