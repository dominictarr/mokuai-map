var h    = require('hyperscript')
var Vec2 = require('vec2')
var View = require('vec2-view')
var Layer = require('vec2-tile-layer')
//
//NOTE = h('pre', {style: {
//    position: 'fixed',
//    'z-index': 30,
//    left:'20px',
//    top:'20px',
//    border: '1px solid'
//}})
//
//document.body.appendChild(NOTE)

function round (v) {
  v.set(Math.round(v.x), Math.round(v.y))
  return v
}


module.exports = function (opts) {

  var layers = []

  //fix how the divs work... tiles should be in layers
  //and should be layed ontop of each other (more detailed ontop of less)
//    console.log(windew.innerWidth, windew.innerHeight)
  var div = h('div', {style: {
      //these settings will make the map appear within the box
      //so that it's embedable.
      //TODO: make the dimensions a parameter
//      width: window.innerWidth + 'px',
//      height: window.innerHeight + 'px',
      width: '1024px', height: '1024px',
      'overflow': 'hidden',
      'position': 'relative',
      'z-index': 20,
      'border' : '1px solid',
      background: 'lightblue'

    }})

  

  var view = new View()
//  view.view.set(window.innerWidth, window.innerHeight)
  view.zoom.set(1, 1)
  view.view.set(1024, 1024)

  view.center.set(512, 512)
  view.track(document.body)
  for(var i = 1; i < 22; i ++) {
    var l = new  Layer({scale: i, size: view.view})
    layers.push(l)
    div.appendChild(l.div)
  }

  //get screen dimensions
  //get the screen in the model

  view.screenModel = new Vec2()
  view.change(update)

  function update () {
    var z = Math.max(Math.min(
      Math.floor(Math.log(view.zoom.x)/Math.LN2) + 1,
      layers.length - 2), 0)
    var z2 = z + 1

//  NOTE.textContent = JSON.stringify([view.world, view.world.bound, view.zoom], null, 2)

    //show two layers at once (so you can see larger layer through gaps)
    if(/*layers[z2] && */layers[z]){
      layers.forEach(function (e, i) {
        if(i <= z)
          e.update(view.world, view.world.bound, view.zoom)
        e.show(i === z)
      })
    }

  }

  //poll the parentElement until this element is added.
  var i = setInterval(function () {
    if(!div.parentElement) return
    clearInterval(i)
    update()

  }, 50)
  return div
}
