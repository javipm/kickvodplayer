export async function checkStreamer(streamer: string) {
  if (!streamer) return false
  try {
    const response = await fetch(`https://kick.com/api/v1/channels/${streamer}`)
    if (!response.ok) return false
    return true
  } catch (error) {
    return false
  }
}
