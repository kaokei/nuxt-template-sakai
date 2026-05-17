/** 登录请求参数 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 登录响应数据 */
export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** 认证状态 */
export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

/** 认证用户信息 */
export interface AuthUser {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  permissions: string[];
}
