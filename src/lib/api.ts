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

export async function getKickUser(user: string) {
  if (!user) return false
  try {
    const response = await fetch(`https://kick.com/api/v1/users/${user}`)
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

export async function getProgresses(limit?: number) {
  try {
    const response = await fetch(
      `/api/progress/all${limit ? `?limit=${limit}` : ''}`
    )
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export async function getFollows() {
  try {
    const response = await fetch(`/api/follows/all`)
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export async function getIsFollowing(streamer: string) {
  try {
    const response = await fetch(`/api/follows/${streamer}`)
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export async function setFollow(streamer: string) {
  try {
    const response = await fetch(`/api/follows/set/${streamer}`)
    if (response.status === 200) {
      return true
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function setUnfollow(streamer: string) {
  try {
    const response = await fetch(`/api/follows/unset/${streamer}`)
    if (response.status === 200) {
      return true
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
