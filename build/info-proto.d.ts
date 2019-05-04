import { EventEmitter } from 'events';
import { Panel } from './panel';
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
