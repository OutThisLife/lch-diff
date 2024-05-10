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
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }

  r = linearize(r)
  g = linearize(g)
  b = linearize(b)

  return [
    (0.4124 * r + 0.3576 * g + 0.1805 * b) * 100,
    (0.2126 * r + 0.7152 * g + 0.0722 * b) * 100,
    (0.0193 * r + 0.1192 * g + 0.9505 * b) * 100
  ]
}

export const xyzToLab = (x: number, y: number, z: number) => {
  const eps = 216 / 24389
  const kap = 24389 / 27

  const f = (t: number) => (t > eps ? Math.cbrt(t) : (kap * t + 16) / 116)

  const fx = f(x / 95.05)
  const fy = f(y / 100.0)
  const fz = f(z / 108.9)

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)].map(i => i + 0)
}

// Convert Lab to LCH
export const labToLch = (l: number, a: number, bb: number) => {
  const b = Math.abs(bb) < Math.pow(10, -12) ? 0 : bb
  const c = Math.hypot(a, b)
  const h =
    Math.atan2(b, a) >= 0
      ? (Math.atan2(b, a) / Math.PI) * 180
      : (Math.atan2(b, a) / Math.PI) * 180 + 360

  return [l, c, h]
}

export const hexToLch = (hex: string) => {
  const [r, g, b] = hexToRgb(hex)
  const [x, y, z] = rgbToXyz(r, g, b)
  const [l, a, bLab] = xyzToLab(x, y, z)

  return labToLch(l, a, bLab)
}
