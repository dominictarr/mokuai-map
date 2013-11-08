var Vec2 = require('vec2')
var h = require('hyperscript')
var vdom = require('vec2-dom')
var tiles = require('./tiles')
module.exports = Layer

function round (v) {
  v.set(Math.round(v.x), Math.round(v.y))
  return v
}



function Layer (scale) {
  this.scale = scale
  this.tiles = {}
  this.div = h('div', {
    'pointer-events': 'none',
    left: '0px',
    top:'0px',
    'z-index': this.scale,
    position: 'absolute'
  })
}

var l = Layer.prototype
  function getTile(x, y, z, cb) {
  }

l.add = function (x, y) {
  var id = x+':'+y
  if(this.tiles[id]) return false

  var z = this.scale

  //make this injectable
  var src = 'https://khms1.google.com/kh/v=134&src=app'
          + '&x=' + x
          + '&y=' + y
          + '&z=' + z
          + '&s=G'
  ;

  var img = h('img', {src: src, style: { 'pointer-events': 'none', 'opacity': '1'}})
  this.div.appendChild(img)
  var r = vdom.absolute(img, true)

  img.screenOrigin = r
  this.tiles[id] = img

  img.origin = new Vec2(x, y)
  return img
}

l.show = function (show) {
  this.div.style.display = show ? 'block' : 'none'
}

var o = new Vec2()

l.update = function (min, max, view) {
  var scale =  Math.pow(2, this.scale)
  var z = Math.log(view.zoom()/256)/Math.LN2
  var mX = Math.max(Math.floor(min.x), 0)
  var mY = Math.max(Math.floor(min.y), 0)
  var MX = Math.min(Math.floor(min.x + scale*(max.x - min.x)), scale)
  var MY = Math.min(Math.floor(min.y + scale*(max.y - min.y)), scale)

  if(Math.random() < 0.1) {
    console.log(min.toJSON(), max.toJSON())
    console.log(scale, ':', mX, mY, '-', MX, MY, '?', z)
  }
//  console.log('SCALE', scale, mX, MX)
//  var MY = Math.min(mX + Math.floor(max.y - min.y)*scale, scale)

  for(var i =  mX; i < MX; i++)
    for(var j =  mY; j < MY; j++)
      if(this.add(i, j)) console.log('ADD', i, j, scale)
  var scale = Math.pow(2, this.scale - 1)

  for(var k in this.tiles) {
    var img = this.tiles[k]
    
    img.screenOrigin.set(
      o.set(img.origin)
        .divide(scale)
        .subtract(view.center)
        .multiply(view.zoom())
        .add(view._viewCenter)
    )
    img.style.width = Math.floor(view.zoom()/scale) + 'px'

    if(
      img.screenOrigin.x < -256 || img.screenOrigin.y < -256 ||
      img.screenOrigin.x > view.view.x || img.screenOrigin.y > view.view.y
    ) {
      console.log('REMOVE', k)
      delete this.tiles[k]
      this.div.removeChild(img)
    }
  }
}

