var h    = require('hyperscript')
var Vec2 = require('vec2')
var View = require('vec2-view')

NOTE = h('pre', {style: {
    position: 'fixed',
    'z-index': 30,
    left:'20px',
    top:'20px'
}})

var Layer = require('./layer')

document.body.appendChild(NOTE)

function round (v) {
  v.set(Math.round(v.x), Math.round(v.y))
  return v
}


module.exports = function () {

  var layers = []

  //fix how the divs work... tiles should be in layers
  //and should be layed ontop of each other (more detailed ontop of less)
  
  var div = h('div', {style: {
      //these settings will make the map appear within the box
      //so that it's embedable.
      //TODO: make the dimensions a parameter
      width: window.innerWidth + 'px',
      height: window.innerHeight + 'px',
      'overflow': 'hidden',
      'position': 'relative',
      'z-index': 20
    }})

    for(var i = 1; i < 16; i ++) {
      var l = new  Layer(i)
      layers.push(l)
      div.appendChild(l.div)
    }

  var view = new View().track(document.body)
  view.view.set(window.innerWidth, window.innerHeight)
  view.zoom(256)

  //get screen dimensions
  //get the screen in the model

  view.screenModel = new Vec2()

  var screenSize = view.view.divide(view.zoom()*2, true)
  var screenMin = view.center.add(screenSize, true)
  var screenMax = view.center.subtract(screenSize, true)

   view.change(function (e) {
    var z = Math.min(
      Math.floor(Math.log(view.zoom()/256)/Math.LN2) + 1,
      layers.length - 2)
    var z2 = z + 1
    
    //TODO: refactor this out 
    screenSize.set(view.view).divide(view.zoom()*2)
    screenMax.set(view.center).add(screenSize)
    screenMin.set(view.center).subtract(screenSize)

    var scale = Math.pow(2, z)

  NOTE.textContent = JSON.stringify([], null, 2)

    //show two layers at once (so you can see larger layer through gaps)
    if(layers[z2] && layers[z]){
      layers[z].update(screenMin, screenMax, view)
//      layers[z2].update(screenMin, screenMax, view)
      layers.forEach(function (e, i) {
        e.show(i == z)
      })
    }
  })

  return div
}
