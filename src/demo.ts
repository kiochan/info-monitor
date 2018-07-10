declare var Info:any

!function() {

  let monitor = new Info()
  document.body.appendChild(monitor.getElement())
  monitor.displayPanel(0)

  function update() {
    monitor.update()
    requestAnimationFrame(update)
  }
  requestAnimationFrame(update)

}()
