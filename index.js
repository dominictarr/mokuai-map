var h    = require('hyperscript')
var Vec2 = require('vec2')
var vdom = require('vec2-dom')
var View = require('vec2-view')

function Layer (zoom) {
  this.zoom = zoom
  this.tiles = {}
}

var l = Layer.prototype

module.exports = function () {

  var div  = h('div.vec2-map', {style: {overflow: 'hidden'}})
  var tiles = {}

  function getTile(x, y, z, cb) {
    var id = x+':'+y
    if(tiles[id]) return false

    var src = 'https://khms1.google.com/kh/v=134&src=app'
            + '&x=' + x
            + '&y=' + y
            + '&z=' + z
            + '&s=G'
    ;

    var img = h('img', {src: src, style: {'pointer-events': 'none'}})
    div.appendChild(img)
    var r = vdom.absolute(img, true)

    img.screenOrigin = r
    tiles[id] = img

    if(cb)
      img.addEventListener('load', function (e) {
        cb(null, img)
      })

    img.origin = new Vec2(x, y)
    return img
  }

  function round (v) {
    v.set(Math.round(v.x), Math.round(v.y))
    return v
  }

  var view = new View().track(div)
  view.view.set(window.innerWidth, window.innerHeight)
  view.zoom(256)
  var Z = 1

  //get screen dimensions
  //get the screen in the model

  view.screenModel = new Vec2()

  var screenSize = view.view.divide(view.zoom(), true)
  var screenMin = view.center.add(screenSize, true)
  var screenMax = view.center.subtract(screenSize, true)

  view.change(function (e) {
    screenSize.set(view.view).divide(view.zoom())
    screenMax.set(view.center).add(screenSize)
    screenMin.set(view.center).subtract(screenSize)

    var mX = Math.max(Math.floor(screenMin.x), 0)
    var mY = Math.max(Math.floor(screenMin.y), 0)
    var MX = Math.min(Math.floor(screenMax.x), Math.pow(2, Z) - 1)
    var MY = Math.min(Math.floor(screenMax.y), Math.pow(2, Z) - 1)

    //console.log('MAX',  Math.pow(2, Z))

    for(var i =  mX; i <= MX; i++)
      for(var j =  mY; j <= MY; j++)
        if(getTile(i, j, Z)) console.log(i, j)
    

    for(var k in tiles) {
      var img = tiles[k]
      img.screenOrigin.set(round(view.toView(img.origin)))
      img.style.width = Math.floor(view.zoom()) + 'px'
    }

    var z = Math.log(view.zoom()/256)/Math.LN2
    console.log(z + 1)

  })
  return div
}
