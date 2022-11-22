import Info from "./Info";
import InfoProto from "./InfoProto";
import Panel from "./Panel";

export default Info;

export { Info, InfoProto, Panel };

// register if no conflict
let w = window as any;
if (w.Info === undefined) {
  w.Info = Info;
} else {
  w.__info_no_conflict = Info;
}
