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

export function calculateProgress(progress: number, duration: number) {
  return progress ? (progress / duration) * 100 : 0
}

export async function generateUserId(str: string) {
  const msgUint8 = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
