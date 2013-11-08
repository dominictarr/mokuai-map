var Vec2 = require('vec2')

function floor (v) {
  return v.set(Math.floor(v.x), Math.floor(v.y))
}

function ceil (v) {
  return v.set(Math.ceil(v.x), Math.ceil(v.y))
}

function minTile (min, scale, v) {
  v = v || new Vec2()
  return floor(v.set(min).multiply(Math.pow(2, scale - 1)))
}

function maxTile (max, scale, v) {
  v = v || new Vec2()
  return ceil(v.set(max).multiply(Math.pow(2, scale - 1)))
}

exports.min = minTile
exports.max = maxTile
