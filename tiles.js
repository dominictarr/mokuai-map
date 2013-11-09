var Vec2 = require('vec2')

var M = new Vec2(), m = new Vec2(0, 0)

function floor (v) {
  return v.set(Math.floor(v.x), Math.floor(v.y))
}

function ceil (v) {
  return v.set(Math.ceil(v.x), Math.ceil(v.y))
}

function minTile (min, scale, v) {
  v = v || new Vec2()
  var z = Math.pow(2, scale - 1)
  return floor(v.set(min).multiply(z)).clamp(m, M.set(z*2 - 1, z*2 - 1))
}

function maxTile (max, scale, v) {
  v = v || new Vec2()
  var z = Math.pow(2, scale - 1)
  return ceil(v.set(max).multiply(z)).clamp(m, M.set(z*2 - 1, z*2 - 1))
}

exports.min = minTile
exports.max = maxTile
