import { Info } from './info'

export default Info

export { InfoProto } from './info-proto'

export { Panel } from './panel'

// register if no conflict
let w = window as any
if (w.Info === undefined) {
  w.Info = Info
} else {
  w.__info_no_conflict = Info
}
