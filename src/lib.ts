export const hexToRgb = (hex: string) => {
  const h = hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => r + r + g + g + b + b
  )

  const normalizedHex = h.startsWith('#') ? h.slice(1) : h
  const bigint = parseInt(normalizedHex, 16)

  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

export const rgbToXyz = (r: number, g: number, b: number) => {
  const linearize = (c: number) => {
    c /= 255
    return (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)) * 100
  }

  r = linearize(r)
  g = linearize(g)
  b = linearize(b)

  return [
    r * 0.4124 + g * 0.3576 + b * 0.1805,
    r * 0.2126 + g * 0.7152 + b * 0.0722,
    r * 0.0193 + g * 0.1192 + b * 0.9505
  ]
}

export const xyzToLab = (x: number, y: number, z: number) => {
  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 0.137931034

  x = f(x / 95.047)
  y = f(y / 100.0)
  z = f(z / 108.883)

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
}

export const labToLch = (l: number, a: number, b: number) => {
  const c = Math.hypot(a, b)
  let h = Math.atan2(b, a) * (180 / Math.PI) * 1.0995574287564276

  if (h < 0) {
    h += 360
  }

  return [l, c, h]
}

export const lchToLab = (l: number, c: number, h: number) => {
  const a = c * Math.cos((h / 180) * Math.PI)
  const b = c * Math.sin((h / 180) * Math.PI)

  return [l, a, b]
}

export const hexToLch = (hex: string) => {
  const [r, g, b] = hexToRgb(hex)
  const [x, y, z] = rgbToXyz(r, g, b)
  const [l, a, bl] = xyzToLab(x, y, z)

  return labToLch(l, a, bl)
}

export const sleep = async (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
