//given a bounds, and a zoom level
//get the min and max tiles that fit within that box.

var tape = require('tape')
var Vec2 = require('vec2')
var tiles = require('../tiles')

tape('unit', function (t) {
  var min   = new Vec2(0, 0)
  var max   = new Vec2(2, 2)
  var scale = 1

  var mt = tiles.min(min, scale)
  var Mt = tiles.max(max, scale)

  t.deepEqual(mt.toJSON(), {x: 0, y: 0})
  t.deepEqual(Mt.toJSON(), {x: 1, y: 1})
  t.end()
})

tape('unit', function (t) {
  var min   = new Vec2(0.3, 0.1)
  var max   = new Vec2(1.2, 1.8)
  var scale = 1

  var mt = tiles.min(min, scale)
  var Mt = tiles.max(max, scale)

  t.deepEqual(mt.toJSON(), {x: 0, y: 0})
  t.deepEqual(Mt.toJSON(), {x: 1, y: 1})
  t.end()
})

tape('unit^2', function (t) {
  var min   = new Vec2(0, 0)
  var max   = new Vec2(2, 2)
  var scale = 2

  var mt = tiles.min(min, scale)
  var Mt = tiles.max(max, scale)

  t.deepEqual(mt.toJSON(), {x: 0, y: 0})
  t.deepEqual(Mt.toJSON(), {x: 3, y: 3})
  t.end()
})

tape('unit^3', function (t) {
  var min   = new Vec2(1, 1)
  var max   = new Vec2(2, 2)
  var scale = 3

  var mt = tiles.min(min, scale)
  var Mt = tiles.max(max, scale)

  console.log(mt, Mt)
  t.deepEqual(mt.toJSON(), {x: 4, y: 4})
  t.deepEqual(Mt.toJSON(), {x: 7, y: 7})
  t.end()
})

tape('unit^3', function (t) {
  var min   = new Vec2(1.125, 1.05)
  var max   = new Vec2(1.25, 1.1)
  var scale = 5

  var mt = tiles.min(min, scale)
  var Mt = tiles.max(max, scale)

  console.log(mt, Mt)
  t.deepEqual(mt.toJSON(), {x: 18, y: 16})
  t.deepEqual(Mt.toJSON(), {x: 20, y: 18})
  t.end()
})

tape('unit overflow', function (t) {
  var min   = new Vec2(-1, -1)
  var max   = new Vec2(3, 3)
  var scale = 1

  var mt = tiles.min(min, scale)
  var Mt = tiles.max(max, scale)

  t.deepEqual(mt.toJSON(), {x: 0, y: 0})
  t.deepEqual(Mt.toJSON(), {x: 1, y: 1})
  t.end()
})

tape('unit', function (t) {
  var min   = new Vec2(6, 5)
  var max   = new Vec2(7, 7)
  var scale = 1

  var mt = tiles.min(min, scale)
  var Mt = tiles.max(max, scale)

  t.deepEqual(mt.toJSON(), {x: 1, y: 1})
  t.deepEqual(Mt.toJSON(), {x: 1, y: 1})
  t.end()
})

