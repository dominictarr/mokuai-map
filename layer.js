var Vec2 = require('vec2')
var h = require('hyperscript')
var vdom = require('vec2-dom')
var tiles = require('./tiles')
module.exports = Layer

function round (v) {
  v.set(Math.floor(v.x), Math.floor(v.y))
  return v
}

var L = null

function Layer (scale) {
  this.scale = scale
  this.tiles = {}
  this.div = h('div', {
    'pointer-events' : 'none',
    left             : '0px',
    top              : '0px',
    'z-index'        : this.scale,
    position         : 'absolute'
  })
}

var l = Layer.prototype

l.getTile = function (x, y, z) {

  //make this injectable
  var src = 'https://khms1.google.com/kh/v=134&src=app'
          + '&x=' + x
          + '&y=' + y
          + '&z=' + z
          + '&s=G'
  ;
  var img
  return img = h('img', {src: src, onload: function () {

  }, onerror: function (e) {
    img.style.opacity = 0.1
    console.error('LOAD ERROR', e)
  }})
}

l.add = function (x, y) {
  var id = x+':'+y
  if(this.tiles[id]) return false

  var z = this.scale

  var img = this.getTile(x, y, z)
  img.id = x+'_'+y+'_'+z
  img.style['pointer-events'] = 'none'

  this.div.appendChild(img)
  var r = vdom.absolute(img, true)

  img.screenOrigin = r
  this.tiles[id] = img

  img.origin = new Vec2(x, y)
  return img
}

l.remove = function (x, y) {
  var k = x + ':' + y
  var img = this.tiles[k]
  delete this.tiles[k]
  this.div.removeChild(img)
  return this
}

l.show = function (show) {
  this.div.style.display = show ? 'block' : 'none'
}

var o = new Vec2()
  var unit = new Vec2(1, 1)

l.update = function (min, max, view) {
  var scale =  Math.pow(2, this.scale)
  var z = Math.log(Math.round(view.zoom()/256))/Math.LN2

  var m = this.min = tiles.min(min, this.scale, this.min)
  var M = this.max = tiles.min(max, this.scale, this.max)

  var scale = Math.pow(2, this.scale - 1)

  for(var i =  m.x; i <= M.x; i++)
    for(var j =  m.y; j <= M.y; j++)
      this.add(i, j)

  for(var k in this.tiles) {
    var img = this.tiles[k]
    
    img.screenOrigin.set(
      round(o.set(img.origin)
        .divide(scale)
        .subtract(view.center)
        .multiply(Math.round(view.zoom()))
        .add(view._viewCenter))
    )

    img.style.width = Math.floor(view.zoom()/scale) + 'px'

    if(
      img.origin.x < m.x || img.origin.y < m.y ||
      img.origin.x > M.x || img.origin.y > M.y
    ) {
      this.remove(img.origin.x, img.origin.y)
    }
  }
}

