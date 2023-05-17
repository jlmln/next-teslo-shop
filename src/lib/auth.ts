import { jwtVerify, SignJWT } from "jose"

interface UserJwtPayload {
  jti: string,
  iat: number
}

export const verifyAuth = async(token: string) => {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED))
    return verified.payload as UserJwtPayload
  } catch (error) {
    return false
  }
}