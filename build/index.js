"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = require("./info");
exports.default = info_1.Info;
var info_proto_1 = require("./info-proto");
exports.InfoProto = info_proto_1.InfoProto;
var panel_1 = require("./panel");
exports.Panel = panel_1.Panel;
// register if no conflict
var w = window;
if (w.Info === undefined) {
    w.Info = info_1.Info;
}
//# sourceMappingURL=index.js.map