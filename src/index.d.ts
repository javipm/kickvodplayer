export interface Streamer {
  id: number
  user_id: number
  slug: string
  is_banned: boolean
  playback_url: string
  name_updated_at: any
  vod_enabled: boolean
  subscription_enabled: boolean
  followersCount: number
  subscriber_badges: any[]
  banner_image: BannerImage
  recent_categories: RecentCategory[]
  livestream: Livestream
  role: any
  muted: boolean
  follower_badges: any[]
  offline_banner_image: any
  can_host: boolean
  user: User
  chatroom: Chatroom
  ascending_links: AscendingLink[]
  plan: Plan
  previous_livestreams: Livestream[]
  verified: Verified
  media: Medum[]
}

export interface BannerImage {
  responsive: string
  url: string
}

export interface RecentCategory {
  id: number
  category_id: number
  name: string
  slug: string
  tags: string[]
  description: string
  deleted_at: any
  viewers: number
  banner: Banner
  category: Category
}

export interface Banner {
  responsive: string
  url: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon: string
}

export interface User {
  id: number
  username: string
  agreed_to_terms: boolean
  email_verified_at: string
  bio: string
  country: string
  state: string
  city: string
  instagram: string
  twitter: string
  youtube: string
  discord: string
  tiktok: string
  facebook: string
  profile_pic: string
}

export interface Chatroom {
  id: number
  chatable_type: string
  channel_id: number
  created_at: string
  updated_at: string
  chat_mode_old: string
  chat_mode: string
  slow_mode: boolean
  chatable_id: number
  followers_mode: boolean
  subscribers_mode: boolean
  emotes_mode: boolean
  message_interval: number
  following_min_duration: number
}

export interface AscendingLink {
  id: number
  channel_id: number
  description: string
  link: string
  created_at: string
  updated_at: string
  order: number
  title: string
}

export interface Plan {
  id: number
  channel_id: number
  stripe_plan_id: string
  amount: string
  created_at: string
  updated_at: string
}

export interface Livestream {
  id: number
  slug: string
  channel_id: number
  channel?: Channel
  created_at: string
  session_title: string
  is_live: boolean
  risk_level_id: any
  start_time: string
  source: any
  twitch_channel: any
  duration: number
  language: string
  is_mature: boolean
  viewer_count: number
  thumbnail: Thumbnail
  views: number
  tags: any[]
  categories: Category2[]
  video: Video
}

export interface Channel {
  id: number
  user_id: number
  slug: string
  is_banned: boolean
  playback_url: string
  name_updated_at: any
  vod_enabled: boolean
  subscription_enabled: boolean
  followersCount: number
  user: User
  can_host: boolean
  verified: Verified
}

export interface Thumbnail {
  src: string
  srcset: string
}

export interface Category2 {
  id: number
  category_id: number
  name: string
  slug: string
  tags: string[]
  description: string
  deleted_at: any
  viewers: number
  banner: Banner2
  category: Category3
}

export interface Banner2 {
  responsive: string
  url: string
}

export interface Category3 {
  id: number
  name: string
  slug: string
  icon: string
}

export interface Video {
  id: number
  live_stream_id: number
  slug: string
  thumb: string
  s3: string
  trading_platform_id: number
  created_at: string
  updated_at: string
  uuid: string
  views: number
  source?: string
  created_at?: string
  livestream?: Livestream
  deleted_at: string
}

export interface Verified {
  id: number
  channel_id: number
  created_at: string
  updated_at: string
}

export interface Medum {
  id: number
  model_type: string
  model_id: number
  collection_name: string
  name: string
  file_name: string
  mime_type: string
  disk: string
  size: number
  manipulations: any[]
  custom_properties: CustomProperties
  responsive_images: any[]
  order_column: number
  created_at: string
  updated_at: string
  uuid: string
  conversions_disk: string
}

export interface CustomProperties {
  generated_conversions: GeneratedConversions
}

export interface GeneratedConversions {
  fullsize: boolean
  medium: boolean
}

export interface Recent {
  id: string
  uuid: string
  title: string
  duration: string
  thumbnail: string
  streamer: string
  streamerSlug: string
  progress: number
  source: string
  date: string
}

export interface StreamerInfo {
  id: number
  name: string
  profile_image_url: string
  banner_image_url: string
}

export interface VideoProgress {
  id: string
  userId: string
  videoId: string
  progress: number
  createdAt: string
}

export interface Follow {
  id: number
  user: string
  streamer: string
  createdAt: string
}
