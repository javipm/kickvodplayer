export function secondsToHms(d: number) {
  d = Number(d) / 1000
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)

  const hDisplay = h.toString().padStart(2, '0') + ':'
  const mDisplay = m.toString().padStart(2, '0') + ':'
  const sDisplay = s.toString().padStart(2, '0')

  return hDisplay + mDisplay + sDisplay
}
