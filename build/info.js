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
var info_proto_1 = require("./info-proto");
var panel_1 = require("./panel");
var __performance = performance;
var Info = /** @class */ (function (_super) {
    __extends(Info, _super);
    function Info() {
        var _this = _super.call(this) || this;
        _this.addPanel(new panel_1.Panel({
            name: 'FPS',
            fgColor: '#0ff',
            bgColor: '#022'
        }));
        _this.initPanelData('frames', 0);
        _this.addPanel(new panel_1.Panel({
            name: 'MS',
            fgColor: '#ff0',
            bgColor: '#220'
        }));
        if (__performance && __performance.memory) {
            _this.addPanel(new panel_1.Panel({
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
}(info_proto_1.InfoProto));
exports.Info = Info;
//# sourceMappingURL=info.js.map