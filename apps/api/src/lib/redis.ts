import Redis from 'ioredis'

const url = process.env.REDIS_URL || 'redis://localhost:6379'
export const redis = new Redis(url)

export async function storeRefreshToken(jti: string, userId: string, ttlSeconds = 60 * 60 * 24 * 7) {
  await redis.set(`rt:${jti}`, userId, 'EX', ttlSeconds)
}

export async function revokeRefreshToken(jti: string) {
  await redis.del(`rt:${jti}`)
}

export async function isRefreshTokenActive(jti: string) {
  const v = await redis.get(`rt:${jti}`)
  return Boolean(v)
}


