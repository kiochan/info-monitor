"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PR = Math.round(window.devicePixelRatio || 1);
var WIDTH = 80 * PR, HEIGHT = 48 * PR, TEXT_X = 3 * PR, TEXT_Y = 2 * PR, GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR, GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;
var Panel = /** @class */ (function () {
    function Panel(options) {
        this.canvas = null;
        this.context = null;
        this.max = 0;
        this.min = Infinity;
        this.name = '';
        this.fgColor = '#fff';
        this.bgColor = '#000';
        this.name = options.name;
        var canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.cssText = 'width:80px;height:48px';
        var context = canvas.getContext('2d');
        context.font = "bold " + 9 * PR + "px Helvetica,Arial,sans-serif";
        context.textBaseline = 'top';
        context.fillStyle = this.bgColor = options.bgColor;
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = this.fgColor = options.fgColor;
        context.fillText(name, TEXT_X, TEXT_Y);
        context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
        context.fillStyle = this.bgColor = options.bgColor;
        context.globalAlpha = 0.9;
        context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
        this.canvas = canvas;
        this.context = context;
    }
    Panel.prototype.update = function (value, maxValue) {
        var min = this.min = Math.min(this.min, value);
        var max = this.max = Math.max(this.max, value);
        var canvas = this.canvas;
        var context = this.context;
        var round = Math.round;
        context.fillStyle = this.bgColor;
        context.globalAlpha = 1;
        context.fillRect(0, 0, WIDTH, GRAPH_Y);
        context.fillStyle = this.fgColor;
        context.fillText(round(value) + " " + this.name + " (" + round(min) + "-" + round(max) + ")", TEXT_X, TEXT_Y);
        context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);
        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
        context.fillStyle = this.bgColor;
        context.globalAlpha = 0.9;
        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
    };
    Panel.prototype.getElement = function () {
        return this.canvas;
    };
    Panel.prototype.getName = function () {
        return this.name;
    };
    return Panel;
}());
exports.Panel = Panel;
//# sourceMappingURL=panel.js.map