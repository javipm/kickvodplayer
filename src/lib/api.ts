export async function getKickStreamer(streamer: string) {
  if (!streamer) return false
  try {
    const response = await fetch(`https://kick.com/api/v1/channels/${streamer}`)
    if (!response.ok) return false
    return await response.json()
  } catch (error) {
    return false
  }
}

export async function getKickVideo(videoId: string) {
  try {
    const response = await fetch(`https://kick.com/api/v1/video/${videoId}`)
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export async function saveProgress(videoId: string, progress: number) {
  try {
    await fetch(`/api/progress/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getProgresses() {
  try {
    const response = await fetch(`/api/progress/all`)
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}
