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
var now = require('./now');
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
//# sourceMappingURL=info-proto.js.map