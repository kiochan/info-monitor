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
