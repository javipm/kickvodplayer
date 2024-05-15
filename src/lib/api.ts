import type { Follow, Streamer, User, Video, VideoProgress } from '..'

export async function getKickStreamer(
  streamer: string
): Promise<Streamer | false> {
  if (!streamer) return false
  try {
    const response = await fetch(`https://kick.com/api/v1/channels/${streamer}`)
    if (!response.ok) return false
    return await response.json()
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getKickUser(user: string): Promise<User | false> {
  if (!user) return false
  try {
    const response = await fetch(`https://kick.com/api/v1/users/${user}`)
    if (!response.ok) return false
    return await response.json()
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getKickVideo(videoId: string): Promise<Video | false> {
  try {
    const response = await fetch(`https://kick.com/api/v1/video/${videoId}`)
    return await response.json()
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function saveProgress(
  videoId: string,
  progress: number
): Promise<boolean> {
  try {
    const response = await fetch(`/api/progress/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    })
    if (response.status == 200) {
      return true
    }

    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getProgresses(
  limit?: number
): Promise<VideoProgress[] | false> {
  try {
    const response = await fetch(
      `/api/progress/all${limit ? `?limit=${limit}` : ''}`
    )
    return await response.json()
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getFollows(): Promise<Follow[] | false> {
  try {
    const response = await fetch(`/api/follows/all`)
    return await response.json()
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getIsFollowing(streamer: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/follows/${streamer}`)
    const data = await response.json()

    if (data.isFollowing) {
      return true
    }

    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function setFollow(streamer: string): Promise<boolean> {
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

export async function setUnfollow(streamer: string): Promise<boolean> {
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
