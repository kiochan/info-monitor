# Info Monitor

JavaScript Performance Monitor

A typescript implementation similar to a awesome tool from [mrdoob/stats.js](https://github.com/mrdoob/stats.js/).

This class provides a simple info box that will help you monitor your code performance.

- FPS Frames rendered in the last second. The higher the number the better.
- MS Milliseconds needed to render a frame. The lower the number the better.
- MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info)
- User-defined panel support too.

## Get Started

### 1. via `<script>` Tag

Get the info.min.js and move `info.min.js` into your project, then link the script into your html files before `</body>` tag

```html
<!-- ... some code -->

    <script src="<path-to-js>/info.min.js" charset="utf-8"></script>
    <script type="text/javascript">
      !function() {
        var monitor = new Info()
        document.body.appendChild(monitor.getElement())
        monitor.displayPanel(0)

        function animate() {

          monitor.begin();

          // monitored code goes here

          monitor.end();

          requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }()
    </script>

  </body>
</html>
```

You can find it in `release/info.min.js`

### 2. via npm

Install

```bash
npm install --save info-monitor
```

And just import (works in both javascript and typescript)

```javascript
import Info from "info";

!(function () {
  let monitor = new Info();
  document.body.appendChild(monitor.getElement());
  monitor.displayPanel(0);

  function animate() {
    monitor.begin();

    // monitored code goes here

    monitor.end();

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
```

### 3. via Bookmarklet

You can also add this code to any page using the following bookmarklet.

```javascript
javascript: (function () {
  var script = document.createElement("script");
  script.onload = function () {
    var m = new Info();
    document.body.appendChild(m.getElement());
    requestAnimationFrame(function loop() {
      m.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "//rawgit.com/kiochan/info-monitor/master/release/info.min.js";
  document.head.appendChild(script);
})();
```

## User-Defined Panel

Create your own classes and extend it with my `Info` or `InfoProto` class

> `InfoProto` dosen't contain any panel.

```javascript
import {Info, Panel} from 'info'

class MyInfo extends Info {
  constructor() {
    super()
    this.addPanel(new Panel({
      name: 'MauseMove',
      fgColor: '#f00',
      bgColor: '#200'
    }
    this.on('begin', (event) => {
      // some code here
    })
    this.on('end', (event) => {
      // some code here
    })
  }
}
```

## License

[MIT License](./LISCENSE)

## Combinators

| Avater                                                                    | Github                                |
| ------------------------------------------------------------------------- | ------------------------------------- |
| ![Kiochan Avatar](https://avatars2.githubusercontent.com/u/12151173?s=64) | [Kiochan](https://github.com/kiochan) |
