"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var PR = Math.round(window.devicePixelRatio || 1);
var WIDTH = 80 * PR, HEIGHT = 48 * PR, TEXT_X = 3 * PR, TEXT_Y = 2 * PR, GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR, GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;
var now;
if (performance) {
    now = function () { return performance.now(); };
}
else {
    now = function () { return Date.now(); };
}
var __performance = performance;
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
var InfoProto = /** @class */ (function (_super) {
    __extends(InfoProto, _super);
    function InfoProto() {
        var _this = _super.call(this) || this;
        _this._htmlElement = null;
        _this._currentPanelId = 0;
        _this.panels = [];
        _this.panelData = {};
        _this.beginTime = 0;
        _this.prevTime = 0;
        var el = document.createElement('div');
        var styles = el.style;
        styles.position = 'absolute';
        styles.top = '0';
        styles.left = '0';
        styles.opacity = '0.8';
        styles.zIndex = '65535';
        el.addEventListener('click', function (event) {
            event.preventDefault();
            _this.switchPanel();
        });
        _this._htmlElement = el;
        _this.beginTime = performance.now();
        _this.prevTime = _this.beginTime;
        return _this;
    }
    InfoProto.prototype.addPanel = function (panel) {
        this._htmlElement.appendChild(panel.getElement());
        this.panels.push(panel);
        return panel;
    };
    InfoProto.prototype.displayPanel = function (id) {
        var el = this._htmlElement;
        for (var i = 0; i < el.children.length; i++) {
            var canvas = el.children[i];
            if (i === id) {
                canvas.style.display = 'block';
            }
            else {
                canvas.style.display = 'none';
            }
        }
        this._currentPanelId = id;
    };
    InfoProto.prototype.getPanelByName = function (name) {
        for (var i = 0; i < this.panels.length; i++) {
            var panel = this.panels[i];
            if (panel.getName() === name)
                return panel;
        }
        return null;
    };
    InfoProto.prototype.getPanelById = function (id) {
        var panel = this.panels[id];
        if (panel)
            return panel;
        return null;
    };
    InfoProto.prototype.switchPanel = function () {
        this._currentPanelId += 1;
        this.displayPanel(this._currentPanelId % this.panels.length);
    };
    InfoProto.prototype.getElement = function () {
        return this._htmlElement;
    };
    InfoProto.prototype.initPanelData = function (name, value) {
        if (this.panelData[name] === undefined) {
            this.panelData[name] = value;
        }
        else {
            throw new ReferenceError('this data has been already inited');
        }
    };
    InfoProto.prototype.setPanelData = function (name, value) {
        if (this.panelData[name] !== undefined) {
            this.panelData[name] = value;
        }
        else {
            throw new ReferenceError('panel data must init before set');
        }
    };
    InfoProto.prototype.getPanelData = function (name) {
        if (this.panelData[name] !== undefined) {
            return this.panelData[name];
        }
        else {
            throw new ReferenceError('panel data must init before get');
        }
    };
    InfoProto.prototype.begin = function () {
        var time = this.beginTime = now();
        this.emit('begin', { target: this, time: time });
        return time;
    };
    InfoProto.prototype.end = function () {
        var time = now();
        this.emit('end', { target: this, time: time });
        return time;
    };
    InfoProto.prototype.update = function () {
        var time = this.beginTime = this.end();
        this.emit('update', { target: this, time: time });
        return time;
    };
    return InfoProto;
}(events_1.EventEmitter));
exports.InfoProto = InfoProto;
var Info = /** @class */ (function (_super) {
    __extends(Info, _super);
    function Info() {
        var _this = _super.call(this) || this;
        _this.addPanel(new Panel({
            name: 'FPS',
            fgColor: '#0ff',
            bgColor: '#022'
        }));
        _this.initPanelData('frames', 0);
        _this.addPanel(new Panel({
            name: 'MS',
            fgColor: '#ff0',
            bgColor: '#220'
        }));
        if (__performance && __performance.memory) {
            _this.addPanel(new Panel({
                name: 'MB',
                fgColor: '#f0f',
                bgColor: '#202'
            }));
        }
        _this.on('end', function (event) {
            var time = event.time;
            var that = event.target;
            var frames = that.getPanelData('frames');
            that.setPanelData('frames', ++frames);
            that.getPanelByName('MS').update(time - that.beginTime, 200);
            if (time >= that.prevTime + 1000) {
                that.getPanelByName('FPS').update((frames * 1000) / (time - that.prevTime), 100);
                that.prevTime = time;
                that.setPanelData('frames', 0);
                var memPanel = that.getPanelByName('MB');
                if (memPanel) {
                    var memory = __performance.memory;
                    memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
                }
            }
        });
        return _this;
    }
    return Info;
}(InfoProto));
exports.default = Info;
//# sourceMappingURL=index.js.map