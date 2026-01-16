export interface NeonAuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface NeonAuthSession {
  id: string
  userId: string
  expiresAt: string
  token: string
  createdAt: string
  updatedAt: string
}

export interface NeonAuthResponse {
  user: NeonAuthUser
  session: NeonAuthSession
}

export interface SignUpCredentials {
  email: string
  password: string
  name?: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

declare module 'h3' {
  interface H3EventContext {
    neonAuth?: NeonAuthResponse
  }
}
